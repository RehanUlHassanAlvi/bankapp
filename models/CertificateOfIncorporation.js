const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Documents');

const CertificateOfIncorporation = sequelize.define('CertificateOfIncorporation', {
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
  companyNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attachmentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = CertificateOfIncorporation;
