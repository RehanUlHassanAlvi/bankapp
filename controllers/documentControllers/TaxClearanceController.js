const { TaxClearance } = require('../../models');
const { createDocument } = require('../docController');

// Get a specific tax clearance by ID
const getTaxClearanceById = async (req, res) => {
  try {
    const taxClearance = await TaxClearance.findByPk(req.params.id);
    if (taxClearance) {
      res.json(taxClearance);
    } else {
      res.status(404).json({ message: 'Tax Clearance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all tax clearances
const getAllTaxClearances = async (req, res) => {
  try {
    const taxClearances = await TaxClearance.findAll();
    res.json(taxClearances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const saveTaxClearance = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from the authenticated user
    const { id, documentId, expiryDate, attachmentUrl } = req.body;

    let taxClearance;
    if (id) {
      taxClearance = await TaxClearance.findByPk(id);
      if (taxClearance) {
        await taxClearance.update({ documentId, expiryDate, attachmentUrl });
        res.json({ message: 'Tax Clearance updated successfully', taxClearance });
      } else {
        res.status(404).json({ message: 'Tax Clearance not found' });
      }
    } else {
      // Save the document for the document type
      const document = await createDocument(userId,6);
      documentId=doc.id
      taxClearance = await TaxClearance.create({ documentId, expiryDate, attachmentUrl });
      res.status(201).json({ message: 'Tax Clearance created successfully', taxClearance, document });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a tax clearance
const deleteTaxClearance = async (req, res) => {
  try {
    const taxClearance = await TaxClearance.findByPk(req.params.id);
    if (taxClearance) {
      await taxClearance.destroy();
      res.json({ message: 'Tax Clearance deleted successfully' });
    } else {
      res.status(404).json({ message: 'Tax Clearance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getTaxClearanceById,
  getAllTaxClearances,
  saveTaxClearance,
  deleteTaxClearance
};
