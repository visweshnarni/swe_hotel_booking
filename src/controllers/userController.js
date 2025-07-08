const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const RegistrationCategory = require('../models/RegistrationCategory');
const Nationality = require('../models/Nationality');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ================= REGISTER NEW USER =================
exports.registerUser = async (req, res) => {
  try {
    const {
      nationality_id,
      regcategory_id,
      email,
      mobile_number,
      password,
      f_name,
      m_name,
      l_name,
      father_name,
      mother_name,
      place,
      dob,
      category,
      address,
      pan_number,
      aadhaar_number,
      regtype
    } = req.cleanedFormData;

    // Basic required fields validation
    if (
      !f_name || !l_name || !father_name || !mother_name ||
      !place || !dob || !category || !address ||
      !pan_number || !aadhaar_number || !regtype
    ) {
      return res.status(400).json({ error: "Missing required personal information fields." });
    }
    // Validate MM/YYYY format
    const mmYYYYRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    // Validate BDS qualification years
    if (req.cleanedFormData.bds_qualification_year && !mmYYYYRegex.test(req.cleanedFormData.bds_qualification_year)) {
      return res.status(400).json({ error: "bds_qualification_year must be in MM/YYYY format" });
    }
    // Validate MDS qualification years
    if (req.cleanedFormData.mds_qualification_year && !mmYYYYRegex.test(req.cleanedFormData.mds_qualification_year)) {
      return res.status(400).json({ error: "mds_qualification_year must be in MM/YYYY format" });
    }
    
    // Validate Registration Category
    const regCategory = await RegistrationCategory.findById(regcategory_id);
    if (!regCategory) return res.status(400).json({ error: "Invalid regcategory_id" });

    // Validate Nationality
    const nationality = await Nationality.findById(nationality_id);
    if (!nationality) return res.status(400).json({ error: "Invalid nationality_id" });

    // Check unique email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: "Email already exists" });

    // Check unique mobile number
    const existingMobile = await User.findOne({ mobile_number });
    if (existingMobile) return res.status(409).json({ error: "Mobile number already exists" });

    // Enforce strong password policy
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    // Create folder for storing files
    const fullName = [f_name, m_name, l_name].filter(Boolean).join('_');
    const safeName = fullName.replace(/[^a-zA-Z0-9_]/g, '').replace(/[ ]+/g, '_');
    const uploadPath = path.join(__dirname, '../uploads', safeName);
    fs.mkdirSync(uploadPath, { recursive: true });

    // Save files to disk
    const updatedPaths = {};
    for (const [key, file] of Object.entries(req.fileBufferMap)) {
      const fileName = `${Date.now()}-${key}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadPath, fileName);
      fs.writeFileSync(filePath, file.buffer);
      updatedPaths[key] = filePath;

      // Attach file path to cleanedFormData
      req.cleanedFormData[key] = filePath;
    }

    // Create User document
    const user = new User(req.cleanedFormData);
    await user.save();

    // Send welcome email
    await sendEmail({
      email: user.email,
      subject: 'Welcome to Telangana Dental Council',
      message: `
        <h3>Hello ${user.f_name},</h3>
        <p>Thank you for registering with the Telangana Dental Council Portal.</p>
      `
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      data: {
        id: user._id,
        f_name: user.f_name,
        m_name: user.m_name,
        l_name: user.l_name,
        email: user.email,
        mobile_number: user.mobile_number
      }
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullname: `${user.f_name} ${user.m_name || ''} ${user.l_name}`.trim(),
      email: user.email
    }
  });
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;
  const message = `
    <h3>Hello ${user.f_name},</h3>
    <p>You requested to reset your password.</p>
    <p><a href="${resetUrl}">Click here to reset your password</a></p>
    <p>This link expires in 15 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'TSDC Password Reset Request',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Reset password email sent.',
      resetUrl // Useful for testing
    });
  } catch (error) {
    console.error("Email sending error:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({ success: false, message: 'Failed to send reset email.' });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    message: 'Password updated successfully.'
  });
};

// ================= GET REGISTRATION CATEGORIES =================
exports.getRegistrationCategories = async (req, res) => {
  try {
    const categories = await RegistrationCategory.find({});
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registration categories." });
  }
};

// ================= GET NATIONALITIES =================
exports.getNationalities = async (req, res) => {
  try {
    const nationalities = await Nationality.find({});
    res.status(200).json(nationalities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch nationalities." });
  }
};

