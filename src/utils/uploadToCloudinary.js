// utils/uploadToCloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const streamifier = require('streamifier');

// Load env vars
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a buffer to Cloudinary with proper naming and .pdf extension
 * @param {Buffer} buffer - File buffer (PDF or other raw type)
 * @param {string} filename - Original filename (e.g., "pan_upload.pdf")
 * @param {string} folder - Folder path inside Cloudinary (e.g., "tdc/John_A_Doe")
 * @returns {Promise<string>} - Secure Cloudinary file URL
 */
exports.uploadBufferToCloudinary = async (buffer, filename, folder) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const cleanFilename = filename.replace(/\.[^/.]+$/, ''); // Remove extension
    const publicId = `${folder}/${timestamp}-${cleanFilename}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', // Required for PDFs and other non-image files
        public_id: publicId,
        format: 'pdf', // Ensures the .pdf extension is added to the URL
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result.secure_url); // Includes .pdf extension
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

