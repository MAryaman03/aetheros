import mongoose from "mongoose";

const codeChunkSchema = new mongoose.Schema({
  project: String,
  filePath : String,
  content : String
});

export default mongoose.model("codeChunk", codeChunkSchema);