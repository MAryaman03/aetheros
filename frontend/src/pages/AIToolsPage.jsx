import { useEffect, useState } from "react";
import { getAITools } from "../api/ai";
import AIToolCard from "../components/AIToolCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiRobotLine } from "react-icons/ri";
import "../components/AIToolCard.css";

const CATEGORIES = ["All", "AI Assistant", "AI Pair Programmer", "AI Completion", "AI IDE"];

export default function AIToolsPage() {
    const [tools, setTools] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All");

    useEffect(() => {
        getAITools()
            .then((r) => { setTools(r.data); setFiltered(r.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setFiltered(category === "All" ? tools : tools.filter((t) => t.category === category));
    }, [category, tools]);

    return (
        <div className="page-content fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">AI Tools</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                        Discover and launch the best AI coding tools, all in one place.
                    </p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-tabs">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`category-tab ${category === cat ? "active" : ""}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <LoadingSpinner message="Loading AI tools..." />
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                    <RiRobotLine size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p>No tools in this category.</p>
                </div>
            ) : (
                <div className="grid-auto stagger">
                    {filtered.map((tool) => <AIToolCard key={tool.id} tool={tool} />)}
                </div>
            )}

            {/* Info Banner */}
            <div className="glass-card ai-info-banner">
                <RiRobotLine size={20} style={{ color: "#6366f1", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Pro tip:</strong> Use GitHub Copilot directly in VS Code, attach your Gemini API key in{" "}
                    <code>.env</code> to enable AI code explanations from Aetheros, and install Codeium for free AI completions.
                </p>
            </div>
        </div>
    );
}
