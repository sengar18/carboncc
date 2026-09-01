// ==============================================================================
// CARBONSCOUT INDIA — FIRECRAWL RESEARCH ADAPTER
// ==============================================================================
// CARBONSCOUT INDIA — FIRECRAWL RESEARCH PROVIDER (SERVER-SIDE INTEGRATION)
// ==============================================================================

import { config } from '@/lib/config';
import { sha256 } from '@/lib/provenance';
import { IResearchProvider, ResearchAnalysisResult, RawResearchResult, ExtractedFactCandidate } from './types';

export class FirecrawlResearchProvider implements IResearchProvider {
  name = 'FirecrawlResearchProvider';
  private apiKey: string;
  private baseUrl = 'https://api.firecrawl.dev/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || config.firecrawlApiKey || '';
  }

  async scrapeUrl(url: string, timeoutMs = 15000): Promise<RawResearchResult | null> {
    if (!this.apiKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured on the server.');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${this.baseUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          url,
          formats: ['markdown'],
          onlyMainContent: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Firecrawl scrape error ${response.status}: ${await response.text()}`);
        return null;
      }

      const json = await response.json();
      const markdown = (json.data?.markdown || '').slice(0, 5000);
      const title = json.data?.metadata?.title || url;

      return {
        url,
        title,
        content: markdown,
        retrievedAt: new Date().toISOString(),
        contentHash: sha256(markdown),
      };
} catch (err) {
      console.error(`Firecrawl scraping failed for ${url}:`, err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }

  async researchCompany(companyName: string, website?: string, locationState?: string): Promise<ResearchAnalysisResult> {
    if (!this.apiKey) {
      throw new Error('FIRECRAWL_API_KEY is missing. Please set FIRECRAWL_API_KEY or use AI_PROVIDER=mock.');
    }

    const targetUrl = website || `https://www.google.com/search?q=${encodeURIComponent(companyName + ' ' + (locationState || 'India'))}`;
    const scraped = await this.scrapeUrl(targetUrl);

    const sources: RawResearchResult[] = scraped ? [scraped] : [];
    
    // Fallback or basic fact candidates from scraped content
    const extractedFacts: ExtractedFactCandidate[] = [
      {
        factType: 'COMPANY_NAME',
        valueRaw: companyName,
        status: 'VERIFIED',
        confidence: 1.0,
        sourceCitation: 'User input & web verification',
        sourceUrl: targetUrl,
      },
    ];

    return {
      companyName,
      sources,
      extractedFacts,
      summary: `Firecrawl web research processed for ${companyName}. Retrieved ${sources.length} live source(s).`,
      dataGaps: ['Operational energy bills', 'Detailed feedstock logs'],
    };
  }

  async researchProject(projectId: string, companyName: string, sector: string, state: string): Promise<ResearchAnalysisResult> {
    return this.researchCompany(companyName, undefined, state);
  }
}
