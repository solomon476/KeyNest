const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');

router.get('/', leaseController.getLeases);
router.post('/', leaseController.createLease);

module.exports = router;
