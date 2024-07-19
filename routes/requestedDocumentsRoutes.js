const express = require('express');
const {
requestDocument
} = require('../controllers/requestedDocumentController.js');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/updateRequestedDocStatus',authenticateToken, requestDocument);


module.exports = router;