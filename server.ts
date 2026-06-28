/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is missing. Running in fallback evaluation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_LOCAL_DEMOS",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Server-side Gemini AI endpoints
app.post("/api/gemini/insights", async (req, res) => {
  try {
    const { task, data } = req.body;
    const client = getGeminiClient();

    if (!process.env.GEMINI_API_KEY) {
      // Clean fallback if API Key isn't populated in workspace yet
      return res.json({
        success: true,
        isFallback: true,
        text: `[FALLBACK INSIGHT] This is a smart simulation since GEMINI_API_KEY is not yet populated. 
        Evaluating task "${task}" for data: ${JSON.stringify(data).substring(0, 80)}... 
        
        AI Assessment:
        - Attendance correlates strongly with the low grades detected in poor student records.
        - Recommend setting due reminders. A proactive SMS/circular prompt can clear outstanding fee balances within 14 days.
        - Next scheduled exams are fully optimized based on previous academic periods.`
      });
    }

    let prompt = "";
    if (task === "predict-performance") {
      prompt = `You are an educational analytics AI counselor. Evaluate this student record and predict future outcomes, risk levels, and actionable suggestions: ${JSON.stringify(data)}. Keep your recommendations modern, smart, and precise in 3 short bullet points. Do not include markdown codeblocks.`;
    } else if (task === "attendance-insights") {
      prompt = `You are a school operations optimizer AI. Review this attendance log statistics: ${JSON.stringify(data)}. Highlight micro patterns of absences, identify risks, and offer 2 operational recommendations. Keep it concise.`;
    } else if (task === "fee-defaulter-prediction") {
      prompt = `You are a school accountant AI. Analyze this outstanding balance log and payment patterns: ${JSON.stringify(data)}. Forecast payment success rates and suggest specific reminders or discount options in 3 lines.`;
    } else if (task === "exam-timetable-generate") {
      prompt = `Act as an academic registrar scheduler. Generate a micro draft schedule of exams for classes ${JSON.stringify(data)}. Match available subjects with teachers, avoiding overlaps. Return in a simple neat format.`;
    } else {
      prompt = `Analyze this state payload for an academic SaaS system: ${JSON.stringify(data)}. task requested: ${task}. Keep response highly actionable.`;
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      text: response.text || "No insights could be generated at this time."
    });
  } catch (err: any) {
    console.error("Gemini API Error in backend:", err);
    res.status(500).json({
      success: false,
      error: err.message || "An unexpected error occurred during AI processing."
    });
  }
});

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body; // array of {role, content}
    const client = getGeminiClient();

    if (!process.env.GEMINI_API_KEY) {
       return res.json({
         success: true,
         isFallback: true,
         text: `Hi there! I am the EduGlide AI assistant. Currently running in demo mode. Ask me anything about student statistics, fee defaults, schedules, and analytics charts!`
       });
    }

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: "You are the central AI EduGlide Assistant for a premium enterprise-level School Operating System. Help school admins, parents and teachers analyze school operations, library books, and attendance records. Keep responses concise, supportive and elegant.",
      }
    });

    res.json({
      success: true,
      text: response.text || "I was unable to process your request."
    });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Vite Middleware for production / development routing
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduGlide Express Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((e) => {
  console.error("Failed to bootstrap server container:", e);
});
