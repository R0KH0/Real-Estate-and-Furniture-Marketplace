import Property from "../Models/Property.js";
import { validationResult } from "express-validator";

export const createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, price, location, status } = req.body;

    const property = new Property({
      title,
      description,
      price,
      location,
      status,
      owner: req.user.id,
      images: req.files ? req.files.map(file => file.filename) : [],
    });

    await property.save();
    res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, status } = req.query;

    const filter = {};
    if (location) filter.location = { $regex: location, $options: "i" };
    if (status) filter.status = status;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const properties = await Property.find(filter).populate("owner", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏️ Modifier une propriété (propriétaire uniquement)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, price, location, status } = req.body;
    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = price;
    if (location) property.location = location;
    if (status) property.status = status;

    if (req.files) property.images = req.files.map(file => file.filename);

    await property.save();
    res.json({ message: "Property updated", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await property.remove();
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
