const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration
} = require('../controllers/eventController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Validation middleware
const eventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('event_date').isDate().withMessage('Valid date required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('difficulty').isIn(['easy', 'moderate', 'hard']).withMessage('Invalid difficulty level'),
  body('max_participants').optional().isInt({ min: 1 }).withMessage('Must be a positive integer')
];

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.post('/:id/register', authenticateToken, registerForEvent);
router.delete('/:id/register', authenticateToken, cancelRegistration);

// Admin routes
router.post('/', authenticateToken, requireAdmin, eventValidation, createEvent);
router.put('/:id', authenticateToken, requireAdmin, eventValidation, updateEvent);
router.delete('/:id', authenticateToken, requireAdmin, deleteEvent);

module.exports = router;
