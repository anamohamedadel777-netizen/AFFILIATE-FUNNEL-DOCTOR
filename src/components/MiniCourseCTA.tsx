import React from 'react';
import { BRAND_CONFIG } from '../config/constants';
import { ArrowUpRight, BookOpen, Layers } from 'lucide-react';

export const MiniCourseCTA: React.FC = () => {
  const courseUrl = BRAND_CONFIG.miniCourseUrl?.trim();
  const isUrlAvailable = Boolean(courseUrl && courseUrl !== '');

  const rbtlsSteps = [
    { letter: 'R', titleAr: 'Research', descAr: 'ابحث عن السوق والجمهور' },
    { letter: 'B', titleAr: 'Build', descAr: 'ابنِ الفانل والعرض' },
    { letter: 'T', titleAr: 'Traffic', descAr: 'اجلب الترافيك المستهدف' },
    {
      letter: 'L',
      titleAr: 'Learn',
      descAr: 'تعلم من الأرقام وشخّص',
      isCurrent: true,
    },
    { letter: 'S', titleAr: 'Scale', descAr: 'وسع فقط بعد ثبات الأرقام' },
  ];

  return (
    <div className="bg-gradient-to-b from-[#23170D] via-[#040405] to-[#23170D]/40 border-2 border-[#A7690C] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#F5BF1E]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
        {/* Section Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#F5BF1E] block mb-2">
            الرؤية الشاملة (The Full Ecosystem)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#FCFCFA] tracking-tight">
            التشخيص جزء من السيستم
          </h2>
        </div>

        {/* R.B.T.L.S Framework Diagram */}
        <div className="p-5 rounded-2xl border border-[#4A2F15] bg-[#040405]/80">
          <div className="text-xs font-bold text-[#C8C5BA] uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <Layers className="w-4 h-4 text-[#F5BF1E]" />
            <span>منهجية R.B.T.L.S لبناء بيزنس الأفلييت</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {rbtlsSteps.map((step) => (
              <div
                key={step.letter}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  step.isCurrent
                    ? 'border-[#F5BF1E] bg-[#23170D] shadow-[0_0_15px_rgba(245,191,30,0.15)] ring-1 ring-[#F5BF1E]'
                    : 'border-[#4A2F15]/60 bg-[#040405]'
                }`}
              >
                <div
                  className={`text-2xl font-black font-mono mb-1 ${
                    step.isCurrent ? 'text-[#F5BF1E]' : 'text-[#797979]'
                  }`}
                >
                  {step.letter}
                </div>
                <h4
                  className={`text-xs font-bold ${
                    step.isCurrent ? 'text-[#FCFCFA]' : 'text-[#C8C5BA]'
                  }`}
                >
                  {step.titleAr}
                </h4>
                <p className="text-[10px] text-[#797979] mt-0.5">
                  {step.descAr}
                </p>
                {step.isCurrent && (
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 mt-2 rounded bg-[#F5BF1E] text-[#040405]">
                    موقعك الآن
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-[#C8C5BA] mt-4 leading-relaxed max-w-xl mx-auto">
            أداة <strong className="text-[#F5BF1E]">Affiliate Funnel Doctor</strong> موجودة في مرحلة{' '}
            <strong className="text-[#FCFCFA]">Learn (التعلم): </strong>
            اقرأ الأرقام، شخّص، اختبر، اتعلم، وبعدين فقط فكّر في{' '}
            <strong className="text-[#FCFCFA]">Scale (التوسع)</strong>.
          </p>
        </div>

        {/* Narrative Copy */}
        <p className="text-sm sm:text-base text-[#C8C5BA] leading-relaxed max-w-2xl mx-auto">
          الفانل مش مجرد صفحة هبوط معزولة. قبله عندك: <strong className="text-[#FCFCFA]">Market (السوق)</strong>،{' '}
          <strong className="text-[#FCFCFA]">Audience (الجمهور)</strong>،{' '}
          <strong className="text-[#FCFCFA]">Offer (العرض)</strong>، و{' '}
          <strong className="text-[#FCFCFA]">Message (الرسالة)</strong>. وبعده عندك:{' '}
          <strong className="text-[#FCFCFA]">Traffic (الترافيك)</strong>،{' '}
          <strong className="text-[#FCFCFA]">Tracking (التتبع)</strong>، و{' '}
          <strong className="text-[#FCFCFA]">Scaling (التوسع)</strong>.
          <br className="hidden sm:inline" />
          لهذا السبب أعددت ميني كورس مجاني من 3 فيديوهات يوضح لك الصورة كاملة كنظام عمل متصل.
        </p>

        {/* Mini Course CTA button */}
        <div className="pt-2">
          {isUrlAvailable ? (
            <a
              href={courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#A7690C] via-[#F5BF1E] to-[#FBD052] text-[#040405] font-black text-base sm:text-lg rounded-xl shadow-lg hover:shadow-[#F5BF1E]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <BookOpen className="w-5 h-5 text-[#040405]" />
              <span>ابدأ الميني كورس مجانًا</span>
              <ArrowUpRight className="w-4 h-4 text-[#040405]" />
            </a>
          ) : (
            <button
              disabled
              className="px-8 py-4 rounded-xl border border-[#4A2F15] bg-[#23170D]/40 text-[#797979] text-sm cursor-not-allowed"
            >
              سيتم إضافة رابط الميني كورس هنا
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
