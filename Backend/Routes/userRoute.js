import express from "express";
import passport from "../Config/passport.js";
import { generateToken } from "../Utils/generateToken.js";
import { checkAlreadyLoggedIn } from "../Middlewares/checkAlreadyLoggedIn.js";
import { createUser, loginUser, logoutUser, findUsers , updateUser } from "../Controllers/userController.js";
import { canUpdateUser } from "../Middlewares/canUpdateUser.js";

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

// update user route
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }), 
  canUpdateUser, 
  updateUser
);

// Route to create a new user
router.post("/create", createUser);


export default router;