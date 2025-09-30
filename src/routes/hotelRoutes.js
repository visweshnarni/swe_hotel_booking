import express from 'express';
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController.js';

const router = express.Router();

router.get('/', getAllHotels);          // GET /api/hotel - list all hotels
router.get('/:id', getHotelById);       // GET /api/hotel/:id - get hotel details by ID
router.post('/', createHotel);          // POST /api/hotel - add new hotel
router.put('/:id', updateHotel);        // PUT /api/hotel/:id - update hotel details
router.delete('/:id', deleteHotel);     // DELETE /api/hotel/:id - delete hotel

export default router;
