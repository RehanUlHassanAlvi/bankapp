const { ProofOfOperatingAddress } = require('../../models');

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

// Save a new proof of operating address or update an existing one
const saveProofOfOperatingAddress = async (req, res) => {
  try {
    const { id, ...proofOfOperatingAddressData } = req.body;

    let proofOfOperatingAddress;
    if (id) {
      proofOfOperatingAddress = await ProofOfOperatingAddress.findByPk(id);
      if (proofOfOperatingAddress) {
        await proofOfOperatingAddress.update(proofOfOperatingAddressData);
        res.json({ message: 'Proof of Operating Address updated successfully', proofOfOperatingAddress });
      } else {
        res.status(404).json({ message: 'Proof of Operating Address not found' });
      }
    } else {
      proofOfOperatingAddress = await ProofOfOperatingAddress.create(proofOfOperatingAddressData);
      res.status(201).json({ message: 'Proof of Operating Address created successfully', proofOfOperatingAddress });
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
