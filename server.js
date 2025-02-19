const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes"); // Existing user routes
const authRoutes = require("./routes/auth"); // Add authentication routes
const bookingRoutes = require("./routes/booking");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes); // New authentication routes
app.use("/api/users", userRoutes); // Existing user management routes
app.use("/api/booking", bookingRoutes);

// Sync Database & Start Server
sequelize.sync({ alter: true })
  .then(() => console.log("📦 Database synced!"))
  .catch(err => console.error("❌ Sync error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
