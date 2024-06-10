const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Document, DocumentType } = require('../models');
const UserDetails = require('../models/UserDetails');
require('dotenv').config();

const saveUserDetails = async (req, res) => {
  const {
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
  } = req.body;

  const userId = req.user.id; // Get user ID from the authenticated token

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }
    // Check if user details already exist
    const userDetails = await UserDetails.findOne({ where: { userId: user.id } });

    if (userDetails) {
      // Update existing user details
      await userDetails.update({
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

  try {
    const userId = req.user.id; // Get user ID from the authenticated token

    const userDetails = await UserDetails.findOne({ where: { userId } });

    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    res.status(200).json(userDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getDocumentsAgainstAUser = async (req, res) => {
  const userId = req.user.id; 

  try {
    const docs = await Document.findAll({ where: { userId } });

    if (!docs) {
      return res.status(404).json({ message: 'No Documents Found Against this user' });
    }

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveUserDetails, getUserDetails,getDocumentsAgainstAUser };
