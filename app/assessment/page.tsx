// ==============================================================================
// CARBONSCOUT INDIA — ENTERPRISE ASSESSMENT WIZARD & EVIDENCE ENGINE
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  FileText,
  ShieldCheck,
  ChevronRight,
  Layers,
  BarChart3,
  ExternalLink,
  Info,
  Globe,
  Printer,
  Cpu,
  TrendingUp,
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/provenance-badge';
import { WhyThisResultModal, ConclusionItem } from '@/components/why-this-result-modal';
import { Fact, ResearchSource, Question, Assessment } from '@/lib/db/schema';
import { PathwayScreeningResult } from '@/services/methodology/pathway-screener';

const SECTORS = [
  { id: 'Biomass Energy / Cogeneration', label: 'Biomass Energy / Cogeneration (BM EN01.003)', desc: 'Agricultural residue, husk, straw, pellet combustion for heat and power' },
  { id: 'Renewable Energy', label: 'Grid Renewable Energy (BM EN01.001)', desc: 'Grid-connected solar PV, wind, hydro, geothermal power' },
  { id: 'Hydrogen / Industrial Processing', label: 'Green Hydrogen from Electrolysis (BM EN01.002)', desc: 'Water electrolysis using renewable power displacing fossil hydrogen' },
  { id: 'Industries / Energy Efficiency', label: 'Industrial Energy Efficiency (BM IN02.001)', desc: 'Boilers, kilns, furnaces, motors, pumps, fuel switching' },
  { id: 'Hydrogen from Biogas', label: 'Biogas to Hydrogen Reforming (BM IN02.002)', desc: 'Methane extraction from biogas/effluent for hydrogen production' },
  { id: 'Dairy / Livestock', label: 'Livestock Manure Methane Recovery (BM AG04.001)', desc: 'Household & small-scale farm manure biodigesters' },
  { id: 'Agriculture', label: 'Sustainable Rice Cultivation (BM AG04.002)', desc: 'Alternate Wetting & Drying (AWD) / Direct Seeded Rice (DSR)' },
  { id: 'Waste Management', label: 'Landfill Methane Recovery (BM WA03.001)', desc: 'Methane capture and flaring/utilization at municipal solid waste dumps' },
  { id: 'Landfill Gas to Energy', label: 'Flaring or Use of Landfill Gas (BM WA03.002)', desc: 'LFG power generation, boiler heat, and pipeline supply' },
  { id: 'Compressed Biogas', label: 'Compressed Bio-gas CBG (BM WA03.003)', desc: 'Anaerobic biomethanation of organic waste/feedstocks into CBG and FOM' },
  { id: 'Mangrove / Blue Carbon', label: 'Mangrove Afforestation & Reforestation (BM FR05.001)', desc: 'Degraded tidal wetlands & intertidal zone blue carbon restoration' },
  { id: 'Forestry / Non-Wetland', label: 'Terrestrial Afforestation & Reforestation (BM FR05.002)', desc: 'Non-wetland wastelands, agroforestry, degraded forest lands' },
  { id: 'Other', label: 'Other Indian Enterprise (Negative Gate Check)', desc: 'Screening for sectors without Gazette-notified methodology' },
];

const INDIAN_STATES = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Madhya Pradesh',
  'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Rajasthan', 'Bihar',
  'West Bengal', 'Odisha', 'Chhattisgarh', 'Assam', 'Kerala', 'Uttarakhand', 'Jharkhand'
];

export default function AssessmentWizardPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [researchStage, setResearchStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [sector, setSector] = useState<string>('Biomass Energy / Cogeneration');
  const [businessName, setBusinessName] = useState<string>('Patiala Agro Processing Mills');
  const [website, setWebsite] = useState<string>('https://patiala-agro.example.in');
  const [locationState, setLocationState] = useState<string>('Punjab');
  const [locationDistrict, setLocationDistrict] = useState<string>('Patiala');
  const [annualProduction, setAnnualProduction] = useState<string>('38000');
  const [wasteFeedstock, setWasteFeedstock] = useState<string>('Rice husk & crop stubble');
  const [energySources, setEnergySources] = useState<string>('11kV State DISCOM Grid + Captive biomass boiler');
  const [existingCarbonProject, setExistingCarbonProject] = useState<string>('false');

  // Backend Pipeline Data
  const [projectId, setProjectId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [sources, setSources] = useState<ResearchSource[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({
    ANNUAL_BIOMASS_RESIDUE_MT: '6200',
    GRID_CONNECTED_OR_CAPTIVE: 'Yes - Grid Connected',
    PREEXISTING_CARBON_PROJECT: 'No existing carbon project',
    ANNUAL_GRID_ELECTRICITY_MWH: '2400',
    BIOMASS_FEEDSTOCK_QUANTITY_MT: '6200',
    NET_ELECTRICITY_GENERATION_MWH: '2400',
  });

  // Final Assessment Report
  const [completedAssessment, setCompletedAssessment] = useState<Assessment | null>(null);
  const [calculationRun, setCalculationRun] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [pathwayScreening, setPathwayScreening] = useState<PathwayScreeningResult | null>(null);

  // 'Why this result?' modal state
  const [selectedConclusion, setSelectedConclusion] = useState<ConclusionItem | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const handleOpenAudit = (item: ConclusionItem) => {
    setSelectedConclusion(item);
    setIsAuditModalOpen(true);
  };

  const getAuthHeaders = () => {
    const provider = localStorage.getItem('cs_llm_provider');
    const apiKey = localStorage.getItem('cs_llm_api_key');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (provider) headers['x-llm-provider'] = provider;
    if (apiKey) headers['x-custom-api-key'] = apiKey;
    return headers;
  };

  // Step 3: Trigger Real Research
  const handleRunResearch = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setResearchStage('1. Querying Web Sources via Firecrawl...');

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          companyName: businessName,
          website,
          sector,
          state: locationState,
          projectId: projectId || undefined,
          orgId: orgId || undefined,
        }),
      });

      setResearchStage('2. Extracting Structured Facts & Citations via AI...');

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Research execution failed');
      }

      const data = await res.json();
      setProjectId(data.projectId);
      setOrgId(data.orgId);
      setResearchSummary(data.summary);
      setSources(data.sources);
      setFacts(data.facts);

      setResearchStage('3. Initializing CCTS Assessment Framework...');

      const asmtRes = await fetch('/api/assessment', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          projectId: data.projectId,
          sector,
          userProvidedFacts: [
            {
              factType: 'REPORTED_FEEDSTOCK_TYPE',
              valueRaw: wasteFeedstock,
            },
            {
              factType: 'REPORTED_ANNUAL_PRODUCTION',
              valueRaw: annualProduction,
              valueNumeric: parseFloat(annualProduction) || undefined,
              unit: 'MT/year',
            },
            {
              factType: 'EXISTING_CARBON_PROJECT_REGISTRATION',
              valueRaw: existingCarbonProject === 'true' ? 'Active registered project' : 'None registered',
            },
            {
              factType: 'REPORTED_PRIMARY_ENERGY_SOURCES',
              valueRaw: energySources,
            },
          ],
        }),
      });

      if (!asmtRes.ok) {
        throw new Error('Failed to initialize assessment');
      }

      const asmtData = await asmtRes.json();
      setAssessmentId(asmtData.assessmentId);
      setQuestions(asmtData.questions);

      setCurrentStep(4);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred during research.');
    } finally {
      setIsLoading(false);
      setResearchStage('');
    }
  };

  // Step 8: Trigger Assessment Calculations & Report
  const handleRunAssessment = async () => {
    if (!assessmentId) return;
    setIsLoading(true);
    setErrorMessage(null);
    setResearchStage('1. Matching Official BEE CCTS Methodology...');

    try {
      const res = await fetch(`/api/assessment/${assessmentId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          answers: questionAnswers,
        }),
      });

      setResearchStage('2. Executing Deterministic Calculation Engine...');

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to complete assessment');
      }

      const data = await res.json();
      setCompletedAssessment(data.assessment);
      setCalculationRun(data.calculationRun);
      setReport(data.report);
      setPathwayScreening(data.pathwayScreening);

      setCurrentStep(9);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Assessment calculation error');
    } finally {
      setIsLoading(false);
      setResearchStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header & Step Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Step {currentStep} of 9
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {currentStep === 1 && 'Select Project Sector'}
              {currentStep === 2 && 'Enterprise & Facility Profile'}
              {currentStep === 3 && 'Automated Web Evidence Research'}
              {currentStep === 4 && 'Discovered Facts & Provenance'}
              {currentStep === 5 && 'Official CCTS Methodology Fit'}
              {currentStep === 6 && 'Data Gaps & Missing Information'}
              {currentStep === 7 && 'Clarifying Questions'}
              {currentStep === 8 && 'Deterministic Assessment Execution'}
              {currentStep === 9 && 'Preliminary Opportunity Report'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {Math.round((currentStep / 9) * 100)}% Complete
            </span>
            <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Indicator Badges (Desktop) */}
        <div className="hidden sm:flex items-center justify-between text-xs font-medium border-t border-slate-100 pt-3">
          {[
            'Sector', 'Profile', 'Research', 'Facts',
            'Screening', 'Gaps', 'Questions', 'Execute', 'Report'
          ].map((title, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <div
                key={title}
                className={`flex items-center gap-1.5 ${
                  isCurrent ? 'text-emerald-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-emerald-700 text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </span>
                <span>{title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">{errorMessage}</div>
        </div>
      )}

      {/* STEP 1: SECTOR SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Choose the enterprise activity scope</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select the activity that best matches your facility. All options map directly to official BEE Gazette-notified methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSector(s.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  sector === s.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{s.label}</span>
                  {sector === s.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
            >
              <span>Continue to Project Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BUSINESS / PROJECT INFO */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Facility & Operating Baseline</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter verifiable facility parameters. These will be corroborated against public filings and satellite evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Facility Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g. Patiala Agro Processing Mills"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Website (Optional)</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="https://patiala-agro.example.in"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State in India *</label>
              <select
                value={locationState}
                onChange={(e) => setLocationState(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District (Optional)</label>
              <input
                type="text"
                value={locationDistrict}
                onChange={(e) => setLocationDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g. Patiala"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Processing / Output (MT/year)</label>
              <input
                type="number"
                value={annualProduction}
                onChange={(e) => setAnnualProduction(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g. 38000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Waste / Byproduct Feedstock</label>
              <input
                type="text"
                value={wasteFeedstock}
                onChange={(e) => setWasteFeedstock(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g. Rice husk, crop stubble"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Energy Baseline</label>
              <input
                type="text"
                value={energySources}
                onChange={(e) => setEnergySources(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g. 11kV State DISCOM Grid + Captive boiler"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prior Carbon Credit Registration</label>
              <select
                value={existingCarbonProject}
                onChange={(e) => setExistingCarbonProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="false">No — Zero active carbon registrations (Demonstrates additionality)</option>
                <option value="true">Yes — Currently registered with Verra / Gold Standard / GCC</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
            >
              <span>Proceed to Evidence Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RUN RESEARCH (LIVE UX) */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-6 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Execute Automated Web Evidence Discovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Firecrawl will search authoritative sources to extract verifiable facts, energy baselines, and citations.
            </p>
          </div>

          {isLoading ? (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-3">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-emerald-600 border-t-transparent" />
              <div className="text-xs font-mono font-bold text-emerald-800">{researchStage}</div>
              <p className="text-[11px] text-slate-500">Extracting verified records with cryptographic content hashing...</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono">
              <div><span className="text-slate-500">Company:</span> <span className="font-semibold text-slate-800">{businessName}</span></div>
              <div><span className="text-slate-500">Sector:</span> <span className="text-slate-800">{sector}</span></div>
              <div><span className="text-slate-500">State:</span> <span className="text-slate-800">{locationState}</span></div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Edit Inputs
            </button>

            <button
              onClick={handleRunResearch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition disabled:opacity-50 shadow-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Discovering Evidence...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Execute Automated Research</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FACTS AND SOURCES */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Extracted Facts & Provenance Traceability</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Each fact is classified to prevent unverified inferences from masquerading as authoritative records.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              {facts.length} Facts Discovered
            </span>
          </div>

          {/* Sources Section */}
          {sources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Discovered Sources</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sources.map((src) => (
                  <div key={src.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <div className="font-bold text-slate-800 truncate">{src.title || src.url}</div>
                    <div className="text-slate-500 font-mono text-[10px] truncate">{src.url}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facts Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fact Table</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold">
                  <tr>
                    <th className="px-3.5 py-2.5 text-left">Fact Identifier</th>
                    <th className="px-3.5 py-2.5 text-left">Extracted Value</th>
                    <th className="px-3.5 py-2.5 text-left">Provenance Status</th>
                    <th className="px-3.5 py-2.5 text-left">Citation / Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {facts.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-mono text-[11px] font-bold text-slate-900">
                        {f.fact_type}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-800 font-semibold">
                        {f.value_raw} {f.unit || ''}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <ProvenanceBadge status={f.status} confidence={f.confidence} />
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-500 max-w-xs truncate">
                        {f.source_citation || 'Direct user input'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Re-run Research
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
            >
              <span>Methodology Screening</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: METHODOLOGY SCREENING */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Official CCTS Methodology Screening</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  BEE_CCTS_STANDARDS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Evaluated against Gazette-notified Indian Carbon Market standards for <strong>{sector}</strong>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Applicability Conditions</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Sector Match:</span> Activity aligns with {sector}
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Additionality Baseline:</span> Connected to regional grid; fossil fuel displacement pathway eligible.
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Back to Facts
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
            >
              <span>View Data Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: DATA GAPS */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Missing Information & Data Gaps</h3>
            <p className="text-xs text-slate-500 mt-1">
              To produce a deterministic opportunity score, the following parameters must be clarified.
            </p>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Gap #{idx + 1}: {q.question_key}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Required for Calculation
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{q.question_text}</p>
                <p className="text-[11px] text-slate-500">{q.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Back to Screening
            </button>
            <button
              onClick={() => setCurrentStep(7)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
            >
              <span>Answer Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: ANSWER QUESTIONS */}
      {currentStep === 7 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Provide Operational Parameter Values</h3>
            <p className="text-xs text-slate-500 mt-1">
              Responses will be recorded with <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">USER_PROVIDED</code> provenance status.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="space-y-1.5 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-800">
                  {q.question_text}
                </label>
                <p className="text-[11px] text-slate-500 mb-2">{q.explanation}</p>

                {q.options && q.options.length > 0 ? (
                  <select
                    value={questionAnswers[q.question_key] || q.options[0]}
                    onChange={(e) =>
                      setQuestionAnswers({
                        ...questionAnswers,
                        [q.question_key]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type={q.input_type === 'NUMBER' ? 'number' : 'text'}
                      value={questionAnswers[q.question_key] || ''}
                      onChange={(e) =>
                        setQuestionAnswers({
                          ...questionAnswers,
                          [q.question_key]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                      placeholder="Enter value"
                    />
                    {q.suggested_unit && (
                      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                        {q.suggested_unit}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(6)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(8)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
            >
              <span>Ready for Assessment Run</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: RUN ASSESSMENT */}
      {currentStep === 8 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <BarChart3 className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Execute Preliminary Opportunity Assessment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Triggers the deterministic calculation engine matching official BEE Gazette equations and evaluates multi-attribute environmental pathways.
            </p>
          </div>

          {isLoading && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-2">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent" />
              <div className="text-xs font-mono font-bold text-emerald-800">{researchStage}</div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentStep(7)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Edit Responses
            </button>

            <button
              onClick={handleRunAssessment}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition disabled:opacity-50 shadow-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calculating Deterministic Result...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span>Generate Preliminary Assessment Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: PRELIMINARY REPORT */}
      {currentStep === 9 && completedAssessment && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header Score Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Preliminary Opportunity Assessment Dossier
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{businessName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sector: {sector} • Location: {locationState}, India • ID: <code className="text-slate-700 font-mono">{completedAssessment.id}</code>
                </p>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 min-w-[160px]">
                <span className="text-xs font-semibold text-slate-500">Opportunity Score</span>
                <div className="text-3xl font-black text-emerald-700">
                  {completedAssessment.opportunity_score} <span className="text-base font-bold text-slate-400">/ 100</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mt-1 inline-block">
                  {completedAssessment.score_category.replace(/_/g, ' ')}
                </span>
                <button
                  onClick={() =>
                    handleOpenAudit({
                      id: 'score-audit',
                      title: '100-Point Opportunity Score Audit',
                      conclusionValue: `${completedAssessment.opportunity_score}/100 (${completedAssessment.score_category.replace(/_/g, ' ')})`,
                      category: 'OPPORTUNITY_SCORE',
                      reasoningType: 'DETERMINISTIC_MATH',
                      supportingFacts: facts,
                      sources: sources,
                      explanation:
                        'Computed via deterministic scoring engine across 7 dimensions (Sector Eligibility, Scale, Additionality, Verified Facts, Feasibility, Documentation, Commercial).',
                      confidence: 0.95,
                    })
                  }
                  className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 underline mt-1 inline-flex items-center gap-0.5"
                >
                  <HelpCircle className="w-2.5 h-2.5" />
                  <span>Why this score?</span>
                </button>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 leading-relaxed">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Preliminary Intelligence Notice:</span> Preliminary opportunity score — not a prediction or guarantee of carbon-credit issuance, registration, or revenue.
              </div>
            </div>

            {/* Executive Summary & Methodology Match */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">CCTS Methodology Alignment</h4>
                <button
                  onClick={() =>
                    handleOpenAudit({
                      id: 'methodology-audit',
                      title: 'CCTS Methodology Match Rationale',
                      conclusionValue: completedAssessment.applicability_summary,
                      category: 'METHODOLOGY_MATCH',
                      reasoningType: 'AI_STRUCTURED_REASONING',
                      methodologyCode: completedAssessment.methodology_id?.replace('meth-', '').toUpperCase() || 'OFFICIAL CCTS STANDARD',
                      supportingFacts: facts,
                      sources: sources,
                      explanation: completedAssessment.applicability_summary,
                      confidence: 0.92,
                    })
                  }
                  className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why this match?</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {completedAssessment.applicability_summary}
              </p>
            </div>

            {/* 100-Point Score Breakdown Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                100-Point Framework Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {completedAssessment.score_breakdown &&
                  Object.entries(completedAssessment.score_breakdown).map(([key, item]: [string, any]) => (
                    <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {item.score} / {item.max}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600"
                          style={{ width: `${(item.score / item.max) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{item.rationale}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Deterministic Calculation Output */}
            {calculationRun && calculationRun.outputs_snapshot && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Deterministic Abatement Calculation
                  </h4>
                  <button
                    onClick={() =>
                      handleOpenAudit({
                        id: 'calc-audit',
                        title: 'Deterministic Abatement Equation Audit',
                        conclusionValue: `${calculationRun.outputs_snapshot.estimatedAnnualAbatement_tCO2e?.toLocaleString()} tCO2e/year`,
                        category: 'DETERMINISTIC_CALCULATION',
                        reasoningType: 'DETERMINISTIC_MATH',
                        formulaReference: calculationRun.formula_id,
                        supportingFacts: facts,
                        sources: sources,
                        explanation: calculationRun.calculation_explanation || 'Deterministic calculation according to CCTS baseline methodology.',
                        confidence: 0.98,
                      })
                    }
                    className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Why this calculation?</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2">
                  <div className="text-emerald-400 font-bold">
                    Estimated Net Annual Abatement: {calculationRun.outputs_snapshot.estimatedAnnualAbatement_tCO2e?.toLocaleString()} tCO2e / year
                  </div>
                  <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">
                    {calculationRun.calculation_explanation}
                  </pre>
                </div>
              </div>
            )}

            {/* Regulatory Grounding & Audit Trail */}
            {calculationRun && calculationRun.provenance_citations && calculationRun.provenance_citations.length > 0 && (
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Regulatory Grounding & Audit Trail
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Source Verified
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {calculationRun.provenance_citations.map((cite: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{cite.issuingAuthority}</span>
                          <h5 className="text-xs font-bold text-slate-900 mt-0.5">{cite.documentTitle}</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold shrink-0 bg-slate-100 text-slate-700 border border-slate-200">
                          {cite.documentCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                        {cite.equationNumber || cite.section || (cite.page ? `Page ${cite.page}` : '')}
                      </p>
                      {cite.sourceHash && (
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="text-[9px] text-slate-400 font-mono truncate" title={cite.sourceHash}>
                            SHA-256: {cite.sourceHash}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Environmental Pathway Screening (Phase 9) */}
            {pathwayScreening && pathwayScreening.pathways && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Environmental Attribute Pathway Screening
                  </h4>
                  <span className="text-[10px] text-slate-500 italic">Indicative multi-attribute screening</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pathwayScreening.pathways.map((p) => (
                    <div
                      key={p.pathwayId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{p.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            p.status === 'HIGH_APPLICABILITY'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{p.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
              <Link
                href={`/assessment/${completedAssessment.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Open Full Standalone Report Dossier</span>
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/admin"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Admin CRM</span>
                </Link>

                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setCompletedAssessment(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  New Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive 'Why This Result?' Modal */}
      <WhyThisResultModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        conclusion={selectedConclusion}
      />
    </div>
  );
}
