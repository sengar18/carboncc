// ==============================================================================
// CARBONSCOUT INDIA — OPPORTUNITY SCORING TYPES
// ==============================================================================

import { OpportunityScoreCategory, ScoreBreakdown } from '@/lib/db/schema';

export interface OpportunityScoreInput {
  sector: string;
  isEligibleSector: boolean;
  feedstockOrScaleNumeric?: number;
  feedstockUnit?: string;
  hasGridOrFossilBaseline: boolean;
  hasPriorCarbonProjects: boolean;
  factsCount: number;
  verifiedFactsCount: number;
  hasElectricityBillsOrLogs: boolean;
  commercialPotentialEvidence?: string;
}

export interface OpportunityScoreResult {
  totalScore: number; // 0 to 100
  category: OpportunityScoreCategory;
  categoryLabel: string;
  breakdown: ScoreBreakdown;
  reasons: string[];
  warnings: string[];
  disclaimer: string;
}
