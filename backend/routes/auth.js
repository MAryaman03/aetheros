import express from "express";
import passport from "passport";

const router = express.Router();

/* ── GitHub OAuth ─────────────────────────────── */
router.get("/github", passport.authenticate("github", { scope: ["user:email", "read:user", "repo"] }));

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "http://localhost:5173/?error=github_auth_failed" }),
    (req, res) => res.redirect("http://localhost:5173/dashboard")
);

/* ── Google OAuth ─────────────────────────────── */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/?error=google_auth_failed" }),
    (req, res) => res.redirect("http://localhost:5173/dashboard")
);

/* ── Current User ─────────────────────────────── */
router.get("/me", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const { githubId, googleId, provider, username, displayName, avatarUrl, profileUrl, email, createdAt } = req.user;
    res.json({ githubId, googleId, provider, username, displayName, avatarUrl, profileUrl, email, createdAt });
});

/* ── Logout ───────────────────────────────────── */
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("http://localhost:5173/");
    });
});

export default router;
