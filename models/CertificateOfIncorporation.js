const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Document = require('./Document');

const CertificateOfIncorporation = sequelize.define('CertificateOfIncorporation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false
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

CertificateOfIncorporation.belongsTo(Document);

module.exports = CertificateOfIncorporation;
