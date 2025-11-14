import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: [{ type: String }], // URL ou noms fichiers uploadés
  price: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["for sale", "for rent"], default: "for sale" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
