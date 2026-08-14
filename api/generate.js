import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    // Allow your GitHub Pages frontend
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

    // Handle browser CORS preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { prompt } = req.body || {};

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                error: "Prompt is required"
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
            contents: prompt
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