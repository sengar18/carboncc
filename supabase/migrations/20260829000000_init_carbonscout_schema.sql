-- ==============================================================================
-- CARBONSCOUT INDIA — CORE POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Migration: 20260829000000_init_carbonscout_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    cin VARCHAR(50),
    website VARCHAR(500),
    industry_sector VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sector VARCHAR(100) NOT NULL,
    location_state VARCHAR(100) NOT NULL,
    location_district VARCHAR(100),
    annual_production_capacity NUMERIC,
    annual_production_unit VARCHAR(50),
    existing_carbon_credit_project BOOLEAN DEFAULT FALSE,
    pipeline_status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, RESEARCHED, CONTACTED, RESPONDED, QUALIFIED, ASSESSMENT, HANDOFF, CLOSED, REJECTED
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. RESEARCH_SOURCES
CREATE TABLE IF NOT EXISTS research_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    title VARCHAR(500),
    source_type VARCHAR(50) NOT NULL DEFAULT 'WEB_PAGE', -- WEB_PAGE, PDF, REGULATORY_FILING, USER_DOCUMENT
    raw_content TEXT,
    content_hash VARCHAR(64),
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FACTS & PROVENANCE
CREATE TABLE IF NOT EXISTS facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_id UUID REFERENCES research_sources(id) ON DELETE SET NULL,
    fact_type VARCHAR(100) NOT NULL, -- e.g. ANNUAL_BIOMASS_RESIDUE_MT, GRID_CONNECTED, CAPTIVE_POWER_CAPACITY_KW
    value_raw TEXT NOT NULL,
    value_numeric NUMERIC,
    unit VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED', -- VERIFIED, USER_PROVIDED, INFERRED, ESTIMATED, UNVERIFIED, UNKNOWN
    confidence NUMERIC(3, 2) DEFAULT 1.00, -- 0.00 to 1.00
    source_citation TEXT,
    source_url VARCHAR(1000),
    source_location VARCHAR(255), -- Page / Section
    extraction_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. METHODOLOGIES
CREATE TABLE IF NOT EXISTS methodologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g. SYNTH-AGRI-001
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    source_url VARCHAR(1000),
    source_document VARCHAR(255),
    document_hash VARCHAR(64),
    retrieval_date DATE,
    effective_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_synthetic BOOLEAN DEFAULT FALSE, -- Flag to strictly segregate synthetic testing data
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. METHODOLOGY_REQUIREMENTS
CREATE TABLE IF NOT EXISTS methodology_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    methodology_id UUID NOT NULL REFERENCES methodologies(id) ON DELETE CASCADE,
    requirement_key VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirement_type VARCHAR(50) NOT NULL, -- APPLICABILITY, ADDITIONALITY, MONITORING, BASELINE
    operator VARCHAR(20) NOT NULL DEFAULT 'EQUALS', -- EQUALS, GREATER_THAN, LESS_THAN, CONTAINS, EXISTS
    expected_value TEXT,
    unit VARCHAR(50),
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ASSESSMENTS
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    methodology_id UUID REFERENCES methodologies(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, COMPLETED, INSUFFICIENT_INFORMATION, REJECTED
    opportunity_score INT, -- 0 to 100
    score_category VARCHAR(50), -- HIGH_PRELIMINARY_POTENTIAL, INVESTIGATE, WEAK_OR_UNCERTAIN, LOW_POTENTIAL
    score_breakdown JSONB, -- Component scores: fit, data, scale, additionality, measurement, docs, commercial
    applicability_summary TEXT,
    red_flags JSONB,
    uncertainty_notes TEXT,
    next_steps JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ASSESSMENT_INPUTS
CREATE TABLE IF NOT EXISTS assessment_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    fact_id UUID REFERENCES facts(id) ON DELETE SET NULL,
    input_key VARCHAR(100) NOT NULL,
    input_value_raw TEXT NOT NULL,
    normalized_numeric_value NUMERIC,
    normalized_unit VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. QUESTIONS (DATA GAPS)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_key VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    explanation TEXT,
    input_type VARCHAR(50) NOT NULL DEFAULT 'NUMBER', -- NUMBER, BOOLEAN, TEXT, SELECT
    suggested_unit VARCHAR(50),
    options JSONB,
    user_response TEXT,
    is_answered BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_size_bytes INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- AUDIT_REPORT, ELECTRICITY_BILL, PRODUCTION_LOG, ENVIRONMENTAL_CLEARANCE
    upload_status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED', -- UPLOADED, PROCESSING, PROCESSED, FAILED
    extracted_text_preview TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CALCULATION_RUNS
CREATE TABLE IF NOT EXISTS calculation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    methodology_id UUID NOT NULL REFERENCES methodologies(id) ON DELETE CASCADE,
    formula_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, INSUFFICIENT_DATA, ERROR
    inputs_snapshot JSONB NOT NULL,
    normalized_inputs JSONB NOT NULL,
    outputs_snapshot JSONB NOT NULL,
    assumptions_log JSONB,
    calculation_explanation TEXT,
    is_synthetic BOOLEAN DEFAULT FALSE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. CONTACTS
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    designation VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL, -- RESEARCH_STARTED, RESEARCH_COMPLETED, FACT_CREATED, ASSESSMENT_GENERATED, etc.
    actor_id VARCHAR(100) DEFAULT 'system',
    actor_role VARCHAR(50) DEFAULT 'SYSTEM',
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_facts_project ON facts(project_id);
CREATE INDEX IF NOT EXISTS idx_sources_project ON research_sources(project_id);
CREATE INDEX IF NOT EXISTS idx_assessments_project ON assessments(project_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);

-- Row Level Security (RLS) Setup
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE methodologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE methodology_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read for methodologies (reference data)
CREATE POLICY "Public methodologies read" ON methodologies FOR SELECT USING (true);
CREATE POLICY "Public methodology requirements read" ON methodology_requirements FOR SELECT USING (true);

-- Authenticated/Service policies
CREATE POLICY "Service full access organizations" ON organizations USING (true) WITH CHECK (true);
CREATE POLICY "Service full access projects" ON projects USING (true) WITH CHECK (true);
CREATE POLICY "Service full access facts" ON facts USING (true) WITH CHECK (true);
CREATE POLICY "Service full access sources" ON research_sources USING (true) WITH CHECK (true);
CREATE POLICY "Service full access assessments" ON assessments USING (true) WITH CHECK (true);
CREATE POLICY "Service full access questions" ON questions USING (true) WITH CHECK (true);
CREATE POLICY "Service full access audit_logs" ON audit_logs USING (true) WITH CHECK (true);
CREATE POLICY "Service full access calculation_runs" ON calculation_runs USING (true) WITH CHECK (true);
CREATE POLICY "Service full access contacts" ON contacts USING (true) WITH CHECK (true);
CREATE POLICY "Service full access methodology_requirements" ON methodology_requirements USING (true) WITH CHECK (true);
CREATE POLICY "Service full access assessment_inputs" ON assessment_inputs USING (true) WITH CHECK (true);

-- Grant schema & table permissions to Supabase PostgREST roles (Row-Level Security enforces access boundaries)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

