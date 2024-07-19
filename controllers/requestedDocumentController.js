const {createDocument}=require('../controllers/docController')
const RequestedDocument=require('../models/RequestedDocuments')
const {Document}=require('../models')

const requestDocument = async (req, res) => {
  const businessId = req.user.id; // Get user ID from the authenticated token
  const { userId, documentTypeId } = req.body;

  try {
    // Check if a document with the specified documentTypeId already exists for the businessId
    const existingRequest = await RequestedDocument.findOne({
      include: [{
        model: Document,
        as: 'document',
        where: { documentTypeId: documentTypeId },
        attributes: [] // We don't need any attributes from Document for this check
      }],
      where: { businessId: businessId }
    });

    if (existingRequest) {
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

    return res.status(200).json({ message: 'Document Requested Successfully', reqDoc });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { requestDocument };




  