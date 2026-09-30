import React, { useState } from 'react';
import { CalculatedMetrics, DiagnosisResult, FunnelInputs } from '../types/funnel';
import { BRAND_CONFIG } from '../config/constants';
import { Share2, Copy, Check, Download, Camera } from 'lucide-react';

interface ShareReportProps {
  inputs: FunnelInputs;
  metrics: CalculatedMetrics;
  diagnosis: DiagnosisResult;
}

export const ShareReport: React.FC<ShareReportProps> = ({
  inputs,
  metrics,
  diagnosis,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate clean shareable text
  const shareableText = `تشخيص الفانل (AFFILIATE FUNNEL DOCTOR):

Visitors (الزوار): ${inputs.visitors.toLocaleString()}
Opt-ins (التسجيلات): ${inputs.optIns.toLocaleString()} (${metrics.optInRateFormatted}%)
Email Clickers (نقرات الإيميل): ${inputs.emailClickers.toLocaleString()} (${metrics.leadToEmailClickRateFormatted}%)
Sales (المبيعات): ${inputs.sales.toLocaleString()} (${metrics.clickToSaleRateFormatted}%)

أول مرحلة أراجعها (Primary Investigation):
${diagnosis.primaryStageTitleAr}

السبب:
${diagnosis.primaryReason}

أول حاجة أصلحها (Fix First):
${diagnosis.fixFirst.priority}

متغيّرش ده دلوقتي (Do Not Change Yet):
${diagnosis.doNotChangeYet.item}

—
${BRAND_CONFIG.brandNameAr} | ${BRAND_CONFIG.philosophyAr}`;

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareableText);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-[#23170D]/40 border border-[#4A2F15]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      <div className="pb-4 border-b border-[#4A2F15]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCFA] flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#F5BF1E]" />
            <span>تقرير التشخيص الجاهز للمشاركة (Share Diagnosis)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#C8C5BA] mt-0.5">
            بطاقة ملخصة مناسبة لقطة الشاشة (Screenshot) ونص جاهز للنسخ الفوري
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5BF1E] text-[#040405] text-xs font-bold hover:bg-[#FBD052] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>تم نسخ النص بنجاح!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>نسخ ملخص التقرير</span>
            </>
          )}
        </button>
      </div>

      {/* Screenshot-Friendly Card */}
      <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#F5BF1E]/50 bg-gradient-to-b from-[#23170D] via-[#040405] to-[#040405] shadow-2xl relative overflow-hidden">
        {/* Subtle watermark brand emblem */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4A2F15]/60">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#F5BF1E] uppercase">
              {BRAND_CONFIG.appNameEn}
            </span>
            <h3 className="text-xl font-black text-[#FCFCFA]">
              تقرير تشخيص الفانل الرسمي
            </h3>
          </div>
          <div className="text-left font-mono text-xs text-[#797979]">
            <span>{BRAND_CONFIG.brandNameEn}</span>
          </div>
        </div>

        {/* Funnel Pipeline Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#4A2F15]/40 mb-6 bg-[#040405]/50 rounded-xl px-4">
          <div>
            <span className="text-[10px] text-[#797979] block">Visitors (زوار)</span>
            <span className="text-lg font-mono font-black text-[#FCFCFA] tabular-nums dir-ltr block">
              {inputs.visitors.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#797979] block">Opt-ins (تسجيل)</span>
            <span className="text-lg font-mono font-black text-[#F5BF1E] tabular-nums dir-ltr block">
              {inputs.optIns.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#C8C5BA]">
                ({metrics.optInRateFormatted}%)
              </span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#797979] block">Clickers (نقرات)</span>
            <span className="text-lg font-mono font-black text-[#F5BF1E] tabular-nums dir-ltr block">
              {inputs.emailClickers.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#C8C5BA]">
                ({metrics.leadToEmailClickRateFormatted}%)
              </span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#797979] block">Sales (مبيعات)</span>
            <span className="text-lg font-mono font-black text-[#FCFCFA] tabular-nums dir-ltr block">
              {inputs.sales.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#C8C5BA]">
                ({metrics.clickToSaleRateFormatted}%)
              </span>
            </span>
          </div>
        </div>

        {/* Diagnostic Key Takeaways */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <span className="text-[11px] font-bold text-[#F5BF1E] uppercase tracking-wider block">
              المرحلة الأولى للتحقيق (PRIMARY INVESTIGATION):
            </span>
            <p className="text-base font-bold text-[#FCFCFA] mt-0.5">
              {diagnosis.primaryStageTitleAr} ({diagnosis.primaryStageTitleEn})
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#C8C5BA] uppercase tracking-wider block">
              أول حاجة تصلحها (FIX FIRST):
            </span>
            <p className="text-[#FCFCFA] mt-0.5">{diagnosis.fixFirst.priority}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#A7690C] uppercase tracking-wider block">
              متغيّرش ده دلوقتي (DO NOT CHANGE YET):
            </span>
            <p className="text-[#C8C5BA] mt-0.5">{diagnosis.doNotChangeYet.item}</p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-8 pt-4 border-t border-[#4A2F15]/60 flex items-center justify-between text-xs text-[#797979]">
          <span className="font-semibold text-[#FCFCFA]">{BRAND_CONFIG.brandNameAr}</span>
          <span className="text-[#F5BF1E] font-medium">{BRAND_CONFIG.philosophyAr}</span>
        </div>
      </div>

      {/* Selectable text field for manual copying without permissions */}
      <div>
        <label className="block text-xs font-semibold text-[#797979] mb-1.5">
          نص قابل للتحديد المباشر (Selectable Text):
        </label>
        <textarea
          readOnly
          rows={7}
          value={shareableText}
          onFocus={(e) => e.target.select()}
          className="w-full bg-[#040405] border border-[#4A2F15] rounded-xl p-3 text-xs font-mono text-[#C8C5BA] focus:outline-none focus:border-[#F5BF1E] leading-relaxed resize-none dir-rtl"
        />
      </div>
    </div>
  );
};
