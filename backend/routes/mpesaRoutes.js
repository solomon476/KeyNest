const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');

// Define API routes and link to controller functions
router.post('/stkpush', mpesaController.generateAccessToken, mpesaController.stkPush);
router.post('/callback', mpesaController.callback);

module.exports = router;
