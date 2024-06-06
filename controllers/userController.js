const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User,Document,DocumentType } = require('../models');
const UserDetails = require('../models/UserDetails');
require('dotenv').config();




const saveUserDetails = async (req, res) => {
  const {
    email,
    password,
    name,
    gender,
    dob,
    nationality,
    country,
    state,
    city,
    pincode,
    address,
    phoneCode,
    phoneNumber,
    postalAddress,
    imageUrl
  } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }
    console.log(password,user.password)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user details already exist
    const userDetails = await UserDetails.findOne({ where: { userId: user.id } });

    if (userDetails) {
      // Update existing user details
      await w.update({
        name,
        gender,
        dob,
        nationality,
        country,
        state,
        city,
        pincode,
        address,
        email,
        phoneCode,
        phoneNumber,
        postalAddress,
        imageUrl
      });

      res.status(200).json({ message: 'User details updated successfully' });
    } else {
      console.log("creating user details")
      await UserDetails.create({
        userId: user.id,
        name,
        gender,
        dob,
        nationality,
        country,
        state,
        city,
        pincode,
        address,
        email,
        phoneCode,
        phoneNumber,
        postalAddress,
        imageUrl
      });

      res.status(201).json({ message: 'User details created successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getUserDetails = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userDetails = await UserDetails.findOne({ where: { userId } });
  
      if (!userDetails) {
        return res.status(404).json({ message: 'User details not found' });
      }
  
      res.status(200).json(userDetails);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  

module.exports = { saveUserDetails,getUserDetails };
