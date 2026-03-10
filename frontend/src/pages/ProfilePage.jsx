import { useEffect, useState } from "react";
import { getGithubProfile, getGithubRepos, getGithubStats } from "../api/github";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiGithubFill, RiMapPinLine, RiBuildingLine, RiLinkM, RiStarLine, RiGitRepositoryLine, RiGroupLine } from "react-icons/ri";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [topRepos, setTopRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getGithubProfile(), getGithubStats(), getGithubRepos({ sort: "updated", per_page: 5 })])
            .then(([p, s, r]) => { setProfile(p.data); setStats(s.data); setTopRepos(r.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner message="Loading your profile..." />;

    const p = profile || {};

    return (
        <div className="page-content fade-in">
            <h1 className="page-title" style={{ marginBottom: 24 }}>Profile</h1>

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
                {/* Profile Card */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="glass-card" style={{ padding: 28, textAlign: "center" }}>
                        <img
                            src={p.avatar_url || `https://github.com/${user?.username}.png`}
                            alt={p.login}
                            style={{ width: 100, height: 100, borderRadius: "50%", border: "3px solid rgba(99,102,241,0.4)", marginBottom: 16 }}
                        />
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{p.name || p.login}</h2>
                        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>@{p.login}</p>
                        {p.bio && <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>{p.bio}</p>}

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left", fontSize: 13 }}>
                            {p.company && (
                                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)" }}>
                                    <RiBuildingLine size={14} style={{ color: "var(--text-muted)" }} /> {p.company}
                                </span>
                            )}
                            {p.location && (
                                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)" }}>
                                    <RiMapPinLine size={14} style={{ color: "var(--text-muted)" }} /> {p.location}
                                </span>
                            )}
                            {p.blog && (
                                <a href={p.blog.startsWith("http") ? p.blog : `https://${p.blog}`} target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", gap: 8, color: "#818cf8" }}>
                                    <RiLinkM size={14} /> {p.blog}
                                </a>
                            )}
                        </div>

                        <a
                            href={`https://github.com/${p.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
                        >
                            <RiGithubFill size={14} /> View on GitHub
                        </a>
                    </div>

                    <button className="btn btn-ghost" onClick={logout} style={{ width: "100%", justifyContent: "center", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
                        Sign Out
                    </button>
                </div>

                {/* Stats & Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div className="grid-3">
                        {[
                            { icon: RiGitRepositoryLine, label: "Repos", value: p.public_repos ?? "—", color: "#6366f1" },
                            { icon: RiGroupLine, label: "Followers", value: p.followers ?? "—", color: "#10b981" },
                            { icon: RiStarLine, label: "Total Stars", value: stats?.totalStars ?? "—", color: "#f59e0b" },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div key={label} className="stat-card">
                                <div style={{ color, width: 36, height: 36, background: `${color}18`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                                    <Icon size={18} />
                                </div>
                                <div className="stat-value">{value}</div>
                                <div className="stat-label">{label}</div>
                            </div>
                        ))}
                    </div>

                    {stats?.topLanguages?.length > 0 && (
                        <div className="glass-card" style={{ padding: "18px 22px" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Top Languages</h3>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {stats.topLanguages.map((l) => <span key={l} className="badge badge-blue">{l}</span>)}
                            </div>
                        </div>
                    )}

                    <div className="glass-card" style={{ padding: "18px 22px" }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Recent Repositories</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {topRepos.map((repo) => (
                                <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "var(--bg-glass)", fontSize: 13, color: "var(--text-secondary)", transition: "var(--transition)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-glass-hover)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "var(--bg-glass)"}
                                >
                                    <span style={{ color: "#818cf8", fontWeight: 500 }}>{repo.name}</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 12 }}>
                                        <RiStarLine size={12} /> {repo.stargazers_count}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: "18px 22px" }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Account Info</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                            {[
                                { label: "Username", value: p.login },
                                { label: "Member since", value: p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "—" },
                                { label: "Public Gists", value: p.public_gists ?? "—" },
                                { label: "Following", value: p.following ?? "—" },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
