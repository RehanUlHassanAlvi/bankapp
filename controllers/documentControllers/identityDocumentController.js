const { IdentityDocument } = require('../../models');
const {createDocument}=require('../docController')

// Get a specific identity document by ID
const getIdentityDocumentById = async (req, res) => {
  try {
    const identityDocument = await IdentityDocument.findByPk(req.user.id);
    if (identityDocument) {
      res.json(identityDocument);
    } else {
      res.status(404).json({ message: 'Identity Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all identity documents
const getAllIdentityDocuments = async (req, res) => {
  try {
    const identityDocuments = await IdentityDocument.findAll();
    res.json(identityDocuments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const saveIdentityDocument = async (req, res) => {
  try {
    const { id, documentId, identityNumber, expiryDate, attachmentUrl } = req.body;

    let identityDocument;

    if (id) {
      // If an id is provided, update the existing IdentityDocument
      identityDocument = await IdentityDocument.findByPk(id);
      if (identityDocument) {
        await identityDocument.update({ identityNumber,documentId, expiryDate, attachmentUrl });
        res.json({ message: 'Identity Document updated successfully', identityDocument });
      } else {
        res.status(404).json({ message: 'Identity Document not found' });
      }
    } else {
      // If no id is provided, create a new IdentityDocument
      console.log('processing user:', req.user.id);
      let doc = await createDocument(req.user.id, 1);
      console.log('documentID:', doc.dataValues.id);
      let newIdentityDocument = await IdentityDocument.create({ documentId: doc.dataValues.id, identityNumber, expiryDate, attachmentUrl });
      console.log('Identity Document:', newIdentityDocument);
      res.status(201).json({ message: 'Identity Document created successfully', identityDocument: newIdentityDocument });
    }
  } catch (error) {
    console.error('Error saving IdentityDocument:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete an identity document
const deleteIdentityDocument = async (req, res) => {
  try {
    const identityDocument = await IdentityDocument.findByPk(req.params.id);
    if (identityDocument) {
      await identityDocument.destroy();
      res.json({ message: 'Identity Document deleted successfully' });
    } else {
      res.status(404).json({ message: 'Identity Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getIdentityDocumentById,
  getAllIdentityDocuments,
  saveIdentityDocument,
  deleteIdentityDocument
};
