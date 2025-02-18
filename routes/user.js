const express = require("express");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// 🔹 VIP Upgrade Route
router.post("/upgrade", authenticate, async (req, res) => {
  try {
    const { newLevel } = req.body;
    const validLevels = ["Junior Member", "Platinum Member", "Gold Member", "Diamond Member"];

    if (!validLevels.includes(newLevel)) {
      return res.status(400).json({ message: "Invalid VIP level!" });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (validLevels.indexOf(newLevel) <= validLevels.indexOf(user.vip_level)) {
      return res.status(400).json({ message: "You can only upgrade to a higher level!" });
    }

    user.vip_level = newLevel;
    await user.save();

    res.json({ message: `Successfully upgraded to ${newLevel}!`, vip_level: user.vip_level });
  } catch (error) {
    console.error("Error upgrading VIP level:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🔹 Get User Profile (Moved Above `module.exports`)
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "email", "referral_code", "referred_by", "vip_level"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router; // ✅ Now both routes are included properly
