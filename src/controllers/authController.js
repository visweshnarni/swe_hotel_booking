import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import BasicUser from '../models/BasicUser.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

export const signupBasic = async (req, res) => {
  try {
    const { full_name, email, mobile_number, password, confirm_password } = req.body;

    if (!full_name || !email || !mobile_number || !password || !confirm_password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existingEmail = await BasicUser.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: 'Email already exists' });

    const existingMobile = await BasicUser.findOne({ mobile_number });
    if (existingMobile) return res.status(409).json({ error: 'Mobile number already exists' });

    const user = new BasicUser({ full_name, email, mobile_number, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Basic user registered successfully.',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginBasic = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await BasicUser.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
