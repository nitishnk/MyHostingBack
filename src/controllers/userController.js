const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error while fetching user" });
  }
};

module.exports = { getUser };
