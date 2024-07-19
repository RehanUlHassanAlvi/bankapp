const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./Users'); // Adjust the path as needed
const DocumentType = require('./DocumentTypes'); // Adjust the path as needed
const RequestedDocument=require('./RequestedDocuments')
const Document = sequelize.define('Documents', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  documentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DocumentType,
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'requested'),
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define the association
Document.hasMany(RequestedDocument, { foreignKey: 'documentId', as: 'requestedDocuments' });

module.exports = Document;
