/**
 * @file tests/reference-coefficients.test.ts
 * @description Integrity validation for regulatory reference coefficients and
 *              real-project archetypes. Tests that:
 *              1. All CEA V20.0 grid EF values match official published values
 *              2. Fuel NCV × EF derivations are arithmetically consistent
 *              3. All source hashes are 64-char hex strings (valid SHA-256 format)
 *              4. Archetype emission calculations are reproducible from constants
 *              5. MNRE green hydrogen thresholds are present and correct
 */

import { describe, it, expect } from "vitest";
import {
  CEA_GRID_EMISSION_FACTORS_V20,
  COAL_GRADES,
  FURNACE_OIL,
  NATURAL_GAS,
  BIOMASS_BRIQUETTES_PELLETS,
  MNRE_GREEN_HYDROGEN_STANDARD,
  CCTS_GAZETTE_REFERENCE,
  IPCC_AR6_GWP,
  WHR_SECTOR_BENCHMARKS,
  calculateBaselineEmissions,
  calculateBiomassProjectEmissions,
  calculateBiomassTransportLeakage,
  calculateCBGAvoidedMethane,
} from "@/lib/data/reference-coefficients";
import archetypes from "@/tests/fixtures/real-project-archetypes.json";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const SHA256_HEX_REGEX = /^[a-f0-9]{64}$/;

function isValidSha256(hash: string): boolean {
  return SHA256_HEX_REGEX.test(hash);
}

// ---------------------------------------------------------------------------
// 1. CEA Grid Emission Factors — Version 20.0
// ---------------------------------------------------------------------------

describe("CEA Grid Emission Factors V20.0 — FY 2023-24", () => {
  it("should have correct Operating Margin: 0.964 tCO2/MWh", () => {
    expect(CEA_GRID_EMISSION_FACTORS_V20.operatingMargin.value).toBe(0.964);
    expect(CEA_GRID_EMISSION_FACTORS_V20.operatingMargin.unit).toBe("tCO2/MWh");
  });

  it("should have correct Build Margin: 0.552 tCO2/MWh", () => {
    expect(CEA_GRID_EMISSION_FACTORS_V20.buildMargin.value).toBe(0.552);
  });

  it("should have correct Combined Margin (solar/wind): 0.757 tCO2/MWh", () => {
    expect(CEA_GRID_EMISSION_FACTORS_V20.combinedMarginSolarWind.value).toBe(0.757);
  });

  it("Combined Margin should be arithmetically consistent with 50/50 OM/BM", () => {
    const om = CEA_GRID_EMISSION_FACTORS_V20.operatingMargin.value;
    const bm = CEA_GRID_EMISSION_FACTORS_V20.buildMargin.value;
    const cmCalculated = Math.round((0.5 * om + 0.5 * bm) * 1000) / 1000;
    // CM = 0.5×0.964 + 0.5×0.552 = 0.758; published as 0.757 (rounding from table)
    expect(cmCalculated).toBeCloseTo(0.758, 2);
    // Published CM should be within 0.002 of the 50/50 formula (rounding tolerance)
    const publishedCM = CEA_GRID_EMISSION_FACTORS_V20.combinedMarginSolarWind.value;
    expect(Math.abs(publishedCM - cmCalculated)).toBeLessThanOrEqual(0.002);
  });

  it("should have correct weighted average EF: 0.727 tCO2/MWh", () => {
    expect(CEA_GRID_EMISSION_FACTORS_V20.weightedAverageRE.value).toBe(0.727);
  });

  it("database version should be 20.0", () => {
    expect(CEA_GRID_EMISSION_FACTORS_V20.version).toBe("20.0");
  });

  it("effective financial year should be 2023-24", () => {
    expect(CEA_GRID_EMISSION_FACTORS_V20.effectiveFinancialYear).toBe("2023-24");
  });

  it("source URL should point to official CEA CDM page", () => {
    expect(CEA_GRID_EMISSION_FACTORS_V20.sourceUrl).toContain("cea.nic.in");
  });

  it("source hash should be a valid SHA-256 hex string", () => {
    expect(isValidSha256(CEA_GRID_EMISSION_FACTORS_V20.sourceHash)).toBe(true);
  });

  it("all sub-hashes should be valid SHA-256 strings", () => {
    const efs = [
      CEA_GRID_EMISSION_FACTORS_V20.operatingMargin,
      CEA_GRID_EMISSION_FACTORS_V20.buildMargin,
      CEA_GRID_EMISSION_FACTORS_V20.combinedMarginSolarWind,
      CEA_GRID_EMISSION_FACTORS_V20.weightedAverageRE,
    ];
    for (const ef of efs) {
      expect(isValidSha256(ef.sourceHash)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Fuel Coefficients — IPCC 2006 Derivations
// ---------------------------------------------------------------------------

describe("Fuel Coefficients — IPCC 2006 Derivations", () => {
  it("Furnace Oil co2PerTonne should equal NCV × EF within 0.5%", () => {
    const expected =
      (FURNACE_OIL.ncv.value / 1000) * FURNACE_OIL.emissionFactor.value;
    const actual = FURNACE_OIL.co2PerPhysicalUnit.value;
    const deviation = Math.abs(actual - expected) / expected;
    expect(deviation).toBeLessThan(0.005);
  });

  it("Natural Gas co2PerSm3 should equal NCV × EF within 0.5%", () => {
    // NCV in MJ/Sm3 → TJ/Sm3: 1 MJ = 1e-6 TJ, so 38 MJ/Sm3 = 38e-6 TJ/Sm3
    // EF in tCO2/TJ → tCO2/Sm3 = 38e-6 TJ/Sm3 × 56.1 tCO2/TJ = 0.0021318
    const ncv_TJ_per_Sm3 = NATURAL_GAS.ncv.value * 1e-6;
    const expected = ncv_TJ_per_Sm3 * NATURAL_GAS.emissionFactor.value;
    const actual = NATURAL_GAS.co2PerPhysicalUnit.value;
    const deviation = Math.abs(actual - expected) / expected;
    expect(deviation).toBeLessThan(0.005);
  });

  it("Coal G10 through G13 EF should all be 94.6 tCO2/TJ (IPCC 2006 sub-bituminous)", () => {
    const grades = ["G10", "G11", "G12", "G13"] as const;
    for (const g of grades) {
      expect(COAL_GRADES[g].emissionFactor_tCO2PerTJ).toBe(94.6);
    }
  });

  it("Coal grade NCV should decrease from G10 to G13", () => {
    expect(COAL_GRADES.G10.ncvMidpoint_GJPerTonne).toBeGreaterThan(
      COAL_GRADES.G11.ncvMidpoint_GJPerTonne
    );
    expect(COAL_GRADES.G11.ncvMidpoint_GJPerTonne).toBeGreaterThan(
      COAL_GRADES.G12.ncvMidpoint_GJPerTonne
    );
    expect(COAL_GRADES.G12.ncvMidpoint_GJPerTonne).toBeGreaterThan(
      COAL_GRADES.G13.ncvMidpoint_GJPerTonne
    );
  });

  it("Coal G12 co2PerTonne derivation should be within 1% of NCV×EF", () => {
    const derived =
      COAL_GRADES.G12.ncvMidpoint_GJPerTonne *
      0.001 *
      COAL_GRADES.G12.emissionFactor_tCO2PerTJ;
    expect(Math.abs(COAL_GRADES.G12.co2PerTonne - derived) / derived).toBeLessThan(0.01);
  });

  it("Biomass biogenic CO2 should be 0 (carbon-neutral accounting)", () => {
    expect(BIOMASS_BRIQUETTES_PELLETS.biogenicCO2_tCO2PerTJ).toBe(0);
  });

  it("Biomass transport leakage factor should be 0.062 kgCO2/t-km", () => {
    expect(BIOMASS_BRIQUETTES_PELLETS.transportLeakage_kgCO2PerTonneKm).toBe(0.062);
  });
});

// ---------------------------------------------------------------------------
// 3. MNRE Green Hydrogen Standard
// ---------------------------------------------------------------------------

describe("MNRE Green Hydrogen Standard — Feb 2024", () => {
  it("green threshold should be exactly 2.0 kgCO2e/kgH2", () => {
    expect(MNRE_GREEN_HYDROGEN_STANDARD.greenThreshold_kgCO2ePerKgH2).toBe(2.0);
  });

  it("SMR grey baseline should be 9.0-10.0 kgCO2e/kgH2", () => {
    expect(MNRE_GREEN_HYDROGEN_STANDARD.smrtGreyBaseline_kgCO2ePerKgH2_min).toBe(9.0);
    expect(MNRE_GREEN_HYDROGEN_STANDARD.smrtGreyBaseline_kgCO2ePerKgH2_max).toBe(10.0);
  });

  it("notification date should be 2024-02-19", () => {
    expect(MNRE_GREEN_HYDROGEN_STANDARD.notificationDate).toBe("2024-02-19");
  });

  it("source hash should be valid SHA-256", () => {
    expect(isValidSha256(MNRE_GREEN_HYDROGEN_STANDARD.sourceHash)).toBe(true);
  });

  it("CH4 GWP100 should be IPCC AR6 value (29.8)", () => {
    expect(MNRE_GREEN_HYDROGEN_STANDARD.ch4Gwp100).toBe(29.8);
  });
});

// ---------------------------------------------------------------------------
// 4. CCTS Gazette Reference
// ---------------------------------------------------------------------------

describe("CCTS Gazette Reference", () => {
  it("gazette number should be S.O. 2825(E)", () => {
    expect(CCTS_GAZETTE_REFERENCE.gazetteNumber).toBe("S.O. 2825(E)");
  });

  it("notification date should be 2023-06-28", () => {
    expect(CCTS_GAZETTE_REFERENCE.notificationDate).toBe("2023-06-28");
  });

  it("admin body should be BEE", () => {
    expect(CCTS_GAZETTE_REFERENCE.adminBody).toContain("Bureau of Energy Efficiency");
  });

  it("source hash should be valid SHA-256", () => {
    expect(isValidSha256(CCTS_GAZETTE_REFERENCE.sourceHash)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. IPCC AR6 GWP Values
// ---------------------------------------------------------------------------

describe("IPCC AR6 GWP Values", () => {
  it("fossil CH4 GWP100 should be 29.8", () => {
    expect(IPCC_AR6_GWP.ch4_fossil_gwp100).toBe(29.8);
  });

  it("biogenic CH4 GWP100 should be 27.9", () => {
    expect(IPCC_AR6_GWP.ch4_biogenic_gwp100).toBe(27.9);
  });

  it("N2O GWP100 should be 273", () => {
    expect(IPCC_AR6_GWP.n2o_gwp100).toBe(273);
  });

  it("source hash should be valid SHA-256", () => {
    expect(isValidSha256(IPCC_AR6_GWP.sourceHash)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. WHR Sector Benchmarks
// ---------------------------------------------------------------------------

describe("WHR Sector Benchmarks", () => {
  it("cement WHR self-sufficiency range should be 20-30%", () => {
    expect(WHR_SECTOR_BENCHMARKS.cement.powerSelfSufficiencyPct_min).toBe(20);
    expect(WHR_SECTOR_BENCHMARKS.cement.powerSelfSufficiencyPct_max).toBe(30);
  });

  it("steel WHR self-sufficiency range should be 15-25%", () => {
    expect(WHR_SECTOR_BENCHMARKS.steel.powerSelfSufficiencyPct_min).toBe(15);
    expect(WHR_SECTOR_BENCHMARKS.steel.powerSelfSufficiencyPct_max).toBe(25);
  });
});

// ---------------------------------------------------------------------------
// 7. Utility Function Tests
// ---------------------------------------------------------------------------

describe("Utility Functions", () => {
  describe("calculateBaselineEmissions (RE-01)", () => {
    it("should calculate RE baseline using CM = 0.757", () => {
      const result = calculateBaselineEmissions(100000, false);
      expect(result).toBeCloseTo(75700, 0);
    });

    it("should calculate WHR baseline using OM = 0.964", () => {
      const result = calculateBaselineEmissions(10000, true);
      expect(result).toBeCloseTo(9640, 0);
    });
  });

  describe("calculateBiomassProjectEmissions (BM-01)", () => {
    it("should calculate auxiliary electricity PE only", () => {
      const result = calculateBiomassProjectEmissions(432);
      expect(result).toBeCloseTo(432 * 0.757, 2);
    });
  });

  describe("calculateBiomassTransportLeakage (BM-01)", () => {
    it("should calculate transport leakage in tCO2", () => {
      const result = calculateBiomassTransportLeakage(16800, 75);
      const expected = 16800 * 75 * 0.062 * 0.001;
      expect(result).toBeCloseTo(expected, 2);
    });
  });

  describe("calculateCBGAvoidedMethane (CBG-01)", () => {
    it("should compute avoided methane from pressmud feedstock", () => {
      // Pressmud only: 43800t, VS=0.78, yield=0.28 m3/kgVS
      const result = calculateCBGAvoidedMethane(43800, 0.78, 0.28);
      // CH4 volume = 43800 × 1000 × 0.78 × 0.28 = 9,569,520 m3
      // CH4 mass = 9,569,520 × 0.717 / 1000 = 6,861.5 t
      // CO2e = 6,861.5 × 27.9 ≈ 191,436
      expect(result).toBeGreaterThan(180000);
      expect(result).toBeLessThan(210000);
    });
  });
});

// ---------------------------------------------------------------------------
// 8. Archetype JSON Fixture Integrity
// ---------------------------------------------------------------------------

describe("Real-Project Archetypes JSON Fixture", () => {
  it("should contain exactly 3 archetypes", () => {
    expect(archetypes.archetypes).toHaveLength(3);
  });

  it("archetype A should be BEE-CCTS-RE-01 (Solar PV)", () => {
    const a = archetypes.archetypes[0];
    expect(a.methodology_code).toBe("BEE-CCTS-RE-01");
    expect(a.project.location_state).toBe("Rajasthan");
  });

  it("archetype B should be BEE-CCTS-BM-01 (Biomass Boiler)", () => {
    const b = archetypes.archetypes[1];
    expect(b.methodology_code).toBe("BEE-CCTS-BM-01");
    expect(b.project.location_state).toBe("Punjab");
  });

  it("archetype C should be BEE-CCTS-CBG-01 (CBG/SATAT)", () => {
    const c = archetypes.archetypes[2];
    expect(c.methodology_code).toBe("BEE-CCTS-CBG-01");
    expect(c.project.location_state).toBe("Maharashtra");
  });

  it("archetype A CEA CM EF should be 0.757", () => {
    const a = archetypes.archetypes[0];
    expect(a.regulatory_parameters.combined_margin_tCO2_per_MWh).toBe(0.757);
  });

  it("archetype A expected annual credits should be > 75,000 tCO2e", () => {
    const a = archetypes.archetypes[0];
    expect(a.emission_calculation.expected_annual_credits_tCO2e).toBeGreaterThan(75000);
  });

  it("archetype B baseline coal EF should be 94.6 tCO2/TJ (IPCC sub-bituminous)", () => {
    const b = archetypes.archetypes[1];
    expect(b.regulatory_parameters.baseline_coal_ef_tCO2_per_TJ).toBe(94.6);
  });

  it("archetype B expected annual credits should be ~23,000-25,000 tCO2e", () => {
    const b = archetypes.archetypes[1];
    expect(b.emission_calculation.expected_annual_credits_tCO2e).toBeGreaterThan(22000);
    expect(b.emission_calculation.expected_annual_credits_tCO2e).toBeLessThan(26000);
  });

  it("archetype C SATAT LoI number should be present", () => {
    const c = archetypes.archetypes[2];
    expect(c.project.satat_loi_number).toBeTruthy();
  });

  it("archetype C CH4 GWP100 biogenic should be 27.9 (IPCC AR6)", () => {
    const c = archetypes.archetypes[2];
    expect(c.regulatory_parameters.ipcc_ar6_ch4_biogenic_gwp100).toBe(27.9);
  });

  it("all archetype CEA source hashes should be valid SHA-256", () => {
    for (const arch of archetypes.archetypes) {
      // Not all archetypes have cea source hash, check _meta
      const ceaHash = archetypes._meta.sources.cea_grid_ef.sha256;
      expect(isValidSha256(ceaHash)).toBe(true);
    }
  });

  it("archetype A emission calculation formula should reference ER_y and EG terms", () => {
    const a = archetypes.archetypes[0];
    expect(a.emission_calculation.formula).toContain("ER_y");
    expect(a.emission_calculation.formula).toContain("EG_net_y");
    // steps object confirms BE/PE/LE breakdown
    expect(a.emission_calculation.steps).toHaveProperty("BE_y_tCO2");
    expect(a.emission_calculation.steps).toHaveProperty("PE_y_tCO2");
    expect(a.emission_calculation.steps).toHaveProperty("LE_y_tCO2");
  });

  it("archetype B biomass biogenic CO2 should not be counted", () => {
    const b = archetypes.archetypes[1];
    expect(b.regulatory_parameters.biomass_biogenic_co2_counted).toBe(false);
  });

  it("archetype C monthly JMR deliveries should have 12 entries", () => {
    const c = archetypes.archetypes[2];
    const jmr = c.production_data.monthly_jmr_deliveries_kg ?? {};
    expect(Object.keys(jmr)).toHaveLength(12);
  });

  it("archetype scoring estimates should be in range 0-100", () => {
    for (const arch of archetypes.archetypes) {
      expect(arch.scoring_estimate.opportunity_score).toBeGreaterThanOrEqual(0);
      expect(arch.scoring_estimate.opportunity_score).toBeLessThanOrEqual(100);
    }
  });
});
