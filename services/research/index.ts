// ==============================================================================
// CARBONSCOUT INDIA — RESEARCH SERVICE FACTORY
// ==============================================================================

import { config } from '@/lib/config';
import { IResearchProvider } from './types';
import { MockResearchProvider } from './mock-provider';
import { FirecrawlResearchProvider } from './firecrawl-provider';

export function getResearchProvider(overrideProvider?: 'mock' | 'firecrawl'): IResearchProvider {
  const providerType = overrideProvider || config.researchProvider;
  if (providerType === 'firecrawl') {
    return new FirecrawlResearchProvider();
  }

  // Safety check: Mock research provider cannot run in production mode
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Production Security Gate: MockResearchProvider cannot be initialized in production environment. Configure FIRECRAWL_API_KEY.'
    );
  }

  return new MockResearchProvider();
}

export * from './types';
export * from './mock-provider';
export * from './firecrawl-provider';
