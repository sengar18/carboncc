import { MethodologyVersion } from '../types';

export const BM_WA03_001: MethodologyVersion = {
  code: 'BM WA03.001',
  name: 'Landfill Methane Recovery',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Waste Management / Landfill Methane',
  sectoralScopeCode: '03: Waste handling and disposal (mandatory) / 01: Energy (conditional)',
  publicationDate: '27 March 2025',
  effectiveDate: '27 March 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: ['AMS-III.G (as valid from 14 July 2019)'],
  pageCount: 13,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_WA03_001_Landfill_Methane_Recovery.pdf',
  documentHash: 'bc18a13ddd576bdaac1d053a2e178df0d8b156c93909a84ac1bd7eebb865e9f7',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities comprising measures to capture and flare and/or utilize methane from landfills and other solid waste disposal sites (SWDS) used for disposal of residues from agricultural, industrial, or municipal sources.',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    'BM-T-004: Project emissions from flaring',
    'BM-T-006: Tool to determine baseline efficiency of thermal and electricity systems',
    'BM-T-011: Emissions from solid waste disposal sites',
    'BM-T-012: Positive lists of technologies'
  ],
  externalDependencies: [
    {
      title: 'BM WA03.002 Flaring or use of landfill gas',
      exactWording: 'The relevant procedures in BM WA03.002: Flaring or use of landfill gas may be followed',
      section: '3.3, paragraph 12 (FCH4,BL,y parameter description)',
      page: 6,
      paragraph: '12',
      impact: 'Procedures for baseline flaring compliance calculations',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'wa03-001-cond-1',
      field: 'solid_waste_disposal_site_exists',
      label: 'Existing Solid Waste Disposal Site (SWDS)',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 3,
      sectionReference: '2.1, paragraph 2',
      provenanceQuote: 'This methodology comprises measures to capture and flare and/or gainfully use methane from landfills and other solid waste disposal sites (SWDS) used for disposal of residues from agricultural or industrial activities, or municipal solid waste.',
      failureMessage: 'The project must capture methane from an identifiable solid waste disposal site (SWDS).'
    },
    {
      id: 'wa03-001-cond-2',
      field: 'no_pre_existing_capture_mandate',
      label: 'Regulatory Additionality Beyond SWM Rules 2016',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 6',
      provenanceQuote: 'If the project activity is required by national or local regulations, the fraction of methane captured in compliance with regulations (F_CH4,BL,y) shall be deducted from baseline emissions.',
      failureMessage: 'Mandatory statutory methane recovery must be accounted for in the baseline fraction.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'wa03-001-mon-1',
      parameter: 'Total Landfill Gas Captured and Methane Fraction',
      parameterSymbol: 'LFGPJ,y / wCH4,y',
      unit: 'Nm3 and % vol',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated mass flow meters with continuous NDIR gas chromatography',
      standard: 'BM-T-004 / BM-T-005',
      pageReference: 11,
      sectionReference: '5.1, paragraph 33-34'
    },
    {
      id: 'wa03-001-mon-2',
      parameter: 'Flare efficiency and operating temperature',
      parameterSymbol: 'eta_flare,y / T_flare',
      unit: '% and deg C',
      frequency: 'CONTINUOUS',
      equipment: 'Thermocouple temperature sensor and flame detector',
      standard: 'BM-T-004',
      pageReference: 12,
      sectionReference: '5.1, paragraph 35'
    }
  ],
  evidenceRequirements: [
    {
      id: 'wa03-001-ev-1',
      documentType: 'SWDS_PERMIT_AND_LOGS',
      description: 'Municipal concession agreement, landfill design drawings, and waste receipt logbooks',
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 7',
      provenanceQuote: 'Project participants shall document the concession agreement with the municipal body and waste receipt history.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'wa03-001-eq-1',
      name: 'Baseline Methane Emissions from Landfill Gas',
      equationText: 'BE_y = (MD_PJ,y - MD_BL,y) * GWP_CH4',
      equationNumber: 'Equation (1)',
      section: '3.3, paragraph 12',
      page: 5,
      description: 'Baseline methane emissions calculated from measured methane destroyed in project minus baseline regulatory destruction.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Global Warming Potential of Methane',
          symbol: 'GWP_CH4',
          unit: 't CO2e/t CH4',
          description: 'GWP of methane (28)',
          source: 'CCTS Rule',
          isMonitored: false,
          defaultValue: 28
        },
        {
          name: 'Methane destroyed in project',
          symbol: 'MD_PJ,y',
          unit: 't CH4/yr',
          description: 'Quantity of methane destroyed by flaring or utilization in year y',
          source: 'Equation (2) / continuous flow meters',
          isMonitored: true
        },
        {
          name: 'Methane destroyed in baseline',
          symbol: 'MD_BL,y',
          unit: 't CH4/yr',
          description: 'Quantity of methane that would have been destroyed in the baseline under regulatory compliance',
          source: 'Equation (3) / regulatory baseline',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    },
    {
      formulaId: 'wa03-001-eq-6',
      name: 'Emission Reductions from Landfill Methane Recovery',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (6)',
      section: '3.6, paragraph 28',
      page: 9,
      description: 'Net emission reductions achieved by landfill gas capture.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2e/yr',
          description: 'Baseline destroyed methane emissions',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Emissions from electricity used for blowers, fossil fuel auxiliary, and unburnt flare methane',
          source: 'Equation (4)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions (0 under BM WA03.001)',
          source: 'Section 3.5, paragraph 27',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
