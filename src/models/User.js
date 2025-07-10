const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

// PG / MDS Specialities Enum
const pgSpecialistEnum = [
  'Prosthodontics and Crown & Bridge',
  'Periodontology',
  'Oral and Maxillofacial Surgery',
  'Conservative Dentistry and Endodontics',
  'Orthodontics and Dentofacial Orthopedics',
  'Oral & Maxillofacial Pathology and Oral Microbiology',
  'Public Health Dentistry',
  'Pediatric and Preventive Dentistry',
  'Oral Medicine and Radiology'
];

// Caste/Category Enum
const casteCategoryEnum = [
  'Open Category',
  'Backward Classes',
  'Scheduled Castes',
  'Scheduled Tribes'
];

// Registration Type Enum
const regTypeEnum = [
  'Regular (By Post - Fee includes postal charges)',
  'Tatkal (By Hand)'
];

const userSchema = new Schema({
  // ------------------ Basic Registration Info ------------------
  regcategory_id: {
    type: Schema.Types.ObjectId,
    ref: 'RegistrationCategory',
    required: true
  },
  nationality_id: {
    type: Schema.Types.ObjectId,
    ref: 'Nationality',
    required: true
  },

  // ------------------ Personal Information ------------------
  f_name: { type: String, required: [true, 'First name is required'], trim: true },
  m_name: { type: String, trim: true},
  l_name: { type: String, required: [true, 'Last name is required'], trim: true },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  father_name: { type: String, required: [true, 'Father\'s name is required'], trim: true },
  mother_name: { type: String, required: [true, 'Mother\'s name is required'], trim: true },
  place: { type: String, required: [true, 'Place is required'] },
  dob: { type: Date, required: [true, 'Date of Birth is required'] },
  category: {
    type: String,
    enum: casteCategoryEnum,
    required: [true, 'Category is required']
  },

  // ------------------ Contact Info ------------------
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Email is invalid']
  },
  mobile_number: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits']
  },
  telephone_number: { type: String },
  address: { type: String, required: [true, 'Residential address is required'] },

  // ------------------ Identity Verification ------------------
  pan_number: {
    type: String,
    required: [true, 'PAN card number is required'],
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format']
  },
  pan_upload: {
    type: String,
    required: [true, 'PAN upload is required']
  },
  aadhaar_number: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    match: [/^\d{12}$/, 'Aadhaar number must be 12 digits']
  },
  aadhaar_upload: {
    type: String,
    required: [true, 'Aadhaar upload is required']
  },
  sign_upload: {
    type: String,
    required: [true, 'Signature upload is required']
  },

  // ------------------ Registration Type ------------------
  regtype: {
    type: String,
    enum: regTypeEnum,
    required: [true, 'Registration Type is required']
  },

  // ------------------ Authentication ------------------
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // ------------------ Provisional Registration ------------------
  pr_bds_upload: String,
  pr_bonafide_upload: String,
  ssc_memo_upload: String,
  custodian_clg_upload: String,

  // ------------------ BDS & Transfer BDS ------------------
  professional_address: String,
  qualification_description: String,
  bds_university_address: String,
  bds_qualification_year: {
    type: String,
    match: [/^(0[1-9]|1[0-2])\/\d{4}$/, 'BDS Qualification Year must be in MM/YYYY format'],
  },
  bds_clg_address: String,
  bds_degree_upload: String,
  study_upload: String,
  bds_intern_upload: String,
  pr_certificate_upload: String,
  bds_affidavit_upload: String,

  // ------------------ Transfer MDS / MDS ------------------
  mds_university_address: String,
  mds_qualification_year: {
    type: String,
    match: [/^(0[1-9]|1[0-2])\/\d{4}$/, 'MDS Qualification Year must be in MM/YYYY format'],
  },
  mds_clg_address: String,
  mds_degree_upload: String,
  mds_bonafide_marks_upload: String,
  curr_tdc_reg_certificate_upload: String,
  transfer_noc_upload: String,
  noc_dci_upload: String,
  mds_affidavit_upload: String,
  pg_specialist: {
    type: String,
    enum: pgSpecialistEnum
  },

  // ------------------ Non-Indian Dentist ------------------
  nid_qualification_des: String,
  dci_university_address: String,
  dci_qualification_year: String,
  dci_clg_address: String,
  dci_degree_upload: String,
  dci_bonafide_upload: String
},
  { timestamps: true }
);

// ------------------ Password Hashing ------------------
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
