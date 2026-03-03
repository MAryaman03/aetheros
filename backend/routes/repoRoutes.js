import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:owner/:repo", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { owner, repo } = req.params;

  try {
    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      {
        headers: {
          Authorization: `token ${req.user.accessToken}`,
        },
      }
    );

    const files = treeResponse.data.tree;

    const codeFiles = files.filter(file =>
      file.type === "blob" &&
      (
        file.path.endsWith(".js") ||
        file.path.endsWith(".ts") ||
        file.path.endsWith(".py") ||
        file.path.endsWith(".java")
      )
    );

    res.json(codeFiles);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repo files" });
  }
});

export default router;