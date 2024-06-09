
const express = require('express');
const router = express.Router();
const {
  certificateOfIncorporationController,
  identityDocumentController,
  proofOfIncomeController,
  proofOfOperatingAddressController,
  proofOfResidenceController,
  taxClearanceController
} = require('../controllers/documentControllers');
const authenticateToken = require('../middleware/authMiddleware'); 

// Certificate of Incorporation Routes
router.get('/certificate-of-incorporation/:id',authenticateToken, certificateOfIncorporationController.getCertificateOfIncorporationById);
router.get('/certificate-of-incorporation', authenticateToken,certificateOfIncorporationController.getAllCertificatesOfIncorporation);
router.post('/save-certificate-of-incorporation', authenticateToken,certificateOfIncorporationController.saveCertificateOfIncorporation);
router.put('/certificate-of-incorporation/:id',authenticateToken, certificateOfIncorporationController.saveCertificateOfIncorporation);
router.delete('/certificate-of-incorporation/:id', authenticateToken,certificateOfIncorporationController.deleteCertificateOfIncorporation);

// Identity Document Routes
router.get('/identity-document/:id',authenticateToken, identityDocumentController.getIdentityDocumentById);
router.get('/all-identity-documents',authenticateToken, identityDocumentController.getAllIdentityDocuments);
router.post('/save-identity-document', authenticateToken,identityDocumentController.saveIdentityDocument);
router.put('/identity-document/:id',authenticateToken, identityDocumentController.saveIdentityDocument);
router.delete('/identity-document/:id',authenticateToken, identityDocumentController.deleteIdentityDocument);

// Proof of Income Routes
router.get('/proof-of-income/:id',authenticateToken, proofOfIncomeController.getProofOfIncomeById);
router.get('/proof-of-income',authenticateToken, proofOfIncomeController.getAllProofsOfIncome);
router.post('/save-proof-of-income',authenticateToken, proofOfIncomeController.saveProofOfIncome);
router.put('/proof-of-income/:id',authenticateToken, proofOfIncomeController.saveProofOfIncome);
router.delete('/proof-of-income/:id',authenticateToken, proofOfIncomeController.deleteProofOfIncome);

// Proof of Operating Address Routes
router.get('/proof-of-operating-address/:id', authenticateToken,proofOfOperatingAddressController.getProofOfOperatingAddressById);
router.get('/proof-of-operating-address', authenticateToken,proofOfOperatingAddressController.getAllProofsOfOperatingAddress);
router.post('/save-proof-of-operating-address', authenticateToken,proofOfOperatingAddressController.saveProofOfOperatingAddress);
router.put('/proof-of-operating-address/:id', authenticateToken,proofOfOperatingAddressController.saveProofOfOperatingAddress);
router.delete('/proof-of-operating-address/:id',authenticateToken, proofOfOperatingAddressController.deleteProofOfOperatingAddress);

// Proof of Residence Routes
router.get('/proof-of-residence/:id', authenticateToken,proofOfResidenceController.getProofOfResidenceById);
router.get('/proof-of-residence',authenticateToken, proofOfResidenceController.getAllProofsOfResidence);
router.post('/save-proof-of-residence', authenticateToken,proofOfResidenceController.saveProofOfResidence);
router.put('/proof-of-residence/:id',authenticateToken, proofOfResidenceController.saveProofOfResidence);
router.delete('/proof-of-residence/:id', authenticateToken,proofOfResidenceController.deleteProofOfResidence);

// Tax Clearance Routes
router.get('/tax-clearance/:id',authenticateToken, taxClearanceController.getTaxClearanceById);
router.get('/tax-clearance', authenticateToken,taxClearanceController.getAllTaxClearances);
router.post('/save-tax-clearance', authenticateToken,taxClearanceController.saveTaxClearance);
router.put('/tax-clearance/:id', authenticateToken,taxClearanceController.saveTaxClearance);
router.delete('/tax-clearance/:id', authenticateToken,taxClearanceController.deleteTaxClearance);

module.exports = router;
