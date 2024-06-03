const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Document');

const ProofOfOperatingAddress = sequelize.define('ProofOfOperatingAddress', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  residentialDetails: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specificDetails: {
    type: DataTypes.STRING,
    allowNull: false
  },
  physicalAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  townCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attachmentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

ProofOfOperatingAddress.belongsTo(Document);

module.exports = ProofOfOperatingAddress;
