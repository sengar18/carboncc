// ==============================================================================
// CARBONSCOUT INDIA — SYSTEM CONFIGURATION & FEATURE FLAGS
// ==============================================================================

export interface AppConfig {
  aiProvider: 'mock' | 'gemini' | 'openai';
  researchProvider: 'mock' | 'firecrawl';
  databaseProvider: 'mock_memory' | 'supabase';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceKey?: string;
  firecrawlApiKey?: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  maxUploadSizeBytes: number;
  allowedMimeTypes: string[];
}

export const config: AppConfig = {
  aiProvider: (process.env.AI_PROVIDER as any) || 'mock',
  researchProvider: (process.env.RESEARCH_PROVIDER as any) || 'mock',
  databaseProvider: (process.env.DATABASE_PROVIDER as any) || 'mock_memory',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  maxUploadSizeBytes: parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || '15728640', 10), // 15MB
  allowedMimeTypes: [
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ],
};
