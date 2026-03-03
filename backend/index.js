import express from "express";
import session from "express-session";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
connectDB();

const app = express();

app.use(
  session({
    secret: "aetheros_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* --------------------------
   User Schema
-------------------------- */
const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  accessToken: String
});

const User = mongoose.model("User", userSchema);

/* --------------------------
   Passport Config
-------------------------- */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          accessToken: accessToken
        });
      } else {
        user.accessToken = accessToken;
        await user.save();
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

/* --------------------------
   Routes
-------------------------- */

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.send("GitHub Login Successful");
  }
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});