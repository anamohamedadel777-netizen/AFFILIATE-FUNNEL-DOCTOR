import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[#4A2F15]/60 bg-[#040405]/60 max-w-4xl mx-auto flex items-start gap-3.5 text-xs text-[#797979] leading-relaxed">
      <AlertCircle className="w-4 h-4 text-[#F5BF1E] shrink-0 mt-0.5" />
      <p>
        <strong className="text-[#C8C5BA]">تنبيه مهني: </strong>
        التشخيص مبني على الأرقام التي تدخلها ويحدد مناطق تستحق التحقيق والاختبار، وليس حكمًا قاطعًا على جودة الترافيك أو الصفحة أو الإيميلات أو العرض. أفضل قرارات التحسين تأتي من Tracking (تتبع) دقيق واختبارات مضبوطة تتبع منهجية المتغير الواحد.
      </p>
    </div>
  );
};
