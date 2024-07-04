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
    const { userId, id, expiryDate, attachmentUrl } = req.body;

    let taxClearance;

    if (id) {
      // If an id is provided, update the existing TaxClearance
      taxClearance = await TaxClearance.findByPk(id);
      if (taxClearance) {
        await taxClearance.update({ expiryDate, attachmentUrl });
        res.json({ message: 'Tax Clearance updated successfully', taxClearance });
      } else {
        res.status(404).json({ message: 'Tax Clearance not found' });
      }
    } else {
      // If no id is provided, create a new TaxClearance
      console.log('Processing user:', userId);
      // Save the document for the document type
      const document = await createDocument(userId, 6);
      console.log('Document ID:', document.id);
      
      taxClearance = await TaxClearance.create({ documentId: document.id, expiryDate, attachmentUrl });
      res.status(201).json({ message: 'Tax Clearance created successfully', taxClearance, document });
    }
  } catch (error) {
    console.error('Error saving Tax Clearance:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



const saveClientTaxClearance = async (req, res) => {
  try {
    const { userId,id, expiryDate, attachmentUrl } = req.body;
    const docExists=userController.getDocumentsAgainstAUserAndTypeFunction(userId,6)

    let taxClearance;

    if (id || docExists) {
      // If an id is provided, update the existing TaxClearance
      taxClearance = await TaxClearance.findByPk(id);
      if (taxClearance) {
        await taxClearance.update({ expiryDate, attachmentUrl });
        res.json({ message: 'Tax Clearance updated successfully', taxClearance });
      } else {
        res.status(404).json({ message: 'Tax Clearance not found' });
      }
    } else {
      // If no id is provided, create a new TaxClearance
      console.log('Processing user:', userId);
      // Save the document for the document type
      const document = await createDocument(userId, 6);
      console.log('Document ID:', document.id);
      
      taxClearance = await TaxClearance.create({ documentId: document.id, expiryDate, attachmentUrl });
      res.status(201).json({ message: 'Tax Clearance created successfully', taxClearance, document });
    }
  } catch (error) {
    console.error('Error saving Tax Clearance:', error);
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
  deleteTaxClearance,
  saveClientTaxClearance
};
