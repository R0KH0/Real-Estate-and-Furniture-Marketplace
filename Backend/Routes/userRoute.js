import express from "express";
import passport from "passport";
import {createUser, loginUser} from "../Controllers/userController.js";

const router = express.Router();

//login route
router.post("/login",loginUser);
// Route to create a new user
router.post("/create", createUser);


export default router;