import mongoose from 'mongoose';

const { Schema } = mongoose;

const nationalitySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nationality name is required'],
    unique: true,
    trim: true
  }
}, { timestamps: true });

const Nationality = mongoose.model('Nationality', nationalitySchema);
export default Nationality;
