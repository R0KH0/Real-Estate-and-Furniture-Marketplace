import express from "express";
import { generateToken } from "../Utils/generateToken.js";
import { checkAlreadyLoggedIn } from "../Middlewares/checkAlreadyLoggedIn.js";
import {createUser, loginUser, logoutUser } from "../Controllers/userController.js";

const router = express.Router();

//login route
router.post(
  "/login",
  checkAlreadyLoggedIn, // prevents logging in twice
  loginUser,            // validates credentials
  generateToken,        // generates JWT cookie
  (req, res) => {
    res.status(200).json({ message: "Login successful" });
  }
);

router.post("/logout", logoutUser);
// Route to create a new user
router.post("/create", createUser);


export default router;