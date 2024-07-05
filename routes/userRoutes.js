const express = require('express');
const { saveUserDetails,getUserDetails,getDocumentsAgainstAUser ,getAllusers,updateStatus,getUserCounts} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/saveUserDetails',authenticateToken, saveUserDetails);
router.get('/getUserDetails',authenticateToken, getUserDetails);
router.get('/getDocs',authenticateToken, getDocumentsAgainstAUser);
router.get('/getAllUsers',authenticateToken, getAllusers);
router.post('/updateStatuss',authenticateToken, updateStatus);
router.get('/userCounts',authenticateToken, getUserCounts);



module.exports = router;
