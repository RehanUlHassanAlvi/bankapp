const express = require('express');
const { saveUserDetails,getUserDetails,getDocumentsAgainstAUser ,getAllusers,updateStatus,getUserCounts,getUsersByKycVerifiedStatus,updateBStatus,getUsersByKycVerifiedStatusEasy} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/saveUserDetails',authenticateToken, saveUserDetails);
router.get('/getUserDetails',authenticateToken, getUserDetails);
router.get('/getDocs',authenticateToken, getDocumentsAgainstAUser);
router.get('/getAllUsers',authenticateToken, getAllusers);
router.post('/updateStatuss',authenticateToken, updateStatus);
router.post('/updateBStatus', updateBStatus);
router.get('/userCounts',authenticateToken, getUserCounts);
router.post('/getUsersByStatus',authenticateToken, getUsersByKycVerifiedStatus);
router.post('/getUsersByStatusLessData',authenticateToken, getUsersByKycVerifiedStatusEasy);




module.exports = router;
