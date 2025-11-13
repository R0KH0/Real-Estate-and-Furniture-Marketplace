import express from "express";
import passport from "../Config/passport.js";
import { generateToken } from "../Utils/generateToken.js";
import { checkAlreadyLoggedIn } from "../Middlewares/checkAlreadyLoggedIn.js";
import {createUser, loginUser, logoutUser, findUsers } from "../Controllers/userController.js";

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
//logout route
router.post("/logout", logoutUser);

// Route to search users (protected)
router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  findUsers
);

// Route to create a new user
router.post("/create", createUser);


export default router;