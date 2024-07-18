const { User,Document,DocumentType } = require('../models');
const { TaxClearance,ProofOfIncome,ProofOfOperatingAddress,ProofOfResidence,CertificateOfIncorporation,IdentityDocument } = require('../models');
const UserDetails = require('../models/UserDetails');
const sendEmail = require('../utils/sendEmail');

require('dotenv').config();

const createDocument = async (userId,documentTypeId,status='pending') => {
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




const updateDocumentStats = async (req, res) => {
  const { documentId,status } = req.body;

  try {
    const document = await Document.findByPk(documentId, {
      include: [
        { model: DocumentType },
        { model: User }
      ]
    });
   
    
    document.status=status;

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    let docRes=await document.save();




    await sendEmail(document.User.email, document.DocumentType.name+' '+status, 'Dear User!\nYour Document: '+document.DocumentType.name+' is in the status: '+status)

    res.status(200).json({ message: 'Document Status updated successfully',docRes });
  } catch (error) {
    res.status(500).json({ error: 'Error updating document: ' + error.message });
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

const getDocumentByStatus = async (req, res) => {
  const userId = req.user.id; // Get userId from the authenticated user
  const { status } = req.body;

  try {
    console.log('Fetching documents with status:', status);

    // Fetch all documents with User and DocumentType included
    const documents = await Document.findAll({
      where: { status,id:userId },
      include: [{ model: User }, { model: DocumentType }]
    });

    if (!documents || documents.length === 0) {
      console.log('Documents not found or empty array returned');
      return res.status(404).json({ error: 'Documents not found' });
    }

    console.log('Documents fetched:', documents.length);

    // Extract userIds from documents to fetch UserDetails in bulk
    const userIds = documents.map(doc => doc.userId);
    console.log('UserIds extracted:', userIds);

    // Fetch UserDetails for each userId and store in userDetailsMap
    const userDetailsMap = {};
    await Promise.all(userIds.map(async userId => {
      try {
        const userDetails = await UserDetails.findOne({ where: { userId } });
        console.log(`UserDetails fetched for userId ${userId}:`, userDetails);
        userDetailsMap[userId] = userDetails || {}; // Ensure userDetails is not null
      } catch (error) {
        console.error(`Error fetching UserDetails for userId ${userId}:`, error);
        userDetailsMap[userId] = null; // Handle error by setting userDetails to null
      }
    }));

    // Prepare response with additional data based on documentTypeId
    const formattedDocuments = await Promise.all(documents.map(async doc => {
      let additionalData = {};

      switch (doc.documentTypeId) {
        case 1: // IdentityDocument
          additionalData = await IdentityDocument.findOne({ where: { documentId: doc.id } });
          break;
        case 2: // CertificateOfIncorporation
          additionalData = await CertificateOfIncorporation.findOne({ where: { documentId: doc.id } });
          break;
        case 3: // ProofOfIncome
          additionalData = await ProofOfIncome.findOne({ where: { documentId: doc.id } });
          break;
        case 4: // ProofOfOperatingAddress
          additionalData = await ProofOfOperatingAddress.findOne({ where: { documentId: doc.id } });
          break;
        case 5: // ProofOfResidence
          additionalData = await ProofOfResidence.findOne({ where: { documentId: doc.id } });
          break;
        case 6: // TaxClearance
          additionalData = await TaxClearance.findOne({ where: { documentId: doc.id } });
          break;
        default:
          break;
      }

      console.log(`Additional data fetched for documentId ${doc.id}:`, additionalData);

      // Get UserDetails for the User associated with the document
      const userDetails = userDetailsMap[doc.userId];
      console.log(`UserDetails for userId ${doc.userId}:`, userDetails);

      // Prepare user object with userDetails included
      const user = {
        id: doc.User.id,
        username: doc.User.username,
        email: doc.User.email,
        // Include userDetails within user object
        userDetails: userDetails
      };

      return {
        id: doc.id,
        userId: doc.userId,
        documentTypeId: doc.documentTypeId,
        url: doc.url,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        additionalData: additionalData,
        user: user // Include user data with userDetails
      };
    }));

    console.log('Sending formatted documents response:', formattedDocuments.length);
    res.status(200).json(formattedDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Error fetching documents: ' + error.message });
  }
};





const getDocumentCounts = async (req, res) => {
  try {
    // Fetch all documents with their associated users
    const allDocuments = await Document.findAll({
      include: [{
        model: User,
        where: { type: 'user' } // Filter to include only users with type 'user'
      }]
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


const requestDocumentsForAUser=async(req,res)=>{
  const {userId,documentTypeIds}=req.body.ids;
  for (documentTypeId of documentTypeIds){
    await createDocument(userId,documentTypeId,'requested')
  }
}


module.exports = {
  saveDocument,
  deleteDocument,
  getDocuments,
  getDocumentById,createDocument,getDocumentCounts,getDocumentByStatus,updateDocumentStats,requestDocumentsForAUser}
