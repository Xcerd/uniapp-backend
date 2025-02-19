const express = require("express");
const router = express.Router();
const { bookItem } = require("../bookingController.js");

router.post("/book", async (req, res) => {
  const userId = req.body.userId;
  const itemId = req.body.itemId;
  try {
    const result = await bookItem(userId, itemId);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
