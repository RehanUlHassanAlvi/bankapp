const { CertificateOfIncorporation } = require('../../models');

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

// Save a new certificate of incorporation or update an existing one
const saveCertificateOfIncorporation = async (req, res) => {
  try {
    const { id, ...certificateData } = req.body;

    let certificate;
    if (id) {
      certificate = await CertificateOfIncorporation.findByPk(id);
      if (certificate) {
        await certificate.update(certificateData);
        res.json({ message: 'Certificate of Incorporation updated successfully', certificate });
      } else {
        res.status(404).json({ message: 'Certificate of Incorporation not found' });
      }
    } else {
      certificate = await CertificateOfIncorporation.create(certificateData);
      res.status(201).json({ message: 'Certificate of Incorporation created successfully', certificate });
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
