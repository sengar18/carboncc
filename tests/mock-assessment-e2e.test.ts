import { describe, it, expect } from 'vitest';
import { memoryStore } from '@/lib/db/memory-store';
import { getResearchProvider } from '@/services/research';
import { getAIProvider } from '@/services/ai';
import { methodologyMatcher } from '@/services/methodology/matcher';
import { calculationEngine } from '@/services/calculations/engine';
import { opportunityScoreEngine } from '@/services/scoring/engine';
import { logAuditEvent } from '@/lib/audit';
import { Fact, Assessment, CalculationRun } from '@/lib/db/schema';

describe('End-to-End Mock Assessment Loop', () => {
  it('should execute the full 9-step mock assessment workflow deterministically against official CCTS methodology', async () => {
    const projectId = 'proj-e2e-test-001';
    const orgId = 'org-e2e-test-001';

    // Step 1 & 2: Create Organization & Project
    memoryStore.organizations.set(orgId, {
      id: orgId,
      name: 'Doaba Agro Processing Industries',
      industry_sector: 'Biomass Energy / Cogeneration',
      state: 'Punjab',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    memoryStore.projects.set(projectId, {
      id: projectId,
      organization_id: orgId,
      title: 'Doaba Agro Captive Bio-Energy Facility',
      sector: 'Biomass Energy / Cogeneration',
      location_state: 'Punjab',
      existing_carbon_credit_project: false,
      pipeline_status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await logAuditEvent({
      entityType: 'PROJECT',
      entityId: projectId,
      action: 'PROJECT_CREATED',
      details: { title: 'Doaba Agro Captive Bio-Energy Facility' },
    });

    // Step 3: Run Research
    const researchProvider = getResearchProvider();
    const research = await researchProvider.researchCompany('Doaba Agro', undefined, 'Punjab');
    expect(research.sources.length).toBeGreaterThan(0);
    expect(research.extractedFacts.length).toBeGreaterThan(0);

    // Save facts into store
    for (const ef of research.extractedFacts) {
      const factId = `fact-${crypto.randomUUID()}`;
      memoryStore.facts.set(factId, {
        id: factId,
        project_id: projectId,
        fact_type: ef.factType,
        value_raw: ef.valueRaw,
        value_numeric: ef.valueNumeric,
        unit: ef.unit,
        status: ef.status,
        confidence: ef.confidence,
        source_citation: ef.sourceCitation,
        source_url: ef.sourceUrl,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Step 4: Verify facts in store
    const initialFacts = memoryStore.getFactsByProjectId(projectId);
    expect(initialFacts.length).toBe(research.extractedFacts.length);

    // Step 5 & 6: Identify Data Gaps
    const aiProvider = getAIProvider();
    const dataGaps = await aiProvider.identifyDataGaps(initialFacts, 'Biomass Energy / Cogeneration');
    expect(dataGaps.length).toBeGreaterThan(0);

    // Step 7: Answer Questions / Provide missing data
    const answeredBiomassMT = 8500;
    const answeredFactId = `fact-biomass-${Date.now()}`;
    memoryStore.facts.set(answeredFactId, {
      id: answeredFactId,
      project_id: projectId,
      fact_type: 'ANNUAL_BIOMASS_RESIDUE_MT',
      value_raw: '8500',
      value_numeric: answeredBiomassMT,
      unit: 'MT/year',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: 'Direct response during onboarding question workflow',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const answeredEnergyId = `fact-energy-${Date.now()}`;
    memoryStore.facts.set(answeredEnergyId, {
      id: answeredEnergyId,
      project_id: projectId,
      fact_type: 'NET_ELECTRICITY_GENERATION_MWH',
      value_raw: '10200',
      value_numeric: 10200,
      unit: 'MWh/year',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: 'Annual meter readings logbook',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const allUpdatedFacts = memoryStore.getFactsByProjectId(projectId);

    // Step 8: Methodology Matcher & Deterministic Calculations
    const matchSummary = methodologyMatcher.matchBestMethodology(allUpdatedFacts, 'Biomass Energy / Cogeneration');
    expect(matchSummary).toBeDefined();
    expect(matchSummary?.methodologyCode).toBe('BM EN01.003');

    const calcInputs = allUpdatedFacts.map((f) => ({
      key: f.fact_type,
      label: f.fact_type,
      valueRaw: f.value_numeric !== undefined ? f.value_numeric : f.value_raw,
      unit: f.unit,
      isMandatory: true,
    }));

    const calcResult = calculationEngine.calculate('BM EN01.003', calcInputs);
    expect(calcResult.status).toBe('SUCCESS');
    expect(calcResult.outputs.estimatedAnnualAbatement_tCO2e).toBeGreaterThan(5000);

    // Step 8b: Deterministic Opportunity Score
    const scoreResult = opportunityScoreEngine.calculateScore({
      sector: 'Biomass Energy / Cogeneration',
      isEligibleSector: true,
      feedstockOrScaleNumeric: answeredBiomassMT,
      feedstockUnit: 'MT/year',
      hasGridOrFossilBaseline: true,
      hasPriorCarbonProjects: false,
      factsCount: allUpdatedFacts.length,
      verifiedFactsCount: allUpdatedFacts.filter((f) => f.status === 'VERIFIED' || f.status === 'USER_PROVIDED').length,
      hasElectricityBillsOrLogs: true,
      commercialPotentialEvidence: 'Displaces grid power @ INR 7.20/kWh',
    });

    expect(scoreResult.totalScore).toBeGreaterThanOrEqual(75);
    expect(scoreResult.disclaimer).toContain('Preliminary opportunity score — not a prediction of carbon-credit issuance');

    // Step 9: Generate Preliminary Report
    const aiMatch = await aiProvider.matchMethodology(allUpdatedFacts, memoryStore.getMethodologies());
    const report = await aiProvider.generatePreliminaryReport({
      projectName: 'Doaba Agro Captive Bio-Energy Facility',
      organizationName: 'Doaba Agro Processing Industries',
      sector: 'Biomass Energy / Cogeneration',
      state: 'Punjab',
      facts: allUpdatedFacts,
      matchResult: aiMatch,
    });

    expect(report.candidateMethodology).toBeDefined();
    expect(report.candidateMethodology.code).toBe('BM EN01.003');
    expect(report.recommendedNextSteps.length).toBeGreaterThan(0);

    // Save assessment record & update CRM status
    const asmtId = 'asmt-e2e-001';
    const assessmentRecord: Assessment = {
      id: asmtId,
      project_id: projectId,
      methodology_id: 'meth-bm-en01-003',
      status: 'COMPLETED',
      opportunity_score: scoreResult.totalScore,
      score_category: scoreResult.category,
      score_breakdown: scoreResult.breakdown,
      applicability_summary: matchSummary?.summary || '',
      red_flags: report.redFlags,
      uncertainty_notes: report.uncertaintyNotes,
      next_steps: report.recommendedNextSteps,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.assessments.set(asmtId, assessmentRecord);

    const projectRecord = memoryStore.getProjectById(projectId);
    projectRecord!.pipeline_status = 'QUALIFIED';

    await logAuditEvent({
      entityType: 'ASSESSMENT',
      entityId: asmtId,
      action: 'ASSESSMENT_COMPLETED',
      details: { score: scoreResult.totalScore },
    });

    // Verify CRM pipeline reflection
    expect(projectRecord?.pipeline_status).toBe('QUALIFIED');
    const projectAuditLogs = memoryStore.getAuditLogs('PROJECT', projectId);
    expect(projectAuditLogs.length).toBeGreaterThanOrEqual(1);
  });
});
