const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Document, DocumentType } = require('../models');
const UserDetails = require('../models/UserDetails');
const sendEmail = require('../utils/sendEmail');

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

const updateStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      isKycVerified: status === 'approved' ? 1 : status === 'rejected' ? 0 : 'pending'
    });
    await sendEmail(User.email, 'KYC '+status, 'Dear User!\nYour KYC status is updated to: '+status)

    return res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { updateStatus };


const getAllusers = async (req, res) => {

  try {

    const userDetails = await User.findAll();

    if (!userDetails) {
      return res.status(404).json({ message: 'Users not found' });
    }

    res.status(200).json(userDetails);
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


const getDocumentsAgainstAUserFunction= async (userId)=>{
    const docs = await Document.findAll({ where: { userId } });
    return docs;
}

const getDocumentsAgainstAUserAndTypeFunction = async (userId, docTypeId) => {
  const docs = await Document.findAll({ where: { userId, documentTypeId: docTypeId } });
  return docs;
};


const getDocumentsAgainstAUser = async (req, res) => {

  try {
    const userId = req.user.id; 

    const docs = await getDocumentsAgainstAUserFunction(userId)

    if (!docs) {
      return res.status(404).json({ message: 'No Documents Found Against this user' });
    }

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllusers,saveUserDetails, getUserDetails,getDocumentsAgainstAUser,getDocumentsAgainstAUserFunction,getDocumentsAgainstAUserAndTypeFunction,updateStatus };
