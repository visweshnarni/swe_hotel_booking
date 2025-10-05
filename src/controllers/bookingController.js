import mongoose from 'mongoose';

import Booking from '../models/Booking.js';
import Hotel from '../models/hotelModel.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      hotel,
      title,
      first_name,
      middle_name,
      last_name,
      gender,
      email,
      mobile,
      state,
      company_name,
      gst_number,
      address,
      check_in_date,
      check_out_date,
      room_type
    } = req.body;

    // Validate hotel ID
    if (!mongoose.Types.ObjectId.isValid(hotel)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }
    // Find hotel
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Find selected room type in hotel
    const selectedRoom = hotelDoc.room_types.find(rt => rt.name === room_type);
    if (!selectedRoom) {
      return res.status(400).json({ message: 'Invalid room type selected' });
    }

    // Prepare booking data
    const booking = new Booking({
      hotel: hotelDoc._id,
      title,
      first_name,
      middle_name,
      last_name,
      gender,
      email,
      mobile,
      state,
      company_name,
      gst_number,
      address,
      check_in_date,
      check_out_date,
      room_type,
      total_amount: selectedRoom.price // Price comes from hotel room type
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('hotel');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hotel');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
