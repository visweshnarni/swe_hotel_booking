const mongoose = require('mongoose');
const { Schema } = mongoose;

const registrationCategoryEnum = [
  'Provisional Registration',
  'Bachelor of Dental Surgery (BDS) from Telangana',
  'Transfer BDS (BDS registrant - from other state dental councils in India)',
  'Transfer BDS + New MDS',
  'Transfer MDS (MDS registrant - from other state dental councils in India)',
  'Master of Dental Surgery (MDS) from Telangana',
  'Non Indian Dentist Registration (Temporary)'
];

const registrationCategorySchema = new Schema({
  name: {
    type: String,
    enum: registrationCategoryEnum,
    required: [true, 'Registration Category name is required'],
    unique: true,
    trim: true
  },
  regular_amount: {
    type: Number,
    required: true
  },
  renewal_regular_amount: {
    type: Number,
    required: true
  },
  tatkal_amount: {
    type: Number,
    required: true
  },
  renewal_tatkal_amount: {
    type: Number,
    required: true
  }
  
}, { timestamps: true });

module.exports = mongoose.model('RegistrationCategory', registrationCategorySchema);
