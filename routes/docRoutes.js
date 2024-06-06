const express = require('express');
const {
  saveDocument,
  deleteDocument,
  getDocuments,
  getDocumentById
} = require('../controllers/docController');

const router = express.Router();

router.post('/add', saveDocument);
router.delete('/delete/:id', deleteDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);

module.exports = router;
