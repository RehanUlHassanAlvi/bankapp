const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const sendEmail = require('../utils/sendEmail');
const UserDetails = require('../models/UserDetails');

require('dotenv').config();

const register = async (req, res) => {
  const { name,password, email, type,companyName,website,country,state,city,imageUrl,postalAddress } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'A User with this Email already Exists!' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save OTP details to the database
    const newUser = await User.create({ email, password: hashedPassword, type, otp, otpExpiry });
    if (type==='business'){
    await UserDetails.create({
      userId: newUser.id,
      name:companyName,
      country,
      state,
      city,
      address:website,
      postalAddress,
      email,
      imageUrl
    });
    }
    else if (type ==='user'){
      await UserDetails.create({
        userId: newUser.id,
        name
      });
    }

    // Send OTP via email
    await sendEmail(newUser.email, 'Your OTP Code', `Your OTP code is ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email',userId: newUser.id });
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
    
    // Check if OTP is verified
    // if (!user.isKycVerified) {
    //   return res.status(400).json({ message: 'KYC not verified' });
    // }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store the refresh token in the database
    user.refreshToken = refreshToken;
    const userObj=await user.save();
    const savedUser = userObj.toJSON();

// Constructing the simplified user object
const userResponse = {
    id: savedUser.id,
    email: savedUser.email,
    type: savedUser.type,
    isOtpVerified: savedUser.isOtpVerified,
    isKycVerified: savedUser.isKycVerified,
    kycImageURL: savedUser.kycImageURL,
    refreshToken: savedUser.refreshToken,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt
};
    
    if (user.isKycVerified=1) {
    res.status(200).json({ message: 'Login successful', accessToken, refreshToken, user:userResponse });
    }
    else{
      const {refreshToken, ...userWoRefreshToken}=userResponse
      res.status(200).json({ message: 'Login successful', user:userResponse });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid' });
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
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

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

const addKyc = async (req, res) => {
  const { kycUrl,email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }

    user.kycImageURL = kycUrl;
    user.isKycVerified=2;
    await user.save();

    res.status(200).json({ message: 'KYC added Successfully, Admin will verify' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateKycStatus = async (req, res) => {
  const userId = req.user.id;  // Get user ID from the decoded token

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }

    user.isKycVerified = 1;
    let surname = fullName.substring(fullName.lastIndexOf(' ') + 1);

    let emailText = `Dear ${surname},\n\n` +
    `You are successfully registered to Certus KYC platform. Please click here www.google.com to access your dashboard.\n\n` +
    `Regards,\nCertus Team`;

    await user.save();
    await sendEmail(user.email, 'Your KYC is Verified', emailText);


    res.status(200).json({ message: 'KYC updated Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.isOtpVerified = false; // Reset OTP verification status
    await user.save();

    // Send OTP via email
    await sendEmail(user.email, 'Password Reset OTP', `Your OTP code for password reset is ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email for password reset' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
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

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user with new password and clear OTP fields
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    user.isOtpVerified = true;  
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, verifyOtp, resendOtp, addKyc, updateKycStatus, forgotPassword, resetPassword, refreshToken };
