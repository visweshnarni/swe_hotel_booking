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
  }
}, { timestamps: true });

module.exports = mongoose.model('RegistrationCategory', registrationCategorySchema);
