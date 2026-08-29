// ==============================================================================
// CARBONSCOUT INDIA — METHODOLOGY KNOWLEDGE BASE DOMAIN TYPES
// ==============================================================================

export type MethodologyType = 'REAL_AUTHORITATIVE_METHODOLOGY' | 'SYNTHETIC_TEST_METHODOLOGY';

export interface ExternalDependencySpec {
  title: string;
  exactWording: string;
  section: string;
  page: number;
  paragraph?: string;
  impact: string;
  isAvailable: boolean;
  verificationStatus: string;
}

export interface CalculationFormulaSpec {
  formulaId: string;
  name: string;
  equationText: string;
  equationNumber: string;
  section: string;
  page: number;
  description: string;
  outputUnit: string;
  requiredParameters: Array<{
    name: string;
    symbol: string;
    unit: string;
    description: string;
    source: string;
    isMonitored: boolean;
    defaultValue?: number;
  }>;
}

export interface ApplicabilityCondition {
  id: string;
  field: string;
  label: string;
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN_RANGE' | 'CONTAINS' | 'BOOLEAN';
  expectedValue: any;
  unit?: string;
  isMandatory: boolean;
  failureMessage: string;
  pageReference: number;
  sectionReference: string;
  paragraphReference?: string;
  tableReference?: string;
  provenanceQuote: string;
}

export interface MonitoringRequirement {
  id: string;
  parameter: string;
  parameterSymbol?: string;
  unit?: string;
  frequency: string; // e.g. 'CONTINUOUS', 'MONTHLY', 'ANNUAL', 'BATCH'
  equipment: string;
  standard: string;
  pageReference: number;
  sectionReference: string;
  tableReference?: string;
  qaQcProcedure?: string;
}

export interface EvidenceRequirement {
  id: string;
  documentType: string;
  description: string;
  isMandatory: boolean;
  pageReference: number;
  sectionReference: string;
  provenanceQuote: string;
}

export interface MethodologyVersion {
  code: string;
  name: string;
  type: MethodologyType;
  version: string;
  sector: string;
  sectoralScopeCode: string;
  publicationDate: string;
  effectiveDate: string;
  issuingAuthority: string;
  referenceUnfcccCdm: string[];
  pageCount: number;
  sourceUrl?: string;
  sourceDocument?: string;
  documentHash?: string;
  retrievalDate?: string;
  isActive: boolean;
  isSynthetic: boolean;
  verificationStatus: string;
  description: string;
  adoptedTools: string[];
  externalDependencies: ExternalDependencySpec[];
  applicabilityConditions: ApplicabilityCondition[];
  monitoringRequirements: MonitoringRequirement[];
  evidenceRequirements: EvidenceRequirement[];
  calculationFormulas: CalculationFormulaSpec[];
}


export interface ConditionEvaluationResult {
  conditionId: string;
  field: string;
  label: string;
  status: 'MET' | 'FAILED' | 'MISSING_DATA' | 'CONTRADICTORY';
  actualValue?: any;
  expectedValue: any;
  message: string;
  evidenceReference?: string;
}

export interface MethodologyMatchingSummary {
  methodology: MethodologyVersion;
  methodologyCode: string;
  status: 'MATCH' | 'POTENTIAL_MATCH' | 'MISMATCH' | 'INSUFFICIENT_INFORMATION';
  conditionsEvaluated: ConditionEvaluationResult[];
  matchedCount: number;
  failedCount: number;
  missingCount: number;
  contradictoryCount: number;
  confidenceScore: number;
  summary: string;
  missingDataGaps: string[];
  redFlags: string[];
}
