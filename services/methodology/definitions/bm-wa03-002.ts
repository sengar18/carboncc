import { MethodologyVersion } from '../types';

export const BM_WA03_002: MethodologyVersion = {
  code: 'BM WA03.002',
  name: 'Flaring or use of landfill gas',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Waste Management / Landfill Gas to Energy',
  sectoralScopeCode: '03: Waste handling and disposal (mandatory) / 01: Energy (mandatory if energy used)',
  publicationDate: '27 March 2025',
  effectiveDate: '27 March 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: ['ACM0001 (as valid from 14 June 2019)'],
  pageCount: 33,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_WA03_002_Flaring_or_Use_Landfill_Gas.pdf',
  documentHash: 'ec55c534663d31195c9fdf9a25a1614359cd88e238186c88a6b4bf67df621c61',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities that capture and flare landfill gas, generate electricity/heat using LFG, or feed LFG into a natural gas distribution grid or dedicated pipeline, displacing fossil fuels.',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    'BM-T-004: Project emissions from flaring',
    'BM-T-005: Tool to determine the mass flow of a greenhouse gas in a gaseous stream',
    'BM-T-006: Tool to determine baseline efficiency of thermal and electricity systems',
    'BM-T-007: Project and leakage emissions from transportation of freight',
    'BM-T-011: Emissions from solid waste disposal sites',
    'BM-T-012: Positive lists of technologies'
  ],
  externalDependencies: [
    {
      title: 'BM-T-009 Upstream leakage emissions associated with fossil fuel use',
      exactWording: 'This default value (2.2 tCO2e/TJ) is based on BM-T-009: Upstream leakage emissions associated with fossil fuel use',
      section: '4.4.2, footnote 4 (PESP,y default factor)',
      page: 22,
      paragraph: 'footnote 4',
      impact: 'Default emission factor for physical leakage of LFG in dedicated pipeline (2.2 tCO2e/TJ)',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'wa03-002-cond-1',
      field: 'landfill_gas_capture_and_utilization',
      label: 'Landfill Gas Capture and Combustion/Utilization',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 5,
      sectionReference: '3.1, paragraph 6',
      provenanceQuote: 'This methodology applies to project activities that implement the following measures: (a) Capture of LFG and its flaring; (b) Capture of LFG and its use to produce energy; (c) Capture of LFG and its supply to consumers through a dedicated pipeline.',
      failureMessage: 'The project must capture LFG for flaring, energy generation, or dedicated pipeline supply.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'wa03-002-mon-1',
      parameter: 'Landfill gas mass flow rate and methane concentration',
      parameterSymbol: 'FCH4,PJ,y / wCH4,y',
      unit: 't CH4/year and % vol',
      frequency: 'CONTINUOUS',
      equipment: 'Mass flow meter with temperature/pressure compensation and continuous NDIR gas analyzer',
      standard: 'BM-T-005',
      pageReference: 25,
      sectionReference: '5.1, Data Table 1'
    },
    {
      id: 'wa03-002-mon-2',
      parameter: 'Net electricity generation supplied to grid or captive loads',
      parameterSymbol: 'EGPJ,y',
      unit: 'MWh/year',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated bi-directional electricity meters',
      standard: 'BM-T-003',
      pageReference: 27,
      sectionReference: '5.1, Data Table 4'
    }
  ],
  evidenceRequirements: [
    {
      id: 'wa03-002-ev-1',
      documentType: 'LFG_PLANT_COMMISSIONING_REPORT',
      description: 'LFG extraction wellfield layout drawings, blower and flare commissioning reports, and calibration certificates',
      isMandatory: true,
      pageReference: 6,
      sectionReference: '3.2, paragraph 11',
      provenanceQuote: 'Project participants shall provide engineering drawings of the extraction wellfield and gas utilization units.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'wa03-002-eq-1',
      name: 'Baseline Emissions for Landfill Gas Flaring and Energy',
      equationText: 'BE_y = BE_CH4,y + BE_power,y + BE_heat,y',
      equationNumber: 'Equation (1)',
      section: '4.3, paragraph 21',
      page: 11,
      description: 'Baseline emissions comprising avoided methane venting, displaced grid/fossil power, and displaced fossil heat.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Methane Emissions Avoided',
          symbol: 'BE_CH4,y',
          unit: 't CO2e/yr',
          description: 'Methane captured and destroyed minus baseline regulatory destruction',
          source: 'Equation (2)',
          isMonitored: false
        },
        {
          name: 'Baseline Power Emissions Displaced',
          symbol: 'BE_power,y',
          unit: 't CO2/yr',
          description: 'Displaced electricity generation emissions',
          source: 'Equation (9)',
          isMonitored: false,
          defaultValue: 0
        },
        {
          name: 'Baseline Heat Emissions Displaced',
          symbol: 'BE_heat,y',
          unit: 't CO2/yr',
          description: 'Displaced fossil heat generation emissions',
          source: 'Equation (12)',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    },
    {
      formulaId: 'wa03-002-eq-21',
      name: 'Emission Reductions from LFG Capture and Utilization',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (21)',
      section: '4.6, paragraph 43',
      page: 24,
      description: 'Net emission reductions achieved by the landfill gas project.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2e/yr',
          description: 'Baseline avoided methane, power, and heat emissions',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Project emissions from electricity consumption, flare unburnt methane, fossil auxiliary, and pipeline transport',
          source: 'Equation (14)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions from equipment transfer',
          source: 'Section 4.5, paragraph 42',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
