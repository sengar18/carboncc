// ==============================================================================
// CARBONSCOUT INDIA — GLOBAL CONFIGURATION LOADER
// ==============================================================================

export interface AppConfig {
  nodeEnv: string;
  mockMode: boolean;
  aiProvider: 'mock' | 'gemini' | 'openai' | 'groq' | 'deepseek';
  researchProvider: 'mock' | 'firecrawl';
  databaseProvider: 'mock_memory' | 'supabase';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  geminiApiKey?: string;
  groqApiKey?: string;
  openaiApiKey?: string;
  deepseekApiKey?: string;
  firecrawlApiKey?: string;
  maxUploadSizeBytes: number;
  allowedFileTypes: string[];
  allowedMimeTypes: string[];
}

export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  mockMode: process.env.NODE_ENV === 'production' ? false : process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  aiProvider: (process.env.AI_PROVIDER as AppConfig['aiProvider']) || 'deepseek',
  researchProvider: (process.env.RESEARCH_PROVIDER as any) || 'mock',
  databaseProvider: (process.env.DATABASE_PROVIDER as any) || 'mock_memory',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
  maxUploadSizeBytes: parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || '10485760', 10), // 10MB hard cap
  allowedFileTypes: (
    process.env.ALLOWED_FILE_TYPES ||
    'application/pdf,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ).split(','),
  allowedMimeTypes: (
    process.env.ALLOWED_FILE_TYPES ||
    'application/pdf,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ).split(','),
};
