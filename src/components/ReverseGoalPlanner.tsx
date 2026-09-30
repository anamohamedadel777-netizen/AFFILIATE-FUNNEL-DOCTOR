import React, { useState } from 'react';
import { CalculatedMetrics } from '../types/funnel';
import { calculateReverseFunnel } from '../utils/calculations';
import { Calculator, ArrowLeft, AlertCircle } from 'lucide-react';

interface ReverseGoalPlannerProps {
  metrics: CalculatedMetrics;
}

export const ReverseGoalPlanner: React.FC<ReverseGoalPlannerProps> = ({ metrics }) => {
  const [targetSales, setTargetSales] = useState<number>(50);

  const result = calculateReverseFunnel(targetSales, metrics);

  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      <div className="pb-4 border-b border-[#4A2F15]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#F5BF1E]" />
            <span>لو عايز X مبيعات… الفانل محتاج إيه؟ (Reverse Goal Planner)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
            حساب عكسي لمتطلبات كل مرحلة بناءً على معدلات التحويل الحالية للفانل
          </p>
        </div>

        {/* Input Target Sales */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#FCFCFA] whitespace-nowrap">
            المبيعات المستهدفة:
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            value={targetSales}
            onChange={(e) => setTargetSales(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 bg-[#040405] border border-[#4A2F15] rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-[#F5BF1E] text-center focus:outline-none focus:border-[#F5BF1E] tabular-nums"
          />
        </div>
      </div>

      {!result.possible ? (
        <div className="p-5 rounded-xl border border-[#A7690C] bg-[#040405]/80 flex items-start gap-3 text-xs sm:text-sm text-[#C8C5BA]">
          <AlertCircle className="w-5 h-5 text-[#F5BF1E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#F5BF1E] block text-sm">
              تعذّر الحساب العكسي بالمعادلات الحالية:
            </strong>
            <p className="leading-relaxed">{result.blockReason}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Required Visitors */}
            <div className="p-5 rounded-xl border border-[#4A2F15] bg-[#040405]/80 text-center">
              <span className="text-xs font-semibold text-[#797979] block mb-1">
                الزوار المطلوب وصولهم (Visitors)
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#FCFCFA] tabular-nums block mb-1 dir-ltr">
                {result.requiredVisitors.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#C8C5BA]">
                بمعدل تسجيل {metrics.optInRateFormatted}%
              </span>
            </div>

            {/* Required Opt-ins */}
            <div className="p-5 rounded-xl border border-[#4A2F15] bg-[#040405]/80 text-center">
              <span className="text-xs font-semibold text-[#797979] block mb-1">
                المشتركون المطلوبون (Leads)
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#FCFCFA] tabular-nums block mb-1 dir-ltr">
                {result.requiredOptIns.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#C8C5BA]">
                بمعدل نقرة إيميل {metrics.leadToEmailClickRateFormatted}%
              </span>
            </div>

            {/* Required Clickers */}
            <div className="p-5 rounded-xl border border-[#4A2F15] bg-[#040405]/80 text-center">
              <span className="text-xs font-semibold text-[#797979] block mb-1">
                نقرات العرض المطلوبة (Clickers)
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#F5BF1E] tabular-nums block mb-1 dir-ltr">
                {result.requiredClicks.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#C8C5BA]">
                بمعدل تحويل بيعي {metrics.clickToSaleRateFormatted}%
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg border border-[#4A2F15]/40 bg-[#23170D]/30 text-xs text-[#C8C5BA] text-center">
            لتحقيق <strong className="text-[#F5BF1E]">{targetSales} مبيعة</strong> بالمعدلات الحالية، تحتاج إلى تدفق لا يقل عن{' '}
            <strong className="text-[#FCFCFA]">{result.requiredVisitors.toLocaleString()} زائر</strong> من البداية.
          </div>
        </div>
      )}
    </div>
  );
};
