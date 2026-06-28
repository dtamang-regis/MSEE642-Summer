const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitMessage, getAllMessages, markAsRead } = require('../controllers/contactController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Validation middleware
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// Public route
router.post('/', contactValidation, submitMessage);

// Admin routes
router.get('/messages', authenticateToken, requireAdmin, getAllMessages);
router.put('/messages/:id/read', authenticateToken, requireAdmin, markAsRead);

module.exports = router;
