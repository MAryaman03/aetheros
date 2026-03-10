import { useEffect, useState } from "react";
import { getGithubRepos } from "../api/github";
import RepoCard from "../components/RepoCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiSearchLine, RiGitRepositoryLine } from "react-icons/ri";
import "../components/RepoCard.css";

const SORT_OPTIONS = [
    { value: "updated", label: "Recently Updated" },
    { value: "created", label: "Newest" },
    { value: "pushed", label: "Last Pushed" },
    { value: "full_name", label: "Name" },
];

const LANG_OPTIONS = ["All", "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "CSS", "HTML"];

export default function RepositoriesPage() {
    const [repos, setRepos] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("updated");
    const [lang, setLang] = useState("All");

    useEffect(() => {
        getGithubRepos({ sort, per_page: 100 })
            .then((r) => { setRepos(r.data); setFiltered(r.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [sort]);

    useEffect(() => {
        let result = repos;
        if (search) result = result.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase()));
        if (lang !== "All") result = result.filter((r) => r.language === lang);
        setFiltered(result);
    }, [search, lang, repos]);

    return (
        <div className="page-content fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Repositories</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                        {filtered.length} repositor{filtered.length !== 1 ? "ies" : "y"} found
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="repo-filters glass-card">
                <div className="search-box">
                    <RiSearchLine size={16} style={{ color: "var(--text-muted)" }} />
                    <input
                        className="input search-input"
                        placeholder="Search repositories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="input filter-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select
                    className="input filter-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                >
                    {LANG_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>

            {loading ? (
                <LoadingSpinner message="Fetching your repositories..." />
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                    <RiGitRepositoryLine size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p>No repositories found.</p>
                </div>
            ) : (
                <div className="grid-auto stagger">
                    {filtered.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
                </div>
            )}
        </div>
    );
}
