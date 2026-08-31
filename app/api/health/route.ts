// ==============================================================================
// CARBONSCOUT INDIA — HEALTH CHECK & DIAGNOSTICS ENDPOINT
// ==============================================================================

import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
  const flags = {
    mockMode: config.mockMode,
    supabaseConfigured: !!(config.supabaseUrl && config.supabaseAnonKey),
    supabaseServiceRoleConfigured: !!config.supabaseServiceRoleKey,
    firecrawlConfigured: !!config.firecrawlApiKey,
    geminiConfigured: !!config.geminiApiKey,
    groqConfigured: !!config.groqApiKey,
    openaiConfigured: !!config.openaiApiKey,
  };

  const providers = {
    ai: config.aiProvider,
    research: config.researchProvider,
    database: config.databaseProvider,
  };

  return NextResponse.json({
    status: 'healthy',
    environment: config.nodeEnv,
    providers,
    flags,
    timestamp: new Date().toISOString(),
  });
}
