import React from 'react';
import { DiagnosisResult } from '../types/funnel';
import { Layers, ChevronDown } from 'lucide-react';

interface StageDiagnosisProps {
  diagnosis: DiagnosisResult;
}

export const StageDiagnosis: React.FC<StageDiagnosisProps> = ({ diagnosis }) => {
  const [openStage, setOpenStage] = React.useState<string | null>(diagnosis.primaryBottleneckStage);

  const stages = [
    {
      id: 'Traffic',
      titleAr: '1. مرحلة الترافيك (Traffic Stage)',
      content: diagnosis.trafficDiagnosis,
      investigateList: ['حجم العينة الإحصائية', 'مصدر الزيارات المستهدف', 'تطابق نية الباحث أو المشاهد مع بداية العرض'],
    },
    {
      id: 'LandingPage',
      titleAr: '2. مرحلة صفحة الهبوط (Landing Page)',
      content: diagnosis.landingPageDiagnosis,
      investigateList: [
        'Message Match (تطابق نص الإعلان مع العنوان الرئيسي)',
        'جاذبية الـ Lead Magnet وفائدته الفورية',
        'سهولة فورم التسجيل وسرعة تحميل الموبايل',
      ],
    },
    {
      id: 'Email',
      titleAr: '3. مرحلة الإيميل (Email Sequence)',
      content: diagnosis.emailDiagnosis,
      investigateList: [
        'سلامة تسليم الإيميل وتجنب مجلد Spam',
        'وضوح الرابط الترويجي داخل الرسائل الترحيبية',
        'تنويه: معدل الفتح مجهول لعدم تسجيل إحصاءات Opens',
      ],
    },
    {
      id: 'Offer',
      titleAr: '4. مرحلة العرض والصفحة البيعية (Affiliate Offer)',
      content: diagnosis.offerDiagnosis,
      investigateList: [
        'Audience Fit (ملاءمة المنتج لاحتياج الجمهور)',
        'صفحة البيع ومصداقية البائع وإثبات النتائج',
        'بوابة الدفع والتأكد من عدم ضياع كوكيز التتبع',
      ],
    },
    {
      id: 'Economics',
      titleAr: '5. مرحلة الاقتصاديات (Funnel Economics)',
      content: diagnosis.economicsDiagnosis,
      investigateList: [
        'مقارنة CPA مع عمولة المبيعة Break-Even',
        'إيقاف الإعلانات أو المصادر الخاسرة',
        'إضافة عروض مساندة أو اختيار منتجات بعمولات دورية',
      ],
    },
  ];

  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-4">
      <div className="pb-4 border-b border-[#4A2F15]/60 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F5BF1E]" />
            <span>تشخيص كل مرحلة على حدة (Stage-by-Stage Diagnosis)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
            فحص تفصيلي للمراحل الخمس لتفادي التداخل في القرارات
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {stages.map((stage) => {
          const isPrimary = diagnosis.primaryBottleneckStage === stage.id;
          const isOpen = openStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isPrimary
                  ? 'border-[#F5BF1E]/80 bg-[#23170D]/80'
                  : 'border-[#4A2F15] bg-[#040405]/80'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenStage(isOpen ? null : stage.id)}
                className="w-full p-4 flex items-center justify-between text-right cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPrimary ? 'bg-[#F5BF1E] animate-pulse' : 'bg-[#797979]'
                    }`}
                  />
                  <h3 className="text-sm sm:text-base font-bold text-[#FCFCFA]">
                    {stage.titleAr}
                  </h3>
                  {isPrimary && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5BF1E] text-[#040405] font-bold">
                      الأولوية الأساسية
                    </span>
                  )}
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-[#C8C5BA] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#F5BF1E]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#C8C5BA] border-t border-[#4A2F15]/40 space-y-3">
                  <p className="leading-relaxed text-[#FCFCFA]">
                    {stage.content}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-[#797979] uppercase block mb-1.5">
                      عناصر التحقيق في هذه المرحلة:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {stage.investigateList.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-[#C8C5BA]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A7690C]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
