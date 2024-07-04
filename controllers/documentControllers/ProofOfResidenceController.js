const { ProofOfResidence } = require('../../models');
const { createDocument } = require('../docController');
const { getDocumentsAgainstAUserAndTypeFunction } = require('../userController');

// Get a specific proof of residence by ID
const getProofOfResidenceById = async (req, res) => {
  try {
    const proofOfResidence = await ProofOfResidence.findByPk(req.params.id);
    if (proofOfResidence) {
      res.json(proofOfResidence);
    } else {
      res.status(404).json({ message: 'Proof of Residence not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all proofs of residence
const getAllProofsOfResidence = async (req, res) => {
  try {
    const proofsOfResidence = await ProofOfResidence.findAll();
    res.json(proofsOfResidence);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const saveProofOfResidence = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from the authenticated user

  
    // Destructure the request body
    let { 
      id, residentialDetails, durationOfStay, specificDetails, physicalAddress, 
      townCity, attachmentFrontPage, attachmentBackPage, plotNumber, 
      leaseAgreementDate, leaseAgreementDuration, titleDeedNumber, 
      attachmentAllPages, companyName, designation, affidavitDesignation 
    } = req.body;

    let proofOfResidence;
    const docExists=await getDocumentsAgainstAUserAndTypeFunction(userId,5)
      if (id || docExists.length>0) {
      if (docExists){
        id=docExists[0].id
      }

      // If an id is provided, update the existing ProofOfResidence
      proofOfResidence = await ProofOfResidence.findOne({ where: { documentId: id } });
      
      if (!proofOfResidence) {
        return res.status(404).json({ message: 'Proof of Residence not found' });
      }

      await proofOfResidence.update({
        residentialDetails, durationOfStay, specificDetails, physicalAddress, 
        townCity, attachmentFrontPage, attachmentBackPage, plotNumber, 
        leaseAgreementDate, leaseAgreementDuration, titleDeedNumber, 
        attachmentAllPages, companyName, designation, affidavitDesignation
      });

      return res.json({ message: 'Proof of Residence updated successfully', proofOfResidence });

    } else {
      // If no id is provided, create a new ProofOfResidence
      console.log('Processing user:', userId);

      let document;
      try {
        // Save the document for the document type
        document = await createDocument(userId, 5);
      } catch (docError) {
        console.error('Error creating document:', docError);
        return res.status(500).json({ message: 'Error creating document', error: docError });
      }

      console.log('Document ID:', document.id);

      proofOfResidence = await ProofOfResidence.create({
        documentId: document.id, residentialDetails, durationOfStay, specificDetails, 
        physicalAddress, townCity, attachmentFrontPage, attachmentBackPage, 
        plotNumber, leaseAgreementDate, leaseAgreementDuration, titleDeedNumber, 
        attachmentAllPages, companyName, designation, affidavitDesignation
      });

      return res.status(201).json({ message: 'Proof of Residence created successfully', proofOfResidence, document });
    }
  } catch (error) {
    console.error('Error saving Proof of Residence:', error);

    // Identify specific error types if possible
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }

    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete a proof of residence
const deleteProofOfResidence = async (req, res) => {
  try {
    const proofOfResidence = await ProofOfResidence.findOne({ where: { documentId: req.params.id} });
    if (proofOfResidence) {
      await proofOfResidence.destroy();
      const docu=await Document.findOne({ where: { documentId: req.params.id} });
      if(docu)
      {
          await docu.destroy();
      }
      res.json({ message: 'Proof of Residence deleted successfully' });
    } else {
      res.status(404).json({ message: 'Proof of Residence not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getProofOfResidenceById,
  getAllProofsOfResidence,
  saveProofOfResidence,
  deleteProofOfResidence
};
