const multer = require('multer');
const path = require('path');
const RegistrationCategory = require('../models/RegistrationCategory');
const CategoryFieldsMap = require('../utils/categoryFieldsMap');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

// In-memory file storage
const storage = multer.memoryStorage();

// Only allow PDF files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

// Middleware function
const dynamicUpload = async (req, res, next) => {
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
  }).any();

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Each file must be under 5MB' });
    }
    if (err) {
      return res.status(400).json({ error: 'File upload error', details: err.message });
    }

    try {
      const { regcategory_id } = req.body;

      if (!regcategory_id) {
        return res.status(400).json({ error: 'regcategory_id is required in body' });
      }

      // Fetch category details
      const regCategory = await RegistrationCategory.findById(regcategory_id);
      if (!regCategory) {
        return res.status(400).json({ error: 'Invalid regcategory_id' });
      }

      const categoryName = regCategory.name;
      req.regCategoryName = categoryName;

      // Base required files for all users
      const baseFileFields = ['pan_upload', 'aadhaar_upload', 'sign_upload'];

      // Dynamic fields from categoryFieldsMap
      const dynamicFileFields = (CategoryFieldsMap[categoryName]?.files || []).map(f => f.name);

      const requiredFiles = [...baseFileFields, ...dynamicFileFields];

      // Find uploaded fieldnames
      const uploadedFields = (req.files || []).map(file => file.fieldname);
      const missingFiles = requiredFiles.filter(field => !uploadedFields.includes(field));

      if (missingFiles.length > 0) {
        return res.status(400).json({
          error: 'Missing required files',
          missing: missingFiles
        });
      }

      // Clean form text fields
      req.cleanedFormData = { ...req.body };
      req.fileBufferMap = {};

      // Collect file buffers into memory
      req.files.forEach(file => {
        req.fileBufferMap[file.fieldname] = file;
      });

      next();
    } catch (err) {
      console.error('Dynamic upload middleware error:', err);
      res.status(500).json({ error: 'File processing error', details: err.message });
    }
  });
};

module.exports = dynamicUpload;
