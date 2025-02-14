const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Register User
exports.register = async (req, res) => {
  const { name, email, password, dob } = req.body;

  try {
    console.log("🔹 Received Registration Request:", req.body);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ No need to hash password manually (handled in Mongoose schema)
    const user = new User({
      name,
      email,
      password, // Password hashing is done automatically in the schema
      dob,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔹 Received Login Request:", req.body);

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User Not Found!");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User Found:", user);

    // ✅ Use the `matchPassword` method from schema to compare passwords
    const isMatch = await user.matchPassword(password);
    console.log("🔹 Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid Credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Password match successful!");

    // Generate JWT token
    const token = generateToken(user.id);

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id, // ✅ Ensure `_id` is included
        name: user.name, // ✅ Ensure `name` is included
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Logged-In User
exports.getLoggedInUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id, // ✅ Ensure correct ID format
      name: user.name, // ✅ Ensure name is included
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Error fetching logged-in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
