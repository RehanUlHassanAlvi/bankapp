const express = require('express');
const {
  saveDocument,
  deleteDocument,
  getDocuments,
  getDocumentById,getDocumentCounts,getDocumentByStatus,updateDocumentStats,requestDocumentsForAUser
} = require('../controllers/docController');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/add',authenticateToken, saveDocument);
router.delete('/delete/:id',authenticateToken, deleteDocument);
router.get('/',authenticateToken, getDocuments);
// router.get('/:id',authenticateToken, getDocumentById);
router.get('/docSummary',authenticateToken, getDocumentCounts);
router.post('/docUser',authenticateToken, getDocumentByStatus);
router.post('/updateDocStatus',authenticateToken, updateDocumentStats);
router.post('/updateDocStatus',authenticateToken, requestDocumentsForAUser);




module.exports = router;
