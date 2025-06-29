// middlewares/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    try {
      const fullname = req.body.fullname || 'unknown';
      const safeName = fullname.replace(/\s+/g, '_');
      const uploadFolder = path.join(__dirname, '..', 'uploads', safeName);
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }
      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log('📥 File upload attempt:', file.originalname);
    
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (ext === '.pdf' && mime === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(`${file.originalname} is not a valid PDF file.`));
    }
  }
});

module.exports = upload;
