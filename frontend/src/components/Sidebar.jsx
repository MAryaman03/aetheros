import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    RiDashboardLine,
    RiGitRepositoryLine,
    RiRobotLine,
    RiCodeBoxLine,
    RiUser3Line,
    RiGithubFill,
    RiGoogleFill,
} from "react-icons/ri";
import "./Sidebar.css";

const navItems = [
    { to: "/dashboard", icon: RiDashboardLine, label: "Dashboard" },
    { to: "/repositories", icon: RiGitRepositoryLine, label: "Repositories" },
    { to: "/ai-tools", icon: RiRobotLine, label: "AI Tools" },
    { to: "/ide", icon: RiCodeBoxLine, label: "IDE / VS Code" },
    { to: "/profile", icon: RiUser3Line, label: "Profile" },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const hasGitHub = !!user?.githubId;
    const hasGoogle = !!user?.googleId;

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">⬡</div>
                <span className="logo-text">Aetheros</span>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`nav-item ${location.pathname === to ? "active" : ""}`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            {/* Provider badges */}
            <div className="sidebar-providers">
                <p className="provider-label">Connected Accounts</p>
                <div style={{ display: "flex", gap: 6 }}>
                    <div className={`provider-badge ${hasGitHub ? "active-github" : "inactive"}`} title={hasGitHub ? "GitHub connected" : "GitHub not connected"}>
                        <RiGithubFill size={13} />
                    </div>
                    <div className={`provider-badge ${hasGoogle ? "active-google" : "inactive"}`} title={hasGoogle ? "Google connected" : "Google not connected"}>
                        <RiGoogleFill size={12} />
                    </div>
                </div>
            </div>

            {/* User footer */}
            <div className="sidebar-footer">
                {user && (
                    <div className="sidebar-user">
                        <img
                            src={user.avatarUrl || `https://github.com/${user.username}.png`}
                            alt={user.username}
                            className="avatar-sm"
                        />
                        <div className="user-info">
                            <p className="user-name">{user.displayName || user.username}</p>
                            <p className="user-handle">@{user.username}</p>
                        </div>
                    </div>
                )}
                <button className="btn btn-ghost btn-sm logout-btn" onClick={logout}>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
