const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const CategoryFieldsMap = require('../utils/categoryFieldsMap.js');

const validRegTypes = [
  'Regular (By Post - Fee includes postal charges)',
  'Tatkal (By Hand)'
];

// Register User
exports.registerUser = async (req, res) => {
  // Convert req.files (array) to an object keyed by fieldname for compatibility
  let filesByField = {};
  if (Array.isArray(req.files)) {
    req.files.forEach(file => {
      if (!filesByField[file.fieldname]) filesByField[file.fieldname] = [];
      filesByField[file.fieldname].push(file);
    });
    req.files = filesByField;
  }
  console.log('📥 Incoming file fields:', Object.keys(req.files || {}));
  try {
    console.log('📦 Full request body:', req.body);

    const {
      regcategory_id,
      fullname,
      gender,
      fathername,
      place,
      dob,
      nationality,
      email,
      mobile_number,
      address,
      pan_number,
      aadhaar_number,
      regtype,
      password,
      confirmPassword
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const categoryDoc = req.categoryDoc; // from middleware

    const matchedRegType = validRegTypes.find(
      (type) => type.toLowerCase().trim() === regtype.toLowerCase().trim()
    );
    if (!matchedRegType) {
      return res.status(400).json({ message: 'Invalid registration type' });
    }

    const safeName = fullname.replace(/\s+/g, '_');
    const uploadFolder = path.join(__dirname, '..', 'uploads', safeName);
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const getFile = (field) => {
      const file = req.files?.[field]?.[0];
      console.log(`📥 File for ${field}:`, file ? file.path : 'Not uploaded');
      
      if (!file) return undefined;
      return path.relative(path.join(__dirname, '..'), file.path);
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const baseUser = {
      regcategory_id: categoryDoc._id,
      fullname,
      gender,
      fathername,
      place,
      dob,
      nationality,
      email,
      mobile_number,
      address,
      pan_number,
      pan_upload: getFile('pan_upload'),
      aadhaar_number,
      aadhaar_upload: getFile('aadhaar_upload'),
      sign_upload: getFile('sign_upload'),
      regtype: matchedRegType,
      password: hashedPassword
    };

    const dynamicFields = CategoryFieldsMap[categoryDoc.name] || [];
    dynamicFields.forEach(({ name }) => {
      baseUser[name] = getFile(name) || req.body[name] || undefined;
    });

    const user = new User(baseUser);
    await user.save();

    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile_number: user.mobile_number
      }
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
