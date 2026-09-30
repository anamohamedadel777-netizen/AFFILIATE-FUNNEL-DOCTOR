import React from 'react';
import {
  BottleneckStage,
  CalculatedMetrics,
  CurrencyCode,
  FunnelInputs,
} from '../types/funnel';
import { CURRENCY_SYMBOLS } from '../config/constants';
import { formatCurrency } from '../utils/calculations';
import { ArrowDown, DollarSign, Users, UserCheck, MousePointerClick, ShoppingBag, AlertCircle } from 'lucide-react';

interface FunnelVisualizerProps {
  inputs: FunnelInputs;
  metrics: CalculatedMetrics;
  primaryStage: BottleneckStage;
  targetOptIn?: number;
  targetLeadToClick?: number;
  targetClickToSale?: number;
}

export const FunnelVisualizer: React.FC<FunnelVisualizerProps> = ({
  inputs,
  metrics,
  primaryStage,
  targetOptIn,
  targetLeadToClick,
  targetClickToSale,
}) => {
  const currencySymbol = CURRENCY_SYMBOLS[inputs.currency]?.symbol || '$';

  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#4A2F15]/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF1E]" />
            <span>خريطة صحة الفانل (Funnel Health Map)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
            تتبع مسار الأشخاص خطوة بخطوة من الوصول وحتى المبيعة والعائد الاقتصادي
          </p>
        </div>

        {primaryStage !== 'None' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#F5BF1E]/40 bg-[#F5BF1E]/10 text-xs font-semibold text-[#F5BF1E]">
            <span>المرشح الأول للتحقيق: {primaryStage}</span>
          </div>
        )}
      </div>

      {/* Main Flow Nodes */}
      <div className="space-y-4">
        {/* STAGE 1: VISITORS */}
        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            primaryStage === 'Traffic'
              ? 'border-[#F5BF1E] bg-[#23170D]/90 shadow-[0_0_20px_rgba(245,191,30,0.15)] ring-1 ring-[#F5BF1E]'
              : 'border-[#4A2F15] bg-[#040405]/70 hover:border-[#4A2F15]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#23170D] border border-[#4A2F15] flex items-center justify-center text-[#F5BF1E] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#FCFCFA]">
                    1. Visitors (الزوار)
                  </h3>
                  <span className="text-[11px] text-[#C8C5BA]">بداية الفانل</span>
                </div>
                <p className="text-xs text-[#797979] mt-0.5">
                  إجمالي الأشخاص الذين وصلوا لصفحة البداية
                </p>
              </div>
            </div>

            <div className="text-right sm:text-left">
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#FCFCFA] tabular-nums dir-ltr">
                {inputs.visitors.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#797979]">100% من الزيارات</span>
            </div>
          </div>
        </div>

        {/* CONNECTOR 1: Drop-off & Rate */}
        <div className="relative py-1 px-4 flex items-center justify-between text-xs text-[#C8C5BA]">
          <div className="flex items-center gap-2 font-mono tabular-nums">
            <ArrowDown className="w-4 h-4 text-[#F5BF1E] animate-pulse" />
            <span>
              نسبة التحويل:{' '}
              <strong className="text-[#F5BF1E] font-bold text-sm">
                {metrics.optInRateFormatted}%
              </strong>
            </span>
            {targetOptIn !== undefined && targetOptIn > 0 && (
              <span className="text-[11px] text-[#797979]">
                (المستهدف: {targetOptIn}%)
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#797979]">
            فقدان:{' '}
            <span className="font-mono tabular-nums text-[#C8C5BA]">
              {metrics.dropOffVisitorToOptIn.toLocaleString()}
            </span>{' '}
            زائر
          </div>
        </div>

        {/* STAGE 2: OPT-INS */}
        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            primaryStage === 'LandingPage'
              ? 'border-[#F5BF1E] bg-[#23170D]/90 shadow-[0_0_20px_rgba(245,191,30,0.15)] ring-1 ring-[#F5BF1E]'
              : 'border-[#4A2F15] bg-[#040405]/70 hover:border-[#4A2F15]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#23170D] border border-[#4A2F15] flex items-center justify-center text-[#F5BF1E] shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#FCFCFA]">
                    2. Opt-ins (التسجيلات / Leads)
                  </h3>
                  {primaryStage === 'LandingPage' && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5BF1E] text-[#040405] font-bold">
                      أول فحص
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#797979] mt-0.5">
                  من قاموا بالتسجيل في صفحة الهبوط واستلام الهدية
                </p>
              </div>
            </div>

            <div className="text-right sm:text-left">
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#FCFCFA] tabular-nums dir-ltr">
                {inputs.optIns.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#F5BF1E] font-mono tabular-nums">
                {metrics.optInRateFormatted}% Opt-in Rate
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTOR 2: Drop-off & Rate */}
        <div className="relative py-1 px-4 flex items-center justify-between text-xs text-[#C8C5BA]">
          <div className="flex items-center gap-2 font-mono tabular-nums">
            <ArrowDown className="w-4 h-4 text-[#F5BF1E]" />
            <span>
              نسبة التحويل لنقرة:{' '}
              <strong className="text-[#F5BF1E] font-bold text-sm">
                {metrics.leadToEmailClickRateFormatted}%
              </strong>
            </span>
            {targetLeadToClick !== undefined && targetLeadToClick > 0 && (
              <span className="text-[11px] text-[#797979]">
                (المستهدف: {targetLeadToClick}%)
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#797979]">
            فقدان:{' '}
            <span className="font-mono tabular-nums text-[#C8C5BA]">
              {metrics.dropOffOptInToClick.toLocaleString()}
            </span>{' '}
            مشترك
          </div>
        </div>

        {/* STAGE 3: UNIQUE EMAIL CLICKERS */}
        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            primaryStage === 'Email'
              ? 'border-[#F5BF1E] bg-[#23170D]/90 shadow-[0_0_20px_rgba(245,191,30,0.15)] ring-1 ring-[#F5BF1E]'
              : 'border-[#4A2F15] bg-[#040405]/70 hover:border-[#4A2F15]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#23170D] border border-[#4A2F15] flex items-center justify-center text-[#F5BF1E] shrink-0">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#FCFCFA]">
                    3. Unique Email Clickers (نقرات الإيميل)
                  </h3>
                  {primaryStage === 'Email' && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5BF1E] text-[#040405] font-bold">
                      أول فحص
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#797979] mt-0.5">
                  أشخاص فريدون نقروا على رابط العرض من سلسلة الإيميلات
                </p>
              </div>
            </div>

            <div className="text-right sm:text-left">
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#FCFCFA] tabular-nums dir-ltr">
                {inputs.emailClickers.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#F5BF1E] font-mono tabular-nums">
                {metrics.leadToEmailClickRateFormatted}% Lead→Click
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTOR 3: Drop-off & Rate */}
        <div className="relative py-1 px-4 flex items-center justify-between text-xs text-[#C8C5BA]">
          <div className="flex items-center gap-2 font-mono tabular-nums">
            <ArrowDown className="w-4 h-4 text-[#F5BF1E]" />
            <span>
              معدل تحويل العرض:{' '}
              <strong className="text-[#F5BF1E] font-bold text-sm">
                {metrics.clickToSaleRateFormatted}%
              </strong>
            </span>
            {targetClickToSale !== undefined && targetClickToSale > 0 && (
              <span className="text-[11px] text-[#797979]">
                (المستهدف: {targetClickToSale}%)
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#797979]">
            فقدان:{' '}
            <span className="font-mono tabular-nums text-[#C8C5BA]">
              {metrics.dropOffClickToSale.toLocaleString()}
            </span>{' '}
            شخص
          </div>
        </div>

        {/* STAGE 4: SALES */}
        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            primaryStage === 'Offer'
              ? 'border-[#F5BF1E] bg-[#23170D]/90 shadow-[0_0_20px_rgba(245,191,30,0.15)] ring-1 ring-[#F5BF1E]'
              : 'border-[#4A2F15] bg-[#040405]/70 hover:border-[#4A2F15]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#23170D] border border-[#4A2F15] flex items-center justify-center text-[#F5BF1E] shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#FCFCFA]">
                    4. Tracked Sales (المبيعات)
                  </h3>
                  {primaryStage === 'Offer' && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5BF1E] text-[#040405] font-bold">
                      أول فحص
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#797979] mt-0.5">
                  المبيعات المؤكدة الناتجة من رابط الفانل
                </p>
              </div>
            </div>

            <div className="text-right sm:text-left">
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#FCFCFA] tabular-nums dir-ltr">
                {inputs.sales.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#F5BF1E] font-mono tabular-nums">
                {metrics.clickToSaleRateFormatted}% Click→Sale
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTOR 4: Economics arrow */}
        <div className="relative py-1 px-4 flex items-center justify-center text-xs text-[#C8C5BA]">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-4 h-4 text-[#F5BF1E]" />
            <span className="font-semibold text-[#FCFCFA]">
              المحصلة المالية والاقتصادية
            </span>
          </div>
        </div>

        {/* STAGE 5: ECONOMICS OVERVIEW */}
        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            primaryStage === 'Economics'
              ? 'border-[#F5BF1E] bg-[#23170D]/90 shadow-[0_0_20px_rgba(245,191,30,0.15)] ring-1 ring-[#F5BF1E]'
              : 'border-[#4A2F15] bg-[#040405]/70 hover:border-[#4A2F15]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#23170D] border border-[#4A2F15] flex items-center justify-center text-[#F5BF1E] shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#FCFCFA]">
                  5. Economics (اقتصاديات الفانل)
                </h3>
                <p className="text-xs text-[#797979] mt-0.5">
                  العمولات مقابل تكلفة الترافيك والمصروفات
                </p>
              </div>
            </div>
            {primaryStage === 'Economics' && (
              <span className="text-[10px] px-2.5 py-1 rounded bg-[#F5BF1E] text-[#040405] font-bold">
                تحت نقطة التعادل
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Gross Commission */}
            <div className="p-3 rounded-lg border border-[#4A2F15]/60 bg-[#040405]/90">
              <span className="block text-[11px] text-[#797979]">إجمالي العمولة</span>
              <span className="text-base sm:text-lg font-mono font-bold text-[#FCFCFA] tabular-nums dir-ltr block mt-0.5">
                {formatCurrency(metrics.grossCommission, currencySymbol)}
              </span>
            </div>

            {/* Total Costs */}
            <div className="p-3 rounded-lg border border-[#4A2F15]/60 bg-[#040405]/90">
              <span className="block text-[11px] text-[#797979]">إجمالي التكاليف</span>
              <span className="text-base sm:text-lg font-mono font-bold text-[#C8C5BA] tabular-nums dir-ltr block mt-0.5">
                {formatCurrency(metrics.totalCosts, currencySymbol)}
              </span>
            </div>

            {/* Net Profit */}
            <div className="p-3 rounded-lg border border-[#4A2F15]/60 bg-[#040405]/90">
              <span className="block text-[11px] text-[#797979]">صافي الربح</span>
              <span
                className={`text-base sm:text-lg font-mono font-bold tabular-nums dir-ltr block mt-0.5 ${
                  metrics.netProfit < 0 ? 'text-[#C8C5BA]' : 'text-[#F5BF1E]'
                }`}
              >
                {formatCurrency(metrics.netProfit, currencySymbol)}
              </span>
            </div>

            {/* CPA vs Break-Even */}
            <div className="p-3 rounded-lg border border-[#4A2F15]/60 bg-[#040405]/90">
              <span className="block text-[11px] text-[#797979]">
                تكلفة المبيعة (CPA)
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-[#FCFCFA] tabular-nums dir-ltr block mt-0.5">
                {metrics.cpa !== null ? formatCurrency(metrics.cpa, currencySymbol) : '—'}
              </span>
              {metrics.breakEvenCPA > 0 && (
                <span className="text-[10px] text-[#797979] block mt-0.5">
                  التعادل: {formatCurrency(metrics.breakEvenCPA, currencySymbol)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Footnote on Raw Drop-offs */}
      <div className="mt-6 p-3 rounded-xl border border-[#4A2F15]/40 bg-[#040405]/50 flex items-start gap-2.5 text-xs text-[#797979] leading-relaxed">
        <AlertCircle className="w-4 h-4 text-[#F5BF1E] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#C8C5BA]">قاعدة تشخيصية: </strong>
          لا نعتبر المرحلة ذات الفقدان العددي الأكبر (Raw Drop-off) هي الأسوأ تلقائياً، لأن المراحل الأولى تحتوي طبيعياً على عدد زوار أكبر. التشخيص يقيس الكفاءة النسبية وتدفق المراحل مقارنة بنقطة التعادل أو أهدافك المحددة.
        </p>
      </div>
    </div>
  );
};
