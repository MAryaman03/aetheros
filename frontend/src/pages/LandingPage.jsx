import { useAuth } from "../context/AuthContext";
import { RiGithubFill, RiRobotLine, RiCodeBoxLine, RiGitRepositoryLine, RiShieldCheckLine, RiTerminalBoxLine, RiGoogleFill } from "react-icons/ri";
import "./LandingPage.css";

const FEATURES = [
    {
        icon: RiGithubFill,
        title: "GitHub Integration",
        desc: "Auto-connect with your GitHub account. Browse repos, track activity, and analyze your codebase instantly.",
        color: "#6366f1",
    },
    {
        icon: RiRobotLine,
        title: "AI Tools Hub",
        desc: "Access Gemini, GitHub Copilot, Codeium, Tabnine, Cursor, and more — all from one unified dashboard.",
        color: "#8b5cf6",
    },
    {
        icon: RiCodeBoxLine,
        title: "VS Code Integration",
        desc: "Open any repository directly in VS Code with one click. Manage extensions and devcontainers seamlessly.",
        color: "#22d3ee",
    },
    {
        icon: RiGitRepositoryLine,
        title: "Repository Manager",
        desc: "Search, filter, and manage all your repositories with real-time stats, stars, and language breakdowns.",
        color: "#10b981",
    },
    {
        icon: RiShieldCheckLine,
        title: "Secure OAuth",
        desc: "Sign in with GitHub or Google using industry-standard OAuth 2.0. Accounts link automatically by email.",
        color: "#f59e0b",
    },
    {
        icon: RiTerminalBoxLine,
        title: "Developer Insights",
        desc: "Real-time activity feed, contribution stats, top languages, and repository analytics at a glance.",
        color: "#ec4899",
    },
];

export default function LandingPage() {
    const { loginWithGitHub, loginWithGoogle } = useAuth();

    return (
        <div className="landing">
            {/* Background orbs */}
            <div className="hero-bg">
                <div className="hero-orb orb-1" />
                <div className="hero-orb orb-2" />
                <div className="hero-orb orb-3" />
            </div>

            {/* Navbar */}
            <header className="landing-nav container">
                <div className="landing-logo">
                    <span className="logo-glyph">⬡</span>
                    <span className="logo-word">Aetheros</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button className="btn btn-ghost" onClick={loginWithGoogle}>
                        <RiGoogleFill size={15} /> Sign in with Google
                    </button>
                    <button className="btn btn-primary" onClick={loginWithGitHub}>
                        <RiGithubFill size={15} /> Connect GitHub
                    </button>
                </div>
            </header>

            {/* Hero */}
            <main className="hero-section container">
                <div className="hero-badge">
                    <span className="badge badge-blue">✦ AI-Powered Developer Platform</span>
                </div>
                <h1 className="hero-title">
                    Your GitHub.<br />
                    All Your <span className="gradient-text">AI Tools</span>.<br />
                    One Dashboard.
                </h1>
                <p className="hero-subtitle">
                    Aetheros connects your GitHub and Google accounts and unifies all your favorite AI coding tools,
                    so you can discover, code, and ship faster than ever.
                </p>
                <div className="hero-cta">
                    <button className="btn btn-primary btn-lg" onClick={loginWithGitHub}>
                        <RiGithubFill size={20} /> Continue with GitHub
                    </button>
                    <button className="btn btn-google btn-lg" onClick={loginWithGoogle}>
                        <RiGoogleFill size={18} /> Continue with Google
                    </button>
                </div>
                <div className="hero-divider">
                    <span>or explore the features</span>
                </div>
                <div className="hero-stats">
                    <div className="hero-stat"><span className="hero-stat-value">6+</span><span className="hero-stat-label">AI Tools</span></div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat"><span className="hero-stat-value">1-Click</span><span className="hero-stat-label">VS Code Open</span></div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat"><span className="hero-stat-value">2</span><span className="hero-stat-label">Login Providers</span></div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat"><span className="hero-stat-value">Real-time</span><span className="hero-stat-label">GitHub Sync</span></div>
                </div>
            </main>

            {/* Provider Cards */}
            <section className="providers-section container">
                <div className="providers-grid">
                    <div className="provider-card glass-card" onClick={loginWithGitHub} style={{ cursor: "pointer" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                            <RiGithubFill size={28} style={{ color: "#818cf8" }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>GitHub Account</h3>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            Access your repositories, events, and contribution stats. Required for repo management and VS Code integration.
                        </p>
                        <span className="badge badge-blue" style={{ marginTop: 12 }}>Connect</span>
                    </div>
                    <div className="provider-card glass-card" onClick={loginWithGoogle} style={{ cursor: "pointer" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(66,133,244,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                            <RiGoogleFill size={26} style={{ color: "#4285F4" }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Google Account</h3>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            Access Gemini AI tools and sign in with your Google account. Accounts with the same email link automatically.
                        </p>
                        <span className="badge badge-cyan" style={{ marginTop: 12 }}>Connect</span>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="features-section container">
                <div className="section-header">
                    <h2 className="section-title">Everything you need to <span className="gradient-text">ship faster</span></h2>
                    <p className="section-subtitle">Built for modern developers who value their workflow.</p>
                </div>
                <div className="features-grid stagger">
                    {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className="feature-card glass-card">
                            <div className="feature-icon" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                                <Icon size={22} style={{ color }} />
                            </div>
                            <h3 className="feature-title">{title}</h3>
                            <p className="feature-desc">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-section container">
                <div className="cta-card">
                    <div className="cta-orb" />
                    <h2 className="cta-title">Ready to supercharge your workflow?</h2>
                    <p className="cta-subtitle">Connect your accounts in seconds and start exploring.</p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <button className="btn btn-primary btn-lg" onClick={loginWithGitHub}>
                            <RiGithubFill size={20} /> Continue with GitHub
                        </button>
                        <button className="btn btn-google btn-lg" onClick={loginWithGoogle}>
                            <RiGoogleFill size={18} /> Continue with Google
                        </button>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2026 Aetheros. Built for developers, by developers.</p>
            </footer>
        </div>
    );
}
