import React from 'react';
import { Ban, ShieldAlert } from 'lucide-react';

interface DoNotChangePanelProps {
  doNotChangeYet: {
    item: string;
    reason: string;
  };
}

export const DoNotChangePanel: React.FC<DoNotChangePanelProps> = ({ doNotChangeYet }) => {
  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#4A2F15]/60">
        <div className="w-10 h-10 rounded-xl bg-[#23170D] border border-[#A7690C] text-[#F5BF1E] flex items-center justify-center">
          <Ban className="w-5 h-5 text-[#F5BF1E]" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A7690C]">
            الانضباط التشخيصي (Diagnostic Discipline)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA]">
            متغيّرش ده دلوقتي
          </h2>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-[#4A2F15] bg-[#040405]/80 mb-5">
        <span className="text-[11px] font-bold text-[#797979] uppercase tracking-wider block mb-1">
          العنصر المحظور لمسه الآن:
        </span>
        <p className="text-base sm:text-lg font-bold text-[#F5BF1E] leading-relaxed mb-3">
          {doNotChangeYet.item}
        </p>

        <div className="pt-3 border-t border-[#4A2F15]/50">
          <span className="text-xs font-semibold text-[#C8C5BA] block mb-1">
            لماذا؟ (السبب الرياضي والسلوكي):
          </span>
          <p className="text-sm text-[#C8C5BA] leading-relaxed">
            {doNotChangeYet.reason}
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-[#4A2F15]/40 bg-[#23170D]/30 flex items-start gap-2.5 text-xs text-[#797979] leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-[#F5BF1E] shrink-0 mt-0.5" />
        <p>
          تغيير المنتج أو مضاعفة ميزانية الإعلانات أثناء وجود تسريب في مرحلة سابقة هو السبب الرئيسي في خسارة آلاف الدولارات بدون معرفة موضع الخلل الحقيقي.
        </p>
      </div>
    </div>
  );
};
