// ==============================================================================
// CARBONSCOUT INDIA — MOCK RESEARCH PROVIDER (ZERO-CREDIT SYNTHETIC RESEARCH)
// ==============================================================================

import { IResearchProvider, ResearchAnalysisResult, RawResearchResult, ExtractedFactCandidate } from './types';

export class MockResearchProvider implements IResearchProvider {
  name = 'MockResearchProvider';

  async researchCompany(companyName: string, website?: string, locationState?: string): Promise<ResearchAnalysisResult> {
    const cleanName = companyName || 'Indian Agri-Enterprise';
    const state = locationState || 'Punjab';
    const cleanWeb = website || `https://www.${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.in`;

    const sources: RawResearchResult[] = [
      {
        url: `${cleanWeb}/about-us`,
        title: `${cleanName} — Corporate Overview & Industrial Operations`,
        content: `${cleanName} operates modern commercial processing and production facilities based in ${state}, India. Annual agro-feedstock processing capacity is estimated at 35,000–50,000 MT per annum, generating steady volumes of agricultural biomass byproduct and captive thermal demand.`,
        retrievedAt: new Date().toISOString(),
        contentHash: 'mock-hash-src-001',
      },
      {
        url: `${cleanWeb}/sustainability`,
        title: `${cleanName} — Energy & Environmental Baseline`,
        content: `Energy infrastructure at ${cleanName}: The plant consumes electrical power from the state grid (DISCOM) at 11kV/33kV and operates captive steam boilers utilizing solid agro-residues. No registered carbon credit project exists on the national or international registry to date.`,
        retrievedAt: new Date().toISOString(),
        contentHash: 'mock-hash-src-002',
      },
    ];

    const extractedFacts: ExtractedFactCandidate[] = [
      {
        factType: 'PRIMARY_BUSINESS_SECTOR',
        valueRaw: 'Agro-processing & Food Manufacturing',
        status: 'VERIFIED',
        confidence: 0.95,
        sourceCitation: 'Corporate Overview, About Us page',
        sourceUrl: sources[0].url,
        sourceLocation: 'Page 1, Para 1',
      },
      {
        factType: 'ANNUAL_PROCESSING_CAPACITY',
        valueRaw: '45000 MT/year',
        valueNumeric: 45000,
        unit: 'MT/year',
        status: 'ESTIMATED',
        confidence: 0.85,
        sourceCitation: 'Operational capacity range average',
        sourceUrl: sources[0].url,
        sourceLocation: 'Page 1, Para 2',
      },
      {
        factType: 'ANNUAL_BIOMASS_RESIDUE_GENERATION',
        valueRaw: '7500 MT/year',
        valueNumeric: 7500,
        unit: 'MT/year',
        status: 'INFERRED',
        confidence: 0.8,
        sourceCitation: 'Derived from 45000 MT agro-processing standard husk ratio (~16-18%)',
        sourceUrl: sources[0].url,
        sourceLocation: 'Inferred from processing capacity',
      },
      {
        factType: 'GRID_ELECTRICITY_CONNECTION',
        valueRaw: 'Connected to State Grid (11kV / 33kV)',
        valueNumeric: 1,
        unit: 'boolean',
        status: 'VERIFIED',
        confidence: 0.9,
        sourceCitation: 'Energy & Environmental Baseline section',
        sourceUrl: sources[1].url,
        sourceLocation: 'Para 1',
      },
      {
        factType: 'EXISTING_CARBON_PROJECT_REGISTRATION',
        valueRaw: 'None registered',
        valueNumeric: 0,
        unit: 'boolean',
        status: 'VERIFIED',
        confidence: 0.95,
        sourceCitation: 'Public registry review and company sustainability declaration',
        sourceUrl: sources[1].url,
        sourceLocation: 'Para 2',
      },
      {
        factType: 'CAPTIVE_BOILER_FUEL_TYPE',
        valueRaw: 'Agro-residues (Rice husk & mustard stalk)',
        status: 'USER_PROVIDED',
        confidence: 0.9,
        sourceCitation: 'Onboarding questionnaire',
        sourceUrl: cleanWeb,
      },
    ];

    return {
      companyName: cleanName,
      sources,
      extractedFacts,
      summary: `Automated mock research completed for ${cleanName} (${state}). Identified verified agricultural processing facility with estimated 7,500 MT/year residue biomass generation and grid power displacement opportunities.`,
      dataGaps: [
        'Exact weighed annual biomass husk volumes from gate receipts',
        'Specific monthly electricity consumption (kWh) and tariff category from DISCOM bills',
        'Boiler operating hours, steam pressure, and auxiliary power consumption',
      ],
    };
  }

  async researchProject(projectId: string, companyName: string, sector: string, state: string): Promise<ResearchAnalysisResult> {
    return this.researchCompany(companyName, undefined, state);
  }
}
