import { MethodologyVersion } from '../types';

export const BM_EN01_002: MethodologyVersion = {
  code: 'BM EN01.002',
  name: 'Hydrogen production from electrolysis of water',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Green Hydrogen / Renewable Energy',
  sectoralScopeCode: '01: Energy',
  publicationDate: '27 March 2025',
  effectiveDate: '27 March 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: ['AM0124 (as valid from 27 September 2023)'],
  pageCount: 18,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_EN01_002_Hydrogen_Electrolysis_Water.pdf',
  documentHash: '8c2e17665c6e75f62917b8ad1dd5fa59d937cdbd929793fa9167236bcf2bbaa9',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities where hydrogen is produced by electrolysis of water and is supplied to existing dedicated consumer(s). Electricity consumed by the electrolyser plant must be sourced from a captive renewable power plant only, or from a mix of electricity predominantly from a captive renewable plant and residually from the electric grid.',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    'BM-T-005: Tool to determine the mass flow of a greenhouse gas in a gaseous stream',
    'BM-T-007: Project and leakage emissions from transportation of freight'
  ],
  externalDependencies: [
    {
      title: 'IEA (2023) Hydrogen Definitions Report',
      exactWording: 'Values derived from IEA (2023): Towards hydrogen definitions based on their emissions intensity',
      section: '4.3, paragraph 22',
      page: 8,
      paragraph: '22',
      impact: 'Baseline hydrogen emission factor defaults (19 tCO2e/tH2 for coal, 9 tCO2e/tH2 for gas/oil)',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    },
    {
      title: 'Cooper et al. (2022) Hydrogen Leakage Study',
      exactWording: 'Hydrogen emissions from the hydrogen value chain - emissions profile and impact to global warming, Science of Total Environment (Elsevier)',
      section: '5.1, Data table 8',
      page: 13,
      impact: 'Default physical leakage rate (5%)',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'en01-002-cond-1',
      field: 'dedicated_consumer_exists',
      label: 'Supply to Existing Dedicated Consumer',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '3.2, paragraph 7',
      provenanceQuote: 'The hydrogen produced by the project activity is supplied to (an) existing dedicated consumer(s) identified ex-ante in the PDD. Prior to the implementation of the project activity, the hydrogen supplied to the existing consumer(s) has been produced through gasification of coal, or steam reforming of natural gas or oil.',
      failureMessage: 'The project must supply hydrogen to an existing dedicated consumer that historically used grey hydrogen.'
    },
    {
      id: 'en01-002-cond-2',
      field: 'grid_to_captive_electricity_ratio',
      label: 'Grid Electricity Consumption Ratio (< 0.10)',
      operator: 'LESS_THAN',
      expectedValue: 0.10,
      unit: 'ratio',
      isMandatory: true,
      pageReference: 4,
      sectionReference: '3.2, paragraph 9',
      provenanceQuote: 'The project activity shall ensure that the ratio between the electricity consumed from the grid (ECPJ,grid,y) and the electricity consumed from the captive renewable power plant (ECPJ,captive,y) by the electrolyser hydrogen production plant is below 0.1 on an annual basis.',
      failureMessage: 'The annual grid electricity consumption ratio must be strictly below 0.10 (10%).'
    },
    {
      id: 'en01-002-cond-3',
      field: 'local_drinking_water_consumption_ratio',
      label: 'Local Drinking Water Consumption Limit (<= 5%)',
      operator: 'LESS_THAN',
      expectedValue: 5.0,
      unit: '%',
      isMandatory: true,
      pageReference: 5,
      sectionReference: '3.2, paragraph 12',
      provenanceQuote: 'The project shall use no more than 5 per cent of the drinking water available locally, to ensure that the water used in the electrolysis will not displace other uses.',
      failureMessage: 'Electrolyser must not consume more than 5% of local drinking water supply.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'en01-002-mon-1',
      parameter: 'Mass of pure green hydrogen produced and consumed',
      parameterSymbol: 'MH2,PJ,y',
      unit: 'tH2/year',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated mass/flow meters with gas chromatography',
      standard: 'BM-T-005',
      pageReference: 9,
      sectionReference: '4.3, paragraph 23; 5.2 Data Table 10-12'
    },
    {
      id: 'en01-002-mon-2',
      parameter: 'Captive RE vs Grid Electricity Consumption',
      parameterSymbol: 'ECPJ,captive,y / ECPJ,grid,y',
      unit: 'MWh/year',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated electricity meters',
      standard: 'BM-T-003',
      pageReference: 16,
      sectionReference: '5.2, Data Table 17'
    }
  ],
  evidenceRequirements: [
    {
      id: 'en01-002-ev-1',
      documentType: 'HYDROGEN_OFFTAKE_AGREEMENT',
      description: 'Long-term hydrogen supply agreement with dedicated consumer and proof of baseline grey hydrogen displacement',
      isMandatory: true,
      pageReference: 4,
      sectionReference: '3.2, paragraph 10',
      provenanceQuote: 'The Non-obligated entity shall demonstrate that double counting of emission reductions will not occur, e.g. via a contractual agreement with the dedicated consumer'
    },
    {
      id: 'en01-002-ev-2',
      documentType: 'WATER_ALLOCATION_PERMIT',
      description: 'Local authority water allocation approval verifying non-depletion of drinking water supply',
      isMandatory: true,
      pageReference: 5,
      sectionReference: '3.2, paragraph 12',
      provenanceQuote: 'This check shall be made at validation and at each renewal of the crediting period using data from the project activity and from official sources.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'en01-002-eq-1',
      name: 'Baseline Emissions for Green Hydrogen Production',
      equationText: 'BE_y = M_H2,PJ,y * EF_H2,BL',
      equationNumber: 'Equation (1)',
      section: '4.3, paragraph 21',
      page: 7,
      description: 'Baseline emissions calculated from mass of pure green hydrogen produced multiplied by the baseline hydrogen plant emission factor.',
      outputUnit: 't CO2/yr',
      requiredParameters: [
        {
          name: 'Mass of pure hydrogen produced and consumed',
          symbol: 'M_H2,PJ,y',
          unit: 'tH2/yr',
          description: 'Mass of pure hydrogen produced by project activity and consumed by existing dedicated consumers in year y',
          source: 'Continuous mass/volumetric metering',
          isMonitored: true
        },
        {
          name: 'Baseline Hydrogen Emission Factor',
          symbol: 'EF_H2,BL',
          unit: 'tCO2e/tH2',
          description: 'Emission factor of existing baseline hydrogen plant (min between historical data or IEA defaults: 19 for coal, 9 for gas/oil)',
          source: 'IEA (2023) / Historical measurement (Equation 2)',
          isMonitored: false
        }
      ]
    },
    {
      formulaId: 'en01-002-eq-9',
      name: 'Emission Reductions from Green Hydrogen',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (9)',
      section: '4.6, paragraph 32',
      page: 11,
      description: 'Net emission reductions achieved by the green hydrogen electrolysis project.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2/yr',
          description: 'Baseline emissions from grey hydrogen displacement',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Project emissions from grid electricity, fossil fuel auxiliaries, incremental transport, and physical leaks',
          source: 'Equation (5)',
          isMonitored: false,
          defaultValue: 0
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions (0 under BM EN01.002)',
          source: 'Section 4.5, paragraph 31',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
