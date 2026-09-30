import React, { useState } from 'react';
import { CalculatedMetrics, FunnelInputs } from '../types/funnel';
import { CURRENCY_SYMBOLS } from '../config/constants';
import { calculateScenario, formatCurrency } from '../utils/calculations';
import { FlaskConical, ArrowRight, RefreshCw, BarChart3 } from 'lucide-react';

interface WhatIfLabProps {
  inputs: FunnelInputs;
  metrics: CalculatedMetrics;
}

export const WhatIfLab: React.FC<WhatIfLabProps> = ({ inputs, metrics }) => {
  const currencySymbol = CURRENCY_SYMBOLS[inputs.currency]?.symbol || '$';

  // Base actual percentages (default state)
  const actualOptInPct = metrics.optInRate * 100;
  const actualLeadClickPct = metrics.leadToEmailClickRate * 100;
  const actualClickSalePct = metrics.clickToSaleRate * 100;

  // Hypothetical controls
  const [simOptInPct, setSimOptInPct] = useState<number>(
    actualOptInPct > 0 ? Number(actualOptInPct.toFixed(1)) : 15
  );
  const [simLeadClickPct, setSimLeadClickPct] = useState<number>(
    actualLeadClickPct > 0 ? Number(actualLeadClickPct.toFixed(1)) : 20
  );
  const [simClickSalePct, setSimClickSalePct] = useState<number>(
    actualClickSalePct > 0 ? Number(actualClickSalePct.toFixed(1)) : 3
  );

  const resetToActual = () => {
    setSimOptInPct(actualOptInPct > 0 ? Number(actualOptInPct.toFixed(1)) : 15);
    setSimLeadClickPct(actualLeadClickPct > 0 ? Number(actualLeadClickPct.toFixed(1)) : 20);
    setSimClickSalePct(actualClickSalePct > 0 ? Number(actualClickSalePct.toFixed(1)) : 3);
  };

  // Calculate user hypothetical scenario
  const userSim = calculateScenario(
    inputs.visitors,
    simOptInPct,
    simLeadClickPct,
    simClickSalePct,
    inputs.commissionPerSale,
    metrics.totalCosts
  );

  // Pre-calculated side-by-side Leverage Scenarios:
  // Scenario A: Improve Landing Page only (boost opt-in by +50% relative or +5% absolute)
  const scenarioAOptIn = Math.min(100, Math.max(actualOptInPct * 1.5, actualOptInPct + 5));
  const scenA = calculateScenario(
    inputs.visitors,
    scenarioAOptIn,
    actualLeadClickPct,
    actualClickSalePct,
    inputs.commissionPerSale,
    metrics.totalCosts
  );

  // Scenario B: Improve Email only (boost click rate by +50% relative or +5% absolute)
  const scenarioBClick = Math.min(100, Math.max(actualLeadClickPct * 1.5, actualLeadClickPct + 5));
  const scenB = calculateScenario(
    inputs.visitors,
    actualOptInPct,
    scenarioBClick,
    actualClickSalePct,
    inputs.commissionPerSale,
    metrics.totalCosts
  );

  // Scenario C: Improve Offer Conversion only (boost conversion by +50% relative or +2% absolute)
  const scenarioCSale = Math.min(100, Math.max(actualClickSalePct * 1.5, actualClickSalePct + 2));
  const scenC = calculateScenario(
    inputs.visitors,
    actualOptInPct,
    actualLeadClickPct,
    scenarioCSale,
    inputs.commissionPerSale,
    metrics.totalCosts
  );

  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4A2F15]/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#F5BF1E]" />
            <span>ماذا لو أصلحت مرحلة واحدة؟ (What-If Lab)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
            محاكاة رياضية دقيقة لنتائج تحسين مرحلة واحدة <span className="text-[#F5BF1E] font-medium">«بافتراض ثبات باقي المراحل»</span>
          </p>
        </div>

        <button
          onClick={resetToActual}
          className="inline-flex items-center gap-1.5 text-xs text-[#C8C5BA] hover:text-[#F5BF1E] transition-colors px-3 py-1.5 rounded-lg border border-[#4A2F15] bg-[#040405] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>استرجاع المعدلات الفعلية</span>
        </button>
      </div>

      {/* Interactive Controls & Live Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders / Inputs */}
        <div className="space-y-5">
          <span className="text-xs font-bold text-[#F5BF1E] uppercase tracking-wider block">
            عدّل المعدل الافتراضي لكل مرحلة:
          </span>

          {/* Slider 1: Opt-in */}
          <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#FCFCFA]">
                معدل التسجيل في الهبوط (Opt-in Rate)
              </label>
              <span className="text-sm font-mono font-bold text-[#F5BF1E] tabular-nums">
                {simOptInPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="0.5"
              value={simOptInPct}
              onChange={(e) => setSimOptInPct(parseFloat(e.target.value))}
              className="w-full accent-[#F5BF1E] bg-[#23170D] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#797979] mt-1">
              <span>الفعلي: {metrics.optInRateFormatted}%</span>
              <span>المدى المقترح: 10% - 30%</span>
            </div>
          </div>

          {/* Slider 2: Lead to Click */}
          <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#FCFCFA]">
                نسبة التحويل لنقرة إيميل (Lead → Email Click)
              </label>
              <span className="text-sm font-mono font-bold text-[#F5BF1E] tabular-nums">
                {simLeadClickPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={simLeadClickPct}
              onChange={(e) => setSimLeadClickPct(parseFloat(e.target.value))}
              className="w-full accent-[#F5BF1E] bg-[#23170D] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#797979] mt-1">
              <span>الفعلي: {metrics.leadToEmailClickRateFormatted}%</span>
              <span>المدى المقترح: 10% - 25%</span>
            </div>
          </div>

          {/* Slider 3: Click to Sale */}
          <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#FCFCFA]">
                معدل تحويل العرض (Click → Sale Rate)
              </label>
              <span className="text-sm font-mono font-bold text-[#F5BF1E] tabular-nums">
                {simClickSalePct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.2"
              value={simClickSalePct}
              onChange={(e) => setSimClickSalePct(parseFloat(e.target.value))}
              className="w-full accent-[#F5BF1E] bg-[#23170D] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#797979] mt-1">
              <span>الفعلي: {metrics.clickToSaleRateFormatted}%</span>
              <span>المدى المقترح: 1% - 6%</span>
            </div>
          </div>
        </div>

        {/* Expected Hypothetical Output */}
        <div className="p-6 rounded-xl border border-[#F5BF1E]/50 bg-[#040405]/90 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5BF1E]/20 text-[#F5BF1E] text-xs font-bold mb-3">
              <span>سيناريو افتراضي (Hypothetical Projection)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#FCFCFA] mb-2">
              النتيجة المتوقعة لنفس عدد الزوار ({inputs.visitors.toLocaleString()} زائر)
            </h3>
            <p className="text-xs text-[#797979] mb-5">
              حسابات رياضية بحتة توضح أثر علاج نقاط التسريب على مبيعاتك وعائداتك
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg border border-[#4A2F15] bg-[#23170D]/40">
                <span className="text-[11px] text-[#797979] block">الـ Leads المتوقعة</span>
                <span className="text-lg font-mono font-bold text-[#FCFCFA] tabular-nums dir-ltr block mt-0.5">
                  {userSim.leads.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C8C5BA]">
                  (الفعلي: {inputs.optIns.toLocaleString()})
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#4A2F15] bg-[#23170D]/40">
                <span className="text-[11px] text-[#797979] block">النقرات المتوقعة</span>
                <span className="text-lg font-mono font-bold text-[#FCFCFA] tabular-nums dir-ltr block mt-0.5">
                  {userSim.clicks.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C8C5BA]">
                  (الفعلي: {inputs.emailClickers.toLocaleString()})
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#F5BF1E]/40 bg-[#23170D]/70">
                <span className="text-[11px] text-[#F5BF1E] font-bold block">المبيعات المتوقعة</span>
                <span className="text-xl font-mono font-black text-[#F5BF1E] tabular-nums dir-ltr block mt-0.5">
                  {userSim.sales.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C8C5BA]">
                  (الفعلي: {inputs.sales.toLocaleString()})
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#4A2F15] bg-[#23170D]/40">
                <span className="text-[11px] text-[#797979] block">إجمالي العمولات</span>
                <span className="text-lg font-mono font-bold text-[#FCFCFA] tabular-nums dir-ltr block mt-0.5">
                  {formatCurrency(userSim.grossCommission, currencySymbol)}
                </span>
                <span className="text-[10px] text-[#C8C5BA]">
                  (الفعلي: {formatCurrency(metrics.grossCommission, currencySymbol)})
                </span>
              </div>
            </div>

            {inputs.adSpend > 0 && (
              <div className="p-3 rounded-lg border border-[#4A2F15]/60 bg-[#23170D]/20 flex items-center justify-between text-xs">
                <span className="text-[#C8C5BA]">صافي الأرباح المتوقعة بعد التكاليف:</span>
                <span
                  className={`font-mono font-bold text-sm tabular-nums dir-ltr ${
                    userSim.netProfit < 0 ? 'text-[#C8C5BA]' : 'text-[#F5BF1E]'
                  }`}
                >
                  {formatCurrency(userSim.netProfit, currencySymbol)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#4A2F15]/50 text-[11px] text-[#797979]">
            * هذه ليست تنبؤات حتمية بالمستقبل، بل محاكاة رياضية لقوة الرافعة المالية (Leverage) في كل مرحلة.
          </div>
        </div>
      </div>

      {/* LEVERAGE COMPARISON: Side-by-side 3 Scenarios */}
      <div className="pt-6 border-t border-[#4A2F15]/60">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-[#F5BF1E]" />
          <h3 className="text-sm font-bold text-[#FCFCFA] uppercase tracking-wider">
            مقارنة الرافعة (Leverage Comparison): أين يقع التأثير الأكبر؟
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scenario A */}
          <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/70 hover:border-[#F5BF1E]/40 transition-colors">
            <span className="text-xs font-bold text-[#F5BF1E] block mb-1">
              السيناريو أ: تحسين صفحة التسجيل
            </span>
            <p className="text-xs text-[#797979] mb-3">
              رفع الـ Opt-in إلى {scenarioAOptIn.toFixed(1)}% مع ثبات باقي المراحل
            </p>
            <div className="space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#797979]">المبيعات:</span>
                <span className="font-bold text-[#FCFCFA]">{scenA.sales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797979]">العمولة:</span>
                <span className="font-bold text-[#FCFCFA]">
                  {formatCurrency(scenA.grossCommission, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797979]">الربح:</span>
                <span className="font-bold text-[#F5BF1E]">
                  {formatCurrency(scenA.netProfit, currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          {/* Scenario B */}
          <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/70 hover:border-[#F5BF1E]/40 transition-colors">
            <span className="text-xs font-bold text-[#F5BF1E] block mb-1">
              السيناريو ب: تحسين تفاعل الإيميل
            </span>
            <p className="text-xs text-[#797979] mb-3">
              رفع نقرات الإيميل إلى {scenarioBClick.toFixed(1)}% مع ثبات باقي المراحل
            </p>
            <div className="space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#797979]">المبيعات:</span>
                <span className="font-bold text-[#FCFCFA]">{scenB.sales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797979]">العمولة:</span>
                <span className="font-bold text-[#FCFCFA]">
                  {formatCurrency(scenB.grossCommission, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797979]">الربح:</span>
                <span className="font-bold text-[#F5BF1E]">
                  {formatCurrency(scenB.netProfit, currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          {/* Scenario C */}
          <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/70 hover:border-[#F5BF1E]/40 transition-colors">
            <span className="text-xs font-bold text-[#F5BF1E] block mb-1">
              السيناريو ج: تحسين تحويل العرض
            </span>
            <p className="text-xs text-[#797979] mb-3">
              رفع تحويل العرض إلى {scenarioCSale.toFixed(1)}% مع ثبات باقي المراحل
            </p>
            <div className="space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#797979]">المبيعات:</span>
                <span className="font-bold text-[#FCFCFA]">{scenC.sales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797979]">العمولة:</span>
                <span className="font-bold text-[#FCFCFA]">
                  {formatCurrency(scenC.grossCommission, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797979]">الربح:</span>
                <span className="font-bold text-[#F5BF1E]">
                  {formatCurrency(scenC.netProfit, currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
