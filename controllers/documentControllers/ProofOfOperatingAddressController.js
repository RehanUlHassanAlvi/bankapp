const { ProofOfOperatingAddress } = require('../../models');
const {createDocument}=require('../docController')
const { getDocumentsAgainstAUserAndTypeFunction } = require('../userController');

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
    let { id, residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl } = req.body;

    let proofOfOperatingAddress;

    const docExists=getDocumentsAgainstAUserAndTypeFunction(userId,4)
    if (id || docExists.length>0) {
      if (docExists){
        id=docExists[0].id
      }

      // If an id is provided, update the existing ProofOfOperatingAddress
      proofOfOperatingAddress = await ProofOfOperatingAddress.findOne({ where: { documentId: id } });;
      if (proofOfOperatingAddress) {
        await proofOfOperatingAddress.update({ residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl });
        res.json({ message: 'Proof of Operating Address updated successfully', proofOfOperatingAddress });
      } else {
        res.status(404).json({ message: 'Proof of Operating Address not found' });
      }
    } else {
      // If no id is provided, create a new ProofOfOperatingAddress
      console.log('Processing user:', userId);
      // Save the document for the document type
      const document = await createDocument(userId, 4);
      console.log('Document ID:', document.id);
      
      proofOfOperatingAddress = await ProofOfOperatingAddress.create({ documentId: document.id, residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl });
      res.status(201).json({ message: 'Proof of Operating Address created successfully', proofOfOperatingAddress, document });
    }
  } catch (error) {
    console.error('Error saving Proof of Operating Address:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



const saveClientProofOfOperatingAddress = async (req, res) => {
  try {
    let {userId, id, residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl } = req.body;

    let proofOfOperatingAddress;
    const docExists=getDocumentsAgainstAUserAndTypeFunction(userId,2)
    if (id || docExists.length>0) {
      if (docExists){
        id=docExists[0].id
      }

      // If an id is provided, update the existing ProofOfOperatingAddress
      proofOfOperatingAddress = await ProofOfOperatingAddress.findOne({ where: { documentId: id } });;
      if (proofOfOperatingAddress) {
        await proofOfOperatingAddress.update({ residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl });
        res.json({ message: 'Proof of Operating Address updated successfully', proofOfOperatingAddress });
      } else {
        res.status(404).json({ message: 'Proof of Operating Address not found' });
      }
    } else {
      // If no id is provided, create a new ProofOfOperatingAddress
      console.log('Processing user:', userId);
      // Save the document for the document type
      const document = await createDocument(userId, 4);
      console.log('Document ID:', document.id);
      
      proofOfOperatingAddress = await ProofOfOperatingAddress.create({ documentId: document.id, residentialDetails, specificDetails, physicalAddress, townCity, attachmentUrl });
      res.status(201).json({ message: 'Proof of Operating Address created successfully', proofOfOperatingAddress, document });
    }
  } catch (error) {
    console.error('Error saving Proof of Operating Address:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a proof of operating address
const deleteProofOfOperatingAddress = async (req, res) => {
  try {
    const proofOfOperatingAddress = await ProofOfOperatingAddress.findOne({ where: { documentId: req.params.id} });
    if (proofOfOperatingAddress) {
      await proofOfOperatingAddress.destroy();
      const docu=await Document.findOne({ where: { documentId: req.params.id} });
      if(docu)
      {
          await docu.destroy();
      }
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
  deleteProofOfOperatingAddress,
  saveClientProofOfOperatingAddress
};
