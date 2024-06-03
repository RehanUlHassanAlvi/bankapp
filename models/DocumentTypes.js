const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const DocumentType = sequelize.define('DocumentType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

DocumentType.hasMany(Document);

sequelize.sync()
  .then(() => console.log('DocumentTypes table created'))
  .catch(err => console.log('Error: ' + err));

module.exports = DocumentType;
