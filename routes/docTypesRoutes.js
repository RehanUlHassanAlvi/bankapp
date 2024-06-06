const express = require('express');
const {
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
  getDocumentTypes,
  getDocumentTypeById
} = require('../controllers/docTypeController');

const router = express.Router();

router.post('/add', addDocumentType);
router.put('/update/:id', updateDocumentType);
router.delete('/delete/:id', deleteDocumentType);
router.get('/', getDocumentTypes);
router.get('/:id', getDocumentTypeById);

module.exports = router;
