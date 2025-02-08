const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Server error while fetching categories" });
  }
};