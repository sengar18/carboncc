// ==============================================================================
// CARBONSCOUT INDIA — GLOBAL CONFIGURATION LOADER
// ==============================================================================

export interface AppConfig {
  nodeEnv: string;
  mockMode: boolean;
  aiProvider: 'mock' | 'gemini' | 'openai' | 'groq';
  researchProvider: 'mock' | 'firecrawl';
  databaseProvider: 'mock_memory' | 'supabase';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  geminiApiKey?: string;
  groqApiKey?: string;
  openaiApiKey?: string;
  firecrawlApiKey?: string;
  maxUploadSizeBytes: number;
  allowedFileTypes: string[];
}

export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  mockMode: process.env.NODE_ENV === 'production' ? false : process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  aiProvider: (process.env.AI_PROVIDER as any) || 'mock',
  researchProvider: (process.env.RESEARCH_PROVIDER as any) || 'mock',
  databaseProvider: (process.env.DATABASE_PROVIDER as any) || 'mock_memory',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
  maxUploadSizeBytes: parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || '15728640', 10), // 15MB
  allowedFileTypes: (
    process.env.ALLOWED_FILE_TYPES ||
    'application/pdf,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ).split(','),
};
