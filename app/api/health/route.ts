// ==============================================================================
// CARBONSCOUT INDIA — SYSTEM HEALTH & PROVIDER STATUS API
// ==============================================================================

import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0-mock',
    providers: {
      ai: config.aiProvider,
      research: config.researchProvider,
      database: config.databaseProvider,
    },
    flags: {
      mockMode: config.aiProvider === 'mock' && config.researchProvider === 'mock',
      supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseAnonKey),
      firecrawlConfigured: Boolean(config.firecrawlApiKey),
      geminiConfigured: Boolean(config.geminiApiKey),
      openaiConfigured: Boolean(config.openaiApiKey),
    },
  });
}
