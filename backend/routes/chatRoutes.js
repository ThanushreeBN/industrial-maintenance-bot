const express = require('express');
const {
  getChatHistory,
  sendMessage
} = require('../controllers/chatController');

const router = express.Router();

router
  .route('/')
  .get(getChatHistory)
  .post(sendMessage);

module.exports = router;