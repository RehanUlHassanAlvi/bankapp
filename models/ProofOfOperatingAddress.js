const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Documents');

const ProofOfOperatingAddress = sequelize.define('ProofOfOperatingAddress', {
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


module.exports = ProofOfOperatingAddress;
