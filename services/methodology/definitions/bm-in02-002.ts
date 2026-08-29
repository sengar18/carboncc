import { MethodologyVersion } from '../types';

export const BM_IN02_002: MethodologyVersion = {
  code: 'BM IN02.002',
  name: 'Hydrogen production using methane extracted from biogas',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Hydrogen / Industrial Processing',
  sectoralScopeCode: '02: Industries',
  publicationDate: '27 March 2025',
  effectiveDate: '27 March 2025',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: ['AMS-III.O (as valid from 24 July 2015)'],
  pageCount: 13,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_IN02_002_Hydrogen_from_Biogas.pdf',
  documentHash: '39ccdbf5442c1ddd740489cf97d318ae326638ef1dc42e5e767cdf4e3f6c17b8',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities where hydrogen is produced using methane extracted from biogas generated from biomass, agro-industrial or municipal solid waste, and/or wastewater. Hydrogen produced is used on-site or supplied to dedicated nearby consumers.',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation'
  ],
  externalDependencies: [
    {
      title: 'BM WA03.001 Landfill Methane Recovery',
      exactWording: 'using technologies/measures covered in BM WA03.001',
      section: '2.2, paragraph 5(b) & 6; 4.2, paragraph 34(b)',
      page: 3,
      paragraph: '5(b)',
      impact: 'Methane recovery calculation from wastewater/landfill biogas feedstocks',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'in02-002-cond-1',
      field: 'biogas_source_compliance',
      label: 'Eligible Biogas Feedstock Source',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 3,
      sectionReference: '2.2, paragraph 5',
      provenanceQuote: 'The project activity produces hydrogen using methane extracted from biogas generated from: (a) Biomass or biomass residues; (b) Agro-industrial or municipal solid waste, wastewater using technologies/measures covered in BM WA03.001',
      failureMessage: 'Biogas must originate from verified biomass, organic waste, or wastewater digestion.'
    },
    {
      id: 'in02-002-cond-2',
      field: 'hydrogen_displaces_fossil',
      label: 'Hydrogen Displaces Fossil Fuel / Fossil Feedstock',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 8',
      provenanceQuote: 'The hydrogen produced by the project activity shall displace hydrogen produced from fossil fuels in the baseline (e.g. steam methane reforming of natural gas or naphtha).',
      failureMessage: 'Produced hydrogen must displace fossil-derived hydrogen in the baseline scenario.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'in02-002-mon-1',
      parameter: 'Quantity of hydrogen produced and supplied',
      parameterSymbol: 'QH2,y',
      unit: 'Nm3 or kg/year',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated mass flow meters with gas chromatography for H2 purity',
      standard: 'BM-T-005',
      pageReference: 10,
      sectionReference: '5.1, paragraph 38'
    },
    {
      id: 'in02-002-mon-2',
      parameter: 'Biogas flow and methane content fed to reformer',
      parameterSymbol: 'VBG,y / wCH4,y',
      unit: 'm3 and % vol',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated ultrasonic flow meter and continuous NDIR methane analyzer',
      standard: 'BM-T-005 / ISO standard',
      pageReference: 11,
      sectionReference: '5.1, paragraph 39'
    }
  ],
  evidenceRequirements: [
    {
      id: 'in02-002-ev-1',
      documentType: 'BIOGAS_FEEDSTOCK_LOGS',
      description: 'Digester feeding records and biogas production quality logbooks',
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 9',
      provenanceQuote: 'Project participants shall monitor and verify the quantity of biogenic feedstock fed into the anaerobic digester system.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'in02-002-eq-1',
      name: 'Baseline Emissions from Fossil Hydrogen Displacement',
      equationText: 'BE_y = Q_H2,y * EF_H2,fossil',
      equationNumber: 'Equation (1)',
      section: '4.2, paragraph 25',
      page: 6,
      description: 'Baseline emissions from displacement of fossil hydrogen with biogas-reformed hydrogen.',
      outputUnit: 't CO2/yr',
      requiredParameters: [
        {
          name: 'Quantity of Hydrogen Produced',
          symbol: 'Q_H2,y',
          unit: 'Nm3/yr',
          description: 'Quantity of hydrogen produced and consumed in project year y',
          source: 'Continuous metering',
          isMonitored: true
        },
        {
          name: 'Fossil Hydrogen Emission Factor',
          symbol: 'EF_H2,fossil',
          unit: 't CO2/Nm3 H2',
          description: 'Emission factor for baseline steam reforming of natural gas or fossil fuel',
          source: 'Specific plant data / IPCC default (Equation 2)',
          isMonitored: false
        }
      ]
    },
    {
      formulaId: 'in02-002-eq-5',
      name: 'Emission Reductions from Biogas Hydrogen',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (5)',
      section: '4.5, paragraph 36',
      page: 9,
      description: 'Net emission reductions achieved by reforming biogas to hydrogen.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2/yr',
          description: 'Displaced fossil hydrogen baseline emissions',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Electricity consumption, auxiliary fuel, and reformer flare project emissions',
          source: 'Equation (3)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Methane leakage during biogas compression and distribution',
          source: 'Equation (4)',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
