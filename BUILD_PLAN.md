# CarbonScout India — Build Plan: Official Methodology Ingestion & Evidence Gate

## 1. Objective

Transition CarbonScout India from the initial prototype foundation into a strictly **evidence-backed, provenance-preserving system** using the 10 official Indian Carbon Market (ICM / CCTS) methodology documents published by the Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India.

---

## 2. Non-Negotiable Project Rules

1. **Real Data & Real Sources Only**: No synthetic business data, no fake methodology codes, no simulated carbon calculations, no invented baseline emission factors.
2. **Deterministic Computations**: All carbon reduction equations and opportunity scoring are calculated strictly via auditable TypeScript functions directly referencing official equation numbers.
3. **Explicit Uncertainty**: Where empirical data is missing or incomplete, the system must return `UNKNOWN`, `INSUFFICIENT_DATA`, `UNVERIFIED`, or `NO_VERIFIED_APPLICABLE_METHODOLOGY_FOUND`.
4. **Provenance Preservation**: Every requirement, parameter, equation, and condition must preserve its source document, version, publication date, page number, section, paragraph, and table.

---

## 3. Antigravity Awesome Skills Integration Catalog

| Skill Name | Capabilities Provided | Where Used in Project | Rationale & Value |
|---|---|---|---|
| **`credentials`** | Safe handling and verification of API keys without leaking secrets in terminal or context | `lib/audit.ts`, `.env.example`, `lib/config.ts` | Prevents token and API key exposure in log streams, meeting enterprise security standards. |
| **`generative_ui`** | Design patterns for structured evidence cards, provenance badges, and clean layouts | `components/provenance-badge.tsx`, `app/admin/`, `app/assessment/` | Ensures consistent visual communication of provenance states (`VERIFIED`, `USER_PROVIDED`, `INFERRED`, `ESTIMATED`, `UNVERIFIED`, `UNKNOWN`). |
| **`agy-customizations`** | AGY extensibility guidelines, configuration priorities, and directory standards | Workspace config, skill & tool structure | Maintains strict adherence to AGY architecture standards. |
| **`antigravity-guide`** | CLI, IDE SDK, and core execution reference | Project build workflow and scripts | Ensures reliable task execution and background server management. |

---

## 4. Official Methodology Document Universe (10 Official Documents)

1. **`BM EN01.001`**: Grid-connected electricity generation from renewable sources (27 March 2025, Ver 1.0, 28 pages, CDM ACM0002).
2. **`BM EN01.002`**: Hydrogen production from electrolysis of water (27 March 2025, Ver 1.0, 18 pages, CDM AM0124).
3. **`BM EN01.003`**: Electricity and Heat Generation from Biomass (30 June 2026, Ver 1.0, 96 pages, CDM ACM0006, ACM0018, AM0036).
4. **`BM IN02.001`**: Energy efficiency and fuel switching measures for industrial facilities (27 March 2025, Ver 1.0, 19 pages, CDM AMS-II.D).
5. **`BM IN02.002`**: Hydrogen production using methane extracted from biogas (27 March 2025, Ver 1.0, 13 pages, CDM AMS-III.O).
6. **`BM AG04.001`**: Methane recovery from livestock and manure management at households and small farms (27 March 2025, Ver 1.0, 15 pages, CDM AMS-III.R).
7. **`BM AG04.002`**: Emission reduction through improved management practices in rice cultivation (30 June 2026, Ver 1.0, 24 pages, CDM AMS-III.AU).
8. **`BM WA03.001`**: Landfill Methane Recovery (27 March 2025, Ver 1.0, 13 pages, CDM AMS-III.G).
9. **`BM WA03.002`**: Flaring or use of landfill gas (27 March 2025, Ver 1.0, 33 pages, CDM ACM0001).
10. **`BM WA03.003`**: Production of Compressed Bio-gas (CBG) (30 June 2026, Ver 1.0, 107 pages, CDM ACM0022, AMS-III.Q, AMS-III.AQ, GS SOC).
11. **`BM FR05.001`**: Afforestation and reforestation of degraded mangrove habitats (27 March 2025, Ver 1.0, 10 pages, CDM AR-AM0014).
12. **`BM FR05.002`**: Afforestation and reforestation of lands except wetlands (8 September 2025, Ver 1.0, 10 pages, CDM AR-ACM0003).

---

## 5. Implementation Steps

- [x] Phase 1: Repository Audit & Planning.
- [ ] Phase 2: Create `docs/source_registry.md` & `docs/source_registry.json` with cryptographic SHA-256 hashes and metadata.
- [ ] Phase 3: Extract structured methodology definitions (`services/methodology/definitions/*.ts`) with full page/section provenance.
- [ ] Phase 4: Upgrade `services/methodology/registry.ts` and `matcher.ts` with real sector mappings and tool dependency graphs.
- [ ] Phase 5: Implement safety-gated deterministic calculation functions in `services/calculations/engine.ts`.
- [ ] Phase 6: Sanitize repository data (purge synthetic `SYNTH-AGRI-001` and demo company from production path).
- [ ] Phase 7: Create automated test suite (`tests/official-methodology-ingestion.test.ts`) and verify with `npm test`, `typecheck`, and `build`.
