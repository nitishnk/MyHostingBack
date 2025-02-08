const express = require("express");
const User = require("../models/User"); // Make sure User model is correct

const router = express.Router();

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name avatar email"); // Fetch required fields only
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
