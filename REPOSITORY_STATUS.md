# CarbonScout India — Repository Status

**Status Date**: 2026-08-29  
**Branch**: `main`  
**Framework Version**: Next.js 16.3.3 (Turbopack) / React 19 / TypeScript 5.7  

---

## 1. Current Implementation Status

| Component | Status | Verification Summary |
|---|---|---|
| **Methodology Ingestion Engine** | `COMPLETE_VERIFIED` | 12 official BEE draft methodologies ingested with SHA-256 digests and section quotes. |
| **Statutory Governance Framework** | `COMPLETE_VERIFIED` | CCTS 2023 Gazette Notification S.O. 2825(E) and BEE 2025 Consultation Notice codified. |
| **Source Registry Docs** | `COMPLETE_VERIFIED` | `docs/source_registry.md` and `docs/source_registry.json` generated and synchronised. |
| **Deterministic Calculation Engine** | `COMPLETE_VERIFIED` | Formulas for BM EN01.001 (Grid RE), BM EN01.002 (H2), BM WA03.003 (CBG), BM EN01.003 (Biomass). |
| **Calculation Safety Gates** | `COMPLETE_VERIFIED` | Unparameterized or missing inputs return `CALCULATION_UNAVAILABLE` without guessing constants. |
| **Methodology Matcher** | `COMPLETE_VERIFIED` | Multi-factor rule matcher evaluating project sector, grid connection, and feedstock facts. |
| **Opportunity Scoring Engine** | `COMPLETE_VERIFIED` | 100-point multi-criteria scoring algorithm with transparent factor breakdown. |
| **Evidence & Provenance Ledger** | `COMPLETE_VERIFIED` | Fact lifecycle tracking with audit logging and secret redaction. |
| **Next.js Web Interface** | `COMPLETE_VERIFIED` | 9-step assessment wizard, admin pipeline CRM, and deep-dive views. |
| **Provider Isolation & Safety** | `COMPLETE_VERIFIED` | Mock providers blocked from production execution paths. |

---

## 2. Verified Capabilities

- Full end-to-end deterministic assessment pipeline from onboarding input to methodology matching, calculations, scoring, and report generation.
- Zero synthetic business or methodology data in production paths.
- Unit normalizer converting arbitrary units (kg, quintals, MT, kWh, MWh, GWh, acres, sqm) to standard metric tonnes and MWh.
- 100% test coverage across core calculation equations, provenance chains, and methodology registry integrity (38 passing unit/integration tests).

---

## 3. Known Limitations & External Dependencies

1. **Regulatory Enactment**: The 12 offset methodologies are public consultation drafts published under BEE Notice No. 45/02/NMEEE/Energy Efficiency/2024-CCTS.
2. **Offset Mechanism Detailed Procedure**: Mandated under Section 12 of CCTS 2023, pending formal gazette release by Ministry of Power / BEE.
3. **External Tools**: Subsidiary calculation tools (`BM-T-001` through `BM-T-012`, `BM-T-AR-001` through `BM-T-AR-006`) are adopted from UNFCCC CDM methodologies.
4. **CEA Baseline Database**: Grid calculations reference Central Electricity Authority (CEA) Baseline Database Version 20.0 (December 2024) at 0.716 tCO2/MWh.

---

## 4. Next Task

- **Phase 3**: Live Corporate Intelligence & Opportunity Screening Engine (integrating live corporate filings, MCA/GST/Udyam registries, and geospatial resource layers).
