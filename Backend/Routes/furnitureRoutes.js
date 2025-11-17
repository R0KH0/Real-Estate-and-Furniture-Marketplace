import express from "express";
import passport from "passport";
import {
  createFurniture,
  getFurnitureList,
  getFurnitureById,
  updateFurniture,
  markAsSold,
  deleteFurniture,
} from "../Controllers/furnitureController.js";

const router = express.Router();

router.get("/", getFurnitureList);
router.get("/:id", getFurnitureById);

router.post("/create", passport.authenticate("jwt", { session: false }), createFurniture);
router.put("/:id", passport.authenticate("jwt", { session: false }), updateFurniture);
router.patch("/:id/sold", passport.authenticate("jwt", { session: false }), markAsSold);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteFurniture);

export default router;
