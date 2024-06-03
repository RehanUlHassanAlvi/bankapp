const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./Users');
const Document = require('./Document');

const ProofOfResidence = sequelize.define('ProofOfResidence', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  residentialDetails: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durationOfStay: {
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
  attachmentFrontPage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attachmentBackPage: {
    type: DataTypes.STRING
  },
  plotNumber: {
    type: DataTypes.STRING
  },
  leaseAgreementDate: {
    type: DataTypes.DATE
  },
  leaseAgreementDuration: {
    type: DataTypes.STRING
  },
  titleDeedNumber: {
    type: DataTypes.STRING
  },
  attachmentAllPages: {
    type: DataTypes.STRING
  },
  companyName: {
    type: DataTypes.STRING
  },
  designation: {
    type: DataTypes.STRING
  },
  affidavitDesignation: {
    type: DataTypes.STRING
  }
});

ProofOfResidence.belongsTo(Document);

module.exports = ProofOfResidence;
