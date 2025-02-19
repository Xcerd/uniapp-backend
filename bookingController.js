const Booking = require("./models/Booking");
const { Op } = require("sequelize");

/**
 * Book an item for the user.
 */
async function bookItem(userId, itemId) {
  try {
    // Fetch user's booking stats (how many bookings today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userBookings = await Booking.count({
      where: {
        user_id: userId,
        created_at: { [Op.gte]: today }, // Today's bookings
      },
    });

    if (userBookings >= 30) {
      return { success: false, message: "Daily booking limit reached!" };
    }

    // Example: Fetch VIP level (you may adjust this based on your DB structure)
    const user = await User.findByPk(userId);
    const vipLevel = user ? user.vip_level : "Trainee";

    // Define VIP commission rates
    const vipCommissionRate = {
      Trainee: 0.004,
      "Junior member": 0.007,
      "Platinum Member": 0.008,
      "Gold member": 0.01,
      "Diamond Member": 0.012,
    };

    // Fetch item price from database (Replace this with your actual query)
    const itemPrice = 100; // Placeholder (fetch actual price from DB)
    const commission = itemPrice * (vipCommissionRate[vipLevel] || 0);

    // Create a new booking entry
    const booking = await Booking.create({
      user_id: userId,
      service_name: `Item ${itemId}`, // Example service name
      status: "pending",
      booking_date: new Date(),
      price: itemPrice,
      commission: commission.toFixed(2),
      vip_level: vipLevel,
    });

    return { success: true, message: "Booking successful!", booking };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, message: "Server error. Please try again." };
  }
}

module.exports = { bookItem };
