import { describe, it, expect } from 'vitest';
import { UnitConverter } from '@/services/calculations/unit-converter';
import { CalculationEngine } from '@/services/calculations/engine';

describe('Unit Converter', () => {
  it('should normalize mass accurately to Metric Tonnes (MT)', () => {
    expect(UnitConverter.normalizeMassToMT(1000, 'kg')).toBe(1);
    expect(UnitConverter.normalizeMassToMT(10, 'quintals')).toBe(1);
    expect(UnitConverter.normalizeMassToMT(500, 'MT')).toBe(500);
  });

  it('should normalize energy accurately to Megawatt-hours (MWh)', () => {
    expect(UnitConverter.normalizeEnergyToMWh(1000, 'kWh')).toBe(1);
    expect(UnitConverter.normalizeEnergyToMWh(2, 'GWh')).toBe(2000);
    expect(UnitConverter.normalizeEnergyToMWh(50, 'MWh')).toBe(50);
  });

  it('should normalize area to Hectares (ha)', () => {
    expect(Number(UnitConverter.normalizeAreaToHectares(10, 'acres').toFixed(2))).toBe(4.05);
    expect(UnitConverter.normalizeAreaToHectares(10000, 'sqm')).toBe(1);
  });
});

describe('Deterministic Calculation Engine', () => {
  const engine = new CalculationEngine();

  it('should calculate net abatement accurately for valid inputs in SYNTH-AGRI-001', () => {
    const result = engine.calculateAgriBiomass([
      {
        key: 'ANNUAL_BIOMASS_RESIDUE_MT',
        label: 'Surplus Biomass',
        valueRaw: 10000,
        unit: 'MT',
        isMandatory: true,
      },
    ]);

    expect(result.status).toBe('SUCCESS');
    expect(result.isSynthetic).toBe(true);
    // Baseline: 10,000 * 0.95 = 9,500 tCO2e
    // Project: 10,000 * 0.05 = 500 tCO2e
    // Leakage: 9,500 * 0.02 = 190 tCO2e
    // Net: 9,500 - 500 - 190 = 8,810 tCO2e
    expect(result.outputs.baselineEmissions_tCO2e).toBe(9500);
    expect(result.outputs.projectEmissions_tCO2e).toBe(500);
    expect(result.outputs.leakageEmissions_tCO2e).toBe(190);
    expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBe(8810);
    expect(result.explanation).toContain('DETERMINISTIC SYNTHETIC CALCULATION BREAKDOWN');
  });

  it('should return INSUFFICIENT_DATA when mandatory inputs are missing without guessing values', () => {
    const result = engine.calculateAgriBiomass([]);

    expect(result.status).toBe('INSUFFICIENT_DATA');
    expect(result.missingInputs).toBeDefined();
    expect(result.missingInputs!.length).toBeGreaterThan(0);
    expect(result.outputs.estimatedAnnualAbatement_tCO2e).toBeUndefined();
    expect(result.assumptions).toContain('Never substitute guessed values into emission reduction models.');
  });
});
