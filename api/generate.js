import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    // CORS
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://liwei03116.github.io"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Browser preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only POST
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const {
            systemPrompt,
            userMessage,
            maxOutputTokens = 8000
        } = req.body || {};

        if (!userMessage || typeof userMessage !== "string") {
            return res.status(400).json({
                error: "userMessage is required"
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not configured");

            return res.status(500).json({
                error: "Gemini API key is not configured on the server"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",

            systemInstruction: systemPrompt || "",

            contents: userMessage,

            config: {
                maxOutputTokens: Number(maxOutputTokens) || 8000,
                responseMimeType: "application/json"
            }
        });

        return res.status(200).json({
            text: response.text || ""
        });

    } catch (error) {
        console.error("Gemini error:", error);

        return res.status(500).json({
            error: error.message || "Gemini request failed"
        });
    }
}