import nodemailer from 'nodemailer';

/**
 * Sends an email using nodemailer with Gmail transporter.
 * @param {Object} options - Email details.
 * @param {string} options.email - Recipient email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.message - HTML content of the email.
 */
const sendEmail = async (options) => {
  // 1. Transporter config (Gmail, SMTP, etc.)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS  // your Gmail app password
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

export default sendEmail;
