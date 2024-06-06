const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Documents');

const IdentityDocument = sequelize.define('IdentityDocument', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false ,
    references: {
      model: 'Documents',
      key: 'id'
    }
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


module.exports = IdentityDocument;
