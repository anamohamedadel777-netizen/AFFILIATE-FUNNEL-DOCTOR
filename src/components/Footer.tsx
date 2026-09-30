import React from 'react';
import { BRAND_CONFIG } from '../config/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#23170D] bg-[#040405] py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Brand Name */}
        <div className="text-base sm:text-lg font-black text-[#FCFCFA] tracking-wide">
          {BRAND_CONFIG.brandNameAr} · {BRAND_CONFIG.brandNameEn}
        </div>

        {/* Primary Slogan */}
        <p className="text-sm font-semibold text-[#F5BF1E]">
          {BRAND_CONFIG.sloganAr}
        </p>

        {/* Secondary Principle */}
        <p className="text-xs text-[#797979]">
          {BRAND_CONFIG.philosophyAr} — {BRAND_CONFIG.philosophyEn}
        </p>

        <div className="pt-6 border-t border-[#23170D] text-[11px] text-[#797979]">
          جميع الحقوق محفوظة © {new Date().getFullYear()} {BRAND_CONFIG.brandNameAr}. أداة تحليل واختبار اقتصاديات الفانل.
        </div>
      </div>
    </footer>
  );
};
