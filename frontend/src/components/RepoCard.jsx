import { RiStarLine, RiGitForkLine, RiCodeSSlashLine, RiExternalLinkLine } from "react-icons/ri";
import { VscVscode } from "react-icons/vsc";

const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Ruby: "#701516",
    C: "#555555",
    "C++": "#f34b7d",
    Shell: "#89e051",
    Kotlin: "#A97BFF",
    Swift: "#FA7343",
};

function getLangColor(lang) {
    return LANG_COLORS[lang] || "#8b949e";
}

export default function RepoCard({ repo }) {
    const handleVSCode = (e) => {
        e.preventDefault();
        const url = `vscode://vscode.git/clone?url=${encodeURIComponent(repo.clone_url)}`;
        window.location.href = url;
    };

    return (
        <div className="repo-card glass-card">
            <div className="repo-card-header">
                <div className="repo-name-row">
                    <RiCodeSSlashLine size={16} className="repo-icon" />
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-name"
                    >
                        {repo.name}
                    </a>
                    {repo.private && <span className="badge badge-orange">Private</span>}
                    {repo.fork && <span className="badge badge-cyan">Fork</span>}
                </div>
                <p className="repo-desc">{repo.description || "No description provided."}</p>
            </div>

            <div className="repo-card-meta">
                {repo.language && (
                    <span className="repo-lang">
                        <span
                            className="lang-dot"
                            style={{ background: getLangColor(repo.language) }}
                        />
                        {repo.language}
                    </span>
                )}
                <span className="repo-stat">
                    <RiStarLine size={13} />
                    {repo.stargazers_count}
                </span>
                <span className="repo-stat">
                    <RiGitForkLine size={13} />
                    {repo.forks_count}
                </span>
                <span className="repo-updated">
                    {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
            </div>

            <div className="repo-card-actions">
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                >
                    <RiExternalLinkLine size={13} /> GitHub
                </a>
                <button className="btn btn-primary btn-sm" onClick={handleVSCode}>
                    <VscVscode size={13} /> Open in VS Code
                </button>
            </div>
        </div>
    );
}
