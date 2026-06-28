const db = require('../config/database');

// Submit contact message
const submitMessage = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const sql = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [name, email, subject, message], function(err) {
    if (err) return next(err);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  });
};

// Get all contact messages (admin only)
const getAllMessages = (req, res, next) => {
  const sql = 'SELECT * FROM contact_messages ORDER BY created_at DESC';

  db.all(sql, [], (err, messages) => {
    if (err) return next(err);
    res.json({ success: true, messages });
  });
};

// Mark message as read (admin only)
const markAsRead = (req, res, next) => {
  const { id } = req.params;

  const sql = 'UPDATE contact_messages SET is_read = 1 WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) return next(err);

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Message marked as read' 
    });
  });
};

module.exports = { submitMessage, getAllMessages, markAsRead };
