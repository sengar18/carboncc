import { MethodologyVersion } from '../types';

export const BM_AG04_001: MethodologyVersion = {
  code: 'BM AG04.001',
  name: 'Methane recovery from livestock and manure management at households and small farms',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Agriculture / Manure Management',
  sectoralScopeCode: '03: Waste handling and disposal (mandatory) / 01: Energy (conditional)',
  publicationDate: '27 March 2025',
  effectiveDate: '27 March 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: ['AMS-III.R (as valid from 24 March 2023)'],
  pageCount: 15,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_AG04_001_Livestock_Manure_Management.pdf',
  documentHash: '499f659307ea35186508bd5aac8981387d8982575ff9479514eacd9dc9f38989',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities involving the recovery and destruction and/or utilization of methane from manure and wastes from livestock that would otherwise be managed in anaerobic conditions, implemented at individual households or small farms.',
  adoptedTools: [
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    'BM-T-008: Project and leakage emissions from anaerobic digesters',
    'BM-T-010: Project and leakage emissions from biomass'
  ],
  externalDependencies: [
    {
      title: '2019 Refinement to the 2006 IPCC Guidelines',
      exactWording: 'Table 10.13A, 10.16, 10.17, 10.18, and Table 10A.5 of chapter Emissions from Livestock and Manure Management',
      section: '3.2, paragraph 13; 4.1 Data table 2',
      page: 6,
      paragraph: '13',
      impact: 'Default VS excretion rate, Bo max capacity, MCF factors for manure systems',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    },
    {
      title: 'Standard for sampling and surveys for ICM project activities',
      exactWording: 'following requirements in the Standard for sampling and surveys for ICM project activities and programme of activities',
      section: '4. Methodology: Monitoring Component, paragraph 22',
      page: 9,
      paragraph: '22',
      impact: 'Sampling precision for animal population and digestate land application verification',
      isAvailable: false,
      verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT'
    }
  ],
  applicabilityConditions: [
    {
      id: 'ag04-001-cond-1',
      field: 'livestock_manure_baseline_anaerobic',
      label: 'Baseline Anaerobic Manure Management',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 3,
      sectionReference: '2.2, paragraph 6',
      provenanceQuote: 'The livestock population is managed in a confined area and the manure would have been managed under anaerobic conditions in the baseline (e.g. open anaerobic lagoon, liquid/slurry storage, deep pit).',
      failureMessage: 'Livestock manure must have been managed under baseline anaerobic conditions (e.g. deep pit or open lagoon).'
    },
    {
      id: 'ag04-001-cond-2',
      field: 'farm_scale_threshold',
      label: 'Household or Small-Scale Farm Scale',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 3,
      sectionReference: '2.1, paragraph 2',
      provenanceQuote: 'This methodology comprises methane recovery from livestock and manure management at households and small farms.',
      failureMessage: 'Project must be implemented at rural households or small farms.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'ag04-001-mon-1',
      parameter: 'Livestock population by animal category and average weight',
      parameterSymbol: 'NLT,k,y',
      unit: 'heads of animals',
      frequency: 'ANNUAL',
      equipment: 'Farm survey / sampling census',
      standard: 'Standard for sampling and surveys for ICM project activities',
      pageReference: 11,
      sectionReference: '5.1, Data Table 1'
    },
    {
      id: 'ag04-001-mon-2',
      parameter: 'Digester operational status and biogas consumption',
      parameterSymbol: 'Oper_hours,y',
      unit: 'hours or binary',
      frequency: 'ANNUAL_SAMPLE',
      equipment: 'Physical sample verification of digester operation',
      standard: 'Methodology monitoring section 5.1',
      pageReference: 12,
      sectionReference: '5.1, Data Table 2'
    }
  ],
  evidenceRequirements: [
    {
      id: 'ag04-001-ev-1',
      documentType: 'FARM_CENSUS_LOGS',
      description: 'Household/farm registry, GPS coordinates, livestock ownership verification, and digester commissioning receipts',
      isMandatory: true,
      pageReference: 10,
      sectionReference: '4.2, paragraph 23',
      provenanceQuote: 'A database shall be maintained containing the identity of each household, digester model, GPS coordinates, and livestock herd size.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'ag04-001-eq-1',
      name: 'Baseline Methane Emissions from Manure Management',
      equationText: 'BE_y = GWP_CH4 * D_CH4 * sum_k( N_LT,k,y * VS_LT,k * 365 * B_o,k * MCF_baseline * UF_b )',
      equationNumber: 'Equation (1)',
      section: '3.2, paragraph 13',
      page: 5,
      description: 'Baseline methane emissions calculated from animal count, volatile solids excretion, maximum methane producing capacity, and baseline methane conversion factor.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Global Warming Potential of Methane',
          symbol: 'GWP_CH4',
          unit: 't CO2e/t CH4',
          description: 'Global Warming Potential of methane (28 under IPCC AR5 / CCTS)',
          source: 'CCTS Rule / IPCC AR5',
          isMonitored: false,
          defaultValue: 28
        },
        {
          name: 'Methane Density',
          symbol: 'D_CH4',
          unit: 't CH4/m3 CH4',
          description: 'Methane density at standard temperature and pressure (0.00067 t/m3)',
          source: 'Standard constant',
          isMonitored: false,
          defaultValue: 0.00067
        },
        {
          name: 'Number of livestock heads',
          symbol: 'N_LT,k,y',
          unit: 'heads',
          description: 'Number of animals of livestock type k in year y',
          source: 'Annual livestock census / survey',
          isMonitored: true
        },
        {
          name: 'Volatile solids excretion rate',
          symbol: 'VS_LT,k',
          unit: 'kg dry matter/animal/day',
          description: 'Annual average daily volatile solids excreted for livestock type k',
          source: '2019 IPCC Refinement / Table 2',
          isMonitored: false
        },
        {
          name: 'Maximum methane producing capacity',
          symbol: 'B_o,k',
          unit: 'm3 CH4/kg VS',
          description: 'Maximum methane producing capacity for manure produced by livestock k',
          source: '2019 IPCC Refinement / Table 2',
          isMonitored: false
        },
        {
          name: 'Baseline Methane Conversion Factor',
          symbol: 'MCF_baseline',
          unit: 'fraction',
          description: 'Methane conversion factor for baseline manure management system',
          source: '2019 IPCC Refinement / Table 3',
          isMonitored: false
        }
      ]
    },
    {
      formulaId: 'ag04-001-eq-7',
      name: 'Emission Reductions from Manure Biogas Recovery',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (7)',
      section: '3.5, paragraph 21',
      page: 9,
      description: 'Net emission reductions achieved by household/small-scale manure digesters.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2e/yr',
          description: 'Avoided baseline methane emissions',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Physical leakage from digesters, flaring inefficiencies, and aerobic digestate handling',
          source: 'Equation (5)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions (0 under BM AG04.001)',
          source: 'Section 3.4, paragraph 20',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
