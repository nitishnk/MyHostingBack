const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register User
exports.register = async (req, res) => {
  const { name, email, password, dob } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create and save the new user
    const user = new User({
      name,
      email,
      password,
      dob,
    });
    console.log(user);
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dob: user.dob,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { loginInput, password } = req.body;

  try {
    // Check if user exists with email or username
    const user = await User.findOne({
      $or: [{ email: loginInput }, { username: loginInput }],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
