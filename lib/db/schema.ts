// ==============================================================================
// CARBONSCOUT INDIA — TYPESCRIPT DATA MODELS & DATABASE TYPES
// ==============================================================================

export type FactStatus =
  | 'VERIFIED'
  | 'USER_PROVIDED'
  | 'INFERRED'
  | 'ESTIMATED'
  | 'UNVERIFIED'
  | 'UNKNOWN';

export type PipelineStatus =
  | 'NEW'
  | 'RESEARCHED'
  | 'CONTACTED'
  | 'RESPONDED'
  | 'QUALIFIED'
  | 'ASSESSMENT'
  | 'HANDOFF'
  | 'CLOSED'
  | 'REJECTED';

export type AssessmentStatus =
  | 'DRAFT'
  | 'COMPLETED'
  | 'INSUFFICIENT_INFORMATION'
  | 'REJECTED';

export type OpportunityScoreCategory =
  | 'HIGH_PRELIMINARY_POTENTIAL'
  | 'INVESTIGATE'
  | 'WEAK_OR_UNCERTAIN'
  | 'LOW_POTENTIAL';

export interface Organization {
  id: string;
  name: string;
  legal_name?: string;
  cin?: string;
  website?: string;
  industry_sector: string;
  state: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  sector: string;
  location_state: string;
  location_district?: string;
  annual_production_capacity?: number;
  annual_production_unit?: string;
  existing_carbon_credit_project: boolean;
  pipeline_status: PipelineStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ResearchSource {
  id: string;
  project_id: string;
  url: string;
  title?: string;
  source_type: 'WEB_PAGE' | 'PDF' | 'REGULATORY_FILING' | 'USER_DOCUMENT';
  raw_content?: string;
  content_hash?: string;
  retrieved_at: string;
  created_at: string;
}

export interface Fact {
  id: string;
  project_id: string;
  source_id?: string;
  fact_type: string;
  value_raw: string;
  value_numeric?: number;
  unit?: string;
  status: FactStatus;
  confidence: number; // 0.00 to 1.00
  source_citation?: string;
  source_url?: string;
  source_location?: string;
  extraction_timestamp?: string;
  created_at: string;
  updated_at: string;
}



export interface ExternalDependency {
  title: string;
  exact_wording: string;
  section: string;
  page: number;
  paragraph?: string;
  impact: string;
  is_available: boolean;
  verification_status: string;
}

export interface Methodology {
  id: string;
  code: string;
  name: string;
  sector: string;
  sectoral_scope_code: string;
  version: string;
  publication_date: string;
  effective_date?: string;
  issuing_authority: string;
  reference_unfccc_cdm?: string[];
  page_count: number;
  source_url?: string;
  source_document?: string;
  document_hash?: string;
  retrieval_date?: string;
  is_active: boolean;
  is_synthetic: boolean;
  verification_status: FactStatus;
  adopted_tools: string[];
  external_dependencies: ExternalDependency[];
  description: string;
  created_at: string;
  updated_at: string;
}

export interface MethodologyRequirement {
  id: string;
  methodology_id: string;
  requirement_key: string;
  description: string;
  requirement_type: 'APPLICABILITY' | 'ADDITIONALITY' | 'MONITORING' | 'BASELINE';
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'BOOLEAN' | 'IN_RANGE' | 'EXISTS';
  expected_value?: string;
  unit?: string;
  is_mandatory: boolean;
  page_reference: number;
  section_reference: string;
  paragraph_reference?: string;
  table_reference?: string;
  provenance_quote: string;
  verification_status: FactStatus;
  created_at: string;
}

export interface ScoreBreakdown {
  methodology_fit: { score: number; max: number; rationale: string };
  data_availability: { score: number; max: number; rationale: string };
  project_scale: { score: number; max: number; rationale: string };
  additionality_signal: { score: number; max: number; rationale: string };
  measurement_feasibility: { score: number; max: number; rationale: string };
  documentation: { score: number; max: number; rationale: string };
  commercial_potential: { score: number; max: number; rationale: string };
}

export interface Assessment {
  id: string;
  project_id: string;
  methodology_id?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  opportunity_score: number;
  score_category: OpportunityScoreCategory;
  score_breakdown: ScoreBreakdown;
  applicability_summary: string;
  red_flags: string[];
  uncertainty_notes: string;
  next_steps: string[];
  created_at: string;
  updated_at: string;
}

export interface AssessmentInput {
  id: string;
  assessment_id: string;
  fact_id?: string;
  input_key: string;
  input_value_raw: string;
  normalized_numeric_value?: number;
  normalized_unit?: string;
  created_at: string;
}

export interface Question {
  id: string;
  assessment_id: string;
  question_key: string;
  question_text: string;
  explanation?: string;
  input_type: 'NUMBER' | 'BOOLEAN' | 'TEXT' | 'SELECT';
  suggested_unit?: string;
  options?: string[];
  user_response?: string;
  is_answered: boolean;
  answered_at?: string;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  project_id: string;
  file_name: string;
  storage_path: string;
  file_size_bytes: number;
  mime_type: string;
  document_type: 'AUDIT_REPORT' | 'ELECTRICITY_BILL' | 'PRODUCTION_LOG' | 'WEIGHBRIDGE_RECORD' | 'ENVIRONMENTAL_CLEARANCE' | 'GENERAL';
  upload_status: 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
  extracted_text_preview?: string;
  created_at: string;
}

export interface CalculationRun {
  id: string;
  assessment_id: string;
  methodology_id: string;
  formula_id: string;
  status: 'SUCCESS' | 'INSUFFICIENT_DATA' | 'CALCULATION_UNAVAILABLE' | 'ERROR';
  inputs_snapshot: Record<string, any>;
  normalized_inputs: Record<string, any>;
  outputs_snapshot: Record<string, any>;
  assumptions_log?: string[];
  calculation_explanation?: string;
  is_synthetic: boolean;
  executed_at: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  designation?: string;
  is_primary: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  actor_role: string;
  details?: Record<string, any>;
  created_at: string;
}
