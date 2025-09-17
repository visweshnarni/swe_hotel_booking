// import express from 'express';
// import { applyGSC, updateGSC, getGSC } from '../controllers/gscController.js';
// import { protect } from '../middlewares/userAuth.js';
// import staticFileUpload from '../middlewares/staticFileUpload.js';

// const router = express.Router();

// const gscFields = [
//   'tdc_reg_certificate_upload',
//   'testimonial_d1_upload',
//   'testimonial_d2_upload',
//   'aadhaar_upload',
//   'tdc_reg_d1_upload',
//   'tdc_reg_d2_upload'
// ];
// const gscTextFields = ['postal_address'];

// // --- ROUTE FOR NEW APPLICATIONS ---
// router.post('/apply-gsc', protect, staticFileUpload(gscFields, gscTextFields), applyGSC);

// // --- NEW ROUTE FOR UPDATING EXISTING APPLICATIONS ---
// router.put('/apply-gsc/:applicationNo', protect, staticFileUpload(gscFields, gscTextFields), updateGSC);

// // --- ROUTE TO GET ALL APPLICATIONS ---
// router.get('/gsc', protect, getGSC);

// export default router;

import express from 'express';
import { applyGSC, updateGSC, getGSC } from '../controllers/gscController.js';
import staticFileUpload from '../middlewares/staticFileUpload.js';
import { protectRegisteredUser } from '../middlewares/protectRegisteredUser.js'; // Use the new middleware

const router = express.Router();

const gscFields = [
    'tdc_reg_certificate_upload',
    'testimonial_d1_upload',
    'testimonial_d2_upload',
    'aadhaar_upload',
    'tdc_reg_d1_upload',
    'tdc_reg_d2_upload'
];
const gscTextFields = ['postal_address'];

// All GSC routes now use the new middleware
router.post('/apply-gsc', protectRegisteredUser, staticFileUpload(gscFields, gscTextFields), applyGSC);
router.put('/apply-gsc/:applicationNo', protectRegisteredUser, staticFileUpload(gscFields, gscTextFields), updateGSC);
router.get('/gsc', protectRegisteredUser, getGSC);

export default router;