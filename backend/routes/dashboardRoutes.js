const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getLandlordStats);
router.get('/tenant-stats', dashboardController.getTenantStats);

module.exports = router;
