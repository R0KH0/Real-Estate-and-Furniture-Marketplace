import Furniture from "../Models/furnitureModel.js";

// Create
export const createFurniture = async (req, res) => {
  try {
    const user = req.user;

    // ✅ Updated part: handle string location safely
    let location = req.body.location;
    if (typeof location === "string") location = { city: location, address: "" };

    const newFurniture = new Furniture({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      images: req.body.images,
      condition: req.body.condition,
      location, // use safe location
      sellerName: user.name,
      seller: user._id,
    });

    await newFurniture.save();
    res.status(201).json(newFurniture);
  } catch (err) {
    res.status(500).json({ message: "Error creating furniture post", error: err.message });
  }
};

// Get all
export const getFurnitureList = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, q, status, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    if (q && q.trim() !== "") {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    const skip = (page - 1) * limit;
    const items = await Furniture.find(filter)
      .populate("seller", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get by ID
export const getFurnitureById = async (req, res) => {
  try {
    const item = await Furniture.findById(req.params.id).populate("seller", "username email");
    if (!item) return res.status(404).json({ message: "Not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update
export const updateFurniture = async (req, res) => {
  try {
    const item = await Furniture.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (req.body.location && typeof req.body.location === "string") {
      req.body.location = { city: req.body.location, address: "" };
    }

    Object.assign(item, req.body);
    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Mark as sold
export const markAsSold = async (req, res) => {
  try {
    const item = await Furniture.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    item.status = "sold";
    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete
export const deleteFurniture = async (req, res) => {
  try {
    const item = await Furniture.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
