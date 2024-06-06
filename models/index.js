const sequelize = require('../config/config');
const User = require('./Users');
const Document = require('./Documents');
const DocumentType = require('./DocumentTypes');
const ProofOfIncome=require('./ProofOfIncome')
const IdentityDocument=require('./IdentityDocument')
const ProofOfOperatingAddress=require('./ProofOfOperatingAddress')
const ProofOfResidence=require('./ProofOfResidence')
const TaxClearance=require('./TaxClearance')
const CertificateOfIncorporation=require('./CertificateOfIncorporation')

// Define associations
User.hasMany(Document, { foreignKey: 'userId' });
Document.belongsTo(User, { foreignKey: 'userId' });

DocumentType.hasMany(Document, { foreignKey: 'documentTypeId' });
Document.belongsTo(DocumentType, { foreignKey: 'documentTypeId' });
ProofOfIncome.belongsTo(Document, {foreignKey: 'documentId'})
IdentityDocument.belongsTo(Document, {foreignKey: 'documentId'})
ProofOfOperatingAddress.belongsTo(Document, {foreignKey: 'documentId'})
ProofOfResidence.belongsTo(Document, {foreignKey: 'documentId'})
TaxClearance.belongsTo(Document, {foreignKey: 'documentId'})
CertificateOfIncorporation.belongsTo(Document, {foreignKey: 'documentId'})


// Sync all models with the database
sequelize.sync({ alter: true });

module.exports = {
  User,
  Document,
  DocumentType,
  ProofOfIncome,
  ProofOfOperatingAddress,ProofOfResidence,TaxClearance,CertificateOfIncorporation,IdentityDocument,
  sequelize
};
