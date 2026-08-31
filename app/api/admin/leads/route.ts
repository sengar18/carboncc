// ==============================================================================
// CARBONSCOUT INDIA — ADMIN LEADS API ROUTE
// ==============================================================================
// CARBONSCOUT INDIA — ADMIN CRM & LEADS MANAGEMENT API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db/memory-store';
import { logAuditEvent } from '@/lib/audit';
import { PipelineStatus } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    const project = memoryStore.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const organization = memoryStore.getOrganizationById(project.organization_id);
    const facts = memoryStore.getFactsByProjectId(projectId);
    const sources = memoryStore.getSourcesByProjectId(projectId);
    const assessments = memoryStore.getAssessmentsByProjectId(projectId);
    const documents = memoryStore.getDocumentsByProjectId(projectId);
    const contacts = organization ? memoryStore.getContactsByOrgId(organization.id) : [];
    const auditLogs = memoryStore.getAuditLogs('PROJECT', projectId);

    return NextResponse.json({
      project,
      organization,
      facts,
      sources,
      assessments,
      documents,
      contacts,
      auditLogs,
    });
  }

  // List all leads/projects with aggregated metadata
  const projects = memoryStore.getProjects();
  const leads = projects.map((p) => {
    const org = memoryStore.getOrganizationById(p.organization_id);
    const assessments = memoryStore.getAssessmentsByProjectId(p.id);
    const latestAssessment = assessments[0];
    const methRecord = latestAssessment?.methodology_id ? memoryStore.methodologies.get(latestAssessment.methodology_id) : undefined;
    const methCode = methRecord?.code || (latestAssessment?.methodology_id ? 'Official CCTS' : 'None');
    const projectFacts = memoryStore.getFactsByProjectId(p.id);

    return {
      id: p.id,
      company: org?.name || p.title,
      location: `${p.location_state}${p.location_district ? ', ' + p.location_district : ''}`,
      sector: p.sector,
      pipelineStatus: p.pipeline_status,
      opportunityScore: latestAssessment?.opportunity_score ?? null,
      scoreCategory: latestAssessment?.score_category ?? null,
      methodology: methCode,
      factsCount: projectFacts.length,
      lastUpdated: p.updated_at,
      notes: p.notes,
    };
  });


  const auditHistory = memoryStore.getAuditLogs().slice(0, 50);

  return NextResponse.json({
    leads,
    totalProjects: projects.length,
    auditHistory,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, pipelineStatus, notes } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const project = memoryStore.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const previousStatus = project.pipeline_status;

    if (pipelineStatus) {
      project.pipeline_status = pipelineStatus as PipelineStatus;
    }
    if (notes !== undefined) {
      project.notes = notes;
    }
    project.updated_at = new Date().toISOString();

    await logAuditEvent({
      entityType: 'PROJECT',
      entityId: projectId,
      action: 'LEAD_STATUS_CHANGED',
      details: {
        from: previousStatus,
        to: project.pipeline_status,
        notesUpdated: notes !== undefined,
      },
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update lead' },
      { status: 500 }
    );
  }
}
