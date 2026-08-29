# CarbonScout India — AI Carbon Opportunity Intelligence Platform

CarbonScout India is an evidence-first preliminary carbon project screening and opportunity intelligence platform tailored for Indian commercial enterprises, agricultural millers, and industrial facilities operating under the **Carbon Credit Trading Scheme (CCTS), 2023** framework.

---

## 1. Core Principles & Non-Negotiable Rules

1. **REAL DATA ONLY**: The platform strictly enforces zero synthetic business data, zero fabricated emission factors, and zero hallucinated methodology records.
2. **Evidence-First Provenance**: Every piece of facility data is tagged with its provenance status (`VERIFIED`, `USER_PROVIDED`, `INFERRED`, `ESTIMATED`, `UNVERIFIED`, `UNKNOWN`) and direct source citations.
3. **Deterministic Calculation Engine**: Mathematical calculations are strictly performed by auditable, deterministic TypeScript calculation modules with direct statutory citations (e.g. BEE CCTS equations, Central Electricity Authority grid baseline database). LLMs are never used for arithmetic.
4. **Official CCTS Methodology Knowledge Base**: Versioned and cryptographically verified against official public draft methodologies published under BEE Public Notice No. 45/02/NMEEE/Energy Efficiency/2024-CCTS.
5. **Clear Statutory Status Distinctions**: The platform clearly distinguishes enacted statutory law (Gazette Notification S.O. 2825(E)) from draft consultation methodologies (`CURRENT_STATUS_UNVERIFIED`) and external dependencies.
6. **No Guaranteed Issuance Claims**: All outputs represent preliminary technical screening and clearly state that final carbon credit issuance requires third-party verification and official Indian Carbon Market registration.

---

## 2. Architecture Overview

```
+---------------------------------------------------------------------------------------------------+
|                                       CARBONSCOUT INDIA ARCHITECTURE                              |
+---------------------------------------------------------------------------------------------------+
                                                  |
           +--------------------------------------+--------------------------------------+
           |                                      |                                      |
+----------------------+              +-----------------------+              +----------------------+
|  Next.js 16 UI Layer |              | Deterministic Engine  |              | Methodology Registry |
|  - 9-Step Wizard     |              | - Unit Normalization  |              | - 12 BEE Draft Meths |
|  - Admin CRM View    |              | - CCTS Formula Models |              | - SHA-256 Provenance |
|  - Provenance Badges |              | - CEA Grid Baseline   |              | - Statutory Gates    |
+----------------------+              +-----------------------+              +----------------------+
           |                                      |                                      |
           +--------------------------------------+--------------------------------------+
                                                  |
                                      +-----------------------+
                                      | Storage & Audit Layer |
                                      | - MemoryStore / Supa  |
                                      | - Audit Event Trail   |
                                      | - Document Validator  |
                                      +-----------------------+
```

---

## 3. Official Methodologies Cataloged

The platform currently includes 12 official BEE draft offset methodologies and 2 statutory governance documents:

| Methodology Code | Sector | Title | Adopted UNFCCC CDM Basis |
|---|---|---|---|
| `BM EN01.001` | Energy | Grid-connected electricity from renewable sources | ACM0002 |
| `BM EN01.002` | Energy | Hydrogen production from electrolysis of water | AM0124 |
| `BM EN01.003` | Energy | Electricity and heat generation from biomass | ACM0006, ACM0018, AM0036 |
| `BM IN02.001` | Manufacturing | Installation of Waste Heat Recovery System (WHRS) | AMS-III.Q, ACM0012 |
| `BM IN02.002` | Manufacturing | Alternative raw materials in clinker and cement | ACM0015 |
| `BM AG04.001` | Agriculture | Methane recovery from livestock manure | AMS-III.R |
| `BM AG04.002` | Agriculture | Methane reduction from rice cultivation (AWD) | AMS-III.AU |
| `BM WA03.001` | Waste | Methane recovery in wastewater treatment | AMS-III.H |
| `BM WA03.002` | Waste | Flaring or use of landfill gas | ACM0001 |
| `BM WA03.003` | Waste | Production of Compressed Bio-gas (CBG) | ACM0022, AMS-III.Q, AMS-III.AQ |
| `BM FR05.001` | Forestry | Mangrove habitat afforestation/reforestation | AR-AM0014 |
| `BM FR05.002` | Forestry | A/R of lands other than wetlands | AR-ACM0003 |

Full cryptographic metadata, section numbers, and verbatim quotes are documented in `docs/source_registry.md` and `docs/source_registry.json`.

---

## 4. Local Setup & Verification

### Prerequisites
- Node.js >= 18.x (Tested on Node.js v24.14.0)
- npm >= 9.x

### Quickstart Commands
```bash
# Clone the repository
git clone <repository-url>
cd carbonscout-india

# Install dependencies
npm install

# Run automated test suites (38 tests)
npm test

# Run TypeScript typecheck
npm run typecheck

# Build Next.js production bundle
npm run build

# Start development server
npm run dev
```

---

## 5. Environment Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Environment Variables
- `AI_PROVIDER`: `mock` (default for zero-credit testing) | `gemini` | `openai`
- `RESEARCH_PROVIDER`: `mock` (default for zero-credit testing) | `firecrawl`
- `DATABASE_PROVIDER`: `mock_memory` (default) | `supabase`
- `GEMINI_API_KEY`: Server-only Google Gemini API key
- `OPENAI_API_KEY`: Server-only OpenAI API key
- `FIRECRAWL_API_KEY`: Server-only Firecrawl API key
- `NEXT_PUBLIC_SUPABASE_URL`: Client-accessible Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client-accessible Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only Supabase service role key

*Security Note: In production mode (`NODE_ENV=production`), mock providers are automatically gated and cannot be initialized.*

---

## 6. Current Limitations

- **Statutory Offset Status**: The 12 methodologies are public consultation drafts published under BEE Notice No. 45/02/NMEEE/Energy Efficiency/2024-CCTS. Final gazetted operationalization remains pending.
- **Detailed Procedure for Offset Mechanism**: Pending formal gazetting by the Ministry of Power under Section 12 of CCTS 2023.
- **ICM Subsidiary Tools**: Tools `BM-T-001` to `BM-T-012` are adopted from UNFCCC CDM standards and logged as external references.
