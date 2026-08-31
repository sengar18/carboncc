// ==============================================================================
// CARBONSCOUT INDIA — CALCULATION ENGINE TYPES
// ==============================================================================

export type CalculationStatus = 'SUCCESS' | 'INSUFFICIENT_DATA' | 'CALCULATION_UNAVAILABLE' | 'ERROR';

export interface CalculationProvenanceCitation {
  documentCode: string;
  documentTitle: string;
  equationNumber: string;
  section: string;
  page: number;
  issuingAuthority: string;
}

export interface CalculationInputParam {
  key: string;
  label: string;
  valueRaw: string | number;
  unit?: string;
  isMandatory: boolean;
}

export interface NormalizedParam {
  key: string;
  label: string;
  normalizedValue: number;
  normalizedUnit: string;
}

export interface CalculationResult {
  formulaId: string;
  methodologyCode: string;
  isSynthetic: boolean;
  status: CalculationStatus;
  missingInputs?: string[];
  originalInputs: Record<string, any>;
  normalizedInputs: Record<string, number>;
  outputs: {
    estimatedAnnualAbatement_tCO2e?: number | null;
    baselineEmissions_tCO2e?: number | null;
    projectEmissions_tCO2e?: number | null;
    leakageEmissions_tCO2e?: number | null;
    uncertaintyRange_pct?: number | null;
  };
  provenanceCitations?: CalculationProvenanceCitation[];
  assumptions: string[];
  explanation: string;
  executedAt: string;
}

