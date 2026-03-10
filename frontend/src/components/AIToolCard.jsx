import { useState } from "react";
import { RiExternalLinkLine, RiBookOpenLine, RiDownloadLine, RiCheckLine, RiClipboardLine } from "react-icons/ri";
import "./AIToolCard.css";

const BADGE_CLASS = {
    Free: "badge-green",
    "Free Tier": "badge-cyan",
    Paid: "badge-orange",
};

const TOOL_ICONS = {
    gemini: "✦",
    copilot: "⊕",
    codeium: "◈",
    tabnine: "◉",
    cursor: "⊡",
    supermaven: "◆",
};

// VS Code extension IDs for installable tools
const VSCODE_EXT_IDS = {
    copilot: "GitHub.copilot",
    codeium: "Codeium.codeium",
    tabnine: "TabNine.tabnine-vscode",
    supermaven: "supermaven.supermaven",
};

export default function AIToolCard({ tool }) {
    const [copied, setCopied] = useState(false);
    const [installed, setInstalled] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const vscodeExtId = VSCODE_EXT_IDS[tool.id];

    const handleCopyId = () => {
        if (vscodeExtId) {
            navigator.clipboard.writeText(vscodeExtId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleInstallInVSCode = () => {
        if (vscodeExtId) {
            window.location.href = `vscode:extension/${vscodeExtId}`;
            setInstalled(true);
            setTimeout(() => setInstalled(false), 3000);
        }
    };

    return (
        <div className={`ai-tool-card glass-card ${expanded ? "expanded" : ""}`}>
            {/* Header */}
            <div className="ai-tool-header">
                <div
                    className="ai-tool-icon"
                    style={{ background: `${tool.color}18`, border: `1px solid ${tool.color}40` }}
                >
                    <span style={{ fontSize: 22, color: tool.color }}>{TOOL_ICONS[tool.id] || "◆"}</span>
                </div>
                <div style={{ flex: 1 }}>
                    <h3 className="ai-tool-name">{tool.name}</h3>
                    <span className="ai-tool-category">{tool.category}</span>
                </div>
                <span className={`badge ${BADGE_CLASS[tool.badge] || "badge-blue"}`}>{tool.badge}</span>
            </div>

            {/* Description */}
            <p className="ai-tool-desc">{tool.description}</p>

            {/* Features */}
            <div className="ai-tool-features">
                {tool.features.map((f) => (
                    <span key={f} className="feature-tag">{f}</span>
                ))}
            </div>

            {/* VS Code Install Section */}
            {vscodeExtId && (
                <div className="vscode-install-row">
                    <div className="vscode-ext-id">
                        <code style={{ fontSize: 11, color: "var(--accent-cyan)", background: "transparent" }}>{vscodeExtId}</code>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleCopyId}
                            title="Copy extension ID"
                        >
                            {copied ? <RiCheckLine size={12} style={{ color: "var(--accent-green)" }} /> : <RiClipboardLine size={12} />}
                            {copied ? "Copied!" : "Copy ID"}
                        </button>
                        <button
                            className={`btn btn-sm ${installed ? "btn-ghost" : "btn-primary"}`}
                            onClick={handleInstallInVSCode}
                            title="Install in VS Code"
                        >
                            {installed ? <RiCheckLine size={12} style={{ color: "var(--accent-green)" }} /> : <RiDownloadLine size={12} />}
                            {installed ? "Installing…" : "Install"}
                        </button>
                    </div>
                </div>
            )}

            {/* Expanded details */}
            {expanded && (
                <div className="ai-tool-expanded fade-in">
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        <strong style={{ color: "var(--text-primary)" }}>Integration:</strong>{" "}
                        {tool.id === "gemini" && "Use with the Gemini API — add your API key to .env as GEMINI_API_KEY to enable AI code explanations in Aetheros."}
                        {tool.id === "copilot" && "Requires a GitHub Copilot subscription. Works directly in VS Code, JetBrains, and CLI via 'gh copilot'."}
                        {tool.id === "codeium" && "Completely free. Sign up on codeium.com, install the VS Code extension, and authenticate with your account."}
                        {tool.id === "tabnine" && "Install the VS Code extension and create a free account. Team plan supports custom model training on your codebase."}
                        {tool.id === "cursor" && "Download the Cursor editor from cursor.sh. It's VS Code-based so all your extensions carry over."}
                        {tool.id === "supermaven" && "Install the VS Code extension and sign up for a free account. Offers the largest context window of any autocomplete tool."}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="ai-tool-actions">
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    <RiExternalLinkLine size={13} /> Launch
                </a>
                <a href={tool.docsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                    <RiBookOpenLine size={13} /> Docs
                </a>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setExpanded(!expanded)}
                    style={{ marginLeft: "auto" }}
                >
                    {expanded ? "Less ↑" : "More ↓"}
                </button>
            </div>
        </div>
    );
}
