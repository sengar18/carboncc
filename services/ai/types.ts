// ==============================================================================
// CARBONSCOUT INDIA — AI ABSTRACTION LAYER TYPES & SCHEMAS
// ==============================================================================

import { z } from 'zod';
import { Fact, Methodology, OpportunityScoreCategory, ScoreBreakdown } from '@/lib/db/schema';

// 1. Fact Verification Schema
export const FactVerificationSchema = z.object({
  factId: z.string(),
  assignedStatus: z.enum(['VERIFIED', 'USER_PROVIDED', 'INFERRED', 'ESTIMATED', 'UNVERIFIED', 'UNKNOWN']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  auditCaveat: z.string().optional(),
});
export type FactVerificationResult = z.infer<typeof FactVerificationSchema>;

// 2. Data Gap Question Schema
export const DataGapQuestionSchema = z.object({
  key: z.string(),
  questionText: z.string(),
  explanation: z.string(),
  inputType: z.enum(['NUMBER', 'BOOLEAN', 'TEXT', 'SELECT']),
  suggestedUnit: z.string().optional(),
  options: z.array(z.string()).optional(),
  criticality: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});
export type DataGapQuestion = z.infer<typeof DataGapQuestionSchema>;

// 3. Methodology Match Schema
export const MethodologyMatchSchema = z.object({
  methodologyCode: z.string(),
  methodologyName: z.string(),
  isSynthetic: z.boolean(),
  matchStatus: z.enum(['MATCH', 'POTENTIAL_MATCH', 'MISMATCH', 'INSUFFICIENT_INFORMATION']),
  matchedConditions: z.array(z.string()),
  failedConditions: z.array(z.string()),
  missingConditions: z.array(z.string()),
  applicabilitySummary: z.string(),
  preliminaryOpportunityScore: z.number().min(0).max(100),
  scoreCategory: z.enum(['HIGH_PRELIMINARY_POTENTIAL', 'INVESTIGATE', 'WEAK_OR_UNCERTAIN', 'LOW_POTENTIAL']),
  scoreBreakdown: z.object({
    methodology_fit: z.object({ score: z.number(), max: z.number(), rationale: z.string() }),
    data_availability: z.object({ score: z.number(), max: z.number(), rationale: z.string() }),
    project_scale: z.object({ score: z.number(), max: z.number(), rationale: z.string() }),
    additionality_signal: z.object({ score: z.number(), max: z.number(), rationale: z.string() }),
    measurement_feasibility: z.object({ score: z.number(), max: z.number(), rationale: z.string() }),
    documentation: z.object({ score: z.number(), max: z.number(), rationale: z.string() }),
    commercial_potential: z.object({ score: z.number(), max: z.number(), rationale: z.string() }),
  }),
  redFlags: z.array(z.string()),
  uncertaintyNotes: z.string(),
  nextSteps: z.array(z.string()),
});
export type MethodologyMatchResult = z.infer<typeof MethodologyMatchSchema>;

// 4. Report Generation Schema
export const ReportGenerationSchema = z.object({
  executiveSummary: z.string(),
  projectDescription: z.string(),
  evidenceReviewedSummary: z.string(),
  candidateMethodology: z.object({
    code: z.string(),
    name: z.string(),
    isSynthetic: z.boolean(),
  }),
  applicabilityAssessment: z.string(),
  dataGaps: z.array(z.string()),
  redFlags: z.array(z.string()),
  opportunityScore: z.number(),
  scoreCategory: z.string(),
  disclaimer: z.string(),
  uncertaintyNotes: z.string(),
  recommendedNextSteps: z.array(z.string()),
});
export type ReportGenerationResult = z.infer<typeof ReportGenerationSchema>;

// AI Provider Interface
export interface IAIProvider {
  name: string;
  verifyFacts(facts: Fact[]): Promise<FactVerificationResult[]>;
  identifyDataGaps(facts: Fact[], sector: string): Promise<DataGapQuestion[]>;
  matchMethodology(
    facts: Fact[],
    candidateMethodologies: Methodology[]
  ): Promise<MethodologyMatchResult>;
  generatePreliminaryReport(params: {
    projectName: string;
    organizationName: string;
    sector: string;
    state: string;
    facts: Fact[];
    matchResult: MethodologyMatchResult;
  }): Promise<ReportGenerationResult>;
}
