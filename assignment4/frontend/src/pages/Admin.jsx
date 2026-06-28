import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, eventsAPI, contactAPI } from '../services/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [usersRes, eventsRes, messagesRes] = await Promise.all([
        usersAPI.getAll(),
        eventsAPI.getAll(),
        contactAPI.getAllMessages()
      ]);
      setUsers(usersRes.users);
      setEvents(eventsRes.events);
      setMessages(messagesRes.messages);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await usersAPI.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await usersAPI.updateRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert('Role updated successfully');
    } catch (err) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventsAPI.delete(eventId);
      setEvents(events.filter(e => e.id !== eventId));
      alert('Event deleted successfully');
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await contactAPI.markAsRead(messageId);
      setMessages(messages.map(m => m.id === messageId ? { ...m, is_read: 1 } : m));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem 0' }}>Loading admin panel...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #ddd', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ 
              padding: '0.5rem 1rem', 
              border: 'none', 
              backgroundColor: activeTab === 'users' ? '#3498db' : 'transparent',
              color: activeTab === 'users' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            Users ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            style={{ 
              padding: '0.5rem 1rem', 
              border: 'none', 
              backgroundColor: activeTab === 'events' ? '#3498db' : 'transparent',
              color: activeTab === 'events' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            Events ({events.length})
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            style={{ 
              padding: '0.5rem 1rem', 
              border: 'none', 
              backgroundColor: activeTab === 'messages' ? '#3498db' : 'transparent',
              color: activeTab === 'messages' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            Messages ({messages.filter(m => !m.is_read).length} unread)
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>User Management</h2>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px' }}>{user.username}</td>
                      <td style={{ padding: '10px' }}>{user.email}</td>
                      <td style={{ padding: '10px' }}>
                        <select 
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          style={{ padding: '5px', borderRadius: '3px' }}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-danger"
                          style={{ padding: '5px 10px', fontSize: '14px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Event Management</h2>
            {events.length === 0 ? (
              <p>No events found.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {events.map((event) => (
                  <div key={event.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
                      <p style={{ color: '#666' }}>{event.location} - {new Date(event.event_date).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="btn btn-danger"
                      style={{ padding: '5px 10px', fontSize: '14px' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Contact Messages</h2>
            {messages.length === 0 ? (
              <p>No messages found.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    style={{ 
                      padding: '1rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '5px',
                      backgroundColor: message.is_read ? '#f8f9fa' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0 }}>{message.subject}</h3>
                      {!message.is_read && (
                        <button 
                          onClick={() => handleMarkAsRead(message.id)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '14px' }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>From:</strong> {message.name} ({message.email})
                    </p>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Date:</strong> {new Date(message.created_at).toLocaleString()}
                    </p>
                    <p style={{ lineHeight: '1.6' }}>{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
