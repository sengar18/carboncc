// ==============================================================================
// CARBONSCOUT INDIA — OFFICIAL METHODOLOGY & SOURCE REGISTRY DATA
// ==============================================================================

export interface ExternalDependencyEntry {
  title: string;
  exactWording: string;
  section: string;
  page: number;
  impact: string;
  isAvailable: boolean;
  verificationStatus: string;
}

export interface SourceRegistryEntry {
  documentId: string;
  originalFilename: string;
  normalizedFilename: string;
  sha256Hash: string;
  mimeType: string;
  methodologyCode: string;
  methodologyTitle: string;
  version: string;
  publicationDate: string;
  effectiveDate: string;
  issuingAuthority: string;
  sectoralScope: string;
  sectoralScopeCode: string;
  referenceUnfcccCdm: string[];
  pageCount: number;
  extractionStatus: string;
  ocrStatus: string;
  verificationStatus: string;
  supersessionStatus: string;
  adoptedTools: string[];
  externalDependencies: ExternalDependencyEntry[];
}

export const OFFICIAL_SOURCE_REGISTRY: SourceRegistryEntry[] = [
  {
    documentId: 'DOC-BM-EN01-001',
    originalFilename: 'BM_EN01_001_Grid_Connected_Renewable.pdf',
    normalizedFilename: 'BM_EN01.001_Grid_Connected_Renewable_v1.0.pdf',
    sha256Hash: 'd9d849e0d748cff356da983c869853df2cd92add3107334bbbda873d09234ff1',
    mimeType: 'application/pdf',
    methodologyCode: 'BM EN01.001',
    methodologyTitle: 'Grid-connected electricity generation from renewable sources',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Energy',
    sectoralScopeCode: '01: Energy',
    referenceUnfcccCdm: ['ACM0002 (valid from 31 May 2024)'],
    pageCount: 28,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
      'BM-T-012: Positive lists of technologies',
    ],
    externalDependencies: [
      {
        title: 'CEA CO2 Baseline Database',
        exactWording: 'Grid Emission Factor (for net effective injection into grid) for grid connected power generation in year y, as published by the CEA',
        section: '4.5, paragraph 49 / 66',
        page: 18,
        impact: 'Baseline grid emission factor determination',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
      {
        title: 'ASTM E1675',
        exactWording: 'ASTM Standard Practice E1675 for Sampling 2-Phase Geothermal Fluid for Purposes of Chemical Analysis',
        section: '5.1, Data table 10',
        page: 24,
        impact: 'Geothermal non-condensable gas monitoring',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
    ],
  },
  {
    documentId: 'DOC-BM-EN01-002',
    originalFilename: 'BM_EN01_002_Hydrogen_Electrolysis_Water.pdf',
    normalizedFilename: 'BM_EN01.002_Hydrogen_Electrolysis_Water_v1.0.pdf',
    sha256Hash: '8c2e17665c6e75f62917b8ad1dd5fa59d937cdbd929793fa9167236bcf2bbaa9',
    mimeType: 'application/pdf',
    methodologyCode: 'BM EN01.002',
    methodologyTitle: 'Hydrogen production from electrolysis of water',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Energy',
    sectoralScopeCode: '01: Energy',
    referenceUnfcccCdm: ['AM0124 (valid from 27 September 2023)'],
    pageCount: 18,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
      'BM-T-005: Tool to determine the mass flow of a greenhouse gas in a gaseous stream',
      'BM-T-007: Project and leakage emissions from transportation of freight',
    ],
    externalDependencies: [
      {
        title: 'IEA (2023) Hydrogen Definitions Report',
        exactWording: 'Values derived from IEA (2023): Towards hydrogen definitions based on their emissions intensity',
        section: '4.3, paragraph 22',
        page: 8,
        impact: 'Baseline hydrogen emission factor defaults (19 tCO2e/tH2 for coal, 9 tCO2e/tH2 for gas/oil)',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
      {
        title: 'Cooper et al. (2022) Hydrogen Leakage Study',
        exactWording: 'Hydrogen emissions from the hydrogen value chain - emissions profile and impact to global warming, Science of Total Environment (Elsevier)',
        section: '5.1, Data table 8',
        page: 13,
        impact: 'Default physical leakage rate (5%)',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
    ],
  },
  {
    documentId: 'DOC-BM-EN01-003',
    originalFilename: 'BM_EN01_003_Electricity_Heat_Biomass.pdf',
    normalizedFilename: 'BM_EN01.003_Electricity_Heat_Biomass_v1.0.pdf',
    sha256Hash: '7ef1c28852fe0e71e003da197d5d9b7c52bcb054f2ce54d412789d611ec6833f',
    mimeType: 'application/pdf',
    methodologyCode: 'BM EN01.003',
    methodologyTitle: 'Electricity and Heat Generation from Biomass',
    version: '1.0',
    publicationDate: '30 June 2026',
    effectiveDate: '30 June 2026',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Energy',
    sectoralScopeCode: '01: Energy / 02: Industries / 03: Waste Handling and Disposal',
    referenceUnfcccCdm: [
      'ACM0006 (valid from 11 March 2022)',
      'ACM0018 (valid from 11 March 2022)',
      'AM0036 (valid from 11 March 2022)',
    ],
    pageCount: 96,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
      'BM-T-004: Tool to determine the baseline efficiency of thermal or electric energy generation systems',
      'BM-T-007: Project and leakage emissions from transportation of freight',
      'BM-T-010: Tool to determine upstream emissions associated with biomass transport and processing',
      'BM-T-016: Project and leakage emissions from biomass',
    ],
    externalDependencies: [
      {
        title: 'CEA CO2 Baseline Database',
        exactWording: 'Grid emission factor calculated using the CEA CO2 Baseline Database for the Indian grid',
        section: '4.5, paragraph 68',
        page: 38,
        impact: 'Baseline grid emission factor for exported biomass power',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
    ],
  },
  {
    documentId: 'DOC-BM-IN02-001',
    originalFilename: 'BM_IN02_001_Industrial_Energy_Efficiency.pdf',
    normalizedFilename: 'BM_IN02.001_Industrial_Energy_Efficiency_v1.0.pdf',
    sha256Hash: '667cdfe482d6afbb125d6509f6ce1c102376259cf7773948720cd0fa428912f4',
    mimeType: 'application/pdf',
    methodologyCode: 'BM IN02.001',
    methodologyTitle: 'Energy efficiency and fuel switching measures for industrial facilities',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Industries',
    sectoralScopeCode: '02: Industries',
    referenceUnfcccCdm: ['AMS-II.D (valid from 27 September 2023)'],
    pageCount: 19,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
      'BM-T-012: Positive lists of technologies',
    ],
    externalDependencies: [
      {
        title: 'BEE PAT Scheme Baseline Guidelines',
        exactWording: 'Specific Energy Consumption (SEC) measurement protocols and gate-to-gate boundary norms per BEE PAT Rules',
        section: '4.2, paragraph 18',
        page: 6,
        impact: 'Baseline energy intensity verification for Designated Consumers',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
    ],
  },
  {
    documentId: 'DOC-BM-IN02-002',
    originalFilename: 'BM_IN02_002_Hydrogen_Production_Biogas_Methane.pdf',
    normalizedFilename: 'BM_IN02.002_Hydrogen_Production_Biogas_Methane_v1.0.pdf',
    sha256Hash: '39ccdbf5442c1ddd740489cf97d318ae326638ef1dc42e5e767cdf4e3f6c17b8',
    mimeType: 'application/pdf',
    methodologyCode: 'BM IN02.002',
    methodologyTitle: 'Hydrogen production using methane extracted from biogas',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Industries',
    sectoralScopeCode: '02: Industries',
    referenceUnfcccCdm: ['AMS-III.O (valid from 19 September 2014)'],
    pageCount: 13,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    ],
    externalDependencies: [],
  },
  {
    documentId: 'DOC-BM-AG04-001',
    originalFilename: 'BM_AG04_001_Livestock_Manure_Methane_Recovery.pdf',
    normalizedFilename: 'BM_AG04.001_Livestock_Manure_Methane_Recovery_v1.0.pdf',
    sha256Hash: '499f659307ea35186508bd5aac8981387d8982575ff9479514eacd9dc9f38989',
    mimeType: 'application/pdf',
    methodologyCode: 'BM AG04.001',
    methodologyTitle: 'Methane recovery from livestock and manure management at households and small farms',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Agriculture',
    sectoralScopeCode: '04: Agriculture',
    referenceUnfcccCdm: ['AMS-III.R (valid from 09 September 2021)'],
    pageCount: 15,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-012: Positive lists of technologies',
    ],
    externalDependencies: [],
  },
  {
    documentId: 'DOC-BM-AG04-002',
    originalFilename: 'BM_AG04_002_Rice_Cultivation_AWD.pdf',
    normalizedFilename: 'BM_AG04.002_Rice_Cultivation_AWD_v1.0.pdf',
    sha256Hash: '7d4c1b58f4397971c05aa53e9fa00d0b7807b100774371cc6b5f1adcec51a407',
    mimeType: 'application/pdf',
    methodologyCode: 'BM AG04.002',
    methodologyTitle: 'Emission reduction through improved management practices in rice cultivation',
    version: '1.0',
    publicationDate: '30 June 2026',
    effectiveDate: '30 June 2026',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Agriculture',
    sectoralScopeCode: '04: Agriculture',
    referenceUnfcccCdm: ['AMS-III.AU (valid from 16 November 2023)'],
    pageCount: 24,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-012: Positive lists of technologies',
      'BM-T-019: Tool for sampling and surveys for CDM project activities and PoAs',
    ],
    externalDependencies: [],
  },
  {
    documentId: 'DOC-BM-WA03-001',
    originalFilename: 'BM_WA03_001_Landfill_Methane_Recovery.pdf',
    normalizedFilename: 'BM_WA03.001_Landfill_Methane_Recovery_v1.0.pdf',
    sha256Hash: 'bc18a13ddd576bdaac1d053a2e178df0d8b156c93909a84ac1bd7eebb865e9f7',
    mimeType: 'application/pdf',
    methodologyCode: 'BM WA03.001',
    methodologyTitle: 'Landfill Methane Recovery',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Waste Handling and Disposal',
    sectoralScopeCode: '03: Waste Handling and Disposal',
    referenceUnfcccCdm: ['AMS-III.G (valid from 09 September 2021)'],
    pageCount: 13,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
      'BM-T-008: Tool to determine the baseline efficiency of flaring',
    ],
    externalDependencies: [],
  },
  {
    documentId: 'DOC-BM-WA03-002',
    originalFilename: 'BM_WA03_002_Flaring_Landfill_Gas.pdf',
    normalizedFilename: 'BM_WA03.002_Flaring_Landfill_Gas_v1.0.pdf',
    sha256Hash: 'ec55c534663d31195c9fdf9a25a1614359cd88e238186c88a6b4bf67df621c61',
    mimeType: 'application/pdf',
    methodologyCode: 'BM WA03.002',
    methodologyTitle: 'Flaring or use of landfill gas',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Waste Handling and Disposal',
    sectoralScopeCode: '03: Waste Handling and Disposal',
    referenceUnfcccCdm: ['ACM0001 (valid from 09 September 2021)'],
    pageCount: 33,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
      'BM-T-008: Tool to determine the baseline efficiency of flaring',
    ],
    externalDependencies: [],
  },
  {
    documentId: 'DOC-BM-WA03-003',
    originalFilename: 'BM_WA03_003_Production_Compressed_Biogas_CBG.pdf',
    normalizedFilename: 'BM_WA03.003_Production_Compressed_Biogas_CBG_v1.0.pdf',
    sha256Hash: 'a73432466c55543d3663916d283a64397a84737db4fd54a9044d711ea936083b',
    mimeType: 'application/pdf',
    methodologyCode: 'BM WA03.003',
    methodologyTitle: 'Production of Compressed Bio-gas (CBG)',
    version: '1.0',
    publicationDate: '30 June 2026',
    effectiveDate: '30 June 2026',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    sectoralScope: 'Waste Handling and Disposal',
    sectoralScopeCode: '03: Waste Handling and Disposal',
    referenceUnfcccCdm: [
      'ACM0022 (valid from 09 September 2021)',
      'AMS-III.Q (valid from 16 April 2015)',
      'AMS-III.AQ (valid from 01 June 2014)',
      'Gold Standard Soil Organic Carbon Framework Methodology (valid from January 2020)',
    ],
    pageCount: 107,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
      'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
      'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
      'BM-T-004: Tool to determine the baseline efficiency of thermal or electric energy generation systems',
      'BM-T-007: Project and leakage emissions from transportation of freight',
      'BM-T-008: Tool to determine the baseline efficiency of flaring',
      'BM-T-013: Project and leakage emissions from composting',
      'BM-T-016: Project and leakage emissions from biomass',
    ],
    externalDependencies: [
      {
        title: 'Detailed Procedure for Offset Mechanism under CCTS',
        exactWording: 'The definitions contained in the Detail Procedure for Offset Mechanism shall apply',
        section: '3. Definitions, paragraph 22; 4.3.1.1, paragraph 50 (Principle E4 Suppressed Demand)',
        page: 8,
        impact: 'Suppressed demand default MCF (0.4) and definitions',
        isAvailable: false,
        verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT',
      },
      {
        title: 'PNGRB Statutory Regulations for CBG',
        exactWording: 'Biomethane/renewable biogas (RBG) as per applicable statutory laws in India, PNGRB CBG regulations',
        section: '3. Definitions (d), footnote 6',
        page: 9,
        impact: 'Methane content threshold (90-95% CH4) and CNG equivalence',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
      {
        title: 'FCO (Fertilizer Control Order) 2025 Third Amendment',
        exactWording: 'Third Amendment to The Fertilizer (Inorganic, Organic or Mixed) (Control) Order 2025',
        section: '3. Definitions (i), footnote 7',
        page: 9,
        impact: 'Fermented Organic Manure (FOM) specification (minimum 12-14% organic carbon)',
        isAvailable: true,
        verificationStatus: 'VERIFIED',
      },
    ],
  },
  {
    documentId: 'DOC-BM-FR05-001',
    originalFilename: 'BM_FR05_001_Mangrove_Afforestation_Reforestation.pdf',
    normalizedFilename: 'BM_FR05.001_Mangrove_Afforestation_Reforestation_v1.0.pdf',
    sha256Hash: '7af49cc871dc899c7c410ca40e78c5198990739c79b44153c6c0429345cc7a2c',
    mimeType: 'application/pdf',
    methodologyCode: 'BM FR05.001',
    methodologyTitle: 'Afforestation and reforestation of degraded mangrove habitats',
    version: '1.0',
    publicationDate: '27 March 2025',
    effectiveDate: '27 March 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power / MoEFCC, Government of India',
    sectoralScope: 'Forestry',
    sectoralScopeCode: '05: Forestry (Sectoral Scope 14)',
    referenceUnfcccCdm: ['AR-AM0014 (valid from 09 September 2021)'],
    pageCount: 10,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-AR-001: Combined tool to identify the baseline scenario and demonstrate additionality in A/R ICM project activities',
      'BM-T-AR-002: Estimation of non-CO2 GHG emissions resulting from burning of biomass attributable to an A/R ICM project activity',
      'BM-T-AR-003: Estimation of carbon stocks and change in carbon stocks in dead wood and litter in A/R ICM project activities',
      'BM-T-AR-004: Estimation of carbon stocks and change in carbon stocks of trees and shrubs in A/R ICM project activities',
      'BM-T-AR-005: Estimation of the increase in GHG emissions attributable to displacement of pre-project agricultural activities in A/R ICM project activity',
      'BM-T-AR-006: Tool for estimation of change in soil organic carbon stocks due to the implementation of A/R ICM project activities',
    ],
    externalDependencies: [
      {
        title: 'Detailed Procedure for Offset Mechanism under CCTS',
        exactWording: 'The definitions contained in the following documents shall apply: Detailed Procedure for Offset Mechanism under CCTS',
        section: '2. Definitions, paragraph 4(a)',
        page: 3,
        impact: 'General terms and tCCC/lCCC crediting rules',
        isAvailable: false,
        verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT',
      },
    ],
  },
  {
    documentId: 'DOC-BM-FR05-002',
    originalFilename: 'BM_FR05_002_Afforestation_Reforestation_Non_Wetlands.pdf',
    normalizedFilename: 'BM_FR05.002_Afforestation_Reforestation_Non_Wetlands_v1.0.pdf',
    sha256Hash: '3c4b436b80d1dcc11de55c83d51c0556e94357f6df2f1ae8a122055cf0802441',
    mimeType: 'application/pdf',
    methodologyCode: 'BM FR05.002',
    methodologyTitle: 'Afforestation and reforestation of lands except wetlands',
    version: '1.0',
    publicationDate: '8 September 2025',
    effectiveDate: '8 September 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power / MoEFCC, Government of India',
    sectoralScope: 'Forestry',
    sectoralScopeCode: '05: Forestry (Sectoral Scope 14)',
    referenceUnfcccCdm: ['AR-ACM0003 (valid from 04 October 2013)'],
    pageCount: 10,
    extractionStatus: 'COMPLETE',
    ocrStatus: 'DIGITALLY_VERIFIED',
    verificationStatus: 'VERIFIED',
    supersessionStatus: 'Active (Initial Adoption)',
    adoptedTools: [
      'BM-T-AR-001: Combined tool to identify the baseline scenario and demonstrate additionality in A/R ICM project activities',
      'BM-T-AR-002: Estimation of non-CO2 GHG emissions resulting from burning of biomass attributable to an A/R ICM project activity',
      'BM-T-AR-003: Estimation of carbon stocks and change in carbon stocks in dead wood and litter in A/R ICM project activities',
      'BM-T-AR-004: Estimation of carbon stocks and change in carbon stocks of trees and shrubs in A/R ICM project activities',
      'BM-T-AR-005: Estimation of the increase in GHG emissions attributable to displacement of pre-project agricultural activities in A/R ICM project activity',
      'BM-T-AR-006: Tool for estimation of change in soil organic carbon stocks due to the implementation of A/R ICM project activities',
    ],
    externalDependencies: [
      {
        title: 'Detailed Procedure for Offset Mechanism under CCTS',
        exactWording: 'The definitions contained in the following documents shall apply: Detailed Procedure for Offset Mechanism under CCTS',
        section: '2. Definitions, paragraph 4(a)',
        page: 3,
        impact: 'General terms and tCCC/lCCC crediting rules',
        isAvailable: false,
        verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT',
      },
    ],
  },
];

export interface RegulatoryDocumentEntry {
  documentId: string;
  originalFilename: string;
  normalizedFilename: string;
  sha256Hash: string;
  mimeType: string;
  title: string;
  documentType: 'STATUTORY_NOTIFICATION' | 'PUBLIC_CONSULTATION_NOTICE' | 'TECHNICAL_STANDARD';
  notificationNumber?: string;
  publicationDate: string;
  issuingAuthority: string;
  pageCount: number;
  verificationStatus: string;
  description: string;
  keyProvisions: string[];
}

export const OFFICIAL_REGULATORY_DOCUMENTS: RegulatoryDocumentEntry[] = [
  {
    documentId: 'DOC-CCTS-GAZETTE-2023',
    originalFilename: 'media_1787986939821.pdf',
    normalizedFilename: 'CCTS_Gazette_Notification_SO_2825_E_2023.pdf',
    sha256Hash: 'bebbae1946dbf11532f24deebb7f215df644a4363a347da4eb1cbe0ab4dc57a3',
    mimeType: 'application/pdf',
    title: 'Carbon Credit Trading Scheme, 2023 (Principal Gazette Notification)',
    documentType: 'STATUTORY_NOTIFICATION',
    notificationNumber: 'S.O. 2825(E) (No. 2702)',
    publicationDate: '28 June 2023',
    issuingAuthority: 'Ministry of Power, Government of India',
    pageCount: 10,
    verificationStatus: 'VERIFIED',
    description:
      'Principal statutory notification under Section 14(w) of the Energy Conservation Act, 2001 establishing the governance architecture, National Steering Committee, Administrator (BEE), Registry (Grid-India), Regulator (CERC), compliance mechanism, and offset procedures.',
    keyProvisions: [
      'Section 2: 1 Carbon Credit Certificate = 1 tCO2e; Regulates 7 GHGs (CO2, CH4, N2O, HCFC, HFC, PFC, SF6)',
      'Section 3-4: National Steering Committee for Indian Carbon Market (NSC-ICM) as apex governing body',
      'Section 5: Bureau of Energy Efficiency (BEE) as Administrator',
      'Section 6: Grid Controller of India Limited (Grid-India) as Registry and National Meta-Registry',
      'Section 7 & 10: Central Electricity Regulatory Commission (CERC) as Trading Market Regulator',
      'Section 9: Accredited Carbon Verification Agency (ACVA) accreditation and verification duties',
      'Section 11: Compliance Mechanism for Obligated Entities (tCO2e/product unit targets)',
      'Section 12: Detailed Procedure development for Offset Mechanism operationalisation',
    ],
  },
  {
    documentId: 'DOC-BEE-CONSULTATION-2025',
    originalFilename: 'media_1787986939746.pdf',
    normalizedFilename: 'BEE_Public_Notice_45_02_NMEEE_2025.pdf',
    sha256Hash: 'de0b3974d55d5a73432bfeb4137c7d16d08e90efdc93b0fce0f2254caa8bd486',
    mimeType: 'application/pdf',
    title: 'BEE Public Consultation Notice on 12 Methodologies for CCTS Offset Mechanism',
    documentType: 'PUBLIC_CONSULTATION_NOTICE',
    notificationNumber: 'No. 45/02/NMEEE/Energy Efficiency/2024-CCTS',
    publicationDate: '23 January 2025',
    issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
    pageCount: 1,
    verificationStatus: 'VERIFIED',
    description:
      'Official public notice by BEE seeking comments and stakeholder suggestions on the 12 identified offset methodologies corresponding to the 6 Phase 1 sectors approved by NSC-ICM.',
    keyProvisions: [
      'Confirms NSC-ICM approval of 10 total sectors (6 in Phase 1 and 4 in Phase 2) for the CCTS Offset Mechanism',
      'Compiles 12 methodologies for Phase 1 sectors into a unified national catalog',
      'Specifies stakeholder feedback deadline of 30th January 2025 to Director, BEE',
    ],
  },
];

// Generate JSON registry
export function generateSourceRegistryJson(): string {
  return JSON.stringify(
    {
      regulatoryFrameworkDocuments: OFFICIAL_REGULATORY_DOCUMENTS,
      methodologyDocuments: OFFICIAL_SOURCE_REGISTRY,
    },
    null,
    2
  );
}

// Generate Markdown registry
export function generateSourceRegistryMarkdown(): string {
  let md = `# Official Methodology & Statutory Source Registry\n\n`;
  md += `**Registry Status**: VERIFIED (Official Indian Carbon Market / CCTS Documents)\n`;
  md += `**Issuing Authority**: Bureau of Energy Efficiency (BEE) & Ministry of Power, Government of India\n`;
  md += `**Last Updated**: 2026-08-29\n\n`;
  md += `---\n\n`;
  md += `## 1. Statutory Framework & Governance Documents\n\n`;
  md += `| # | Document ID | Title | Notification / Ref | Date | Pages | SHA-256 Digest | Status |\n`;
  md += `|---|---|---|---|---|---|---|---|\n`;

  OFFICIAL_REGULATORY_DOCUMENTS.forEach((doc, idx) => {
    md += `| ${idx + 1} | **\`${doc.documentId}\`** | ${doc.title} | ${doc.notificationNumber || 'N/A'} | ${doc.publicationDate} | ${doc.pageCount} | \`${doc.sha256Hash.substring(0, 16)}...\` | \`${doc.verificationStatus}\` |\n`;
  });

  md += `\n---\n\n`;
  md += `## 2. Master Catalog of Official Methodology Documents (12 Methodologies)\n\n`;
  md += `| # | Code | Title | Scope | Version | Pub. Date | Pages | SHA-256 Digest | Status |\n`;
  md += `|---|---|---|---|---|---|---|---|---|\n`;

  OFFICIAL_SOURCE_REGISTRY.forEach((entry, idx) => {
    md += `| ${idx + 1} | **\`${entry.methodologyCode}\`** | ${entry.methodologyTitle} | ${entry.sectoralScope} | ${entry.version} | ${entry.publicationDate} | ${entry.pageCount} | \`${entry.sha256Hash.substring(0, 16)}...\` | \`${entry.verificationStatus}\` |\n`;
  });

  md += `\n---\n\n`;
  md += `## 3. Detailed Methodology Provenance Records\n\n`;

  OFFICIAL_SOURCE_REGISTRY.forEach((entry) => {
    md += `### \`${entry.methodologyCode}\`: ${entry.methodologyTitle}\n\n`;
    md += `- **Original File**: \`${entry.originalFilename}\`\n`;
    md += `- **Normalized File**: \`${entry.normalizedFilename}\`\n`;
    md += `- **SHA-256 Hash**: \`${entry.sha256Hash}\`\n`;
    md += `- **Publication Date**: ${entry.publicationDate}\n`;
    md += `- **Effective Date**: ${entry.effectiveDate}\n`;
    md += `- **Issuing Authority**: ${entry.issuingAuthority}\n`;
    md += `- **Sectoral Scope**: ${entry.sectoralScope} (${entry.sectoralScopeCode})\n`;
    md += `- **Adopted UNFCCC CDM Reference**: ${entry.referenceUnfcccCdm.join(', ')}\n`;
    md += `- **Total Page Count**: ${entry.pageCount} pages\n`;
    md += `- **Verification Status**: \`${entry.verificationStatus}\` | **OCR Status**: \`${entry.ocrStatus}\`\n\n`;

    md += `#### Adopted ICM Tools:\n`;
    entry.adoptedTools.forEach((tool) => {
      md += `- ${tool}\n`;
    });
    md += `\n`;

    md += `#### External Dependencies & References:\n`;
    entry.externalDependencies.forEach((dep) => {
      md += `- **${dep.title}** (Section ${dep.section}, Page ${dep.page})\n`;
      md += `  - *Exact Wording*: "${dep.exactWording}"\n`;
      md += `  - *Impact*: ${dep.impact}\n`;
      md += `  - *Availability*: ${dep.isAvailable ? 'AVAILABLE / ACCESSIBLE' : 'NOT LOCALLY PRESENT (MARKED AS EXTERNAL OFFICIAL REFERENCE)'} (\`${dep.verificationStatus}\`)\n`;
    });
    md += `\n---\n\n`;
  });

  return md;
}

export const OFFICIAL_METHODOLOGY_SOURCES = OFFICIAL_SOURCE_REGISTRY;

