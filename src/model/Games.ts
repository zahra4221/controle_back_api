import mongoose from "mongoose";

export interface stopGame {
  _id: string;
  joueur1: string;
  joueur2: string;
  winner: string;
  bestTime: Number;
  objective: Number;
}

const stopGameSchema = new mongoose.Schema({
  joueur1: { type: String },
  joueur2: { type: String },
  winner: { type: String },
  bestTime: { type: Number },
  objective: { type: Number },
});

export const StopGame = mongoose.model("StopGame", stopGameSchema);
