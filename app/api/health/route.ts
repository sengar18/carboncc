// ==============================================================================
// CARBONSCOUT INDIA — SYSTEM HEALTH & PROVIDER STATUS API
// ==============================================================================

import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
  const isMockAI = config.aiProvider === 'mock';
  const isMockResearch = config.researchProvider === 'mock';
  const isMockDB = config.databaseProvider === 'mock_memory';
  const hasMockActive = isMockAI || isMockResearch || isMockDB;

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0-evidence-v1',
    providers: {
      ai: config.aiProvider,
      research: config.researchProvider,
      database: config.databaseProvider,
    },
    flags: {
      mockMode: hasMockActive,
      supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseAnonKey),
      firecrawlConfigured: Boolean(config.firecrawlApiKey),
      geminiConfigured: Boolean(config.geminiApiKey),
      groqConfigured: Boolean(config.groqApiKey),
      openaiConfigured: Boolean(config.openaiApiKey),
    },
  });
}
