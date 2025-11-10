import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Real Estate & Furniture API is running...");
});

export default app;