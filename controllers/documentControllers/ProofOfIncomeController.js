const { ProofOfIncome } = require('../../models');

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

// Save a new proof of income or update an existing one
const saveProofOfIncome = async (req, res) => {
  try {
    const { id, ...proofOfIncomeData } = req.body;

    let proofOfIncome;
    if (id) {
      proofOfIncome = await ProofOfIncome.findByPk(id);
      if (proofOfIncome) {
        await proofOfIncome.update(proofOfIncomeData);
        res.json({ message: 'Proof of Income updated successfully', proofOfIncome });
      } else {
        res.status(404).json({ message: 'Proof of Income not found' });
      }
    } else {
      proofOfIncome = await ProofOfIncome.create(proofOfIncomeData);
      res.status(201).json({ message: 'Proof of Income created successfully', proofOfIncome });
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
