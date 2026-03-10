import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // Identity
        githubId: { type: String, sparse: true, default: null },
        googleId: { type: String, sparse: true, default: null },
        provider: { type: String, enum: ["github", "google", "both"], default: "github" },

        // Profile
        username: { type: String, required: true },
        displayName: { type: String, default: "" },
        avatarUrl: { type: String, default: "" },
        profileUrl: { type: String, default: "" },
        email: { type: String, default: "" },

        // Tokens
        githubAccessToken: { type: String, default: null },
        googleAccessToken: { type: String, default: null },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
