-- CARBONSCOUT INDIA — PRIVILEGE AND RLS HARDENING
-- The application performs privileged server-side persistence with SUPABASE_SERVICE_ROLE_KEY.
-- Browser roles receive read-only access only to active methodology reference data.

REVOKE ALL ON TABLE public.organizations, public.projects, public.research_sources,
  public.facts, public.methodologies, public.methodology_requirements,
  public.assessments, public.assessment_inputs, public.questions, public.documents,
  public.calculation_runs, public.contacts, public.audit_logs
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.organizations, public.projects,
  public.research_sources, public.facts, public.methodologies,
  public.methodology_requirements, public.assessments, public.assessment_inputs,
  public.questions, public.documents, public.calculation_runs, public.contacts
  TO service_role;
GRANT SELECT, INSERT ON TABLE public.audit_logs TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO service_role;

-- Replace legacy unrestricted policies. Every server-managed table is inaccessible
-- to anonymous and authenticated Data API roles unless explicitly listed below.
DROP POLICY IF EXISTS "Public methodologies read" ON public.methodologies;
DROP POLICY IF EXISTS "Public methodology requirements read" ON public.methodology_requirements;
DROP POLICY IF EXISTS "Service full access organizations" ON public.organizations;
DROP POLICY IF EXISTS "Service full access projects" ON public.projects;
DROP POLICY IF EXISTS "Service full access facts" ON public.facts;
DROP POLICY IF EXISTS "Service full access sources" ON public.research_sources;
DROP POLICY IF EXISTS "Service full access assessments" ON public.assessments;
DROP POLICY IF EXISTS "Service full access questions" ON public.questions;
DROP POLICY IF EXISTS "Service full access audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Service full access calculation_runs" ON public.calculation_runs;
DROP POLICY IF EXISTS "Service full access contacts" ON public.contacts;
DROP POLICY IF EXISTS "Service full access methodology_requirements" ON public.methodology_requirements;
DROP POLICY IF EXISTS "Service full access assessment_inputs" ON public.assessment_inputs;

CREATE POLICY "service role manages organizations" ON public.organizations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages projects" ON public.projects FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages sources" ON public.research_sources FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages facts" ON public.facts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages methodologies" ON public.methodologies FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages methodology requirements" ON public.methodology_requirements FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages assessments" ON public.assessments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages assessment inputs" ON public.assessment_inputs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages questions" ON public.questions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages documents" ON public.documents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages calculation runs" ON public.calculation_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role manages contacts" ON public.contacts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service role reads audit logs" ON public.audit_logs FOR SELECT TO service_role USING (true);
CREATE POLICY "service role inserts audit logs" ON public.audit_logs FOR INSERT TO service_role WITH CHECK (true);

-- The only browser-readable reference data is the active methodology catalogue.
GRANT SELECT ON TABLE public.methodologies, public.methodology_requirements TO anon, authenticated;
CREATE POLICY "public reads active methodologies" ON public.methodologies FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public reads requirements for active methodologies" ON public.methodology_requirements FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.methodologies m WHERE m.id = methodology_requirements.methodology_id AND m.is_active = true));

-- Audit records are immutable after insertion. This protects them even if a future
-- table grant is accidentally expanded; only the database owner can alter the trigger.
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only';
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_audit_log_mutation() FROM PUBLIC, anon, authenticated, service_role;
DROP TRIGGER IF EXISTS audit_logs_prevent_mutation ON public.audit_logs;
CREATE TRIGGER audit_logs_prevent_mutation
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_mutation();
