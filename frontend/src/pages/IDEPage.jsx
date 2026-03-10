import { useEffect, useState } from "react";
import { getVSCodeExtensions, getDevContainerTips } from "../api/vscode";
import { getGithubRepos } from "../api/github";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { VscVscode } from "react-icons/vsc";
import {
    RiCodeBoxLine, RiExternalLinkLine, RiInformationLine,
    RiDownloadLine, RiGoogleFill, RiGithubFill, RiCheckLine,
    RiLinkM, RiShieldCheckLine
} from "react-icons/ri";
import "./IDEPage.css";

export default function IDEPage() {
    const { user, loginWithGoogle, loginWithGitHub } = useAuth();
    const [extensions, setExtensions] = useState([]);
    const [tips, setTips] = useState([]);
    const [repos, setRepos] = useState([]);
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [openedRepo, setOpenedRepo] = useState(null);
    const [installedExts, setInstalledExts] = useState({});

    useEffect(() => {
        const calls = [getVSCodeExtensions(), getDevContainerTips()];
        if (user?.githubId) calls.push(getGithubRepos({ per_page: 20, sort: "updated" }));

        Promise.all(calls)
            .then(([ext, t, r]) => {
                setExtensions(ext.data);
                setTips(t.data);
                if (r) setRepos(r.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const openInVSCode = (url, name) => {
        const link = `vscode://vscode.git/clone?url=${encodeURIComponent(url)}`;
        window.location.href = link;
        setOpenedRepo(name);
        setTimeout(() => setOpenedRepo(null), 3000);
    };

    const installExtension = (id) => {
        window.location.href = `vscode:extension/${id}`;
        setInstalledExts((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => setInstalledExts((prev) => ({ ...prev, [id]: false })), 3000);
    };

    if (loading) return <LoadingSpinner message="Loading IDE integrations..." />;

    const hasGitHub = !!user?.githubId;
    const hasGoogle = !!user?.googleId;

    return (
        <div className="page-content fade-in">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <VscVscode style={{ color: "#007ACC", marginRight: 10, verticalAlign: "middle", fontSize: 28 }} />
                        IDE & Workspace
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                        Open repos in VS Code, manage extensions, and connect your accounts.
                    </p>
                </div>
            </div>

            {/* Account Status Section */}
            <div className="ide-accounts-grid" style={{ marginBottom: 28 }}>
                {/* GitHub Account Card */}
                <div className={`ide-account-card glass-card ${hasGitHub ? "connected" : ""}`}>
                    <div className="ide-account-icon" style={{ background: hasGitHub ? "rgba(99,102,241,0.15)" : "var(--bg-glass)", border: hasGitHub ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border)" }}>
                        <RiGithubFill size={24} style={{ color: hasGitHub ? "#818cf8" : "var(--text-muted)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <p style={{ fontSize: 15, fontWeight: 700 }}>GitHub</p>
                            {hasGitHub ? (
                                <span className="badge badge-green"><RiCheckLine size={10} />Connected</span>
                            ) : (
                                <span className="badge badge-orange">Not Connected</span>
                            )}
                        </div>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                            {hasGitHub ? `@${user.username} · Access to repos and activity` : "Connect to access repositories and VS Code integration"}
                        </p>
                    </div>
                    {!hasGitHub && (
                        <button className="btn btn-primary btn-sm" onClick={loginWithGitHub}>
                            <RiGithubFill size={13} /> Connect
                        </button>
                    )}
                    {hasGitHub && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <img src={user.avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.3)" }} />
                        </div>
                    )}
                </div>

                {/* Google Account Card */}
                <div className={`ide-account-card glass-card ${hasGoogle ? "connected-google" : ""}`}>
                    <div className="ide-account-icon" style={{ background: hasGoogle ? "rgba(66,133,244,0.15)" : "var(--bg-glass)", border: hasGoogle ? "1px solid rgba(66,133,244,0.3)" : "1px solid var(--border)" }}>
                        <RiGoogleFill size={22} style={{ color: hasGoogle ? "#4285F4" : "var(--text-muted)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <p style={{ fontSize: 15, fontWeight: 700 }}>Google</p>
                            {hasGoogle ? (
                                <span className="badge badge-blue"><RiCheckLine size={10} />Connected</span>
                            ) : (
                                <span className="badge badge-orange">Not Connected</span>
                            )}
                        </div>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                            {hasGoogle ? `${user.email} · Gemini AI access enabled` : "Connect Google to enable Gemini AI tools"}
                        </p>
                    </div>
                    {!hasGoogle && (
                        <button className="btn btn-google-sm" onClick={loginWithGoogle}>
                            <RiGoogleFill size={13} /> Connect
                        </button>
                    )}
                    {hasGoogle && (
                        <RiShieldCheckLine size={20} style={{ color: "#4285F4" }} />
                    )}
                </div>
            </div>

            {/* Account Linking Info */}
            {(hasGitHub || hasGoogle) && !(hasGitHub && hasGoogle) && (
                <div className="glass-card ide-link-banner" style={{ marginBottom: 24 }}>
                    <RiLinkM size={18} style={{ color: "var(--accent-blue)", flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        <strong style={{ color: "var(--text-primary)" }}>Link your {hasGitHub ? "Google" : "GitHub"} account</strong> —
                        Connect {hasGitHub ? "Google to enable Gemini AI tools" : "GitHub to access repositories and VS Code integration"}.
                        Accounts with the same email address link automatically.
                    </p>
                    <button
                        className={hasGitHub ? "btn btn-google-sm" : "btn btn-primary btn-sm"}
                        onClick={hasGitHub ? loginWithGoogle : loginWithGitHub}
                    >
                        {hasGitHub ? <><RiGoogleFill size={13} /> Link Google</> : <><RiGithubFill size={13} /> Link GitHub</>}
                    </button>
                </div>
            )}

            {/* VS Code Workspace */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                {/* Open Repo */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                        <RiCodeBoxLine size={16} style={{ verticalAlign: "middle", marginRight: 6, color: "#007ACC" }} />
                        Clone & Open in VS Code
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                        Paste any Git URL or pick from your recent repos below.
                    </p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <input
                            className="input"
                            placeholder="https://github.com/your/repo.git"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => repoUrl && openInVSCode(repoUrl, "Custom URL")}
                            style={{ whiteSpace: "nowrap" }}
                        >
                            <VscVscode size={14} /> Open
                        </button>
                    </div>

                    {hasGitHub && repos.length > 0 ? (
                        <>
                            <h4 style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                                Recent Repositories
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
                                {repos.map((repo) => (
                                    <div
                                        key={repo.id}
                                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 6, background: "var(--bg-glass)", gap: 8, transition: "var(--transition)" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-glass-hover)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "var(--bg-glass)"}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {repo.name}
                                            </p>
                                            {repo.language && <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{repo.language}</p>}
                                        </div>
                                        <button
                                            className={`btn btn-sm ${openedRepo === repo.name ? "btn-ghost" : "btn-primary"}`}
                                            style={{ flexShrink: 0 }}
                                            onClick={() => openInVSCode(repo.clone_url, repo.name)}
                                        >
                                            {openedRepo === repo.name ? <RiCheckLine size={12} /> : <VscVscode size={12} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : !hasGitHub ? (
                        <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 13 }}>
                            <p>Connect your GitHub account to see your repositories here.</p>
                        </div>
                    ) : null}
                </div>

                {/* Dev Container Tips */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                        <RiInformationLine size={16} style={{ verticalAlign: "middle", marginRight: 6, color: "#22d3ee" }} />
                        Dev Container Tips
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                        Quick commands to get containerized dev environments running.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {tips.map((tip) => (
                            <div
                                key={tip.title}
                                style={{ background: "var(--bg-glass)", borderRadius: 8, padding: "12px 14px", borderLeft: "3px solid var(--accent-cyan)" }}
                            >
                                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{tip.title}</p>
                                <code style={{ fontSize: 11, color: "#22d3ee", background: "transparent", padding: 0 }}>{tip.tip}</code>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommended Extensions */}
            <div>
                <h2 className="section-label" style={{ marginBottom: 16 }}>
                    <RiDownloadLine size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    Recommended Extensions
                </h2>
                <div className="grid-auto stagger">
                    {extensions.map((ext) => (
                        <div
                            key={ext.id}
                            className="glass-card"
                            style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}
                        >
                            <div style={{
                                width: 38, height: 38, borderRadius: 8,
                                background: installedExts[ext.id] ? "rgba(16,185,129,0.15)" : "rgba(0,122,204,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: installedExts[ext.id] ? "#34d399" : "#007ACC",
                                flexShrink: 0, transition: "var(--transition)"
                            }}>
                                {installedExts[ext.id] ? <RiCheckLine size={18} /> : <VscVscode size={18} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 600 }}>{ext.name}</p>
                                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{ext.publisher}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                <span style={{ fontSize: 12, color: "#f59e0b" }}>★ {ext.rating}</span>
                                <button
                                    className={`btn btn-sm ${installedExts[ext.id] ? "btn-ghost" : "btn-primary"}`}
                                    onClick={() => installExtension(ext.id)}
                                    title="Install in VS Code"
                                >
                                    {installedExts[ext.id] ? <RiCheckLine size={11} /> : <RiExternalLinkLine size={11} />}
                                    {installedExts[ext.id] ? "Installing…" : "Install"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
