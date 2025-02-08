const express = require("express");
const router = express.Router();
const { getCategories, addCategory } = require("../controllers/categoryController"); 
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCategories);
router.post("/", protect, addCategory);

module.exports = router;