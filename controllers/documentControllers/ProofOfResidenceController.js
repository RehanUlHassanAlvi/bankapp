const { ProofOfResidence } = require('../../models');
const { createDocument } = require('../docController');

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
    const { id, residentialDetails, durationOfStay, specificDetails, physicalAddress, townCity, attachmentFrontPage, attachmentBackPage, plotNumber, leaseAgreementDate, leaseAgreementDuration, titleDeedNumber, attachmentAllPages, companyName, designation, affidavitDesignation } = req.body;

    let proofOfResidence;

    if (id) {
      // If an id is provided, update the existing ProofOfResidence
      proofOfResidence = await ProofOfResidence.findByPk(id);
      if (proofOfResidence) {
        await proofOfResidence.update({
          residentialDetails, durationOfStay, specificDetails, physicalAddress, townCity, attachmentFrontPage, attachmentBackPage, plotNumber, leaseAgreementDate, leaseAgreementDuration, titleDeedNumber, attachmentAllPages, companyName, designation, affidavitDesignation
        });
        res.json({ message: 'Proof of Residence updated successfully', proofOfResidence });
      } else {
        res.status(404).json({ message: 'Proof of Residence not found' });
      }
    } else {
      // If no id is provided, create a new ProofOfResidence
      console.log('Processing user:', userId);
      // Save the document for the document type
      const document = await createDocument(userId, 5);
      console.log('Document ID:', document.id);
      
      proofOfResidence = await ProofOfResidence.create({
        documentId: document.id, residentialDetails, durationOfStay, specificDetails, physicalAddress, townCity, attachmentFrontPage, attachmentBackPage, plotNumber, leaseAgreementDate, leaseAgreementDuration, titleDeedNumber, attachmentAllPages, companyName, designation, affidavitDesignation
      });
      res.status(201).json({ message: 'Proof of Residence created successfully', proofOfResidence, document });
    }
  } catch (error) {
    console.error('Error saving Proof of Residence:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a proof of residence
const deleteProofOfResidence = async (req, res) => {
  try {
    const proofOfResidence = await ProofOfResidence.findByPk(req.params.id);
    if (proofOfResidence) {
      await proofOfResidence.destroy();
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
