const { ProofOfOperatingAddress } = require('../../models');
const {createDocument}=require('../docController')

// Get a specific proof of operating address by ID
const getProofOfOperatingAddressById = async (req, res) => {
  try {
    const proofOfOperatingAddress = await ProofOfOperatingAddress.findByPk(req.params.id);
    if (proofOfOperatingAddress) {
      res.json(proofOfOperatingAddress);
    } else {
      res.status(404).json({ message: 'Proof of Operating Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all proofs of operating address
const getAllProofsOfOperatingAddress = async (req, res) => {
  try {
    const proofsOfOperatingAddress = await ProofOfOperatingAddress.findAll();
    res.json(proofsOfOperatingAddress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const saveProofOfOperatingAddress = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from the authenticated user
    const { id, documentId, residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl } = req.body;

    let proofOfOperatingAddress;
    if (id) {
      proofOfOperatingAddress = await ProofOfOperatingAddress.findByPk(id);
      if (proofOfOperatingAddress) {
        await proofOfOperatingAddress.update({ documentId, residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl });
        res.json({ message: 'Proof of Operating Address updated successfully', proofOfOperatingAddress });
      } else {
        res.status(404).json({ message: 'Proof of Operating Address not found' });
      }
    } else {
      // Save the document for the document type
      const document = await createDocument(userId,4);
      documentId=doc.id
      proofOfOperatingAddress = await ProofOfOperatingAddress.create({ documentId, residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl });
      res.status(201).json({ message: 'Proof of Operating Address created successfully', proofOfOperatingAddress, document });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a proof of operating address
const deleteProofOfOperatingAddress = async (req, res) => {
  try {
    const proofOfOperatingAddress = await ProofOfOperatingAddress.findByPk(req.params.id);
    if (proofOfOperatingAddress) {
      await proofOfOperatingAddress.destroy();
      res.json({ message: 'Proof of Operating Address deleted successfully' });
    } else {
      res.status(404).json({ message: 'Proof of Operating Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getProofOfOperatingAddressById,
  getAllProofsOfOperatingAddress,
  saveProofOfOperatingAddress,
  deleteProofOfOperatingAddress
};
