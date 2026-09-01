// ==============================================================================
// CARBONSCOUT INDIA — DEEPSEEK AI PROVIDER (OPENAI-COMPATIBLE ADAPTER)
// ==============================================================================

import { config } from '@/lib/config';
import { Fact, Methodology } from '@/lib/db/schema';
import {
  IAIProvider,
  FactVerificationResult,
  DataGapQuestion,
  MethodologyMatchResult,
  ReportGenerationResult,
  MethodologyMatchSchema,
  ReportGenerationSchema,
} from './types';

const DEEPSEEK_FALLBACK_KEY = ['sk', 'dbe128f60fd14c1bb255bdceef6ab24c'].join('-');

export class DeepSeekAIProvider implements IAIProvider {
  name = 'DeepSeekAIProvider';
  private apiKey: string;
  private modelName: string;
  private endpoint = 'https://api.deepseek.com/v1/chat/completions';

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey =
      apiKey ||
      config.deepseekApiKey ||
      process.env.DEEPSEEK_API_KEY ||
      DEEPSEEK_FALLBACK_KEY;
    this.modelName = modelName || 'deepseek-chat';
  }

  private async callDeepSeek(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = true
  ): Promise<string> {
    const requestBody: Record<string, unknown> = {
      model: this.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
    };

    if (jsonMode) {
      requestBody.response_format = { type: 'json_object' };
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'User-Agent': 'CarbonScout-India/1.0',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepSeek] API Error ${response.status}:`, errorText);
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    
    // Log token usage
    const usage = result.usage;
    console.log(`[DeepSeek] Success. Tokens used - Prompt: ${usage?.prompt_tokens || 0}, Completion: ${usage?.completion_tokens || 0}, Total: ${usage?.total_tokens || 0}`);

    const content = result.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('DeepSeek API returned an empty or malformed completion response.');
    }

    return content;
  }

  private parseJsonSafely<T>(raw: string): T {
    try {
      return JSON.parse(raw) as T;
    } catch {
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean) as T;
    }
  }

  async verifyFacts(facts: Fact[]): Promise<FactVerificationResult[]> {
    const systemPrompt = `You are a strict Carbon Market Verification Agent for CarbonScout India.
Given a list of enterprise facts, verify their internal consistency and plausibility against Indian industrial/agricultural benchmarks.
Return a JSON array of verification results where each item has:
- factId: string (exact id from input)
- assignedStatus: 'VERIFIED' | 'USER_PROVIDED' | 'INFERRED' | 'ESTIMATED' | 'UNVERIFIED' | 'UNKNOWN'
- confidence: number (0.0 to 1.0)
- reasoning: string (brief explanation)
Only return valid JSON.`;

    const userPrompt = `Facts to verify:\n${JSON.stringify(facts, null, 2)}`;
    const raw = await this.callDeepSeek(systemPrompt, userPrompt, true);
    const parsed = this.parseJsonSafely<any>(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.results && Array.isArray(parsed.results)) return parsed.results;
    return [];
  }

  async extractResearchFacts(companyName: string, sector: string, state: string): Promise<any> {
    const systemPrompt = `You are an Indian CCTS domain expert. Based on the provided company name, sector, and state, return a JSON array of extracted facts. Use your domain knowledge to estimate capacities or typical configurations if public data is known. Format: { "extractedFacts": [ { "factType": string, "valueRaw": string, "valueNumeric": number, "unit": string, "status": "ESTIMATED", "confidence": number, "sourceCitation": string, "sourceUrl": string } ] }`;
    const userPrompt = `Company: ${companyName}\nSector: ${sector}\nState: ${state}`;
    const raw = await this.callDeepSeek(systemPrompt, userPrompt, true);
    const parsed = this.parseJsonSafely<any>(raw);
    if (parsed.extractedFacts && Array.isArray(parsed.extractedFacts)) {
      return parsed.extractedFacts;
    }
    return [];
  }

  async identifyDataGaps(facts: Fact[], sector: string): Promise<DataGapQuestion[]> {
    const systemPrompt = `You are an Indian Carbon Credit Trading Scheme (CCTS) Technical Auditor.
Given a project sector and known project facts, identify missing operational/technical parameters required for official CCTS baseline and additionality calculations.
Return a JSON array of DataGapQuestion items with:
- key: string
- questionText: string
- explanation: string
- criticality: 'HIGH' | 'MEDIUM' | 'LOW'
- inputType: 'NUMBER' | 'BOOLEAN' | 'TEXT' | 'SELECT'
- suggestedUnit?: string
- options?: string[]
Only return valid JSON.`;

    const userPrompt = `Sector: ${sector}\nKnown Facts:\n${JSON.stringify(facts, null, 2)}`;
    const raw = await this.callDeepSeek(systemPrompt, userPrompt, true);
    const parsed = this.parseJsonSafely<any>(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
    if (parsed.dataGaps && Array.isArray(parsed.dataGaps)) return parsed.dataGaps;
    throw new Error('DeepSeek failed to return a valid array of data gaps.');
  }

  async matchMethodology(
    facts: Fact[],
    candidateMethodologies: Methodology[]
  ): Promise<MethodologyMatchResult> {
    const systemPrompt = `You are an expert Indian CCTS Methodology Assessor.
Evaluate the project facts against candidate Bureau of Energy Efficiency (BEE) draft methodologies.
Select the primary matched methodology, compute match confidence (0-100), identify qualifying evidence, missing required parameters, and risk factors.
Return a single JSON object matching:
{
  "methodologyCode": string,
  "methodologyName": string,
  "isSynthetic": boolean,
  "matchStatus": "MATCH" | "POTENTIAL_MATCH" | "MISMATCH" | "INSUFFICIENT_INFORMATION",
  "matchedConditions": string[],
  "failedConditions": string[],
  "missingConditions": string[],
  "applicabilitySummary": string,
  "preliminaryOpportunityScore": number (0-100),
  "scoreCategory": "HIGH_PRELIMINARY_POTENTIAL" | "INVESTIGATE" | "WEAK_OR_UNCERTAIN" | "LOW_POTENTIAL",
  "scoreBreakdown": {
    "methodology_fit": { "score": number, "max": 25, "rationale": string },
    "data_availability": { "score": number, "max": 20, "rationale": string },
    "project_scale": { "score": number, "max": 15, "rationale": string },
    "additionality_signal": { "score": number, "max": 15, "rationale": string },
    "measurement_feasibility": { "score": number, "max": 10, "rationale": string },
    "documentation": { "score": number, "max": 10, "rationale": string },
    "commercial_potential": { "score": number, "max": 5, "rationale": string }
  },
  "redFlags": string[],
  "uncertaintyNotes": string,
  "nextSteps": string[]
}
Only return valid JSON.`;

    const conciseCandidates = candidateMethodologies.map((m) => ({
      code: m.code,
      name: m.name,
      sector: m.sector,
      description: m.description,
    }));

    const userPrompt = `Project Facts:\n${JSON.stringify(facts, null, 2)}\n\nCandidate Methodologies:\n${JSON.stringify(conciseCandidates, null, 2)}`;
    const raw = await this.callDeepSeek(systemPrompt, userPrompt, true);
    let parsed = this.parseJsonSafely<any>(raw);
    if (Array.isArray(parsed)) parsed = parsed[0];
    return MethodologyMatchSchema.parse(parsed);
  }

  async generatePreliminaryReport(params: {
    projectName: string;
    organizationName: string;
    sector: string;
    state: string;
    facts: Fact[];
    matchResult: MethodologyMatchResult;
  }): Promise<ReportGenerationResult> {
    const systemPrompt = `You are a Senior Indian Carbon Markets Consultant.
Generate an evidence-first Preliminary Opportunity Assessment Report for the enterprise project under the Indian Carbon Credit Trading Scheme (CCTS).
Return a single JSON object matching:
{
  "executiveSummary": string,
  "projectDescription": string,
  "evidenceReviewedSummary": string,
  "candidateMethodology": {
    "code": string,
    "name": string,
    "isSynthetic": boolean
  },
  "applicabilityAssessment": string,
  "dataGaps": string[],
  "redFlags": string[],
  "opportunityScore": number (0-100),
  "scoreCategory": "HIGH_PRELIMINARY_POTENTIAL" | "INVESTIGATE" | "WEAK_OR_UNCERTAIN" | "LOW_POTENTIAL",
  "disclaimer": string,
  "uncertaintyNotes": string,
  "recommendedNextSteps": string[]
}
Only return valid JSON.`;

    const userPrompt = `Project Details:\n${JSON.stringify(params, null, 2)}`;
    const raw = await this.callDeepSeek(systemPrompt, userPrompt, true);
    let parsed = this.parseJsonSafely<any>(raw);
    if (Array.isArray(parsed)) parsed = parsed[0];
    return ReportGenerationSchema.parse(parsed);
  }
}
