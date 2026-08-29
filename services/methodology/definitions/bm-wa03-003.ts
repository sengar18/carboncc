import { MethodologyVersion } from '../types';

export const BM_WA03_003: MethodologyVersion = {
  code: 'BM WA03.003',
  name: 'Production of Compressed Bio-gas (CBG)',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Waste Handling and Disposal / Compressed Biogas (CBG)',
  sectoralScopeCode: '03: Waste Handling and Disposal',
  publicationDate: '30 June 2026',
  effectiveDate: '30 June 2026',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: [
    'ACM0022 (as valid from 09 September 2021)',
    'AMS-III.Q (as valid from 16 April 2015)',
    'AMS-III.AQ (as valid from 01 June 2014)',
    'Gold Standard Soil Organic Carbon Framework Methodology (as valid from January 2020)'
  ],
  pageCount: 107,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_WA03_003_Production_Compressed_Biogas_CBG.pdf',
  documentHash: 'a73432466c55543d3663916d283a64397a84737db4fd54a9044d711ea936083b',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities that produce Compressed Bio-gas (CBG) from organic feedstocks (e.g. municipal solid waste, agricultural residues, pressmud, animal manure, wastewater/effluent sludge) and supply CBG for transport, industrial fuel, or gas grid injection.',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion',
    'BM-T-003: Baseline, project and/or leakage emissions from electricity consumption and monitoring of electricity generation',
    'BM-T-004: Project emissions from flaring',
    'BM-T-005: Tool to determine the mass flow of a greenhouse gas in a gaseous stream',
    'BM-T-006: Determining the baseline efficiency of thermal or electric energy generation systems',
    'BM-T-007: Project and leakage emissions from transportation of freight',
    'BM-T-008: Project and leakage emissions from anaerobic digesters',
    'BM-T-009: Upstream leakage emissions associated with fossil fuel use',
    'BM-T-010: Project and leakage emissions from biomass',
    'BM-T-011: Emissions from solid waste disposal sites',
    'BM-T-013: Project and leakage emissions from composting',
    'BM-T-014: Apportioning emissions from production processes between main product and co-and by-product',
    'BM-T-015: Tool to determine the remaining lifetime of equipment'
  ],
  externalDependencies: [
    {
      title: 'Detailed Procedure for Offset Mechanism under CCTS',
      exactWording: 'The definitions contained in the Detail Procedure for Offset Mechanism shall apply',
      section: '3. Definitions, paragraph 22; 4.3.1.1, paragraph 50 (Principle E4 Suppressed Demand)',
      page: 8,
      paragraph: '22',
      impact: 'Suppressed demand default MCF (0.4) and definitions',
      isAvailable: false,
      verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT'
    },
    {
      title: 'PNGRB Statutory Regulations for CBG',
      exactWording: 'Biomethane/renewable biogas (RBG) as per applicable statutory laws in India, PNGRB CBG regulations',
      section: '3. Definitions (d), footnote 6',
      page: 9,
      paragraph: 'footnote 6',
      impact: 'Methane content threshold (90-95% CH4) and CNG equivalence',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    },
    {
      title: 'FCO (Fertilizer Control Order) 2025 Third Amendment',
      exactWording: 'Third Amendment to The Fertilizer (Inorganic, Organic or Mixed) (Control) Order 2025',
      section: '3. Definitions (i), footnote 7',
      page: 9,
      paragraph: 'footnote 7',
      impact: 'Fermented Organic Manure (FOM) specification (minimum 12-14% organic carbon)',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'wa03-003-cond-1',
      field: 'cbg_methane_purity_fco',
      label: 'CBG Quality Meets Statutory & PNGRB Standards (>= 90% CH4)',
      operator: 'GREATER_THAN',
      expectedValue: 90.0,
      unit: '%',
      isMandatory: true,
      pageReference: 9,
      sectionReference: '3. Definitions (d), footnote 6',
      provenanceQuote: 'Biomethane/renewable biogas (RBG) having methane content of more than 90% produced from biomethanation of organic waste/feedstock as per applicable statutory laws in India.',
      failureMessage: 'Produced CBG must maintain at least 90% methane purity in accordance with PNGRB standards.'
    },
    {
      id: 'wa03-003-cond-2',
      field: 'fom_fco_compliance',
      label: 'Fermented Organic Manure (FOM) Meets FCO Standard',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 9,
      sectionReference: '3. Definitions (i), footnote 7',
      provenanceQuote: 'Fermented Organic Manure (FOM) produced as a co-product shall comply with the specifications in the Fertilizer Control Order (FCO) 2025 Third Amendment.',
      failureMessage: 'Digestate coproduct must meet Fertilizer Control Order (FCO) standards for FOM/LFOM.'
    },
    {
      id: 'wa03-003-cond-3',
      field: 'no_venting_of_biogas',
      label: 'Prohibition of Uncontrolled Biogas Venting',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 6,
      sectionReference: '2.2, paragraph 11',
      provenanceQuote: 'The project activity shall not involve the venting of biogas into the atmosphere under normal operating conditions. An emergency flare system compliant with BM-T-004 must be installed.',
      failureMessage: 'Uncontrolled venting is prohibited; an enclosed flare system compliant with BM-T-004 is required.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'wa03-003-mon-1',
      parameter: 'Quantity of CBG produced and supplied to users/grid',
      parameterSymbol: 'QCBG,y',
      unit: 'tonnes or Nm3/year',
      frequency: 'CONTINUOUS',
      equipment: 'Calibrated Coriolis mass flow meter and gas chromatograph',
      standard: 'BM-T-005 / PNGRB technical standards',
      pageReference: 88,
      sectionReference: '5.2, Data Table 1',
      qaQcProcedure: 'Mass flow meter calibrated annually; daily crosscheck against commercial sales invoices.'
    },
    {
      id: 'wa03-003-mon-2',
      parameter: 'Biogas produced and methane concentration in raw biogas',
      parameterSymbol: 'VBG,y / wCH4,y',
      unit: 'Nm3 and % vol',
      frequency: 'CONTINUOUS',
      equipment: 'Ultrasonic flow meter and continuous NDIR gas analyzer',
      standard: 'BM-T-005',
      pageReference: 89,
      sectionReference: '5.2, Data Table 3'
    },
    {
      id: 'wa03-003-mon-3',
      parameter: 'Quantity and organic carbon content of FOM produced',
      parameterSymbol: 'MFOM,y / wC_FOM,y',
      unit: 'tonnes and %',
      frequency: 'BATCH_AND_MONTHLY_LAB',
      equipment: 'Weighbridge and NABL accredited laboratory elemental analyzer',
      standard: 'FCO 2025 protocol / Gold Standard SOC',
      pageReference: 92,
      sectionReference: '5.2, Data Table 12'
    }
  ],
  evidenceRequirements: [
    {
      id: 'wa03-003-ev-1',
      documentType: 'CBG_OFFTAKE_INVOICES',
      description: 'Commercial CBG offtake agreement, monthly PESO license copy, and retail dispensing / gas grid injection invoices',
      isMandatory: true,
      pageReference: 7,
      sectionReference: '2.2, paragraph 15',
      provenanceQuote: 'Project participants shall provide commercial sales invoices or pipeline injection certificates confirming the quantity of CBG sold.'
    },
    {
      id: 'wa03-003-ev-2',
      documentType: 'FEEDSTOCK_WEIGHBRIDGE_SLIPS',
      description: 'Daily weighbridge receipts, vehicle logs, and monthly feedstock analysis for agricultural residue / pressmud / organic waste',
      isMandatory: true,
      pageReference: 88,
      sectionReference: '5.2, Data Table 2',
      provenanceQuote: 'Daily weighbridge logs for all incoming solid waste, agro-waste, and biomass feedstocks.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'wa03-003-eq-1',
      name: 'Baseline Emissions for CBG Production',
      equationText: 'BE_y = BE_waste,y + BE_fossil_fuel,y + BE_FOM,y',
      equationNumber: 'Equation (1)',
      section: '4.3.1, paragraph 48',
      page: 17,
      description: 'Calculates total baseline emissions comprising avoided waste degradation methane (BE_waste,y), avoided fossil fuel use from CBG fuel substitution (BE_fossil_fuel,y), and soil organic carbon benefits from FOM (BE_FOM,y).',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline waste degradation emissions avoided',
          symbol: 'BE_waste,y',
          unit: 't CO2e/yr',
          description: 'Avoided methane emissions from baseline disposal of organic waste / manure / residues',
          source: 'Equation (2) / BM-T-011',
          isMonitored: false
        },
        {
          name: 'Baseline fossil fuel substitution emissions',
          symbol: 'BE_fossil_fuel,y',
          unit: 't CO2/yr',
          description: 'CO2 emissions avoided by substituting CNG/diesel/LPG with CBG (Q_CBG,y * NCV_CBG * EF_fossil)',
          source: 'Equation (18)',
          isMonitored: false
        },
        {
          name: 'Baseline synthetic fertilizer / soil carbon displacement emissions',
          symbol: 'BE_FOM,y',
          unit: 't CO2e/yr',
          description: 'Emissions avoided by using FOM organic manure in place of chemical fertilizers and SOC enhancement',
          source: 'Equation (28)',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    },
    {
      formulaId: 'wa03-003-eq-46',
      name: 'Emission Reductions from CBG Production',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (46)',
      section: '4.6, paragraph 94',
      page: 62,
      description: 'Net emission reductions achieved by the CBG production facility.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2e/yr',
          description: 'Total baseline emissions avoided',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Project electricity consumption, physical biogas leakage (1%), wastewater handling, and flare emissions',
          source: 'Equation (32)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions from biomass residue diversion and transportation',
          source: 'Section 4.5, paragraph 92',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
