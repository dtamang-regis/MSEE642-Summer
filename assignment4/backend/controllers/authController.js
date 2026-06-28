const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register new user
const register = async (req, res, next) => {
  const { username, email, password, full_name } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const sql = `
      INSERT INTO users (username, email, password, full_name)
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(sql, [username, email, hashedPassword, full_name], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ 
            success: false, 
            message: 'Username or email already exists' 
          });
        }
        return next(err);
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: this.lastID,
          username,
          email,
          full_name,
          role: 'member'
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    
    db.get(sql, [username, username], async (err, user) => {
      if (err) return next(err);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Compare password
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getMe = (req, res, next) => {
  const sql = 'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?';
  
  db.get(sql, [req.user.id], (err, user) => {
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

module.exports = { register, login, getMe };
