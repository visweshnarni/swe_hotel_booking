import express from 'express';
import { submitNOC } from '../controllers/nocController.js';
import { protect } from '../middlewares/userAuth.js';
import staticFileUpload from '../middlewares/staticFileUpload.js';

const router = express.Router();

// Required file fields for NOC
const nocFields = [
  'tdc_reg_certificate_upload',
  'aadhaar_upload'
];
const nocTextFields = ['postal_address', 'dental_council_name'];

router.post('/', protect, staticFileUpload(nocFields, nocTextFields), submitNOC);
export default router;
