
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

// Certificate of Incorporation Routes
router.get('/certificate-of-incorporation/:id', certificateOfIncorporationController.getCertificateOfIncorporationById);
router.get('/certificate-of-incorporation', certificateOfIncorporationController.getAllCertificatesOfIncorporation);
router.post('/certificate-of-incorporation', certificateOfIncorporationController.saveCertificateOfIncorporation);
router.put('/certificate-of-incorporation/:id', certificateOfIncorporationController.saveCertificateOfIncorporation);
router.delete('/certificate-of-incorporation/:id', certificateOfIncorporationController.deleteCertificateOfIncorporation);

// Identity Document Routes
router.get('/identity-document/:id', identityDocumentController.getIdentityDocumentById);
router.get('/identity-document', identityDocumentController.getAllIdentityDocuments);
router.post('/identity-document', identityDocumentController.saveIdentityDocument);
router.put('/identity-document/:id', identityDocumentController.saveIdentityDocument);
router.delete('/identity-document/:id', identityDocumentController.deleteIdentityDocument);

// Proof of Income Routes
router.get('/proof-of-income/:id', proofOfIncomeController.getProofOfIncomeById);
router.get('/proof-of-income', proofOfIncomeController.getAllProofsOfIncome);
router.post('/proof-of-income', proofOfIncomeController.saveProofOfIncome);
router.put('/proof-of-income/:id', proofOfIncomeController.saveProofOfIncome);
router.delete('/proof-of-income/:id', proofOfIncomeController.deleteProofOfIncome);

// Proof of Operating Address Routes
router.get('/proof-of-operating-address/:id', proofOfOperatingAddressController.getProofOfOperatingAddressById);
router.get('/proof-of-operating-address', proofOfOperatingAddressController.getAllProofsOfOperatingAddress);
router.post('/proof-of-operating-address', proofOfOperatingAddressController.saveProofOfOperatingAddress);
router.put('/proof-of-operating-address/:id', proofOfOperatingAddressController.saveProofOfOperatingAddress);
router.delete('/proof-of-operating-address/:id', proofOfOperatingAddressController.deleteProofOfOperatingAddress);

// Proof of Residence Routes
router.get('/proof-of-residence/:id', proofOfResidenceController.getProofOfResidenceById);
router.get('/proof-of-residence', proofOfResidenceController.getAllProofsOfResidence);
router.post('/proof-of-residence', proofOfResidenceController.saveProofOfResidence);
router.put('/proof-of-residence/:id', proofOfResidenceController.saveProofOfResidence);
router.delete('/proof-of-residence/:id', proofOfResidenceController.deleteProofOfResidence);

// Tax Clearance Routes
router.get('/tax-clearance/:id', taxClearanceController.getTaxClearanceById);
router.get('/tax-clearance', taxClearanceController.getAllTaxClearances);
router.post('/tax-clearance', taxClearanceController.saveTaxClearance);
router.put('/tax-clearance/:id', taxClearanceController.saveTaxClearance);
router.delete('/tax-clearance/:id', taxClearanceController.deleteTaxClearance);

module.exports = router;
