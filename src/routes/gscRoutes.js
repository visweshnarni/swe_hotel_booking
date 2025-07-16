import express from 'express';
import { applyGSC, getGSC } from '../controllers/gscController.js';
import { protect } from '../middlewares/userAuth.js';
import staticFileUpload from '../middlewares/staticFileUpload.js';

const router = express.Router();

// Required file fields for GSC
const gscFields = [
  'tdc_reg_certificate_upload',
  'testimonial_d1_upload',
  'testimonial_d2_upload',
  'aadhaar_upload',
  'tdc_reg_d1_upload',
  'tdc_reg_d2_upload'
];
const gscTextFields = ['postal_address'];

router.post('/apply-gsc', protect, staticFileUpload(gscFields, gscTextFields), applyGSC);
router.get('/gsc', protect, getGSC);
export default router;
