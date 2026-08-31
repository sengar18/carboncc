// ==============================================================================
// CARBONSCOUT INDIA — ENVIRONMENTAL PATHWAY SCREENER (PHASE 9)
// ==============================================================================
// Indicative multi-mechanism screening for adjacent environmental attributes.
// DISCLAIMER: Indicative screening only — not a certification determination.
// ==============================================================================

import { Fact } from '@/lib/db/schema';

export interface PathwayOption {
  pathwayId: string;
  name: string;
  category: 'DOMESTIC_COMPLIANCE' | 'RENEWABLE_ATTRIBUTES' | 'VOLUNTARY_CARBON' | 'INTERNATIONAL_ARTICLE_6';
  status: 'HIGH_APPLICABILITY' | 'POTENTIALLY_SUITABLE' | 'LOW_FIT' | 'INSUFFICIENT_DATA';
  scorePercent: number; // 0 to 100
  governingBody: string;
  registryStandard: string;
  rationale: string;
  eligibilityHighlights: string[];
  caveats: string[];
}

export interface PathwayScreeningResult {
  primarySector: string;
  state: string;
  projectName?: string;
  evaluatedAt: string;
  disclaimer: string;
  pathways: PathwayOption[];
}

export class EnvironmentalPathwayScreener {
  public static screenPathways(
    sector: string,
    state: string,
    facts: Fact[]
  ): PathwayScreeningResult {
    const factsMap = new Map<string, string>();
    for (const f of facts) {
      factsMap.set(f.fact_type, f.value_raw.toLowerCase());
    }

    const sectorLower = sector.toLowerCase();
    const hasRenewable = sectorLower.includes('renewable') || sectorLower.includes('solar') || sectorLower.includes('wind') || sectorLower.includes('biomass');
    const hasBiogasOrCBG = sectorLower.includes('biogas') || sectorLower.includes('cbg') || sectorLower.includes('waste');
    const hasAgriculture = sectorLower.includes('agri') || sectorLower.includes('rice') || sectorLower.includes('livestock');
    const hasForestry = sectorLower.includes('forest') || sectorLower.includes('mangrove') || sectorLower.includes('blue carbon');
    const hasHydrogen = sectorLower.includes('hydrogen');

    const pathways: PathwayOption[] = [];

    // 1. Indian CCTS (Bureau of Energy Efficiency)
    const cctsSuitable = hasRenewable || hasBiogasOrCBG || hasAgriculture || hasForestry || hasHydrogen;
    pathways.push({
      pathwayId: 'ccts',
      name: 'India Carbon Credit Trading Scheme (CCTS)',
      category: 'DOMESTIC_COMPLIANCE',
      status: cctsSuitable ? 'HIGH_APPLICABILITY' : 'POTENTIALLY_SUITABLE',
      scorePercent: cctsSuitable ? 90 : 45,
      governingBody: 'Bureau of Energy Efficiency (BEE) / Ministry of Power, Govt of India',
      registryStandard: 'Indian Carbon Market (ICM) Registry / CCTS Gazette Notifications',
      rationale: cctsSuitable
        ? `Activity aligns directly with Gazette-notified Indian Carbon Market baseline scope for ${sector}.`
        : 'Activity requires verification against upcoming Gazette methodology batches.',
      eligibilityHighlights: [
        'Mandatory Gazette-notified sectoral scope matching',
        'Demonstrated regulatory additionality and grid displacement',
        'Compliance with BEE MRV and Accredited Carbon Verification Agency (ACVA) protocols',
      ],
      caveats: [
        'Registration open to Indian entities only',
        'Subject to finalized Ministry of Power ICM registry launch rules',
      ],
    });

    // 2. International Renewable Energy Certificates (I-REC / EACs)
    const irecSuitable = hasRenewable || sectorLower.includes('solar') || sectorLower.includes('wind') || sectorLower.includes('biomass');
    pathways.push({
      pathwayId: 'irec',
      name: 'International Renewable Energy Certificates (I-REC)',
      category: 'RENEWABLE_ATTRIBUTES',
      status: irecSuitable ? 'HIGH_APPLICABILITY' : 'LOW_FIT',
      scorePercent: irecSuitable ? 85 : 20,
      governingBody: 'International Tracking Standard Foundation (I-REC Standard)',
      registryStandard: 'Evident Registry (formerly I-REC Services)',
      rationale: irecSuitable
        ? `Electricity generation from ${sector} can be tracked for Scope 2 market-based renewable claims.`
        : 'I-REC is restricted to electricity generation from zero-carbon or bio-energy assets.',
      eligibilityHighlights: [
        'Tracking 1 MWh clean generation = 1 I-REC',
        'Compatible with RE100 corporate procurement reporting',
        'Low documentation friction compared to baseline credit issuance',
      ],
      caveats: [
        'Cannot double-claim I-REC attributes if national CCTS credits are issued for the same MWh',
        'Prices historically lower than compliance carbon credits (~USD 0.50 - $2.00 / MWh)',
      ],
    });

    // 3. Voluntary Carbon Markets (Verra VCS / Gold Standard / GCC)
    const voluntarySuitable = !hasRenewable || sectorLower.includes('biomass') || hasBiogasOrCBG || hasAgriculture || hasForestry;
    pathways.push({
      pathwayId: 'voluntary_vcs',
      name: 'Voluntary Carbon Standards (Verra VCS / Gold Standard / Global Carbon Council)',
      category: 'VOLUNTARY_CARBON',
      status: voluntarySuitable ? 'POTENTIALLY_SUITABLE' : 'LOW_FIT',
      scorePercent: voluntarySuitable ? 70 : 30,
      governingBody: 'Verra (VCS) / Gold Standard Foundation / Global Carbon Council (GCC)',
      registryStandard: 'Verra Registry / Gold Standard Impact Registry',
      rationale: voluntarySuitable
        ? 'High additionality bio-energy, methane avoidance, and AFOLU projects remain eligible under international voluntary registries.'
        : 'Grid-connected solar and wind in India are largely ineligible on Verra/Gold Standard due to grid parity additionality restrictions.',
      eligibilityHighlights: [
        'Global buyer base (international corporates, airlines CORSIA)',
        'Supports co-benefit premiums (SDGs, community upliftment)',
      ],
      caveats: [
        'High upfront validation & monitoring cost ($25,000 - $60,000)',
        'Lengthy registration timeline (12 - 24 months)',
        'Indian national Article 6 authorization may be required for cross-border transfer',
      ],
    });

    // 4. Paris Agreement Article 6 (Article 6.2 bilateral / 6.4 mechanism)
    const article6Suitable = hasHydrogen || hasForestry || (sectorLower.includes('biomass') && state === 'Punjab');
    pathways.push({
      pathwayId: 'article_6',
      name: 'Paris Agreement Article 6 Mechanism (ITMOs)',
      category: 'INTERNATIONAL_ARTICLE_6',
      status: article6Suitable ? 'POTENTIALLY_SUITABLE' : 'LOW_FIT',
      scorePercent: article6Suitable ? 60 : 15,
      governingBody: 'UNFCCC Supervisory Body & MoEFCC (National Designated Authority for Article 6)',
      registryStandard: 'UNFCCC Article 6 Database / National Article 6 Registry',
      rationale: article6Suitable
        ? 'High-integrity mitigation activities in India eligible for bilateral Internationally Transferred Mitigation Outcomes (ITMOs) under Ministry of Environment (MoEFCC) positive list.'
        : 'Standard commercial projects without high additionality are not prioritized under bilateral Article 6 transfer agreements.',
      eligibilityHighlights: [
        'Sovereign-to-sovereign or international compliance transfers',
        'Potential premium pricing (EUR 20 - 50+ / tCO2e for corresponding adjustments)',
      ],
      caveats: [
        'Requires explicit Letter of Authorization (LoA) from MoEFCC with Corresponding Adjustments (CA)',
        'Stringent additionality and baseline standards governed by UNFCCC Article 6.4 Supervisory Body',
      ],
    });

    return {
      primarySector: sector,
      state,
      evaluatedAt: new Date().toISOString(),
      disclaimer: 'Indicative screening — not a certification determination.',
      pathways,
    };
  }
}
