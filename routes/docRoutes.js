const express = require('express');
const {
  saveDocument,
  deleteDocument,
  getDocuments,
  getDocumentById,getDocumentCounts,getDocumentByStatus
} = require('../controllers/docController');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/add',authenticateToken, saveDocument);
router.delete('/delete/:id',authenticateToken, deleteDocument);
router.get('/',authenticateToken, getDocuments);
// router.get('/:id',authenticateToken, getDocumentById);
router.get('/docSummary',authenticateToken, getDocumentCounts);
router.get('/docUser',authenticateToken, getDocumentByStatus);



module.exports = router;
