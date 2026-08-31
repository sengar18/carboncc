// ==============================================================================
// CARBONSCOUT INDIA — AI PROVIDER FACTORY
// ==============================================================================

import { config } from '@/lib/config';
import { IAIProvider } from './types';
import { MockAIProvider } from './mock-provider';
import { GeminiAIProvider } from './gemini-provider';
import { OpenAIAIProvider } from './openai-provider';
import { GroqAIProvider } from './groq-provider';

export function getAIProvider(overrideProvider?: 'mock' | 'gemini' | 'openai' | 'groq'): IAIProvider {
  const providerType = overrideProvider || config.aiProvider;
  if (providerType === 'gemini') {
    return new GeminiAIProvider();
  }
  if (providerType === 'openai') {
    return new OpenAIAIProvider();
  }
  if (providerType === 'groq') {
    return new GroqAIProvider();
  }

  // Safety check: Mock providers cannot run in production mode
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Production Security Gate: MockAIProvider cannot be initialized in production environment. Configure GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY.'
    );
  }

  return new MockAIProvider();
}

export * from './types';
export * from './mock-provider';
export * from './gemini-provider';
export * from './openai-provider';
export * from './groq-provider';
