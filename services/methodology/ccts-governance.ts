// ==============================================================================
// CARBONSCOUT INDIA — CCTS 2023 STATUTORY GOVERNANCE & FRAMEWORK INTELLIGENCE
// ==============================================================================
// Source: The Gazette of India Extraordinary S.O. 2825(E) (28 June 2023)
// & BEE Public Consultation Notice No. 45/02/NMEEE/Energy Efficiency/2024-CCTS

export interface CctsGovernanceFramework {
  legalBasis: {
    act: string;
    section: string;
    notificationNumber: string;
    notificationDate: string;
    amendmentNotificationNumber?: string;
    amendmentDate?: string;
  };
  coreUnit: {
    name: string;
    abbreviation: string;
    definition: string;
    equivalence: string;
  };
  regulatedGases: {
    gas: string;
    formula: string;
    statutoryCitation: string;
  }[];
  governanceInstitutions: {
    role: string;
    entityName: string;
    statutorySection: string;
    keyResponsibilities: string[];
  }[];
  marketStructure: {
    complianceMechanism: {
      statutorySection: string;
      coveredEntities: string;
      targetDeterminationAuthority: string;
      targetNotificationAuthority: string;
      targetMetric: string;
      surplusAction: string;
      deficitAction: string;
    };
    offsetMechanism: {
      statutorySection: string;
      sectorsPhase1Count: number;
      sectorsPhase2Count: number;
      approvedPhase1MethodologiesCount: number;
      detailedProcedureAuthority: string;
      issuanceBasis: string;
    };
  };
}

export const CCTS_GOVERNANCE_FRAMEWORK: CctsGovernanceFramework = {
  legalBasis: {
    act: 'Energy Conservation Act, 2001 (52 of 2001)',
    section: 'Section 14(w)',
    notificationNumber: 'S.O. 2825(E) (No. 2702)',
    notificationDate: '28 June 2023',
    amendmentNotificationNumber: 'S.O. 5369(E)',
    amendmentDate: '19 December 2023',
  },
  coreUnit: {
    name: 'Carbon Credit Certificate',
    abbreviation: 'CCC',
    definition: 'A value assigned to a reduction, removal, or avoidance of greenhouse gas emissions achieved.',
    equivalence: '1 Carbon Credit = 1 ton of carbon dioxide equivalent (1 tCO2e)',
  },
  regulatedGases: [
    { gas: 'Carbon Dioxide', formula: 'CO2', statutoryCitation: 'Section 2(1)(h)' },
    { gas: 'Methane', formula: 'CH4', statutoryCitation: 'Section 2(1)(h)' },
    { gas: 'Nitrous Oxide', formula: 'N2O', statutoryCitation: 'Section 2(1)(h)' },
    { gas: 'Hydrochlorofluorocarbons', formula: 'HCFCs', statutoryCitation: 'Section 2(1)(h)' },
    { gas: 'Hydrofluorocarbons', formula: 'HFCs', statutoryCitation: 'Section 2(1)(h)' },
    { gas: 'Perfluorocarbons', formula: 'PFCs', statutoryCitation: 'Section 2(1)(h)' },
    { gas: 'Sulfur Hexafluoride', formula: 'SF6', statutoryCitation: 'Section 2(1)(h)' },
  ],
  governanceInstitutions: [
    {
      role: 'Apex Governance & Oversight',
      entityName: 'National Steering Committee for Indian Carbon Market (NSC-ICM)',
      statutorySection: 'Section 3 & Section 4',
      keyResponsibilities: [
        'Direct oversight and governance of the Indian Carbon Market',
        'Co-chaired by Secretary (Power) and Secretary (MoEFCC)',
        'Formulate procedures, rules, and regulations for ICM operations',
        'Recommend emission targets for obligated entities',
        'Recommend issuance of Carbon Credit Certificates (CCCs)',
        'Formulate guidelines for trading of CCCs outside India',
      ],
    },
    {
      role: 'Administrator',
      entityName: 'Bureau of Energy Efficiency (BEE)',
      statutorySection: 'Section 5',
      keyResponsibilities: [
        'Administrator of the Indian Carbon Market',
        'Identify sectors and GHG reduction potential',
        'Develop compliance trajectories and targets',
        'Issue Carbon Credit Certificates upon NSC-ICM recommendation and Central Govt approval',
        'Develop market stability mechanisms for carbon credits',
        'Accredit and oversee Accredited Carbon Verification Agencies (ACVAs)',
        'Maintain secure IT infrastructure and user guidance platform',
      ],
    },
    {
      role: 'Registry & Meta-Registry',
      entityName: 'Grid Controller of India Limited (Grid-India)',
      statutorySection: 'Section 6',
      keyResponsibilities: [
        'Primary Registry and National Meta-Registry for India',
        'Register obligated and non-obligated entities',
        'Maintain secure transaction ledger and database of CCCs',
        'Share transaction records with Power Exchanges and BEE',
        'Establish linkages with approved national and international registries',
      ],
    },
    {
      role: 'Trading Market Regulator',
      entityName: 'Central Electricity Regulatory Commission (CERC)',
      statutorySection: 'Section 7 & Section 10',
      keyResponsibilities: [
        'Regulate trading activities of Carbon Credit Certificates',
        'Register Power Exchanges and approve trading bylaws and rules',
        'Safeguard interests of buyers and sellers',
        'Provide market surveillance and enforce anti-fraud measures',
      ],
    },
    {
      role: 'Verification Agency',
      entityName: 'Accredited Carbon Verification Agency (ACVA)',
      statutorySection: 'Section 2(1)(b) & Section 9',
      keyResponsibilities: [
        'Perform independent verification of GHG emission reductions and project baselines',
        'Accredited by BEE based on NSC-ICM eligibility criteria',
      ],
    },
  ],
  marketStructure: {
    complianceMechanism: {
      statutorySection: 'Section 11',
      coveredEntities: 'Obligated entities identified in designated high-emitting industrial sectors',
      targetDeterminationAuthority: 'Ministry of Power & BEE based on techno-economic sector studies',
      targetNotificationAuthority: 'Ministry of Environment, Forest and Climate Change (MoEFCC) under Environment (Protection) Act, 1986',
      targetMetric: 'GHG emission intensity (tCO2e per unit of equivalent product)',
      surplusAction: 'Issued Carbon Credit Certificates (CCCs) for exceeding reduction targets',
      deficitAction: 'Mandated to purchase CCCs from the Indian Carbon Market to meet shortfall',
    },
    offsetMechanism: {
      statutorySection: 'Section 12 & BEE Notice 45/02/NMEEE/2024-CCTS',
      sectorsPhase1Count: 6,
      sectorsPhase2Count: 4,
      approvedPhase1MethodologiesCount: 12,
      detailedProcedureAuthority: 'National Steering Committee for Indian Carbon Market (NSC-ICM)',
      issuanceBasis: 'Voluntary and non-obligated project activities implementing approved baseline and monitoring methodologies (BM series)',
    },
  },
};
