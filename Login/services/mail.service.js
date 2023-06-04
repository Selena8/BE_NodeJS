const nodemailer = require('nodemailer');
require('dotenv').config();

const mailService = {
  async sendEmail({ emailFrom, emailTo, emailSubject, emailText }) {
    console.log( emailFrom)
    console.log( emailTo)
    console.log( emailSubject)
    console.log( emailText)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
    });
  },
};

Object.freeze(mailService);

module.exports = {
  mailService,
};