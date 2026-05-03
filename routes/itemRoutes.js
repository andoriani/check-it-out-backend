const express = require("express");
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// All item routes are protected - require authentication
router.use(authMiddleware);

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
