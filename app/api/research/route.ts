// ==============================================================================
// CARBONSCOUT INDIA — COMPANY & PROJECT RESEARCH API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getResearchProvider } from '@/services/research';
import { memoryStore } from '@/lib/db/memory-store';
import { logAuditEvent } from '@/lib/audit';
import { Fact, ResearchSource } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, website, sector, state, projectId, orgId } = body;

    if (!companyName || !state) {
      return NextResponse.json(
        { error: 'companyName and state are required fields.' },
        { status: 400 }
      );
    }

    const currentProjectId = projectId || `proj-${Date.now()}`;
    const currentOrgId = orgId || `org-${Date.now()}`;

    // Ensure Organization exists in memory store
    if (!memoryStore.getOrganizationById(currentOrgId)) {
      memoryStore.organizations.set(currentOrgId, {
        id: currentOrgId,
        name: companyName,
        industry_sector: sector || 'Rice / Food Processing',
        state,
        website,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Ensure Project exists in memory store
    if (!memoryStore.getProjectById(currentProjectId)) {
      memoryStore.projects.set(currentProjectId, {
        id: currentProjectId,
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
      const sourceId = `src-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
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
      memoryStore.researchSources.set(sourceId, sourceRecord);
      createdSources.push(sourceRecord);
    }

    // Save Extracted Facts with strict provenance
    const createdFacts: Fact[] = [];
    for (const ef of researchResult.extractedFacts) {
      const factId = `fact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
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
      memoryStore.facts.set(factId, factRecord);
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
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal research error' }, { status: 500 });
  }
}
