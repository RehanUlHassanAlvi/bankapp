const { ProofOfIncome } = require('../../models');
const {createDocument}=require('../docController')

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
    const userId = req.user.id; // Get userId from the authenticated user
    const { id, documentId, sourceName, otherDetails, payslipCompanyName, attachmentProof, attachmentFrontPage } = req.body;

    let proofOfIncome;
    if (id) {
      proofOfIncome = await ProofOfIncome.findByPk(id);
      if (proofOfIncome) {
        await proofOfIncome.update({ documentId, sourceName, otherDetails, payslipCompanyName, attachmentProof, attachmentFrontPage });
        res.json({ message: 'Proof of Income updated successfully', proofOfIncome });
      } else {
        res.status(404).json({ message: 'Proof of Income not found' });
      }
    } else {
      // Save the document for the document type
      const document = await saveDocumentForDocumentType(userId,3);
      let doc=await createDocument(req.user.id,3); 
      documentId=doc.id
      proofOfIncome = await ProofOfIncome.create({ documentId, sourceName, otherDetails, payslipCompanyName, attachmentProof, attachmentFrontPage });
      res.status(201).json({ message: 'Proof of Income created successfully', proofOfIncome, document });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// Delete a proof of income
const deleteProofOfIncome = async (req, res) => {
  try {
    const proofOfIncome = await ProofOfIncome.findByPk(req.params.id);
    if (proofOfIncome) {
      await proofOfIncome.destroy();
      res.json({ message: 'Proof of Income deleted successfully' });
    } else {
      res.status(404).json({ message: 'Proof of Income not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getProofOfIncomeById,
  getAllProofsOfIncome,
  saveProofOfIncome,
  deleteProofOfIncome
};
