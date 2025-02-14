const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware"); // ✅ Correct import

const router = express.Router();

// ✅ Route to get all users (already exists)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name avatar email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
