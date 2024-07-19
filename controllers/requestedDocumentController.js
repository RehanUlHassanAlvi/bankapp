const {createDocument}=require('../controllers/docController')
const RequestedDocument=require('../models/RequestedDocuments')
// Get a specific identity document by ID
const requestDocument = async (req, res) => {
    const businessId = req.user.id; // Get user ID from the authenticated token
    const {userId,documentTypeId }=req.body

  try {
    let document=await createDocument(userId,documentTypeId,'requested');
    let requestedDocument={
        businessId,userId,
        
        documentId: document.id
    }
    let reqDoc=await RequestedDocument.create(requestedDocument)
    return res.status(200).json({ message: 'Document Requested Successfully',reqDoc });
} catch (error) {
  console.error('Error updating user status:', error);
  return res.status(500).json({ message: 'Internal server error' });
}
};

module.exports = {requestDocument}
  