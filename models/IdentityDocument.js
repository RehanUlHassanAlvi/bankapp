const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Document');

const IdentityDocument = sequelize.define('IdentityDocument', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  identityNumber: {
    type: DataTypes.STRING,
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

IdentityDocument.belongsTo(Document);

module.exports = IdentityDocument;
