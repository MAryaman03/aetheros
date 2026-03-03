import express from "express";
import passport from "../config/passport.js";

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.send("GitHub Login Successful");
  }
);

export default router;