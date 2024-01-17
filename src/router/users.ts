import { Router } from "express";
import jwt from "jsonwebtoken";
import { DecodeToken, checkToken } from "../middlewares/checkToken";
import UserModel from "../model/User";

export const userRouter = Router();

userRouter.get("/me", checkToken, async (req, res) => {
  const decoded = jwt.decode(req.token!) as DecodeToken;
  try {
    const user = await UserModel.findOne({ _id: decoded.id });
    if (user) {
      const { _id, login } = user;
      res.json({ id: _id, login });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
