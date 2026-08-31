// ==============================================================================
// CARBONSCOUT INDIA — ADMIN CRM & LEADS MANAGEMENT API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';
import { PipelineStatus } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    const project = await db.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const organization = await db.getOrganizationById(project.organization_id);
    const facts = await db.getFactsByProjectId(projectId);
    const sources = await db.getSourcesByProjectId(projectId);
    const assessments = await db.getAssessmentsByProjectId(projectId);
    const documents = await db.getDocumentsByProjectId(projectId);
    const contacts = organization ? await db.getContactsByOrgId(organization.id) : [];
    const auditLogs = await db.getAuditLogs('PROJECT', projectId);

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
  const projects = await db.getProjects();
  const leads = await Promise.all(
    projects.map(async (p) => {
      const org = await db.getOrganizationById(p.organization_id);
      const assessments = await db.getAssessmentsByProjectId(p.id);
      const latestAssessment = assessments[0];
      const methRecord = latestAssessment?.methodology_id ? db.getMethodologyById(latestAssessment.methodology_id) : undefined;
      const methCode = methRecord?.code || (latestAssessment?.methodology_id ? 'Official CCTS' : 'None');
      const projectFacts = await db.getFactsByProjectId(p.id);

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
    })
  );

  const auditHistory = (await db.getAuditLogs()).slice(0, 50);

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

    const project = await db.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const previousStatus = project.pipeline_status;

    const updated = await db.updateProject(projectId, {
      pipeline_status: pipelineStatus ? (pipelineStatus as PipelineStatus) : project.pipeline_status,
      notes: notes !== undefined ? notes : project.notes,
    });

    await logAuditEvent({
      entityType: 'PROJECT',
      entityId: projectId,
      action: 'LEAD_STATUS_CHANGED',
      details: {
        from: previousStatus,
        to: updated?.pipeline_status,
        notesUpdated: notes !== undefined,
      },
    });

    return NextResponse.json({
      success: true,
      project: updated,
    });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update lead' },
      { status: 500 }
    );
  }
}
