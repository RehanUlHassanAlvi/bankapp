const express = require('express');
const {
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
  getDocumentTypes,
  getDocumentTypeById
} = require('../controllers/docTypeController');

const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 

router.post('/add',authenticateToken, addDocumentType);
router.put('/update/:id', authenticateToken,updateDocumentType);
router.delete('/delete/:id',authenticateToken, deleteDocumentType);
router.get('/', authenticateToken,getDocumentTypes);
router.get('/:id',authenticateToken, getDocumentTypeById);

module.exports = router;
