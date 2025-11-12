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
  condition: { type: String, enum: ["new", "used"], default: "used" },
  status: { type: String, enum: ["available", "sold"], default: "available" },
  sellerName: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { city: String, address: String },
}, { timestamps: true}
);

const Furniture = mongoose.model("Furniture", furnitureSchema);
export default Furniture;
