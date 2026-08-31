// ==============================================================================
// CARBONSCOUT INDIA — GOOGLE GEMINI AI ADAPTER
// ==============================================================================
// CARBONSCOUT INDIA — GEMINI AI PROVIDER (LIVE ADAPTER WITH SCHEMA ENFORCEMENT)
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

export class GeminiAIProvider implements IAIProvider {
  name = 'GeminiAIProvider';
  private apiKey: string;
  private modelName = 'gemini-flash-latest';
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey = apiKey || config.geminiApiKey || '';
    if (modelName) {
      this.modelName = modelName;
    }
  }

  private async callGemini(systemPrompt: string, userPrompt: string, responseJsonSchema?: any): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const endpoint = `${this.baseUrl}/${this.modelName}:generateContent?key=${this.apiKey}`;

    const requestBody: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
      },
    };

    if (responseJsonSchema) {
      requestBody.generationConfig.responseMimeType = 'application/json';
      requestBody.generationConfig.responseSchema = responseJsonSchema;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const candidate = result.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error('Gemini API returned an empty or malformed candidate response.');
    }

    return candidate.content.parts[0].text;
  }

  async verifyFacts(facts: Fact[]): Promise<FactVerificationResult[]> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const systemPrompt = `You are a strict Carbon Market Verification Agent for CarbonScout India.
Given a list of enterprise facts, verify their internal consistency and plausibility against Indian industrial/agricultural benchmarks.
Return a JSON array of verification results where each item has:
- factId: string (exact id from input)
- verifiedStatus: 'VERIFIED' | 'NEEDS_CONFIRMATION' | 'CONTRADICTORY'
- confidenceScore: number (0.0 to 1.0)
- reason: string (brief explanation)
Only return valid JSON.`;

    const userPrompt = `Facts to verify:\n${JSON.stringify(facts, null, 2)}`;
    const rawJson = await this.callGemini(systemPrompt, userPrompt);
    
    try {
      const parsed = JSON.parse(rawJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    }
  }

  async identifyDataGaps(facts: Fact[], sector: string): Promise<DataGapQuestion[]> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const systemPrompt = `You are an Indian Carbon Credit Trading Scheme (CCTS) Technical Auditor.
Given a project sector and known project facts, identify missing operational/technical parameters required for official CCTS baseline and additionality calculations.
Return a JSON array of DataGapQuestion items with:
- id: string
- parameterName: string
- question: string
- rationale: string
- requiredForMethodology: string
- priority: 'HIGH' | 'MEDIUM' | 'LOW'
- inputType: 'number' | 'text' | 'boolean' | 'select'
- options?: string[]
Only return valid JSON.`;

    const userPrompt = `Sector: ${sector}\nKnown Facts:\n${JSON.stringify(facts, null, 2)}`;
    const rawJson = await this.callGemini(systemPrompt, userPrompt);
    
    try {
      const parsed = JSON.parse(rawJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    }
  }

  async matchMethodology(
    facts: Fact[],
    candidateMethodologies: Methodology[]
  ): Promise<MethodologyMatchResult> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const systemPrompt = `You are an expert Indian CCTS Methodology Assessor.
Evaluate the project facts against candidate Bureau of Energy Efficiency (BEE) draft methodologies.
Select the primary matched methodology, compute match confidence (0-100), identify qualifying evidence, missing required parameters, and risk factors.
Return a single JSON object matching:
{
  "primaryMethodology": { "id": string, "code": string, "title": string, "sector": string, "type": "REDUCTION"|"REMOVAL"|"AVOIDANCE", "version": string },
  "alternativeMethodologies": Array<{ id, code, title, reason }>,
  "matchConfidence": number (0-100),
  "qualifyingEvidence": Array<string>,
  "missingRequiredParameters": Array<string>,
  "riskFactors": Array<string>,
  "reasoning": string
}
Only return valid JSON.`;

    const userPrompt = `Project Facts:\n${JSON.stringify(facts, null, 2)}\n\nCandidate Methodologies:\n${JSON.stringify(candidateMethodologies, null, 2)}`;
    const rawJson = await this.callGemini(systemPrompt, userPrompt);

    let parsed: any;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    }

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
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const systemPrompt = `You are a Senior Indian Carbon Markets Consultant.
Generate an evidence-first Preliminary Opportunity Assessment Report for the enterprise project under the Indian Carbon Credit Trading Scheme (CCTS).
Return a single JSON object with:
- executiveSummary: string
- methodologyApplicability: string
- additionalityAssessment: string
- riskAnalysis: Array<{ category: string, description: string, severity: 'LOW'|'MEDIUM'|'HIGH', mitigation: string }>
- nextSteps: Array<string>
Only return valid JSON.`;

    const userPrompt = `Project Details:\n${JSON.stringify(params, null, 2)}`;
    const rawJson = await this.callGemini(systemPrompt, userPrompt);

    let parsed: any;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    }

    return ReportGenerationSchema.parse(parsed);
  }
}
