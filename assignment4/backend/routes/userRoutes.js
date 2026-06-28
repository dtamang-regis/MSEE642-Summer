const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAllUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Validation middleware
const roleValidation = [
  body('role').isIn(['member', 'admin']).withMessage('Invalid role')
];

// Public route
router.get('/:id', authenticateToken, getUserById);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.put('/:id/role', authenticateToken, requireAdmin, roleValidation, updateUserRole);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;
