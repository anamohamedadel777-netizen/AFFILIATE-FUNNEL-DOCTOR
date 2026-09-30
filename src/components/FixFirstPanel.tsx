import React from 'react';
import { CheckCircle2, Wrench } from 'lucide-react';

interface FixFirstPanelProps {
  fixFirst: {
    priority: string;
    tests: string[];
  };
}

export const FixFirstPanel: React.FC<FixFirstPanelProps> = ({ fixFirst }) => {
  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#4A2F15]/60">
        <div className="w-10 h-10 rounded-xl bg-[#23170D] border border-[#F5BF1E]/40 text-[#F5BF1E] flex items-center justify-center">
          <Wrench className="w-5 h-5 text-[#F5BF1E]" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F5BF1E]">
            خطة العمل الفورية (Action Priority)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA]">
            أول حاجة تصلحها
          </h2>
        </div>
      </div>

      {/* The Single Primary Priority */}
      <div className="p-5 rounded-xl border border-[#F5BF1E]/60 bg-[#23170D]/70 mb-6">
        <span className="text-[11px] font-bold text-[#F5BF1E] uppercase tracking-wider block mb-1">
          الأولوية الأولى (أصلح هذا قبل غيره):
        </span>
        <p className="text-base sm:text-lg font-bold text-[#FCFCFA] leading-relaxed">
          {fixFirst.priority}
        </p>
      </div>

      {/* 3 Specific Tests */}
      <div>
        <h3 className="text-xs font-bold text-[#C8C5BA] uppercase tracking-wider mb-3">
          3 اختبارات مقترحة للتنفيذ تدريجياً:
        </h3>
        <div className="space-y-3">
          {fixFirst.tests.map((test, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80 flex items-start gap-3.5 hover:border-[#F5BF1E]/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#23170D] border border-[#4A2F15] flex items-center justify-center text-xs font-mono font-bold text-[#F5BF1E] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-[#FCFCFA] leading-relaxed">
                {test}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
