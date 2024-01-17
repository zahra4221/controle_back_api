import mongoose from "mongoose";

const tokenBlackListSchema = new mongoose.Schema({
  token: String,
});

export const TokenBlackList = mongoose.model("TokenBlackList", tokenBlackListSchema);
