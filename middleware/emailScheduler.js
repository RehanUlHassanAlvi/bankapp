const cron = require('node-cron');
const {user}=require('../models/Users')
const sendEmail = require('../utils/sendEmail');

// Schedule task to run at 10:00 AM on Monday, Wednesday, and Friday
cron.schedule('0 10 * * 1,3,5', async () => {
    const users=user.findAll();
    for (let i=0; i< users.length;i++){
        if(users[i].isKycVerified==2){
            await sendEmail(user[i].email, 'Pending Documents', 'Dear User!\nGood day Please note that you KYC is pending. Please click here www.google.com to complete your KYC.\n\nRegards Certus Team')

        }
    }
});

console.log('Task scheduled to run three times a week.');