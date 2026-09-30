import React from 'react';
import { DayPlanItem } from '../types/funnel';
import { CalendarDays, GitBranch, Lightbulb } from 'lucide-react';

interface SevenDayPrescriptionProps {
  plan: DayPlanItem[];
  stageNameAr: string;
}

export const SevenDayPrescription: React.FC<SevenDayPrescriptionProps> = ({
  plan,
  stageNameAr,
}) => {
  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      <div className="pb-4 border-b border-[#4A2F15]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#F5BF1E]" />
            <span>خطة علاج الفانل لـ7 أيام (7-Day Funnel Prescription)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
            برنامج عملي مركز يركز فقط على مرحلة <span className="text-[#F5BF1E] font-semibold">{stageNameAr}</span> (استعارة عملية لتنظيم المهام)
          </p>
        </div>
      </div>

      {/* Prominent Golden Testing Principle Rule */}
      <div className="p-4 sm:p-5 rounded-xl border-2 border-[#F5BF1E] bg-[#23170D]/80 flex items-start gap-3.5 shadow-lg">
        <GitBranch className="w-6 h-6 text-[#F5BF1E] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-black text-[#F5BF1E] uppercase tracking-wider mb-1">
            القاعدة الذهبية للاختبار: «غيّر متغير واحد في كل Test»
          </h3>
          <p className="text-xs sm:text-sm text-[#FCFCFA] leading-relaxed">
            لو قمت بتغيير الإعلان، وصفحة الهبوط، ورسائل الإيميل، ومنتج الأفلييت في نفس الوقت، فلن تعرف أبداً أي عنصر هو الذي صنع النجاح أو تسبب في الفشل. الانضباط العلمي يتطلب تثبيت باقي المراحل وتعديل متغير واحد في المرحلة المستهدفة.
          </p>
        </div>
      </div>

      {/* 7 Days Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 pt-2">
        {plan.map((item) => (
          <div
            key={item.day}
            className="p-4 rounded-xl border border-[#4A2F15] bg-[#040405]/80 flex flex-col justify-between hover:border-[#F5BF1E]/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-[#23170D] border border-[#4A2F15] flex items-center justify-center font-mono font-bold text-xs text-[#F5BF1E]">
                  D{item.day}
                </span>
                <span className="text-[10px] text-[#797979]">اليوم {item.day}</span>
              </div>
              <h4 className="text-xs font-bold text-[#FCFCFA] mb-2 leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#C8C5BA] leading-relaxed">
                {item.task}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
