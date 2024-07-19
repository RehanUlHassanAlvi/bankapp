const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const RequestedDocuments = sequelize.define('RequestedDocuments', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = RequestedDocuments;
