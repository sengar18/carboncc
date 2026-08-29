// ==============================================================================
// CARBONSCOUT INDIA — OFFICIAL METHODOLOGY REGISTRY
// ==============================================================================

import { MethodologyVersion } from './types';
import {
  BM_EN01_001,
  BM_EN01_002,
  BM_EN01_003,
  BM_IN02_001,
  BM_IN02_002,
  BM_AG04_001,
  BM_AG04_002,
  BM_WA03_001,
  BM_WA03_002,
  BM_WA03_003,
  BM_FR05_001,
  BM_FR05_002
} from './definitions';

export class MethodologyRegistry {
  private static methodologies: Map<string, MethodologyVersion> = new Map();

  static {
    // Register all 12 official CCTS methodologies
    MethodologyRegistry.register(BM_EN01_001);
    MethodologyRegistry.register(BM_EN01_002);
    MethodologyRegistry.register(BM_EN01_003);
    MethodologyRegistry.register(BM_IN02_001);
    MethodologyRegistry.register(BM_IN02_002);
    MethodologyRegistry.register(BM_AG04_001);
    MethodologyRegistry.register(BM_AG04_002);
    MethodologyRegistry.register(BM_WA03_001);
    MethodologyRegistry.register(BM_WA03_002);
    MethodologyRegistry.register(BM_WA03_003);
    MethodologyRegistry.register(BM_FR05_001);
    MethodologyRegistry.register(BM_FR05_002);
  }

  public static register(methodology: MethodologyVersion): void {
    MethodologyRegistry.methodologies.set(methodology.code, methodology);
  }

  public static getByCode(code: string): MethodologyVersion | undefined {
    return MethodologyRegistry.methodologies.get(code);
  }

  public static getAll(): MethodologyVersion[] {
    return Array.from(MethodologyRegistry.methodologies.values());
  }

  public static getBySector(sector: string): MethodologyVersion[] {
    if (!sector) return [];
    const normalizedQuery = sector.toLowerCase().trim();
    return MethodologyRegistry.getAll().filter((m) => {
      const sectorLower = m.sector.toLowerCase();
      const scopeLower = m.sectoralScopeCode.toLowerCase();
      return (
        sectorLower.includes(normalizedQuery) ||
        normalizedQuery.includes(sectorLower) ||
        scopeLower.includes(normalizedQuery) ||
        normalizedQuery.includes(scopeLower)
      );
    });
  }

  public static clear(): void {
    MethodologyRegistry.methodologies.clear();
  }

  public static resetToOfficial(): void {
    MethodologyRegistry.clear();
    MethodologyRegistry.register(BM_EN01_001);
    MethodologyRegistry.register(BM_EN01_002);
    MethodologyRegistry.register(BM_EN01_003);
    MethodologyRegistry.register(BM_IN02_001);
    MethodologyRegistry.register(BM_IN02_002);
    MethodologyRegistry.register(BM_AG04_001);
    MethodologyRegistry.register(BM_AG04_002);
    MethodologyRegistry.register(BM_WA03_001);
    MethodologyRegistry.register(BM_WA03_002);
    MethodologyRegistry.register(BM_WA03_003);
    MethodologyRegistry.register(BM_FR05_001);
    MethodologyRegistry.register(BM_FR05_002);
  }
}
