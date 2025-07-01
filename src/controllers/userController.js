const RegistrationCategory = require("../models/RegistrationCategory");
const Nationality = require("../models/Nationality"); 
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { nationality_id, regcategory_id } = req.cleanedFormData;

    // ✅ Validate regcategory_id exists
    const category = await RegistrationCategory.findById(regcategory_id);
    if (!category) {
      return res.status(400).json({ error: "Invalid regcategory_id" });
    }

    // ✅ Validate nationality_id exists
    const nationality = await Nationality.findById(nationality_id);
    if (!nationality) {
      return res.status(400).json({ error: "Invalid nationality_id" });
    }

    // ✅ Proceed to create user
    const user = new User(req.cleanedFormData);
    await user.save();

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error("Controller Error:", err);
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




