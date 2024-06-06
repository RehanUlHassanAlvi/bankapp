const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Documents');

const TaxClearance = sequelize.define('TaxClearance', {
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
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  attachmentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});


module.exports = TaxClearance;
