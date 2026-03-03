import express from "express";
import axios from "axios";
import CodeChunk from "../models/CodeChunk.js";
import { chunkText } from "../utils/chunkText.js";

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

    const files = treeResponse.data.tree.filter(file =>
      file.type === "blob" &&
      file.path.endsWith(".js")
    );

    for (let file of files.slice(0, 10)) {
      const fileResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        {
          headers: {
            Authorization: `token ${req.user.accessToken}`,
          },
        }
      );

      const content = Buffer.from(
        fileResponse.data.content,
        "base64"
      ).toString("utf-8");

      const chunks = chunkText(content);

      for (let chunk of chunks) {
        await CodeChunk.create({
          project: repo,
          filePath: file.path,
          content: chunk,
        });
      }
    }

    res.json({ message: "Indexing completed" });

  } catch (error) {
    res.status(500).json({ error: "Indexing failed" });
  }
});

export default router;