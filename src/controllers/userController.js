const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const RegistrationCategory = require("../models/RegistrationCategory");
const Nationality = require("../models/Nationality");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register New User
exports.registerUser = async (req, res) => {
  try {
    const {
      nationality_id,
      regcategory_id,
      email,
      mobile_number,
      password,
      fname,
      mname,
      lname,
      fathername,
      mothername,
      place,
      dob,
      category,
      address,
      pan_number,
      aadhaar_number,
      regtype
    } = req.cleanedFormData;

    if (!fname || !lname || !fathername || !mothername || !place || !dob || !category || !address || !pan_number || !aadhaar_number || !regtype) {
      return res.status(400).json({ error: "Missing required personal information fields" });
    }

    // Validate regcategory_id exists
    const regCategory = await RegistrationCategory.findById(regcategory_id);
    if (!regCategory) {
      return res.status(400).json({ error: "Invalid regcategory_id" });
    }
    // Validate nationality_id exists
    const nationality = await Nationality.findById(nationality_id);
    if (!nationality) {
      return res.status(400).json({ error: "Invalid nationality_id" });
    }
    // Check if email is already used
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email Already Exist" });
    }
    // Check if mobile number is already used
    const existingMobile = await User.findOne({ mobile_number });
    if (existingMobile) return res.status(409).json({ error: "Mobile number already exists" });

    // Enforce strong password policy (at least 8 chars)
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }


    // Prepare file paths before saving
    const fullName = [fname, mname, lname].filter(Boolean).join('_');
    const safeName = fullName.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/[ ]+/g, '_');
    const uploadPath = path.join(__dirname, '../uploads', safeName);
    fs.mkdirSync(uploadPath, { recursive: true });

    const updatedPaths = {};

    for (const [key, file] of Object.entries(req.fileBufferMap)) {
      const fileName = `${Date.now()}-${key}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadPath, fileName);
      fs.writeFileSync(filePath, file.buffer);
      updatedPaths[key] = filePath;

      // Inject file path into cleanedFormData using correct variable
      req.cleanedFormData[key] = filePath;
    }

    // Now create and save user with files included
    const user = new User(req.cleanedFormData);
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Welcome to Telangana Dental Council',
      message: `<h3>Hello,</h3><h3> ${user.fname} ${user.mname} ${user.lname},</h3><p>Thank you for registering with the TDC portal.</p>`
    });
    const token = generateToken(user._id);

    console.log("Registratuon successful:...............");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        email: user.email,
        mobile_number: user.mobile_number
      }
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// LOGIN User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullname: `${user.fname} ${user.mname} ${user.lname}`,
      email: user.email
    }
  });
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user
  });
};

// FORGOT PASSWORD 
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // 2. Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 3. Hash and save token to user document
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // expires in 15 minutes

  await user.save({ validateBeforeSave: false });

  // 4. Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

  // 5. Send email
  const fullName = [user.fname, user.mname, user.lname].filter(Boolean).join(' ');
  const message = `
    <h3>Hello,</h3>
    <h3>${fullName},</h3>
    <p>You requested to reset your password.</p>
    <p>Please click the link below to reset:</p>
    <a href="${resetUrl}" style="color: blue;">Reset Password</a>
    <p>This link will expire in 15 minutes.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'TSDC Password Reset Request',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Reset password email sent',
      resetUrl // Optional: return this for manual testing
    });
  } catch (error) {
    console.error("Email send error:", err);
    // Rollback token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }
};


// Reset Password
exports.resetPassword = async (req, res) => {
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({ success: true, token, message: 'Password updated successfully' });
};


// Get Registration Categories
exports.getRegistertaionCategory = async (req, res) => {
  try {
    const categories = await RegistrationCategory.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};




