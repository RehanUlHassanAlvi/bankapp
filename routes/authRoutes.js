const express = require('express');
const { register, login, verifyOtp, resendOtp, addKyc, updateKycStatus, forgotPassword, resetPassword, refreshToken } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/add-kyc', authenticateToken, addKyc);
router.post('/update-kyc-status', authenticateToken, updateKycStatus);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

module.exports = router;
