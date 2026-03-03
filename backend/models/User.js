/* --------------------------
   User Schema
-------------------------- */
// const userSchema = new mongoose.Schema({
//   githubId: String,
//   username: String,
//   accessToken: String
// });

// const User = mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  accessToken: String
});

export default mongoose.model("User", userSchema);