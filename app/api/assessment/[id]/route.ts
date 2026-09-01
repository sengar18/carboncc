// ==============================================================================
// CARBONSCOUT INDIA — ASSESSMENT DETAIL, EXECUTION & REPORT API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { methodologyMatcher } from '@/services/methodology/matcher';
import { calculationEngine, CalculationResult } from '@/services/calculations/engine';
import { opportunityScoreEngine } from '@/services/scoring/engine';
import { EnvironmentalPathwayScreener } from '@/services/methodology/pathway-screener';
import { getAIProvider, AIProviderName } from '@/services/ai';
import { logAuditEvent } from '@/lib/audit';
import { CalculationRun, Fact } from '@/lib/db/schema';
import { isValidUUID, generateUUID } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || !isValidUUID(id)) {
    return NextResponse.json({ error: 'Invalid assessment id' }, { status: 400 });
  }
  const assessment = await db.getAssessmentById(id);

  if (!assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
  }

  const project = await db.getProjectById(assessment.project_id);
  const organization = project ? await db.getOrganizationById(project.organization_id) : undefined;
  const facts = await db.getFactsByProjectId(assessment.project_id);
  const sources = await db.getSourcesByProjectId(assessment.project_id);
  const questions = await db.getQuestionsByAssessmentId(id);
  const calculationRuns = await db.getCalculationRunsByAssessmentId(id);
  const documents = await db.getDocumentsByProjectId(assessment.project_id);

  const pathwayScreening = project
    ? EnvironmentalPathwayScreener.screenPathways(project.sector, project.location_state, facts)
    : undefined;

  return NextResponse.json({
    assessment,
    project,
    organization,
    facts,
    sources,
    questions,
    calculationRuns,
    documents,
    pathwayScreening,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !isValidUUID(id)) {
      return NextResponse.json({ error: 'Invalid assessment id' }, { status: 400 });
    }
    const body = await req.json();
    const { answers } = body; // Map of question_key -> user_response

    // BYOK: optional per-request provider and API key from client headers
    const customProvider = (req.headers.get('x-llm-provider') || body.provider) as AIProviderName | undefined;
    const customApiKey = req.headers.get('x-custom-api-key') || body.apiKey || undefined;

    const assessment = await db.getAssessmentById(id);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const project = await db.getProjectById(assessment.project_id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const organization = await db.getOrganizationById(project.organization_id);

    // 1. Process and record question answers as USER_PROVIDED facts
    if (answers && typeof answers === 'object') {
      const existingQuestions = await db.getQuestionsByAssessmentId(id);

      for (const [key, responseValue] of Object.entries(answers)) {
        const valStr = String(responseValue);
        // Mark question answered
        const question = existingQuestions.find((q) => q.question_key === key);
        if (question) {
          await db.updateQuestion(question.id, {
            user_response: valStr,
            is_answered: true,
            answered_at: new Date().toISOString(),
          });
        }

        // Create or update fact
        const existingFacts = await db.getFactsByProjectId(project.id);
        const existingFact = existingFacts.find((f) => f.fact_type === key);

        const numVal = parseFloat(valStr.replace(/[^0-9.]/g, ''));
        if (existingFact) {
          await db.createFact({
            ...existingFact,
            value_raw: valStr,
            value_numeric: isNaN(numVal) ? undefined : numVal,
            status: 'USER_PROVIDED',
            confidence: 1.0,
            updated_at: new Date().toISOString(),
          });
        } else {
          const factId = generateUUID();
          await db.createFact({
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
    const facts = await db.getFactsByProjectId(project.id);

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
        outputs: { estimatedAnnualAbatement_tCO2e: null },
        assumptions: ['No verified official methodology matched the provided project facts.'],
        explanation: 'Calculation skipped: No applicable CCTS methodology matched the project scope and facts.',
        executedAt: new Date().toISOString(),
      };
    }

    // Save Calculation Run Record
    const runId = generateUUID();
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
      executed_at: calcResult.executedAt,
      provenance_citations: calcResult.provenanceCitations,
    };
    await db.createCalculationRun(runRecord);

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
    const biomassFact = facts.find((f) => f.fact_type.includes('BIOMASS') || f.fact_type.includes('HUSK') || f.fact_type.includes('CAPACITY'));
    const gridFact = facts.find((f) => f.fact_type.includes('GRID'));
    const priorProjectFact = facts.find((f) => f.fact_type.includes('PREEXISTING') || f.fact_type.includes('CARBON_PROJECT'));

    const scaleVal = biomassFact ? (biomassFact.value_numeric || parseFloat(biomassFact.value_raw) || 0) : 0;
    const hasGrid = gridFact ? !gridFact.value_raw.toLowerCase().includes('off-grid') : true;
    const hasPriorCredits = priorProjectFact ? priorProjectFact.value_raw.toLowerCase().includes('active') : false;
    const verifiedCount = facts.filter((f) => f.status === 'VERIFIED' || f.status === 'USER_PROVIDED').length;

    // Check actual eligibility from methodology match
    const isEligible = matchSummary ? (matchSummary.status === 'MATCH' || matchSummary.status === 'POTENTIAL_MATCH') : false;

    // Check actual documentation presence from project documents or facts
    const projectDocs = await db.getDocumentsByProjectId(project.id);
    const docFact = facts.find((f) => {
      const t = f.fact_type.toUpperCase();
      return t.includes('BILL') || t.includes('LOG') || t.includes('METER') || t.includes('INVOICE') || t.includes('WEIGHBRIDGE') || t.includes('DISCOM');
    });
    const hasBillsOrLogs = projectDocs.length > 0 || !!docFact;

    // Check actual commercial potential evidence from facts
    const commFact = facts.find((f) => {
      const t = f.fact_type.toUpperCase();
      return t.includes('TARIFF') || t.includes('OFFTAKE') || t.includes('COMMERCIAL') || t.includes('PPA') || t.includes('REVENUE') || t.includes('SAVINGS');
    });
    const commercialPotentialEvidence = commFact ? `${commFact.fact_type}: ${commFact.value_raw}` : undefined;

    const scoreResult = opportunityScoreEngine.calculateScore({
      sector: project.sector,
      isEligibleSector: isEligible,
      feedstockOrScaleNumeric: scaleVal,
      feedstockUnit: 'MT/year',
      hasGridOrFossilBaseline: hasGrid,
      hasPriorCarbonProjects: hasPriorCredits,
      factsCount: facts.length,
      verifiedFactsCount: verifiedCount,
      hasElectricityBillsOrLogs: hasBillsOrLogs,
      commercialPotentialEvidence,
    });

    // 6. Generate Preliminary Report with AI layer
    const aiProvider = getAIProvider(customProvider, customApiKey);
    const aiMatchResult = await aiProvider.matchMethodology(facts, db.getMethodologies());
    const report = await aiProvider.generatePreliminaryReport({
      projectName: project.title,
      organizationName: organization?.name || 'Project Developer',
      sector: project.sector,
      state: project.location_state,
      facts,
      matchResult: aiMatchResult,
    });

    // 7. Environmental Pathway Screening (Phase 9)
    const pathwayScreening = EnvironmentalPathwayScreener.screenPathways(
      project.sector,
      project.location_state,
      facts
    );

    // 8. Update Assessment Record
    const updatedAssessment = await db.updateAssessment(id, {
      status: matchSummary?.status === 'MISMATCH' ? 'REJECTED' : 'COMPLETED',
      opportunity_score: scoreResult.totalScore,
      score_category: scoreResult.category,
      score_breakdown: scoreResult.breakdown,
      applicability_summary: matchSummary?.summary || report.applicabilityAssessment,
      red_flags: Array.from(new Set([...(matchSummary?.redFlags || []), ...report.redFlags])),
      uncertainty_notes: report.uncertaintyNotes,
      next_steps: report.recommendedNextSteps,
      updated_at: new Date().toISOString(),
    });

    // Update Project Status
    await db.updateProject(project.id, {
      pipeline_status: scoreResult.totalScore >= 70 ? 'QUALIFIED' : 'ASSESSMENT',
      updated_at: new Date().toISOString(),
    });

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
      assessment: updatedAssessment || assessment,
      calculationRun: runRecord,
      scoreResult,
      report,
      matchSummary,
      pathwayScreening,
    });
  } catch (error) {
    console.error('Execute assessment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute assessment' },
      { status: 500 }
    );
  }
}
