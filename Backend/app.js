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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}/`));

export default app;