import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  login: String,
  password: String,
});

export default mongoose.model("User", UserModel);
