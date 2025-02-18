const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, referral } = req.body;

    if (!email || !password || !referral) {
      return res.status(400).json({ message: "Referral code is required!" });
    }

    // Check if referral code exists in the database
    const referrer = await User.findOne({ where: { referral_code: referral } });

    if (!referrer) {
      return res.status(400).json({ message: "Invalid referral code!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with `referred_by`
    const newUser = await User.create({
      email,
      password: hashedPassword,
      referred_by: referral,  // Store referral code of the user who invited them
    });

    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
