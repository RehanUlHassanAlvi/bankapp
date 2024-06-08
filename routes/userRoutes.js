const express = require('express');
const { saveUserDetails,getUserDetails } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/saveUserDetails',authenticateToken, saveUserDetails);
router.get('/userDetails/:userId',authenticateToken, getUserDetails);

module.exports = router;
