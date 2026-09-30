import { CurrencyCode, DataPeriod, TrafficSource, FunnelInputs, TargetRates } from '../types/funnel';

export const BRAND_CONFIG = {
  brandNameAr: 'محمد عادل',
  brandNameEn: 'Mohamed Adel',
  appNameAr: 'طبيب الفانل',
  appNameEn: 'AFFILIATE FUNNEL DOCTOR',
  philosophyAr: 'شخّص قبل ما تغيّر',
  philosophyEn: 'Diagnose Before You Change',
  sloganAr: 'التسويق بالعمولة نظام… مش رابط.',
  sloganEn: 'Affiliate Marketing Is a System, Not a Link.',
  miniCourseUrl: 'https://affiliate-mini-course.mohamdadel.com/waitlist', // Centralized URL
};

export const BRAND_COLORS = {
  background: '#040405',
  warmBlack: '#23170D',
  darkBronze: '#4A2F15',
  primaryGold: '#F5BF1E',
  lightGold: '#FBD052',
  deepGold: '#A7690C',
  primaryWarmWhite: '#FCFCFA',
  secondaryGray: '#C8C5BA',
  mutedGray: '#797979',
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, { symbol: string; labelAr: string }> = {
  USD: { symbol: '$', labelAr: 'دولار أمريكي ($)' },
  EUR: { symbol: '€', labelAr: 'يورو (€)' },
  GBP: { symbol: '£', labelAr: 'جنيه إسترليني (£)' },
  EGP: { symbol: 'ج.م', labelAr: 'جنيه مصري (ج.م)' },
  SAR: { symbol: 'ر.س', labelAr: 'ريال سعودي (ر.س)' },
  AED: { symbol: 'د.إ', labelAr: 'درهم إماراتي (د.إ)' },
};

export const DATA_PERIODS: { id: DataPeriod; labelAr: string }[] = [
  { id: 'last7', labelAr: 'آخر 7 أيام' },
  { id: 'last30', labelAr: 'آخر 30 يوم' },
  { id: 'last90', labelAr: 'آخر 90 يوم' },
  { id: 'custom', labelAr: 'فترة مخصصة' },
];

export const TRAFFIC_SOURCES: { id: TrafficSource; labelAr: string }[] = [
  { id: 'YouTube', labelAr: 'YouTube (يوتيوب)' },
  { id: 'TikTok', labelAr: 'TikTok (تيك توك)' },
  { id: 'Instagram', labelAr: 'Instagram (إنستجرام)' },
  { id: 'SEO', labelAr: 'SEO (محركات البحث)' },
  { id: 'Meta Ads', labelAr: 'Meta Ads (إعلانات فيسبوك وإنستجرام)' },
  { id: 'Google Ads', labelAr: 'Google Ads (إعلانات جوجل)' },
  { id: 'Email', labelAr: 'Email (قائمة بريدية سابقة)' },
  { id: 'Mixed Traffic', labelAr: 'Mixed Traffic (مصادر متعددة)' },
  { id: 'Other', labelAr: 'أخرى (Other)' },
];

// Presets representing real classic funnel leak scenarios for quick 1-click loading and testing
export interface FunnelPreset {
  id: string;
  nameAr: string;
  descriptionAr: string;
  inputs: FunnelInputs;
  targetRates: TargetRates;
}

export const DEMO_PRESETS: FunnelPreset[] = [
  {
    id: 'optin_leak',
    nameAr: 'زيارات ضخمة والتسجيل قليل (تسريب الـ Landing Page)',
    descriptionAr: '10,000 زائر لكن 150 تسجيل فقط — المشكلة في صفحة الهبوط وتطابق الرسالة، وليس في منتج الأفلييت.',
    inputs: {
      period: 'last30',
      trafficSource: 'Meta Ads',
      visitors: 10000,
      optIns: 150,
      emailClickers: 60,
      sales: 3,
      emailsDelivered: 150,
      commissionPerSale: 50,
      adSpend: 400,
      otherCosts: 50,
      currency: 'USD',
    },
    targetRates: {
      enabled: true,
      targetOptInRate: 20,
      targetLeadToClickRate: 25,
      targetClickToSaleRate: 4,
    },
  },
  {
    id: 'offer_friction',
    nameAr: 'تسجيلات ونقرات قوية والمبيعات صفر (تسريب الـ Offer)',
    descriptionAr: 'التسجيل ممتاز والناس بتضغط من الإيميل، لكن التحويل لصفحة البيع = 0 مبيعات.',
    inputs: {
      period: 'last30',
      trafficSource: 'YouTube',
      visitors: 5000,
      optIns: 1200,
      emailClickers: 320,
      sales: 0,
      emailsDelivered: 1180,
      commissionPerSale: 75,
      adSpend: 0,
      otherCosts: 40,
      currency: 'USD',
    },
    targetRates: {
      enabled: false,
      targetOptInRate: 20,
      targetLeadToClickRate: 20,
      targetClickToSaleRate: 3,
    },
  },
  {
    id: 'email_drop',
    nameAr: 'تسجيل عالي ونقرات الإيميل معدومة (تسريب الـ Email)',
    descriptionAr: 'الناس بتسجل وتأخذ الهدية، لكن مفيش أي حد بيضغط على رابط العرض من سلسلة الإيميلات.',
    inputs: {
      period: 'last30',
      trafficSource: 'SEO',
      visitors: 4000,
      optIns: 800,
      emailClickers: 12,
      sales: 1,
      emailsDelivered: 780,
      commissionPerSale: 60,
      adSpend: 0,
      otherCosts: 30,
      currency: 'USD',
    },
    targetRates: {
      enabled: true,
      targetOptInRate: 20,
      targetLeadToClickRate: 20,
      targetClickToSaleRate: 5,
    },
  },
  {
    id: 'economics_leak',
    nameAr: 'الفانل محقق مبيعات لكن خسران فلوس (تسريب الـ Economics)',
    descriptionAr: 'كل المراحل بتحول بنجاح، لكن تكلفة الاستحواذ (CPA) أعلى من عمولة البيع، مما يسبب خسائر في الميزانية.',
    inputs: {
      period: 'last7',
      trafficSource: 'Google Ads',
      visitors: 8000,
      optIns: 1600,
      emailClickers: 400,
      sales: 20,
      emailsDelivered: 1550,
      commissionPerSale: 40,
      adSpend: 1500,
      otherCosts: 100,
      currency: 'USD',
    },
    targetRates: {
      enabled: false,
      targetOptInRate: 20,
      targetLeadToClickRate: 25,
      targetClickToSaleRate: 5,
    },
  },
];
