import React, { useState, useMemo, useRef } from 'react';
import {
  CurrencyCode,
  DataPeriod,
  FunnelInputs,
  TargetRates,
  TrafficSource,
  DiagnosisResult,
} from './types/funnel';
import { BRAND_CONFIG, DEMO_PRESETS } from './config/constants';
import { calculateFunnelMetrics } from './utils/calculations';
import { runDiagnosticEngine } from './utils/diagnosticEngine';

import { Hero } from './components/Hero';
import { FunnelDataForm } from './components/FunnelDataForm';
import { FunnelVisualizer } from './components/FunnelVisualizer';
import { DataQualityCheck } from './components/DataQualityCheck';
import { PrimaryBottleneck } from './components/PrimaryBottleneck';
import { FixFirstPanel } from './components/FixFirstPanel';
import { DoNotChangePanel } from './components/DoNotChangePanel';
import { DiagnosisSummary } from './components/DiagnosisSummary';
import { StageDiagnosis } from './components/StageDiagnosis';
import { WhatIfLab } from './components/WhatIfLab';
import { ReverseGoalPlanner } from './components/ReverseGoalPlanner';
import { SevenDayPrescription } from './components/SevenDayPrescription';
import { TrackingChecklist } from './components/TrackingChecklist';
import { ShareReport } from './components/ShareReport';
import { MiniCourseCTA } from './components/MiniCourseCTA';
import { Disclaimer } from './components/Disclaimer';
import { Footer } from './components/Footer';

import { Stethoscope, ArrowDown, Sparkles } from 'lucide-react';

export default function App() {
  // Primary Funnel Inputs State
  const [inputs, setInputs] = useState<FunnelInputs>({
    period: 'last30',
    trafficSource: 'Meta Ads',
    visitors: 10000,
    optIns: 1200,
    emailClickers: 240,
    sales: 12,
    emailsDelivered: 1150,
    commissionPerSale: 60,
    adSpend: 450,
    otherCosts: 50,
    currency: 'USD',
  });

  // Target Rates State
  const [targetRates, setTargetRates] = useState<TargetRates>({
    enabled: true,
    targetOptInRate: 20,
    targetLeadToClickRate: 20,
    targetClickToSaleRate: 5,
  });

  // AI Integration state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiEnhancedData, setAiEnhancedData] = useState<Partial<DiagnosisResult> | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // References for scrolling
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Deterministic calculations
  const metrics = useMemo(() => calculateFunnelMetrics(inputs), [inputs]);

  // Deterministic diagnosis engine
  const baseDiagnosis = useMemo(
    () => runDiagnosticEngine(inputs, metrics, targetRates),
    [inputs, metrics, targetRates]
  );

  // Merged diagnosis (incorporating server-side Gemini insights if fetched)
  const diagnosis = useMemo(() => {
    if (!aiEnhancedData) return baseDiagnosis;
    return {
      ...baseDiagnosis,
      ...aiEnhancedData,
      isAiEnhanced: true,
    };
  }, [baseDiagnosis, aiEnhancedData]);

  // Handlers
  const handleUpdateInputs = (partial: Partial<FunnelInputs>) => {
    setInputs((prev) => ({ ...prev, ...partial }));
    setAiEnhancedData(null); // Reset AI enhancement on data change
  };

  const handleUpdateTargets = (partial: Partial<TargetRates>) => {
    setTargetRates((prev) => ({ ...prev, ...partial }));
    setAiEnhancedData(null);
  };

  const handleReset = () => {
    setInputs({
      period: 'last30',
      trafficSource: 'Mixed Traffic',
      visitors: 0,
      optIns: 0,
      emailClickers: 0,
      sales: 0,
      emailsDelivered: undefined,
      commissionPerSale: 0,
      adSpend: 0,
      otherCosts: 0,
      currency: 'USD',
    });
    setTargetRates({
      enabled: false,
      targetOptInRate: 0,
      targetLeadToClickRate: 0,
      targetClickToSaleRate: 0,
    });
    setAiEnhancedData(null);
    setAiNotice(null);
  };

  const handleLoadPreset = (presetInputs: FunnelInputs, presetTargets: TargetRates) => {
    setInputs(presetInputs);
    setTargetRates(presetTargets);
    setAiEnhancedData(null);
    setAiNotice(null);
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartDiagnosis = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRunDiagnosis = () => {
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Call Server-Side Gemini API (gemini-3.8-flash)
  const handleTriggerAiDiagnosis = async () => {
    setIsAiLoading(true);
    setAiNotice(null);

    try {
      const response = await fetch('/api/diagnose-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnelData: inputs,
          calculatedMetrics: metrics,
          diagnosisMode: targetRates.enabled ? 'Mode A (Target-based)' : 'Mode B (Evidence-aware)',
          targetRates: targetRates.enabled ? targetRates : null,
          trafficSource: inputs.trafficSource,
          dataPeriod: inputs.period,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error or is offline');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setAiEnhancedData({
        primaryStageTitleAr: data.primaryInvestigationStage || diagnosis.primaryStageTitleAr,
        primaryReason: data.reason || diagnosis.primaryReason,
        whatNumbersSay: data.whatNumbersSay || diagnosis.whatNumbersSay,
        whatNumbersDoNotSay: data.whatNumbersDoNotSay || diagnosis.whatNumbersDoNotSay,
        possibleCauses: data.possibleCauses || diagnosis.possibleCauses,
        fixFirst: data.fixFirst || diagnosis.fixFirst,
        doNotChangeYet: data.doNotChangeYet || diagnosis.doNotChangeYet,
        trafficDiagnosis: data.trafficDiagnosis || diagnosis.trafficDiagnosis,
        landingPageDiagnosis: data.landingPageDiagnosis || diagnosis.landingPageDiagnosis,
        emailDiagnosis: data.emailDiagnosis || diagnosis.emailDiagnosis,
        offerDiagnosis: data.offerDiagnosis || diagnosis.offerDiagnosis,
        economicsDiagnosis: data.economicsDiagnosis || diagnosis.economicsDiagnosis,
        sevenDayPlan: data.sevenDayPlan || diagnosis.sevenDayPlan,
      });

      setAiNotice('تم تدعيم التشخيص بالتحليل اللغوي والتنفيذي بواسطة Gemini 3.8 Flash بنجاح.');
    } catch (err: any) {
      console.warn('AI enhancement fallback:', err);
      setAiNotice('تم الاعتماد على محرك التشخيص الرياضي المباشر فائق الدقة.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040405] text-[#FCFCFA] selection:bg-[#F5BF1E] selection:text-[#040405]">
      {/* TOP BAR CONTRACT: Brand title — 4-6 links — 1-2 actions */}
      <header className="sticky top-0 z-50 bg-[#040405]/95 backdrop-blur-md border-b border-[#23170D] px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <a
            href="/"
            className="text-base sm:text-lg font-black tracking-tight text-[#FCFCFA] flex items-center gap-2 hover:text-[#F5BF1E] transition-colors shrink-0"
          >
            <Stethoscope className="w-5 h-5 text-[#F5BF1E]" />
            <span>{BRAND_CONFIG.appNameAr}</span>
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#C8C5BA]">
            <a
              href="#inputs"
              onClick={(e) => {
                e.preventDefault();
                inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#F5BF1E] transition-colors"
            >
              إدخال الأرقام
            </a>
            <a
              href="#funnel-map"
              onClick={(e) => {
                e.preventDefault();
                resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#F5BF1E] transition-colors"
            >
              خريطة الفانل
            </a>
            <a
              href="#diagnosis"
              onClick={(e) => {
                e.preventDefault();
                resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#F5BF1E] transition-colors"
            >
              التشخيص والأولويات
            </a>
            <a
              href="#what-if"
              className="hover:text-[#F5BF1E] transition-colors"
            >
              مختبر ماذا لو (What-If)
            </a>
            <a
              href="#prescription"
              className="hover:text-[#F5BF1E] transition-colors"
            >
              خطة 7 أيام
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartDiagnosis}
              className="px-4 py-2 text-xs font-bold text-[#040405] bg-[#F5BF1E] hover:bg-[#FBD052] rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer shadow-md"
            >
              شخّص الفانل
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <Hero
        onStartDiagnosis={handleStartDiagnosis}
        onLoadPreset={handleLoadPreset}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* SECTION 2, 3, 4, 5: INPUT FORM & LIVE MAP (DESKTOP DUAL VIEW) */}
        <div id="inputs" ref={inputSectionRef} className="scroll-mt-24 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (Inputs) */}
            <div className="lg:col-span-6 space-y-6">
              <FunnelDataForm
                inputs={inputs}
                targetRates={targetRates}
                onChangeInputs={handleUpdateInputs}
                onChangeTargets={handleUpdateTargets}
                onRunDiagnosis={handleRunDiagnosis}
                onReset={handleReset}
              />
            </div>

            {/* Right Column (Live Funnel Health Map) */}
            <div id="funnel-map" className="lg:col-span-6 space-y-6">
              <FunnelVisualizer
                inputs={inputs}
                metrics={metrics}
                primaryStage={diagnosis.primaryBottleneckStage}
                targetOptIn={targetRates.enabled ? targetRates.targetOptInRate : undefined}
                targetLeadToClick={targetRates.enabled ? targetRates.targetLeadToClickRate : undefined}
                targetClickToSale={targetRates.enabled ? targetRates.targetClickToSaleRate : undefined}
              />
            </div>
          </div>
        </div>

        {/* RESULTS & DIAGNOSTIC DEEP DIVE SECTION */}
        <div id="diagnosis" ref={resultsSectionRef} className="scroll-mt-24 space-y-12">
          {/* Tracking Quality Checks */}
          <DataQualityCheck warnings={diagnosis.trackingWarnings} />

          {/* AI Feedback Banner if enabled */}
          {aiNotice && (
            <div className="p-3.5 rounded-xl border border-[#F5BF1E]/40 bg-[#23170D]/80 text-xs text-[#FCFCFA] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5BF1E] shrink-0" />
              <span>{aiNotice}</span>
            </div>
          )}

          {/* PRIMARY BOTTLENECK RESULT: "ابدأ من هنا" */}
          <PrimaryBottleneck
            diagnosis={diagnosis}
            onTriggerAiDiagnosis={handleTriggerAiDiagnosis}
            isAiLoading={isAiLoading}
          />

          {/* FIX FIRST vs DO NOT CHANGE YET */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FixFirstPanel fixFirst={diagnosis.fixFirst} />
            <DoNotChangePanel doNotChangeYet={diagnosis.doNotChangeYet} />
          </div>

          {/* DIAGNOSIS SUMMARY: What Numbers Say vs Don't Say */}
          <DiagnosisSummary
            whatNumbersSay={diagnosis.whatNumbersSay}
            whatNumbersDoNotSay={diagnosis.whatNumbersDoNotSay}
            possibleCauses={diagnosis.possibleCauses}
          />

          {/* STAGE BY STAGE QUALITATIVE DIAGNOSIS */}
          <StageDiagnosis diagnosis={diagnosis} />

          {/* WHAT-IF LAB & LEVERAGE SCENARIOS */}
          <div id="what-if" className="scroll-mt-24">
            <WhatIfLab inputs={inputs} metrics={metrics} />
          </div>

          {/* REVERSE GOAL PLANNER */}
          <ReverseGoalPlanner metrics={metrics} />

          {/* 7-DAY PRESCRIPTION PLAN */}
          <div id="prescription" className="scroll-mt-24">
            <SevenDayPrescription
              plan={diagnosis.sevenDayPlan}
              stageNameAr={diagnosis.primaryStageTitleAr}
            />
          </div>

          {/* TRACKING AUDIT CHECKLIST */}
          <TrackingChecklist />

          {/* SCREENSHOT & SHARING CARD */}
          <ShareReport
            inputs={inputs}
            metrics={metrics}
            diagnosis={diagnosis}
          />

          {/* MINI COURSE BRIDGE (R.B.T.L.S Framework) */}
          <MiniCourseCTA />

          {/* PROFESSIONAL DISCLAIMER */}
          <Disclaimer />
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
