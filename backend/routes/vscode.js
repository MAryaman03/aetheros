import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

const RECOMMENDED_EXTENSIONS = [
    { id: "github.copilot", name: "GitHub Copilot", publisher: "GitHub", rating: 4.5 },
    { id: "codeium.codeium", name: "Codeium", publisher: "Codeium", rating: 4.7 },
    { id: "eamodio.gitlens", name: "GitLens", publisher: "GitKraken", rating: 4.8 },
    { id: "ms-vscode.vscode-typescript-next", name: "TypeScript Nightly", publisher: "Microsoft", rating: 4.6 },
    { id: "esbenp.prettier-vscode", name: "Prettier", publisher: "Prettier", rating: 4.7 },
    { id: "dbaeumer.vscode-eslint", name: "ESLint", publisher: "Microsoft", rating: 4.6 },
    { id: "ms-azuretools.vscode-docker", name: "Docker", publisher: "Microsoft", rating: 4.5 },
    { id: "ms-python.python", name: "Python", publisher: "Microsoft", rating: 4.7 },
    { id: "bradlc.vscode-tailwindcss", name: "Tailwind CSS IntelliSense", publisher: "Tailwind Labs", rating: 4.8 },
    { id: "pkief.material-icon-theme", name: "Material Icon Theme", publisher: "Philipp Kief", rating: 4.9 },
];

// GET /api/vscode/extensions
router.get("/extensions", isAuthenticated, (req, res) => {
    res.json(RECOMMENDED_EXTENSIONS);
});

// GET /api/vscode/open?repoUrl=<github_clone_url>
// Returns a VS Code deep-link URI to clone and open a remote repo
router.get("/open", isAuthenticated, (req, res) => {
    const { repoUrl } = req.query;
    if (!repoUrl) return res.status(400).json({ error: "repoUrl query param required" });

    // VS Code deep link: vscode://vscode.git/clone?url=<repoUrl>
    const deepLink = `vscode://vscode.git/clone?url=${encodeURIComponent(repoUrl)}`;
    res.json({ deepLink, repoUrl });
});

// GET /api/vscode/devcontainer-tips
router.get("/devcontainer-tips", isAuthenticated, (req, res) => {
    res.json([
        { title: "Add Dev Container", tip: "Press F1 → 'Dev Containers: Add Dev Container Configuration Files'" },
        { title: "Open in Container", tip: "Press F1 → 'Dev Containers: Open Folder in Container'" },
        { title: "Rebuild Container", tip: "Press F1 → 'Dev Containers: Rebuild Container'" },
        { title: "Forward Port", tip: "In PORTS tab, click 'Forward a Port' to expose your dev server" },
    ]);
});

export default router;
