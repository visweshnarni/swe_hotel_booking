import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // For generating unique booking IDs

const BookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    default: () => uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase(),
    unique: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  hotel_name: { type: String },
  title: {
    type: String,
    required: true,
    enum: ['Mr', 'Ms', 'Mrs', 'Dr']
  },
  first_name: {
    type: String,
    required: true,
    maxlength: 40
  },
  middle_name: {
    type: String,
    maxlength: 40
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 40
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/
  },
  mobile: {
    type: String,
    required: true,
    match: /^\d{10,15}$/
  },
  state: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  gst_number: String,
  address: {
    type: String,
    required: true,
    maxlength: 255
  },
  check_in_date: {
    type: String, // <-- CHANGED
    required: true
  },
  check_out_date: {
    type: String, // <-- CHANGED
    required: true
  },
  room_type: {
    type: String,
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  // --- NEW/UPDATED PAYMENT FIELDS ---
  instamojo_request_id: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents to have null/undefined here
  },
  instamojo_payment_id: {
    type: String,
    unique: true,
    sparse: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  }
  // --- END PAYMENT FIELDS ---
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);
