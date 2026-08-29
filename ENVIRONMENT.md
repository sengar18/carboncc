# CarbonScout India — Environment & Configuration Guide

## 1. Zero-Credit Mock Mode (Default)

CarbonScout India is designed to run out-of-the-box without requiring live API keys or external paid credits. In default mock mode:
- **Research Provider**: `MockResearchProvider` generates realistic synthetic Indian enterprise discovery data.
- **AI Provider**: `MockAIProvider` produces deterministic Zod-validated JSON responses for methodology matching, data gap identification, and reporting.
- **Database**: `MemoryStore` provides an in-memory repository with pre-seeded demonstration data.

---

## 2. Environment Variables Specification

The system looks for variables in `.env.local` or environment variables:

| Variable | Type | Default | Description |
|---|---|---|---|
| `RESEARCH_PROVIDER` | `mock` \| `firecrawl` | `mock` | Switch for web research engine |
| `AI_PROVIDER` | `mock` \| `gemini` \| `openai` | `mock` | Switch for LLM reasoning engine |
| `DATABASE_PROVIDER` | `memory` \| `supabase` | `memory` | Switch for database persistence |
| `FIRECRAWL_API_KEY` | string | `""` | Optional Firecrawl API key |
| `FIRECRAWL_API_URL` | string | `https://api.firecrawl.dev` | Firecrawl API base URL |
| `GEMINI_API_KEY` | string | `""` | Optional Google Gemini API key |
| `OPENAI_API_KEY` | string | `""` | Optional OpenAI API key |
| `OPENAI_MODEL` | string | `gpt-4o` | Model name for OpenAI adapter |
| `NEXT_PUBLIC_SUPABASE_URL` | string | `""` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | `""` | Supabase public anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | string | `""` | Supabase elevated service key |
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` | `info` | Audit logging level |

---

## 3. Switching to Live Providers

### Enabling Live Research (Firecrawl)
Set in `.env.local`:
```env
RESEARCH_PROVIDER=firecrawl
FIRECRAWL_API_KEY=fc-your-api-key-here
```

### Enabling Live LLM Reasoning (Google Gemini or OpenAI)
Set in `.env.local`:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key-here
```
Or for OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4o
```

---

## 4. Secret & Credential Redaction

All API keys and secrets are protected by `lib/audit.ts`. Any attempt to log API keys, Bearer tokens, or passwords will automatically replace the value with `[REDACTED_SECRET]` before saving to audit history.
