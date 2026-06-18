const express = require('express');
const router = express.Router();
const caretakerController = require('../controllers/caretakerController');

router.post('/', caretakerController.assignCaretaker);
router.get('/', caretakerController.getCaretakers);

module.exports = router;
