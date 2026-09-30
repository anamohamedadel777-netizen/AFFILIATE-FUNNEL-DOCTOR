import React from 'react';
import {
  CurrencyCode,
  DataPeriod,
  FunnelInputs,
  TargetRates,
  TrafficSource,
} from '../types/funnel';
import {
  CURRENCY_SYMBOLS,
  DATA_PERIODS,
  TRAFFIC_SOURCES,
} from '../config/constants';
import {
  SlidersHorizontal,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface FunnelDataFormProps {
  inputs: FunnelInputs;
  targetRates: TargetRates;
  onChangeInputs: (newInputs: Partial<FunnelInputs>) => void;
  onChangeTargets: (newTargets: Partial<TargetRates>) => void;
  onRunDiagnosis: () => void;
  onReset: () => void;
}

export const FunnelDataForm: React.FC<FunnelDataFormProps> = ({
  inputs,
  targetRates,
  onChangeInputs,
  onChangeTargets,
  onRunDiagnosis,
  onReset,
}) => {
  const currencySymbol = CURRENCY_SYMBOLS[inputs.currency]?.symbol || '$';

  const handleNumberInput = (field: keyof FunnelInputs, rawValue: string) => {
    const sanitized = rawValue.replace(/[^0-9.]/g, '');
    const num = sanitized === '' ? 0 : parseFloat(sanitized);
    onChangeInputs({ [field]: isNaN(num) ? 0 : Math.max(0, num) });
  };

  const handleTargetInput = (field: keyof TargetRates, rawValue: string) => {
    const sanitized = rawValue.replace(/[^0-9.]/g, '');
    const num = sanitized === '' ? 0 : parseFloat(sanitized);
    onChangeTargets({ [field]: isNaN(num) ? 0 : Math.max(0, Math.min(100, num)) });
  };

  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#4A2F15]/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF1E]" />
            <span>بيانات الفانل الفعليّة</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-1">
            أدخل الأرقام التي تم رصدها من أدوات التتبع بدون تجميل أو تخمين
          </p>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-[#C8C5BA] hover:text-[#F5BF1E] transition-colors px-3 py-1.5 rounded-lg border border-[#4A2F15]/50 bg-[#040405] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>شخّص Funnel جديد</span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onRunDiagnosis();
        }}
        className="space-y-8"
      >
        {/* SECTION 2 & 3: Period & Traffic Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Data Period */}
          <div>
            <label className="block text-xs font-semibold text-[#C8C5BA] mb-2">
              الأرقام دي تخص أنهي فترة؟ <span className="text-[#797979] font-normal">(للسياق)</span>
            </label>
            <select
              value={inputs.period}
              onChange={(e) => onChangeInputs({ period: e.target.value as DataPeriod })}
              className="w-full bg-[#040405] border border-[#4A2F15] rounded-xl px-4 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] transition-colors cursor-pointer"
            >
              {DATA_PERIODS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#040405] text-[#FCFCFA]">
                  {p.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Traffic Source */}
          <div>
            <label className="block text-xs font-semibold text-[#C8C5BA] mb-2">
              الترافيك الأساسي جاي منين؟ <span className="text-[#797979] font-normal">(للسياق)</span>
            </label>
            <select
              value={inputs.trafficSource}
              onChange={(e) => onChangeInputs({ trafficSource: e.target.value as TrafficSource })}
              className="w-full bg-[#040405] border border-[#4A2F15] rounded-xl px-4 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] transition-colors cursor-pointer"
            >
              {TRAFFIC_SOURCES.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#040405] text-[#FCFCFA]">
                  {s.labelAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CORE FUNNEL INPUTS (The 4 Critical Metrics) */}
        <div>
          <h3 className="text-sm font-bold text-[#F5BF1E] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>مراحل التدفق الأساسية (Core Funnel Stages)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Input 1: Visitors */}
            <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80 focus-within:border-[#F5BF1E] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#FCFCFA]">
                  1. Visitors (زائر)
                </label>
                <span className="text-[10px] text-[#797979]">مطلوب</span>
              </div>
              <p className="text-[11px] text-[#C8C5BA] mb-2">
                كام شخص وصل لصفحة التسجيل أو بداية الفانل؟
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.visitors === 0 ? '' : inputs.visitors.toLocaleString()}
                onChange={(e) => handleNumberInput('visitors', e.target.value)}
                placeholder="10,000"
                className="w-full bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-lg px-3 py-2 text-base font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
              />
            </div>

            {/* Input 2: Opt-ins */}
            <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80 focus-within:border-[#F5BF1E] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#FCFCFA]">
                  2. Opt-ins (تسجيل)
                </label>
                <span className="text-[10px] text-[#797979]">مطلوب</span>
              </div>
              <p className="text-[11px] text-[#C8C5BA] mb-2">
                كام شخص سجّل بياناته في القائمة (Leads)؟
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.optIns === 0 ? '' : inputs.optIns.toLocaleString()}
                onChange={(e) => handleNumberInput('optIns', e.target.value)}
                placeholder="2,000"
                className="w-full bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-lg px-3 py-2 text-base font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
              />
              {inputs.visitors > 0 && inputs.optIns > inputs.visitors && (
                <p className="text-[10px] text-[#F5BF1E] mt-1.5">
                  تنبيه: التسجيلات أكبر من الزوار.
                </p>
              )}
            </div>

            {/* Input 3: Unique Email Clickers */}
            <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80 focus-within:border-[#F5BF1E] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#FCFCFA]">
                  3. Email Clickers (نقرة من الإيميل)
                </label>
                <span className="text-[10px] text-[#F5BF1E] font-medium">أشخاص فريدين</span>
              </div>
              <p className="text-[11px] text-[#C8C5BA] mb-2">
                كام Lead ضغط على رابط العرض من الإيميلات؟
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.emailClickers === 0 ? '' : inputs.emailClickers.toLocaleString()}
                onChange={(e) => handleNumberInput('emailClickers', e.target.value)}
                placeholder="400"
                className="w-full bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-lg px-3 py-2 text-base font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
              />
              {inputs.optIns > 0 && inputs.emailClickers > inputs.optIns && (
                <p className="text-[10px] text-[#F5BF1E] mt-1.5">
                  تأكد إنك تدخل Unique Clickers وليس إجمالي النقرات.
                </p>
              )}
            </div>

            {/* Input 4: Sales */}
            <div className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80 focus-within:border-[#F5BF1E] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#FCFCFA]">
                  4. Sales (مبيعة)
                </label>
                <span className="text-[10px] text-[#797979]">مطلوب</span>
              </div>
              <p className="text-[11px] text-[#C8C5BA] mb-2">
                كام مبيعة تم تتبعها من هذا الفانل؟
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.sales === 0 ? '' : inputs.sales.toLocaleString()}
                onChange={(e) => handleNumberInput('sales', e.target.value)}
                placeholder="20"
                className="w-full bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-lg px-3 py-2 text-base font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
              />
            </div>
          </div>

          {/* Optional Delivered Emails */}
          <div className="mt-4 p-3.5 rounded-xl border border-[#4A2F15]/40 bg-[#040405]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#F5BF1E] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#FCFCFA]">إدخال اختياري: Emails Delivered (الإيميلات المستلمة بنجاح)</span>
                <p className="text-[#C8C5BA] text-[11px] mt-0.5">
                  إذا دخلت هذا الرقم، سنحسب Email CTR (معدل النقر الفعلي من الإيميل المستلم). بدونها، سنحسب نسبة Lead-to-Email Click.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-44 shrink-0">
              <input
                type="text"
                inputMode="numeric"
                value={inputs.emailsDelivered ? inputs.emailsDelivered.toLocaleString() : ''}
                onChange={(e) => handleNumberInput('emailsDelivered', e.target.value)}
                placeholder="مثال: 1,950"
                className="w-full bg-[#23170D]/40 border border-[#4A2F15] rounded-lg px-3 py-1.5 text-xs font-mono text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: ECONOMICS INPUTS */}
        <div className="pt-6 border-t border-[#4A2F15]/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F5BF1E] uppercase tracking-wider">
                اقتصاديات الفانل (Funnel Economics)
              </h3>
              <p className="text-xs text-[#C8C5BA] mt-0.5">
                اختياري لكن يُنصح به بقوة لمعرفة هل الفانل فوق نقطة التعادل أم يخسر
              </p>
            </div>

            {/* Currency selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#C8C5BA]">العملة:</span>
              <select
                value={inputs.currency}
                onChange={(e) => onChangeInputs({ currency: e.target.value as CurrencyCode })}
                className="bg-[#040405] border border-[#4A2F15] rounded-lg px-2.5 py-1.5 text-xs text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] cursor-pointer"
              >
                {Object.entries(CURRENCY_SYMBOLS).map(([code, info]) => (
                  <option key={code} value={code} className="bg-[#040405] text-[#FCFCFA]">
                    {info.labelAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Commission */}
            <div className="p-3.5 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
              <label className="block text-xs font-bold text-[#FCFCFA] mb-1">
                العمولة لكل مبيعة (Commission Per Sale)
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-2 text-xs font-mono text-[#797979]">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputs.commissionPerSale === 0 ? '' : inputs.commissionPerSale}
                  onChange={(e) => handleNumberInput('commissionPerSale', e.target.value)}
                  placeholder="50"
                  className="w-full bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-lg pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
                />
              </div>
            </div>

            {/* Ad Spend */}
            <div className="p-3.5 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
              <label className="block text-xs font-bold text-[#FCFCFA] mb-1">
                تكلفة الترافيك / الإعلانات (Ad Spend)
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-2 text-xs font-mono text-[#797979]">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputs.adSpend === 0 ? '' : inputs.adSpend}
                  onChange={(e) => handleNumberInput('adSpend', e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-lg pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
                />
              </div>
            </div>

            {/* Other Costs */}
            <div className="p-3.5 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
              <label className="block text-xs font-bold text-[#FCFCFA] mb-1">
                تكاليف إضافية (أدوات، إيميل، برامج)
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-2 text-xs font-mono text-[#797979]">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputs.otherCosts === 0 ? '' : inputs.otherCosts}
                  onChange={(e) => handleNumberInput('otherCosts', e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-lg pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: TARGET MODE TOGGLE */}
        <div className="pt-6 border-t border-[#4A2F15]/60">
          <div className="p-5 rounded-xl border border-[#4A2F15] bg-[#23170D]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#4A2F15]/50 text-[#F5BF1E] shrink-0 mt-0.5">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FCFCFA] flex items-center gap-2">
                    <span>وضع المعدلات المستهدفة (Target Mode)</span>
                  </h4>
                  <p className="text-xs text-[#C8C5BA] mt-0.5 max-w-xl">
                    عندي Target Rates محددة أريد قياس الفانل عليها. (دي الأرقام اللي أنت عايز الفانل يوصل لها — مش Benchmarks عامة مفروضة عليك).
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={targetRates.enabled}
                onClick={() => onChangeTargets({ enabled: !targetRates.enabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  targetRates.enabled ? 'bg-[#F5BF1E]' : 'bg-[#4A2F15]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#040405] shadow ring-0 transition duration-200 ease-in-out ${
                    targetRates.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Target Inputs when enabled */}
            {targetRates.enabled && (
              <div className="mt-6 pt-5 border-t border-[#4A2F15]/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FCFCFA] mb-1">
                    مستهدف التسجيل (Target Opt-in Rate)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={targetRates.targetOptInRate === 0 ? '' : targetRates.targetOptInRate}
                      onChange={(e) => handleTargetInput('targetOptInRate', e.target.value)}
                      placeholder="20"
                      className="w-full bg-[#040405] border border-[#4A2F15] rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono text-[#797979]">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FCFCFA] mb-1">
                    مستهدف نقرة الإيميل (Target Lead→Click)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={targetRates.targetLeadToClickRate === 0 ? '' : targetRates.targetLeadToClickRate}
                      onChange={(e) => handleTargetInput('targetLeadToClickRate', e.target.value)}
                      placeholder="20"
                      className="w-full bg-[#040405] border border-[#4A2F15] rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono text-[#797979]">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FCFCFA] mb-1">
                    مستهدف مبيعة العرض (Target Click→Sale)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={targetRates.targetClickToSaleRate === 0 ? '' : targetRates.targetClickToSaleRate}
                      onChange={(e) => handleTargetInput('targetClickToSaleRate', e.target.value)}
                      placeholder="5"
                      className="w-full bg-[#040405] border border-[#4A2F15] rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E] text-left dir-ltr tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono text-[#797979]">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-[#A7690C] via-[#F5BF1E] to-[#FBD052] text-[#040405] font-black text-lg rounded-xl shadow-lg hover:shadow-[#F5BF1E]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>شخّص الفانل بالأرقام</span>
          </button>
        </div>
      </form>
    </div>
  );
};
