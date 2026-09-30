import React from 'react';
import { TrackingWarning } from '../types/funnel';
import { AlertTriangle, Wrench } from 'lucide-react';

interface DataQualityCheckProps {
  warnings: TrackingWarning[];
}

export const DataQualityCheck: React.FC<DataQualityCheckProps> = ({ warnings }) => {
  if (warnings.length === 0) return null;

  const hasError = warnings.some((w) => w.severity === 'error');

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border-2 mb-8 ${
        hasError
          ? 'border-[#F5BF1E] bg-[#23170D]/90 shadow-xl'
          : 'border-[#4A2F15] bg-[#23170D]/60'
      }`}
    >
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#F5BF1E]/20 text-[#F5BF1E] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-[#F5BF1E]" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#FCFCFA]">
            قبل التشخيص، عندنا مشكلة Tracking (تتبع) محتاجة تتراجع
          </h3>
          <p className="text-xs text-[#C8C5BA] mt-0.5">
            رصدنا علاقات غير منطقية بين أرقام المراحل؛ مراجعة هذه النقاط تمنحك تشخيصاً دقيقاً
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {warnings.map((w, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-[#4A2F15] bg-[#040405]/80 text-xs sm:text-sm text-[#FCFCFA] flex items-start gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-[#F5BF1E] mt-1.5 shrink-0" />
            <span className="leading-relaxed">{w.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
