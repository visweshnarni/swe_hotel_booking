import Booking from '../models/Booking.js';
import Hotel from '../models/hotelModel.js';
import axios from 'axios';
import dotenv from 'dotenv'; // Import dotenv to ensure environment variables are loaded

// Load environment variables if not already loaded (useful for controller testing)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: './.env' });
}

// Use environment variables for configuration
const API_KEY = process.env.INSTAMOJO_API_KEY;
const AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;
const INSTAMOJO_URL = process.env.INSTAMOJO_API_ENDPOINT;
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

// --- Step 1: Initiate Payment ---
// This function creates the pending booking and gets the Instamojo payment URL.
export const initiatePayment = async (req, res) => {
  const bookingData = req.body;
  // Destructure required fields for validation and Instamojo payload
  const { hotel, room_type, total_amount, first_name, email, mobile, check_in_date, check_out_date } = bookingData;

  // Basic check for required data
  if (!hotel || !room_type || !first_name || !email || !mobile) {
      return res.status(400).json({ message: 'Missing required booking information.' });
  }

  // --- Start Transaction ---
  let savedBooking;
  try {
    // 1. Validate Hotel and Room Type
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    const selectedRoom = hotelDoc.room_types.find(rt => rt.name === room_type);
    if (!selectedRoom) {
      return res.status(400).json({ message: 'Invalid room type selected' });
    }
    
    // Calculate amount based on room price and number of nights (simple example)
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const finalAmount = selectedRoom.price * diffDays; // Assuming the price in the model is per night

    // 2. Create Booking with 'pending' status
    const newBooking = new Booking({
      ...bookingData,
      total_amount: finalAmount, // Use calculated final amount
      payment_status: 'pending'
    });
    savedBooking = await newBooking.save();

    // 3. Prepare Instamojo Payload
    const payload = {
      purpose: `Hotel Booking ID: ${savedBooking.booking_id}`,
      amount: finalAmount.toFixed(2), // Instamojo requires amount as string/number, 2 decimal places often best
      buyer_name: `${first_name} ${bookingData.last_name || ''}`,
      email: email,
    //   phone: mobile,
      // Instamojo calls this URL on completion, passing payment details
      redirect_url: `${BACKEND_BASE_URL}/api/payment/callback?booking_id=${savedBooking._id}`
    };
    
    // 4. Call Instamojo API to create payment request
    const response = await axios.post(INSTAMOJO_URL, payload, {
      headers: {
        'X-Api-Key': API_KEY,
        'X-Auth-Token': AUTH_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      const payment_request = response.data.payment_request;
      
      // 5. Store Instamojo Request ID in the Booking
      savedBooking.instamojo_request_id = payment_request.id;
      await savedBooking.save();

      // 6. Send the Instamojo payment URL to the client
      res.status(200).json({
        message: 'Payment initiated. Redirect to payment_url.',
        bookingId: savedBooking._id,
        payment_url: payment_request.longurl // Client should redirect here
      });

    } else {
       // Instamojo API returned a non-success response
       savedBooking.payment_status = 'failed';
       await savedBooking.save();
       console.error('Instamojo API Error:', response.data.message);
       res.status(500).json({ 
          error: 'Instamojo API error', 
          details: response.data.message || 'Payment initiation failed.'
       });
    }
  } catch (error) {
    // --- Rollback/Cleanup on Failure ---
    // If the booking was saved but the Instamojo call failed
    if (savedBooking && savedBooking.payment_status === 'pending') {
        savedBooking.payment_status = 'failed';
        await savedBooking.save();
    }
    console.error('Payment initiation failed:', error.message);
    res.status(500).json({ 
        message: 'Server error during payment initiation.',
        details: error.response ? error.response.data : error.message 
    });
  }
};

// --- Step 2: Handle Instamojo Callback ---
// Instamojo redirects the user back to this endpoint after payment attempt.
export const handleCallback = async (req, res) => {
  const { booking_id } = req.query; // Our custom query param
  const { payment_request_id, payment_id, payment_status } = req.query; // Instamojo params

  // Log the incoming query for debugging
  console.log('Instamojo Callback Received:', req.query);
  
  // Security Note: In a real-world scenario, you MUST verify the payment 
  // status by making a GET request to the Instamojo API using the 
  // payment_request_id and checking the response. We skip that API call 
  // here for simplicity in this single-file example.

  try {
    const booking = await Booking.findById(booking_id);

    if (!booking) {
      // If booking is not found, log error and redirect to a generic error page
      console.error(`Callback Error: Booking ID ${booking_id} not found.`);
      return res.redirect(`${FRONTEND_BASE_URL}/booking-error?message=BookingNotFound`);
    }

    if (booking.instamojo_request_id !== payment_request_id) {
        console.warn(`Callback Warning: Instamojo Request ID mismatch for booking ${booking_id}. Expected: ${booking.instamojo_request_id}, Received: ${payment_request_id}`);
        // Continue, but this is a serious warning sign.
    }
    
    // Check Instamojo status
    if (payment_status === 'Credit') {
      booking.payment_status = 'success';
      booking.instamojo_payment_id = payment_id;
    } else if (payment_status === 'Failed') {
      booking.payment_status = 'failed';
    } else {
      // Catch other status types like 'Pending' (which shouldn't happen on redirect)
      booking.payment_status = 'failed'; 
    }

    await booking.save();
    
    // Redirect user back to the client-side application (e.g., Next.js app)
    const redirectUrl = booking.payment_status === 'success' 
      ? `${FRONTEND_BASE_URL}/booking-success?id=${booking._id}`
      : `${FRONTEND_BASE_URL}/booking-failure?id=${booking._id}`;

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Fatal error during Instamojo callback processing:', error);
    res.redirect(`${FRONTEND_BASE_URL}/booking-error?message=InternalError`);
  }
};
