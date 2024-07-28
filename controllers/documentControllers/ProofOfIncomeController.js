const { ProofOfIncome } = require('../../models');
const {createDocument}=require('../docController')
const {Document}=require('../../models')
const { getDocumentsAgainstAUserAndTypeFunction } = require('../userController');

// Get a specific proof of income by ID
const getProofOfIncomeById = async (req, res) => {
  try {
    const proofOfIncome = await ProofOfIncome.findByPk(req.params.id);
    if (proofOfIncome) {
      res.json(proofOfIncome);
    } else {
      res.status(404).json({ message: 'Proof of Income not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all proofs of income
const getAllProofsOfIncome = async (req, res) => {
  try {
    const proofsOfIncome = await ProofOfIncome.findAll();
    res.json(proofsOfIncome);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const saveProofOfIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    let { id, sourceName, otherDetails, payslipCompanyName, attachmentProof, attachmentFrontPage } = req.body;

    let proofOfIncome;

    const docExists=await getDocumentsAgainstAUserAndTypeFunction(userId,3)
    if (id || docExists.length>0) {
      if (docExists){
        id=docExists[0].id
      }

      // If an id is provided, update the existing ProofOfIncome
      proofOfIncome = await ProofOfIncome.findOne({ where: { documentId: id } });;
      if (proofOfIncome) {
        await createDocument(userId, 3);
        await proofOfIncome.update({ sourceName, otherDetails, payslipCompanyName, attachmentProof, attachmentFrontPage });
        await updateDocStatus(id,"pending")
        res.json({ message: 'Proof of Income updated successfully', proofOfIncome });
      } else {
        res.status(404).json({ message: 'Proof of Income not found' });
      }
    } else {
      // If no id is provided, create a new ProofOfIncome
      console.log('Processing user:', userId);
      // Save the document for the document type
      const document = await createDocument(userId, 3);
      console.log('Document ID:', document.id);
      
      proofOfIncome = await ProofOfIncome.create({ documentId: document.id, sourceName, otherDetails, payslipCompanyName, attachmentProof, attachmentFrontPage });
      res.status(201).json({ message: 'Proof of Income created successfully', proofOfIncome, document });
    }
  } catch (error) {
    console.error('Error saving Proof of Income:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteProofOfIncome = async (req, res) => {
  try {
    console.log('Searching for Proof of Income with documentId:', req.params.id);
    const proofOfIncome = await ProofOfIncome.findOne({ where: { documentId: req.params.id } });
    
    if (proofOfIncome) {
      console.log('Proof of Income found:', proofOfIncome);
      await proofOfIncome.destroy();
      console.log('Proof of Income destroyed');
      
      console.log('Searching for Document with id:', req.params.id);
      const docu = await Document.findOne({ where: { id: req.params.id } });
      
      if (docu) {
        console.log('Document found:', docu);
        await docu.destroy();
        console.log('Document destroyed');
      }
      
      res.json({ message: 'Proof of Income deleted successfully' });
    } else {
      console.log('Proof of Income not found');
      res.status(404).json({ message: 'Proof of Income not found' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { deleteProofOfIncome };

module.exports = {
  getProofOfIncomeById,
  getAllProofsOfIncome,
  saveProofOfIncome,
  deleteProofOfIncome
};
