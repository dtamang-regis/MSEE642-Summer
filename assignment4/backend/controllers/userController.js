const db = require('../config/database');

// Get all users (admin only)
const getAllUsers = (req, res, next) => {
  const sql = 'SELECT id, username, email, full_name, role, created_at FROM users ORDER BY created_at DESC';

  db.all(sql, [], (err, users) => {
    if (err) return next(err);
    res.json({ success: true, users });
  });
};

// Get user by ID
const getUserById = (req, res, next) => {
  const { id } = req.params;
  const sql = 'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?';

  db.get(sql, [id], (err, user) => {
    if (err) return next(err);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ success: true, user });
  });
};

// Update user role (admin only)
const updateUserRole = (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['member', 'admin'].includes(role)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid role' 
    });
  }

  const sql = 'UPDATE users SET role = ? WHERE id = ?';

  db.run(sql, [role, id], function(err) {
    if (err) return next(err);

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'User role updated successfully' 
    });
  });
};

// Delete user (admin only)
const deleteUser = (req, res, next) => {
  const { id } = req.params;

  // Prevent deleting yourself
  if (id == req.user.id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Cannot delete your own account' 
    });
  }

  const sql = 'DELETE FROM users WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) return next(err);

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  });
};

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser };
