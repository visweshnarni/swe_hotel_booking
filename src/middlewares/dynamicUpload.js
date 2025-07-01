const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CategoryFieldsMap = require('../utils/CategoryFieldsMap');
const RegistrationCategory = require('../models/RegistrationCategory');
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let rawName = req.body.fullname || 'unknown_user';
    const safeName = rawName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    const uploadPath = path.join(__dirname, '../uploads', safeName);

    fs.mkdirSync(uploadPath, { recursive: true }); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname))
});

const dynamicUpload = async (req, res, next) => {
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
  }).any();

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Each file must be under 5MB' });
    }
    if (err) {
      return res.status(400).json({ error: 'File upload error', details: err.message });
    }

    try {
      console.log('🧾 regcategory_id received:', req.body.regcategory_id);
      console.log('🧾 type:', typeof req.body.regcategory_id);

      const { regcategory_id } = req.body;
      if (!regcategory_id) return res.status(400).json({ error: 'regcategory_id is required' });

      const category = await RegistrationCategory.findById(regcategory_id);
      console.log('📌 category found:', category);
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

      const filesMap = {};
      req.files.forEach(file => {
        filesMap[file.fieldname] = file.path;
      });

      req.cleanedFormData = {
        ...req.body,
        ...filesMap
      };

      next();
    } catch (err) {
      console.error('Middleware Error:', err);
      res.status(500).json({ error: 'Middleware processing error', details: err.message });
    }
  });
};

module.exports = dynamicUpload;
