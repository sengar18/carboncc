// ==============================================================================
// CARBONSCOUT INDIA — UNIFIED DATABASE REPOSITORY LAYER
// ==============================================================================
// Interacts with Supabase PostgreSQL when DATABASE_PROVIDER=supabase.
// Production enforces strict database persistence without silent memory fallback.
// In-memory store is reserved exclusively for isolated mock/test environments.
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
        if (config.databaseProvider === 'supabase') {
          throw new Error(`Failed to initialize Supabase client: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        console.warn('Supabase client init warning:', err);
      }
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private handleDbError(operation: string, error: any): void {
    const msg = `Database error during ${operation}: ${error?.message || JSON.stringify(error)}`;
    if (config.databaseProvider === 'supabase' || config.nodeEnv === 'production') {
      throw new Error(msg);
    }
    console.warn(`[DEV-WARNING] ${msg}`);
  }

  // --- ORGANIZATIONS ---
  async getOrganizationById(id: string): Promise<Organization | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return undefined; // Record not found
        this.handleDbError('getOrganizationById', error);
      }
      return data as Organization;
    }
    return this.memory.getOrganizationById(id);
  }

  async createOrganization(org: Organization): Promise<Organization> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('organizations').upsert(org).select().single();
      if (error) this.handleDbError('createOrganization', error);
      return (data || org) as Organization;
    }
    this.memory.organizations.set(org.id, org);
    return org;
  }

  // --- PROJECTS ---
  async getProjectById(id: string): Promise<Project | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return undefined; // Record not found
        this.handleDbError('getProjectById', error);
      }
      return data as Project;
    }
    return this.memory.getProjectById(id);
  }

  async getProjects(): Promise<Project[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) this.handleDbError('getProjects', error);
      return (data || []) as Project[];
    }
    return this.memory.getProjects();
  }

  async createProject(project: Project): Promise<Project> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('projects').upsert(project).select().single();
      if (error) this.handleDbError('createProject', error);
      return (data || project) as Project;
    }
    this.memory.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const updatedPayload = { ...updates, updated_at: new Date().toISOString() };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('projects')
        .update(updatedPayload)
        .eq('id', id)
        .select()
        .single();
      if (error) this.handleDbError('updateProject', error);
      return data as Project;
    }
    const existing = await this.getProjectById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updatedPayload };
    this.memory.projects.set(id, updated);
    return updated;
  }

  // --- RESEARCH SOURCES ---
  async getSourcesByProjectId(projectId: string): Promise<ResearchSource[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('research_sources')
        .select('*')
        .eq('project_id', projectId)
        .order('retrieved_at', { ascending: false });
      if (error) this.handleDbError('getSourcesByProjectId', error);
      return (data || []) as ResearchSource[];
    }
    return this.memory.getSourcesByProjectId(projectId);
  }

  async createSource(source: ResearchSource): Promise<ResearchSource> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('research_sources').upsert(source).select().single();
      if (error) this.handleDbError('createSource', error);
      return (data || source) as ResearchSource;
    }
    this.memory.researchSources.set(source.id, source);
    return source;
  }

  // --- FACTS ---
  async getFactsByProjectId(projectId: string): Promise<Fact[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('facts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      if (error) this.handleDbError('getFactsByProjectId', error);
      return (data || []) as Fact[];
    }
    return this.memory.getFactsByProjectId(projectId);
  }

  async createFact(fact: Fact): Promise<Fact> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('facts').upsert(fact).select().single();
      if (error) this.handleDbError('createFact', error);
      return (data || fact) as Fact;
    }
    this.memory.facts.set(fact.id, fact);
    return fact;
  }

  // --- ASSESSMENTS ---
  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return undefined; // Record not found
        this.handleDbError('getAssessmentById', error);
      }
      return data as Assessment;
    }
    return this.memory.assessments.get(id);
  }

  async getAssessmentsByProjectId(projectId: string): Promise<Assessment[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('assessments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) this.handleDbError('getAssessmentsByProjectId', error);
      return (data || []) as Assessment[];
    }
    return this.memory.getAssessmentsByProjectId(projectId);
  }

  async createAssessment(assessment: Assessment): Promise<Assessment> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('assessments').upsert(assessment).select().single();
      if (error) this.handleDbError('createAssessment', error);
      return (data || assessment) as Assessment;
    }
    this.memory.assessments.set(assessment.id, assessment);
    return assessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const updatedPayload = { ...updates, updated_at: new Date().toISOString() };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('assessments')
        .update(updatedPayload)
        .eq('id', id)
        .select()
        .single();
      if (error) this.handleDbError('updateAssessment', error);
      return data as Assessment;
    }
    const existing = await this.getAssessmentById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updatedPayload };
    this.memory.assessments.set(id, updated);
    return updated;
  }

  // --- QUESTIONS ---
  async getQuestionsByAssessmentId(assessmentId: string): Promise<Question[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: true });
      if (error) this.handleDbError('getQuestionsByAssessmentId', error);
      return (data || []) as Question[];
    }
    return this.memory.getQuestionsByAssessmentId(assessmentId);
  }

  async createQuestion(question: Question): Promise<Question> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('questions').upsert(question).select().single();
      if (error) this.handleDbError('createQuestion', error);
      return (data || question) as Question;
    }
    this.memory.questions.set(question.id, question);
    return question;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) this.handleDbError('updateQuestion', error);
      return data as Question;
    }
    const existing = this.memory.questions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.memory.questions.set(id, updated);
    return updated;
  }

  // --- CALCULATION RUNS ---
  async getCalculationRunsByAssessmentId(assessmentId: string): Promise<CalculationRun[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('calculation_runs')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('executed_at', { ascending: false });
      if (error) this.handleDbError('getCalculationRunsByAssessmentId', error);
      return (data || []) as CalculationRun[];
    }
    return this.memory.getCalculationRunsByAssessmentId(assessmentId);
  }

  async createCalculationRun(run: CalculationRun): Promise<CalculationRun> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('calculation_runs').upsert(run).select().single();
      if (error) this.handleDbError('createCalculationRun', error);
      return (data || run) as CalculationRun;
    }
    this.memory.calculationRuns.set(run.id, run);
    return run;
  }

  // --- CONTACTS ---
  async getContactsByOrgId(orgId: string): Promise<Contact[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('contacts')
        .select('*')
        .eq('organization_id', orgId);
      if (error) this.handleDbError('getContactsByOrgId', error);
      return (data || []) as Contact[];
    }
    return this.memory.getContactsByOrgId(orgId);
  }

  async createContact(contact: Contact): Promise<Contact> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('contacts').upsert(contact).select().single();
      if (error) this.handleDbError('createContact', error);
      return (data || contact) as Contact;
    }
    this.memory.contacts.set(contact.id, contact);
    return contact;
  }

  // --- DOCUMENTS ---
  async getDocumentsByProjectId(projectId: string): Promise<DocumentRecord[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) this.handleDbError('getDocumentsByProjectId', error);
      return (data || []) as DocumentRecord[];
    }
    return this.memory.getDocumentsByProjectId(projectId);
  }

  async createDocument(doc: DocumentRecord): Promise<DocumentRecord> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('documents').upsert(doc).select().single();
      if (error) this.handleDbError('createDocument', error);
      return (data || doc) as DocumentRecord;
    }
    this.memory.documents.set(doc.id, doc);
    return doc;
  }

  // --- AUDIT LOGS ---
  async addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const entry: AuditLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}`,
      ...log,
      created_at: new Date().toISOString(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('audit_logs').insert(entry).select().single();
      if (error) this.handleDbError('addAuditLog', error);
      return (data || entry) as AuditLog;
    }
    return this.memory.addAuditLog(entry);
  }

  async getAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      let query = this.supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (entityType) query = query.eq('entity_type', entityType);
      if (entityId) query = query.eq('entity_id', entityId);
      const { data, error } = await query;
      if (error) this.handleDbError('getAuditLogs', error);
      return (data || []) as AuditLog[];
    }
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
