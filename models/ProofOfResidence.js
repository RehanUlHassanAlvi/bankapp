  const { DataTypes } = require('sequelize');
  const sequelize = require('../config/config');
  const Document = require('./Documents');

  const ProofOfResidence = sequelize.define('ProofOfResidence', {
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


  module.exports = ProofOfResidence;
