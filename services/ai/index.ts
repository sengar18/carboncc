// ==============================================================================
// CARBONSCOUT INDIA — AI PROVIDER FACTORY
// ==============================================================================

import { config } from '@/lib/config';
import { IAIProvider } from './types';
import { MockAIProvider } from './mock-provider';
import { GeminiAIProvider } from './gemini-provider';
import { OpenAIAIProvider } from './openai-provider';
import { GroqAIProvider } from './groq-provider';
import { DeepSeekAIProvider } from './deepseek-provider';

export type AIProviderName = 'mock' | 'gemini' | 'openai' | 'groq' | 'deepseek';

/**
 * Factory that returns an AI provider instance.
 * @param overrideProvider - Optional provider name to override the global config.
 * @param customApiKey     - Optional API key passed from per-request credentials (BYOK).
 * @param customModel      - Optional model name override.
 */
export function getAIProvider(
  overrideProvider?: AIProviderName,
  customApiKey?: string,
  customModel?: string
): IAIProvider {
  const providerType = overrideProvider || config.aiProvider;

  if (providerType === 'deepseek') {
    return new DeepSeekAIProvider(customApiKey, customModel);
  }
  if (providerType === 'gemini') {
    return new GeminiAIProvider();
  }
  if (providerType === 'openai') {
    return new OpenAIAIProvider();
  }
  if (providerType === 'groq') {
    return new GroqAIProvider(customApiKey, customModel);
  }

  // Safety check: Mock providers cannot run in production mode
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Production Security Gate: MockAIProvider cannot be initialized in production. ' +
        'Configure DEEPSEEK_API_KEY, GROQ_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY.'
    );
  }

  return new MockAIProvider();
}

export * from './types';
export * from './mock-provider';
export * from './gemini-provider';
export * from './openai-provider';
export * from './groq-provider';
export * from './deepseek-provider';
