import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const basicUserSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  mobile_number: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  }
}, {
  timestamps: true
});

// Hash password before saving
basicUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('BasicUser', basicUserSchema);
