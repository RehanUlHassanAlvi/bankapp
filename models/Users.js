const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isOtpVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isKycVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  kycImageURL: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

module.exports = User;
