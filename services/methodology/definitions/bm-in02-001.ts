import { MethodologyVersion } from '../types';

export const BM_IN02_001: MethodologyVersion = {
  code: 'BM IN02.001',
  name: 'Energy efficiency and fuel switching measures for industrial facilities',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Industries / Energy Efficiency',
  sectoralScopeCode: '02: Industries',
  publicationDate: '27 March 2025',
  effectiveDate: '27 March 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: ['AMS-II.D (as valid from 04 October 2013)'],
  pageCount: 19,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_IN02_001_Industrial_Energy_Efficiency.pdf',
  documentHash: '667cdfe482d6afbb125d6509f6ce1c102376259cf7773948720cd0fa428912f4',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to energy efficiency improvement measures implemented at single or several industrial, mining, or mineral production facilities (e.g. motors, pumps, boilers, furnaces, kilns) through new installation or retrofit/replacements, including fuel switching.',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    'BM-T-006: Tool to determine baseline efficiency of thermal and electricity systems'
  ],
  externalDependencies: [
    {
      title: 'Detailed Procedure for Offset Mechanism under CCTS',
      exactWording: 'The definition of start date is applicable as defined in the Detailed Procedure for Offset Mechanism',
      section: '2. Definitions, footnote 1; 5.2, paragraph 54',
      page: 3,
      paragraph: '54',
      impact: 'Start date validation and monitoring calibration rules',
      isAvailable: false,
      verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT'
    },
    {
      title: 'ASME PTC 4-1998 / BS845',
      exactWording: 'ASME PTC 4-1998 Fired Steam Generators / BS845 British Standard Methods for Assessing Thermal Performance of Boilers',
      section: '3.2, paragraph 9',
      page: 4,
      paragraph: '9',
      impact: 'Thermal energy output determination from boiler measurements',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'in02-001-cond-1',
      field: 'direct_energy_measurement_feasible',
      label: 'Direct Energy Measurement Feasible',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '3.2, paragraph 9',
      provenanceQuote: 'This category is applicable to project activities where it is possible to directly measure and record the energy use of the project activity within the project boundary (e.g. electricity and/or fossil fuel consumption and/or the energy contained in the energy carrying medium (ECM) such as steam, hot water, compressed air, etc.)',
      failureMessage: 'The project facility must be capable of direct energy metering and recording.'
    },
    {
      id: 'in02-001-cond-2',
      field: 'not_maintenance_only',
      label: 'Exclusion of Routine Maintenance Measures',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 5,
      sectionReference: '3.2, paragraph 16',
      provenanceQuote: 'The project activity that aims to achieve energy savings through improved maintenance practices, for example through cleaning of filters, repairing valves, correcting system leaks, and using new equipment lubricants, are not covered under this methodology.',
      failureMessage: 'Projects consisting solely of routine maintenance, filter cleaning, or leak repair are excluded.'
    },
    {
      id: 'in02-001-cond-3',
      field: 'product_equivalence',
      label: 'Equivalent Product Output & Quality',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 5,
      sectionReference: '3.2, paragraph 12-13',
      provenanceQuote: 'The output (e.g. steam/heat) and product(s) produced in the industrial facility throughout the crediting period shall be equivalent to the product(s) produced in the baseline.',
      failureMessage: 'The product output and quality must remain equivalent to the baseline.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'in02-001-mon-1',
      parameter: 'Electricity & Fuel consumption of project equipment',
      parameterSymbol: 'ECPJ,y / FCPJ,y',
      unit: 'MWh / tonnes / Nm3',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated electricity meters and fuel meters',
      standard: 'BM-T-002 / BM-T-003',
      pageReference: 15,
      sectionReference: '5.2, paragraph 54-55'
    },
    {
      id: 'in02-001-mon-2',
      parameter: 'Facility Production Output / Input Feedstock',
      parameterSymbol: 'PPJ,i,y',
      unit: 'kg / tonnes / units',
      frequency: 'MONTHLY',
      equipment: 'Plant production logs and certified sales receipts',
      standard: 'National industrial norms / paragraph 42',
      pageReference: 12,
      sectionReference: '4.4.3, paragraph 42'
    }
  ],
  evidenceRequirements: [
    {
      id: 'in02-001-ev-1',
      documentType: 'HISTORICAL_ENERGY_RECORDS',
      description: 'Historical energy consumption data for at least 3 years (or 1 year if annual energy savings <= 600 MWh)',
      isMandatory: true,
      pageReference: 7,
      sectionReference: '4.4, paragraph 25',
      provenanceQuote: 'baseline determination shall be based on relevant operational data for existing system/equipment for the immediately prior three years to the start date of the project activity'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'in02-001-eq-2-sec',
      name: 'Baseline Emissions using Specific Energy Consumption (Option 3)',
      equationText: 'BE_y = sum_i( (SEC_i * P_PJ,i,y) / (1 - l_y) * EF_CO2,y ) + Q_ref,BL * GWP_ref,BL',
      equationNumber: 'Equation (2)',
      section: '4.4.3, paragraph 42',
      page: 11,
      description: 'Baseline emissions calculated via specific energy consumption per unit output multiplied by project output.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Specific Energy Consumption in Baseline',
          symbol: 'SEC_i',
          unit: 'MWh/unit',
          description: 'Specific energy consumption per unit production output in baseline for equipment group i',
          source: 'Historical baseline measurements (Equation 3)',
          isMonitored: false
        },
        {
          name: 'Total Quantity of Output in Project',
          symbol: 'P_PJ,i,y',
          unit: 'units/yr',
          description: 'Total quantity of output in project year y (capped at historical output if capacity addition baseline is not demonstrated)',
          source: 'Production metering',
          isMonitored: true
        },
        {
          name: 'Grid Technical Losses',
          symbol: 'l_y',
          unit: 'fraction',
          description: 'Average annual technical grid losses (transmission and distribution), default 0.10',
          source: 'National utility / default 0.1',
          isMonitored: false,
          defaultValue: 0.10
        },
        {
          name: 'CO2 Emission Factor for Displaced Energy',
          symbol: 'EF_CO2,y',
          unit: 't CO2/MWh',
          description: 'Emission factor of displaced electricity or fossil fuel',
          source: 'CEA Database / BM-T-002 / BM-T-003',
          isMonitored: false
        }
      ]
    },
    {
      formulaId: 'in02-001-eq-7',
      name: 'Emission Reductions from Industrial Energy Efficiency',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (7)',
      section: '4.7, paragraph 52',
      page: 15,
      description: 'Net emission reductions achieved by industrial energy efficiency improvements.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2e/yr',
          description: 'Baseline energy emissions',
          source: 'Equation (2)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Emissions from electricity, fossil fuels, ECM and refrigerants consumed by project systems',
          source: 'Equation (4)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions from equipment transfer',
          source: 'Section 4.6, paragraph 51',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
