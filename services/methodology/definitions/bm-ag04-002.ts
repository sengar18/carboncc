import { MethodologyVersion } from '../types';

export const BM_AG04_002: MethodologyVersion = {
  code: 'BM AG04.002',
  name: 'Emission reduction through improved management practices in rice cultivation',
  type: 'REAL_AUTHORITATIVE_METHODOLOGY',
  version: '1.0',
  sector: 'Agriculture / Sustainable Rice Cultivation',
  sectoralScopeCode: '04: Agriculture',
  publicationDate: '30 June 2026',
  effectiveDate: '30 June 2026',
  issuingAuthority: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India',
  referenceUnfcccCdm: ['AMS-III.AU (as valid from 28 November 2014)'],
  pageCount: 24,
  sourceUrl: 'https://beeindia.gov.in',
  sourceDocument: 'BM_AG04_002_Rice_Cultivation.pdf',
  documentHash: '7d4c1b58f4397971c05aa53e9fa00d0b7807b100774371cc6b5f1adcec51a407',
  retrievalDate: '2026-08-29',
  isActive: true,
  isSynthetic: false,
  verificationStatus: 'VERIFIED',
  description: 'Applies to project activities that reduce methane emissions from rice cultivation through improved water management practices (e.g. alternate wetting and drying - AWD) or switching from transplanted rice to direct seeded rice (DSR).',
  adoptedTools: [
    'BM-T-001: Combined tool to identify the baseline scenario and demonstrate additionality',
    'BM-T-002: Tool to calculate project or leakage CO2 emissions from fossil fuel combustion'
  ],
  externalDependencies: [
    {
      title: 'Detailed Procedure for Offset Mechanism under CCTS',
      exactWording: 'The applicable requirements specified in the Detailed Procedure for Offset Mechanism under CCTS (e.g. calibration requirements, sampling requirements) shall be taken into account',
      section: '5. Methodology: Monitoring Component, paragraph 39 & 43',
      page: 15,
      paragraph: '39',
      impact: 'Sampling and monitoring verification standards for farmer logbooks',
      isAvailable: false,
      verificationStatus: 'REFERENCED_EXTERNAL_OFFICIAL_DOCUMENT'
    },
    {
      title: '2019 Refinement to 2006 IPCC Guidelines (Rice Chapter 5.5)',
      exactWording: 'Chapter 5.5, Methane Emissions from Rice Cultivation, Volume 4 of the 2019 refinement to the 2006 IPCC Guidelines',
      section: '2. Definitions (d); 4.7.2, paragraph 30-34',
      page: 3,
      paragraph: '30',
      impact: 'Scaling factors for water regime (SFw), pre-season (SFp), and organic amendments (SFo)',
      isAvailable: true,
      verificationStatus: 'VERIFIED'
    }
  ],
  applicabilityConditions: [
    {
      id: 'ag04-002-cond-1',
      field: 'baseline_continuous_flooding',
      label: 'Baseline Continuous Flooding History',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 6(a)',
      provenanceQuote: 'The rice fields under the project activity have been continuously flooded for a minimum of three years prior to the start date of the project activity;',
      failureMessage: 'The rice fields must have a proven minimum 3-year history of continuous flooding.'
    },
    {
      id: 'ag04-002-cond-2',
      field: 'water_control_infrastructure',
      label: 'Adequate Irrigation & Drainage Infrastructure',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 6(b)',
      provenanceQuote: 'Farmers have adequate control over water management (irrigation and drainage) to implement AWD or DSR practices;',
      failureMessage: 'Fields must possess adequate irrigation and drainage infrastructure to ensure controlled drainage and reflooding.'
    },
    {
      id: 'ag04-002-cond-3',
      field: 'no_yield_reduction_breach',
      label: 'Yield Maintenance Compliance',
      operator: 'EQUALS',
      expectedValue: true,
      isMandatory: true,
      pageReference: 4,
      sectionReference: '2.2, paragraph 6(c)',
      provenanceQuote: 'The implementation of the project practice does not result in a significant drop in crop yield compared to baseline yield.',
      failureMessage: 'Project management practices must maintain equivalent crop yields.'
    }
  ],
  monitoringRequirements: [
    {
      id: 'ag04-002-mon-1',
      parameter: 'Cultivated rice field area by stratum',
      parameterSymbol: 'A_i,p,y',
      unit: 'hectares (ha)',
      frequency: 'PER_CROP_SEASON',
      equipment: 'GPS boundary surveys and high-resolution satellite imagery (Sentinel-2 / GIS)',
      standard: 'CCTS Sampling Standard',
      pageReference: 16,
      sectionReference: '5.2, Data Table 1',
      qaQcProcedure: 'Ground truth GPS coordinates cross-verified with cadastral land records.'
    },
    {
      id: 'ag04-002-mon-2',
      parameter: 'Water level and drainage event tracking (AWD field tubes)',
      parameterSymbol: 'WL_tube,i,p,t',
      unit: 'cm water depth / drying days',
      frequency: 'DAILY_TO_WEEKLY',
      equipment: 'Perforated field water tubes (pani pipe) with physical inspection logs / digital IoT sensors',
      standard: 'IRRI AWD protocol / CCTS Section 5',
      pageReference: 17,
      sectionReference: '5.2, Data Table 2'
    }
  ],
  evidenceRequirements: [
    {
      id: 'ag04-002-ev-1',
      documentType: 'FARMER_REGISTRY_AND_LOGS',
      description: 'Individual farmer registration sheets, land ownership / tenancy documents, and AWD water management logbooks',
      isMandatory: true,
      pageReference: 15,
      sectionReference: '5.1, paragraph 39',
      provenanceQuote: 'Project participants shall maintain a digital farm registry with parcel-level GIS polygons and farmer consent forms.'
    }
  ],
  calculationFormulas: [
    {
      formulaId: 'ag04-002-eq-1',
      name: 'Baseline Methane Emissions from Flooded Rice Fields',
      equationText: 'BE_y = sum_i( EF_BL,i * t_BL,i * A_i,y * 10^-3 ) * GWP_CH4',
      equationNumber: 'Equation (1)',
      section: '4.7.1, paragraph 27',
      page: 8,
      description: 'Baseline methane emissions calculated from baseline emission factors, cultivation period, and stratum area.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Global Warming Potential of Methane',
          symbol: 'GWP_CH4',
          unit: 't CO2e/t CH4',
          description: 'GWP of methane (28)',
          source: 'CCTS rule',
          isMonitored: false,
          defaultValue: 28
        },
        {
          name: 'Baseline daily emission factor',
          symbol: 'EF_BL,i',
          unit: 'kg CH4/ha/day',
          description: 'Baseline methane emission factor in stratum i (EF_c * SF_w,BL * SF_p * SF_o,BL)',
          source: '2019 IPCC Refinement / Equation (2)',
          isMonitored: false
        },
        {
          name: 'Length of cultivation period',
          symbol: 't_BL,i',
          unit: 'days',
          description: 'Number of days in the rice cultivation season in stratum i',
          source: 'Crop calendar monitoring',
          isMonitored: true
        },
        {
          name: 'Cultivated area',
          symbol: 'A_i,y',
          unit: 'ha',
          description: 'Cultivated rice field area in stratum i in project year y',
          source: 'GPS / GIS satellite survey',
          isMonitored: true
        }
      ]
    },
    {
      formulaId: 'ag04-002-eq-6',
      name: 'Emission Reductions from AWD / DSR in Rice Fields',
      equationText: 'ER_y = BE_y - PE_y - LE_y',
      equationNumber: 'Equation (6)',
      section: '4.7.4, paragraph 38',
      page: 14,
      description: 'Net emission reductions achieved by intermittent drainage and improved rice management.',
      outputUnit: 't CO2e/yr',
      requiredParameters: [
        {
          name: 'Baseline Emissions',
          symbol: 'BE_y',
          unit: 't CO2e/yr',
          description: 'Baseline flooded rice field methane emissions',
          source: 'Equation (1)',
          isMonitored: false
        },
        {
          name: 'Project Emissions',
          symbol: 'PE_y',
          unit: 't CO2e/yr',
          description: 'Project methane emissions under AWD plus incremental fossil fuel emissions for pumping and N2O adjustment',
          source: 'Equation (3)',
          isMonitored: false
        },
        {
          name: 'Leakage Emissions',
          symbol: 'LE_y',
          unit: 't CO2e/yr',
          description: 'Leakage emissions (0 under BM AG04.002)',
          source: 'Section 4.7.3, paragraph 37',
          isMonitored: false,
          defaultValue: 0
        }
      ]
    }
  ]
};
