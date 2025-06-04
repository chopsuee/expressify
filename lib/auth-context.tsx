'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api-client';
import { User, AuthState } from './types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  bypass: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setState({ ...initialState, loading: false });
        return;
      }
      
      try {
        const user = await api.auth.getCurrentUser();
        setState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });
      } catch (error) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Session expired. Please login again.'
        });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const user = await api.auth.login(email, password);
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      });
      router.replace('/home');
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Invalid email or password'
      }));
    }
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const user = await api.auth.register(name, username, email, password);
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      });
      router.replace('/home');
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Registration failed'
      }));
    }
  };

  const logout = () => {
    api.auth.logout();
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
    router.replace('/');
  };

  const bypass = () => {
    // Create a mock user for bypass mode
    const mockUser = {
      id: 'bypass-user',
      name: 'Guest User',
      username: 'guest',
      email: 'guest@example.com',
      avatar: 'https://i.pravatar.cc/150?img=0',
      posts_count: 0,
      followers_count: 0,
      following_count: 0
    };
    
    setState({
      isAuthenticated: true,
      user: mockUser,
      loading: false,
      error: null
    });
    
    // Store a temporary token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', 'bypass-token');
    }
    router.replace('/home');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, bypass }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}