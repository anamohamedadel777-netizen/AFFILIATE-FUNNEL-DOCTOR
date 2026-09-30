import React from 'react';
import { DiagnosisResult } from '../types/funnel';
import { Target, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PrimaryBottleneckProps {
  diagnosis: DiagnosisResult;
  onTriggerAiDiagnosis?: () => void;
  isAiLoading?: boolean;
}

export const PrimaryBottleneck: React.FC<PrimaryBottleneckProps> = ({
  diagnosis,
  onTriggerAiDiagnosis,
  isAiLoading = false,
}) => {
  return (
    <div className="bg-gradient-to-b from-[#23170D] to-[#040405] border-2 border-[#F5BF1E] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle gold decorative banner */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 w-64 h-64 bg-[#F5BF1E]/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#4A2F15]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5BF1E] text-[#040405] flex items-center justify-center font-black text-xl shadow-md">
            !
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F5BF1E]">
              التشخيص الأساسي (Primary Bottleneck)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#FCFCFA] mt-0.5">
              ابدأ من هنا
            </h2>
          </div>
        </div>

        {/* Priority & Confidence Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Tag (Gold, no red/green) */}
          <div className="px-3 py-1 rounded-lg border border-[#F5BF1E] bg-[#F5BF1E]/20 text-[#F5BF1E] text-xs font-bold">
            الأولوية: {diagnosis.priorityLevel === 'HIGH' ? 'عالية (HIGH)' : 'متوسطة'}
          </div>

          {/* Confidence */}
          <div
            className="px-3 py-1 rounded-lg border border-[#4A2F15] bg-[#040405] text-[#C8C5BA] text-xs font-medium flex items-center gap-1.5"
            title={diagnosis.confidenceReason}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5BF1E]" />
            <span>ثقة التشخيص: {diagnosis.confidenceLabelAr}</span>
          </div>

          {/* AI trigger if available */}
          {onTriggerAiDiagnosis && (
            <button
              onClick={onTriggerAiDiagnosis}
              disabled={isAiLoading}
              className="px-3.5 py-1.5 rounded-lg border border-[#F5BF1E]/60 bg-[#23170D] hover:bg-[#4A2F15] text-[#F5BF1E] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'جارِ التحليل المعمّق...' : 'تحليل ذكي معمّق (Gemini AI)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bottleneck Box */}
      <div className="p-6 rounded-xl border border-[#4A2F15] bg-[#040405]/80 mb-6">
        <span className="text-xs font-semibold text-[#797979] block mb-1">
          المرحلة الأولى للتحقيق والتدقيق:
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-3">
          <span className="text-2xl sm:text-3xl font-black text-[#F5BF1E]">
            {diagnosis.primaryStageTitleAr}
          </span>
          <span className="text-sm font-mono text-[#C8C5BA]">
            ({diagnosis.primaryStageTitleEn})
          </span>
        </div>

        <p className="text-sm sm:text-base text-[#FCFCFA] leading-relaxed font-normal">
          {diagnosis.primaryReason}
        </p>

        {diagnosis.targetAlignmentScore !== null && (
          <div className="mt-4 pt-4 border-t border-[#4A2F15]/60 flex items-center justify-between">
            <span className="text-xs text-[#C8C5BA]">
              درجة الاقتراب من الأهداف (Target Alignment Score):
            </span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-[#23170D] h-2.5 rounded-full overflow-hidden border border-[#4A2F15]">
                <div
                  className="bg-gradient-to-r from-[#A7690C] to-[#F5BF1E] h-full"
                  style={{ width: `${Math.min(100, diagnosis.targetAlignmentScore)}%` }}
                />
              </div>
              <span className="text-sm font-mono font-bold text-[#F5BF1E] tabular-nums">
                {diagnosis.targetAlignmentScore}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confidence explanation banner */}
      <div className="text-xs text-[#C8C5BA] bg-[#23170D]/40 p-3.5 rounded-xl border border-[#4A2F15]/60 flex items-start gap-2.5">
        <Target className="w-4 h-4 text-[#F5BF1E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#FCFCFA]">لماذا نقول «مرشح للتحقيق» وليس «عيب قاطع»؟ </strong>
          لأن الأرقام وحدها توضح أين انقطع التدفق، لكن الأسباب قد تتوزع بين جودة الترافيك، صياغة العنوان، أو أخطاء التتبع. دورك كمسوّق هو اختبار فرضية واحدة تلو الأخرى.
        </p>
      </div>
    </div>
  );
};
