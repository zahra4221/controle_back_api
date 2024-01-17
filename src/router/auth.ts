import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../model/User";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const authRouter = Router();

authRouter.post("/add", async (req, res) => {
  const { login, password } = req.body;
  try {
    const userWithlogin = await User.findOne({ login });
    if (userWithlogin) {
      res.status(400).json("login already exists");
    } else {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS!)
      );
      const newUser = new User({ login, password: hashedPassword });
      await newUser.save();
      res.json(newUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

authRouter.post("/connect", async (req, res) => {
  const { login, password } = req.body;
  try {
    const userWithlogin = await User.findOne({ login });
    if (!userWithlogin) {
      res.status(400).json("login or Password is incorrect");
    } else {
      const userPassword = userWithlogin.password
        ? userWithlogin.password.toString()
        : null;
      if (userPassword) {
        const isPasswordCorrect = await bcrypt.compare(password, userPassword);
        if (isPasswordCorrect) {
          const payload = {
            id: userWithlogin._id,
            login: userWithlogin.login,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "1h",
          });
          res.json({
            jwtToken: token,
            ...payload,
          });
        } else {
          res.status(400).json("login or Password is incorrect");
        }
      } else {
        res.status(400).json("login or Password is incorrect");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});
