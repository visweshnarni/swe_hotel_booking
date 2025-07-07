const mongoose = require('mongoose');
const { Schema } = mongoose;

const nationalitySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nationality name is required'],
    unique: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Nationality', nationalitySchema);
