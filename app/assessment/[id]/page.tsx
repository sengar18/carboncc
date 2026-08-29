// ==============================================================================
// CARBONSCOUT INDIA — STANDALONE ASSESSMENT REPORT VIEWER
// ==============================================================================

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  Compass,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Printer,
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/provenance-badge';
import { formatDate } from '@/lib/utils';

export default function StandaloneAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/assessment/${id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading || !data) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Loading assessment report...
      </div>
    );
  }

  const { assessment, project, organization, facts, calculationRuns } = data;
  const calcRun = calculationRuns?.[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link & actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin CRM</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Main Report Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              CarbonScout India — Preliminary Intelligence Report
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {organization?.name || project?.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sector: {project?.sector} • Location: {project?.location_state}, India • Assessment ID: <code className="text-slate-700">{assessment.id}</code>
            </p>
          </div>

          <div className="text-right p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">Opportunity Score</span>
            <div className="text-3xl font-black text-emerald-700">
              {assessment.opportunity_score} <span className="text-base font-bold text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 mt-1 inline-block">
              {assessment.score_category?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Disclaimer:</span> Preliminary opportunity score — not a prediction or guarantee of carbon-credit issuance, registration, or revenue.
          </div>
        </div>

        {/* Applicability Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Methodology Alignment</h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {assessment.applicability_summary}
          </p>
        </div>

        {/* 100-Point Breakdown */}
        {assessment.score_breakdown && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              100-Point Screening Framework
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(assessment.score_breakdown).map(([key, item]: [string, any]) => (
                <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {item.score} / {item.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{item.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deterministic Calculation */}
        {calcRun && calcRun.outputs_snapshot && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Abatement Estimation (Synthetic Test Formula)
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2">
              <div className="text-emerald-400 font-bold">
                Estimated Net Abatement: {calcRun.outputs_snapshot.estimatedAnnualAbatement_tCO2e?.toLocaleString()} tCO2e/year
              </div>
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">
                {calcRun.calculation_explanation}
              </pre>
            </div>
          </div>
        )}

        {/* Facts & Provenance */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Underlying Evidence & Facts
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2 text-left">Fact</th>
                  <th className="px-3 py-2 text-left">Value</th>
                  <th className="px-3 py-2 text-left">Provenance Status</th>
                  <th className="px-3 py-2 text-left">Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {facts?.map((f: any) => (
                  <tr key={f.id}>
                    <td className="px-3 py-2 font-mono text-[11px]">{f.fact_type}</td>
                    <td className="px-3 py-2 font-semibold">{f.value_raw}</td>
                    <td className="px-3 py-2">
                      <ProvenanceBadge status={f.status} confidence={f.confidence} />
                    </td>
                    <td className="px-3 py-2 text-slate-500 truncate max-w-xs">{f.source_citation || 'Direct'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-slate-100 text-xs text-slate-400">
          Generated on {formatDate(assessment.updated_at || assessment.created_at)} • CarbonScout India Evidence Intelligence Engine
        </div>
      </div>
    </div>
  );
}
