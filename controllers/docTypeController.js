const { Document,DocumentType } = require('../models');
require('dotenv').config();

// Add a new document type
const addDocumentType = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newDocumentType = await DocumentType.create({
      name,
      description
    });

    res.status(201).json(newDocumentType);
  } catch (error) {
    res.status(500).json({ error: 'Error adding document type: ' + error.message });
  }
};

// Update a document type
const updateDocumentType = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const documentType = await DocumentType.findByPk(id);

    if (!documentType) {
      return res.status(404).json({ error: 'Document type not found' });
    }

    documentType.name = name || documentType.name;
    documentType.description = description || documentType.description;
    
    await documentType.save();

    res.status(200).json(documentType);
  } catch (error) {
    res.status(500).json({ error: 'Error updating document type: ' + error.message });
  }
};

// Delete a document type
const deleteDocumentType = async (req, res) => {
  const { id } = req.params;

  try {
    const documentType = await DocumentType.findByPk(id);

    if (!documentType) {
      return res.status(404).json({ error: 'Document type not found' });
    }

    await documentType.destroy();

    res.status(200).json({ message: 'Document type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting document type: ' + error.message });
  }
};

// Get all document types
const getDocumentTypes = async (req, res) => {
  try {
    console.log('trying to get documtn ')
    const documentTypes = await DocumentType.findAll({ raw: true });

    res.status(200).json(documentTypes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching document types: ' + error.message });
  }
};

// Get document type by ID
const getDocumentTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const documentType = await DocumentType.findByPk(id, {
      include: [
        { model: Document }
      ]
    });

    if (!documentType) {
      return res.status(404).json({ error: 'Document type not found' });
    }

    res.status(200).json(documentType);
  } catch (error) {
    res.status500().json({ error: 'Error fetching document type: ' + error.message });
  }
};

module.exports = {
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
  getDocumentTypes,
  getDocumentTypeById
};
