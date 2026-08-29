// ==============================================================================
// CARBONSCOUT INDIA — FACT PROVENANCE BADGE COMPONENT
// ==============================================================================

import React from 'react';
import { FactStatus } from '@/lib/db/schema';
import { CheckCircle2, User, Sparkles, Calculator, AlertTriangle, HelpCircle } from 'lucide-react';

interface ProvenanceBadgeProps {
  status: FactStatus;
  confidence?: number;
  className?: string;
  showIcon?: boolean;
}

export function ProvenanceBadge({
  status,
  confidence,
  className = '',
  showIcon = true,
}: ProvenanceBadgeProps) {
  let badgeStyle = '';
  let label = status as string;
  let IconComponent = HelpCircle;

  switch (status) {
    case 'VERIFIED':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700';
      label = 'Verified';
      IconComponent = CheckCircle2;
      break;
    case 'USER_PROVIDED':
      badgeStyle = 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-700';
      label = 'User Provided';
      IconComponent = User;
      break;
    case 'INFERRED':
      badgeStyle = 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-700';
      label = 'Inferred';
      IconComponent = Sparkles;
      break;
    case 'ESTIMATED':
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700';
      label = 'Estimated';
      IconComponent = Calculator;
      break;
    case 'UNVERIFIED':
      badgeStyle = 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-700';
      label = 'Unverified';
      IconComponent = AlertTriangle;
      break;
    case 'UNKNOWN':
    default:
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600';
      label = 'Unknown';
      IconComponent = HelpCircle;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle} ${className}`}
      title={`Provenance Status: ${label}${confidence !== undefined ? ` (Confidence: ${(confidence * 100).toFixed(0)}%)` : ''}`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
      {confidence !== undefined && (
        <span className="opacity-75 text-[10px]">({(confidence * 100).toFixed(0)}%)</span>
      )}
    </span>
  );
}
