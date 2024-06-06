const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Documents');

const ProofOfIncome = sequelize.define('ProofOfIncome', {
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
  sourceName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otherDetails: {
    type: DataTypes.STRING
  },
  payslipCompanyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attachmentProof: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attachmentFrontPage: {
    type: DataTypes.STRING,
    allowNull: false
  }
});


module.exports = ProofOfIncome;
