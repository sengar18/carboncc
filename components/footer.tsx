// ==============================================================================
// CARBONSCOUT INDIA — FOOTER WITH AUDIT & NON-FABRICATION DISCLAIMERS
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-200">
          <div>
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Evidence-First Principles
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              CarbonScout India strictly enforces provenance traceability. Facts are classified as Verified, User Provided, Inferred, Estimated, Unverified, or Unknown. Never guarantees carbon credit issuance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Regulatory Disclaimer
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides preliminary opportunity intelligence for Indian commercial enterprises. This platform is NOT a certification body, validation agency, or Indian BEE/CCTS carbon registry.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Methodology Transparency
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test methodologies are explicitly labelled <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">SYNTHETIC_TEST_METHODOLOGY</code>. Real authoritative standards are ingested strictly from public verified publications.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            &copy; {new Date().getFullYear()} CarbonScout India — AI Carbon Opportunity Intelligence Platform.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-emerald-700 transition">
              Admin Portal
            </Link>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Build V1 Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
