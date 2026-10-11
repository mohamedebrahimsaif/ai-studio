import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI with recommended header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper function to call Gemini with model fallback
async function generateWithFallback(options: {
  contents: string;
  responseMimeType?: string;
  systemInstruction?: string;
}) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {};
      if (options.responseMimeType) {
        config.responseMimeType = options.responseMimeType;
      }
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }

      const res = await ai.models.generateContent({
        model,
        contents: options.contents,
        config,
      });

      if (res && res.text) {
        return res.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} attempt failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'The Tiebreaker API' });
});

// Analyze decision endpoint
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { decision, context, options, customCriteria, urgency } = req.body;

    if (!decision || typeof decision !== 'string' || !decision.trim()) {
      return res.status(400).json({ error: 'Please describe the decision you want to make.' });
    }

    const prompt = `You are "The Tiebreaker", an elite strategic decision advisor, executive mentor, and cognitive analyst.
Analyze the following decision dilemma with deep analytical rigor, balanced empathy, and strategic clarity.

DECISION DILEMMA:
"${decision.trim()}"

${context ? `ADDITIONAL CONTEXT & PREFERENCES:\n"${context.trim()}"\n` : ''}
${options && Array.isArray(options) && options.filter((o: string) => o?.trim()).length > 0 ? `SPECIFIC OPTIONS TO EVALUATE:\n${options.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')}\n` : 'Extract the 2 to 3 most distinct, realistic options for this dilemma.'}
${customCriteria && Array.isArray(customCriteria) && customCriteria.length > 0 ? `KEY CRITERIA HIGHLIGHTED BY USER:\n${customCriteria.join(', ')}\n` : 'Generate 4 to 6 comprehensive, balanced criteria (e.g. Financial Impact, Work-Life / Wellbeing, Growth Potential, Risk / Uncertainty, Autonomy / Flexibility, Long-term Alignment).'}
${urgency ? `DECISION URGENCY / TIMEFRAME: ${urgency}\n` : ''}

CRITICAL REQUIREMENTS:
1. Provide a comprehensive, high-quality, actionable breakdown.
2. For each option:
   - Provide 3-5 distinct, concrete PROS with categorical tags ('Financial', 'Career/Growth', 'Wellbeing', 'Time/Effort', 'Risk', 'Relationships', 'Other') and impact ('high', 'medium', 'low').
   - Provide 3-5 distinct, concrete CONS with categorical tags and impact.
   - Complete SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) with 2-4 items each.
3. Compare options on 4-6 criteria with weighted scores (scores from 1 to 10 for each option, plus concise rationale).
4. Deliver "The Tiebreaker Verdict":
   - A decisive executive recommendation with nuanced conditional rules (e.g., "If your top priority is X, choose Option A; if Y, choose Option B").
   - A psychological "Gut Check" test (the inverted coin toss / emotional gut check).
   - The 10-10-10 Rule perspective (how it feels in 10 minutes, 10 months, 10 years).
   - Identification of 2-3 psychological blind spots or cognitive biases (e.g., Sunk Cost Fallacy, Status Quo Bias, Loss Aversion, Impact Bias).
   - 2-3 actionable, low-risk de-risking micro-experiments.
   - Categorize if this is a Type 1 decision (one-way door: high stakes, hard to reverse) or Type 2 decision (two-way door: reversible, fast action favored).

You MUST respond with valid JSON strictly conforming to this structure:
{
  "id": "dec_${Date.now()}",
  "title": "${decision.trim().replace(/"/g, '\\"')}",
  "context": "${(context || '').trim().replace(/"/g, '\\"')}",
  "urgency": "${urgency || 'moderate'}",
  "decisionType": "reversibility_type1" or "reversibility_type2" or "balanced",
  "decisionTypeExplanation": "1-2 sentence explanation of reversibility according to Jeff Bezos' 1-way vs 2-way door framework",
  "options": [
    {
      "id": "opt_1",
      "title": "Clear concise option name",
      "summary": "1-2 sentence description of this path",
      "pros": [
        {
          "id": "p1",
          "text": "Specific pro",
          "impact": "high",
          "category": "Financial",
          "weight": 4
        }
      ],
      "cons": [
        {
          "id": "c1",
          "text": "Specific con",
          "impact": "medium",
          "category": "Risk",
          "weight": 3
        }
      ],
      "swot": {
        "strengths": ["...", "..."],
        "weaknesses": ["...", "..."],
        "opportunities": ["...", "..."],
        "threats": ["...", "..."]
      }
    }
  ],
  "criteria": [
    {
      "id": "crit_1",
      "name": "Criterion Name",
      "description": "Brief description of criterion",
      "importanceWeight": 4,
      "scores": {
        "opt_1": {
          "score": 8,
          "rationale": "Specific rationale"
        }
      }
    }
  ],
  "tiebreakerVerdict": {
    "executiveSummary": "Compelling, sharp summary of the decision landscape and primary recommendation",
    "recommendedOptionId": "opt_1",
    "confidenceLevel": "High",
    "conditionalRules": [
      {
        "condition": "If your primary goal is...",
        "chosenOption": "Option Title"
      }
    ],
    "gutCheckTest": "Psychological gut check prompt regarding subconscious reaction",
    "tenTenTenRule": {
      "in10Minutes": "What you feel immediately after deciding",
      "in10Months": "The practical situation in 10 months",
      "in10Years": "The enduring trajectory in 10 years"
    },
    "hiddenBlindSpots": [
      "Identified cognitive bias or common trap"
    ],
    "deRiskingActions": [
      "Actionable micro-test or low-risk validation step"
    ]
  }
}`;

    const text = await generateWithFallback({
      contents: prompt,
      responseMimeType: 'application/json',
    });

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    parsedData.createdAt = new Date().toISOString();
    res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating decision analysis:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate decision analysis. Please try again.',
    });
  }
});

// Deep Dive follow-up consultation
app.post('/api/deep-dive', async (req, res) => {
  try {
    const { decisionData, userQuestion, chatHistory } = req.body;

    if (!userQuestion || typeof userQuestion !== 'string') {
      return res.status(400).json({ error: 'Please provide a question or scenario to evaluate.' });
    }

    const prompt = `You are "The Tiebreaker", advising a user on their current decision.
Here is the active decision matrix:
Title: "${decisionData?.title || 'Decision'}"
Options: ${JSON.stringify(decisionData?.options?.map((o: any) => ({ id: o.id, title: o.title, summary: o.summary })) || [])}
Current Verdict: "${decisionData?.tiebreakerVerdict?.executiveSummary || ''}"

Conversation history so far:
${JSON.stringify(chatHistory || [])}

User's new question / "What if" scenario:
"${userQuestion}"

Provide a crisp, incisive, practical response:
1. Direct answer / strategic guidance on how this changes the equation.
2. Specific impact on the options (which option becomes stronger or weaker).
3. Recommended next step or counter-tactic.
Keep tone empathetic, authoritative, and direct (under 300 words). Format with clear markdown bullet points.`;

    const answer = await generateWithFallback({
      contents: prompt,
    });

    res.json({
      answer: answer || 'Unable to generate response.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    console.error('Error in deep dive consultation:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process follow-up query.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on port ${PORT}`);
  });
}

startServer();
