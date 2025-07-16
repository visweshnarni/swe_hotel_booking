import express from 'express';
import { applyNOC, getNOC } from '../controllers/nocController.js';
import { protect } from '../middlewares/userAuth.js';
import staticFileUpload from '../middlewares/staticFileUpload.js';

const router = express.Router();

// Required file fields for NOC
const nocFields = [
  'tdc_reg_certificate_upload',
  'aadhaar_upload'
];
const nocTextFields = ['postal_address', 'dental_council_name'];

router.post('/apply-noc', protect, staticFileUpload(nocFields, nocTextFields), applyNOC);
router.get('/noc', protect, getNOC); 


export default router;



