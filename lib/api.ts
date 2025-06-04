// API client for interacting with the backend

const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Headers with authentication
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// API functions
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.user;
    },
    
    register: async (name: string, username: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password })
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.user;
    },
    
    logout: () => {
      localStorage.removeItem('token');
    }
  },
  
  // Posts endpoints
  posts: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/posts`, {
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      return response.json();
    },
    
    create: async (content: string) => {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      return response.json();
    },
    
    update: async (id: string, content: string) => {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      return response.json();
    },
    
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      return response.json();
    },
    
    like: async (id: string) => {
      const response = await fetch(`${API_URL}/posts/${id}/like`, {
        method: 'POST',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      
      return response.json();
    }
  },
  
  // Users endpoints
  users: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/users`, {
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return response.json();
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      return response.json();
    },
    
    getPosts: async (id: string) => {
      const response = await fetch(`${API_URL}/users/${id}/posts`, {
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      
      return response.json();
    },
    
    toggleFriendship: async (id: string) => {
      const response = await fetch(`${API_URL}/users/${id}/friends`, {
        method: 'POST',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle friendship');
      }
      
      return response.json();
    }
  }
};