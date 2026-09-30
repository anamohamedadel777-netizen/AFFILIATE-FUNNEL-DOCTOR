import {
  CalculatedMetrics,
  FunnelInputs,
  ReverseGoalResult,
  TargetRates,
  TrackingWarning,
  WhatIfScenario,
} from '../types/funnel';

/**
 * Format percentage helper (e.g. 0.1234 -> "12.3%")
 */
export function formatPercentage(val: number, decimals: number = 1): string {
  if (isNaN(val) || !isFinite(val)) return '0.0';
  return (val * 100).toFixed(decimals);
}

/**
 * Format currency amount cleanly
 */
export function formatCurrency(amount: number, symbol: string): string {
  if (isNaN(amount) || !isFinite(amount)) return `${symbol}0`;
  const isNegative = amount < 0;
  const absVal = Math.abs(amount).toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
  return isNegative ? `-${symbol}${absVal}` : `${symbol}${absVal}`;
}

/**
 * Primary deterministic calculation for Funnel Metrics
 */
export function calculateFunnelMetrics(inputs: FunnelInputs): CalculatedMetrics {
  const visitors = Math.max(0, inputs.visitors || 0);
  const optIns = Math.max(0, inputs.optIns || 0);
  const emailClickers = Math.max(0, inputs.emailClickers || 0);
  const sales = Math.max(0, inputs.sales || 0);
  const emailsDelivered = inputs.emailsDelivered ? Math.max(0, inputs.emailsDelivered) : undefined;
  const commissionPerSale = Math.max(0, inputs.commissionPerSale || 0);
  const adSpend = Math.max(0, inputs.adSpend || 0);
  const otherCosts = Math.max(0, inputs.otherCosts || 0);

  // Conversion rates (safe divide)
  const optInRate = visitors > 0 ? optIns / visitors : 0;
  const leadToEmailClickRate = optIns > 0 ? emailClickers / optIns : 0;
  const emailCTR =
    emailsDelivered !== undefined && emailsDelivered > 0
      ? emailClickers / emailsDelivered
      : null;
  const clickToSaleRate = emailClickers > 0 ? sales / emailClickers : 0;
  const visitorToSaleRate = visitors > 0 ? sales / visitors : 0;
  const leadToSaleRate = optIns > 0 ? sales / optIns : 0;

  // Economics
  const grossCommission = sales * commissionPerSale;
  const totalCosts = adSpend + otherCosts;
  const netProfit = grossCommission - totalCosts;

  const cpa = sales > 0 ? totalCosts / sales : null;
  const breakEvenCPA = commissionPerSale;
  const profitPerSale = cpa !== null ? commissionPerSale - cpa : null;

  const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : null;
  const epv = visitors > 0 ? visitorToSaleRate * commissionPerSale : null;
  const costPerVisitor = visitors > 0 ? adSpend / visitors : null;

  // Raw drop-offs
  const dropOffVisitorToOptIn = Math.max(0, visitors - optIns);
  const dropOffOptInToClick = Math.max(0, optIns - emailClickers);
  const dropOffClickToSale = Math.max(0, emailClickers - sales);

  return {
    optInRate,
    optInRateFormatted: formatPercentage(optInRate),
    leadToEmailClickRate,
    leadToEmailClickRateFormatted: formatPercentage(leadToEmailClickRate),
    emailCTR,
    emailCTRFormatted: emailCTR !== null ? formatPercentage(emailCTR) : null,
    clickToSaleRate,
    clickToSaleRateFormatted: formatPercentage(clickToSaleRate),
    visitorToSaleRate,
    visitorToSaleRateFormatted: formatPercentage(visitorToSaleRate, 2),
    leadToSaleRate,
    leadToSaleRateFormatted: formatPercentage(leadToSaleRate, 2),

    grossCommission,
    totalCosts,
    netProfit,
    cpa,
    breakEvenCPA,
    profitPerSale,
    roi,
    roiFormatted: roi !== null ? `${roi.toFixed(1)}%` : null,
    epv,
    costPerVisitor,

    dropOffVisitorToOptIn,
    dropOffOptInToClick,
    dropOffClickToSale,
  };
}

/**
 * Validate tracking data consistency
 */
export function validateFunnelRelationships(inputs: FunnelInputs): TrackingWarning[] {
  const warnings: TrackingWarning[] = [];

  if (inputs.visitors < 0 || inputs.optIns < 0 || inputs.emailClickers < 0 || inputs.sales < 0) {
    warnings.push({
      stage: 'General',
      message: 'القيم لا يمكن أن تكون أرقاماً سالبة.',
      severity: 'error',
    });
  }

  if (inputs.visitors > 0 && inputs.optIns > inputs.visitors) {
    warnings.push({
      stage: 'LandingPage',
      message: `عدد الـ Opt-ins (${inputs.optIns.toLocaleString()}) أكبر من عدد الـ Visitors (${inputs.visitors.toLocaleString()}). تأكد من إعدادات التتبع أو أن صفحة التسجيل ليست مدخلة بدون الزيارات الكلية.`,
      severity: 'error',
    });
  }

  if (inputs.optIns > 0 && inputs.emailClickers > inputs.optIns) {
    warnings.push({
      stage: 'Email',
      message: `عدد الـ Unique Email Clickers (${inputs.emailClickers.toLocaleString()}) أعلى من عدد الـ Leads (${inputs.optIns.toLocaleString()}). تأكد إنك تدخل Unique Clickers (أشخاص فريدين)، وليس إجمالي عدد النقرات.`,
      severity: 'warning',
    });
  }

  if (inputs.emailClickers > 0 && inputs.sales > inputs.emailClickers) {
    warnings.push({
      stage: 'Offer',
      message: `عدد المبيعات (${inputs.sales.toLocaleString()}) أكبر من عدد النقرات على العرض (${inputs.emailClickers.toLocaleString()}). هل تأتي مبيعات من مسارات أخرى غير رابط الإيميل؟`,
      severity: 'warning',
    });
  }

  if (inputs.sales > 0 && inputs.visitors === 0) {
    warnings.push({
      stage: 'Traffic',
      message: 'تم تسجيل مبيعات بينما عدد الزوار = 0. تأكد من تتبع بداية الفانل بشكل سليم.',
      severity: 'error',
    });
  }

  return warnings;
}

/**
 * Calculate reverse goal planner
 * targetSales -> requiredClicks -> requiredOptIns -> requiredVisitors
 */
export function calculateReverseFunnel(
  targetSales: number,
  metrics: CalculatedMetrics
): ReverseGoalResult {
  const target = Math.max(1, Math.round(targetSales));

  if (metrics.clickToSaleRate <= 0) {
    return {
      targetSales: target,
      possible: false,
      blockReason: 'معدل التحويل من النقرة إلى المبيعة (Click-to-Sale Rate) حالياً = 0%. لا يمكن حساب الهدف حتى تحقق مبيعة واحدة لتحديد معدل التحويل، أو يمكنك افتراض معدل مستهدف في What-If Lab.',
      requiredClicks: 0,
      requiredOptIns: 0,
      requiredVisitors: 0,
    };
  }

  if (metrics.leadToEmailClickRate <= 0) {
    return {
      targetSales: target,
      possible: false,
      blockReason: 'معدل التحويل من الـ Lead إلى نقرة الإيميل حالياً = 0%. أصلح مرحلة الإيميل أولاً لتتمكن من احتساب تدفق الزوار المطلوب.',
      requiredClicks: 0,
      requiredOptIns: 0,
      requiredVisitors: 0,
    };
  }

  if (metrics.optInRate <= 0) {
    return {
      targetSales: target,
      possible: false,
      blockReason: 'معدل التسجيل في صفحة الهبوط حالياً = 0%. أصلح صفحة الهبوط أولاً لتتمكن من احتساب الزوار.',
      requiredClicks: 0,
      requiredOptIns: 0,
      requiredVisitors: 0,
    };
  }

  const requiredClicks = Math.ceil(target / metrics.clickToSaleRate);
  const requiredOptIns = Math.ceil(requiredClicks / metrics.leadToEmailClickRate);
  const requiredVisitors = Math.ceil(requiredOptIns / metrics.optInRate);

  return {
    targetSales: target,
    possible: true,
    requiredClicks,
    requiredOptIns,
    requiredVisitors,
  };
}

/**
 * What-If scenario calculation
 */
export function calculateScenario(
  visitors: number,
  optInRatePct: number,
  leadToClickRatePct: number,
  clickToSaleRatePct: number,
  commissionPerSale: number,
  totalCosts: number
): {
  leads: number;
  clicks: number;
  sales: number;
  grossCommission: number;
  netProfit: number;
} {
  const optInRate = Math.max(0, optInRatePct / 100);
  const leadToClickRate = Math.max(0, leadToClickRatePct / 100);
  const clickToSaleRate = Math.max(0, clickToSaleRatePct / 100);

  const leads = Math.round(visitors * optInRate);
  const clicks = Math.round(leads * leadToClickRate);
  const sales = Math.round(clicks * clickToSaleRate);
  const grossCommission = sales * commissionPerSale;
  const netProfit = grossCommission - totalCosts;

  return { leads, clicks, sales, grossCommission, netProfit };
}
