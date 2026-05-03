const Item = require("../models/Item");

const getItems = async (req, res) => {
  try {
    // Get only items belonging to the authenticated user
    const items = await Item.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify item belongs to the authenticated user
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this item" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const {
      name,
      description = "",
      price,
      category = "General",
      stock = 0,
      imageUrl = "",
      rating = 0,
    } = req.body;

    const item = await Item.create({
      userId: req.user.id,
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      rating,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify item belongs to the authenticated user
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify item belongs to the authenticated user
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
