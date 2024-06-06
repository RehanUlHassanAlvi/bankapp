const express = require('express');
const { saveUserDetails,getUserDetails } = require('../controllers/userController');

const router = express.Router();

router.post('/saveUserDetails', saveUserDetails);
router.get('/userDetails/:userId', getUserDetails);

module.exports = router;
