const { CertificateOfIncorporation } = require('../../models');
const { createDocument } = require('../docController');

// Get a specific certificate of incorporation by ID
const getCertificateOfIncorporationById = async (req, res) => {
  try {
    const certificate = await CertificateOfIncorporation.findByPk(req.params.id);
    if (certificate) {
      res.json(certificate);
    } else {
      res.status(404).json({ message: 'Certificate of Incorporation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all certificates of incorporation
const getAllCertificatesOfIncorporation = async (req, res) => {
  try {
    const certificates = await CertificateOfIncorporation.findAll();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const saveCertificateOfIncorporation = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from the authenticated user
    const { id, companyNumber, attachmentUrl } = req.body;

    let certificate;
    if (id) {
      certificate = await CertificateOfIncorporation.findByPk(id);
      if (certificate) {
        await certificate.update({ documentId, companyNumber, attachmentUrl });
        res.json({ message: 'Certificate of Incorporation updated successfully', certificate });
      } else {
        res.status(404).json({ message: 'Certificate of Incorporation not found' });
      }
    } else {
      // Save the document for the document type
      const document = await createDocument(userId,2);
      let doc=await createDocument(req.user.id,1); 
      documentId=doc.id
      certificate = await CertificateOfIncorporation.create({ documentId, companyNumber, attachmentUrl });
      res.status(201).json({ message: 'Certificate of Incorporation created successfully', certificate, document });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a certificate of incorporation
const deleteCertificateOfIncorporation = async (req, res) => {
  try {
    const certificate = await CertificateOfIncorporation.findByPk(req.params.id);
    if (certificate) {
      await certificate.destroy();
      res.json({ message: 'Certificate of Incorporation deleted successfully' });
    } else {
      res.status(404).json({ message: 'Certificate of Incorporation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getCertificateOfIncorporationById,
  getAllCertificatesOfIncorporation,
  saveCertificateOfIncorporation,
  deleteCertificateOfIncorporation
};
