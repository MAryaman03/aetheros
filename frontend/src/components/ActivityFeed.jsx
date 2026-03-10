import { RiGitCommitLine, RiGitMergeLine, RiGitPullRequestLine, RiStarLine, RiCodeSSlashLine } from "react-icons/ri";

const EVENT_ICONS = {
    PushEvent: RiGitCommitLine,
    PullRequestEvent: RiGitPullRequestLine,
    CreateEvent: RiCodeSSlashLine,
    WatchEvent: RiStarLine,
    MergeEvent: RiGitMergeLine,
};

const EVENT_COLORS = {
    PushEvent: "var(--accent-blue)",
    PullRequestEvent: "var(--accent-violet)",
    CreateEvent: "var(--accent-cyan)",
    WatchEvent: "var(--accent-orange)",
};

function formatEvent(event) {
    const repo = event.repo?.name || "unknown/repo";
    switch (event.type) {
        case "PushEvent":
            return { text: `Pushed ${event.payload?.commits?.length || 1} commit(s) to`, repo };
        case "PullRequestEvent":
            return { text: `${event.payload?.action} a pull request in`, repo };
        case "CreateEvent":
            return { text: `Created ${event.payload?.ref_type || "repository"}`, repo };
        case "WatchEvent":
            return { text: "Starred", repo };
        case "ForkEvent":
            return { text: "Forked", repo };
        default:
            return { text: event.type?.replace("Event", "") || "Activity in", repo };
    }
}

export default function ActivityFeed({ events }) {
    if (!events?.length) {
        return (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0", fontSize: 14 }}>
                No recent activity found.
            </div>
        );
    }

    return (
        <div className="activity-feed">
            {events.slice(0, 15).map((event, i) => {
                const Icon = EVENT_ICONS[event.type] || RiCodeSSlashLine;
                const color = EVENT_COLORS[event.type] || "var(--text-muted)";
                const { text, repo } = formatEvent(event);
                const date = new Date(event.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                });

                return (
                    <div key={event.id || i} className="activity-item fade-in">
                        <div className="activity-icon" style={{ color, background: `${color}18` }}>
                            <Icon size={14} />
                        </div>
                        <div className="activity-body">
                            <p className="activity-text">
                                {text}{" "}
                                <a
                                    href={`https://github.com/${repo}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="activity-repo"
                                >
                                    {repo}
                                </a>
                            </p>
                            <span className="activity-date">{date}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
