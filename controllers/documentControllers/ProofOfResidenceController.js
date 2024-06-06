const { ProofOfResidence } = require('../../models');

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

// Save a new proof of residence or update an existing one
const saveProofOfResidence = async (req, res) => {
  try {
    const { id, ...proofOfResidenceData } = req.body;

    let proofOfResidence;
    if (id) {
      proofOfResidence = await ProofOfResidence.findByPk(id);
      if (proofOfResidence) {
        await proofOfResidence.update(proofOfResidenceData);
        res.json({ message: 'Proof of Residence updated successfully', proofOfResidence });
      } else {
        res.status(404).json({ message: 'Proof of Residence not found' });
      }
    } else {
      proofOfResidence = await ProofOfResidence.create(proofOfResidenceData);
      res.status(201).json({ message: 'Proof of Residence created successfully', proofOfResidence });
    }
  } catch (error) {
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
