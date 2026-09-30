import {
  BottleneckStage,
  CalculatedMetrics,
  DayPlanItem,
  DiagnosisResult,
  DiagnosticConfidenceLevel,
  FunnelInputs,
  TargetRates,
  TargetStageGap,
  TrackingWarning,
} from '../types/funnel';
import { validateFunnelRelationships } from './calculations';

export function runDiagnosticEngine(
  inputs: FunnelInputs,
  metrics: CalculatedMetrics,
  targetRates: TargetRates
): DiagnosisResult {
  const warnings: TrackingWarning[] = validateFunnelRelationships(inputs);

  // 1. Diagnostic Confidence Calculation (Deterministic)
  let confidenceScore = 0;
  if (inputs.visitors >= 1000) confidenceScore += 2;
  else if (inputs.visitors >= 200) confidenceScore += 1;

  if (inputs.sales >= 10) confidenceScore += 2;
  else if (inputs.sales >= 1) confidenceScore += 1;

  if (inputs.commissionPerSale > 0) confidenceScore += 1;
  if (inputs.adSpend > 0 || inputs.otherCosts > 0) confidenceScore += 1;
  if (targetRates.enabled && targetRates.targetOptInRate > 0) confidenceScore += 2;
  if (inputs.emailsDelivered && inputs.emailsDelivered > 0) confidenceScore += 1;

  // Penalize tracking issues
  if (warnings.some((w) => w.severity === 'error')) confidenceScore -= 3;

  let confidence: DiagnosticConfidenceLevel = 'medium';
  let confidenceLabelAr = 'متوسطة';
  let confidenceReason = 'حجم البيانات مناسب لإعطاء مؤشرات أولية، ولكن يلزم عينة إحصائية أوسع لقرارات كبرى.';

  if (confidenceScore <= 2 || inputs.visitors < 100) {
    confidence = 'low';
    confidenceLabelAr = 'منخفضة';
    confidenceReason =
      'حجم العينة صغير جداً (حركة الزوار أو المبيعات قليلة). البيانات تعطي إشارات لكن لا تبني عليها قرارات جذرية.';
  } else if (confidenceScore >= 6) {
    confidence = 'higher';
    confidenceLabelAr = 'أعلى نسبيًا';
    confidenceReason =
      'البيانات كافية ومكتملة، وتغطي المراحل والاقتصاديات بشكل يسمح بتحديد أولويات التحقيق بدقة عالية.';
  }

  // 2. Evaluate Mode A (Target Mode) vs Mode B (Evidence-Aware)
  const isTargetMode = targetRates.enabled && targetRates.targetOptInRate > 0;

  if (isTargetMode) {
    return runTargetBasedDiagnosis(inputs, metrics, targetRates, confidence, confidenceLabelAr, confidenceReason, warnings);
  } else {
    return runEvidenceBasedDiagnosis(inputs, metrics, confidence, confidenceLabelAr, confidenceReason, warnings);
  }
}

/**
 * MODE A: Target-Based Diagnosis
 */
function runTargetBasedDiagnosis(
  inputs: FunnelInputs,
  metrics: CalculatedMetrics,
  targetRates: TargetRates,
  confidence: DiagnosticConfidenceLevel,
  confidenceLabelAr: string,
  confidenceReason: string,
  warnings: TrackingWarning[]
): DiagnosisResult {
  const targetOptIn = (targetRates.targetOptInRate || 0) / 100;
  const targetLeadToClick = (targetRates.targetLeadToClickRate || 0) / 100;
  const targetClickToSale = (targetRates.targetClickToSaleRate || 0) / 100;

  const gaps: TargetStageGap[] = [];

  // Stage 1: Landing Page
  const optInRatio = targetOptIn > 0 ? metrics.optInRate / targetOptIn : 1;
  gaps.push({
    stageKey: 'LandingPage',
    stageNameAr: 'صفحة التسجيل (Landing Page)',
    stageNameEn: 'Landing Page Opt-in',
    actualRate: metrics.optInRate,
    targetRate: targetOptIn,
    gap: targetOptIn - metrics.optInRate,
    performanceRatio: optInRatio,
  });

  // Stage 2: Email Click
  const leadClickRatio = targetLeadToClick > 0 ? metrics.leadToEmailClickRate / targetLeadToClick : 1;
  gaps.push({
    stageKey: 'Email',
    stageNameAr: 'تفاعل الإيميل (Email Click)',
    stageNameEn: 'Lead to Email Click',
    actualRate: metrics.leadToEmailClickRate,
    targetRate: targetLeadToClick,
    gap: targetLeadToClick - metrics.leadToEmailClickRate,
    performanceRatio: leadClickRatio,
  });

  // Stage 3: Offer Conversion
  const clickSaleRatio = targetClickToSale > 0 ? metrics.clickToSaleRate / targetClickToSale : 1;
  gaps.push({
    stageKey: 'Offer',
    stageNameAr: 'تحويل العرض (Offer Conversion)',
    stageNameEn: 'Click to Sale',
    actualRate: metrics.clickToSaleRate,
    targetRate: targetClickToSale,
    gap: targetClickToSale - metrics.clickToSaleRate,
    performanceRatio: clickSaleRatio,
  });

  // Calculate Target Alignment Score (0 to 100)
  const avgRatio = Math.min(1.5, (optInRatio + leadClickRatio + clickSaleRatio) / 3);
  const targetAlignmentScore = Math.max(0, Math.min(100, Math.round(avgRatio * 100)));

  // Check economics condition
  const isLosingMoney = inputs.adSpend > 0 && metrics.netProfit < 0;

  // Find lowest performance ratio (biggest relative gap)
  const sortedGaps = [...gaps].sort((a, b) => a.performanceRatio - b.performanceRatio);
  const primaryWorst = sortedGaps[0];

  let primaryStage: BottleneckStage = primaryWorst.stageKey;
  let primaryTitleAr = primaryWorst.stageNameAr;
  let primaryTitleEn = primaryWorst.stageNameEn;
  let primaryReason = '';

  // If economics are negative and sales exist, check if economics is the urgent bottleneck
  if (isLosingMoney && inputs.sales > 0 && metrics.cpa !== null && metrics.cpa > metrics.breakEvenCPA) {
    if (primaryWorst.performanceRatio > 0.6) {
      primaryStage = 'Economics';
      primaryTitleAr = 'اقتصاديات الفانل (Economics)';
      primaryTitleEn = 'Economics & CPA';
      primaryReason = `الفانل يحقق مبيعات لكن تكلفة الاستحواذ على المبيعة CPA تبلغ (${metrics.cpa.toFixed(1)}) وهي أعلى من عمولة المبيعة (${metrics.breakEvenCPA}). هذا يعني نزيفاً مستمراً في الميزانية.`;
    }
  }

  if (primaryStage !== 'Economics') {
    const actualPct = (primaryWorst.actualRate * 100).toFixed(1);
    const targetPct = (primaryWorst.targetRate * 100).toFixed(1);
    primaryReason = `أكبر فجوة مقارنة بهدفك المستهدف تقع في ${primaryWorst.stageNameAr}. المعدل الفعلي ${actualPct}% مقابل مستهدف ${targetPct}% (نسبة تحقيق الهدف ${Math.round(primaryWorst.performanceRatio * 100)}%).`;
  }

  const { fixFirst, doNotChangeYet, whatNumbersSay, whatNumbersDoNotSay, possibleCauses, sevenDayPlan } =
    generatePrescription(primaryStage, inputs, metrics, true, primaryWorst);

  const stageDiagnoses = buildStageDiagnoses(inputs, metrics);

  return {
    mode: 'target',
    confidence,
    confidenceLabelAr,
    confidenceReason,
    primaryBottleneckStage: primaryStage,
    primaryStageTitleAr: primaryTitleAr,
    primaryStageTitleEn: primaryTitleEn,
    primaryReason,
    priorityLevel: 'HIGH',
    targetAlignmentScore,
    targetGaps: gaps,
    fixFirst,
    doNotChangeYet,
    whatNumbersSay,
    whatNumbersDoNotSay,
    possibleCauses,
    trafficDiagnosis: stageDiagnoses.traffic,
    landingPageDiagnosis: stageDiagnoses.landingPage,
    emailDiagnosis: stageDiagnoses.email,
    offerDiagnosis: stageDiagnoses.offer,
    economicsDiagnosis: stageDiagnoses.economics,
    sevenDayPlan,
    trackingWarnings: warnings,
  };
}

/**
 * MODE B: Evidence-Aware Diagnosis (No Target Rates Provided)
 */
function runEvidenceBasedDiagnosis(
  inputs: FunnelInputs,
  metrics: CalculatedMetrics,
  confidence: DiagnosticConfidenceLevel,
  confidenceLabelAr: string,
  confidenceReason: string,
  warnings: TrackingWarning[]
): DiagnosisResult {
  let primaryStage: BottleneckStage = 'None';
  let primaryTitleAr = 'فانل متوازن نسبياً';
  let primaryTitleEn = 'Balanced Funnel Flow';
  let primaryReason =
    'لا توجد مرحلة مكسورة بالكامل (0%) من البيانات وحدها. استخدم "Target Mode" لمقارنة الأداء بأهدافك، أو اختبر التحسينات تدريجياً.';
  let priorityLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

  // Rule 1: Zero Visitors
  if (inputs.visitors === 0) {
    primaryStage = 'Traffic';
    primaryTitleAr = 'حجم الزيارات (Traffic Volume)';
    primaryTitleEn = 'Traffic';
    primaryReason = 'الفانل لا يحتوي على زوار مسجلين في هذه الفترة. لا يمكن تشخيص المراحل اللاحقة بدون تدفق زيارات كافٍ.';
    priorityLevel = 'HIGH';
  }
  // Rule 2: Visitors > 0 but Opt-ins = 0
  else if (inputs.visitors > 0 && inputs.optIns === 0) {
    primaryStage = 'LandingPage';
    primaryTitleAr = 'صفحة التسجيل (Landing Page)';
    primaryTitleEn = 'Landing Page';
    primaryReason = `دخل الفانل ${inputs.visitors.toLocaleString()} زائر، ولكن عدد التسجيلات = 0. التدفق انقطع بالكامل قبل دخول القائمة. التحقيق الأولي يجب أن ينصب على صفحة الهبوط وتطابق الرسالة.`;
    priorityLevel = 'HIGH';
  }
  // Rule 3: Opt-ins > 0 but Email clicks = 0
  else if (inputs.optIns > 0 && inputs.emailClickers === 0) {
    primaryStage = 'Email';
    primaryTitleAr = 'نقرات الإيميل (Email Sequence)';
    primaryTitleEn = 'Email Flow';
    primaryReason = `لديك ${inputs.optIns.toLocaleString()} عميل محتمل سجّلوا بياناتهم، ولكن لم يضغط أي شخص منهم على رابط العرض في الإيميلات. التسريب يحدث بين التسجيل وقراءة الإيميلات.`;
    priorityLevel = 'HIGH';
  }
  // Rule 4: Email clicks > 0 but Sales = 0
  else if (inputs.emailClickers > 0 && inputs.sales === 0) {
    primaryStage = 'Offer';
    primaryTitleAr = 'العرض والصفحة البيعية (Affiliate Offer)';
    primaryTitleEn = 'Offer / Sales Page';
    primaryReason = `وصل ${inputs.emailClickers.toLocaleString()} شخص فريد إلى صفحة العرض عبر الإيميل، ولكن المبيعات = 0. المشكلة تقع بعد نقرة الإيميل: صفحة البيع، ملاءمة العرض للجمهور، أو احتكاك الدفع.`;
    priorityLevel = 'HIGH';
  }
  // Rule 5: Sales > 0 but Economics heavily negative
  else if (inputs.sales > 0 && inputs.adSpend > 0 && metrics.cpa !== null && metrics.cpa > metrics.breakEvenCPA) {
    primaryStage = 'Economics';
    primaryTitleAr = 'اقتصاديات الفانل (Funnel Economics)';
    primaryTitleEn = 'Economics & Break-Even';
    primaryReason = `الفانل يولد مبيعات ولكن تكلفة المبيعة CPA تبلغ (${metrics.cpa.toFixed(1)}) وهي تفوق عمولة المبيعة (${metrics.breakEvenCPA}). النموذج الحالي خاسر ولا يجب التوسع به قبل ضبط الاقتصاديات.`;
    priorityLevel = 'HIGH';
  }
  // Rule 6: Very small traffic with no sales
  else if (inputs.visitors < 100 && inputs.sales === 0) {
    primaryStage = 'Traffic';
    primaryTitleAr = 'حجم العينة والترافيك (Traffic Sample Size)';
    primaryTitleEn = 'Traffic Sample Size';
    primaryReason = `حجم الزيارات (${inputs.visitors}) صغير إحصائياً ولا يسمح بالحكم على نجاح أو فشل العرض أو الإيميل. اجمع عينة لا تقل عن 500-1000 زائر قبل التغيير الجذري.`;
    priorityLevel = 'MEDIUM';
  }
  // Rule 7: All stages functioning smoothly
  else {
    primaryStage = 'None';
    primaryTitleAr = 'مراحل الفانل تعمل بتدفق إيجابي';
    primaryTitleEn = 'Active Funnel Stream';
    primaryReason =
      'الأرقام تظهر تدفقاً مستمراً من الزيارة وحتى البيع والربح. لا يوجد اختناق حاد واضح. لتحديد المرحلة الأقل كفاءة، فعّل "Target Mode" وقارن بمستهدفاتك.';
    priorityLevel = 'LOW';
  }

  const { fixFirst, doNotChangeYet, whatNumbersSay, whatNumbersDoNotSay, possibleCauses, sevenDayPlan } =
    generatePrescription(primaryStage, inputs, metrics, false);

  const stageDiagnoses = buildStageDiagnoses(inputs, metrics);

  return {
    mode: 'evidence',
    confidence,
    confidenceLabelAr,
    confidenceReason,
    primaryBottleneckStage: primaryStage,
    primaryStageTitleAr: primaryTitleAr,
    primaryStageTitleEn: primaryTitleEn,
    primaryReason,
    priorityLevel,
    targetAlignmentScore: null,
    fixFirst,
    doNotChangeYet,
    whatNumbersSay,
    whatNumbersDoNotSay,
    possibleCauses,
    trafficDiagnosis: stageDiagnoses.traffic,
    landingPageDiagnosis: stageDiagnoses.landingPage,
    emailDiagnosis: stageDiagnoses.email,
    offerDiagnosis: stageDiagnoses.offer,
    economicsDiagnosis: stageDiagnoses.economics,
    sevenDayPlan,
    trackingWarnings: warnings,
  };
}

/**
 * Generate Fix First, Do Not Change Yet, What Numbers Say vs Don't Say, and 7-Day Plan
 */
function generatePrescription(
  stage: BottleneckStage,
  inputs: FunnelInputs,
  metrics: CalculatedMetrics,
  isTargetMode: boolean,
  gapData?: TargetStageGap
): {
  fixFirst: { priority: string; tests: string[] };
  doNotChangeYet: { item: string; reason: string };
  whatNumbersSay: string[];
  whatNumbersDoNotSay: string[];
  possibleCauses: string[];
  sevenDayPlan: DayPlanItem[];
} {
  switch (stage) {
    case 'LandingPage':
      return {
        fixFirst: {
          priority: 'اختبر صفحة الهبوط وتطابق الرسالة (Message Match) قبل تغيير أي شيء آخر.',
          tests: [
            'اختبر Headline (عنوان رئيسي) يخاطب المشكلة الملحة للزائر مباشرة وبوضوح تام.',
            'اختبر Lead Magnet (الهدية المجانية) أكثر تحديداً وسهولة في الاستهلاك الفوري.',
            'راجع تجربة الموبايل (Mobile UX) وسرعة تحميل الصفحة وسهولة حقل التسجيل بدون احتكاك.',
          ],
        },
        doNotChangeYet: {
          item: 'متغيّرش منتج الأفلييت أو صفحة البيع الآن لمجرد أن المبيعات قليلة.',
          reason: 'البيانات تثبت أن الزوار يتسربون في أول خطوة قبل أن يدخلوا القائمة البريدية أو يشاهدوا رابط العرض أصلًا.',
        },
        whatNumbersSay: [
          `نسبة التسجيل الحالية تبلغ ${metrics.optInRateFormatted}% فقط من إجمالي الزوار (${inputs.visitors.toLocaleString()}).`,
          `يحدث تسريب لـ ${metrics.dropOffVisitorToOptIn.toLocaleString()} زائر قبل إدخال بياناتهم.`,
          isTargetMode && gapData
            ? `الفجوة عن المستهدف تصل إلى ${(gapData.gap * 100).toFixed(1)}%.`
            : 'العائق الأكبر أمام وصول الأشخاص إلى المراحل اللاحقة يقع في صفحة التسجيل.',
        ],
        whatNumbersDoNotSay: [
          'الأرقام لا تثبت أن الزوار "غير مهتمين" بالمنتج النهائي.',
          'الأرقام لا تثبت أن منتج الأفلييت سيئ أو أن صفحة البيع فاشلة.',
          'الأرقام لا تعني بالضرورة أن الترافيك سيئ؛ قد يكون العنوان غير متطابق مع الإعلان.',
        ],
        possibleCauses: [
          'عدم تطابق الوعد في الإعلان مع العنوان في صفحة الهبوط (Message Mismatch).',
          'الهدية المجانية (Lead Magnet) عامة ولا تحفز العميل على ترك إيميله.',
          'فورم التسجيل يطلب بيانات كثيرة أو بطيء في التحميل على الهواتف.',
          'الزائر لا يشعر بالأمان أو لا يدرك ما الذي سيحصل عليه فور التسجيل.',
        ],
        sevenDayPlan: [
          { day: 1, title: 'تدقيق تطابق الرسالة', task: 'قارن نص الإعلان الرئيسي بكلمات العنوان الأول في صفحة الهبوط وتأكد من التطابق التام.' },
          { day: 2, title: 'فحص تجربة الهاتف', task: 'افتح الصفحة من 3 هواتف مختلفة وتأكد من سهولة الضغط وظهور الفورم قبل الـ Scroll.' },
          { day: 3, title: 'إعادة صياغة العنوان', task: 'اكتب 3 صيغ للـ Headline تركز على حل مشكلة معينة بدون وعود مبالغ فيها.' },
          { day: 4, title: 'تجهيز نسخة الاختبار (Variant B)', task: 'أنشئ صفحة بديلة تغير فقط العنوان والوصف التعريفي للهدية مع ثبات باقي العناصر.' },
          { day: 5, title: 'بدء Split Test منضبط', task: 'وجّه 50% من الزيارات للنسخة الحالية و 50% للنسخة B دون تغيير مصدر الترافيك.' },
          { day: 6, title: 'مراقبة جودة التسجيلات', task: 'تأكد أن المسجلين الجدد تصلهم رسالة التأكيد والإيميل الأول بنجاح.' },
          { day: 7, title: 'قراءة النتائج واتخاذ القرار', task: 'قارن معدل التحويل بعد 300 زائر على الأقل، واعتمد النسخة الرابحة.' },
        ],
      };

    case 'Email':
      return {
        fixFirst: {
          priority: 'راجع تسليم الإيميلات (Deliverability) وتنسيق الرابط الدعائي داخل الرسالة.',
          tests: [
            'اختبر عناوين رسائل (Subject Lines) شخصية ومثيرة للفضول ترفع نسبة الفتح.',
            'اختبر موقع زر الدعوة للإجراء (CTA) وصياغته بوضوح في أول ونهاية الإيميل.',
            'تحقق من سجلات SPF/DKIM/DMARC للتأكد من عدم وصول الإيميلات لصندوق الـ Spam.',
          ],
        },
        doNotChangeYet: {
          item: 'متغيّرش صفحة الهبوط ولا تزود ميزانية الإعلانات الآن.',
          reason: 'صفحة الهبوط تجمع بالفعل Leads بنجاح، لكن هؤلاء الأشخاص لا يتفاعلون مع رسائلك. زيادة الترافيك ستؤدي فقط لتكديس مشتركين غير متفاعلين.',
        },
        whatNumbersSay: [
          `نسبة تحول المشتركين لنقرات إيميل تبلغ ${metrics.leadToEmailClickRateFormatted}%.`,
          `فقدت الفانل ${metrics.dropOffOptInToClick.toLocaleString()} مشترك بعد التسجيل دون تفاعل مع الروابط.`,
          'الـ Leads موجودون بالقائمة لكن لا يتم توجيههم لصفحة العرض بفاعلية.',
        ],
        whatNumbersDoNotSay: [
          'الأرقام لا تثبت أن المشتركين يكرهون العرض؛ ربما الإيميل لم يصلهم أصلاً.',
          'الأرقام لا تعكس معدل فتح الإيميلات بدقة إذا لم تكن البيانات مسجلة.',
          'الأرقام لا تعني أن الإيميل طويل أو قصير، بل تعني فقط غياب النقرة.',
        ],
        possibleCauses: [
          'مشاكل تسليم تقنية تؤدي لدخول الرسائل لمجلد الترويج أو البريد العشوائي (Spam).',
          'عنوان الإيميل الأول غير واضح أو لا يفي بوعد الهدية المجانية فوراً.',
          'الرابط المؤدي للعرض غير بارز أو يبدو بيعياً بشكل مبالغ فيه يثير الشك.',
          'الفترة الزمنية بين التسجيل وإرسال الإيميل طويلة جداً تسببت في نسيان الزائر.',
        ],
        sevenDayPlan: [
          { day: 1, title: 'فحص الصحة التقنية للإيميل', task: 'أرسل إيميل تجريبي لأداة مثل mail-tester للتأكد من سلامة الدومين ونظافة سجلات التسليم.' },
          { day: 2, title: 'مراجعة أول رسالة ترحيبية', task: 'تأكد أن الإيميل الترحيبي الأول يسلم الهدية مباشرة وبدون لف ودوران في السطر الأول.' },
          { day: 3, title: 'صياغة التمهيد للعرض', task: 'أضف رابط العرض في الإيميل الأول والثاني كحل منطقي للخطوة التالية بعد الهدية.' },
          { day: 4, title: 'إعادة كتابة عناوين السلسلة', task: 'اكتب عناوين إيميلات تركز على الأسئلة أو الأخطاء الشائعة لجذب الانتباه.' },
          { day: 5, title: 'إطلاق تسلسل من 3 إيميلات', task: 'برمج إيميل اليوم 1، اليوم 2، واليوم 3 بروابط تتبع فريدة لكل إيميل.' },
          { day: 6, title: 'فحص النقرات الفريدة', task: 'راقب لوحة تحكم أداة الإيميل وتأكد من احتساب Unique Clicks.' },
          { day: 7, title: 'مقارنة معدل النقر (Click Rate)', task: 'احسب نسبة المشتركين الجدد الذين نقروا على العرض وقارنها بالمعدل السابق.' },
        ],
      };

    case 'Offer':
      return {
        fixFirst: {
          priority: 'افحص التوافق بين وعود الإيميل وصفحة بيع منتج الأفلييت (Audience-Offer Match).',
          tests: [
            'تأكد من أن الرابط التتبعي يعمل وسليم ولا يعطي صفحة خطأ أو يحول لمنتج غير مقصود.',
            'أضف صفحة تكميلية (Bridge Page) تبني الثقة وتجيب عن تساؤلات المشتري قبل صفحة البائع.',
            'اختبر توجيه الزوار لنفس المنتج بعرض أو خصم مختلف إن أمكن.',
          ],
        },
        doNotChangeYet: {
          item: 'متغيّرش إعدادات الترافيك ولا صفحة التسجيل الأولية.',
          reason: 'العميل مشى في الفانل بنجاح حتى ضغط على الرابط. المشكلة تظهر فقط في النقطة الأخيرة بعد الضغط.',
        },
        whatNumbersSay: [
          `وصل ${inputs.emailClickers.toLocaleString()} شخص فريد إلى العرض، ونتج عن ذلك ${inputs.sales} مبيعة (معدل التحويل ${metrics.clickToSaleRateFormatted}%).`,
          `تسرب ${metrics.dropOffClickToSale.toLocaleString()} شخص بعد وصولهم للعرض.`,
          'الفانل يعمل بكفاءة في جذب الجمهور وإيصالهم للعرض، لكن الخطوة النهائية معطلة.',
        ],
        whatNumbersDoNotSay: [
          'الأرقام لا تثبت قطعياً أن المنتج سيئ الجودة (قد يكون سعر الدفع أو البوابة بها عائق).',
          'الأرقام لا تثبت أن الزوار فقراء أو غير قادرين على الشراء.',
          'الأرقام وحدها لا تستبعد احتمالية وجود خلل في كوكيز التتبع (Affiliate Tracking).',
        ],
        possibleCauses: [
          'سعر المنتج لا يناسب توقعات الجمهور التي بنيتها في الإيميل.',
          'صفحة بيع المعلن ضعيفة أو لا توفر إثباتات كافية (Proof / Testimonials).',
          'احتكاك في نموذج الدفع (طرق دفع غير مدعومة في بلدان جمهورك).',
          'مشكلة تتبع لدى شبكة الأفلييت لا تسجل المبيعات بالشكل الصحيح.',
        ],
        sevenDayPlan: [
          { day: 1, title: 'فحص الرابط والـ Cookie', task: 'اضغط بنفسك في نافذة متخفية من الرابط وتحقق من ظهور affiliate ID في شاشة الدفع.' },
          { day: 2, title: 'تحليل صفحة بيع المعلن', task: 'اقرأ صفحة العرض كأنك زائر: هل السعر معقول؟ هل بوابة الدفع سهلة؟' },
          { day: 3, title: 'تصميم صفحة جسر (Bridge Page)', task: 'أنشئ صفحة وسيطة سريعة توضح مزايا المنتج وفيديو مراجعة شخصي منك.' },
          { day: 4, title: 'تجهيز بونص حصري (Bonus)', task: 'أضف بونص مجاني تقدمه من طرفك لكل من يشتري من خلال رابطك لزيادة الجاذبية.' },
          { day: 5, title: 'توجيه نقرات الإيميل للـ Bridge', task: 'عدّل الرابط في الإيميلات ليشمل صفحة الجسر والبونص الترويجي.' },
          { day: 6, title: 'متابعة تفاعل الزوار', task: 'تحقق من الوقت المقضي على صفحة الجسر والتحويل منها لصفحة البيع الرئيسية.' },
          { day: 7, title: 'تقييم مبيعات الأسبوع', task: 'حلل إذا ما كان التحويل ارتفع مع البونص، أو ابدأ بالتفكير في اختبار عرض بديل.' },
        ],
      };

    case 'Economics':
      return {
        fixFirst: {
          priority: 'أوقف زيادة الميزانية فوراً واضبط تكلفة المبيعة (CPA) لتصل إلى نقطة التعادل.',
          tests: [
            'اختبر إيقاف الإعلانات أو الكلمات المفتاحية ذات التكلفة المرتفعة التي لا تأتي بعملاء مؤهلين.',
            'ابحث عن عروض أفلييت ذات عمولات أعلى (High Ticket) أو ذات اشتراك متكرر (Recurring).',
            'اختبر عروض إضافية في الفانل (Upsells / Cross-sells) لرفع القيمة المتوقعة للزائر (EPV).',
          ],
        },
        doNotChangeYet: {
          item: 'إياك أن تزيد الميزانية الإعلانية (Scale) في هذا التوقيت.',
          reason: 'تكبير فانل خاسر مالياً يضاعف الخسارة فقط. التوسع يكون بعد تحقيق هامش ربح مستقر.',
        },
        whatNumbersSay: [
          `تكلفة الاستحواذ على المبيعة CPA تبلغ ${metrics.cpa !== null ? metrics.cpa.toFixed(1) : 'غير محددة'} بينما العمولة ${metrics.breakEvenCPA}.`,
          `صافي الأرباح الحالي يمثل عجزاً بقيمة ${Math.abs(metrics.netProfit).toLocaleString()}.`,
          'الفانل يعمل ميكانيكياً ويحقق مبيعات، لكنه يعاني من اختناق مالي واقتصادي بحت.',
        ],
        whatNumbersDoNotSay: [
          'الأرقام لا تعني أن الحملة الإعلانية فاشلة، بل تعني أن العائد المالي الحالي لا يغطي تكاليف الشراء.',
          'الأرقام لا تعني أنه يجب إغلاق المشروع؛ بل تتطلب تحسين استراتيجية التكلفة.',
          'الأرقام لا تستبعد إمكانية تحويل هؤلاء المشتركين في المستقبل لمبيعات أخرى بدون تكلفة إضافية.',
        ],
        possibleCauses: [
          'تكلفة النقرة (CPC) مرتفعة بسبب استهداف غير دقيق أو منافسة شرسة.',
          'عمولة المنتج منخفضة جداً مقارنة بتكلفة جلب العميل في هذا المجال.',
          'عدم وجود منتجات إضافية أو تسويق لاحق لقائمة الإيميل لزيادة دخل العميل.',
          'حرق الميزانية في مصادر ترافيك غير ربحية.',
        ],
        sevenDayPlan: [
          { day: 1, title: 'وقف الإعلانات الخاسرة', task: 'أوقف فوراً الإعلانات التي تجاوزت تكلفتها عمولة مبيعتين دون تحقيق أي مبيعة.' },
          { day: 2, title: 'حساب نقطة التعادل القصوى', task: 'حدد بالضبط الحد الأقصى لما يمكنك دفعه مقابل الزائر (Max CPC = EPV).' },
          { day: 3, title: 'تحسين نسبة النقر في الإعلان', task: 'اكتب نصوص إعلانات تزيد الـ CTR لتخفيض تكلفة النقرة بنسبة 20-30%.' },
          { day: 4, title: 'البحث عن عروض مساندة', task: 'اختر منتج أفلييت آخر مرتبط يمكن اقتراحه في الإيميل الرابع والخامس مجاناً.' },
          { day: 5, title: 'إعادة توزيع الميزانية', task: 'وجه الميزانية فقط للجمهور أو المصدر الذي أثبت أنه يولد مبيعات حقيقية.' },
          { day: 6, title: 'مراقبة الـ CPA يومياً', task: 'تأكد أن تكلفة اليوم لم تتجاوز حد الأمان المالي المحدد.' },
          { day: 7, title: 'حساب العائد الصافي (ROI)', task: 'تحقق من العودة إلى منطقة التعادل أو الربحية قبل التفكير في أي توسع.' },
        ],
      };

    case 'Traffic':
      return {
        fixFirst: {
          priority: 'احصل على عينة كافية من الزوار المستهدفين قبل محاولة تغيير باقي النظام.',
          tests: [
            'ركز على قناة واحدة للترافيك حتى تجلب منها 500-1000 زائر متصلين بنفس العرض.',
            'تأكد من أن الجمهور الذي تستهدفه يملك الاهتمام الفعلي بالمشكلة التي يحلها العرض.',
            'تحقق من دقة التتبع لتتأكد أن الزيارات تحتسب في أداة التحليلات.',
          ],
        },
        doNotChangeYet: {
          item: 'متغيرش أي نص في الإيميلات أو صفحات العرض بناء على هذه الأرقام القليلة.',
          reason: 'حجم الزيارات غير كافٍ إحصائياً؛ تغيير التفاصيل الآن هو تخمين عشوائي في الظلام.',
        },
        whatNumbersSay: [
          `عدد الزوار المسجلين (${inputs.visitors.toLocaleString()}) ضئيل جداً لتكوين استنتاج مؤكد.`,
          'الفانل يفتقر إلى الوقود الأولي الكافي لتحريك باقي المراحل.',
        ],
        whatNumbersDoNotSay: [
          'الأرقام لا تثبت أن الفانل يعمل أو لا يعمل.',
          'الأرقام لا تثبت فشل العرض.',
        ],
        possibleCauses: [
          'حملة إعلانية بميزانية متدنية جداً أو لم تبدأ بعد.',
          'مشكلة تتبع لا تسجل زوار صفحة الهبوط بشكل سليم.',
          'الاعتماد على مصادر أورجانيك بطيئة في بداية مشوارها.',
        ],
        sevenDayPlan: [
          { day: 1, title: 'التحقق من بكسل التتبع', task: 'تأكد أن أداة التحليلات تسجل زياراتك التجريبية بدقة في الوقت الحقيقي.' },
          { day: 2, title: 'تحديد قناة الترافيك الواحدة', task: 'اختر قناة ترافيك واحدة تناسب مهارتك وميزانيتك ولا تشتت جهدك.' },
          { day: 3, title: 'صياغة 3 محتويات / إعلانات', task: 'جهز 3 زوايا مختلفة لجذب الجمهور إلى صفحة الهبوط.' },
          { day: 4, title: 'بدء ضخ الزيارات', task: 'انشر المحتوى أو أطلق الحملة المستهدفة بهدوء وبميزانية محددة.' },
          { day: 5, title: 'مراقبة أول 100 زائر', task: 'تأكد أن الزوار يقضون وقتاً في الصفحة وتصل بياناتهم للقائمة.' },
          { day: 6, title: 'استكمال العينة المستهدفة', task: 'استمر في تشغيل القناة حتى بلوغ 500 زائر على الأقل.' },
          { day: 7, title: 'إعادة التشخيص', task: 'أعد إدخال الأرقام في Funnel Doctor للحصول على تشخيص عالي الثقة.' },
        ],
      };

    default:
      return {
        fixFirst: {
          priority: 'الفانل يعمل بتوازن عام — اختر مرحلة واحدة فقط وقم بتحسينها عبر A/B testing.',
          tests: [
            'قم بتفعيل Target Mode وحدد أرقام طموحة ترغب في بلوغها.',
            'اختبر تحسين صفحة الهبوط أولاً لزيادة تدفق الـ Leads.',
            'اختبر إضافة بريد إلكتروني رابع وخامس لزيادة عدد مشاهدي العرض.',
          ],
        },
        doNotChangeYet: {
          item: 'لا تغير أكثر من متغير واحد في المرة الواحدة.',
          reason: 'عندما يعمل الفانل بشكل جيد، فإن التغييرات العشوائية قد تدمر التوازن الحالي دون معرفة السبب.',
        },
        whatNumbersSay: [
          'جميع مراحل الفانل تسجل تدفقاً إيجابياً من الزيارة حتى التحويل.',
          'لا توجد نقاط انقطاع صفرية في السلسلة الحالية.',
        ],
        whatNumbersDoNotSay: [
          'الأرقام لا تعني أن الفانل وصل للحد الأقصى من الكفاءة.',
          'الأرقام لا تحدد أين يكمن أقصى تحسين ممكن بدون مقارنة بأهدافك الخاصة.',
        ],
        possibleCauses: [
          'الفانل يعمل بمعدلات مستقرة؛ التحدي القادم هو التوسع وتحسين الهوامش.',
        ],
        sevenDayPlan: [
          { day: 1, title: 'تحديد الأهداف المستهدفة', task: 'حدد في Target Mode ما تريده بدقة لكل مرحلة.' },
          { day: 2, title: 'اختيار مرحلة التحسين', task: 'حدد مرحلة واحدة (مثلاً صفحة الهبوط) للتركيز عليها هذا الأسبوع.' },
          { day: 3, title: 'تجهيز فرضية الاختبار', task: 'اكتب فرضية واضحة: إذا غيرت X، فأتوقع زيادة Y بنسبة Z%.' },
          { day: 4, title: 'إطلاق Split Test منضبط', task: 'شغل الاختبار مع ثبات باقي كل عناصر الفانل دون لمس.' },
          { day: 5, title: 'متابعة تدفق الزيارات', task: 'تأكد أن تقسيم الزيارات يتم بنسبة 50/50 بصورة عادلة.' },
          { day: 6, title: 'فحص الدلالة الإحصائية', task: 'تأكد من اكتمال عدد كافٍ من المشتركين للمقارنة.' },
          { day: 7, title: 'تطبيق التعديل الرابح', task: 'اعتمد النسخة الفائزة وانتقل للأسبوع التالي لدراسة مرحلة أخرى.' },
        ],
      };
  }
}

/**
 * Build individual stage qualitative diagnoses
 */
function buildStageDiagnoses(
  inputs: FunnelInputs,
  metrics: CalculatedMetrics
): {
  traffic: string;
  landingPage: string;
  email: string;
  offer: string;
  economics: string;
} {
  // Traffic
  let traffic = '';
  if (inputs.visitors === 0) {
    traffic = 'لا يوجد زوار مسجلون في هذه الفترة؛ بداية الفانل متوقفة تماماً.';
  } else if (inputs.visitors < 300) {
    traffic = `حجم الزوار قليل (${inputs.visitors.toLocaleString()} زائر)؛ العينة الإحصائية صغيرة والتشخيص أقل ثقة.`;
  } else {
    traffic = `تم تسجيل ${inputs.visitors.toLocaleString()} زائر؛ الحجم مناسب لتحليل المراحل اللاحقة.`;
  }

  // Landing Page
  let landingPage = '';
  if (inputs.visitors > 0 && inputs.optIns === 0) {
    landingPage = 'معدل التسجيل 0%؛ هناك انقطاع كامل عند صفحة الهبوط أو خلل تقني في نموذج التسجيل.';
  } else if (inputs.visitors > 0) {
    landingPage = `معدل التسجيل الفعلي ${metrics.optInRateFormatted}% (${inputs.optIns.toLocaleString()} مشترك من ${inputs.visitors.toLocaleString()} زائر). تحقق من تطابق الرسالة والـ Lead Magnet.`;
  } else {
    landingPage = 'في انتظار تدفق الزوار للتقييم.';
  }

  // Email
  let email = '';
  if (inputs.optIns > 0 && inputs.emailClickers === 0) {
    email = 'معدل النقر 0%؛ المشتركون لا يضغطون على روابط العرض. تحقق من وصول الإيميلات (Spam) ومن وضوح الرابط.';
  } else if (inputs.optIns > 0) {
    email = `نسبة الـ Leads إلى نقرة الإيميل تبلغ ${metrics.leadToEmailClickRateFormatted}% (${inputs.emailClickers.toLocaleString()} شخص فريد).`;
    if (metrics.emailCTRFormatted) {
      email += ` ومعدل النقر من الإيميلات المستلمة (CTR) = ${metrics.emailCTRFormatted}%.`;
    }
  } else {
    email = 'لا يوجد مشتركون بعد لتحليل أداء الإيميل.';
  }

  // Offer
  let offer = '';
  if (inputs.emailClickers > 0 && inputs.sales === 0) {
    offer = 'المبيعات = 0 رغم وصول زوار للعرض عبر الإيميل. تحقق من تطابق العرض مع الجمهور، أو صفحة البائع، أو تتبع الكوكيز.';
  } else if (inputs.emailClickers > 0) {
    offer = `معدل التحويل بعد النقرة (Offer Conversion) = ${metrics.clickToSaleRateFormatted}% (${inputs.sales} مبيعة من ${inputs.emailClickers.toLocaleString()} نقرة فريدة).`;
  } else {
    offer = 'لم يصل نقرات كافية للعرض بعد لتقييم صفحة البيع.';
  }

  // Economics
  let economics = '';
  if (inputs.commissionPerSale === 0 && inputs.adSpend === 0) {
    economics = 'لم يتم إدخال بيانات التكاليف أو العمولات؛ الاقتصاديات غير مفعلة في هذا التحليل.';
  } else if (inputs.sales > 0 && metrics.cpa !== null) {
    if (metrics.cpa > metrics.breakEvenCPA) {
      economics = `الاقتصاديات الحالية تحت نقطة التعادل: تكلفة المبيعة CPA تبلغ (${metrics.cpa.toFixed(1)}) وهي أعلى من العمولة (${metrics.breakEvenCPA}). لا ينصح بالتوسع قبل خفض التكلفة أو رفع التحويل.`;
    } else {
      economics = `الاقتصاديات في النطاق الإيجابي: تكلفة المبيعة (${metrics.cpa.toFixed(1)}) أقل من العمولة (${metrics.breakEvenCPA})، مع صافي ربح ${metrics.netProfit.toLocaleString()}.`;
    }
  } else if (inputs.sales === 0 && inputs.adSpend > 0) {
    economics = `تم إنفاق ${inputs.adSpend.toLocaleString()} بدون تحقيق مبيعات حتى الآن؛ تكلفة الاكتساب غير قابلة للاحتساب حالياً.`;
  } else {
    economics = `إجمالي العمولات المتوقعة: ${metrics.grossCommission.toLocaleString()}، وإجمالي التكاليف: ${metrics.totalCosts.toLocaleString()}.`;
  }

  return { traffic, landingPage, email, offer, economics };
}
