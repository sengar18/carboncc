// ==============================================================================
// CARBONSCOUT INDIA — ASSESSMENT DETAIL, EXECUTION & REPORT API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db/memory-store';
import { methodologyMatcher } from '@/services/methodology/matcher';
import { calculationEngine, CalculationResult } from '@/services/calculations/engine';
import { opportunityScoreEngine } from '@/services/scoring/engine';
import { getAIProvider } from '@/services/ai';
import { logAuditEvent } from '@/lib/audit';
import { CalculationRun, Fact } from '@/lib/db/schema';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = memoryStore.assessments.get(id);

  if (!assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
  }

  const project = memoryStore.getProjectById(assessment.project_id);
  const organization = project ? memoryStore.getOrganizationById(project.organization_id) : undefined;
  const facts = memoryStore.getFactsByProjectId(assessment.project_id);
  const sources = memoryStore.getSourcesByProjectId(assessment.project_id);
  const questions = memoryStore.getQuestionsByAssessmentId(id);
  const calculationRuns = memoryStore.getCalculationRunsByAssessmentId(id);
  const documents = memoryStore.getDocumentsByProjectId(assessment.project_id);

  return NextResponse.json({
    assessment,
    project,
    organization,
    facts,
    sources,
    questions,
    calculationRuns,
    documents,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { answers } = body; // Map of question_key -> user_response

    const assessment = memoryStore.assessments.get(id);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const project = memoryStore.getProjectById(assessment.project_id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const organization = memoryStore.getOrganizationById(project.organization_id);

    // 1. Process and record question answers as USER_PROVIDED facts
    if (answers && typeof answers === 'object') {
      const existingQuestions = memoryStore.getQuestionsByAssessmentId(id);

      for (const [key, responseValue] of Object.entries(answers)) {
        const valStr = String(responseValue);
        // Mark question answered
        const question = existingQuestions.find((q) => q.question_key === key);
        if (question) {
          question.user_response = valStr;
          question.is_answered = true;
          question.answered_at = new Date().toISOString();
        }

        // Create or update fact
        const existingFact = Array.from(memoryStore.facts.values()).find(
          (f) => f.project_id === project.id && f.fact_type === key
        );

        const numVal = parseFloat(valStr.replace(/[^0-9.]/g, ''));
        if (existingFact) {
          existingFact.value_raw = valStr;
          if (!isNaN(numVal)) existingFact.value_numeric = numVal;
          existingFact.status = 'USER_PROVIDED';
          existingFact.confidence = 1.0;
          existingFact.updated_at = new Date().toISOString();
        } else {
          const factId = `fact-ans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          memoryStore.facts.set(factId, {
            id: factId,
            project_id: project.id,
            fact_type: key,
            value_raw: valStr,
            value_numeric: isNaN(numVal) ? undefined : numVal,
            status: 'USER_PROVIDED',
            confidence: 1.0,
            source_citation: 'Direct response to assessment data gap question',
            extraction_timestamp: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }

    // 2. Fetch updated facts
    const facts = memoryStore.getFactsByProjectId(project.id);

    // 3. Run Methodology Matcher
    const matchSummary = methodologyMatcher.matchBestMethodology(facts, project.sector);
    const matchedMethodologyCode = matchSummary?.methodologyCode;

    let calcResult: CalculationResult;
    let methodologyId: string;

    if (matchedMethodologyCode) {
      methodologyId = `meth-${matchedMethodologyCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const calcInputs = facts.map((f) => ({
        key: f.fact_type,
        label: f.fact_type,
        valueRaw: f.value_numeric !== undefined ? f.value_numeric : f.value_raw,
        unit: f.unit,
        isMandatory: true,
      }));
      calcResult = calculationEngine.calculate(matchedMethodologyCode, calcInputs);
    } else {
      methodologyId = 'UNMATCHED';
      calcResult = {
        formulaId: 'FORMULA-NO-MATCH',
        methodologyCode: 'NO_MATCH',
        isSynthetic: false,
        status: 'CALCULATION_UNAVAILABLE',
        missingInputs: ['Applicable CCTS methodology match required before running calculations'],
        originalInputs: {},
        normalizedInputs: {},
        outputs: { estimatedAnnualAbatement_tCO2e: undefined },
        assumptions: ['No verified official methodology matched the provided project facts.'],
        explanation: 'Calculation skipped: No applicable CCTS methodology matched the project scope and facts.',
        executedAt: new Date().toISOString(),
      };
    }

    // Save Calculation Run Record
    const runId = `calc-run-${Date.now()}`;
    const runRecord: CalculationRun = {
      id: runId,
      assessment_id: id,
      methodology_id: methodologyId,
      formula_id: calcResult.formulaId,
      status: calcResult.status,
      inputs_snapshot: calcResult.originalInputs,
      normalized_inputs: calcResult.normalizedInputs,
      outputs_snapshot: calcResult.outputs,
      assumptions_log: calcResult.assumptions,
      calculation_explanation: calcResult.explanation,
      is_synthetic: calcResult.isSynthetic,
      executed_at: new Date().toISOString(),
    };
    memoryStore.calculationRuns.set(runId, runRecord);


    await logAuditEvent({
      entityType: 'CALCULATION_RUN',
      entityId: runId,
      action: 'CALCULATION_EXECUTED',
      details: {
        formulaId: calcResult.formulaId,
        status: calcResult.status,
        netAbatement: calcResult.outputs.estimatedAnnualAbatement_tCO2e,
      },
    });

    // 5. Calculate Deterministic Opportunity Score
    const biomassFact = facts.find((f) => f.fact_type.includes('BIOMASS') || f.fact_type.includes('HUSK'));
    const gridFact = facts.find((f) => f.fact_type.includes('GRID'));
    const priorProjectFact = facts.find((f) => f.fact_type.includes('PREEXISTING') || f.fact_type.includes('CARBON_PROJECT'));

    const scaleVal = biomassFact ? (biomassFact.value_numeric || parseFloat(biomassFact.value_raw) || 0) : 0;
    const hasGrid = gridFact ? !gridFact.value_raw.toLowerCase().includes('off-grid') : true;
    const hasPriorCredits = priorProjectFact ? priorProjectFact.value_raw.toLowerCase().includes('active') : false;
    const verifiedCount = facts.filter((f) => f.status === 'VERIFIED' || f.status === 'USER_PROVIDED').length;

    const scoreResult = opportunityScoreEngine.calculateScore({
      sector: project.sector,
      isEligibleSector: true,
      feedstockOrScaleNumeric: scaleVal,
      feedstockUnit: 'MT/year',
      hasGridOrFossilBaseline: hasGrid,
      hasPriorCarbonProjects: hasPriorCredits,
      factsCount: facts.length,
      verifiedFactsCount: verifiedCount,
      hasElectricityBillsOrLogs: true,
      commercialPotentialEvidence: 'Captive power generation offsets commercial retail grid tariff (~INR 7.50/kWh).',
    });

    // 6. Generate Preliminary Report with AI layer
    const aiProvider = getAIProvider();
    const aiMatchResult = await aiProvider.matchMethodology(facts, memoryStore.getMethodologies());
    const report = await aiProvider.generatePreliminaryReport({
      projectName: project.title,
      organizationName: organization?.name || 'Project Developer',
      sector: project.sector,
      state: project.location_state,
      facts,
      matchResult: aiMatchResult,
    });

    // 7. Update Assessment Record
    assessment.status = matchSummary?.status === 'MISMATCH' ? 'REJECTED' : 'COMPLETED';
    assessment.opportunity_score = scoreResult.totalScore;
    assessment.score_category = scoreResult.category;
    assessment.score_breakdown = scoreResult.breakdown;
    assessment.applicability_summary = matchSummary?.summary || report.applicabilityAssessment;
    assessment.red_flags = Array.from(new Set([...(matchSummary?.redFlags || []), ...report.redFlags]));
    assessment.uncertainty_notes = report.uncertaintyNotes;
    assessment.next_steps = report.recommendedNextSteps;
    assessment.updated_at = new Date().toISOString();

    // Update Project Status
    project.pipeline_status = scoreResult.totalScore >= 70 ? 'QUALIFIED' : 'ASSESSMENT';
    project.updated_at = new Date().toISOString();

    await logAuditEvent({
      entityType: 'ASSESSMENT',
      entityId: id,
      action: 'ASSESSMENT_COMPLETED',
      details: {
        score: scoreResult.totalScore,
        category: scoreResult.category,
      },
    });

    return NextResponse.json({
      success: true,
      assessment,
      calculationRun: runRecord,
      scoreResult,
      report,
      matchSummary,
    });
  } catch (error: any) {
    console.error('Execute assessment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute assessment' }, { status: 500 });
  }
}
