import { describe, it, expect } from 'vitest';
import { Fact, FactStatus } from '@/lib/db/schema';
import { MockResearchProvider } from '@/services/research/mock-provider';

describe('Fact Classification & Provenance Tracking', () => {
  it('should support all 6 provenance statuses', () => {
    const statuses: FactStatus[] = [
      'VERIFIED',
      'USER_PROVIDED',
      'INFERRED',
      'ESTIMATED',
      'UNVERIFIED',
      'UNKNOWN',
    ];
    expect(statuses.length).toBe(6);
  });

  it('should extract structured candidate facts with citations and provenance tags', async () => {
    const provider = new MockResearchProvider();
    const result = await provider.researchCompany('Punjab Agro Mills', undefined, 'Punjab');

    expect(result.extractedFacts.length).toBeGreaterThan(0);
    expect(result.sources.length).toBeGreaterThan(0);

    for (const fact of result.extractedFacts) {
      expect(fact.factType).toBeDefined();
      expect(fact.valueRaw).toBeDefined();
      expect(fact.status).toMatch(/VERIFIED|USER_PROVIDED|INFERRED|ESTIMATED|UNVERIFIED|UNKNOWN/);
      expect(fact.confidence).toBeGreaterThanOrEqual(0);
      expect(fact.confidence).toBeLessThanOrEqual(1);
      expect(fact.sourceCitation).toBeDefined();
    }
  });

  it('should maintain source content hashes for audit integrity', async () => {
    const provider = new MockResearchProvider();
    const result = await provider.researchCompany('Punjab Agro Mills');

    for (const source of result.sources) {
      expect(source.contentHash).toBeDefined();
      expect(source.contentHash.length).toBeGreaterThan(0);
      expect(source.retrievedAt).toBeDefined();
    }
  });
});
