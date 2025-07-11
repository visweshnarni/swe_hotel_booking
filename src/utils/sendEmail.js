const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Transporter config (Use Gmail or Mailtrap or SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // app password
    }
  });

  // 2. Mail options
  const mailOptions = {
    from: '"TDC" <no-reply@tdc.gov.in>',
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};



module.exports = sendEmail;
