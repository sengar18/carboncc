# CarbonScout India — AI Reasoning & Pipeline Specification

## 1. AI Layer Principles

1. **Provider Agnostic**: Unified interface `IAIProvider` implemented by `MockAIProvider`, `GeminiAIProvider`, and `OpenAIAIProvider`.
2. **Strict Structured Outputs**: All LLM interactions use Zod schemas for schema validation and JSON structure enforcement.
3. **No Mathematical Calculation by LLMs**: The AI pipeline extracts information and synthesizes explanations, but never calculates emissions or opportunity scores.
4. **Graceful Fallback**: If an external LLM fails, times out, or returns malformed JSON, the provider automatically falls back to deterministic mock generators.

---

## 2. Core Schemas & Prompts

### 1. Fact Verification (`FactVerificationSchema`)
- Inputs: List of candidate facts extracted from web sources.
- Task: Evaluate fact confidence, identify any internal contradictions, and categorize status (`VERIFIED`, `INFERRED`, `ESTIMATED`, `UNVERIFIED`).

### 2. Data Gap Identification (`DataGapSchema`)
- Inputs: Current known facts for a project, sector requirements.
- Task: Identify missing operational data points needed for methodology screening and formulate clear, jargon-free questions for the business owner.

### 3. Methodology Matching (`MethodologyMatchSchema`)
- Inputs: Verified facts, candidate methodology registry.
- Task: Evaluate fit status (`MATCH`, `PARTIAL`, `MISMATCH`, `INSUFFICIENT_INFORMATION`) and document red flags.

### 4. Preliminary Report Generation (`PreliminaryReportSchema`)
- Inputs: Project profile, fact ledger, matched methodology, deterministic score.
- Task: Synthesize an executive briefing, applicability narrative, uncertainty notes, and prioritized next steps.
