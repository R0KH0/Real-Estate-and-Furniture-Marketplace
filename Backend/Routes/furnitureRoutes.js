import express from "express";
import {
  createFurniture,
  getFurnitureList,
  getFurnitureById,
  updateFurniture,
  markAsSold,
  deleteFurniture,
} from "../controllers/furnitureController.js";

const router = express.Router();

router.get("/", getFurnitureList);
router.get("/:id", getFurnitureById);

router.post("/", createFurniture);
router.put("/:id", updateFurniture);
router.patch("/:id/sold", markAsSold);
router.delete("/:id", deleteFurniture);

export default router;
