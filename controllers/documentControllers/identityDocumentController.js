const { IdentityDocument } = require('../../models');

// Get a specific identity document by ID
const getIdentityDocumentById = async (req, res) => {
  try {
    const identityDocument = await IdentityDocument.findByPk(req.params.id);
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

// Save a new identity document or update an existing one
const saveIdentityDocument = async (req, res) => {
  try {
    const { id, ...identityDocumentData } = req.body;

    let identityDocument;
    if (id) {
      identityDocument = await IdentityDocument.findByPk(id);
      if (identityDocument) {
        await identityDocument.update(identityDocumentData);
        res.json({ message: 'Identity Document updated successfully', identityDocument });
      } else {
        res.status(404).json({ message: 'Identity Document not found' });
      }
    } else {
      identityDocument = await IdentityDocument.create(identityDocumentData);
      res.status(201).json({ message: 'Identity Document created successfully', identityDocument });
    }
  } catch (error) {
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
