import { MethodologyVersion } from '../types';

export const BM_FR05_002: MethodologyVersion = {
  code: 'BM FR05.002',
  name: 'Afforestation and reforestation of lands except wetlands',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Forestry / Terrestrial Afforestation & Reforestation',
  sectoralScopeCode: '05: Forestry (Sectoral Scope 14)',
  publicationDate: '8 September 2025',
  effectiveDate: '8 September 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power / MoEFCC, Government of India',
  referenceUnfcccCdm: ['AR-ACM0003 (as valid from 04 October 2013)'],
  pageCount: 10,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_FR05_002_Afforestation_Reforestation_Non_Wetlands.pdf',
  documentHash: '3c4b436b80d1dcc11de55c83d51c0556e94357f6df2f1ae8a122055cf0802441',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities that implement afforestation or reforestation on non-wetland lands (e.g. degraded grasslands, wasteland, agroforestry landscapes, degraded agricultural land) to generate carbon removals in biomass, dead wood, litter, and soil organic carbon pools.',
  adoptedTools: [
    'BM-T-AR-001: Combined tool to identify the baseline scenario and demonstrate additionality in A/R ICM project activities',
    'BM-T-AR-002: Estimation of non-CO2 GHG emissions resulting from burning of biomass attributable to an A/R ICM project activity',
    'BM-T-AR-003: Estimation of carbon stocks and change in carbon stocks in dead wood and litter in A/R ICM project activities',
    'BM-T-AR-004: Estimation of carbon stocks and change in carbon stocks of trees and shrubs in A/R ICM project activities',
    'BM-T-AR-005: Estimation of the increase in GHG emissions attributable to displacement of pre-project agricultural activities in A/R ICM project activity',
    'BM-T-AR-006: Tool for estimation of change in soil organic carbon stocks due to the implementation of A/R ICM project activities'
  ],
  externalDependencies: [
    {
      title: 'Detailed Procedure for Offset Mechanism under CCTS',
      exactWording: 'The definitions contained in the following documents shall apply: Detailed Procedure for Offset Mechanism under CCTS',
      section: '2. Definitions, paragraph 4(a)',
      page: 3,
      paragraph: '4(a)',
      impact: 'General terms and tCCC/lCCC crediting rules',
      isAvailable: false,
      verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT'
    }
  ],
  applicabilityConditions: [
    {
      id: 'fr05-002-cond-1',
      field: 'non_wetland_land_eligibility',
      label: 'Land Qualifies as Non-Wetland and Meets Forest Definition',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 3,
      sectionReference: '2.1, paragraph 2',
      provenanceQuote: 'This methodology applies to project activities that implement afforestation or reforestation on lands other than wetlands.',
      failureMessage: 'The project must occur on non-wetland terrestrial lands (wastelands, degraded lands, agroforestry).'
    },
    {
      id: 'fr05-002-cond-2',
      field: 'not_forested_before_start',
      label: 'Land Not Forested for Minimum Baseline Period (>= 10 Years)',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 3,
      sectionReference: '2.2, paragraph 6(b)',
      provenanceQuote: 'The project area did not contain forest on 31 December 1989 (for afforestation) or did not contain forest for at least 10 years prior to project start (for reforestation).',
      failureMessage: 'Land must not have contained forest for at least 10 years prior to project start date.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'fr05-002-mon-1',
      parameter: 'Boundary demarcation and forest stratum area',
      parameterSymbol: 'A_stratum,i',
      unit: 'hectares (ha)',
      frequency: 'ANNUAL_OR_VERIFICATION',
      equipment: 'Differential GPS and multi-spectral satellite imagery (Sentinel-2 / Landsat / Planet)',
      standard: 'CCTS A/R Monitoring Standard',
      pageReference: 8,
      sectionReference: '4.1, paragraph 18'
    },
    {
      id: 'fr05-002-mon-2',
      parameter: 'DBH, tree height, and survival rate across permanent sample plots',
      parameterSymbol: 'DBH / H_tree / N_trees,plot',
      unit: 'cm, meters, stems/ha',
      frequency: 'EVERY_5_YEARS',
      equipment: 'Caliper, diameter tape, laser hypsometer, permanent sample plots',
      standard: 'BM-T-AR-004',
      pageReference: 9,
      sectionReference: '4.2, paragraph 20'
    }
  ],
  evidenceRequirements: [
    {
      id: 'fr05-002-ev-1',
      documentType: 'LAND_TITLE_AND_NOC',
      description: 'Land title deeds, revenue department land records (7/12 extract / Patta), or State Forest Department tripartite agreement',
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 6(a)',
      provenanceQuote: 'Documentary evidence of land tenure or rights of use establishing project boundary control.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'fr05-002-eq-1',
      name: 'Net Anthropogenic GHG Removals by Sinks (Terrestrial)',
      equationText: 'C_AR,net,y = Delta_C_PJ,y - Delta_C_BL,y - GHGPJ,y - LE_y',
      equationNumber: 'Equation (1)',
      section: '3.1, paragraph 7',
      page: 4,
      description: 'Calculates net terrestrial carbon removals in aboveground/belowground biomass, dead wood, litter, and soil carbon.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Project carbon stock change',
          symbol: 'Delta_C_PJ,y',
          unit: 't CO2e/yr',
          description: 'Carbon stock change in living trees, shrubs, dead wood, and soil pools',
          source: 'BM-T-AR-003 / BM-T-AR-004 / BM-T-AR-006',
          isMonitored: true
        },
        {
          name: 'Baseline carbon stock change',
          symbol: 'Delta_C_BL,y',
          unit: 't CO2e/yr',
          description: 'Baseline carbon stock change',
          source: 'Section 3.2, paragraph 8',
          isMonitored: false,
          defaultValue: 0
        },
        {
          name: 'Project emissions',
          symbol: 'GHGPJ,y',
          unit: 't CO2e/yr',
          description: 'Project emissions from site preparation, equipment fuel combustion, and biomass burning',
          source: 'BM-T-AR-002',
          isMonitored: false,
          defaultValue: 0
        },
        {
          name: 'Leakage emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions from displacement of pre-project grazing or agricultural activities',
          source: 'BM-T-AR-005',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
