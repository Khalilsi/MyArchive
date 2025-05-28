// src/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware'); // adjust based on your auth middleware

// All routes below require authentication

router.post('/message', authenticate, supportController.sendMessage);
router.get('/messages', authenticate, supportController.getUserMessages);

router.get('/admin/conversations', authenticate, isAdmin, supportController.getAllConversations);
router.get('/admin/messages/:userId', authenticate, isAdmin, supportController.getConversationByUser);

module.exports = router;
  