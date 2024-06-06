const express = require('express');
const { register, login, verifyOtp, resendOtp,addKyc,updateKycStatus, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/addKyc', addKyc);
router.post('/updateKycStatus', updateKycStatus);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
module.exports = router;
