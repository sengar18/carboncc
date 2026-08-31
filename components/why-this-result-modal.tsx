// ==============================================================================
// CARBONSCOUT INDIA — 'WHY THIS RESULT?' EVIDENCE PROVENANCE EXPLORER
// ==============================================================================

'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  BookOpen,
  ExternalLink,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ProvenanceBadge } from './provenance-badge';
import { Fact, ResearchSource, MethodologyRequirement } from '@/lib/db/schema';

export interface ConclusionItem {
  id: string;
  title: string;
  conclusionValue: string;
  category: 'METHODOLOGY_MATCH' | 'DETERMINISTIC_CALCULATION' | 'OPPORTUNITY_SCORE' | 'DATA_GAP';
  reasoningType: 'DETERMINISTIC_MATH' | 'AI_STRUCTURED_REASONING' | 'REGULATORY_GATE_CHECK' | 'DATA_UNAVAILABLE';
  methodologyRequirement?: string;
  methodologyCode?: string;
  formulaReference?: string;
  supportingFacts: Fact[];
  sources: ResearchSource[];
  explanation: string;
  confidence: number;
}

interface WhyThisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  conclusion: ConclusionItem | null;
}

export function WhyThisResultModal({ isOpen, onClose, conclusion }: WhyThisResultModalProps) {
  if (!isOpen || !conclusion) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evidence & Provenance Audit</h3>
              <p className="text-[11px] text-slate-500">Why was this conclusion reached?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Target Conclusion */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Assessed Output / Conclusion
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                {conclusion.category.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">{conclusion.title}</div>
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
              {conclusion.conclusionValue}
            </div>
          </div>

          {/* Reasoning Engine Classification */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reasoning Engine</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                {conclusion.reasoningType === 'DETERMINISTIC_MATH' ? (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    <span>Deterministic Math Rule</span>
                  </>
                ) : conclusion.reasoningType === 'AI_STRUCTURED_REASONING' ? (
                  <>
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Reasoning (Groq)</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Regulatory Gate Check</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidence Level</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{Math.round(conclusion.confidence * 100)}% Verified</span>
              </div>
            </div>
          </div>

          {/* Methodology / Formula Reference */}
          {(conclusion.methodologyCode || conclusion.formulaReference) && (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Regulatory Methodology Standard
              </span>
              <div className="font-mono text-xs font-bold text-slate-800">
                {conclusion.methodologyCode || 'CCTS Official Gazette Standard'}
              </div>
              {conclusion.formulaReference && (
                <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200">
                  Equation: {conclusion.formulaReference}
                </div>
              )}
              {conclusion.methodologyRequirement && (
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Requirement: {conclusion.methodologyRequirement}
                </p>
              )}
            </div>
          )}

          {/* Detailed Explanation */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Audit Rationale</span>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
              {conclusion.explanation}
            </p>
          </div>

          {/* Underlying Facts & Provenance */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Supporting Evidence & Facts ({conclusion.supportingFacts.length})
            </span>
            {conclusion.supportingFacts.length === 0 ? (
              <div className="p-3 rounded-lg bg-slate-50 text-slate-400 text-xs italic">
                No specific factual inputs required for this regulatory gate check.
              </div>
            ) : (
              <div className="space-y-2">
                {conclusion.supportingFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        {fact.fact_type}
                      </span>
                      <ProvenanceBadge status={fact.status} confidence={fact.confidence} />
                    </div>
                    <div className="text-xs font-semibold text-slate-900">
                      Value: <span className="font-mono text-emerald-800">{fact.value_raw} {fact.unit || ''}</span>
                    </div>
                    {fact.source_citation && (
                      <p className="text-[11px] text-slate-500">
                        Citation: {fact.source_citation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Citations & Source URLs */}
          {conclusion.sources.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Discovered Sources ({conclusion.sources.length})
              </span>
              <div className="space-y-1.5">
                {conclusion.sources.map((src) => (
                  <div
                    key={src.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div className="truncate max-w-md">
                      <span className="font-semibold text-slate-800 block truncate">{src.title || src.url}</span>
                      <span className="text-[10px] font-mono text-slate-500 truncate block">{src.url}</span>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 p-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>CarbonScout India Evidence Verifier</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
