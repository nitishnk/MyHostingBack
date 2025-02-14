
const Category = require("../models/Category"); // Import Mongoose model

// Get all categories from the database
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch categories from MongoDB
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Server error while fetching categories" });
  }
};

// Add a new category
const addCategory = async (req, res) => {
  let { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  // Normalize the category name
  name = name.trim().toLowerCase();

  console.log("Adding category with name:", name); // Log the name

  try {
    // Check if category with the same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name must be unique" });
    }
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCategories, addCategory };
