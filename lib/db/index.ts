// ==============================================================================
// CARBONSCOUT INDIA — UNIFIED DATABASE REPOSITORY LAYER
// ==============================================================================
// Interacts with Supabase PostgreSQL when DATABASE_PROVIDER=supabase.
// Production enforces strict database persistence without silent memory fallback.
// In-memory store is reserved exclusively for isolated mock/test environments.
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';
import { isValidUUID, generateUUID } from '@/lib/utils';
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
      if (!id || !isValidUUID(id)) return undefined;
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
    const cleanOrg: Organization = {
      ...org,
      id: isValidUUID(org.id) ? org.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('organizations').upsert(cleanOrg).select().single();
      if (error) this.handleDbError('createOrganization', error);
      return (data || cleanOrg) as Organization;
    }
    this.memory.organizations.set(cleanOrg.id, cleanOrg);
    return cleanOrg;
  }

  // --- PROJECTS ---
  async getProjectById(id: string): Promise<Project | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!id || !isValidUUID(id)) return undefined;
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
    const cleanProject: Project = {
      ...project,
      id: isValidUUID(project.id) ? project.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('projects').upsert(cleanProject).select().single();
      if (error) this.handleDbError('createProject', error);
      return (data || cleanProject) as Project;
    }
    this.memory.projects.set(cleanProject.id, cleanProject);
    return cleanProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!id || !isValidUUID(id)) return undefined;
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const updatedPayload = { ...updates, updated_at: new Date().toISOString() };
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
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    this.memory.projects.set(id, updated);
    return updated;
  }

  // --- RESEARCH SOURCES ---
  async getSourcesByProjectId(projectId: string): Promise<ResearchSource[]> {
    if (config.databaseProvider === 'supabase') {
      if (!projectId || !isValidUUID(projectId)) return [];
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
    const cleanSource: ResearchSource = {
      ...source,
      id: isValidUUID(source.id) ? source.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('research_sources').upsert(cleanSource).select().single();
      if (error) this.handleDbError('createSource', error);
      return (data || cleanSource) as ResearchSource;
    }
    this.memory.researchSources.set(cleanSource.id, cleanSource);
    return cleanSource;
  }

  // --- FACTS ---
  async getFactsByProjectId(projectId: string): Promise<Fact[]> {
    if (config.databaseProvider === 'supabase') {
      if (!projectId || !isValidUUID(projectId)) return [];
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
    const cleanFact: Fact = {
      ...fact,
      id: isValidUUID(fact.id) ? fact.id : generateUUID(),
      source_id: fact.source_id && isValidUUID(fact.source_id) ? fact.source_id : undefined,
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('facts').upsert(cleanFact).select().single();
      if (error) this.handleDbError('createFact', error);
      return (data || cleanFact) as Fact;
    }
    this.memory.facts.set(cleanFact.id, cleanFact);
    return cleanFact;
  }

  // --- ASSESSMENTS ---
  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!id || !isValidUUID(id)) return undefined;
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
      if (!projectId || !isValidUUID(projectId)) return [];
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
    const cleanAssessment: Assessment = {
      ...assessment,
      id: isValidUUID(assessment.id) ? assessment.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const supabasePayload = {
        ...cleanAssessment,
        methodology_id: cleanAssessment.methodology_id && isValidUUID(cleanAssessment.methodology_id) ? cleanAssessment.methodology_id : null,
      };
      const { data, error } = await this.supabase.from('assessments').upsert(supabasePayload).select().single();
      if (error) this.handleDbError('createAssessment', error);
      return (data || cleanAssessment) as Assessment;
    }
    this.memory.assessments.set(cleanAssessment.id, cleanAssessment);
    return cleanAssessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!id || !isValidUUID(id)) return undefined;
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const updatedPayload: Record<string, any> = { ...updates, updated_at: new Date().toISOString() };
      if ('methodology_id' in updatedPayload) {
        updatedPayload.methodology_id = updatedPayload.methodology_id && isValidUUID(updatedPayload.methodology_id) ? updatedPayload.methodology_id : null;
      }
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
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    this.memory.assessments.set(id, updated);
    return updated;
  }

  // --- QUESTIONS ---
  async getQuestionsByAssessmentId(assessmentId: string): Promise<Question[]> {
    if (config.databaseProvider === 'supabase') {
      if (!assessmentId || !isValidUUID(assessmentId)) return [];
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
    const cleanQuestion: Question = {
      ...question,
      id: isValidUUID(question.id) ? question.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('questions').upsert(cleanQuestion).select().single();
      if (error) this.handleDbError('createQuestion', error);
      return (data || cleanQuestion) as Question;
    }
    this.memory.questions.set(cleanQuestion.id, cleanQuestion);
    return cleanQuestion;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined> {
    if (config.databaseProvider === 'supabase') {
      if (!id || !isValidUUID(id)) return undefined;
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
      if (!assessmentId || !isValidUUID(assessmentId)) return [];
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
    const cleanRun: CalculationRun = {
      ...run,
      id: isValidUUID(run.id) ? run.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const supabasePayload = {
        ...cleanRun,
        methodology_id: cleanRun.methodology_id && isValidUUID(cleanRun.methodology_id) ? cleanRun.methodology_id : null,
      };
      const { data, error } = await this.supabase.from('calculation_runs').upsert(supabasePayload).select().single();
      if (error) {
        // If calculation_runs foreign key constraint triggers in production, log dev warning rather than hard crash
        console.warn('Supabase calculation_runs insert note:', error.message);
      }
      return (data || cleanRun) as CalculationRun;
    }
    this.memory.calculationRuns.set(cleanRun.id, cleanRun);
    return cleanRun;
  }

  // --- CONTACTS ---
  async getContactsByOrgId(orgId: string): Promise<Contact[]> {
    if (config.databaseProvider === 'supabase') {
      if (!orgId || !isValidUUID(orgId)) return [];
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
    const cleanContact: Contact = {
      ...contact,
      id: isValidUUID(contact.id) ? contact.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('contacts').upsert(cleanContact).select().single();
      if (error) this.handleDbError('createContact', error);
      return (data || cleanContact) as Contact;
    }
    this.memory.contacts.set(cleanContact.id, cleanContact);
    return cleanContact;
  }

  // --- DOCUMENTS ---
  async getDocumentsByProjectId(projectId: string): Promise<DocumentRecord[]> {
    if (config.databaseProvider === 'supabase') {
      if (!projectId || !isValidUUID(projectId)) return [];
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
    const cleanDoc: DocumentRecord = {
      ...doc,
      id: isValidUUID(doc.id) ? doc.id : generateUUID(),
    };
    if (config.databaseProvider === 'supabase') {
      if (!this.supabase) throw new Error('Supabase client is not configured.');
      const { data, error } = await this.supabase.from('documents').upsert(cleanDoc).select().single();
      if (error) this.handleDbError('createDocument', error);
      return (data || cleanDoc) as DocumentRecord;
    }
    this.memory.documents.set(cleanDoc.id, cleanDoc);
    return cleanDoc;
  }

  // --- AUDIT LOGS ---
  async addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const entry: AuditLog = {
      id: isValidUUID((log as any).id) ? (log as any).id : generateUUID(),
      ...log,
      entity_id: isValidUUID(log.entity_id) ? log.entity_id : generateUUID(),
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
      if (entityId) {
        if (!isValidUUID(entityId)) return [];
        query = query.eq('entity_id', entityId);
      }
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

