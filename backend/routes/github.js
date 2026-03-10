import express from "express";
import axios from "axios";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Helper: create GitHub API headers
const ghHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
});

// GET /api/github/profile
router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const { data } = await axios.get("https://api.github.com/user", {
            headers: ghHeaders(req.user.accessToken),
        });
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

// GET /api/github/repos
router.get("/repos", isAuthenticated, async (req, res) => {
    try {
        const { sort = "updated", per_page = 30, page = 1 } = req.query;
        const { data } = await axios.get(
            `https://api.github.com/user/repos?sort=${sort}&per_page=${per_page}&page=${page}&affiliation=owner,collaborator`,
            { headers: ghHeaders(req.user.accessToken) }
        );
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

// GET /api/github/events
router.get("/events", isAuthenticated, async (req, res) => {
    try {
        const { data } = await axios.get(
            `https://api.github.com/users/${req.user.username}/events?per_page=30`,
            { headers: ghHeaders(req.user.accessToken) }
        );
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

// GET /api/github/stats
router.get("/stats", isAuthenticated, async (req, res) => {
    try {
        const [profileRes, reposRes] = await Promise.all([
            axios.get("https://api.github.com/user", { headers: ghHeaders(req.user.accessToken) }),
            axios.get("https://api.github.com/user/repos?per_page=100&affiliation=owner", {
                headers: ghHeaders(req.user.accessToken),
            }),
        ]);

        const profile = profileRes.data;
        const repos = reposRes.data;

        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
        const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];

        res.json({
            publicRepos: profile.public_repos,
            followers: profile.followers,
            following: profile.following,
            totalStars,
            totalForks,
            topLanguages: languages.slice(0, 5),
        });
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

// GET /api/github/repo/:owner/:repo — single repo details
router.get("/repo/:owner/:repo", isAuthenticated, async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: ghHeaders(req.user.accessToken),
        });
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

export default router;
