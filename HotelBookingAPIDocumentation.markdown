# Hotel & Booking API Documentation

**Date**: September 30, 2025

## Table of Contents
- [Introduction](#introduction)
- [Hotel API](#hotel-api)
  - [GET /hotel](#get-hotel)
  - [GET /hotel/{id}](#get-hotelid)
  - [POST /hotel](#post-hotel)
  - [PUT /hotel/{id}](#put-hotelid)
  - [DELETE /hotel/{id}](#delete-hotelid)
- [Booking API](#booking-api)
  - [GET /booking](#get-booking)
  - [GET /booking/{id}](#get-bookingid)
  - [POST /booking](#post-booking)
  - [PUT /booking/{id}](#put-bookingid)
  - [DELETE /booking/{id}](#delete-bookingid)

## Introduction
This document provides comprehensive documentation for the Hotel & Booking API, which allows users to manage hotel information and bookings. The API is hosted at the base URL: `https://swe-hotel-booking.onrender.com/api`.

## Hotel API
The Hotel API provides endpoints to manage hotel information, including creating, reading, updating, and deleting hotel records.

### GET /hotel
**Description**: Retrieves a list of all hotels.  
**Method**: GET  
**URL**: `/hotel`  
**Response**:  
- **Status**: 200 OK  
- **Body**: Array of hotel objects

### GET /hotel/{id}
**Description**: Retrieves a specific hotel by its ID.  
**Method**: GET  
**URL**: `/hotel/{id}`  
**Parameters**:  
- `id` (string): Hotel ObjectId  
**Response**:  
- **Status**: 200 OK  
- **Body**: Hotel object

### POST /hotel
**Description**: Creates a new hotel.  
**Method**: POST  
**URL**: `/hotel`  
**Request Body**:  
```json
{
  "hotel_name": "string",
  "star_rating": 1|2|3|4|5,
  "main_image_url": "string (url)",
  "map_link": "string (url) optional",
  "address": "string",
  "distances": ["string", "..."],
  "room_types": [
    {
      "name": "string",
      "description": "string",
      "max_guests": number,
      "price": number,
      "total": number
    }
  ],
  "policies": ["string", "..."]
}
```  
**Response**:  
- **Status**: 201 Created  
- **Body**: Created hotel object

### PUT /hotel/{id}
**Description**: Updates an existing hotel.  
**Method**: PUT  
**URL**: `/hotel/{id}`  
**Parameters**:  
- `id` (string): Hotel ObjectId  
**Request Body**: Same as POST /hotel, all fields optional.  
**Response**:  
- **Status**: 200 OK  
- **Body**: Updated hotel object

### DELETE /hotel/{id}
**Description**: Deletes a hotel.  
**Method**: DELETE  
**URL**: `/hotel/{id}`  
**Parameters**:  
- `id` (string): Hotel ObjectId  
**Response**:  
- **Status**: 200 OK  
- **Body**:  
```json
{
  "message": "Hotel deleted"
}
```

## Booking API
The Booking API provides endpoints to manage hotel bookings, including creating, reading, updating, and deleting booking records.

### GET /booking
**Description**: Retrieves a list of all bookings.  
**Method**: GET  
**URL**: `/booking`  
**Response**:  
- **Status**: 200 OK  
- **Body**: Array of booking objects

### GET /booking/{id}
**Description**: Retrieves a specific booking by its ID.  
**Method**: GET  
**URL**: `/booking/{id}`  
**Parameters**:  
- `id` (string): Booking ObjectId  
**Response**:  
- **Status**: 200 OK  
- **Body**: Booking object

### POST /booking
**Description**: Creates a new booking.  
**Method**: POST  
**URL**: `/booking`  
**Request Body**:  
```json
{
  "hotel": "string (hotel ObjectId)",
  "title": "Mr|Ms|Mrs|Dr",
  "first_name": "string",
  "middle_name": "string (optional)",
  "last_name": "string",
  "gender": "Male|Female|Other",
  "email": "string (email)",
  "mobile": "string (phone number)",
  "state": "string",
  "company_name": "string",
  "gst_number": "string (optional)",
  "address": "string",
  "check_in_date": "string (ISO date)",
  "check_out_date": "string (ISO date)",
  "room_type": "string (name from hotel room_types)",
  "total_amount": number,
  "payment_status": "pending|success|cancelled"
}
```  
**Response**:  
- **Status**: 201 Created  
- **Body**: Created booking object

### PUT /booking/{id}
**Description**: Updates an existing booking.  
**Method**: PUT  
**URL**: `/booking/{id}`  
**Parameters**:  
- `id` (string): Booking ObjectId  
**Request Body**: Same as POST /booking, all fields optional.  
**Response**:  
- **Status**: 200 OK  
- **Body**: Updated booking object

### DELETE /booking/{id}
**Description**: Deletes a booking.  
**Method**: DELETE  
**URL**: `/booking/{id}`  
**Parameters**:  
- `id` (string): Booking ObjectId  
**Response**:  
- **Status**: 200 OK  
- **Body**:  
```json
{
  "message": "Booking deleted"
}
```