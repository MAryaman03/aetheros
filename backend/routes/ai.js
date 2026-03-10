import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

const AI_TOOLS = [
    {
        id: "gemini",
        name: "Google Gemini",
        description: "Google's most capable AI model for code understanding, generation, and analysis.",
        category: "AI Assistant",
        url: "https://gemini.google.com",
        docsUrl: "https://ai.google.dev/docs",
        logo: "gemini",
        features: ["Code Generation", "Code Review", "Bug Fixes", "Documentation"],
        badge: "Free Tier",
        color: "#4285F4",
    },
    {
        id: "copilot",
        name: "GitHub Copilot",
        description: "AI pair programmer that helps you write code faster within your editor.",
        category: "AI Pair Programmer",
        url: "https://github.com/features/copilot",
        docsUrl: "https://docs.github.com/en/copilot",
        logo: "copilot",
        features: ["Autocomplete", "Chat", "CLI", "PR Summaries"],
        badge: "Paid",
        color: "#6e40c9",
    },
    {
        id: "codeium",
        name: "Codeium",
        description: "Free AI-powered code acceleration toolkit with support for 70+ languages.",
        category: "AI Completion",
        url: "https://codeium.com",
        docsUrl: "https://codeium.com/docs",
        logo: "codeium",
        features: ["Autocomplete", "Search", "Chat", "Refactoring"],
        badge: "Free",
        color: "#09B6A2",
    },
    {
        id: "tabnine",
        name: "Tabnine",
        description: "Privacy-focused AI code completion with on-device and cloud options.",
        category: "AI Completion",
        url: "https://www.tabnine.com",
        docsUrl: "https://docs.tabnine.com",
        logo: "tabnine",
        features: ["Team Training", "Private Models", "Autocomplete"],
        badge: "Free Tier",
        color: "#B45AF2",
    },
    {
        id: "cursor",
        name: "Cursor",
        description: "The AI-first code editor built on VS Code with deep Copilot++ integration.",
        category: "AI IDE",
        url: "https://cursor.sh",
        docsUrl: "https://docs.cursor.sh",
        logo: "cursor",
        features: ["Codebase Chat", "Edit with AI", "Auto Debug"],
        badge: "Free Tier",
        color: "#FF6B6B",
    },
    {
        id: "supermaven",
        name: "Supermaven",
        description: "The fastest AI code completion with a 300K token context window.",
        category: "AI Completion",
        url: "https://supermaven.com",
        docsUrl: "https://supermaven.com/docs",
        logo: "supermaven",
        features: ["Ultra Fast", "Large Context", "VS Code"],
        badge: "Free",
        color: "#F59E0B",
    },
];

// GET /api/ai/tools
router.get("/tools", isAuthenticated, (req, res) => {
    res.json(AI_TOOLS);
});

// POST /api/ai/explain — placeholder for AI code explanation
router.post("/explain", isAuthenticated, async (req, res) => {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    // Placeholder response — can wire in Gemini/OpenAI API here
    res.json({
        explanation: `This ${language || "code"} snippet performs the following logic. [AI explanation would appear here — connect your Gemini or OpenAI API key in .env to enable real explanations.]`,
        language: language || "unknown",
        tokens: code.length,
    });
});

export default router;
