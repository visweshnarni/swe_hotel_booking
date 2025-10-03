import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hotel from '../src/models/hotelModel.js'; // adjust path as needed

dotenv.config();

const hotels = [
  {
    hotel_name: "Hyatt Regency Pune & Residences",
    star_rating: 5,
    main_image_url: "https://conference-hotel-booking.vercel.app/hyattRegenceyPune.avif",
    map_link: "https://maps.app.goo.gl/6wLjqG6pvpcU7GJAA",
    address: "Weikfield It Ctti Info Park, Nagar Rd, Sakore Nagar, Viman Nagar, Pune, Maharashtra 411014",
    distances: [
      "8.8 Kms from Pune Bus Stand",
      "6 Kms from Pune Railway Station",
      "3 Kms from Pune International Airport",
      "2 Kms away from the venue"
    ],
    checkin_start_date: new Date("2025-10-01T14:00:00.000Z"),
    checkin_end_date: new Date("2025-12-31T23:59:59.999Z"),
    checkout_start_date: new Date("2025-10-02T12:00:00.000Z"),
    checkout_end_date: new Date("2026-01-01T11:59:59.999Z"),
    room_types: [
      {
        name: "Single Occupancy",
        description: "Only One-person can stay",
        max_guests: 1,
        price: 9500,
        total: 50
      },
      {
        name: "Double Occupancy",
        description: "Only two people can stay",
        max_guests: 2,
        price: 10000,
        total: 50
      }
    ],
    policies: [
      "Check-in time: 2:00 PM",
      "Check-out time: 12:00 PM",
      "No Cancelation nor refund once the booking and payment is done",
      "Valid ID proof required at check-in",
      "No meals included",
      "Primary Guest should be atleast 18 years of age",
      "Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)",
      "Smoking within the premises is allowed",
      "Single Occupancy: Only One-person can stay",
      "Double Occupancy: Only two people can stay",
      "Early check in and late checkout is subject to availability and additional charges will be applicable",
      "Any other personal expenses such as telephone calls, food & beverage bills, room service and use of mini bar should be paid by the guest directly to the hotel at the time of check out",
      "Hotel bookings are non-refundable. After confirmation, 100% charges apply for cancellations. Name changes allowed up to 30 days before check-in",
      "GST will be charged additional on total billing"
    ]
  },
  // --- Start of additional hotels data ---
  {
    // _id, createdAt, updatedAt, and __v fields are removed as mongoose will handle them
    hotel_name: "JW Marriott Pune",
    star_rating: 3,
    main_image_url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    map_link: "https://maps.app.goo.gl/cmdTPvfaooi8LSNG8",
    address: "Senapati Bapat Road, Pune",
    distances: [
      "6.5 km away from Pune Bus Stand",
      "5 km away from Hyatt Regency Pune",
      "12 km away from Pune International Airport",
      "7 km away from the venue"
    ],
    checkin_start_date: new Date("2025-11-15T14:00:00.000Z"),
    checkin_end_date: new Date("2025-12-30T23:59:59.999Z"),
    checkout_start_date: new Date("2025-11-16T12:00:00.000Z"),
    checkout_end_date: new Date("2025-12-31T11:59:59.999Z"),
    room_types: [
      {
        name: "Single Occupancy",
        description: "Only One-person can stay",
        max_guests: 1,
        price: 3,
        total: 50
      },
      {
        name: "Double Occupancy",
        description: "Only two people can stay",
        max_guests: 2,
        price: 10000,
        total: 50
      }
    ],
    policies: [
      "Check-in time: 2:00 PM",
      "Check-out time: 12:00 PM",
      "No Cancelation nor refund once the booking and payment is done",
      "Valid ID proof required at check-in",
      "No meals included",
      "Primary Guest should be atleast 18 years of age",
      "Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)",
      "Smoking within the premises is allowed",
      "Single Occupancy: Only One-person can stay",
      "Double Occupancy: Only two people can stay",
      "Early check in and late checkout is subject to availability and additional charges will be applicable",
      "Any other personal expenses such as telephone calls, food & beverage bills, room service and use of mini bar should be paid by the guest directly to the hotel at the time of check out",
      "Hotel bookings are non-refundable. After confirmation, 100% charges apply for cancellations. Name changes allowed up to 30 days before check-in",
      "GST will be charged additional on total billing"
    ]
  },
  {
    // _id, createdAt, updatedAt, and __v fields are removed as mongoose will handle them
    hotel_name: "Trident Hotel Mumbai",
    star_rating: 5,
    main_image_url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    map_link: "https://maps.app.goo.gl/xBiYEMamgTEhmLHZ9",
    address: "Nariman Point, Mumbai",
    distances: [
      "10 km away from Pune Bus Stand",
      "7 km away from Pune Railway Station",
      "15 km away from Pune International Airport",
      "8 km away from the venue"
    ],
    checkin_start_date: new Date("2025-11-15T14:00:00.000Z"),
    checkin_end_date: new Date("2025-12-30T23:59:59.999Z"),
    checkout_start_date: new Date("2025-11-16T12:00:00.000Z"),
    checkout_end_date: new Date("2025-12-31T11:59:59.999Z"),
    room_types: [
      {
        name: "Single Occupancy",
        description: "Only One-person can stay",
        max_guests: 1,
        price: 9500,
        total: 50
      },
      {
        name: "Double Occupancy",
        description: "Only two people can stay",
        max_guests: 2,
        price: 10000,
        total: 50
      }
    ],
    policies: [
      "Check-in time: 2:00 PM",
      "Check-out time: 12:00 PM",
      "No Cancelation nor refund once the booking and payment is done",
      "Valid ID proof required at check-in",
      "No meals included",
      "Primary Guest should be atleast 18 years of age",
      "Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)",
      "Smoking within the premises is allowed",
      "Single Occupancy: Only One-person can stay",
      "Double Occupancy: Only two people can stay",
      "Early check in and late checkout is subject to availability and additional charges will be applicable",
      "Any other personal expenses such as telephone calls, food & beverage bills, room service and use of mini bar should be paid by the guest directly to the hotel at the time of check out",
      "Hotel bookings are non-refundable. After confirmation, 100% charges apply for cancellations. Name changes allowed up to 30 days before check-in",
      "GST will be charged additional on total billing"
    ]
  }
  // --- End of additional hotels data ---
];

const seedHotels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for Hotel seeding');

    await Hotel.deleteMany();
    console.log('🗑️ Existing Hotels cleared');

    await Hotel.insertMany(hotels);
    console.log('📚 Hotels seeded successfully');

  } catch (err) {
    console.error('❌ Hotel seeding error:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

seedHotels();