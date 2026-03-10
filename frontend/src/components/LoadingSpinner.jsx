export default function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 60 }}>
            <div className="spinner" />
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{message}</p>
        </div>
    );
}
