const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.sendMessage);
router.get('/:userId', messageController.getConversation);
router.patch('/:id/read', messageController.markAsRead);

module.exports = router;
