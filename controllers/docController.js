const { User,Document,DocumentType } = require('../models');
require('dotenv').config();

const createDocument = async (userId,documentTypeId) => {
 let status='pending'
 let url=''
  try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if document type exists
      const documentType = await DocumentType.findByPk(documentTypeId);
      if (!documentType) {
        throw new Error('Document type not found');
      }

      // Create the document
      const newDocument = await Document.create({
        userId,
        documentTypeId,
        url,
        status
      });
      console.log('Document Type',documentTypeId, 'Created Against User:', userId)
      return newDocument;
    
  } catch (error) {
    throw new Error('Error adding or updating document: ' + error.message);
  }
};


const saveDocument = async (req, res) => {
  const { id } = req.params; // Get document id from URL parameters
  const { userId, documentTypeId, url, status } = req.body; // Get document data from request body

  try {
    // If id parameter is provided, it's an update operation
    if (id) {
      const document = await Document.findByPk(id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Check if user exists
      if (userId) {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
      }

      // Check if document type exists
      if (documentTypeId) {
        const documentType = await DocumentType.findByPk(documentTypeId);
        if (!documentType) {
          return res.status(404).json({ error: 'Document type not found' });
        }
      }

      // Update document fields
      document.userId = userId || document.userId;
      document.documentTypeId = documentTypeId || document.documentTypeId;
      document.url = url || document.url;
      document.status = status || document.status;

      await document.save();

      res.status(200).json(document);
    } else { // If id parameter is not provided, it's an add operation
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if document type exists
      const documentType = await DocumentType.findByPk(documentTypeId);
      if (!documentType) {
        return res.status(404).json({ error: 'Document type not found' });
      }

      // Create the document
      const newDocument = await Document.create({
        userId,
        documentTypeId,
        url,
        status
      });

      res.status(201).json(newDocument);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error adding or updating document: ' + error.message });
  }
};


// Delete a document
const deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await document.destroy();

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting document: ' + error.message });
  }
};

// Get all documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      include: [
        { model: DocumentType },
        { model: User }
      ]
    });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents: ' + error.message });
  }
};

// Get document by ID
const getDocumentById = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findByPk(id, {
      include: [
        { model: DocumentType },
        { model: User }
      ]
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching document: ' + error.message });
  }
};
// Get document counts by status
const getDocumentCounts = async (req, res) => {
  try {
    const allDocuments = await Document.findAll({
      include: [
        { model: DocumentType },
        { model: User }
      ]
    });
    // Initialize counts
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let requestedCount = 0;

    // Count documents by status
    allDocuments.forEach(document => {
      switch (document.status) {
        case 'pending':
          pendingCount++;
          break;
        case 'approved':
          approvedCount++;
          break;
        case 'rejected':
          rejectedCount++;
          break;
        case 'requested':
          requestedCount++;
          break;
        default:
          break;
      }
    });

    // Prepare response object
    const countsObject = {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      requested: requestedCount
    };

    res.json(countsObject);
  } catch (error) {
    console.error('Error fetching document counts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  saveDocument,
  deleteDocument,
  getDocuments,
  getDocumentById,createDocument,getDocumentCounts}
