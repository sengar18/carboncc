import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { getResearchProvider } from '@/services/research';
import { getAIProvider } from '@/services/ai';
import { methodologyMatcher } from '@/services/methodology/matcher';
import { calculationEngine } from '@/services/calculations/engine';
import { opportunityScoreEngine } from '@/services/scoring/engine';
import { EnvironmentalPathwayScreener } from '@/services/methodology/pathway-screener';
import { logAuditEvent } from '@/lib/audit';
import { Fact, Assessment, CalculationRun } from '@/lib/db/schema';

describe('Recruiter-Grade End-to-End Workflow & Rigor Validation', () => {
  it('Scenario 1: Full Valid Indian Enterprise Assessment (Biomass Cogeneration)', async () => {
    const orgId = crypto.randomUUID();
    const projectId = crypto.randomUUID();
    const asmtId = crypto.randomUUID();

    // 1. Create Organization & Project in DB
    const org = await db.createOrganization({
      id: orgId,
      name: 'Malwa Agro Industries Ltd.',
      industry_sector: 'Biomass Energy / Cogeneration',
      state: 'Punjab',
      website: 'https://malwa-agro.example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    expect(org.id).toBe(orgId);

    const project = await db.createProject({
      id: projectId,
      organization_id: orgId,
      title: 'Malwa Agro 10MW Captive Biomass Boiler & Cogeneration Facility',
      sector: 'Biomass Energy / Cogeneration',
      location_state: 'Punjab',
      existing_carbon_credit_project: false,
      pipeline_status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    expect(project.id).toBe(projectId);

    // 2. Discover Research Facts via Research Provider
    const researchProvider = getResearchProvider('mock');
    const research = await researchProvider.researchCompany('Malwa Agro Industries', 'https://malwa-agro.example.com', 'Punjab');
    expect(research.sources.length).toBeGreaterThan(0);
    expect(research.extractedFacts.length).toBeGreaterThan(0);

    // Persist discovered facts
    for (const ef of research.extractedFacts) {
      await db.createFact({
        id: crypto.randomUUID(),
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

    // 3. User provides verified operating parameters & Gazette applicability criteria
    await db.createFact({
      id: crypto.randomUUID(),
      project_id: projectId,
      fact_type: 'BIOMASS_FEEDSTOCK_QUANTITY_MT',
      value_raw: '12000',
      value_numeric: 12000,
      unit: 'MT/year',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: 'Annual fuel supply contract and weighbridge logs',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await db.createFact({
      id: crypto.randomUUID(),
      project_id: projectId,
      fact_type: 'NET_ELECTRICITY_GENERATION_MWH',
      value_raw: '4800',
      value_numeric: 4800,
      unit: 'MWh/year',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: 'Energy generation telemetry and DISCOM import/export meter',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await db.createFact({
      id: crypto.randomUUID(),
      project_id: projectId,
      fact_type: 'BIOMASS_FEEDSTOCK_ALLOWED',
      value_raw: 'true',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: '100% agricultural residue feedstock confirmation',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await db.createFact({
      id: crypto.randomUUID(),
      project_id: projectId,
      fact_type: 'FOSSIL_COFIRING_RATIO',
      value_raw: '0',
      value_numeric: 0,
      unit: '%',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: 'Zero fossil fuel co-firing logbook',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await db.createFact({
      id: crypto.randomUUID(),
      project_id: projectId,
      fact_type: 'BIOMASS_STORAGE_PERIOD_YEARS',
      value_raw: '0.5',
      value_numeric: 0.5,
      unit: 'years',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: 'Fuel yard inventory turnover record',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await db.createFact({
      id: crypto.randomUUID(),
      project_id: projectId,
      fact_type: 'NO_PRIOR_CHEMICAL_BIOLOGICAL_TREATMENT',
      value_raw: 'true',
      status: 'USER_PROVIDED',
      confidence: 1.0,
      source_citation: 'Direct mechanical briquetting with no chemical additives',
      extraction_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const allFacts = await db.getFactsByProjectId(projectId);
    expect(allFacts.length).toBeGreaterThanOrEqual(8);

    // 4. Official Methodology Matching
    const match = methodologyMatcher.matchBestMethodology(allFacts, 'Biomass Energy / Cogeneration');
    expect(match).not.toBeNull();
    expect(match?.methodologyCode).toBe('BM EN01.003');
    expect(match?.status).toBe('MATCH');

    // 5. Deterministic Calculation (Matching BM EN01.003 Equation 15)
    const calcInputs = allFacts.map((f) => ({
      key: f.fact_type,
      label: f.fact_type,
      valueRaw: f.value_numeric !== undefined ? f.value_numeric : f.value_raw,
      unit: f.unit,
      isMandatory: true,
    }));
    const calcResult = calculationEngine.calculate('BM EN01.003', calcInputs);
    expect(calcResult.status).toBe('SUCCESS');
    expect(calcResult.outputs.estimatedAnnualAbatement_tCO2e).toBeGreaterThan(0);
    expect(typeof calcResult.outputs.estimatedAnnualAbatement_tCO2e).toBe('number');
    expect(calcResult.isSynthetic).toBe(false);

    // 6. 100-Point Scoring Engine
    const score = opportunityScoreEngine.calculateScore({
      sector: 'Biomass Energy / Cogeneration',
      isEligibleSector: true,
      feedstockOrScaleNumeric: 12000,
      feedstockUnit: 'MT/year',
      hasGridOrFossilBaseline: true,
      hasPriorCarbonProjects: false,
      factsCount: allFacts.length,
      verifiedFactsCount: allFacts.filter((f) => f.status === 'VERIFIED' || f.status === 'USER_PROVIDED').length,
      hasElectricityBillsOrLogs: true,
      commercialPotentialEvidence: 'Offsets peak industrial tariff (~INR 8.20/kWh)',
    });
    expect(score.totalScore).toBeGreaterThanOrEqual(70);
    expect(['HIGH_PRELIMINARY_POTENTIAL', 'INVESTIGATE']).toContain(score.category);

    // 7. Environmental Pathway Screening (Phase 9)
    const pathways = EnvironmentalPathwayScreener.screenPathways('Biomass Energy / Cogeneration', 'Punjab', allFacts);
    expect(pathways.pathways.length).toBe(4);
    expect(pathways.disclaimer).toContain('Indicative screening');
    const cctsPathway = pathways.pathways.find((p) => p.pathwayId === 'ccts');
    expect(cctsPathway?.status).toBe('HIGH_APPLICABILITY');

    // 8. Create and Persist Assessment
    const asmt = await db.createAssessment({
      id: asmtId,
      project_id: projectId,
      methodology_id: 'meth-bm-en01-003',
      status: 'COMPLETED',
      opportunity_score: score.totalScore,
      score_category: score.category,
      score_breakdown: score.breakdown,
      applicability_summary: match?.summary || '',
      red_flags: [],
      uncertainty_notes: 'Preliminary assessment based on operating records.',
      next_steps: ['Submit validation dossier to Accredited Carbon Verification Agency (ACVA)'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    expect(asmt.id).toBe(asmtId);

    // 9. Verify Retrieval
    const fetchedAsmt = await db.getAssessmentById(asmtId);
    expect(fetchedAsmt?.opportunity_score).toBe(score.totalScore);
  });

  it('Scenario 2: Negative Case (Unsupported Activity Sector)', async () => {
    const unmappedSector = 'Cryptocurrency Mining Facility';
    const fakeFacts: Fact[] = [
      {
        id: 'fact-crypto-01',
        project_id: 'proj-crypto-01',
        fact_type: 'SERVER_COUNT',
        value_raw: '500 ASICs',
        status: 'USER_PROVIDED',
        confidence: 1.0,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Sector has no official CCTS Gazette methodology -> returns null
    const match = methodologyMatcher.matchBestMethodology(fakeFacts, unmappedSector);
    expect(match).toBeNull();

    // Calculation should safely yield null and NOT invent numbers
    const calc = calculationEngine.calculate('UNKNOWN_SECTOR', []);
    expect(calc.outputs.estimatedAnnualAbatement_tCO2e).toBeNull();
    expect(calc.status).toBe('CALCULATION_UNAVAILABLE');
  });

  it('Scenario 3: Missing Required Input Case (No Fake Calculation Allowed)', () => {
    // Calling calculation engine for BM EN01.003 without the mandatory generation parameter
    const incompleteInputs = [
      {
        key: 'SOME_IRRELEVANT_PARAM',
        label: 'Irrelevant Param',
        valueRaw: '123',
        isMandatory: true,
      },
    ];

    const result = calculationEngine.calculate('BM EN01.003', incompleteInputs);
    expect(result.status).toBe('CALCULATION_UNAVAILABLE');
    expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBeNull();
    expect((result.missingInputs || []).length).toBeGreaterThan(0);
  });

  it('Scenario 4: Multi-Attribute Environmental Pathway Screening Integrity', () => {
    const solarFacts: Fact[] = [
      {
        id: 'fact-solar-01',
        project_id: 'proj-solar-01',
        fact_type: 'SOLAR_CAPACITY_MW',
        value_raw: '25',
        value_numeric: 25,
        unit: 'MW',
        status: 'VERIFIED',
        confidence: 0.95,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const screening = EnvironmentalPathwayScreener.screenPathways('Renewable Energy', 'Rajasthan', solarFacts);
    expect(screening.primarySector).toBe('Renewable Energy');
    expect(screening.disclaimer).toBe('Indicative screening — not a certification determination.');
    
    // I-REC and CCTS should both be highly applicable for Grid RE in Rajasthan
    const irec = screening.pathways.find((p) => p.pathwayId === 'irec');
    expect(irec).toBeDefined();
    expect(['HIGH_APPLICABILITY', 'POTENTIALLY_SUITABLE']).toContain(irec?.status);
  });
});
