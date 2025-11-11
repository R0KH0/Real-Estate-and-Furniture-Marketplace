import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import furnitureRoutes from "./Routes/furnitureRoutes.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Real Estate & Furniture API is running...");
});

app.use("/api/furniture", furnitureRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}/`));

export default app;