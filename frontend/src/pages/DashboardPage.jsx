import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGithubStats, getGithubEvents, getGithubRepos } from "../api/github";
import ActivityFeed from "../components/ActivityFeed";
import RepoCard from "../components/RepoCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiGitRepositoryLine, RiStarLine, RiUserFollowLine, RiGitForkLine, RiRobotLine, RiCodeBoxLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import "../components/ActivityFeed.css";

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getGithubStats(),
            getGithubEvents(),
            getGithubRepos({ sort: "updated", per_page: 6 }),
        ])
            .then(([s, e, r]) => {
                setStats(s.data);
                setEvents(e.data);
                setRepos(r.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

    const STAT_ITEMS = [
        { icon: RiGitRepositoryLine, label: "Public Repos", value: stats?.publicRepos ?? "—", color: "#6366f1" },
        { icon: RiStarLine, label: "Total Stars", value: stats?.totalStars ?? "—", color: "#f59e0b" },
        { icon: RiGitForkLine, label: "Total Forks", value: stats?.totalForks ?? "—", color: "#22d3ee" },
        { icon: RiUserFollowLine, label: "Followers", value: stats?.followers ?? "—", color: "#10b981" },
    ];

    return (
        <div className="page-content fade-in">
            {/* Welcome */}
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">
                        Welcome back, <span className="gradient-text">{user?.displayName || user?.username}</span> 👋
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                        Here's what's happening with your GitHub account.
                    </p>
                </div>
                <img
                    src={user?.avatarUrl || `https://github.com/${user?.username}.png`}
                    alt={user?.username}
                    className="dashboard-avatar"
                />
            </div>

            {/* Stats */}
            <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
                {STAT_ITEMS.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="stat-card">
                        <div className="stat-icon" style={{ color, background: `${color}18` }}>
                            <Icon size={20} />
                        </div>
                        <div className="stat-value">{value}</div>
                        <div className="stat-label">{label}</div>
                    </div>
                ))}
            </div>

            {/* Top Languages */}
            {stats?.topLanguages?.length > 0 && (
                <div className="glass-card" style={{ padding: "20px 24px", marginBottom: 28 }}>
                    <h3 className="section-label">Top Languages</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                        {stats.topLanguages.map((lang) => (
                            <span key={lang} className="badge badge-blue">{lang}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid-2" style={{ marginBottom: 32 }}>
                <Link to="/ai-tools" className="quick-action glass-card">
                    <RiRobotLine size={24} className="qa-icon" style={{ color: "#8b5cf6" }} />
                    <div>
                        <p className="qa-title">Explore AI Tools</p>
                        <p className="qa-desc">Gemini, Copilot, Codeium & more</p>
                    </div>
                </Link>
                <Link to="/ide" className="quick-action glass-card">
                    <RiCodeBoxLine size={24} className="qa-icon" style={{ color: "#22d3ee" }} />
                    <div>
                        <p className="qa-title">Open in VS Code</p>
                        <p className="qa-desc">Clone and open repos instantly</p>
                    </div>
                </Link>
            </div>

            {/* Content Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
                {/* Recent Repos */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h2 className="section-label">Recent Repositories</h2>
                        <Link to="/repositories" style={{ fontSize: 13, color: "#818cf8" }}>View all →</Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {repos.slice(0, 4).map((repo) => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div>
                    <h2 className="section-label" style={{ marginBottom: 16 }}>Recent Activity</h2>
                    <div className="glass-card" style={{ padding: "12px 8px" }}>
                        <ActivityFeed events={events} />
                    </div>
                </div>
            </div>
        </div>
    );
}
