// ==============================================================================
// CARBONSCOUT INDIA — UNIT CONVERTER & NORMALIZER
// ==============================================================================

export class UnitConverter {
  /**
   * Normalizes mass to Metric Tonnes (MT).
   */
  public static normalizeMassToMT(value: number, unit?: string): number {
    if (!unit) return value;
    const u = unit.toLowerCase().trim();

    if (u === 'kg' || u === 'kilograms' || u === 'kilogram') {
      return value / 1000;
    }
    if (u === 'quintals' || u === 'quintal' || u === 'qtl') {
      return value / 10;
    }
    if (u === 'grams' || u === 'g') {
      return value / 1000000;
    }
    if (u === 'lbs' || u === 'pounds') {
      return value * 0.00045359237;
    }
    // Default assumed MT
    return value;
  }

  /**
   * Normalizes energy to Megawatt-hours (MWh).
   */
  public static normalizeEnergyToMWh(value: number, unit?: string): number {
    if (!unit) return value;
    const u = unit.toLowerCase().trim();

    if (u === 'kwh' || u === 'units' || u === 'kilowatt-hours') {
      return value / 1000;
    }
    if (u === 'gwh') {
      return value * 1000;
    }
    if (u === 'gj' || u === 'gigajoules') {
      return value * 0.277778;
    }
    return value;
  }

  /**
   * Normalizes area to Hectares (ha).
   */
  public static normalizeAreaToHectares(value: number, unit?: string): number {
    if (!unit) return value;
    const u = unit.toLowerCase().trim();

    if (u === 'acres' || u === 'acre') {
      return value * 0.404686;
    }
    if (u === 'sqm' || u === 'sq_meters' || u === 'm2') {
      return value / 10000;
    }
    if (u === 'bigha') {
      // Standard North Indian bigha approx 0.25 ha
      return value * 0.25;
    }
    return value;
  }
}
