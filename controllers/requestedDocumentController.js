const { createDocument } = require('../controllers/docController');
const RequestedDocument = require('../models/RequestedDocuments');
const { Document, IdentityDocument, ProofOfIncome, ProofOfResidence } = require('../models');

const requestDocument = async (req, res) => {
  const businessId = req.user.id; // Get user ID from the authenticated token
  const { userId, documentTypeId, expiryDate, attachmentUrl } = req.body;

  try {
    // Find all document IDs for the given businessId from RequestedDocument
    const existingRequests = await RequestedDocument.findAll({
      where: { businessId: businessId },
      attributes: ['documentId']
    });

    // Extract document IDs
    const documentIds = existingRequests.map(request => request.documentId);

    // Check if any of these document IDs match the specified documentTypeId
    const existingDocument = await Document.findOne({
      where: {
        id: documentIds,
        documentTypeId: documentTypeId
      }
    });

    if (existingDocument) {
      return res.status(400).json({ message: 'Document already requested' });
    }

    // Create the document if it does not already exist
    let document = await createDocument(userId, documentTypeId, 'requested');
    let requestedDocument = {
      businessId,
      userId,
      documentId: document.id
    };
    let reqDoc = await RequestedDocument.create(requestedDocument);

    // Add the specific document type details
    if (documentTypeId === 1) {
      await IdentityDocument.create({ documentId: document.id, expiryDate, attachmentUrl });
    } else if (documentTypeId === 3) {
      await ProofOfIncome.create({ documentId: document.id, expiryDate, attachmentUrl });
    } else if (documentTypeId === 5) {
      await ProofOfResidence.create({ documentId: document.id, expiryDate, attachmentUrl });
    }

    return res.status(200).json({ message: 'Document Requested Successfully', reqDoc });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { requestDocument };
