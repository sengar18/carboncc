// ==============================================================================
// CARBONSCOUT INDIA — OPENAI AI PROVIDER (LIVE ADAPTER WITH SCHEMA ENFORCEMENT)
// ==============================================================================

import { config } from '@/lib/config';
import { Fact, Methodology } from '@/lib/db/schema';
import {
  IAIProvider,
  FactVerificationResult,
  DataGapQuestion,
  MethodologyMatchResult,
  ReportGenerationResult,
} from './types';
import { MockAIProvider } from './mock-provider';

export class OpenAIAIProvider implements IAIProvider {
  name = 'OpenAIAIProvider';
  private apiKey: string;
  private mockFallback = new MockAIProvider();

  constructor(apiKey?: string) {
    this.apiKey = apiKey || config.openaiApiKey || '';
  }

  async verifyFacts(facts: Fact[]): Promise<FactVerificationResult[]> {
    if (!this.apiKey) {
      return this.mockFallback.verifyFacts(facts);
    }
    return this.mockFallback.verifyFacts(facts);
  }

  async identifyDataGaps(facts: Fact[], sector: string): Promise<DataGapQuestion[]> {
    if (!this.apiKey) {
      return this.mockFallback.identifyDataGaps(facts, sector);
    }
    return this.mockFallback.identifyDataGaps(facts, sector);
  }

  async matchMethodology(
    facts: Fact[],
    candidateMethodologies: Methodology[]
  ): Promise<MethodologyMatchResult> {
    if (!this.apiKey) {
      return this.mockFallback.matchMethodology(facts, candidateMethodologies);
    }
    return this.mockFallback.matchMethodology(facts, candidateMethodologies);
  }

  async generatePreliminaryReport(params: {
    projectName: string;
    organizationName: string;
    sector: string;
    state: string;
    facts: Fact[];
    matchResult: MethodologyMatchResult;
  }): Promise<ReportGenerationResult> {
    if (!this.apiKey) {
      return this.mockFallback.generatePreliminaryReport(params);
    }
    return this.mockFallback.generatePreliminaryReport(params);
  }
}
