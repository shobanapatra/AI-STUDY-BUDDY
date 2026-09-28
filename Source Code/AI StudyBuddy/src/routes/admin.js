const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
  getStats,
  getAllUsers,
  deleteUser,
} = require('../controllers/adminController');

// Admin authorization check
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied: Admin role required',
    });
  }
};

// GET /api/admin/stats
router.get('/stats', auth, adminOnly, getStats);

// GET /api/admin/users
router.get('/users', auth, adminOnly, getAllUsers);

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, adminOnly, deleteUser);

module.exports = router;