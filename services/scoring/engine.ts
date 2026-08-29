// ==============================================================================
// CARBONSCOUT INDIA — DETERMINISTIC OPPORTUNITY SCORING ENGINE
// ==============================================================================

import { OpportunityScoreInput, OpportunityScoreResult } from './types';
import { OpportunityScoreCategory, ScoreBreakdown } from '@/lib/db/schema';

export class OpportunityScoreEngine {
  public static readonly DISCLAIMER =
    'Preliminary opportunity score — not a prediction of carbon-credit issuance, registration, or revenue.';

  /**
   * Calculates a 100-point deterministic opportunity screening score.
   */
  public calculateScore(input: OpportunityScoreInput): OpportunityScoreResult {
    const reasons: string[] = [];
    const warnings: string[] = [];

    // 1. Methodology Fit (Max 25)
    let methScore = 0;
    let methRationale = '';
    if (input.isEligibleSector) {
      methScore += 15;
      if (input.feedstockOrScaleNumeric && input.feedstockOrScaleNumeric >= 1000) {
        methScore += 10;
        methRationale = 'Sector aligns with established pathways and scale meets minimum threshold (25/25)';
      } else {
        methScore += 5;
        methRationale = 'Sector matches, but quantitative scale requires validation (20/25)';
      }
    } else {
      methScore = 5;
      methRationale = 'Sector is outside primary benchmark pathways (5/25)';
      warnings.push('Sector does not have immediate active test methodologies.');
    }

    // 2. Data Availability (Max 20)
    let dataScore = 0;
    let dataRationale = '';
    if (input.factsCount >= 5 && input.verifiedFactsCount >= 2) {
      dataScore = 18;
      dataRationale = `Strong data availability (${input.factsCount} facts identified, ${input.verifiedFactsCount} verified) (18/20)`;
    } else if (input.factsCount >= 3) {
      dataScore = 14;
      dataRationale = `Moderate data availability (${input.factsCount} facts captured) (14/20)`;
    } else {
      dataScore = 8;
      dataRationale = `Limited data availability (${input.factsCount} facts); multiple gaps present (8/20)`;
      warnings.push('Key operational data points are currently unverified or missing.');
    }

    // 3. Project Scale (Max 15)
    let scaleScore = 0;
    let scaleRationale = '';
    const scaleVal = input.feedstockOrScaleNumeric || 0;
    if (scaleVal >= 10000) {
      scaleScore = 15;
      scaleRationale = `Large commercial scale (${scaleVal.toLocaleString()} MT/yr) provides high abatement potential (15/15)`;
    } else if (scaleVal >= 5000) {
      scaleScore = 12;
      scaleRationale = `Medium-high industrial scale (${scaleVal.toLocaleString()} MT/yr) (12/15)`;
    } else if (scaleVal >= 1000) {
      scaleScore = 9;
      scaleRationale = `Viable minimum commercial scale (${scaleVal.toLocaleString()} MT/yr) (9/15)`;
    } else if (scaleVal > 0) {
      scaleScore = 4;
      scaleRationale = `Sub-scale or small batch processing volume (${scaleVal.toLocaleString()} MT/yr) (4/15)`;
      warnings.push('Feedstock scale may be too small for standalone carbon development transaction costs.');
    } else {
      scaleScore = 3;
      scaleRationale = 'Project scale unknown or unquantified (3/15)';
    }

    // 4. Additionality Signal (Max 15)
    let addScore = 0;
    let addRationale = '';
    if (input.hasPriorCarbonProjects) {
      addScore = 0;
      addRationale = 'CRITICAL RED FLAG: Active prior carbon project detected (0/15)';
      warnings.push('Pre-existing registered carbon credit project disqualifies additionality (double counting risk).');
    } else if (input.hasGridOrFossilBaseline) {
      addScore = 13;
      addRationale = 'Clear fossil displacement / grid baseline with zero prior credit registration (13/15)';
    } else {
      addScore = 6;
      addRationale = 'Baseline displacement mechanism unconfirmed (6/15)';
    }

    // 5. Measurement Feasibility (Max 10)
    let measScore = 0;
    let measRationale = '';
    if (input.isEligibleSector) {
      measScore = 8;
      measRationale = 'Feasible via standard calibrated weighbridge logs and DISCOM utility meters (8/10)';
    } else {
      measScore = 4;
      measRationale = 'Complex monitoring and sampling protocols required (4/10)';
    }

    // 6. Documentation (Max 10)
    let docScore = 0;
    let docRationale = '';
    if (input.hasElectricityBillsOrLogs) {
      docScore = 8;
      docRationale = 'Essential billing/production records indicated (8/10)';
    } else {
      docScore = 4;
      docRationale = 'Documentary records pending collection (4/10)';
    }

    // 7. Commercial Potential (Max 5)
    // Non-fabrication rule: If commercial potential cannot be supported by evidence, mark it UNKNOWN.
    let commScore = 0;
    let commRationale = '';
    if (input.commercialPotentialEvidence) {
      commScore = 3;
      commRationale = `Evidence noted: ${input.commercialPotentialEvidence} (3/5)`;
    } else {
      commScore = 0;
      commRationale = 'UNKNOWN: Market buyer off-take & credit pricing unverified (0/5)';
    }

    const totalScore = Math.min(
      100,
      Math.max(0, methScore + dataScore + scaleScore + addScore + measScore + docScore + commScore)
    );

    let category: OpportunityScoreCategory;
    let categoryLabel: string;

    if (totalScore >= 80) {
      category = 'HIGH_PRELIMINARY_POTENTIAL';
      categoryLabel = 'High Preliminary Potential';
      reasons.push('Demonstrates strong sector alignment, viable feedstock volume, and credible additionality baseline.');
    } else if (totalScore >= 65) {
      category = 'INVESTIGATE';
      categoryLabel = 'Investigate Further';
      reasons.push('Viable opportunity profile; resolving data gaps and uploading utility records recommended.');
    } else if (totalScore >= 45) {
      category = 'WEAK_OR_UNCERTAIN';
      categoryLabel = 'Weak or Uncertain';
      reasons.push('Significant data gaps or limited feedstock scale make feasibility uncertain at present.');
    } else {
      category = 'LOW_POTENTIAL';
      categoryLabel = 'Low Potential';
      reasons.push('Key eligibility conditions failed or project scale below viable economic thresholds.');
    }

    const breakdown: ScoreBreakdown = {
      methodology_fit: { score: methScore, max: 25, rationale: methRationale },
      data_availability: { score: dataScore, max: 20, rationale: dataRationale },
      project_scale: { score: scaleScore, max: 15, rationale: scaleRationale },
      additionality_signal: { score: addScore, max: 15, rationale: addRationale },
      measurement_feasibility: { score: measScore, max: 10, rationale: measRationale },
      documentation: { score: docScore, max: 10, rationale: docRationale },
      commercial_potential: { score: commScore, max: 5, rationale: commRationale },
    };

    return {
      totalScore,
      category,
      categoryLabel,
      breakdown,
      reasons,
      warnings,
      disclaimer: OpportunityScoreEngine.DISCLAIMER,
    };
  }
}

export const opportunityScoreEngine = new OpportunityScoreEngine();
