// utils/sendEmail.js
import { SendMailClient } from "zeptomail";
import dotenv from "dotenv";

dotenv.config();

const client = new SendMailClient({
  url: process.env.ZEPTO_URL,
  token: process.env.ZEPTO_TOKEN,
});

/**
 * Send Booking Confirmation Email using ZeptoMail Template
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.templateKey - ZeptoMail template key
 * @param {Object} params.mergeInfo - Merge variables for the template
 */
const sendEmailWithTemplate = async ({ to, name, templateKey, mergeInfo }) => {
  try {
    const response = await client.sendMailWithTemplate({
      mail_template_key: templateKey,
      from: {
        address: process.env.ZEPTO_FROM,
        name: "Hotel Booking Team", // change this to your brand
      },
      to: [
        {
          email_address: {
            address: to,
            name,
          },
        },
      ],
      merge_info: mergeInfo,
    });

    console.log(`✅ Booking email sent successfully to ${to}`);
    return response;
  } catch (error) {
    console.error("❌ ZeptoMail sendEmailWithTemplate error:", error);
    throw error;
  }
};

export default sendEmailWithTemplate;
