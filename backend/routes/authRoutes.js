const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.js");

const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware"); // Import authenticateToken
const checkRole = require("../middleware/checkRole"); // Import checkRole

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, role = "student" } = req.body; // Default role: student

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      username,
      password: hashedPassword,
      role, // Include role in user data
    });

    await user.save();

    res
      .status(201)
      .json({ message: "Registration successful! Please log in." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login user and return token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email or password is incorrect" });
    }

    // Check password validity
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role }, // Include role in token
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = router;
