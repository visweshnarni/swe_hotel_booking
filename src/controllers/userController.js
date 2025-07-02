const fs = require('fs');
const path = require('path');
const RegistrationCategory = require("../models/RegistrationCategory");
const Nationality = require("../models/Nationality");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { nationality_id,
      regcategory_id,
      email,
      mobile_number,
      password
    } = req.cleanedFormData;

    // Check mandatory field presence
    if (!nationality_id || !regcategory_id || !email || !mobile_number || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    // Validate regcategory_id exists
    const category = await RegistrationCategory.findById(regcategory_id);
    if (!category) {
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
    const rawName = req.cleanedFormData.fullname || 'unknown_user';
    const safeName = rawName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
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

    console.log("Registratuon successful:...............");
    
    res.status(201).json({ success: true, message: "User registered successfully", data: user });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRegistertaionCategory = async (req, res) => {
  try {
    const categories = await RegistrationCategory.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};




