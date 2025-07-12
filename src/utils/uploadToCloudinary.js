// utils/uploadToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload PDF buffer to Cloudinary inside tdc/fullName/
 * @param {Buffer} buffer - PDF buffer
 * @param {string} filename - e.g. "16893728499-pan_upload.pdf"
 * @param {string} fullName - Folder like "John_A_Doe"
 */
export const uploadBufferToCloudinary = async (buffer, filename, fullName) => {
  return new Promise((resolve, reject) => {
    const publicId = `tdc/${fullName}/${filename.replace('.pdf', '')}`;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',        // ensure it's treated as raw (PDF)
        public_id: publicId,         // ensures folder structure
        format: 'pdf'               // set correct format
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
