const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  referral_code: {
    type: DataTypes.STRING(50),
    unique: true,
  },
  referred_by: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  vip_level: {
    type: DataTypes.ENUM("Trainee", "Junior Member", "Platinum Member", "Gold Member", "Diamond Member"),
    defaultValue: "Trainee",
  },
  wallet_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  withdrawal_pin: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = User;
