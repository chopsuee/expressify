'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api-client';
import { Post, PostsState } from './types';
import { useAuth } from './auth-context';

interface PostsContextType extends PostsState {
  addPost: (content: string) => Promise<void>;
  updatePost: (id: string | number, content: string) => Promise<void>;
  deletePost: (id: string | number) => Promise<void>;
  likePost: (id: string | number) => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchUserPosts: (userId: string | number) => Promise<Post[]>;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PostsState>(initialState);
  const { isAuthenticated } = useAuth();

  // Fetch posts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    
    try {
      const posts = await api.posts.getAll();
      setState({
        posts,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to fetch posts'
      }));
    }
  };

  const fetchUserPosts = async (userId: string | number) => {
    try {
      return await api.users.getPosts(userId.toString());
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: 'Failed to fetch user posts'
      }));
      return [];
    }
  };

  const addPost = async (content: string) => {
    setState(prevState => ({ ...prevState, loading: true }));
    
    try {
      const newPost = await api.posts.create(content);
      setState(prevState => ({
        posts: [newPost, ...prevState.posts],
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to create post'
      }));
    }
  };

  const updatePost = async (id: string | number, content: string) => {
    setState(prevState => ({ ...prevState, loading: true }));
    
    try {
      const updatedPost = await api.posts.update(id.toString(), content);
      setState(prevState => ({
        posts: prevState.posts.map(post => 
          post.id === id ? updatedPost : post
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to update post'
      }));
    }
  };

  const deletePost = async (id: string | number) => {
    setState(prevState => ({ ...prevState, loading: true }));
    
    try {
      await api.posts.delete(id.toString());
      setState(prevState => ({
        posts: prevState.posts.filter(post => post.id !== id),
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to delete post'
      }));
    }
  };

  const likePost = async (id: string | number) => {
    try {
      const { likes } = await api.posts.like(id.toString());
      setState(prevState => ({
        posts: prevState.posts.map(post => 
          post.id === id ? { ...post, likes } : post
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: 'Failed to like post'
      }));
    }
  };

  // Memoize functions to prevent unnecessary re-renders
  const memoizedFunctions = React.useMemo(() => ({
    addPost,
    updatePost,
    deletePost,
    likePost,
    fetchPosts,
    fetchUserPosts
  }), []);

  return (
    <PostsContext.Provider value={{ 
      ...state, 
      ...memoizedFunctions
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}