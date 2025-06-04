// Type definitions for the application

export interface Author {
  id: string | number;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
  isFriend?: boolean;
}

export interface Post {
  id: string | number;
  content: string;
  author: Author;
  created_at: string;
  updated_at?: string;
  likes: number;
}

export interface User extends Author {
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  users: Author[];
  loading: boolean;
  error: string | null;
}