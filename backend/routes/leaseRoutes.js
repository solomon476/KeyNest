const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');

router.get('/', leaseController.getLeases);
router.get('/my-lease', leaseController.getMyLease);
router.post('/', leaseController.createLease);
router.patch('/:id/approve', leaseController.approveLease);
router.patch('/:id/reject', leaseController.rejectLease);

module.exports = router;
