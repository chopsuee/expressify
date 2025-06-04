'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api-client';
import { Author, UsersState } from './types';
import { useAuth } from './auth-context';

interface UsersContextType extends UsersState {
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string | number) => Promise<Author | null>;
  toggleFriendship: (id: string | number) => Promise<void>;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UsersState>(initialState);
  const { isAuthenticated } = useAuth();

  // Fetch users when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    
    try {
      const users = await api.users.getAll();
      setState({
        users,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to fetch users'
      }));
    }
  };

  const fetchUserById = async (id: string | number) => {
    try {
      return await api.users.getById(id.toString());
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: 'Failed to fetch user'
      }));
      return null;
    }
  };

  const toggleFriendship = async (id: string | number) => {
    try {
      const { isFriend } = await api.users.toggleFriendship(id.toString());
      setState(prevState => ({
        users: prevState.users.map(user => 
          user.id === id ? { ...user, isFriend } : user
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: 'Failed to toggle friendship'
      }));
    }
  };

  // Memoize functions to prevent unnecessary re-renders
  const memoizedFunctions = React.useMemo(() => ({
    fetchUsers,
    fetchUserById,
    toggleFriendship
  }), []);

  return (
    <UsersContext.Provider value={{ 
      ...state, 
      ...memoizedFunctions
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}