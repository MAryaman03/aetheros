import passport from "passport";
import GitHubStrategy from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

/* ── GitHub Strategy ─── */
passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists by githubId
                let user = await User.findOne({ githubId: profile.id });

                if (!user) {
                    // Check if user with same email exists (Google account linked)
                    const email = profile.emails?.[0]?.value || "";
                    if (email) user = await User.findOne({ email });

                    if (user) {
                        // Link GitHub to existing Google account
                        user.githubId = profile.id;
                        user.githubAccessToken = accessToken;
                        user.provider = "both";
                        user.avatarUrl = profile.photos?.[0]?.value || user.avatarUrl;
                    } else {
                        user = new User({
                            githubId: profile.id,
                            provider: "github",
                            username: profile.username,
                            displayName: profile.displayName || profile.username,
                            avatarUrl: profile.photos?.[0]?.value || "",
                            profileUrl: profile.profileUrl || "",
                            email,
                            githubAccessToken: accessToken,
                        });
                    }
                } else {
                    user.githubAccessToken = accessToken;
                    user.avatarUrl = profile.photos?.[0]?.value || user.avatarUrl;
                    user.displayName = profile.displayName || user.displayName;
                }

                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

/* ── Google Strategy ─── */
passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    const email = profile.emails?.[0]?.value || "";
                    if (email) user = await User.findOne({ email });

                    if (user) {
                        // Link Google to existing GitHub account
                        user.googleId = profile.id;
                        user.googleAccessToken = accessToken;
                        user.provider = "both";
                    } else {
                        user = new User({
                            googleId: profile.id,
                            provider: "google",
                            username: profile.displayName?.replace(/\s+/g, "").toLowerCase() || `user_${profile.id.slice(0, 6)}`,
                            displayName: profile.displayName || "",
                            avatarUrl: profile.photos?.[0]?.value || "",
                            email: profile.emails?.[0]?.value || "",
                            googleAccessToken: accessToken,
                        });
                    }
                } else {
                    user.googleAccessToken = accessToken;
                    user.displayName = profile.displayName || user.displayName;
                    user.avatarUrl = profile.photos?.[0]?.value || user.avatarUrl;
                }

                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

/* ── Serialize / Deserialize ─── */
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
