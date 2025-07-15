import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import GSC from '../models/GSC.js';
import { uploadBufferToCloudinary } from '../utils/uploadToCloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const submitGSC = async (req, res) => {
  try {
    const { postal_address } = req.cleanedFormData;
    const userId = req.user._id;

    const requiredFields = [
      'tdc_reg_certificate_upload',
      'testimonial_d1_upload',
      'testimonial_d2_upload',
      'aadhaar_upload',
      'tdc_reg_d1_upload',
      'tdc_reg_d2_upload'
    ];

    // Check all required files are uploaded
    for (const field of requiredFields) {
      if (!req.fileBufferMap[field]) {
        return res.status(400).json({ error: `Missing required file: ${field}` });
      }
    }

    if (!postal_address) {
      return res.status(400).json({ error: 'Postal address is required' });
    }

    const fullName = [req.user.f_name, req.user.m_name, req.user.l_name].filter(Boolean).join('_').replace(/\s+/g, '_');
    const safeName = fullName.replace(/[^a-zA-Z0-9_]/g, '');

    const savedFiles = {};

    for (const [fieldName, file] of Object.entries(req.fileBufferMap)) {
      const timestamp = Date.now();
      const filename = `${timestamp}-${fieldName}.pdf`;
      const cloudinaryUrl = await uploadBufferToCloudinary(file.buffer, filename, safeName);
      savedFiles[fieldName] = cloudinaryUrl;

      // Optional: Save locally too
      const folderPath = path.join(__dirname, '..', 'uploads', safeName);
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(path.join(folderPath, filename), file.buffer);
    }

    const gsc = new GSC({
      user_id: userId,
      postal_address,
      ...savedFiles
    });

    await gsc.save();

    res.status(201).json({ success: true, message: 'GSC submitted successfully', data: gsc });
  } catch (error) {
    console.error('GSC Submission Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
