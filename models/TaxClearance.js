const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Document');

const TaxClearance = sequelize.define('TaxClearance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  attachmentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

TaxClearance.belongsTo(Document);

module.exports = TaxClearance;
