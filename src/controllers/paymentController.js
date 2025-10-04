import Booking from '../models/Booking.js';
import Hotel from '../models/hotelModel.js';
import axios from 'axios';
import dotenv from 'dotenv';
import sendEmailWithTemplate from "../utils/sendEmail.js";
import moment from "moment";

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


// --- NEW: Retry Payment Function ---
export const retryPayment = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // 1. Find the existing booking (which should have a 'failed' or 'pending' status)
    let bookingToRetry = await Booking.findById(bookingId);

    if (!bookingToRetry) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (bookingToRetry.payment_status === 'success') {
      return res.status(400).json({ message: 'Payment is already successful for this booking.' });
    }

    // 2. IMPORTANT: Reset the status to 'pending' before initiating a new request
    bookingToRetry.payment_status = 'pending';
    // Clear old Instamojo Request ID, as a new one will be generated
    bookingToRetry.instamojo_request_id = undefined;
    await bookingToRetry.save();


    // 3. Prepare Instamojo Payload using saved booking data
    // Fetch hotel name through booking's hotel reference
const hotelDoc = await Hotel.findById(bookingToRetry.hotel);

if (!hotelDoc) {
  return res.status(404).json({ message: 'Associated hotel not found.' });
}

const payload = {
  purpose: `SWE Pune: ${hotelDoc.hotel_name} (Retry)`,
  amount: bookingToRetry.total_amount.toFixed(2),
  buyer_name: `${bookingToRetry.first_name} ${bookingToRetry.last_name || ''}`,
  email: bookingToRetry.email,
  redirect_url: `${BACKEND_BASE_URL}/api/payment/callback?booking_id=${bookingToRetry._id}`
};


    // 4. Call Instamojo API to create a NEW payment request
    const response = await axios.post(INSTAMOJO_URL, payload, {
      headers: {
        'X-Api-Key': API_KEY,
        'X-Auth-Token': AUTH_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      const payment_request = response.data.payment_request;

      // 5. Store the NEW Instamojo Request ID in the Booking
      bookingToRetry.instamojo_request_id = payment_request.id;
      await bookingToRetry.save();

      // 6. Send the Instamojo payment URL to the client
      res.status(200).json({
        message: 'Payment retry initiated.',
        bookingId: bookingToRetry._id,
        payment_url: payment_request.longurl // Client should redirect here
      });
    } else {
      // If Instamojo fails the retry request
      bookingToRetry.payment_status = 'failed';
      await bookingToRetry.save();
      res.status(500).json({
        error: 'Instamojo API error on retry',
        details: response.data.message || 'Payment initiation failed.'
      });
    }
  } catch (error) {
    console.error('Payment retry failed:', error.message);
    res.status(500).json({
      message: 'Server error during payment retry.',
      details: error.response ? error.response.data : error.message
    });
  }
};

// --- EXISTING: Initiate Payment (no changes needed here) ---
export const initiatePayment = async (req, res) => {
  // ... (The existing initiatePayment function code goes here)
  // ... (The existing initiatePayment function code goes here)
  // ... (The existing initiatePayment function code goes here)

  const bookingData = req.body;
  const { hotel, room_type, total_amount, first_name, email, mobile, check_in_date, check_out_date } = bookingData;

  if (!hotel || !room_type || !first_name || !email || !mobile) {
    return res.status(400).json({ message: 'Missing required booking information.' });
  }
  console.log("Booking data.........", bookingData);
  let savedBooking;
  try {
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    // ... inside initiatePayment function

// ... (Existing code before duration calculation)

    const selectedRoom = hotelDoc.room_types.find(rt => rt.name === room_type);
    if (!selectedRoom) {
      return res.status(400).json({ message: 'Invalid room type selected' });
    }

    // --- MODIFICATION START ---
    // The dates are now strings like: "Wed Oct 01 2025 00:00:00 GMT+0530 (India Standard Time)"
    
    // 1. Create Date objects from the stored/received strings.
    // The JavaScript Date constructor will correctly interpret the GMT offset.
    const checkIn = new Date(check_in_date); 
    const checkOut = new Date(check_out_date);
    
    // 2. Calculate the difference in time (milliseconds)
    const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());

    // 3. Calculate difference in days. 
    // This calculation is SAFE here because timeDiff already accounts for the time zone 
    // (e.g., if both dates start at 00:00:00 GMT+0530, the difference will be an exact multiple of 24 hours).
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // NOTE: This duration calculation assumes both dates start at the same time (00:00:00).
    // If the time components were different, the total_amount would be slightly inaccurate.
    // --- MODIFICATION END ---
    
    const finalAmount = selectedRoom.price * diffDays;

    

    const newBooking = new Booking({
      ...bookingData,
      total_amount: finalAmount,
      payment_status: 'pending'
    });
    savedBooking = await newBooking.save();
    console.log("Booking being sent..............", savedBooking);
   const payload = {
  purpose: `SWE Pune: ${hotelDoc.hotel_name}`,  // use hotel name here
  amount: finalAmount.toFixed(2),
  buyer_name: `${first_name} ${bookingData.last_name || ''}`,
  email: email,
  redirect_url: `${BACKEND_BASE_URL}/api/payment/callback?booking_id=${savedBooking._id}`
};


    const response = await axios.post(INSTAMOJO_URL, payload, {
      headers: {
        'X-Api-Key': API_KEY,
        'X-Auth-Token': AUTH_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      const payment_request = response.data.payment_request;
      savedBooking.instamojo_request_id = payment_request.id;
      await savedBooking.save();

      res.status(200).json({
        message: 'Payment initiated. Redirect to payment_url.',
        bookingId: savedBooking._id,
        payment_url: payment_request.longurl
      });

    } else {
      savedBooking.payment_status = 'failed';
      await savedBooking.save();
      console.error('Instamojo API Error:', response.data.message);
      res.status(500).json({
        error: 'Instamojo API error',
        details: response.data.message || 'Payment initiation failed.'
      });
    }
  } catch (error) {
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


// --- EXISTING: Handle Callback (no changes needed here) ---


// --- ENHANCED: Handle Callback with Server-to-Server Verification ---
export const handleCallback = async (req, res) => {
  const { booking_id } = req.query;
  const { payment_request_id, payment_id, payment_status } = req.query;

  console.log('Instamojo Callback Received:', req.query);

  // Utility: Ensure a clean ID (never a URL, always string)
  function extractPaymentRequestId(val) {
    if (!val) return '';
    // If it's just an ID, return as-is. If URL, extract last part
    return val.replace(/\/$/, '').split('/').pop();
  }

  try {
    const booking = await Booking.findById(booking_id);

    if (!booking) {
      console.error(`Callback Error: Booking ID ${booking_id} not found.`);
      return res.redirect(`${FRONTEND_BASE_URL}/booking-error?message=BookingNotFound`);
    }

    if (payment_id) {
      try {
        const verificationResponse = await axios.get(
          `https://www.instamojo.com/api/1.1/payments/${payment_id}/`,
          {
            headers: {
              'X-Api-Key': API_KEY,
              'X-Auth-Token': AUTH_TOKEN,
            }
          }
        );



        const result = verificationResponse.data;
        console.log("Result from payment...", result);

        if (result.success && result.payment) {
          const verifiedPayment = result.payment;
          let finalStatus = 'failed';

          // Normalized comparison (always ID, not URL)
          const requestIdFromAPI = extractPaymentRequestId(verifiedPayment.payment_request);
          const requestIdFromCallback = extractPaymentRequestId(payment_request_id);

          if (
            verifiedPayment.status === 'Credit' &&
            requestIdFromAPI === requestIdFromCallback
          ) {
            finalStatus = 'success';
            booking.instamojo_payment_id = payment_id;
          } else {
            console.warn(`Payment ID ${payment_id} status from API: ${verifiedPayment.status}. Booking will be marked as failed.`);
          }

          booking.payment_status = finalStatus;

          if (finalStatus === 'success') {
            console.log(`Payment confirmed for ${booking._id}. Sending confirmation email...`);
             //  Send ZeptoMail Booking Confirmation
            try {
              await sendEmailWithTemplate({
                to: booking.email,
                name: booking.first_name,
                templateKey: "2518b.554b0da719bc314.k1.15f59070-a0f2-11f0-9224-62df313bf14d.199ae148af7",
                mergeInfo: {
                  booking_id: booking.booking_id,
                  hotel_name: booking.hotel?.hotel_name || "N/A",
                  title: booking.title || "",
                  first_name: booking.first_name,
                  middle_name: booking.middle_name || "",
                  last_name: booking.last_name || "",
                  gender: booking.gender || "",
                  email: booking.email,
                  mobile: booking.mobile,
                  company_name: booking.company_name || "",
                  gst_number: booking.gst_number || "",
                  address: booking.address || "",
                  state: booking.state || "",
                  check_in_date: moment(booking.check_in_date).format("DD-MM-YYYY"),
                  check_out_date: moment(booking.check_out_date).format("DD-MM-YYYY"),
                  room_type: booking.room_type,
                  total_amount: booking.total_amount.toFixed(2),
                  payment_status: booking.payment_status,
                  instamojo_request_id: booking.instamojo_request_id || "",
                  instamojo_payment_id: booking.instamojo_payment_id || "",
                  year: new Date().getFullYear(),
                },
              });
            } catch (emailErr) {
              console.error("❌ Failed to send booking confirmation email:", emailErr);
            }
          }
        } else {
          console.error('Instamojo API verification failed:', result.message || 'Unknown error');
          booking.payment_status = 'failed';
        }
      } catch (apiError) {
        console.error('Instamojo API request failed:', apiError.response ? apiError.response.data : apiError.message);
        booking.payment_status = 'failed';
      }
    } else {
      booking.payment_status = 'failed';
      console.log('No payment_id in callback. Marking as failed.');
    }

    await booking.save();
    console.log("Booking............", booking);

    const redirectUrl =
      payment_status === 'Credit'
        ? `${FRONTEND_BASE_URL}/booking-success?id=${booking._id}`
        : `${FRONTEND_BASE_URL}/booking-failure?id=${booking._id}`;

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Fatal error during Instamojo callback processing:', error);
    res.redirect(`${FRONTEND_BASE_URL}/booking-error?message=InternalError`);
  }
};

