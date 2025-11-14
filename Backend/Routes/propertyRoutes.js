import express from "express";
import passport from "passport";
import multer from "multer";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from "../Controllers/propertyController.js";

const router = express.Router();

// Middleware pour upload images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.get("/search", getProperties);


// 🏠 Routes properties
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// Routes protégées
router.post("/", passport.authenticate("jwt", { session: false }), upload.array("images", 5), createProperty);
router.put("/:id", passport.authenticate("jwt", { session: false }), upload.array("images", 5), updateProperty);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteProperty);

export default router;
