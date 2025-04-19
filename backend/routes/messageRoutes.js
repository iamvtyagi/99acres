const express = require('express');
const {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage
} = require('../controllers/messageController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/conversations').get(getConversations);
router.route('/conversations/:conversationId').get(getMessages);
router.route('/').post(sendMessage);
router.route('/:id').delete(deleteMessage);

module.exports = router;
