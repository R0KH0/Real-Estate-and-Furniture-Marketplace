import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "./Config/passport.js";
import connectDB from "./Config/db.js";
import userRoutes from "./Routes/userRoute.js";
import propertyRoutes from "./Routes/propertyRoutes.js";
import path from "path";


dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); 

// Initialize Passport
app.use(passport.initialize());


app.get("/", (req, res) => {
  res.send("Real Estate & Furniture API is running...");
});

//user routes
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}/`));

export default app;