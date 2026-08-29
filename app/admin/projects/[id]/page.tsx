// ==============================================================================
// CARBONSCOUT INDIA — PROJECT DETAIL DEEP DIVE & AUDIT PAGE
// ==============================================================================

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Layers,
  Database,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Info,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/provenance-badge';
import { Fact, ResearchSource, DocumentRecord, AuditLog } from '@/lib/db/schema';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'facts' | 'sources' | 'methodology' | 'calculations' | 'documents' | 'audit'>('overview');
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?projectId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setProjectData(data);
      }
    } catch (err) {
      console.error('Failed to fetch project detail', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading & validating document...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', id);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus(`Uploaded: ${file.name} (${data.document.document_type})`);
        fetchProject();
      } else {
        setUploadStatus(`Upload Error: ${data.error}`);
      }
    } catch (err: any) {
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  if (isLoading || !projectData) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Loading project audit records...
      </div>
    );
  }

  const { project, organization, facts, sources, assessments, documents, contacts, auditLogs } = projectData;
  const latestAssessment = assessments?.[0];

  return (
    <div className="space-y-6">
      {/* Back button and Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Leads Pipeline</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">ID: {project?.id}</span>
      </div>

      {/* Project Top Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {project?.pipeline_status}
            </span>
            <span className="text-xs text-slate-500">{project?.location_state}, India</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{organization?.name || project?.title}</h1>
          <p className="text-xs text-slate-600">{project?.description || project?.title}</p>
        </div>

        {latestAssessment && (
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Opportunity Score</span>
              <div className="text-2xl font-black text-emerald-700">
                {latestAssessment.opportunity_score} <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] font-bold text-slate-600">
                {latestAssessment.score_category?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'facts', label: `Facts (${facts?.length || 0})` },
          { id: 'sources', label: `Sources (${sources?.length || 0})` },
          { id: 'methodology', label: 'Methodology Fit' },
          { id: 'documents', label: `Documents (${documents?.length || 0})` },
          { id: 'audit', label: `Audit Trail (${auditLogs?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Facility Profile</h3>
            <div className="space-y-2 text-xs">
              <div><span className="text-slate-500">Legal Entity:</span> <span className="font-semibold text-slate-800">{organization?.legal_name || organization?.name}</span></div>
              <div><span className="text-slate-500">Sector:</span> <span className="text-slate-800">{project?.sector}</span></div>
              <div><span className="text-slate-500">Location:</span> <span className="text-slate-800">{project?.location_district ? project.location_district + ', ' : ''}{project?.location_state}</span></div>
              <div><span className="text-slate-500">Website:</span> <span className="text-slate-800 font-mono">{organization?.website || 'N/A'}</span></div>
              <div><span className="text-slate-500">Annual Capacity:</span> <span className="text-slate-800">{project?.annual_production_capacity?.toLocaleString()} {project?.annual_production_unit || 'MT/year'}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Primary Contacts</h3>
            {contacts && contacts.length > 0 ? (
              contacts.map((c: any) => (
                <div key={c.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{c.full_name}</div>
                  <div className="text-slate-600">{c.designation || 'Stakeholder'}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{c.email} • {c.phone}</div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No formal contact records added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FACTS & PROVENANCE */}
      {activeTab === 'facts' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Extracted Facts & Provenance Ledger</h3>
            <span className="text-xs text-slate-500">Strict Provenance Enforced</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2.5 text-left">Fact Key</th>
                  <th className="px-3 py-2.5 text-left">Value</th>
                  <th className="px-3 py-2.5 text-left">Provenance Status</th>
                  <th className="px-3 py-2.5 text-left">Citation / Source Reference</th>
                  <th className="px-3 py-2.5 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {facts?.map((f: Fact) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-slate-900">
                      {f.fact_type}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{f.value_raw}</td>
                    <td className="px-3 py-2.5">
                      <ProvenanceBadge status={f.status} confidence={f.confidence} />
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 truncate max-w-xs" title={f.source_citation}>
                      {f.source_citation || 'Self-provided'}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 font-mono text-[10px]">
                      {formatDate(f.extraction_timestamp || f.created_at)}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SOURCES */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Retrieved Discovery Sources</h3>
          <div className="space-y-3">
            {sources?.map((src: ResearchSource) => (
              <div key={src.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{src.title}</span>
                  <span className="font-mono text-[10px] text-slate-400">Hash: {src.content_hash}</span>
                </div>
                <div className="text-slate-600 font-mono text-[11px]">{src.url}</div>
                {src.raw_content && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed max-h-32 overflow-y-auto">
                    {src.raw_content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: METHODOLOGY FIT */}
      {activeTab === 'methodology' && latestAssessment && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Official Methodology Screening</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                  AUTHORITATIVE_CCTS_BEE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated against Gazette-notified Indian Carbon Market baseline standards
              </p>
            </div>
          </div>


          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800">Applicability Summary</h4>
            <p className="text-slate-700 leading-relaxed">{latestAssessment.applicability_summary}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Score Breakdown</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {latestAssessment.score_breakdown &&
                Object.entries(latestAssessment.score_breakdown).map(([key, item]: [string, any]) => (
                  <div key={key} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-emerald-700">{item.score}/{item.max}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.rationale}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOCUMENTS & UPLOAD */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Evidence Documents</h3>
              <p className="text-xs text-slate-500">
                Securely store electricity bills, weighbridge slips, and environmental clearances (Max 15MB).
              </p>
            </div>

            <div>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer transition shadow-xs">
                <UploadCloud className="w-4 h-4" />
                <span>Upload Document</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.csv,.xlsx,.xls,.docx"
                />
              </label>
            </div>
          </div>

          {uploadStatus && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              {uploadStatus}
            </div>
          )}

          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2.5 text-left">Document Name</th>
                  <th className="px-3 py-2.5 text-left">Type</th>
                  <th className="px-3 py-2.5 text-left">File Size</th>
                  <th className="px-3 py-2.5 text-left">Status</th>
                  <th className="px-3 py-2.5 text-left">Uploaded Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {documents && documents.length > 0 ? (
                  documents.map((doc: DocumentRecord) => (
                    <tr key={doc.id}>
                      <td className="px-3 py-2.5 font-bold text-slate-900">{doc.file_name}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-slate-600">{doc.document_type}</td>
                      <td className="px-3 py-2.5 text-slate-500">{(doc.file_size_bytes / 1024).toFixed(1)} KB</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {doc.upload_status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 font-mono text-[10px]">{formatDate(doc.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No documents uploaded yet. Upload DISCOM bills or weighbridge logs to strengthen evidence.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Append-Only Project Audit Trail</h3>
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 font-mono text-xs">
            {auditLogs?.map((log: AuditLog) => (
              <div key={log.id} className="p-3 flex items-start justify-between gap-4 hover:bg-slate-50">
                <div>
                  <span className="font-bold text-emerald-800">[{log.action}]</span>{' '}
                  <span className="text-slate-700">by {log.actor_id} ({log.actor_role})</span>
                  {log.details && (
                    <pre className="text-[11px] text-slate-500 mt-1 whitespace-pre-wrap">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatDateTime(log.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
