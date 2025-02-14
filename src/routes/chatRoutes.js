const express = require("express");
const Chat = require("../models/Chat");
const Category = require("../models/Category");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get Messages by Category (Supports Name & ObjectId)
router.get("/:categoryName", protect, async (req, res) => {
  try {
    const categoryName = req.params.categoryName;

    // ✅ Convert category name to ObjectId
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // ✅ Fetch messages by ObjectId
    const messages = await Chat.find({ category: category._id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Add `POST /chats` route to store messages
router.post("/", protect, async (req, res) => {
  try {
    console.log("🔍 Received POST request at /chats");

    const { category, text, userId, sender } = req.body;

    if (!category || !text || !userId || !sender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newMessage = new Chat({
      category: categoryDoc._id,
      text,
      userId,
      sender,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error storing message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
