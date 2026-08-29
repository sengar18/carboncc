import { describe, it, expect } from 'vitest';
import { OpportunityScoreEngine } from '@/services/scoring/engine';

describe('Opportunity Scoring Engine (100-Point Framework)', () => {
  const engine = new OpportunityScoreEngine();

  it('should score a high potential prospect with verified facts and strong baseline', () => {
    const result = engine.calculateScore({
      sector: 'Rice / Food Processing',
      isEligibleSector: true,
      feedstockOrScaleNumeric: 12000,
      feedstockUnit: 'MT/year',
      hasGridOrFossilBaseline: true,
      hasPriorCarbonProjects: false,
      factsCount: 8,
      verifiedFactsCount: 4,
      hasElectricityBillsOrLogs: true,
      commercialPotentialEvidence: 'Offsets grid electricity tariff @ INR 7.50/kWh',
    });

    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(result.category).toBe('HIGH_PRELIMINARY_POTENTIAL');
    expect(result.disclaimer).toContain('Preliminary opportunity score — not a prediction of carbon-credit issuance');
    expect(result.breakdown.methodology_fit.score).toBe(25);
    expect(result.breakdown.project_scale.score).toBe(15);
  });

  it('should heavily penalize additionality if prior carbon credits exist (double counting risk)', () => {
    const result = engine.calculateScore({
      sector: 'Rice / Food Processing',
      isEligibleSector: true,
      feedstockOrScaleNumeric: 12000,
      feedstockUnit: 'MT/year',
      hasGridOrFossilBaseline: true,
      hasPriorCarbonProjects: true, // Prior project registered
      factsCount: 8,
      verifiedFactsCount: 4,
      hasElectricityBillsOrLogs: true,
    });

    expect(result.breakdown.additionality_signal.score).toBe(0);
    expect(result.warnings.some((w) => w.includes('Pre-existing registered carbon credit project'))).toBe(true);
  });

  it('should mark commercial potential as UNKNOWN (0 points) if unsupported by verifiable evidence', () => {
    const result = engine.calculateScore({
      sector: 'Rice / Food Processing',
      isEligibleSector: true,
      feedstockOrScaleNumeric: 2000,
      feedstockUnit: 'MT/year',
      hasGridOrFossilBaseline: true,
      hasPriorCarbonProjects: false,
      factsCount: 4,
      verifiedFactsCount: 1,
      hasElectricityBillsOrLogs: false,
      // No commercial evidence provided
    });

    expect(result.breakdown.commercial_potential.score).toBe(0);
    expect(result.breakdown.commercial_potential.rationale).toContain('UNKNOWN');
  });
});
