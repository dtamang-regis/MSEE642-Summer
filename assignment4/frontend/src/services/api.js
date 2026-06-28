const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// API calls with authentication
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authHeaders()
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders()
    });
    return handleResponse(response);
  }
};

// Events API
export const eventsAPI = {
  getAll: async (difficulty = '') => {
    const url = difficulty 
      ? `${API_BASE_URL}/events?difficulty=${difficulty}`
      : `${API_BASE_URL}/events`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return handleResponse(response);
  },

  create: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(eventData)
    });
    return handleResponse(response);
  },

  update: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(eventData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return handleResponse(response);
  },

  register: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/register`, {
      method: 'POST',
      headers: authHeaders()
    });
    return handleResponse(response);
  },

  cancelRegistration: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/register`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return handleResponse(response);
  }
};

// Contact API
export const contactAPI = {
  submit: async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    return handleResponse(response);
  },

  getAllMessages: async () => {
    const response = await fetch(`${API_BASE_URL}/contact/messages`, {
      headers: authHeaders()
    });
    return handleResponse(response);
  },

  markAsRead: async (id) => {
    const response = await fetch(`${API_BASE_URL}/contact/messages/${id}/read`, {
      method: 'PUT',
      headers: authHeaders()
    });
    return handleResponse(response);
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: authHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: authHeaders()
    });
    return handleResponse(response);
  },

  updateRole: async (id, role) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ role })
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return handleResponse(response);
  }
};
