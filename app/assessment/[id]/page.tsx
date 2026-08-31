// ==============================================================================
// CARBONSCOUT INDIA — EVIDENCE-FIRST ASSESSMENT REPORT VIEWER
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
  Search,
  ExternalLink,
  Layers,
  Cpu,
  HelpCircle,
  TrendingUp,
  Award,
  Globe,
  Share2,
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/provenance-badge';
import { WhyThisResultModal, ConclusionItem } from '@/components/why-this-result-modal';
import { formatDate } from '@/lib/utils';
import { Fact, ResearchSource, Assessment, Project, Organization, CalculationRun } from '@/lib/db/schema';
import { PathwayScreeningResult } from '@/services/methodology/pathway-screener';

export default function StandaloneAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{
    assessment: Assessment;
    project: Project;
    organization: Organization;
    facts: Fact[];
    sources: ResearchSource[];
    questions: any[];
    calculationRuns: CalculationRun[];
    documents: any[];
    pathwayScreening?: PathwayScreeningResult;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedConclusion, setSelectedConclusion] = useState<ConclusionItem | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/assessment/${id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load assessment report:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading || !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-500">Retrieving official assessment intelligence...</p>
      </div>
    );
  }

  const { assessment, project, organization, facts, sources, calculationRuns, pathwayScreening } = data;
  const calcRun = calculationRuns?.[0];

  const handleOpenAudit = (item: ConclusionItem) => {
    setSelectedConclusion(item);
    setIsAuditModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Pipeline</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>New Assessment</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Intelligence Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official CCTS Preliminary Assessment Dossier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {organization?.name || project?.title}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sector: <span className="font-semibold text-slate-900">{project?.sector}</span> • Location:{' '}
              <span className="font-semibold text-slate-900">{project?.location_state}, India</span> • Pipeline Status:{' '}
              <span className="font-semibold text-emerald-700">{project?.pipeline_status}</span>
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              Assessment ID: {assessment.id} • Generated: {formatDate(assessment.updated_at || assessment.created_at)}
            </div>
          </div>

          {/* Opportunity Score Gauge */}
          <div className="shrink-0 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[180px] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Opportunity Score
            </span>
            <div className="text-4xl font-black text-emerald-700">
              {assessment.opportunity_score}
              <span className="text-base font-bold text-slate-400">/100</span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-block">
              {assessment.score_category?.replace(/_/g, ' ')}
            </span>
            <div className="pt-2">
              <button
                onClick={() =>
                  handleOpenAudit({
                    id: 'score-audit',
                    title: '100-Point Opportunity Score Rationale',
                    conclusionValue: `${assessment.opportunity_score}/100 (${assessment.score_category?.replace(/_/g, ' ')})`,
                    category: 'OPPORTUNITY_SCORE',
                    reasoningType: 'DETERMINISTIC_MATH',
                    supportingFacts: facts,
                    sources: sources,
                    explanation:
                      'Score computed through deterministic multi-criteria scoring algorithm evaluating Sector Eligibility, Feedstock Scale, Baseline Additionality, Verified Data Completeness, and Commercial Viability.',
                    confidence: 0.95,
                  })
                }
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Why this score?</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Notice */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 leading-relaxed">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Preliminary Intelligence Notice:</span> This assessment provides indicative screening based strictly on Gazette-notified Bureau of Energy Efficiency (BEE) methodologies. It does not constitute formal validation, DOE verification, or guaranteed issuance of Carbon Credit Certificates (CCCs).
          </div>
        </div>

        {/* Section 1: Methodology Match & Alignment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                1. Official CCTS Methodology Applicability
              </h2>
            </div>
            <button
              onClick={() =>
                handleOpenAudit({
                  id: 'methodology-audit',
                  title: 'CCTS Methodology Applicability Match',
                  conclusionValue: assessment.applicability_summary,
                  category: 'METHODOLOGY_MATCH',
                  reasoningType: 'AI_STRUCTURED_REASONING',
                  methodologyCode: assessment.methodology_id?.replace('meth-', '').toUpperCase() || 'CCTS STANDARD',
                  supportingFacts: facts,
                  sources: sources,
                  explanation: assessment.applicability_summary,
                  confidence: 0.92,
                })
              }
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why this match?</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded border border-emerald-200">
                {assessment.methodology_id?.replace('meth-', '').toUpperCase() || 'OFFICIAL CCTS BASELINE'}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Governing Body: Bureau of Energy Efficiency (BEE)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {assessment.applicability_summary}
            </p>
          </div>
        </div>

        {/* Section 2: Deterministic Calculation Engine */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                2. Deterministic Abatement Calculation
              </h2>
            </div>
            {calcRun && (
              <button
                onClick={() =>
                  handleOpenAudit({
                    id: 'calc-audit',
                    title: 'Deterministic Emission Abatement Formula Audit',
                    conclusionValue: calcRun.outputs_snapshot?.estimatedAnnualAbatement_tCO2e !== null
                      ? `${calcRun.outputs_snapshot.estimatedAnnualAbatement_tCO2e?.toLocaleString()} tCO2e/year`
                      : 'Calculation Unavailable (Missing Inputs)',
                    category: 'DETERMINISTIC_CALCULATION',
                    reasoningType: 'DETERMINISTIC_MATH',
                    formulaReference: calcRun.formula_id,
                    supportingFacts: facts,
                    sources: sources,
                    explanation: calcRun.calculation_explanation || 'Deterministic calculation according to CCTS baseline methodology.',
                    confidence: 0.98,
                  })
                }
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why this calculation?</span>
              </button>
            )}
          </div>

          {calcRun && calcRun.outputs_snapshot && calcRun.outputs_snapshot.estimatedAnnualAbatement_tCO2e !== null ? (
            <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-slate-400 text-[11px] block">Estimated Net Annual Abatement</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {calcRun.outputs_snapshot.estimatedAnnualAbatement_tCO2e?.toLocaleString()} tCO2e / year
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold self-start sm:self-auto border border-slate-700">
                  Formula ID: {calcRun.formula_id}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                {calcRun.calculation_explanation}
              </div>

              {/* Snapshot of exact numerical parameters used */}
              {calcRun.inputs_snapshot && Object.keys(calcRun.inputs_snapshot).length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-bold">
                    Deterministic Calculation Input Parameters:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                    {Object.entries(calcRun.inputs_snapshot).map(([k, v]: [string, any]) => (
                      <div key={k} className="p-2 rounded bg-slate-800/50 border border-slate-700/50">
                        <span className="text-slate-400 block truncate">{k}:</span>
                        <span className="font-bold text-emerald-300">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Deterministic Calculation Unavailable — Insufficient Parameters</span>
              </div>
              <p className="leading-relaxed">
                {calcRun?.calculation_explanation || 'Mandatory parameter inputs were not fully supplied. CarbonScout does not simulate or synthesize missing numerical values.'}
              </p>
            </div>
          )}
        </div>

        {/* Section 3: 100-Point Scoring Breakdown */}
        {assessment.score_breakdown && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                3. 100-Point Opportunity Screening Breakdown
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(assessment.score_breakdown).map(([key, item]: [string, any]) => (
                <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-black text-emerald-700">
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

        {/* Section 4: Environmental Pathway Screening (Phase 9) */}
        {pathwayScreening && pathwayScreening.pathways && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-700" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  4. Environmental Attribute Pathway Screening
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 italic">
                Indicative multi-attribute screening
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pathwayScreening.pathways.map((p) => (
                <div
                  key={p.pathwayId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {p.category.replace(/_/g, ' ')}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        p.status === 'HIGH_APPLICABILITY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'POTENTIALLY_SUITABLE'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{p.rationale}</p>
                  <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-0.5">
                    <div><strong>Registry:</strong> {p.registryStandard}</div>
                    <div><strong>Authority:</strong> {p.governingBody}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Underlying Evidence & Provenance Facts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                5. Underlying Evidence & Facts ({facts?.length || 0})
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              Provenance tagged with source citations
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold">
                  <tr>
                    <th className="px-3.5 py-2.5 text-left">Fact Identifier</th>
                    <th className="px-3.5 py-2.5 text-left">Extracted Value</th>
                    <th className="px-3.5 py-2.5 text-left">Provenance Status</th>
                    <th className="px-3.5 py-2.5 text-left">Citation / Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {facts?.map((f: any) => (
                    <tr key={f.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-3.5 py-2.5 font-mono text-[11px] font-bold text-slate-900">
                        {f.fact_type}
                      </td>
                      <td className="px-3.5 py-2.5 font-semibold text-emerald-800">
                        {f.value_raw} {f.unit || ''}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <ProvenanceBadge status={f.status} confidence={f.confidence} />
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-500 truncate max-w-xs">
                        {f.source_citation || (f.source_url ? (
                          <a href={f.source_url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline inline-flex items-center gap-1">
                            <span>{f.source_url}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : 'Direct User Input')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 6: Real Discovered Sources (Firecrawl) */}
        {sources && sources.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                6. Discovered Research Sources ({sources.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition flex items-center justify-between text-xs"
                >
                  <div className="truncate max-w-xs sm:max-w-md">
                    <span className="font-bold text-slate-900 block truncate">{src.title || src.url}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">{src.url}</span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Key Findings & Recommended Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {assessment.uncertainty_notes && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Critical Data Gaps & Uncertainty
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{assessment.uncertainty_notes}</p>
            </div>
          )}

          {assessment.next_steps && assessment.next_steps.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Actionable Next Steps
              </span>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                {assessment.next_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-slate-100 text-[11px] text-slate-400">
          Generated via CarbonScout India • Built strictly on Bureau of Energy Efficiency CCTS Gazetted Standards
        </div>
      </div>

      {/* Interactive 'Why This Result?' Modal */}
      <WhyThisResultModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        conclusion={selectedConclusion}
      />
    </div>
  );
}
