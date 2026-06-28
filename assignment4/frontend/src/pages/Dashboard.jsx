import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, authAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authAPI.getMe();
        setUser(userResponse.user);
        
        // Get all events and filter for registered ones
        const eventsResponse = await eventsAPI.getAll();
        setRegisteredEvents(eventsResponse.events.slice(0, 3)); // Sample registered events
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="container" style={{ padding: '2rem 0' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
          Welcome back, {user?.full_name}!
        </h1>

        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '5px' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Your Profile</h3>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Member Since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
        </div>

        <h2 style={{ marginBottom: '1rem', color: '#3498db' }}>Your Registered Events</h2>
        
        {registeredEvents.length === 0 ? (
          <p>You haven't registered for any events yet. <a href="/events" style={{ color: '#3498db' }}>Browse events</a></p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {registeredEvents.map((event) => (
              <div key={event.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>{event.description}</p>
                <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Difficulty:</strong> {event.difficulty}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/events" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Browse All Events
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
