import React from 'react';
import { ArrowDown, Stethoscope, Sparkles } from 'lucide-react';
import { BRAND_CONFIG, DEMO_PRESETS } from '../config/constants';
import { FunnelInputs, TargetRates } from '../types/funnel';

interface HeroProps {
  onStartDiagnosis: () => void;
  onLoadPreset: (inputs: FunnelInputs, targets: TargetRates) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartDiagnosis, onLoadPreset }) => {
  return (
    <header className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#23170D] bg-gradient-to-b from-[#040405] via-[#040405] to-[#23170D]/40">
      {/* Subtle background glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5BF1E]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Brand Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#4A2F15] bg-[#23170D]/60 text-xs font-medium text-[#C8C5BA]">
          <Stethoscope className="w-3.5 h-3.5 text-[#F5BF1E]" />
          <span>{BRAND_CONFIG.appNameEn}</span>
          <span className="text-[#4A2F15]">·</span>
          <span className="text-[#F5BF1E] font-semibold">{BRAND_CONFIG.appNameAr}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FCFCFA] tracking-tight leading-[1.25] mb-6 text-balance">
          المبيعات قليلة؟
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBD052] via-[#F5BF1E] to-[#A7690C]">
            متغيّرش حاجة قبل ما تعرف التسريب فين
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-[#C8C5BA] max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          دخل أرقام الفانل بتاعك، والأداة هتتبع رحلة العميل من أول{' '}
          <strong className="text-[#FCFCFA] font-medium">Visitor (زائر)</strong> لحد{' '}
          <strong className="text-[#FCFCFA] font-medium">Sale (مبيعة)</strong>، وتحاول تحدد المرحلة اللي تستحق التحقيق الأول.
        </p>

        {/* Trust Line */}
        <div className="p-4 rounded-xl border border-[#4A2F15]/60 bg-[#23170D]/40 max-w-xl mx-auto mb-8 text-sm text-[#C8C5BA] leading-relaxed">
          <span className="text-[#F5BF1E] font-semibold">مبدأ التشخيص: </span>
          مش هنقولك <span className="line-through text-[#797979]">«غيّر المنتج»</span> أو{' '}
          <span className="line-through text-[#797979]">«زوّد الإعلانات»</span> بشكل عشوائي.{' '}
          <span className="text-[#FCFCFA] font-medium">هنبدأ بالأرقام والرياضيات أولاً.</span>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartDiagnosis}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#A7690C] via-[#F5BF1E] to-[#FBD052] text-[#040405] font-bold text-base rounded-xl shadow-lg hover:shadow-[#F5BF1E]/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>شخّص الفانل الآن</span>
            <ArrowDown className="w-4 h-4 text-[#040405]" />
          </button>
        </div>

        {/* Quick Presets for Instant Testing */}
        <div className="mt-10 pt-6 border-t border-[#23170D]/80">
          <p className="text-xs text-[#797979] mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F5BF1E]" />
            <span>جرّب حالة تسريب حقيقية جاهزة بضغطة واحدة:</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onLoadPreset(preset.inputs, preset.targetRates)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#4A2F15]/60 bg-[#040405] hover:bg-[#23170D] text-[#C8C5BA] hover:text-[#F5BF1E] hover:border-[#F5BF1E]/50 transition-colors cursor-pointer"
                title={preset.descriptionAr}
              >
                {preset.nameAr}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
