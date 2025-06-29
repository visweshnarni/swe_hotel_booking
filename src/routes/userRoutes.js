const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { registerUser, loginUser } = require('../controllers/userController');
const RegistrationCategory = require('../models/RegistrationCategory');
const categoryFieldsMap = require('../utils/categoryFieldsMap');
const multer = require('multer');
const tempUpload = multer(); // used only to read regcategory_id and fullname

const commonFields = [
  { name: 'pan_upload', maxCount: 1 },
  { name: 'aadhaar_upload', maxCount: 1 },
  { name: 'sign_upload', maxCount: 1 }
];


const dynamicUploadMiddleware = async (req, res, next) => {
  tempUpload.any()(req, res, async (err) => {
    if (err) {
      console.error('❌ Parsing error before actual upload:', err);
      return res.status(400).json({ message: 'Parse error', error: err.message });
    }

    const categoryId = req.body.regcategory_id?.trim();
    const fullname = req.body.fullname;

    console.log('📨 regcategory_id:', categoryId);
    console.log('📦 fullname:', fullname);

    if (!categoryId) {
      return res.status(400).json({ message: 'Missing regcategory_id' });
    }

    try {
      const categoryDoc = await RegistrationCategory.findById(categoryId);
      if (!categoryDoc) {
        return res.status(400).json({
          message: 'Invalid registration category ID',
          availableCategories: Object.keys(categoryFieldsMap)
        });
      }

      const categoryFields = categoryFieldsMap[categoryDoc.name] || [];
      const fullUploadFields = [...commonFields, ...categoryFields];
      console.log('✅ Expected fields:', fullUploadFields);

      // Now call final multer for actual upload
      const finalUpload = upload.fields(fullUploadFields);
      finalUpload(req, res, (err) => {
        if (err) {
          console.error('❌ Multer Upload Error:', err);
          return res.status(400).json({ message: 'Upload error', error: err.message });
        }
        req.categoryDoc = categoryDoc;
        next();
      });

    } catch (e) {
      console.error('❌ Middleware failure:', e);
      return res.status(500).json({ message: 'Internal error', error: e.message });
    }
  });
};

// ✅ Apply the working middleware (no extractBody)
router.post('/register', dynamicUploadMiddleware, registerUser);
router.post('/login', loginUser);

module.exports = router;
