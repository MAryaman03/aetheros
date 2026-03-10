import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import "./config/passport.js"; // side-effect: registers passport strategy
import passport from "passport";

import authRouter from "./routes/auth.js";
import githubRouter from "./routes/github.js";
import aiRouter from "./routes/ai.js";
import vscodeRouter from "./routes/vscode.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ─────────────────────────────────────── */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "aetheros_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set true in production with HTTPS
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ── Routes ─────────────────────────────────────────── */

app.use("/auth", authRouter);
app.use("/api/github", githubRouter);
app.use("/api/ai", aiRouter);
app.use("/api/vscode", vscodeRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ── Start Server ────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`✅ Aetheros backend running on http://localhost:${PORT}`);
});