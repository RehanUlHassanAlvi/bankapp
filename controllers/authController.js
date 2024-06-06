const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

const register = async (req, res) => {
  const { password, email, type } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 100); // OTP valid for 10 minutes

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save OTP details to the database
    const newUser = await User.create({ email, password: hashedPassword, type, otp, otpExpiry });

    // Send OTP via email
    await sendEmail(newUser.email, 'Your OTP Code', `Your OTP code is ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Clear OTP fields and set OTP verified flag
    user.otp = null;
    user.otpExpiry = null;
    user.isOtpVerified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'OTP verified', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 100); // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.isOtpVerified = false; // Reset OTP verification status
    await user.save();

    // Send OTP via email
    await sendEmail(user.email, 'Your New OTP Code', `Your new OTP code is ${otp}`);

    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const addKyc = async (req,res) => {

  const { email, kycUrl } = req.body;
  const user = await User.findOne({ where: { email } });
  
  try {
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

    // Check if OTP is verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }

   user.kycImageURL=kycUrl;
    await user.save();
    
    res.status(200).json({ message: 'KYC added Successfully, Admin will verify' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateKycStatus = async (req,res) => {

  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  
  try {
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

    // Check if OTP is verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }

   user.isKycVerified=true;
    await user.save();
    
    res.status(200).json({ message: 'KYC updated Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, verifyOtp, resendOtp,addKyc,updateKycStatus };
