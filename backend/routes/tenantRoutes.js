const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.get('/', tenantController.getTenants);
router.post('/', tenantController.createTenant);

module.exports = router;
