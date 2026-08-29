# CarbonScout India — Methodology Ingestion & Governance

## 1. Synthetic vs Real Authoritative Methodologies

CarbonScout enforces a strict distinction between synthetic test methodologies and real authoritative standards:

- `SYNTHETIC_TEST_METHODOLOGY`: Created exclusively for software verification and user interface testing.
  - Property `is_synthetic: true`
  - Explicit disclaimer: *"SYNTHETIC METHODOLOGY FOR SOFTWARE TESTING ONLY. NOT AN AUTHORITATIVE BEE/CCTS STANDARD."*
  - Example: `SYNTH-AGRI-001` (Agricultural Residue Bioenergy).

- `REAL_AUTHORITATIVE_METHODOLOGY`: Sourced from official published carbon standards (e.g., Bureau of Energy Efficiency CCTS, UNFCCC CDM, Verra VCS, Gold Standard).
  - Property `is_synthetic: false`
  - Must include official PDF URL, gazette notification number, version date, and governing registry authority.

---

## 2. Ingestion Schema Definition

Each methodology record conforms to the `MethodologyVersion` interface (`services/methodology/types.ts`):

```typescript
export interface MethodologyVersion {
  id: string;
  code: string;
  version: string;
  title: string;
  sector: string;
  standardBody: string;
  isSynthetic: boolean;
  type: 'REAL_AUTHORITATIVE_METHODOLOGY' | 'SYNTHETIC_TEST_METHODOLOGY';
  effectiveDate: string;
  status: 'ACTIVE' | 'DRAFT' | 'SUPERSEDED';
  sourceUrl?: string;
  applicabilityConditions: ApplicabilityCondition[];
  monitoringRequirements: MonitoringRequirement[];
  evidenceRequirements: EvidenceRequirement[];
  baselineFormulas: FormulaDescriptor[];
  projectFormulas: FormulaDescriptor[];
  leakageFormulas: FormulaDescriptor[];
}
```

---

## 3. Applicability Condition Operators

Applicability conditions use deterministic logic rules:
- `EQUALS`: Direct string/boolean match (e.g., `HAS_PRIOR_CARBON_PROJECT == false`).
- `GREATER_THAN_OR_EQUAL`: Numeric threshold (e.g., `ANNUAL_BIOMASS_RESIDUE_MT >= 1000`).
- `IN`: Set inclusion (e.g., `FACILITY_SECTOR in ['Rice', 'Agro-processing']`).
- `CONTAINS`: String substring match.
- `EXISTS`: Fact key must be present in the evidence ledger.

---

## 4. Step-by-Step Guide: Ingesting a Real Indian BEE/CCTS Methodology

1. **Obtain Official Gazette / Publication**:
   Download the official methodology notification document from the BEE/CCTS portal.
2. **Define Structured Metadata**:
   Create a TypeScript file under `services/methodology/definitions/` (e.g., `ccts-whr-001.ts`).
3. **Specify Applicability Conditions**:
   Translate every applicability rule from the official document into formal `ApplicabilityCondition` objects with appropriate rule operators.
4. **Define Formula Descriptors**:
   Specify deterministic baseline, project, and leakage emission reduction formulas.
5. **Register in Registry**:
   Add the methodology definition to `services/methodology/registry.ts`.
6. **Add Unit Tests**:
   Write positive, negative, and edge-case unit tests in `tests/methodology-matcher.test.ts`.
