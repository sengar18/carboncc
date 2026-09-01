// ==============================================================================
// CARBONSCOUT INDIA — COMPANY & PROJECT RESEARCH API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getResearchProvider } from '@/services/research';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';
import { Fact, ResearchSource } from '@/lib/db/schema';
import { isValidUUID, generateUUID } from '@/lib/utils';
import { getAIProvider, AIProviderName } from '@/services/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, website, sector, state, projectId, orgId } = body;

    // BYOK: optional per-request provider and API key from client headers
    const customProvider = (req.headers.get('x-llm-provider') || body.provider) as AIProviderName | undefined;
    const customApiKey = req.headers.get('x-custom-api-key') || body.apiKey || undefined;

    if (!companyName || !state) {
      return NextResponse.json(
        { error: 'companyName and state are required fields.' },
        { status: 400 }
      );
    }

    // Ensure Organization exists in DB with valid UUID
    let existingOrg = orgId && isValidUUID(orgId) ? await db.getOrganizationById(orgId) : undefined;
    if (!existingOrg) {
      existingOrg = await db.createOrganization({
        id: orgId && isValidUUID(orgId) ? orgId : generateUUID(),
        name: companyName,
        industry_sector: sector || 'Rice / Food Processing',
        state,
        website,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    const currentOrgId = existingOrg.id;

    // Ensure Project exists in DB with valid UUID
    let existingProj = projectId && isValidUUID(projectId) ? await db.getProjectById(projectId) : undefined;
    if (!existingProj) {
      existingProj = await db.createProject({
        id: projectId && isValidUUID(projectId) ? projectId : generateUUID(),
        organization_id: currentOrgId,
        title: `${companyName} Clean Energy & Bio-Residue Project`,
        sector: sector || 'Rice / Food Processing',
        location_state: state,
        existing_carbon_credit_project: false,
        pipeline_status: 'RESEARCHED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    const currentProjectId = existingProj.id;

    await logAuditEvent({
      entityType: 'PROJECT',
      entityId: currentProjectId,
      action: 'RESEARCH_STARTED',
      details: { companyName, state, sector },
    });

    // Run Research Layer
    const researchProvider = getResearchProvider();
    const researchResult = await researchProvider.researchCompany(companyName, website, state);

    // Save Research Sources
    const createdSources: ResearchSource[] = [];
    for (const src of researchResult.sources) {
      const sourceId = generateUUID();
      const sourceRecord: ResearchSource = {
        id: sourceId,
        project_id: currentProjectId,
        url: src.url,
        title: src.title,
        source_type: 'WEB_PAGE',
        raw_content: src.content,
        content_hash: src.contentHash,
        retrieved_at: src.retrievedAt,
        created_at: new Date().toISOString(),
      };
      await db.createSource(sourceRecord);
      createdSources.push(sourceRecord);
    }

    // Save Extracted Facts with strict provenance
    const createdFacts: Fact[] = [];
    for (const ef of researchResult.extractedFacts) {
      const factId = generateUUID();
      const matchingSource = createdSources.find((s) => s.url === ef.sourceUrl);

      const factRecord: Fact = {
        id: factId,
        project_id: currentProjectId,
        source_id: matchingSource?.id,
        fact_type: ef.factType,
        value_raw: ef.valueRaw,
        value_numeric: ef.valueNumeric,
        unit: ef.unit,
        status: ef.status,
        confidence: ef.confidence,
        source_citation: ef.sourceCitation,
        source_url: ef.sourceUrl,
        source_location: ef.sourceLocation,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.createFact(factRecord);
      createdFacts.push(factRecord);
    }

    await logAuditEvent({
      entityType: 'PROJECT',
      entityId: currentProjectId,
      action: 'RESEARCH_COMPLETED',
      details: {
        sourcesCount: createdSources.length,
        factsCount: createdFacts.length,
      },
    });

    return NextResponse.json({
      success: true,
      projectId: currentProjectId,
      orgId: currentOrgId,
      summary: researchResult.summary,
      sources: createdSources,
      facts: createdFacts,
      dataGaps: researchResult.dataGaps,
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal research error' },
      { status: 500 }
    );
  }
}
