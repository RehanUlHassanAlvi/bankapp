const express = require('express');
const { register, login, verifyOtp, resendOtp,addKyc,updateKycStatus } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/addKyc', addKyc);
router.post('/updateKycStatus', updateKycStatus);

module.exports = router;
