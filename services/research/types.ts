// ==============================================================================
// CARBONSCOUT INDIA — RESEARCH LAYER TYPES & INTERFACES
// ==============================================================================

import { Fact, FactStatus, ResearchSource } from '@/lib/db/schema';

export interface RawResearchResult {
  url: string;
  title: string;
  content: string;
  retrievedAt: string;
  contentHash: string;
}

export interface ExtractedFactCandidate {
  factType: string;
  valueRaw: string;
  valueNumeric?: number;
  unit?: string;
  status: FactStatus;
  confidence: number;
  sourceCitation: string;
  sourceUrl: string;
  sourceLocation?: string;
}

export interface ResearchAnalysisResult {
  companyName: string;
  sources: RawResearchResult[];
  extractedFacts: ExtractedFactCandidate[];
  summary: string;
  dataGaps: string[];
}

export interface IResearchProvider {
  name: string;
  researchCompany(companyName: string, website?: string, locationState?: string): Promise<ResearchAnalysisResult>;
  researchProject(projectId: string, companyName: string, sector: string, state: string): Promise<ResearchAnalysisResult>;
}
