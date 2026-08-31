// ==============================================================================
// CARBONSCOUT INDIA — UNIFIED DATABASE REPOSITORY LAYER
// ==============================================================================
// Automatically persists to Supabase PostgreSQL when DATABASE_PROVIDER=supabase
// and seamlessly falls back to MemoryStore in mock/test/offline environments.
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';
import { memoryStore, MemoryStore } from './memory-store';
import {
  Organization,
  Project,
  ResearchSource,
  Fact,
  Methodology,
  MethodologyRequirement,
  Assessment,
  AssessmentInput,
  Question,
  DocumentRecord,
  CalculationRun,
  Contact,
  AuditLog,
} from './schema';

export class DatabaseService {
  private static instance: DatabaseService;
  private supabase: SupabaseClient | null = null;
  private memory: MemoryStore;

  private constructor() {
    this.memory = memoryStore;
    if (config.supabaseUrl && (config.supabaseServiceRoleKey || config.supabaseAnonKey)) {
      const key = config.supabaseServiceRoleKey || config.supabaseAnonKey || '';
      try {
        this.supabase = createClient(config.supabaseUrl, key, {
          auth: { persistSession: false },
        });
      } catch (err) {
        console.warn('Supabase client init warning, using memory fallback:', err);
      }
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // --- ORGANIZATIONS ---
  async getOrganizationById(id: string): Promise<Organization | undefined> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();
        if (data && !error) return data as Organization;
      } catch (err) {
        console.warn('Supabase getOrganization error, falling back to memory:', err);
      }
    }
    return this.memory.getOrganizationById(id);
  }

  async createOrganization(org: Organization): Promise<Organization> {
    this.memory.organizations.set(org.id, org);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('organizations').upsert(org);
      } catch (err) {
        console.warn('Supabase upsert org error:', err);
      }
    }
    return org;
  }

  // --- PROJECTS ---
  async getProjectById(id: string): Promise<Project | undefined> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        if (data && !error) return data as Project;
      } catch (err) {
        console.warn('Supabase getProject error, falling back to memory:', err);
      }
    }
    return this.memory.getProjectById(id);
  }

  async getProjects(): Promise<Project[]> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && !error && data.length > 0) return data as Project[];
      } catch (err) {
        console.warn('Supabase getProjects error, falling back to memory:', err);
      }
    }
    return this.memory.getProjects();
  }

  async createProject(project: Project): Promise<Project> {
    this.memory.projects.set(project.id, project);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('projects').upsert(project);
      } catch (err) {
        console.warn('Supabase upsert project error:', err);
      }
    }
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const existing = await this.getProjectById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    this.memory.projects.set(id, updated);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('projects').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update project error:', err);
      }
    }
    return updated;
  }

  // --- RESEARCH SOURCES ---
  async getSourcesByProjectId(projectId: string): Promise<ResearchSource[]> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('research_sources')
          .select('*')
          .eq('project_id', projectId)
          .order('retrieved_at', { ascending: false });
        if (data && !error && data.length > 0) return data as ResearchSource[];
      } catch (err) {
        console.warn('Supabase getSources error, falling back to memory:', err);
      }
    }
    return this.memory.getSourcesByProjectId(projectId);
  }

  async createSource(source: ResearchSource): Promise<ResearchSource> {
    this.memory.researchSources.set(source.id, source);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('research_sources').upsert(source);
      } catch (err) {
        console.warn('Supabase upsert source error:', err);
      }
    }
    return source;
  }

  // --- FACTS ---
  async getFactsByProjectId(projectId: string): Promise<Fact[]> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('facts')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });
        if (data && !error && data.length > 0) return data as Fact[];
      } catch (err) {
        console.warn('Supabase getFacts error, falling back to memory:', err);
      }
    }
    return this.memory.getFactsByProjectId(projectId);
  }

  async createFact(fact: Fact): Promise<Fact> {
    this.memory.facts.set(fact.id, fact);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('facts').upsert(fact);
      } catch (err) {
        console.warn('Supabase upsert fact error:', err);
      }
    }
    return fact;
  }

  // --- ASSESSMENTS ---
  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single();
        if (data && !error) return data as Assessment;
      } catch (err) {
        console.warn('Supabase getAssessment error, falling back to memory:', err);
      }
    }
    return this.memory.assessments.get(id);
  }

  async getAssessmentsByProjectId(projectId: string): Promise<Assessment[]> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('assessments')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        if (data && !error && data.length > 0) return data as Assessment[];
      } catch (err) {
        console.warn('Supabase getAssessments error, falling back to memory:', err);
      }
    }
    return this.memory.getAssessmentsByProjectId(projectId);
  }

  async createAssessment(assessment: Assessment): Promise<Assessment> {
    this.memory.assessments.set(assessment.id, assessment);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('assessments').upsert(assessment);
      } catch (err) {
        console.warn('Supabase upsert assessment error:', err);
      }
    }
    return assessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const existing = await this.getAssessmentById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    this.memory.assessments.set(id, updated);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('assessments').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update assessment error:', err);
      }
    }
    return updated;
  }

  // --- QUESTIONS ---
  async getQuestionsByAssessmentId(assessmentId: string): Promise<Question[]> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('questions')
          .select('*')
          .eq('assessment_id', assessmentId)
          .order('created_at', { ascending: true });
        if (data && !error && data.length > 0) return data as Question[];
      } catch (err) {
        console.warn('Supabase getQuestions error, falling back to memory:', err);
      }
    }
    return this.memory.getQuestionsByAssessmentId(assessmentId);
  }

  async createQuestion(question: Question): Promise<Question> {
    this.memory.questions.set(question.id, question);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('questions').upsert(question);
      } catch (err) {
        console.warn('Supabase upsert question error:', err);
      }
    }
    return question;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined> {
    const existing = this.memory.questions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.memory.questions.set(id, updated);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('questions').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update question error:', err);
      }
    }
    return updated;
  }

  // --- CALCULATION RUNS ---
  async getCalculationRunsByAssessmentId(assessmentId: string): Promise<CalculationRun[]> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('calculation_runs')
          .select('*')
          .eq('assessment_id', assessmentId)
          .order('executed_at', { ascending: false });
        if (data && !error && data.length > 0) return data as CalculationRun[];
      } catch (err) {
        console.warn('Supabase getCalculationRuns error, falling back to memory:', err);
      }
    }
    return this.memory.getCalculationRunsByAssessmentId(assessmentId);
  }

  async createCalculationRun(run: CalculationRun): Promise<CalculationRun> {
    this.memory.calculationRuns.set(run.id, run);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('calculation_runs').upsert(run);
      } catch (err) {
        console.warn('Supabase upsert calculation_run error:', err);
      }
    }
    return run;
  }

  // --- CONTACTS ---
  async getContactsByOrgId(orgId: string): Promise<Contact[]> {
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        const { data, error } = await this.supabase
          .from('contacts')
          .select('*')
          .eq('organization_id', orgId);
        if (data && !error && data.length > 0) return data as Contact[];
      } catch (err) {
        console.warn('Supabase getContacts error:', err);
      }
    }
    return this.memory.getContactsByOrgId(orgId);
  }

  async createContact(contact: Contact): Promise<Contact> {
    this.memory.contacts.set(contact.id, contact);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('contacts').upsert(contact);
      } catch (err) {
        console.warn('Supabase upsert contact error:', err);
      }
    }
    return contact;
  }

  // --- DOCUMENTS ---
  async getDocumentsByProjectId(projectId: string): Promise<DocumentRecord[]> {
    return this.memory.getDocumentsByProjectId(projectId);
  }

  async createDocument(doc: DocumentRecord): Promise<DocumentRecord> {
    this.memory.documents.set(doc.id, doc);
    return doc;
  }

  // --- AUDIT LOGS ---
  async addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const entry = this.memory.addAuditLog(log);
    if (this.supabase && config.databaseProvider === 'supabase') {
      try {
        await this.supabase.from('audit_logs').insert(entry);
      } catch (err) {
        console.warn('Supabase insert audit log error:', err);
      }
    }
    return entry;
  }

  async getAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    return this.memory.getAuditLogs(entityType, entityId);
  }

  // --- METHODOLOGIES (AUTHORITATIVE CCTS CACHE) ---
  getMethodologies(): Methodology[] {
    return this.memory.getMethodologies();
  }

  getMethodologyById(id: string): Methodology | undefined {
    return this.memory.methodologies.get(id);
  }
}

export const db = DatabaseService.getInstance();
