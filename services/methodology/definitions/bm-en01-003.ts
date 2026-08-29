import { MethodologyVersion } from '../types';

export const BM_EN01_003: MethodologyVersion = {
  code: 'BM EN01.003',
  name: 'Electricity and Heat Generation from Biomass',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Biomass Energy / Cogeneration',
  sectoralScopeCode: '01: Energy / 02: Industries / 03: Waste Handling and Disposal',
  publicationDate: '30 June 2026',
  effectiveDate: '30 June 2026',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: [
    'ACM0006 (as valid from 11 March 2022)',
    'ACM0018 (as valid from 11 March 2022)',
    'AM0036 (as valid from 11 March 2022)'
  ],
  pageCount: 96,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_EN01_003_Electricity_Heat_Biomass.pdf',
  documentHash: '7ef1c28852fe0e71e003da197d5d9b7c52bcb054f2ce54d412789d611ec6833f',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities that operate biomass (co-)fired power-and-heat plants, generate power using biomass as fuel (optionally combined with solar thermal), and operate biomass (co-)fired heat generation equipment in Greenfield, capacity expansion, or fuel switch configurations.',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    'BM-T-006: Determining the baseline efficiency of thermal or electric energy generation systems',
    'BM-T-007: Project and leakage emissions from transportation of freight',
    'BM-T-010: Project and leakage emissions from biomass',
    'BM-T-011: Emissions from solid waste disposal sites',
    'BM-T-015: Tool to determine the remaining lifetime of equipment'
  ],
  externalDependencies: [
    {
      title: 'Detailed Procedure for Offset Mechanism under CCTS',
      exactWording: 'The definitions contained in the Detail Procedure for Offset Mechanism shall apply',
      section: '3. Definitions, paragraph 20',
      page: 8,
      paragraph: '20',
      impact: 'Core legal terminology and administrative definitions',
      isAvailable: false,
      verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT'
    },
    {
      title: 'CEA CO2 Database',
      exactWording: 'The grid emission factor (EFEG,GR,y) shall be determined using the latest approved version of CEA Database',
      section: '4.3.1.2.3, paragraph 47',
      page: 20,
      paragraph: '47',
      impact: 'Grid baseline and project import emission factors',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    },
    {
      title: '2006 IPCC Guidelines (Agricultural Residues Default)',
      exactWording: '2006 IPCC Guidelines, Volume 4, Table 2.5, default value for agricultural residues (0.0027 t CH4/t biomass)',
      section: '4.3.1.5.1, paragraph 97',
      page: 34,
      paragraph: '97',
      impact: 'Methane emission factor for uncontrolled burning of agricultural biomass residues',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'en01-003-cond-1',
      field: 'biomass_feedstock_allowed',
      label: 'Eligible Biomass Feedstocks',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 7(a)',
      provenanceQuote: 'Biomass used by the project plant is limited to biomass residues including agricultural waste, biogas, RDF and/or biomass from dedicated plantations;',
      failureMessage: 'Feedstock must be limited to biomass residues, agricultural waste, biogas, or dedicated plantations.'
    },
    {
      id: 'en01-003-cond-2',
      field: 'fossil_cofiring_ratio',
      label: 'Fossil Fuel Co-Firing Cap (<= 20% for New Plants)',
      operator: 'LESS_THAN',
      expectedValue: 20.0,
      unit: '%',
      isMandatory: true,
      pageReference: 5,
      sectionReference: '2.2, paragraph 7(b)',
      provenanceQuote: 'Fossil fuels may be co-fired in the project plant. Additionality criteria corresponding to regulatory surplus shall need to be considered while applying the same. In case of new biomass-based plant, the proportion of fossil fuels co-fired may not exceed 20%.',
      failureMessage: 'Fossil fuel co-firing in new biomass plants cannot exceed 20% on a weight basis.'
    },
    {
      id: 'en01-003-cond-3',
      field: 'biomass_storage_period_years',
      label: 'Biomass Storage Period (<= 2 Years)',
      operator: 'LESS_THAN',
      expectedValue: 2.0,
      unit: 'years',
      isMandatory: true,
      pageReference: 5,
      sectionReference: '2.2, paragraph 7(d)',
      provenanceQuote: 'The biomass used by the project plant is not stored for more than two years;',
      failureMessage: 'Biomass must not be stored on-site for more than two years.'
    },
    {
      id: 'en01-003-cond-4',
      field: 'no_prior_chemical_biological_treatment',
      label: 'No Prior Chemical/Biological Processing',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 5,
      sectionReference: '2.2, paragraph 7(e)',
      provenanceQuote: 'The biomass used by the project plant is not processed chemically or biologically (e.g. through esterification, fermentation, hydrolysis, pyrolysis, bio- or chemical-degradation, etc.) prior to combustion. Drying and mechanical processing, such as shredding, briquetting, torrefaction and pelletisation, are allowed.',
      failureMessage: 'Biomass must not undergo chemical or biological degradation prior to combustion (only mechanical processing, pelletisation, and torrefaction are permitted).'
    }
  ],
  monitoringRequirements: [
    {
      id: 'en01-003-mon-1',
      parameter: 'Biomass categories and quantities combusted in project',
      parameterSymbol: 'BRPJ,n,y',
      unit: 'tonnes on dry-basis',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated weight meters with moisture determination',
      standard: 'NABL accredited laboratory moisture tests / paragraph 208',
      pageReference: 81,
      sectionReference: '5.2, Data Table 41',
      qaQcProcedure: 'Crosscheck the measurements with an annual energy balance that is based on purchased quantities and stock changes.'
    },
    {
      id: 'en01-003-mon-2',
      parameter: 'Net process heat generated and supplied to loads',
      parameterSymbol: 'HCBL,y / HGPJ,total,y',
      unit: 'GJ/year',
      frequency: 'CONTINUOUS',
      equipment: 'Steam flow meters, temperature and pressure sensors',
      standard: 'Steam enthalpy tables / BS845',
      pageReference: 84,
      sectionReference: '5.2, Data Table 49'
    },
    {
      id: 'en01-003-mon-3',
      parameter: 'Gross and Net Electricity Generation',
      parameterSymbol: 'ELPJ,gross,y / ELPJ,aux,y',
      unit: 'MWh/year',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated electricity meters',
      standard: 'BM-T-003',
      pageReference: 84,
      sectionReference: '5.2, Data Table 50 & 52'
    }
  ],
  evidenceRequirements: [
    {
      id: 'en01-003-ev-1',
      documentType: 'WEIGHBRIDGE_RECORDS',
      description: 'Daily weighbridge receipts and monthly moisture test certificates for incoming biomass shipments',
      isMandatory: true,
      pageReference: 67,
      sectionReference: '4.7, Data Table 2',
      provenanceQuote: 'Use weight or volume meters. Adjust for the moisture content in order to determine the quantity of dry biomass.'
    },
    {
      id: 'en01-003-ev-2',
      documentType: 'EQUIPMENT_LIFETIME_DOCUMENTATION',
      description: 'Remaining lifetime documentation for existing heat and power equipment in accordance with BM-T-015',
      isMandatory: true,
      pageReference: 7,
      sectionReference: '2.2, paragraph 13',
      provenanceQuote: 'Non-obligated entities should determine and document the remaining lifetime of each unit of the existing heat generation equipment in accordance with BM-T-015.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'en01-003-eq-1',
      name: 'Baseline Emissions for Biomass Power and Heat Generation',
      equationText: 'BE_y = EL_BL,GR,y * EF_EG,GR,y + sum_f(FF_BL,HG,y,f * EF_FF,y,f) + EL_BL,FF/GR,y * min(EF_EG,GR,y, EF_EG,FF,y) + BE_BR,y',
      equationNumber: 'Equation (1)',
      section: '4.3.1, paragraph 37',
      page: 16,
      description: 'Calculates baseline emissions for biomass energy projects combining grid electricity displacement, process heat fossil displacement, and avoided biomass decay/burning.',
      outputUnit: 't CO2/yr',
      requiredParameters: [
        {
          name: 'Baseline grid electricity',
          symbol: 'EL_BL,GR,y',
          unit: 'MWh/yr',
          description: 'Baseline electricity sourced from the grid in year y',
          source: 'Equation (5)',
          isMonitored: false
        },
        {
          name: 'Grid Emission Factor',
          symbol: 'EF_EG,GR,y',
          unit: 't CO2/MWh',
          description: 'Grid emission factor from CEA database',
          source: 'CEA CO2 Baseline Database',
          isMonitored: false
        },
        {
          name: 'Baseline fossil fuel demand for process heat',
          symbol: 'FF_BL,HG,y,f',
          unit: 'GJ/yr',
          description: 'Baseline fossil fuel demand for process heat',
          source: 'Equation (15)',
          isMonitored: false
        },
        {
          name: 'Fossil fuel CO2 emission factor',
          symbol: 'EF_FF,y,f',
          unit: 't CO2/GJ',
          description: 'CO2 emission factor for fossil fuel type f',
          source: 'BM-T-002 / IPCC Default',
          isMonitored: false
        }
      ]
    },
    {
      formulaId: 'en01-003-eq-52',
      name: 'Emission Reductions from Biomass Energy',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (52)',
      section: '4.6, paragraph 207',
      page: 66,
      description: 'Net emission reductions achieved by the biomass power/heat project activity.',
      outputUnit: 't CO2/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2/yr',
          description: 'Baseline emissions from power, heat, and biomass decay',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2/yr',
          description: 'Project emissions from biomass transport, processing, auxiliary fossil fuels, and grid imports',
          source: 'Equation (45)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2/yr',
          description: 'Leakage emissions calculated in accordance with BM-T-010',
          source: 'Section 4.5, paragraph 203',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
