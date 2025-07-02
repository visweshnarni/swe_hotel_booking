const multer = require('multer');
const path = require('path');
const RegistrationCategory = require('../models/RegistrationCategory');
const CategoryFieldsMap = require('../utils/categoryFieldsMap');
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage(); // ✅ Use memoryStorage

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

const dynamicUpload = async (req, res, next) => {
  const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } }).any();

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Each file must be under 5MB' });
    }
    if (err) {
      return res.status(400).json({ error: 'File upload error', details: err.message });
    }

    try {
      const { regcategory_id } = req.body;
      if (!regcategory_id) return res.status(400).json({ error: 'regcategory_id is required' });

      const category = await RegistrationCategory.findById(regcategory_id);
      if (!category) return res.status(400).json({ error: 'Invalid regcategory_id' });

      req.regCategoryName = category.name;

      const baseFields = ['pan_upload', 'aadhaar_upload', 'sign_upload'];
      const dynamicFields = (CategoryFieldsMap[category.name] || []).map(f => f.name);
      const requiredFields = [...baseFields, ...dynamicFields];

      const uploadedFields = (req.files || []).map(file => file.fieldname);
      const missingFields = requiredFields.filter(field => !uploadedFields.includes(field));

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Missing required files',
          missing: missingFields
        });
      }

      // ✅ Save req.cleanedFormData, and raw file buffers for now
      req.cleanedFormData = { ...req.body };
      req.fileBufferMap = {};

      req.files.forEach(file => {
        req.fileBufferMap[file.fieldname] = file; // full file object with buffer
      });

      next();
    } catch (err) {
      console.error('Middleware Error:', err);
      res.status(500).json({ error: 'Middleware processing error', details: err.message });
    }
  });
};

module.exports = dynamicUpload;
