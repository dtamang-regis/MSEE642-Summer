const db = require('../config/database');

// Get all events
const getAllEvents = (req, res, next) => {
  const { difficulty } = req.query;
  let sql = `
    SELECT e.*, u.username as created_by_name 
    FROM events e 
    JOIN users u ON e.created_by = u.id
  `;
  const params = [];

  if (difficulty) {
    sql += ' WHERE e.difficulty = ?';
    params.push(difficulty);
  }

  sql += ' ORDER BY e.event_date ASC';

  db.all(sql, params, (err, events) => {
    if (err) return next(err);
    res.json({ success: true, events });
  });
};

// Get single event
const getEventById = (req, res, next) => {
  const { id } = req.params;
  const sql = `
    SELECT e.*, u.username as created_by_name 
    FROM events e 
    JOIN users u ON e.created_by = u.id
    WHERE e.id = ?
  `;

  db.get(sql, [id], (err, event) => {
    if (err) return next(err);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({ success: true, event });
  });
};

// Create new event (admin only)
const createEvent = (req, res, next) => {
  const { title, description, event_date, location, difficulty, max_participants } = req.body;
  const created_by = req.user.id;

  const sql = `
    INSERT INTO events (title, description, event_date, location, difficulty, max_participants, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, description, event_date, location, difficulty, max_participants, created_by], function(err) {
    if (err) return next(err);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: this.lastID,
        title,
        description,
        event_date,
        location,
        difficulty,
        max_participants,
        created_by
      }
    });
  });
};

// Update event (admin only)
const updateEvent = (req, res, next) => {
  const { id } = req.params;
  const { title, description, event_date, location, difficulty, max_participants } = req.body;

  const sql = `
    UPDATE events 
    SET title = ?, description = ?, event_date = ?, location = ?, difficulty = ?, max_participants = ?
    WHERE id = ?
  `;

  db.run(sql, [title, description, event_date, location, difficulty, max_participants, id], function(err) {
    if (err) return next(err);

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Event updated successfully' 
    });
  });
};

// Delete event (admin only)
const deleteEvent = (req, res, next) => {
  const { id } = req.params;

  const sql = 'DELETE FROM events WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) return next(err);

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  });
};

// Register for event
const registerForEvent = (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user.id;

  // Check if event exists and has space
  const checkEventSql = 'SELECT * FROM events WHERE id = ?';
  
  db.get(checkEventSql, [id], (err, event) => {
    if (err) return next(err);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    if (event.max_participants && event.current_participants >= event.max_participants) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event is full' 
      });
    }

    // Register user
    const registerSql = `
      INSERT INTO event_registrations (event_id, user_id)
      VALUES (?, ?)
    `;

    db.run(registerSql, [id, user_id], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ 
            success: false, 
            message: 'Already registered for this event' 
          });
        }
        return next(err);
      }

      // Update participant count
      const updateCountSql = 'UPDATE events SET current_participants = current_participants + 1 WHERE id = ?';
      db.run(updateCountSql, [id]);

      res.json({ 
        success: true, 
        message: 'Successfully registered for event' 
      });
    });
  });
};

// Cancel event registration
const cancelRegistration = (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const sql = 'DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?';

  db.run(sql, [id, user_id], function(err) {
    if (err) return next(err);

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }

    // Update participant count
    const updateCountSql = 'UPDATE events SET current_participants = current_participants - 1 WHERE id = ?';
    db.run(updateCountSql, [id]);

    res.json({ 
      success: true, 
      message: 'Registration cancelled successfully' 
    });
  });
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration
};
