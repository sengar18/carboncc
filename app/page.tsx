// ==============================================================================
// CARBONSCOUT INDIA — OFFICIAL METHODOLOGY INTELLIGENCE PLATFORM
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Building2,
  BookOpen,
  Award,
} from 'lucide-react';
import { MethodologyRegistry } from '@/services/methodology/registry';

export default function HomePage() {
  const methodologies = MethodologyRegistry.getAll();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-6 pb-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Authoritative Indian CCTS / BEE Methodology Knowledge Base</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Evidence-First Carbon Opportunity Intelligence for <span className="text-emerald-700">Indian Enterprises</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Rigorous preliminary opportunity assessment based strictly on official Bureau of Energy Efficiency (BEE) Carbon Credit Trading Scheme (CCTS) methodologies, verifiable enterprise facts, and deterministic mathematical rules.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/assessment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-base hover:bg-emerald-800 transition shadow-md hover:shadow-lg"
          >
            <Compass className="w-5 h-5" />
            <span>Start Opportunity Screening</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-300 hover:bg-slate-50 transition shadow-xs"
          >
            <Building2 className="w-5 h-5 text-slate-500" />
            <span>Open Admin Lead Pipeline</span>
          </Link>
        </div>

        {/* Non-fabrication badge */}
        <p className="text-xs text-slate-500 italic">
          * CarbonScout provides preliminary intelligence, not certification, validation, or guaranteed credit issuance.
        </p>
      </section>

      {/* Official CCTS Methodology Catalog Showcase */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-slate-900">Ingested Official CCTS Methodologies</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              12 Gazette-notified baseline & monitoring methodologies from Bureau of Energy Efficiency (Ministry of Power, Govt of India).
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start md:self-auto">
            12 Official Standards Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methodologies.map((m) => (
            <div
              key={m.code}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-white transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {m.code}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{m.effectiveDate}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                {m.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {m.description}
              </p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>CDM Ref: {m.referenceUnfcccCdm[0]}</span>
                <span>{m.pageCount} pages</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">1. Provenance-Aware Facts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every fact is tagged: <span className="font-semibold text-emerald-700">Verified</span>, <span className="font-semibold text-sky-700">User Provided</span>, <span className="font-semibold text-purple-700">Inferred</span>, or <span className="font-semibold text-amber-700">Estimated</span>. AI inferences never silently masquerade as authoritative company records.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">2. Authoritative Methodology Versioning</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Methodology matching is executed strictly against official CCTS standards. Incomplete evidence returns <span className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">INSUFFICIENT_INFORMATION</span> instead of forced, fabricated eligibility claims.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">3. Deterministic CCTS Equations</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All carbon calculations use exact equations from BEE standards (e.g. ACM0002, AM0124, ACM0022). Calculations with missing parameters halt with <span className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">INSUFFICIENT_DATA</span>.
          </p>
        </div>
      </section>

      {/* Assessment Flow Steps Overview */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 max-w-6xl mx-auto shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">The 9-Step Assessment Loop</h2>
          <p className="text-sm text-slate-600">
            From initial sector selection to an evidence-backed preliminary report in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-center">
          {[
            { step: '1', title: 'Sector', desc: 'Select CCTS scope' },
            { step: '2', title: 'Profile', desc: 'Business inputs' },
            { step: '3', title: 'Research', desc: 'Web discovery' },
            { step: '4', title: 'Facts', desc: 'Provenance tagging' },
            { step: '5', title: 'Screening', desc: 'Official CCTS fit' },
            { step: '6', title: 'Gaps', desc: 'Missing data' },
            { step: '7', title: 'Questions', desc: 'User clarification' },
            { step: '8', title: 'Calculations', desc: 'Deterministic run' },
            { step: '9', title: 'Report', desc: 'Executive briefing' },
          ].map((s) => (
            <div key={s.step} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col items-center">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center mb-1.5">
                {s.step}
              </span>
              <span className="text-xs font-bold text-slate-900">{s.title}</span>
              <span className="text-[11px] text-slate-500 leading-tight">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
