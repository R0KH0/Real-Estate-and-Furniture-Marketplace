import Furniture from "../models/Furniture.js";

export const createFurniture = async (req, res) => {
  try {
    
    const sellerId = req.user?.id || req.body.seller;
    if (!sellerId) return res.status(400).json({ message: "Seller required" });

    const item = new Furniture({ ...req.body, seller: sellerId });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getFurnitureList = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, q, status, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (q) filter.$text = { $search: q }; 

    const skip = (page - 1) * limit;
    const items = await Furniture.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFurnitureById = async (req, res) => {
  try {
    const item = await Furniture.findById(req.params.id).populate("seller", "name email");
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFurniture = async (req, res) => {
  try {
    const item = await Furniture.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsSold = async (req, res) => {
  try {
    const item = await Furniture.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    item.status = "sold";
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFurniture = async (req, res) => {
  try {
    const item = await Furniture.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
