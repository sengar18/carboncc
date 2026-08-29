// ==============================================================================
// CARBONSCOUT INDIA — IN-MEMORY DATABASE STORE (OFFICIAL CCTS KNOWLEDGE BASE)
// ==============================================================================

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
import { MethodologyRegistry } from '@/services/methodology/registry';

export class MemoryStore {
  private static instance: MemoryStore;

  organizations: Map<string, Organization> = new Map();
  projects: Map<string, Project> = new Map();
  researchSources: Map<string, ResearchSource> = new Map();
  facts: Map<string, Fact> = new Map();
  methodologies: Map<string, Methodology> = new Map();
  methodologyRequirements: Map<string, MethodologyRequirement> = new Map();
  assessments: Map<string, Assessment> = new Map();
  assessmentInputs: Map<string, AssessmentInput> = new Map();
  questions: Map<string, Question> = new Map();
  documents: Map<string, DocumentRecord> = new Map();
  calculationRuns: Map<string, CalculationRun> = new Map();
  contacts: Map<string, Contact> = new Map();
  auditLogs: AuditLog[] = [];

  private constructor() {
    this.seedOfficialMethodologies();
  }

  public static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  public reset(): void {
    this.organizations.clear();
    this.projects.clear();
    this.researchSources.clear();
    this.facts.clear();
    this.methodologies.clear();
    this.methodologyRequirements.clear();
    this.assessments.clear();
    this.assessmentInputs.clear();
    this.questions.clear();
    this.documents.clear();
    this.calculationRuns.clear();
    this.contacts.clear();
    this.auditLogs = [];
    this.seedOfficialMethodologies();
  }

  /**
   * Seeds all 12 official CCTS methodologies from Bureau of Energy Efficiency (BEE).
   * Zero fake or synthetic data in production baseline.
   */
  private seedOfficialMethodologies(): void {
    const officialList = MethodologyRegistry.getAll();

    for (const official of officialList) {
      const methId = `meth-${official.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const methRecord: Methodology = {
        id: methId,
        code: official.code,
        name: official.name,
        sector: official.sector,
        sectoral_scope_code: official.sectoralScopeCode,
        version: official.version,
        publication_date: official.publicationDate,
        effective_date: official.effectiveDate,
        issuing_authority: official.issuingAuthority,
        reference_unfccc_cdm: official.referenceUnfcccCdm,
        page_count: official.pageCount,
        source_url: official.sourceUrl,
        source_document: official.sourceDocument,
        document_hash: official.documentHash,
        retrieval_date: official.retrievalDate,
        is_active: official.isActive,
        is_synthetic: false,
        verification_status: 'VERIFIED',
        description: official.description,
        adopted_tools: official.adoptedTools,
        external_dependencies: (official.externalDependencies || []).map((d) => ({
          title: d.title,
          exact_wording: d.exactWording,
          section: d.section,
          page: d.page,
          paragraph: d.paragraph,
          impact: d.impact,
          is_available: d.isAvailable,
          verification_status: d.verificationStatus,
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.methodologies.set(methRecord.id, methRecord);

      // Seed Applicability Requirements
      for (const cond of official.applicabilityConditions) {
        const req: MethodologyRequirement = {
          id: `req-${official.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cond.id}`,
          methodology_id: methId,
          requirement_key: cond.field,
          description: cond.label,
          requirement_type: 'APPLICABILITY',
          operator: cond.operator,
          expected_value: String(cond.expectedValue),
          unit: cond.unit,
          is_mandatory: cond.isMandatory,
          page_reference: cond.pageReference,
          section_reference: cond.sectionReference,
          provenance_quote: cond.provenanceQuote,
          verification_status: 'VERIFIED',
          created_at: new Date().toISOString(),
        };
        this.methodologyRequirements.set(req.id, req);
      }
    }
  }

  /**
   * Helper strictly for unit test suites that verify synthetic test isolation.
   */
  public seedSyntheticTestDataForUnitTestsOnly(): void {
    const synthMethodologyId = 'synth-meth-001';
    const synthMethodology: Methodology = {
      id: synthMethodologyId,
      code: 'SYNTH-AGRI-001',
      name: 'Synthetic Agricultural Residue Biomass Assessment (TEST ONLY)',
      sector: 'Rice / Food Processing',
      sectoral_scope_code: '04: Agriculture',
      version: '1.0-SYNTH',
      publication_date: '2026-08-01',
      effective_date: '2026-08-01',
      issuing_authority: 'Synthetic Test Framework (Internal)',
      reference_unfccc_cdm: ['SYNTH-CDM-001'],
      page_count: 10,
      source_url: 'https://carbonscout.internal/methodologies/SYNTH-AGRI-001',
      source_document: 'SYNTH_AGRI_001_TEST_SPEC.pdf',
      document_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      retrieval_date: '2026-08-01',
      is_active: true,
      is_synthetic: true,
      verification_status: 'UNVERIFIED',
      adopted_tools: [],
      external_dependencies: [],
      description: 'A synthetic baseline methodology used exclusively for automated testing.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.methodologies.set(synthMethodology.id, synthMethodology);
  }


  // Getters by ID
  public getOrganization(id: string): Organization | undefined {
    return this.organizations.get(id);
  }

  public getOrganizationById(id: string): Organization | undefined {
    return this.organizations.get(id);
  }

  public getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  public getProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  public getFactsByProject(projectId: string): Fact[] {
    return Array.from(this.facts.values()).filter((f) => f.project_id === projectId);
  }

  public getFactsByProjectId(projectId: string): Fact[] {
    return this.getFactsByProject(projectId);
  }

  public getResearchSourcesByProject(projectId: string): ResearchSource[] {
    return Array.from(this.researchSources.values()).filter((s) => s.project_id === projectId);
  }

  public getSourcesByProjectId(projectId: string): ResearchSource[] {
    return this.getResearchSourcesByProject(projectId);
  }

  public getMethodologyByCode(code: string): Methodology | undefined {
    return Array.from(this.methodologies.values()).find((m) => m.code === code);
  }

  public getMethodologies(): Methodology[] {
    return Array.from(this.methodologies.values());
  }

  public getRequirementsByMethodology(methodologyId: string): MethodologyRequirement[] {
    return Array.from(this.methodologyRequirements.values()).filter(
      (r) => r.methodology_id === methodologyId
    );
  }

  public getAssessmentsByProject(projectId: string): Assessment[] {
    return Array.from(this.assessments.values()).filter((a) => a.project_id === projectId);
  }

  public getAssessmentsByProjectId(projectId: string): Assessment[] {
    return this.getAssessmentsByProject(projectId);
  }

  public getQuestionsByAssessment(assessmentId: string): Question[] {
    return Array.from(this.questions.values()).filter((q) => q.assessment_id === assessmentId);
  }

  public getQuestionsByAssessmentId(assessmentId: string): Question[] {
    return this.getQuestionsByAssessment(assessmentId);
  }

  public getCalculationRunsByAssessmentId(assessmentId: string): CalculationRun[] {
    return Array.from(this.calculationRuns.values()).filter((c) => c.assessment_id === assessmentId);
  }

  public getDocumentsByProjectId(projectId: string): DocumentRecord[] {
    return Array.from(this.documents.values()).filter((d) => d.project_id === projectId);
  }

  public getContactsByOrgId(orgId: string): Contact[] {
    return Array.from(this.contacts.values()).filter((c) => c.organization_id === orgId);
  }

  public getAuditLogs(entityType?: string, entityId?: string): AuditLog[] {
    if (!entityType && !entityId) return this.auditLogs;
    return this.auditLogs.filter((log) => {
      if (entityType && log.entity_type !== entityType) return false;
      if (entityId && log.entity_id !== entityId) return false;
      return true;
    });
  }

  public logAudit(log: Omit<AuditLog, 'id' | 'created_at'>): void {
    this.addAuditLog(log);
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.push(newLog);
    return newLog;
  }

}


export const memoryStore = MemoryStore.getInstance();
