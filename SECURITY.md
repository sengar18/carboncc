# CarbonScout India — Security & Data Protection Policies

## 1. Zero-Credential Leakage in Audit Trails

All audit logging passes through `lib/audit.ts` which implements recursive key and value inspection:
- Keys containing `key`, `secret`, `token`, `password`, `auth`, `credential`, or `bearer` are automatically replaced with `"[REDACTED_SECRET]"`.
- String patterns matching Bearer tokens, OpenAI (`sk-...`), Firecrawl (`fc-...`), or Gemini API keys are redacted from logs and error messages.

---

## 2. File Upload Validation & Storage Security

All document uploads are validated in memory before storage:
- **Maximum File Size**: 15 MB per file.
- **Allowed MIME Types**: PDF (`application/pdf`), Excel (`.xlsx`, `.xls`), CSV (`text/csv`), Word (`.docx`).
- **Disallowed Extensions**: `.exe`, `.bat`, `.cmd`, `.sh`, `.php`, `.js`, `.py`, `.vbs`, `.dll`, `.msi`, etc.
- **Path Traversal Protection**: Filenames are sanitized with `sanitizeFilename()` to prevent `../` directory traversal attacks.

---

## 3. Database Row Level Security (RLS)

The Supabase PostgreSQL migration (`supabase/migrations/20260829000000_init_carbonscout_schema.sql`) implements row-level security on all 13 tables:
- Public read access is limited to public methodologies.
- Project evidence, facts, documents, calculations, and assessments are scoped to authenticated organization members and admin service roles.
