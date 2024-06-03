const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const DocumentType = require('./DocumentType');
const User = require('./Users');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
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

Document.belongsTo(DocumentType, { foreignKey: 'documentTypeId' });
Document.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync()
  .then(() => console.log('Documents table created'))
  .catch(err => console.log('Error: ' + err));

module.exports = Document;
