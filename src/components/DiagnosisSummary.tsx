import React from 'react';
import { Check, X, Search } from 'lucide-react';

interface DiagnosisSummaryProps {
  whatNumbersSay: string[];
  whatNumbersDoNotSay: string[];
  possibleCauses: string[];
}

export const DiagnosisSummary: React.FC<DiagnosisSummaryProps> = ({
  whatNumbersSay,
  whatNumbersDoNotSay,
  possibleCauses,
}) => {
  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      <div className="pb-4 border-b border-[#4A2F15]/60">
        <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF1E]" />
          <span>منطق التحليل: الدليل مقابل الافتراض</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
          الفصل الحاسم بين ما أثبتته الأرقام بالفعل، وبين التخمينات التي يقع فيها معظم المسوقين
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: What Numbers Say */}
        <div className="p-5 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-[#23170D] border border-[#F5BF1E] text-[#F5BF1E] flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#FCFCFA]">
              ما تقوله الأرقام (What The Numbers Say)
            </h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-[#C8C5BA]">
            {whatNumbersSay.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5BF1E] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: What Numbers Do NOT Say */}
        <div className="p-5 rounded-xl border border-[#4A2F15] bg-[#040405]/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-[#23170D] border border-[#A7690C] text-[#C8C5BA] flex items-center justify-center">
              <X className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#FCFCFA]">
              ما لا تقوله الأرقام (What They Do NOT Say)
            </h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-[#C8C5BA]">
            {whatNumbersDoNotSay.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#797979] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Possible Investigation Hypotheses */}
      {possibleCauses.length > 0 && (
        <div className="p-5 rounded-xl border border-[#4A2F15]/80 bg-[#23170D]/40">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-[#F5BF1E]" />
            <h4 className="text-xs font-bold text-[#FCFCFA] uppercase tracking-wider">
              فرضيات تستحق التحقيق في هذه المرحلة (Hypotheses to Test):
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {possibleCauses.map((cause, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-[#4A2F15]/50 bg-[#040405]/60 text-xs text-[#C8C5BA] leading-relaxed"
              >
                {cause}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
