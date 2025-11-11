import mongoose from "mongoose";

const furnitureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ["Chair", "Table", "Sofa", "Bed", "Cabinet", "Decor", "Other"],
    default: "Other",
  },
  images: [{ type: String }],
  condition: { type: String, enum: ["new","used"], default: "used" },
  status: { type: String, enum: ["available","sold"], default: "available" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: {
    city: { type: String },
    address: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const Furniture = mongoose.model("Furniture", furnitureSchema);
export default Furniture;
