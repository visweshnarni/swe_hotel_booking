import mongoose from 'mongoose';

// Room Type embedded schema without room_type_id
const RoomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  max_guests: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 1,
    max: 500
  }
}, { _id: false });

const HotelSchema = new mongoose.Schema({
  
  hotel_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  star_rating: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5]
  },
  main_image_url: {
    type: String,
    required: true,
    match: /^http(s)?:\/\/.+/
  },
  map_link: {
    type: String,
    match: /^http(s)?:\/\/.+/
  },
  address: {
    type: String,
    required: true,
    maxlength: 255
  },
  distances: [{
  type: String,
  maxlength: 500 // or whatever maximum length you want
}],
  checkin_start_date: {
    type: Date,
    required: true
  },
  checkin_end_date: {
    type: Date,
    required: true
  },
  checkout_start_date: {
    type: Date,
    required: true
  },
  checkout_end_date: {
    type: Date,
    required: true
  },

  room_types: [RoomTypeSchema],
  policies: [{
    type: String,
    maxlength: 200
  }]
}, { timestamps: true });

export default mongoose.model('Hotel', HotelSchema);
