const express = require('express');
const router = express.Router();
const dynamicUpload = require('../middlewares/dynamicUpload');
const { registerUser, getRegistertaionCategory } = require('../controllers/userController');

router.post('/register', dynamicUpload, registerUser);

router.get('/categories', getRegistertaionCategory)

module.exports = router;
