const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Fetch User Profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "email", "referral_code", "referred_by", "vip_level", "wallet_balance"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deposit Funds
router.post("/deposit", authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findByPk(req.user.id);
    user.wallet_balance += parseFloat(amount);
    await user.save();
    await Transaction.create({ user_id: user.id, type: "deposit", amount, status: "approved" });
    res.json({ message: "Deposit successful", new_balance: user.wallet_balance });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Withdraw Funds
router.post("/withdraw", authenticate, async (req, res) => {
  try {
    const { amount, withdrawalPin } = req.body;
    const user = await User.findByPk(req.user.id);
    if (user.withdrawal_pin !== withdrawalPin) {
      return res.status(400).json({ message: "Incorrect withdrawal PIN" });
    }
    if (user.wallet_balance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.wallet_balance -= parseFloat(amount);
    await user.save();
    await Transaction.create({ user_id: user.id, type: "withdrawal", amount, status: "pending" });
    res.json({ message: "Withdrawal request submitted", new_balance: user.wallet_balance });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
