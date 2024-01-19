import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { authRouter } from "./router/auth";
import { userRouter } from "./router/users";
import { stopGameRouter } from "./router/games";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let readyPlayers: string[] = [];
let times: (number | null)[] = [null, null];
let objective: number;
let startTime: number;

io.on("connection", (socket) => {
  console.log("utilisateur connecté");

  socket.on("ready", () => {
    readyPlayers.push(socket.id);
    if (readyPlayers.length === 2) {
      startGame(times, objective);
    }
  });

  socket.on("play", (time) => {
    const playerIndex = readyPlayers.indexOf(socket.id);
    times[playerIndex] = time;
    checkEndGame(
      times,
      () => determineWinner(readyPlayers),
      (winner) => endGame(times, readyPlayers, io)
    );
  });
});

function startGame(times: (number | null)[], objective: number) {
  objective = Math.floor(Math.random() * 10000);
  startTime = Date.now();

  readyPlayers.forEach((playerId) => {
    io.to(playerId).emit("game-start", objective);
  });
}

function checkEndGame(
  times: (number | null)[],
  determineWinner: () => string,
  endGame: (winner: string) => void
) {
  if (times.every((t) => t !== null)) {
    const winner = determineWinner();
    endGame(winner);
  }
}

function determineWinner(readyPlayers: string[]): string {
  return readyPlayers[0];
}
function endGame(times: (number | null)[], readyPlayers: string[], io: Server) {
  readyPlayers.forEach((playerId) => {
    io.to(playerId).emit("game-end", determineWinner(readyPlayers), times);
  });
  readyPlayers = [];
  times = [null, null];
}

mongoose
  .connect(
    "mongodb+srv://zahra:123soleil@controle.m3byfyj.mongodb.net/?retryWrites=true&w=majority",
    {}
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/games", stopGameRouter);
apiRouter.use("/users", userRouter);
app.use("/", apiRouter);

const PORT = process.env.PORT || 3012;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
