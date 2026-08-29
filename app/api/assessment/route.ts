// ==============================================================================
// CARBONSCOUT INDIA — ASSESSMENT INITIATION & LISTING API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db/memory-store';
import { getAIProvider } from '@/services/ai';
import { methodologyMatcher } from '@/services/methodology/matcher';
import { logAuditEvent } from '@/lib/audit';
import { Assessment, Question } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    const assessments = memoryStore.getAssessmentsByProjectId(projectId);
    return NextResponse.json({ assessments });
  }

  const allAssessments = Array.from(memoryStore.assessments.values());
  return NextResponse.json({ assessments: allAssessments });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, sector, userProvidedFacts } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required.' }, { status: 400 });
    }

    const project = memoryStore.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // Append any user provided facts to the store
    if (userProvidedFacts && Array.isArray(userProvidedFacts)) {
      for (const uf of userProvidedFacts) {
        const factId = `fact-user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        memoryStore.facts.set(factId, {
          id: factId,
          project_id: projectId,
          fact_type: uf.factType,
          value_raw: uf.valueRaw,
          value_numeric: uf.valueNumeric,
          unit: uf.unit,
          status: 'USER_PROVIDED',
          confidence: 1.0,
          source_citation: 'User direct input during wizard onboarding',
          extraction_timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    const facts = memoryStore.getFactsByProjectId(projectId);
    const aiProvider = getAIProvider();

    // 1. Identify Data Gaps
    const dataGaps = await aiProvider.identifyDataGaps(facts, project.sector);

    // 2. Determine initial methodology match
    const initialMatch = methodologyMatcher.matchBestMethodology(facts, project.sector);
    const methodologyId = initialMatch?.methodology
      ? `meth-${initialMatch.methodologyCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      : 'PENDING_MATCH';

    // 3. Create Assessment record
    const assessmentId = `asmt-${Date.now()}`;
    const assessment: Assessment = {
      id: assessmentId,
      project_id: projectId,
      methodology_id: methodologyId,
      status: 'DRAFT',
      opportunity_score: 0,
      score_category: 'WEAK_OR_UNCERTAIN',
      score_breakdown: {
        methodology_fit: { score: initialMatch?.status === 'MATCH' ? 20 : 0, max: 25, rationale: initialMatch ? `Matched ${initialMatch.methodologyCode}` : 'Initial match pending' },
        data_availability: { score: 0, max: 20, rationale: 'Pending question responses' },
        project_scale: { score: 0, max: 15, rationale: 'Pending' },
        additionality_signal: { score: 0, max: 15, rationale: 'Pending' },
        measurement_feasibility: { score: 0, max: 10, rationale: 'Pending' },
        documentation: { score: 0, max: 10, rationale: 'Pending' },
        commercial_potential: { score: 0, max: 5, rationale: 'Pending' },
      },
      applicability_summary: initialMatch?.summary || 'Assessment draft created. Please complete missing data questions.',
      red_flags: [],
      uncertainty_notes: 'Initial state.',
      next_steps: ['Answer missing data questions', 'Run preliminary assessment'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.assessments.set(assessmentId, assessment);

    // 3. Save Questions
    const createdQuestions: Question[] = [];
    for (const dg of dataGaps) {
      const qId = `q-${Date.now()}-${dg.key.toLowerCase()}`;
      const qRecord: Question = {
        id: qId,
        assessment_id: assessmentId,
        question_key: dg.key,
        question_text: dg.questionText,
        explanation: dg.explanation,
        input_type: dg.inputType,
        suggested_unit: dg.suggestedUnit,
        options: dg.options,
        is_answered: false,
        created_at: new Date().toISOString(),
      };
      memoryStore.questions.set(qId, qRecord);
      createdQuestions.push(qRecord);
    }

    await logAuditEvent({
      entityType: 'ASSESSMENT',
      entityId: assessmentId,
      action: 'ASSESSMENT_INITIALIZED',
      details: { questionsCount: createdQuestions.length },
    });

    return NextResponse.json({
      success: true,
      assessmentId,
      assessment,
      questions: createdQuestions,
    });
  } catch (error: any) {
    console.error('Create assessment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create assessment' }, { status: 500 });
  }
}
