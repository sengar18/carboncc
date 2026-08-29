import { MethodologyVersion } from '../types';

export const BM_FR05_001: MethodologyVersion = {
  code: 'BM FR05.001',
  name: 'Afforestation and reforestation of degraded mangrove habitats',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Forestry / Blue Carbon & Mangrove Afforestation',
  sectoralScopeCode: '05: Forestry (Sectoral Scope 14)',
  publicationDate: '27 March 2025',
  effectiveDate: '27 March 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power / MoEFCC, Government of India',
  referenceUnfcccCdm: ['AR-AM0014 (as valid from 04 October 2013)'],
  pageCount: 10,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_FR05_001_Mangrove_Afforestation_Reforestation.pdf',
  documentHash: '7af49cc871dc899c7c410ca40e78c5198990739c79b44153c6c0429345cc7a2c',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities that implement afforestation and reforestation (A/R) on degraded mangrove habitats (e.g. degraded tidal wetlands, intertidal zones), sequestering carbon in living biomass, dead organic matter, and soil organic carbon pools.',
  adoptedTools: [
    'BM-T-AR-001: Combined tool to identify the baseline scenario and demonstrate additionality in A/R ICM project activities',
    'BM-T-AR-002: Estimation of non-CO2 GHG emissions resulting from burning of biomass attributable to an A/R ICM project activity',
    'BM-T-AR-003: Estimation of carbon stocks and change in carbon stocks in dead wood and litter in A/R ICM project activities',
    'BM-T-AR-004: Estimation of carbon stocks and change in carbon stocks of trees and shrubs in A/R ICM project activities',
    'BM-T-AR-005: Estimation of the increase in GHG emissions attributable to displacement of pre-project agricultural activities in A/R ICM project activity'
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
    },
    {
      title: '2019 Refinement to 2006 IPCC Guidelines (Coastal Wetlands)',
      exactWording: '2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories (Coastal Wetlands Chapter)',
      section: '2. Definitions, paragraph 4(b); 3.3, paragraph 10',
      page: 3,
      paragraph: '4(b)',
      impact: 'Coastal wetland soil organic carbon and biomass carbon fraction defaults',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'fr05-001-cond-1',
      field: 'degraded_mangrove_habitat',
      label: 'Land Qualifies as Degraded Mangrove Habitat',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 3,
      sectionReference: '2.1, paragraph 2',
      provenanceQuote: 'This methodology applies to project activities that implement afforestation and reforestation on degraded mangrove habitats, including intertidal zones with saline soils.',
      failureMessage: 'The project area must qualify as a degraded coastal mangrove habitat or intertidal wetland.'
    },
    {
      id: 'fr05-001-cond-2',
      field: 'no_human_displacement',
      label: 'No Forced Human Displacement',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 6(c)',
      provenanceQuote: 'The project activity does not lead to the displacement of local indigenous populations or violation of traditional community forest rights (FRA 2006 compliance).',
      failureMessage: 'The project must not cause forced human displacement and must comply with Forest Rights Act (FRA 2006).'
    }
  ],
  monitoringRequirements: [
    {
      id: 'fr05-001-mon-1',
      parameter: 'Mangrove plantation area and stratum boundary GPS polygons',
      parameterSymbol: 'A_stratum,i',
      unit: 'hectares (ha)',
      frequency: 'ANNUAL',
      equipment: 'Differential GPS survey and multi-spectral satellite imagery (Sentinel-2 / Landsat)',
      standard: 'CCTS A/R Monitoring Guidelines',
      pageReference: 8,
      sectionReference: '4.1, paragraph 20'
    },
    {
      id: 'fr05-001-mon-2',
      parameter: 'Diameter at Breast Height (DBH) and Tree Height in sample plots',
      parameterSymbol: 'DBH / H_tree',
      unit: 'cm and meters',
      frequency: 'EVERY_5_YEARS',
      equipment: 'Diameter tape, laser hypsometer, and permanent sample plot markers',
      standard: 'BM-T-AR-004',
      pageReference: 9,
      sectionReference: '4.2, paragraph 22'
    }
  ],
  evidenceRequirements: [
    {
      id: 'fr05-001-ev-1',
      documentType: 'COASTAL_REGULATION_ZONE_CLEARANCE',
      description: 'CRZ Clearance from State Coastal Zone Management Authority (SCZMA) and Forest Department working plan approval',
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 6(a)',
      provenanceQuote: 'Clear legal title or statutory permission to plant mangroves on intertidal government/community land.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'fr05-001-eq-1',
      name: 'Net Anthropogenic GHG Removals by Sinks',
      equationText: 'C_AR,net,y = Delta_C_PJ,y - Delta_C_BL,y - GHGPJ,y - LE_y',
      equationNumber: 'Equation (1)',
      section: '3.1, paragraph 7',
      page: 4,
      description: 'Calculates net carbon removals by mangrove sinks minus baseline changes, project emissions, and leakage.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Project carbon stock change',
          symbol: 'Delta_C_PJ,y',
          unit: 't CO2e/yr',
          description: 'Change in carbon stocks of living biomass, dead wood, and soil in project area',
          source: 'BM-T-AR-003 / BM-T-AR-004',
          isMonitored: true
        },
        {
          name: 'Baseline carbon stock change',
          symbol: 'Delta_C_BL,y',
          unit: 't CO2e/yr',
          description: 'Baseline carbon stock change (assumed zero for continuously degraded mangrove lands)',
          source: 'Section 3.2, paragraph 8',
          isMonitored: false,
          defaultValue: 0
        },
        {
          name: 'Project GHG emissions',
          symbol: 'GHGPJ,y',
          unit: 't CO2e/yr',
          description: 'Project emissions from fuel combustion in boats/vehicles and non-CO2 burning',
          source: 'BM-T-AR-002',
          isMonitored: false,
          defaultValue: 0
        },
        {
          name: 'Leakage emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions due to activity displacement',
          source: 'BM-T-AR-005',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
