const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    regcategory_id: {
      type: Schema.Types.ObjectId,
      ref: 'RegistrationCategory',
      required: true
    },
    fname: {
      type: String,
      required: [true, 'First name is required']
    },
    mname: {
      type: String
    },
    lname: {
      type: String,
      required: [true, 'Last name is required']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required']
    },
    fathername: {
      type: String,
      required: [true, 'Father\'s name is required']
    },
    mothername: {
      type: String,
      required: [true, 'Mother\'s name is required']
    },
    place: {
      type: String,
      required: [true, 'Place is required']
    },
    dob: {
      type: Date,
      required: [true, 'Date of Birth is required']
    },
    nationality_id: {
      type: Schema.Types.ObjectId,
      ref: 'Nationality',
      required: true
    },
    category: {
      type: String,
      enum: [
        'Open Category',
        'Backward Classes', 
        'Scheduled Castes', 
        'Scheduled Tribes'
      ],
      required: [true, 'Category is required']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Email is invalid']
    },
    mobile_number: {
      type: String,
      unique: true,
      required: [true, 'Mobile number is required'],
      match: [/^\d{10}$/, 'Mobile number must be 10 digits']
    },
    telephone_number: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
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
    regtype: {
      type: String,
      enum: [
        'Regular (By Post - Fee includes postal charges)',
        'Tatkal (By Hand)'
      ],
      required: [true, 'Registration Type is required'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },

    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Optional dynamic fields
    pr_bds_upload: String,
    pr_bonafide_upload: String,
    ssc_memo: String,
    custodian_clg: String,
    professional_address: String,
    qualification_description: String,
    bds_university_address: String,
    bds_qualification_year: String,
    bds_clg_address: String,
    bds_degree_upload: String,
    study_upload: String,
    intern_upload: String,
    bds_intern_upload: String,
    pr_certificate_upload: String,
    bds_affidavit_upload: String,
    mds_university_address: String,
    mds_qualification_year: String,
    mds_clg_address: String,
    mds_degree_upload: String,
    mds_bonafide_marks_upload: String,
    current_tdc_reg_certificate: String,
    current_tsddc_reg_certificate: String,
    noc_dci_upload: String,
    transfer_noc_upload: String,
    mds_affidavit: String,
    nid_qualification_des: String,
    dci_university_address: String,
    dci_qualification_year: String,
    dci_clg_address: String,
    dci_degree_upload: String,
    dci_bonafide_upload: String
  },
  {
    timestamps: true
  }
);

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Hide password in JSON output
// userSchema.set('toJSON', {
//   transform: function (doc, ret, options) {
//     delete ret.password;
//     return ret;
//   }
// });


module.exports = mongoose.model('User', userSchema);
