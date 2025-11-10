import express from "express";
import {createUser} from "../Controllers/userController.js";

const router = express.Router();

// Route to create a new user
router.post("/create", createUser);


export default router;