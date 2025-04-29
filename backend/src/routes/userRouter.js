const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

// All routes require authentication and admin privileges
router.use(authenticate, isAdmin);

// User management routes
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;