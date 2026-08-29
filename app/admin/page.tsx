// ==============================================================================
// CARBONSCOUT INDIA — ADMIN CRM & LEADS PIPELINE DASHBOARD
// ==============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Compass,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { PipelineStatus } from '@/lib/db/schema';
import { formatDate, formatDateTime } from '@/lib/utils';

const CRM_STAGES: PipelineStatus[] = [
  'NEW',
  'RESEARCHED',
  'CONTACTED',
  'RESPONDED',
  'QUALIFIED',
  'ASSESSMENT',
  'HANDOFF',
  'CLOSED',
  'REJECTED',
];

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setAuditLogs(data.auditHistory || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (projectId: string, newStatus: PipelineStatus) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, pipelineStatus: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = selectedStage === 'ALL' || lead.pipelineStatus === selectedStage;
    const matchesSearch =
      !searchQuery ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.sector?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold">
              Admin Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">Evidence-First CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Carbon Opportunity Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Track qualified Indian commercial prospects, evidence extraction, and preliminary methodology screening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>New Opportunity</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Prospects</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{leads.length}</div>
          <span className="text-[11px] text-slate-400">All sectors</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-emerald-700 font-semibold">High Potential</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {leads.filter((l) => l.opportunityScore && l.opportunityScore >= 80).length}
          </div>
          <span className="text-[11px] text-slate-400">Score &gt;= 80/100</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-amber-700 font-semibold">Under Investigation</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {leads.filter((l) => l.opportunityScore && l.opportunityScore >= 65 && l.opportunityScore < 80).length}
          </div>
          <span className="text-[11px] text-slate-400">Score 65–79</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Audit Events</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{auditLogs.length}</div>
          <span className="text-[11px] text-slate-400">Append-only history</span>
        </div>
      </div>

      {/* Pipeline Stage Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedStage('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            selectedStage === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Stages ({leads.length})
        </button>
        {CRM_STAGES.map((st) => {
          const count = leads.filter((l) => l.pipelineStatus === st).length;
          return (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedStage === st
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Leads Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by company, sector, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredLeads.length} of {leads.length} projects
          </span>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Company & Location</th>
                <th className="px-4 py-3 text-left">Sector</th>
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Methodology</th>
                <th className="px-4 py-3 text-left">Facts</th>
                <th className="px-4 py-3 text-left">Pipeline Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No leads found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{lead.company}</div>
                      <div className="text-[11px] text-slate-500">{lead.location}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{lead.sector}</td>
                    <td className="px-4 py-3">
                      {lead.opportunityScore !== null ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-emerald-700 text-sm">
                            {lead.opportunityScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {lead.methodology}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-[11px]">
                        {lead.factsCount} facts
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.pipelineStatus}
                        onChange={(e) =>
                          handleUpdateStatus(lead.id, e.target.value as PipelineStatus)
                        }
                        className="px-2 py-1 rounded border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      >
                        {CRM_STAGES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/projects/${lead.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Stream History */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Live Audit Log Stream
            </h3>
            <p className="text-xs text-slate-500">
              Immutable provenance trail (secrets and credentials automatically redacted).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Latest 50 events</span>
        </div>

        <div className="border border-slate-200 rounded-lg max-h-64 overflow-y-auto divide-y divide-slate-100 font-mono text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-2.5 flex items-start justify-between gap-4 hover:bg-slate-50">
              <div>
                <span className="font-bold text-emerald-800">[{log.action}]</span>{' '}
                <span className="text-slate-700">{log.entity_type}:{log.entity_id}</span>
                {log.details && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {JSON.stringify(log.details)}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {formatDateTime(log.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
