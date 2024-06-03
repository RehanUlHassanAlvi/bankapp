const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('Users', {
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
    defaultValue: false,
  }
});

sequelize.sync()
  .then(() => console.log('User table created'))
  .catch(err => console.log('Error: ' + err));

module.exports = User;
