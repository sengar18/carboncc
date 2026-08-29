// ==============================================================================
// CARBONSCOUT INDIA — MOCK AI PROVIDER (ZERO-CREDIT DETERMINISTIC INTELLIGENCE)
// ==============================================================================

import { Fact, Methodology } from '@/lib/db/schema';
import {
  IAIProvider,
  FactVerificationResult,
  DataGapQuestion,
  MethodologyMatchResult,
  ReportGenerationResult,
} from './types';

export class MockAIProvider implements IAIProvider {
  name = 'MockAIProvider';

  async verifyFacts(facts: Fact[]): Promise<FactVerificationResult[]> {
    return facts.map((fact) => {
      // Preserve explicit user input and authoritative web citations
      if (fact.source_url && fact.source_citation) {
        return {
          factId: fact.id,
          assignedStatus: fact.status === 'UNVERIFIED' ? 'VERIFIED' : fact.status,
          confidence: fact.confidence || 0.9,
          reasoning: `Fact supported by source reference at ${fact.source_url}.`,
          auditCaveat: undefined,
        };
      }
      return {
        factId: fact.id,
        assignedStatus: fact.status || 'UNVERIFIED',
        confidence: 0.7,
        reasoning: 'Self-reported by user without external source document corroboration.',
        auditCaveat: 'Requires documentary verification (e.g. weighbridge slip or electricity bill).',
      };
    });
  }

  async identifyDataGaps(facts: Fact[], sector: string): Promise<DataGapQuestion[]> {
    return [
      {
        key: 'ANNUAL_BIOMASS_RESIDUE_MT',
        questionText: 'What is your estimated annual surplus agricultural biomass residue (e.g. rice husk, bagasse, crop residue)?',
        explanation: 'Determines whether your project meets minimum feedstock threshold for captive bioenergy or pelleting.',
        inputType: 'NUMBER',
        suggestedUnit: 'MT/year',
        criticality: 'HIGH',
      },
      {
        key: 'GRID_CONNECTED_OR_CAPTIVE',
        questionText: 'Does your facility currently draw electricity from the state power DISCOM grid?',
        explanation: 'Needed to establish the baseline fossil-fuel electricity grid emission factor.',
        inputType: 'SELECT',
        options: ['Yes - Grid Connected', 'No - Fully Off-grid Diesel/Captive', 'Hybrid Grid + Diesel'],
        criticality: 'HIGH',
      },
      {
        key: 'PREEXISTING_CARBON_PROJECT',
        questionText: 'Is this facility registered under any other carbon crediting registry (e.g., Gold Standard, Verra, GCC)?',
        explanation: 'Mandatory additionality check. Double counting or pre-registration prohibits new project enrollment.',
        inputType: 'SELECT',
        options: ['No existing carbon project', 'Yes - active registered project', 'Previously explored but abandoned'],
        criticality: 'HIGH',
      },
      {
        key: 'ANNUAL_GRID_ELECTRICITY_MWH',
        questionText: 'What is your facility approximate annual grid electricity consumption in Megawatt-hours (MWh)?',
        explanation: 'Allows preliminary estimation of displaceable baseline emissions.',
        inputType: 'NUMBER',
        suggestedUnit: 'MWh/year',
        criticality: 'MEDIUM',
      },
    ];
  }

  async matchMethodology(
    facts: Fact[],
    candidateMethodologies: Methodology[]
  ): Promise<MethodologyMatchResult> {
    const biomassFact = facts.find((f) => f.fact_type.includes('BIOMASS') || f.fact_type.includes('HUSK'));
    const gridFact = facts.find((f) => f.fact_type.includes('GRID'));
    const preExistingFact = facts.find((f) => f.fact_type.includes('CARBON_PROJECT') || f.fact_type.includes('REGISTRATION'));

    const matchedConditions: string[] = [];
    const failedConditions: string[] = [];
    const missingConditions: string[] = [];

    // Check Sector
    matchedConditions.push('Facility operates in eligible agro-processing / bio-energy sector');

    // Check Biomass Quantity
    const biomassQty = biomassFact ? (biomassFact.value_numeric || parseFloat(biomassFact.value_raw) || 0) : 0;
    if (biomassFact && biomassQty >= 1000) {
      matchedConditions.push(`Verified/Estimated surplus biomass residue (${biomassQty} MT/yr) exceeds minimum threshold (1,000 MT/yr)`);
    } else if (biomassFact && biomassQty > 0 && biomassQty < 1000) {
      failedConditions.push(`Reported surplus biomass (${biomassQty} MT/yr) is below the minimum threshold of 1,000 MT/yr`);
    } else {
      missingConditions.push('Exact annual biomass residue tonnage not yet verified with weighbridge data');
    }

    // Check Grid Connection
    if (gridFact && (gridFact.value_raw.toLowerCase().includes('yes') || gridFact.value_raw.toLowerCase().includes('connected'))) {
      matchedConditions.push('Facility is connected to regional grid; qualifies for baseline grid electricity displacement');
    } else if (!gridFact) {
      missingConditions.push('Grid connectivity status unverified');
    }

    // Check Pre-existing carbon credits
    if (preExistingFact && (preExistingFact.value_raw.toLowerCase().includes('none') || preExistingFact.value_raw.toLowerCase().includes('no'))) {
      matchedConditions.push('No double counting: facility confirms zero active registered carbon credit projects');
    } else if (preExistingFact && preExistingFact.value_raw.toLowerCase().includes('yes')) {
      failedConditions.push('Ineligible: Pre-existing registered carbon credit project identified');
    }

    let matchStatus: 'MATCH' | 'POTENTIAL_MATCH' | 'MISMATCH' | 'INSUFFICIENT_INFORMATION' = 'POTENTIAL_MATCH';
    let opportunityScore = 78;
    let scoreCategory: 'HIGH_PRELIMINARY_POTENTIAL' | 'INVESTIGATE' | 'WEAK_OR_UNCERTAIN' | 'LOW_POTENTIAL' = 'INVESTIGATE';

    if (failedConditions.length > 0) {
      matchStatus = 'MISMATCH';
      opportunityScore = 35;
      scoreCategory = 'LOW_POTENTIAL';
    } else if (missingConditions.length > 1) {
      matchStatus = 'INSUFFICIENT_INFORMATION';
      opportunityScore = 52;
      scoreCategory = 'WEAK_OR_UNCERTAIN';
    } else if (biomassQty >= 5000) {
      matchStatus = 'MATCH';
      opportunityScore = 84;
      scoreCategory = 'HIGH_PRELIMINARY_POTENTIAL';
    }

    return {
      methodologyCode: 'BM EN01.003',
      methodologyName: 'Electricity and Heat Generation from Biomass',
      isSynthetic: false,
      matchStatus,
      matchedConditions,
      failedConditions,
      missingConditions,
      applicabilitySummary:
        'Preliminary alignment with official CCTS methodology BM EN01.003 (Electricity and Heat Generation from Biomass). Project shows evidence of substantial agro-residue generation and displaceable captive energy demand.',
      preliminaryOpportunityScore: opportunityScore,
      scoreCategory,
      scoreBreakdown: {
        methodology_fit: { score: 22, max: 25, rationale: 'Strong alignment with BM EN01.003 biomass energy displacement parameters' },
        data_availability: { score: 16, max: 20, rationale: 'Core operations and approximate feedstock volumes available' },
        project_scale: { score: 13, max: 15, rationale: 'High surplus biomass volume provides viable abatement density' },
        additionality_signal: { score: 12, max: 15, rationale: 'Grid displacement without prior carbon registry claims' },
        measurement_feasibility: { score: 8, max: 10, rationale: 'Standardized weighbridge receipts and meter logs feasible' },
        documentation: { score: 5, max: 10, rationale: 'Formal fuel purchase and billing ledgers pending collection' },
        commercial_potential: { score: 2, max: 5, rationale: 'UNKNOWN: Commercial pricing depends on market buyer terms' },
      },
      redFlags: [
        'Seasonal availability of feedstock must be factored into annualized run-rate',
        'Commercial revenue or credit issuance cannot be guaranteed at this stage',
      ],
      uncertaintyNotes:
        'Feedstock quantities are based on preliminary company statements and will require formal fuel metering audit before PDD submission.',
      nextSteps: [
        'Upload 12 months of certified electricity bills and weighbridge receipts',
        'Confirm captive boiler nameplate thermal efficiency',
        'Engage an accredited carbon project developer for feasibility validation',
      ],
    };
  }


  async generatePreliminaryReport(params: {
    projectName: string;
    organizationName: string;
    sector: string;
    state: string;
    facts: Fact[];
    matchResult: MethodologyMatchResult;
  }): Promise<ReportGenerationResult> {
    return {
      executiveSummary: `This preliminary opportunity intelligence report evaluates ${params.projectName} operated by ${params.organizationName} in ${params.state}, India. Based on available evidence, the facility demonstrates a preliminary opportunity score of ${params.matchResult.preliminaryOpportunityScore}/100 (${params.matchResult.scoreCategory.replace(/_/g, ' ')}).`,
      projectDescription: `${params.organizationName} operates in the ${params.sector} sector in ${params.state}. The opportunity under review focuses on agricultural biomass residue utilization and clean energy displacement.`,
      evidenceReviewedSummary: `Evaluated ${params.facts.length} extracted and user-provided facts, including industrial capacity, energy consumption parameters, and regulatory declarations.`,
      candidateMethodology: {
        code: params.matchResult.methodologyCode,
        name: params.matchResult.methodologyName,
        isSynthetic: params.matchResult.isSynthetic,
      },
      applicabilityAssessment: params.matchResult.applicabilitySummary,
      dataGaps: params.matchResult.missingConditions,
      redFlags: params.matchResult.redFlags,
      opportunityScore: params.matchResult.preliminaryOpportunityScore,
      scoreCategory: params.matchResult.scoreCategory,
      disclaimer:
        'DISCLAIMER: This report is a preliminary opportunity screening based on unverified or semi-verified initial evidence. It is NOT a certification, validation, registration, or guarantee of carbon credit issuance. Never use this preliminary score for financial collateral or commercial guarantees.',
      uncertaintyNotes: params.matchResult.uncertaintyNotes,
      recommendedNextSteps: params.matchResult.nextSteps,
    };
  }
}
