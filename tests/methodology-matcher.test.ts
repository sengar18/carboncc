import { describe, it, expect } from 'vitest';
import { MethodologyMatcher } from '@/services/methodology/matcher';
import { SYNTH_AGRI_001 } from '@/services/methodology/synthetic-agri';
import { Fact } from '@/lib/db/schema';

describe('Methodology Matching Engine', () => {
  const matcher = new MethodologyMatcher();

  it('should match an eligible facility with sufficient feedstock and grid connection', () => {
    const facts: Fact[] = [
      {
        id: 'f-1',
        project_id: 'p-1',
        fact_type: 'ANNUAL_BIOMASS_RESIDUE_MT',
        value_raw: '5000',
        value_numeric: 5000,
        unit: 'MT/year',
        status: 'VERIFIED',
        confidence: 0.95,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'f-2',
        project_id: 'p-1',
        fact_type: 'GRID_CONNECTED',
        value_raw: 'true',
        status: 'VERIFIED',
        confidence: 1.0,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'f-3',
        project_id: 'p-1',
        fact_type: 'EXISTING_CARBON_CREDITS',
        value_raw: 'false',
        status: 'USER_PROVIDED',
        confidence: 1.0,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const result = matcher.evaluateMethodology(SYNTH_AGRI_001, facts, 'Rice / Food Processing');
    expect(result.status).toBe('MATCH');
    expect(result.failedCount).toBe(0);
    expect(result.missingCount).toBe(0);
  });

  it('should return MISMATCH when a mandatory applicability condition fails', () => {
    const facts: Fact[] = [
      {
        id: 'f-1',
        project_id: 'p-1',
        fact_type: 'ANNUAL_BIOMASS_RESIDUE_MT',
        value_raw: '300', // Below 1,000 MT/year threshold
        value_numeric: 300,
        unit: 'MT/year',
        status: 'VERIFIED',
        confidence: 0.95,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const result = matcher.evaluateMethodology(SYNTH_AGRI_001, facts, 'Rice / Food Processing');
    expect(result.status).toBe('MISMATCH');
    expect(result.failedCount).toBeGreaterThan(0);
    expect(result.redFlags.length).toBeGreaterThan(0);
  });

  it('should return INSUFFICIENT_INFORMATION when required facts are missing instead of forcing yes/no', () => {
    const facts: Fact[] = []; // Zero facts provided

    const result = matcher.evaluateMethodology(SYNTH_AGRI_001, facts, 'Rice / Food Processing');
    expect(result.status).toBe('INSUFFICIENT_INFORMATION');
    expect(result.missingCount).toBeGreaterThan(1);
    expect(result.missingDataGaps.length).toBeGreaterThan(1);
  });

  it('should flag contradictory facts appropriately', () => {
    const facts: Fact[] = [
      {
        id: 'f-1',
        project_id: 'p-1',
        fact_type: 'GRID_CONNECTED',
        value_raw: 'true',
        status: 'USER_PROVIDED',
        confidence: 0.8,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'f-2',
        project_id: 'p-1',
        fact_type: 'GRID_CONNECTED',
        value_raw: 'false',
        status: 'UNVERIFIED',
        confidence: 0.5,
        extraction_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const result = matcher.evaluateMethodology(SYNTH_AGRI_001, facts, 'Rice / Food Processing');
    expect(result.contradictoryCount).toBeGreaterThan(0);
  });
});
