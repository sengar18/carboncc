// ==============================================================================
// CARBONSCOUT INDIA — SECURE AUDIT LOGGING SERVICE
// ==============================================================================

import { memoryStore } from './db/memory-store';
import { AuditLog } from './db/schema';

const SENSITIVE_KEYS = [
  'api_key',
  'apikey',
  'token',
  'secret',
  'password',
  'authorization',
  'bearer',
  'service_role',
  'supabase_service_role_key',
  'firecrawl_api_key',
  'gemini_api_key',
  'openai_api_key',
];

export function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some((s) => lowerKey.includes(s));

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = redactSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export async function logAuditEvent(params: {
  entityType: string;
  entityId: string;
  action: string;
  actorId?: string;
  actorRole?: string;
  details?: Record<string, any>;
}): Promise<AuditLog> {
  const sanitizedDetails = params.details ? redactSensitiveData(params.details) : undefined;

  const entry = memoryStore.addAuditLog({
    entity_type: params.entityType,
    entity_id: params.entityId,
    action: params.action,
    actor_id: params.actorId || 'system',
    actor_role: params.actorRole || 'SYSTEM',
    details: sanitizedDetails,
  });

  return entry;
}
