// ==============================================================================
// CARBONSCOUT INDIA — OFFICIAL METHODOLOGY INGESTION & EVIDENCE GATE TESTS
// ==============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { MethodologyRegistry } from '../services/methodology/registry';
import { MethodologyMatcher } from '../services/methodology/matcher';
import { CalculationEngine } from '../services/calculations/engine';
import { MemoryStore } from '../lib/db/memory-store';
import { Fact } from '../lib/db/schema';
import {
  OFFICIAL_METHODOLOGY_SOURCES,
  OFFICIAL_REGULATORY_DOCUMENTS,
  generateSourceRegistryJson,
  generateSourceRegistryMarkdown,
} from '../services/methodology/source-registry-data';
import { CCTS_GOVERNANCE_FRAMEWORK } from '../services/methodology/ccts-governance';
import fs from 'fs';
import path from 'path';



describe('Official CCTS Methodology Ingestion & Evidence Gate', () => {
  let matcher: MethodologyMatcher;
  let calcEngine: CalculationEngine;
  let memoryStore: MemoryStore;

  beforeEach(() => {
    matcher = new MethodologyMatcher();
    calcEngine = new CalculationEngine();
    memoryStore = MemoryStore.getInstance();
    memoryStore.reset();
  });

  describe('1. Ingestion Integrity & Cryptographic Registry Verification', () => {
    it('should register exactly 12 official BEE CCTS methodologies with real SHA-256 digests', () => {
      const methodologies = MethodologyRegistry.getAll();
      expect(methodologies.length).toBe(12);

      const expectedCodes = [
        'BM EN01.001',
        'BM EN01.002',
        'BM EN01.003',
        'BM IN02.001',
        'BM IN02.002',
        'BM AG04.001',
        'BM AG04.002',
        'BM WA03.001',
        'BM WA03.002',
        'BM WA03.003',
        'BM FR05.001',
        'BM FR05.002',
      ];

      for (const code of expectedCodes) {
        const meth = MethodologyRegistry.getByCode(code);
        expect(meth).toBeDefined();
        expect(meth?.isSynthetic).toBe(false);
        expect(meth?.verificationStatus).toBe('VERIFIED');
        expect(meth?.issuingAuthority).toContain('Bureau of Energy Efficiency');
        expect(meth?.documentHash).toHaveLength(64); // Valid SHA-256
        expect(meth?.pageCount).toBeGreaterThan(0);
        expect(meth?.referenceUnfcccCdm.length).toBeGreaterThan(0);
      }
    });

    it('should match document hash in registry with source registry data', () => {
      for (const source of OFFICIAL_METHODOLOGY_SOURCES) {
        const meth = MethodologyRegistry.getByCode(source.methodologyCode);
        expect(meth).toBeDefined();
        expect(meth?.documentHash).toBe(source.sha256Hash);
        expect(meth?.pageCount).toBe(source.pageCount);
        expect(meth?.publicationDate).toBe(source.publicationDate);
      }
    });

    it('should populate MemoryStore with all 12 official methodologies and zero synthetic default records', () => {
      const storeMeths = memoryStore.getMethodologies();
      expect(storeMeths.length).toBe(12);
      expect(storeMeths.every((m) => !m.is_synthetic)).toBe(true);
      expect(storeMeths.every((m) => m.verification_status === 'VERIFIED')).toBe(true);
    });
  });

  describe('2. Provenance & Section-Level Citation Rigor', () => {
    it('should have section, page references and direct provenance quotes for all applicability conditions', () => {
      const methodologies = MethodologyRegistry.getAll();

      for (const meth of methodologies) {
        expect(meth.applicabilityConditions.length).toBeGreaterThan(0);

        for (const cond of meth.applicabilityConditions) {
          expect(cond.sectionReference).toBeDefined();
          expect(cond.sectionReference.length).toBeGreaterThan(0);
          expect(cond.pageReference).toBeGreaterThan(0);
          expect(cond.provenanceQuote).toBeDefined();
          expect(cond.provenanceQuote.length).toBeGreaterThan(10);
        }
      }
    });

    it('should correctly document adopted tools (BM-T) and external dependencies', () => {
      const biomassMeth = MethodologyRegistry.getByCode('BM EN01.003');
      expect(biomassMeth).toBeDefined();
      expect(biomassMeth?.adoptedTools.some((t) => t.includes('BM-T-001'))).toBe(true);
      expect(biomassMeth?.adoptedTools.some((t) => t.includes('BM-T-003'))).toBe(true);
      expect(biomassMeth?.adoptedTools.some((t) => t.includes('BM-T-010'))).toBe(true);

      const cbgMeth = MethodologyRegistry.getByCode('BM WA03.003');
      expect(cbgMeth).toBeDefined();
      expect(cbgMeth?.adoptedTools.some((t) => t.includes('BM-T-008'))).toBe(true);
      expect(cbgMeth?.adoptedTools.some((t) => t.includes('BM-T-013'))).toBe(true);

      // Check external reference to CCTS Detailed Procedure
      const extDeps = cbgMeth?.externalDependencies || [];
      const cctsProc = extDeps.find((d) => d.title.includes('Detailed Procedure') || d.exactWording.includes('Detailed Procedure'));
      expect(cctsProc).toBeDefined();
      expect(cctsProc?.verificationStatus).toBe('REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT');
    });
  });

  describe('3. Strict Evidence Gate & Negative Sector Matching', () => {
    it('should return null (NO_VERIFIED_APPLICABLE_METHODOLOGY_FOUND) for unverified sectors', () => {
      const facts: Fact[] = [
        {
          id: 'f1',
          project_id: 'p1',
          fact_type: 'SECTOR_CLASSIFICATION',
          value_raw: 'Cryptocurrency Proof-of-Work Data Center',
          status: 'VERIFIED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const match = matcher.matchBestMethodology(facts, 'Cryptocurrency Mining');
      expect(match).toBeNull();
    });

    it('should return null for synthetic unmapped consumer retail sectors', () => {
      const facts: Fact[] = [
        {
          id: 'f2',
          project_id: 'p2',
          fact_type: 'SECTOR_CLASSIFICATION',
          value_raw: 'E-commerce logistics & warehousing',
          status: 'USER_PROVIDED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const match = matcher.matchBestMethodology(facts, 'Fast Moving Consumer Goods Retail');
      expect(match).toBeNull();
    });

    it('should match BM EN01.001 for Grid Connected Renewable Energy with positive match score', () => {
      const facts: Fact[] = [
        {
          id: 'f-re-1',
          project_id: 'p-re',
          fact_type: 'grid_connected',
          value_raw: 'true',
          status: 'VERIFIED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'f-re-2',
          project_id: 'p-re',
          fact_type: 'not_fossil_fuel_switch',
          value_raw: 'true',
          status: 'USER_PROVIDED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'f-re-3',
          project_id: 'p-re',
          fact_type: 'not_biomass_fired',
          value_raw: 'true',
          status: 'USER_PROVIDED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const match = matcher.matchBestMethodology(facts, 'Renewable Energy');
      expect(match).not.toBeNull();
      expect(match?.methodologyCode).toBe('BM EN01.001');
      expect(match?.status).toBe('MATCH');
      expect(match?.matchedCount).toBeGreaterThanOrEqual(3);
    });

    it('should match BM WA03.003 for Compressed Biogas with verified biomethanation conditions', () => {
      const facts: Fact[] = [
        {
          id: 'f-cbg-1',
          project_id: 'p-cbg',
          fact_type: 'cbg_methane_purity_fco',
          value_raw: '92',
          value_numeric: 92,
          status: 'VERIFIED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'f-cbg-2',
          project_id: 'p-cbg',
          fact_type: 'fom_fco_compliance',
          value_raw: 'true',
          status: 'USER_PROVIDED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'f-cbg-3',
          project_id: 'p-cbg',
          fact_type: 'no_venting_of_biogas',
          value_raw: 'true',
          status: 'USER_PROVIDED',
          confidence: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];


      const match = matcher.matchBestMethodology(facts, 'Waste Handling and Disposal');
      expect(match).not.toBeNull();
      expect(match?.methodologyCode).toBe('BM WA03.003');
      expect(match?.matchedCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('4. Deterministic Calculations & Evidence Safety Gates', () => {
    it('should calculate BM EN01.001 Grid RE with exact CEA baseline factor and provenance', () => {
      const result = calcEngine.calculate('BM EN01.001', [
        { key: 'NET_ELECTRICITY_DELIVERED_MWH', label: 'Net Delivered Electricity', valueRaw: 10000, unit: 'MWh/year', isMandatory: true },
        { key: 'GRID_EMISSION_FACTOR_EF_GRID_TCO2_MWH', label: 'CEA Grid Factor', valueRaw: 0.716, unit: 'tCO2/MWh', isMandatory: false },
        { key: 'PROJECT_EMISSIONS_PE_TCO2', label: 'Project Emissions', valueRaw: 0, unit: 'tCO2/year', isMandatory: false },
      ]);

      expect(result.status).toBe('SUCCESS');
      expect(result.formulaId).toBe('FORMULA-BM-EN01-001-EQ11');
      expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBe(7160);
      expect(result.isSynthetic).toBe(false);
      expect(result.provenanceCitations?.some((c) => c.section === 'Equation 11 & Equation 17')).toBe(true);
    });

    it('should calculate BM EN01.002 Green Hydrogen with stoichiometric displacement', () => {
      const result = calcEngine.calculate('BM EN01.002', [
        { key: 'HYDROGEN_PRODUCED_TONS', label: 'Green H2 Output', valueRaw: 500, unit: 'tH2/year', isMandatory: true },
        { key: 'BASELINE_EMISSION_FACTOR_EF_H2_TCO2_TH2', label: 'SMR Baseline Factor', valueRaw: 9.0, unit: 'tCO2/tH2', isMandatory: false },
      ]);

      expect(result.status).toBe('SUCCESS');
      expect(result.formulaId).toBe('FORMULA-BM-EN01-002-EQ1');
      expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBe(4500);
      expect(result.isSynthetic).toBe(false);
    });

    it('should calculate BM WA03.003 CBG with biomethanation fuel replacement factor', () => {
      const result = calcEngine.calculate('BM WA03.003', [
        { key: 'ANNUAL_CBG_PRODUCED_TONS', label: 'CBG Output', valueRaw: 2000, unit: 'tCBG/year', isMandatory: true },
        { key: 'CBG_DISPLACEMENT_FACTOR_TCO2_TCBG', label: 'Emission Factor', valueRaw: 2.75, unit: 'tCO2/tCBG', isMandatory: false },
      ]);

      expect(result.status).toBe('SUCCESS');
      expect(result.formulaId).toBe('FORMULA-BM-WA03-003-EQ1');
      expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBe(5500);
      expect(result.isSynthetic).toBe(false);
    });

    it('should halt with INSUFFICIENT_DATA when mandatory calculation inputs are missing', () => {
      const result = calcEngine.calculate('BM EN01.001', [
        { key: 'SOME_IRRELEVANT_PARAM', label: 'Irrelevant', valueRaw: 100, isMandatory: true },
      ]);

      expect(result.status).toBe('INSUFFICIENT_DATA');
      expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBeUndefined();
      expect(result.assumptions.some((a) => a.includes('Missing mandatory input parameter'))).toBe(true);
    });

    it('should halt with CALCULATION_UNAVAILABLE for unparameterized official methodologies', () => {
      const result = calcEngine.calculate('BM FR05.001', [
        { key: 'PLANTATION_AREA_HA', label: 'Mangrove Area', valueRaw: 250, unit: 'hectares', isMandatory: true },
      ]);

      expect(result.status).toBe('CALCULATION_UNAVAILABLE');
      expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBeUndefined();
      expect(result.explanation).toContain('Parameterization pending project specific carbon pool inventory data');
    });
  });

  describe('5. CCTS 2023 Statutory Governance & Regulatory Framework Ingestion', () => {
    it('should verify CCTS 2023 Gazette Notification S.O. 2825(E) and BEE Notice in source registry', () => {
      expect(OFFICIAL_REGULATORY_DOCUMENTS.length).toBe(2);

      const gazette = OFFICIAL_REGULATORY_DOCUMENTS.find(
        (d) => d.documentId === 'DOC-CCTS-GAZETTE-2023'
      );
      expect(gazette).toBeDefined();
      expect(gazette?.sha256Hash).toBe('bebbae1946dbf11532f24deebb7f215df644a4363a347da4eb1cbe0ab4dc57a3');
      expect(gazette?.notificationNumber).toBe('S.O. 2825(E) (No. 2702)');
      expect(gazette?.pageCount).toBe(10);

      const beeNotice = OFFICIAL_REGULATORY_DOCUMENTS.find(
        (d) => d.documentId === 'DOC-BEE-CONSULTATION-2025'
      );
      expect(beeNotice).toBeDefined();
      expect(beeNotice?.sha256Hash).toBe('de0b3974d55d5a73432bfeb4137c7d16d08e90efdc93b0fce0f2254caa8bd486');
      expect(beeNotice?.notificationNumber).toBe('No. 45/02/NMEEE/Energy Efficiency/2024-CCTS');
      expect(beeNotice?.pageCount).toBe(1);
    });

    it('should accurately encode CCTS 2023 statutory definitions and governance institutions', () => {
      expect(CCTS_GOVERNANCE_FRAMEWORK.legalBasis.act).toBe('Energy Conservation Act, 2001 (52 of 2001)');
      expect(CCTS_GOVERNANCE_FRAMEWORK.coreUnit.equivalence).toBe('1 Carbon Credit = 1 ton of carbon dioxide equivalent (1 tCO2e)');
      expect(CCTS_GOVERNANCE_FRAMEWORK.regulatedGases.length).toBe(7);
      expect(CCTS_GOVERNANCE_FRAMEWORK.regulatedGases.map((g) => g.formula)).toEqual([
        'CO2', 'CH4', 'N2O', 'HCFCs', 'HFCs', 'PFCs', 'SF6'
      ]);

      const institutions = CCTS_GOVERNANCE_FRAMEWORK.governanceInstitutions;
      expect(institutions.some((i) => i.entityName.includes('National Steering Committee'))).toBe(true);
      expect(institutions.some((i) => i.entityName.includes('Bureau of Energy Efficiency'))).toBe(true);
      expect(institutions.some((i) => i.entityName.includes('Grid Controller of India'))).toBe(true);
      expect(institutions.some((i) => i.entityName.includes('Central Electricity Regulatory Commission'))).toBe(true);
    });

    it('should generate valid source_registry.json and source_registry.md exports', () => {
      const jsonOutput = generateSourceRegistryJson();
      const mdOutput = generateSourceRegistryMarkdown();

      expect(jsonOutput).toContain('DOC-CCTS-GAZETTE-2023');
      expect(jsonOutput).toContain('BM EN01.001');
      expect(mdOutput).toContain('Statutory Framework & Governance Documents');

      fs.writeFileSync(path.resolve(__dirname, '../docs/source_registry.json'), jsonOutput, 'utf8');
      fs.writeFileSync(path.resolve(__dirname, '../docs/source_registry.md'), mdOutput, 'utf8');
    });
  });
});




