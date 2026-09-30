export type DataPeriod = 'last7' | 'last30' | 'last90' | 'custom';

export type TrafficSource =
  | 'YouTube'
  | 'TikTok'
  | 'Instagram'
  | 'SEO'
  | 'Meta Ads'
  | 'Google Ads'
  | 'Email'
  | 'Mixed Traffic'
  | 'Other';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'EGP' | 'SAR' | 'AED';

export interface FunnelInputs {
  period: DataPeriod;
  customPeriodLabel?: string;
  trafficSource: TrafficSource;
  visitors: number;
  optIns: number;
  emailClickers: number;
  sales: number;
  emailsDelivered?: number;
  commissionPerSale: number;
  adSpend: number;
  otherCosts: number;
  currency: CurrencyCode;
}

export interface TargetRates {
  enabled: boolean;
  targetOptInRate: number; // in percentage e.g. 20
  targetLeadToClickRate: number; // e.g. 20
  targetClickToSaleRate: number; // e.g. 5
  targetVisitorToSaleRate?: number; // optional
}

export interface CalculatedMetrics {
  optInRate: number; // decimal e.g. 0.20
  optInRateFormatted: string;
  leadToEmailClickRate: number;
  leadToEmailClickRateFormatted: string;
  emailCTR: number | null;
  emailCTRFormatted: string | null;
  clickToSaleRate: number;
  clickToSaleRateFormatted: string;
  visitorToSaleRate: number;
  visitorToSaleRateFormatted: string;
  leadToSaleRate: number;
  leadToSaleRateFormatted: string;

  // Economics
  grossCommission: number;
  totalCosts: number;
  netProfit: number;
  cpa: number | null;
  breakEvenCPA: number;
  profitPerSale: number | null;
  roi: number | null;
  roiFormatted: string | null;
  epv: number | null; // Expected Value Per Visitor
  costPerVisitor: number | null;

  // Drop-offs (raw descriptive numbers)
  dropOffVisitorToOptIn: number;
  dropOffOptInToClick: number;
  dropOffClickToSale: number;
}

export type BottleneckStage =
  | 'Traffic'
  | 'LandingPage'
  | 'Email'
  | 'Offer'
  | 'Economics'
  | 'None';

export type DiagnosticConfidenceLevel = 'low' | 'medium' | 'higher';

export interface TrackingWarning {
  stage: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface TargetStageGap {
  stageKey: BottleneckStage;
  stageNameAr: string;
  stageNameEn: string;
  actualRate: number;
  targetRate: number;
  gap: number;
  performanceRatio: number;
}

export interface DayPlanItem {
  day: number;
  title: string;
  task: string;
}

export interface DiagnosisResult {
  mode: 'target' | 'evidence';
  confidence: DiagnosticConfidenceLevel;
  confidenceReason: string;
  confidenceLabelAr: string;

  primaryBottleneckStage: BottleneckStage;
  primaryStageTitleAr: string;
  primaryStageTitleEn: string;
  primaryReason: string;
  priorityLevel: 'HIGH' | 'MEDIUM' | 'LOW';

  targetAlignmentScore: number | null;
  targetGaps?: TargetStageGap[];

  fixFirst: {
    priority: string;
    tests: string[];
  };

  doNotChangeYet: {
    item: string;
    reason: string;
  };

  whatNumbersSay: string[];
  whatNumbersDoNotSay: string[];
  possibleCauses: string[];

  trafficDiagnosis: string;
  landingPageDiagnosis: string;
  emailDiagnosis: string;
  offerDiagnosis: string;
  economicsDiagnosis: string;

  sevenDayPlan: DayPlanItem[];
  trackingWarnings: TrackingWarning[];
  isAiEnhanced?: boolean;
}

export interface ReverseGoalResult {
  targetSales: number;
  possible: boolean;
  blockReason?: string;
  requiredClicks: number;
  requiredOptIns: number;
  requiredVisitors: number;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  optInRate: number;
  leadToClickRate: number;
  clickToSaleRate: number;
  expectedLeads: number;
  expectedClicks: number;
  expectedSales: number;
  expectedGrossCommission: number;
  expectedNetProfit: number;
}
