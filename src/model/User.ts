import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  username: String,
  password: String,
});

export default mongoose.model("User", UserModel);
