import { Router } from "express";
import { StopGame } from "../model/Games";
import { checkToken } from "../middlewares/checkToken";

export const stopGameRouter = Router();

stopGameRouter.get("/", checkToken, async (req, res) => {
  try {
    const games = await StopGame.find({});
    res.status(200).json({ data: games });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des données des jeux.",
    });
  }
});

stopGameRouter.get("/:id", checkToken, async (req, res) => {
  try {
    const stopGame = await StopGame.findById(req.params.id);
    if (stopGame) {
      res.json({ data: stopGame });
    } else {
      res.status(404).send("Game not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

stopGameRouter.post("/", checkToken, async (req, res) => {
  const { joueur1, joueur2, winner, bestTime, objective } = req.body;

  if (!joueur1 || !joueur2 || !winner || !bestTime || !objective) {
    return res.status(400).send("Missing required information");
  }

  try {
    const newStopGame = new StopGame({
      joueur1,
      joueur2,
      winner,
      bestTime,
      objective,
    });
    await newStopGame.save();
    res.status(200).json(newStopGame);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

stopGameRouter.put("/:id", checkToken, async (req, res) => {
  const { joueur1, joueur2, winner, bestTime, objective } = req.body;

  try {
    const stopGame = await StopGame.findByIdAndUpdate(
      req.params.id,
      {
        joueur1,
        joueur2,
        winner,
        bestTime,
        objective,
      },
      { new: true }
    );

    if (stopGame) {
      res.status(200).json({ data: stopGame });
    } else {
      res.status(404).json({ message: "Game not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

stopGameRouter.delete("/:id", checkToken, async (req, res) => {
  try {
    const stopGame = await StopGame.findByIdAndDelete(req.params.id);
    if (stopGame) {
      res.status(200).json({ message: "Game deleted" });
    } else {
      res.status(404).json({ message: "Game not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
