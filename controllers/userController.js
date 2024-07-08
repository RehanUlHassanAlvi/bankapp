const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Document, DocumentType,ProofOfOperatingAddress,CertificateOfIncorporation,TaxClearance } = require('../models');
const UserDetails = require('../models/UserDetails');
const sendEmail = require('../utils/sendEmail');
const { register } = require('./authController');
const sequelize=require('../config/config')
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



const updateBStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isKycVerified;
    switch (status) {
      case 'registered':
        isKycVerified = 2;
        break;
      case 'unregistered':
        isKycVerified = 0;
        break;
      case 'approved':
        isKycVerified = 1;
        break;
      default:
        isKycVerified = 0; // Default value if status is not recognized
        break;
    }

    // Perform the update
    await user.update({ isKycVerified });
    await sendEmail(User.email, 'KYC '+status, 'Dear User!\nYour KYC status is updated to: '+status)

    return res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const updateStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isKycVerified;
    switch (status) {
      case 'registered':
        isKycVerified = 2;
        break;
      case 'unregistered':
        isKycVerified = 0;
        break;
      case 'approved':
        isKycVerified = 1;
        break;
      default:
        isKycVerified = 0; // Default value if status is not recognized
        break;
    }

    // Perform the update
    await user.update({ isKycVerified });
    await sendEmail(User.email, 'KYC '+status, 'Dear User!\nYour KYC status is updated to: '+status)

    return res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsersByKycVerifiedStatus = async (req, res) => {
  const { status } = req.body;
  let isKycVerified = 0;
  if (status === "registered") {
    isKycVerified = 2;
  } else if (status === "unregistered") {
    isKycVerified = 0;
  } else if (status === "approved") {
    isKycVerified = 1;
  }

  console.log("kyc", isKycVerified);
  try {
    // Validate isKycVerified input
    if (![0, 1, 2].includes(parseInt(isKycVerified))) {
      return res.status(400).json({ message: 'Invalid isKycVerified status' });
    }

    // Fetch Users based on isKycVerified status
    const users = await User.findAll({
      where: {
        isKycVerified: parseInt(isKycVerified)
      }
    });

    // If no Users found, return empty array or handle as needed
    if (!users || users.length === 0) {
      return res.json([]);
    }

    // Extract userIds from Users
    const userIds = users.map(user => user.id);

    // Fetch UserDetails based on userIds
    const userDetails = await UserDetails.findAll({
      where: {
        userId: userIds
      }
    });

    // Fetch documents for business users
    const businessUserIds = users.filter(user => user.type === 'business').map(user => user.id);

    const certificateDocuments = await Document.findAll({
      where: {
        userId: businessUserIds,
        documentTypeId: 2 // Assuming 2 corresponds to CertificateOfIncorporation
      }
    });

    const proofOfAddressDocuments = await Document.findAll({
      where: {
        userId: businessUserIds,
        documentTypeId: 4 // Assuming 4 corresponds to ProofOfOperatingAddress
      }
    });

    const taxClearanceDocuments = await Document.findAll({
      where: {
        userId: businessUserIds,
        documentTypeId: 6 // Assuming 6 corresponds to TaxClearance
      }
    });

    // Fetch related entries from each document-specific model
    const certificateIds = certificateDocuments.map(doc => doc.id);
    const proofOfAddressIds = proofOfAddressDocuments.map(doc => doc.id);
    const taxClearanceIds = taxClearanceDocuments.map(doc => doc.id);

    const certificatesOfIncorporation = await CertificateOfIncorporation.findAll({
      where: { documentId: certificateIds }
    });

    const proofsOfOperatingAddress = await ProofOfOperatingAddress.findAll({
      where: { documentId: proofOfAddressIds }
    });

    const taxClearances = await TaxClearance.findAll({
      where: { documentId: taxClearanceIds }
    });

    // Map UserDetails and Documents to corresponding Users based on userId
    const usersWithDetails = users.map(user => {
      const userDetail = userDetails.find(detail => detail.userId === user.id);
      
      const userDocuments = user.type === 'business' ? {
        documents: {
          CertificateOfIncorporation: {
            ...certificatesOfIncorporation.find(doc => doc.documentId === certificateDocuments.find(d => d.userId === user.id)?.id),
            status: certificateDocuments.find(d => d.userId === user.id)?.status || null
          },
          ProofOfOperatingAddress: {
            ...proofsOfOperatingAddress.find(doc => doc.documentId === proofOfAddressDocuments.find(d => d.userId === user.id)?.id),
            status: proofOfAddressDocuments.find(d => d.userId === user.id)?.status || null
          },
          TaxClearance: {
            ...taxClearances.find(doc => doc.documentId === taxClearanceDocuments.find(d => d.userId === user.id)?.id),
            status: taxClearanceDocuments.find(d => d.userId === user.id)?.status || null
          }
        }
      } : {};

      return {
        id: user.id,
        email: user.email,
        type: user.type,
        kycImageUrl: user.kycImageURL,
        UserDetails: userDetail || {},
        ...userDocuments // Include documents if user type is 'business'
      };
    });

    // Return the combined data
    res.json(usersWithDetails);
  } catch (error) {
    console.error('Error fetching users by isKycVerified status:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};






const getUsersByKycVerifiedStatusEasy = async (req, res) => {
  const { status } = req.body;
  let isKycVerified = 0;
  if (status === "registered") {
    isKycVerified = 2;
  } else if (status === "unregistered") {
    isKycVerified = 0;
  } else if (status === "approved") {
    isKycVerified = 1;
  }

  console.log("kyc", isKycVerified);
  try {
    // Validate isKycVerified input
    if (![0, 1, 2].includes(parseInt(isKycVerified))) {
      return res.status(400).json({ message: 'Invalid isKycVerified status' });
    }

    // Fetch Users based on isKycVerified status
    const users = await User.findAll({
      where: {
        isKycVerified: parseInt(isKycVerified)
      }
    });

    // If no Users found, return empty array or handle as needed
    if (!users || users.length === 0) {
      return res.json([]);
    }

    // Extract userIds from Users
    const userIds = users.map(user => user.id);

    // Fetch UserDetails based on userIds
    const userDetails = await UserDetails.findAll({
      where: {
        userId: userIds
      }
    });

    // Fetch documents for business users
    const businessUserIds = users.filter(user => user.type === 'business').map(user => user.id);

    const certificateDocuments = await Document.findAll({
      where: {
        userId: businessUserIds,
        documentTypeId: 2 // Assuming 2 corresponds to CertificateOfIncorporation
      }
    });

    const proofOfAddressDocuments = await Document.findAll({
      where: {
        userId: businessUserIds,
        documentTypeId: 4 // Assuming 4 corresponds to ProofOfOperatingAddress
      }
    });

    const taxClearanceDocuments = await Document.findAll({
      where: {
        userId: businessUserIds,
        documentTypeId: 6 // Assuming 6 corresponds to TaxClearance
      }
    });

    // Fetch related entries from each document-specific model
    const certificateIds = certificateDocuments.map(doc => doc.id);
    const proofOfAddressIds = proofOfAddressDocuments.map(doc => doc.id);
    const taxClearanceIds = taxClearanceDocuments.map(doc => doc.id);

    const certificatesOfIncorporation = await CertificateOfIncorporation.findAll({
      where: { documentId: certificateIds }
    });

    const proofsOfOperatingAddress = await ProofOfOperatingAddress.findAll({
      where: { documentId: proofOfAddressIds }
    });

    const taxClearances = await TaxClearance.findAll({
      where: { documentId: taxClearanceIds }
    });

    // Map UserDetails and Documents to corresponding Users based on userId
    const usersWithDetails = users.map(user => {
      const userDetail = userDetails.find(detail => detail.userId === user.id);
      
      const userDocuments = user.type === 'business' ? {
        documents: {
            CertificateOfIncorporation: {
                documentId: certificatesOfIncorporation.find(doc => doc.documentId === certificateDocuments.find(d => d.userId === user.id)?.id)?.documentId || null,
                status: certificateDocuments.find(d => d.userId === user.id)?.status || null
            },
            ProofOfOperatingAddress: {
                documentId: proofsOfOperatingAddress.find(doc => doc.documentId === proofOfAddressDocuments.find(d => d.userId === user.id)?.id)?.documentId || null,
                status: proofOfAddressDocuments.find(d => d.userId === user.id)?.status || null
            },
            TaxClearance: {
                documentId: taxClearances.find(doc => doc.documentId === taxClearanceDocuments.find(d => d.userId === user.id)?.id)?.documentId || null,
                status: taxClearanceDocuments.find(d => d.userId === user.id)?.status || null
            }
        }
    } : {};
    
      

      return {
        id: user.id,
        ...userDocuments // Include documents if user type is 'business'
      };
    });

    // Return the combined data
    res.json(usersWithDetails);
  } catch (error) {
    console.error('Error fetching users by isKycVerified status:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



const getUserCounts = async (req, res) => {
  try {
    // Fetch all users
    const allUsers = await User.findAll({});

    // Initialize counts
    let approvedCount = 0;
    let registeredCount = 0;
    let unregisteredCount = 0;

    // Count users by isKycVerified status
    allUsers.forEach(user => {
      if(user.type!='admin'){
      console.log(user.isKycVerified)
      switch (user.isKycVerified) {
        case 1:
          approvedCount++;
          break;
        case 0:
          unregisteredCount++;
          break;
        case 2:
          registeredCount++;
          break;
        default:
          break;
      }}
    });

    // Prepare response object
    const countsObject = {
      approved: approvedCount,
      registered: registeredCount,
      unregistered: unregisteredCount
    };

    res.json(countsObject);
  } catch (error) {
    console.error('Error fetching user counts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

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

const getAllUsersDetails = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.findAll();
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Users not found' });
    }

    // Get user IDs
    const userIds = users.map(user => user.id);

    // Fetch user details for all users
    const userDetails = await UserDetails.findAll({
      where: {
        userId: userIds
      }
    });

    // Create a map for user details
    const userDetailsMap = {};
    userDetails.forEach(detail => {
      userDetailsMap[detail.userId] = detail;
    });

    // Combine user data with user details
    const combinedDetails = users.map(user => {
      const detail = userDetailsMap[user.id] ? userDetailsMap[user.id].toJSON() : {};
      return {
        id: user.id,
        email: user.email,
        type: user.type,
        otp: user.otp,
        otpExpiry: user.otpExpiry,
        isOtpVerified: user.isOtpVerified,
        isKycVerified: user.isKycVerified,
        kycImageURL: user.kycImageURL,
        refreshToken: user.refreshToken,
        ...detail // Merge userDetails fields
      };
    });

    res.status(200).json(combinedDetails);
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




module.exports = { getAllusers,saveUserDetails, getUserDetails,getDocumentsAgainstAUser,getDocumentsAgainstAUserFunction,getDocumentsAgainstAUserAndTypeFunction,updateStatus,getUserCounts,getUsersByKycVerifiedStatus,updateBStatus,getUsersByKycVerifiedStatusEasy,getAllUsersDetails};
