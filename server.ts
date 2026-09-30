import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Diagnosis Endpoint
app.post('/api/diagnose-ai', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'Gemini API key is not configured on the server. Using deterministic diagnosis.',
      });
    }

    const {
      funnelData,
      calculatedMetrics,
      diagnosisMode,
      targetRates,
      trafficSource,
      dataPeriod,
    } = req.body;

    const systemInstruction = `You are an evidence-aware affiliate funnel diagnostic assistant.
Your job is to diagnose where to investigate first, not to guess causes.
Use only the metrics and context supplied.
Never invent benchmarks.
Never state that a page, product, traffic source, email, or offer is bad without sufficient evidence.
Separate:
what the numbers prove
from
what they suggest
from
what still needs testing.
Always prioritize one investigation area at a time.
Teach the principle:
Diagnose before you change.
Always respond in fluent, authoritative, Egyptian-friendly business Arabic.
Show Arabic beside English terms where helpful (e.g. Visitor (زائر), Opt-in (تسجيل), etc.).`;

    const prompt = `Funnel Context:
- Data Period: ${dataPeriod}
- Traffic Source: ${trafficSource}
- Diagnosis Mode: ${diagnosisMode} (Mode A = Target-based, Mode B = Evidence-aware without targets)

Funnel Numbers:
- Visitors: ${funnelData.visitors}
- Opt-ins: ${funnelData.optIns}
- Unique Email Clickers: ${funnelData.emailClickers}
- Sales: ${funnelData.sales}
- Emails Delivered: ${funnelData.emailsDelivered ?? 'Not provided'}
- Commission Per Sale: ${funnelData.commissionPerSale ?? 0}
- Ad Spend: ${funnelData.adSpend ?? 0}
- Other Costs: ${funnelData.otherCosts ?? 0}

Calculated Deterministic Metrics:
- Opt-in Rate: ${calculatedMetrics.optInRateFormatted}%
- Lead to Email Click Rate: ${calculatedMetrics.leadToEmailClickRateFormatted}%
- Email CTR: ${calculatedMetrics.emailCTRFormatted ? calculatedMetrics.emailCTRFormatted + '%' : 'N/A'}
- Click to Sale Rate: ${calculatedMetrics.clickToSaleRateFormatted}%
- Visitor to Sale Rate: ${calculatedMetrics.visitorToSaleRateFormatted}%
- Gross Commission: ${calculatedMetrics.grossCommission}
- Net Profit: ${calculatedMetrics.netProfit}
- CPA: ${calculatedMetrics.cpa !== null ? calculatedMetrics.cpa : 'N/A'}
- Profit Per Sale: ${calculatedMetrics.profitPerSale !== null ? calculatedMetrics.profitPerSale : 'N/A'}
- Expected Value Per Visitor (EPV): ${calculatedMetrics.epv !== null ? calculatedMetrics.epv : 'N/A'}

${
  targetRates
    ? `Target Rates:
- Target Opt-in Rate: ${targetRates.targetOptInRate}%
- Target Lead-to-Click Rate: ${targetRates.targetLeadToClickRate}%
- Target Click-to-Sale Rate: ${targetRates.targetClickToSaleRate}%`
    : 'No Target Rates provided by user (Mode B: Do not invent benchmarks).'
}

Please provide an evidence-grounded diagnosis following this strict JSON format:
{
  "summary": "ملخص تحليلي موجز ودقيق لحالة الفانل بالأرقام",
  "primaryInvestigationStage": "اسم المرحلة الأولى للتحقيق (مثلاً: صفحة التسجيل Landing Page أو الإيميل Email أو العرض Offer أو الاقتصاديات Economics)",
  "reason": "السبب المباشر المبني على الأرقام لاختيار هذه المرحلة كأول نقطة للتحقيق",
  "whatNumbersSay": ["ما تثبته الأرقام قطعياً 1", "ما تثبته الأرقام قطعياً 2"],
  "whatNumbersDoNotSay": ["ما لا تثبته الأرقام ويجب عدم افتراضه 1", "ما لا تثبته الأرقام 2"],
  "possibleCauses": ["احتمال يستحق الاختبار 1", "احتمال يستحق الاختبار 2", "احتمال يستحق الاختبار 3"],
  "fixFirst": {
    "priority": "أول أولوية محددة يجب علاجها قبل أي تغيير آخر",
    "tests": ["اختبار محدد 1", "اختبار محدد 2", "اختبار محدد 3"]
  },
  "doNotChangeYet": {
    "item": "العنصر الذي يُمنع تغييره حالياً",
    "reason": "السبب المالي أو الرياضي لعدم لمس هذا العنصر الآن"
  },
  "trafficDiagnosis": "تحليل مرحلة الترافيك وحجم العينة",
  "landingPageDiagnosis": "تحليل مرحلة صفحة الهبوط وتطابق الرسالة",
  "emailDiagnosis": "تحليل مرحلة الإيميل ووصول الرسائل",
  "offerDiagnosis": "تحليل مرحلة العرض والصفحة البيعية",
  "economicsDiagnosis": "تحليل اقتصاديات الفانل وتكلفة الاكتساب والربحية",
  "sevenDayPlan": [
    {"day": 1, "task": "مهمة اليوم الأول للتحقيق والتدقيق"},
    {"day": 2, "task": "مهمة اليوم الثاني"},
    {"day": 3, "task": "مهمة اليوم الثالث"},
    {"day": 4, "task": "مهمة اليوم الرابع"},
    {"day": 5, "task": "مهمة اليوم الخامس"},
    {"day": 6, "task": "مهمة اليوم السادس"},
    {"day": 7, "task": "مهمة اليوم السابع"}
  ],
  "trackingWarnings": []
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from model');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini diagnosis error:', error);
    return res.status(500).json({
      error: 'DIAGNOSIS_FAILED',
      message: error?.message || 'Failed to generate AI diagnosis',
    });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
