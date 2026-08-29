# CarbonScout India — System Architecture & Design

## 1. High-Level Architecture Overview

CarbonScout India is designed around a layered, evidence-first, modular architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│   Landing Page  │  9-Step Wizard  │  Admin Leads CRM  │  Audit Reports  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON
┌───────────────────────────────────▼────────────────────────────────────┐
│                           API ROUTE LAYER                              │
│  /api/research │ /api/assessment │ /api/documents │ /api/admin/leads   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                          SERVICE DOMAIN LAYER                          │
│                                                                        │
│   ┌────────────────────┐  ┌────────────────────┐  ┌─────────────────┐  │
│   │  Research Service  │  │     AI Service     │  │   Methodology   │  │
│   │ (Mock / Firecrawl) │  │(Mock/Gemini/OpenAI)│  │ Matching Engine │  │
│   └─────────┬──────────┘  └─────────┬──────────┘  └────────┬────────┘  │
│             │                       │                      │           │
│             └──────────────┐        │        ┌─────────────┘           │
│                            ▼        ▼        ▼                         │
│                    ┌───────────────────────────────────┐               │
│                    │  Deterministic Calculation Engine │               │
│                    │   100-Point Scoring Framework     │               │
│                    └────────────────┬──────────────────┘               │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼──────────────────────────────────┐
│                          STORAGE & AUDIT LAYER                         │
│     In-Memory Repository Store  │  Supabase PostgreSQL (13 Tables)     │
│             Append-Only Audit Trail (Redacted Secrets)                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Entities (13 Database Tables)

1. `organizations`: Legal entity name, state, website, sector.
2. `projects`: Facility details, state, sector, capacity, prior credit registration flag, pipeline status.
3. `research_sources`: Caching web discovery sources with URL, title, raw content, content hash, and timestamp.
4. `facts`: The atomic evidence unit. Contains `fact_type`, `value_raw`, `value_numeric`, `unit`, `status` (`VERIFIED`, `USER_PROVIDED`, `INFERRED`, `ESTIMATED`, `UNVERIFIED`, `UNKNOWN`), `confidence` (0.0 to 1.0), `source_citation`, `source_url`, and `source_location`.
5. `methodologies`: Versioned registry metadata (`code`, `version`, `title`, `sector`, `is_synthetic`, `standard_body`).
6. `methodology_requirements`: Applicability conditions with rule operators (`EQUALS`, `GREATER_THAN_OR_EQUAL`, `IN`, `CONTAINS`, `EXISTS`).
7. `assessments`: Opportunity assessment instance with `opportunity_score`, `score_category`, `score_breakdown`, `redFlags`, `next_steps`.
8. `assessment_inputs`: Point-in-time snapshot mapping facts to specific assessment versions.
9. `questions`: Missing data gaps converted into user-answerable questions with explanations and input validation.
10. `documents`: Uploaded evidence records (electricity bills, weighbridge slips, environmental consents) with size, MIME, and type validation.
11. `calculation_runs`: Deterministic mathematical run logs recording formula ID, input snapshot, normalized inputs, outputs, assumptions, and step-by-step mathematical explanations.
12. `contacts`: Commercial contacts and project stakeholders.
13. `audit_logs`: Append-only immutable log recording all system state changes with automatic credential/secret redaction.

---

## 3. CRM Pipeline States

Projects transition deterministically across 9 CRM states:
- `NEW`: Lead initialized.
- `RESEARCHED`: Automated web and public evidence discovery completed.
- `CONTACTED`: Initial outreach dispatched.
- `RESPONDED`: Client engaged.
- `QUALIFIED`: Baseline data meets preliminary screening criteria.
- `ASSESSMENT`: Deep data-gap and calculation assessment in progress.
- `HANDOFF`: Handed off to carbon project developer / field validation team.
- `CLOSED`: Successfully contracted.
- `REJECTED`: Disqualified due to additionality failure or lack of viable feedstock scale.

---

## 4. Non-Fabrication Rules in Code

- **No Hallucinated Standards**: Test methodology `SYNTH-AGRI-001` explicitly sets `is_synthetic: true` and `type: 'SYNTHETIC_TEST_METHODOLOGY'`.
- **No Hallucinated Calculations**: LLMs generate text explanations, but mathematical abatement numbers are computed by `services/calculations/engine.ts`.
- **No Forced Yes/No Decisions**: When data is incomplete, `MethodologyMatcher` returns `INSUFFICIENT_INFORMATION` and generates specific data gaps.
- **Unverified Potential Handled as UNKNOWN**: If commercial potential cannot be supported by empirical evidence, the 100-point scoring engine awards 0 points and explicitly notes `UNKNOWN`.
