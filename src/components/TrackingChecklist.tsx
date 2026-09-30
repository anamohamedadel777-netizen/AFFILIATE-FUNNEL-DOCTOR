import React, { useState } from 'react';
import { CheckSquare, Square, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ChecklistItem {
  id: string;
  question: string;
  tip: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'traffic_tracked',
    question: 'هل كل مصدر Traffic عليه UTM / Tracking link سليم؟',
    tip: 'تأكد من معرفة مصدر كل زيارة بالتحديد (يوتيوب، إعلانات، بحث) وعدم خلط الروابط.',
  },
  {
    id: 'landing_tracked',
    question: 'هل صفحة التسجيل (Landing Page) تسجل الزوار والتحويلات بدقة؟',
    tip: 'تأكد أن بكسل التتبع أو أداة الإحصاءات لا تحتسب إعادة تحميل الصفحة أو زيارات البوتات.',
  },
  {
    id: 'email_tracked',
    question: 'هل Email Clicks متتبعة بروابط فريدة لكل إيميل؟',
    tip: 'استخدم بروتوكول تتبع يفرق بين نقرة الإيميل الأول، الثاني، والثالث في السلسلة.',
  },
  {
    id: 'affiliate_subid',
    question: 'هل Affiliate Sales مرتبطة بمصدر الزيارة (SubID / ClickID)؟',
    tip: 'تمرير كود التتبع في رابط الأفلييت يمكنك من معرفة أي حملة وإيميل صنع المبيعة فعلياً.',
  },
  {
    id: 'unique_vs_total',
    question: 'هل تستخدم Unique Clicks (أشخاص فريدين) بدل إجمالي Clicks؟',
    tip: 'إذا نقر نفس الشخص 5 مرات، يجب أن يُحتسب كشخص واحد فريد في معادلة الفانل.',
  },
  {
    id: 'same_time_window',
    question: 'هل فترة البيانات موحدة لجميع الأرقام المدخلة؟',
    tip: 'تأكد أن الزيارات، التسجيلات، النقرات، والمبيعات تخص نفس النطاق الزمني تماماً.',
  },
];

export const TrackingChecklist: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({
    traffic_tracked: true,
    landing_tracked: true,
  });

  const toggle = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedIds).filter(Boolean).length;
  const isAllChecked = checkedCount === CHECKLIST_ITEMS.length;

  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      <div className="pb-4 border-b border-[#4A2F15]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#F5BF1E]" />
            <span>فحص جودة التتبع (Tracking Audit)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
            تأكد من سلامة رصد البيانات قبل إهدار الوقت في تحسينات غير دقيقة
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#4A2F15] bg-[#040405] text-xs font-mono">
          <span className="text-[#797979]">اكتمال التتبع:</span>
          <span className="font-bold text-[#F5BF1E] tabular-nums">
            {checkedCount} من {CHECKLIST_ITEMS.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checkedIds[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                isChecked
                  ? 'border-[#F5BF1E]/50 bg-[#23170D]/60'
                  : 'border-[#4A2F15] bg-[#040405]/80 hover:border-[#4A2F15]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-[#F5BF1E]" />
                ) : (
                  <Square className="w-5 h-5 text-[#797979]" />
                )}
              </div>
              <div>
                <h4
                  className={`text-xs sm:text-sm font-semibold transition-colors ${
                    isChecked ? 'text-[#FCFCFA]' : 'text-[#C8C5BA]'
                  }`}
                >
                  {item.question}
                </h4>
                <p className="text-[11px] text-[#797979] mt-1 leading-relaxed">
                  {item.tip}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {!isAllChecked && (
        <div className="p-4 rounded-xl border border-[#A7690C] bg-[#23170D]/40 text-xs text-[#C8C5BA] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F5BF1E]" />
            <span>
              <strong className="text-[#F5BF1E]">قاعدة ذهبية: </strong>
              «قبل Optimization (التحسين)، أصلح Tracking (التتبع)».
            </span>
          </div>
          <span className="text-[11px] text-[#797979] hidden sm:inline">
            القرارات القائمة على تتبع خاطئ تكلف أكثر من غياب الفانل نفسه.
          </span>
        </div>
      )}
    </div>
  );
};
