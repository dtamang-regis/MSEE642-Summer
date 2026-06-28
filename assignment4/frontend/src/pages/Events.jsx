import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll(filter);
      setEvents(response.events);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await eventsAPI.register(eventId);
      alert('Successfully registered for event!');
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Registration failed');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#2ecc71';
      case 'moderate': return '#f39c12';
      case 'hard': return '#e74c3c';
      default: return '#3498db';
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem 0' }}>Loading events...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Hiking Events</h1>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ marginRight: '1rem' }}>Filter by difficulty:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {events.map((event) => (
              <div key={event.id} style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{event.title}</h2>
                  <span 
                    style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      backgroundColor: getDifficultyColor(event.difficulty), 
                      color: 'white',
                      fontSize: '0.875rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {event.difficulty}
                  </span>
                </div>
                
                <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>{event.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Location:</strong> {event.location}
                  </div>
                  <div>
                    <strong>Participants:</strong> {event.current_participants}/{event.max_participants || 'Unlimited'}
                  </div>
                </div>

                <button 
                  onClick={() => handleRegister(event.id)}
                  className="btn btn-primary"
                  disabled={!user}
                  style={{ opacity: user ? 1 : 0.6 }}
                >
                  {user ? 'Register' : 'Login to Register'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
