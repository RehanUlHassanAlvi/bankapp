const { TaxClearance } = require('../../models');

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

// Save a new tax clearance or update an existing one
const saveTaxClearance = async (req, res) => {
  try {
    const { id, ...taxClearanceData } = req.body;

    let taxClearance;
    if (id) {
      taxClearance = await TaxClearance.findByPk(id);
      if (taxClearance) {
        await taxClearance.update(taxClearanceData);
        res.json({ message: 'Tax Clearance updated successfully', taxClearance });
      } else {
        res.status(404).json({ message: 'Tax Clearance not found' });
      }
    } else {
      taxClearance = await TaxClearance.create(taxClearanceData);
      res.status(201).json({ message: 'Tax Clearance created successfully', taxClearance });
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
