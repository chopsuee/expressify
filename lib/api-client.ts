// API client for interacting with the backend
import { Post, Author } from './types';

// Use Next.js API route instead of direct backend URL to avoid CORS issues
const API_URL = '/api';

// Get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

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
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
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
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.user;
    },
    
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },

    getCurrentUser: async () => {
      const response = await fetch(`${API_URL}/me`, {
        headers: authHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
      
      return response.json();
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
    },

    updateProfile: async (data: {name?: string, bio?: string, avatar?: string}) => {
      const response = await fetch(`${API_URL}/me`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    }
  }
};