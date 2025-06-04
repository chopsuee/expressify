'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Post {
  id: string
  content: string
  authorId: string
  timestamp: string
  likes: number
}

export interface Author {
  id: string
  name: string
  username: string
  avatar: string
  bio?: string
  posts?: number
  followers?: number
  following?: number
  isFriend?: boolean
}

interface PostsState {
  posts: Post[]
  authors: Record<string, Author>
  currentUser: string
  isAuthenticated: boolean
  
  // CRUD operations
  addPost: (content: string) => void
  updatePost: (id: string, content: string) => void
  deletePost: (id: string) => void
  likePost: (id: string) => void
  toggleFriendship: (userId: string) => void
  login: (username: string, password: string) => boolean
  bypass: () => void
  logout: () => void
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set) => ({
      posts: [
        {
          id: 'p1',
          content: 'Just launched my new portfolio website! Check it out and let me know what you think.',
          authorId: 'user1',
          timestamp: '2h ago',
          likes: 24
        },
        {
          id: 'p2',
          content: 'Working on a new React project using Next.js and Tailwind. The developer experience is amazing!',
          authorId: 'user2',
          timestamp: '5h ago',
          likes: 42
        },
        {
          id: 'p3',
          content: 'Just finished reading "Atomic Habits" by James Clear. Highly recommend it to anyone looking to build better habits!',
          authorId: 'user3',
          timestamp: '1d ago',
          likes: 18
        }
      ],
      authors: {
        'user1': {
          id: 'user1',
          name: 'Jane Smith',
          username: 'janesmith',
          avatar: 'https://i.pravatar.cc/150?img=1',
          bio: 'UI/UX Designer | Creating beautiful interfaces | Coffee lover',
          posts: 248,
          followers: 1432,
          following: 536,
          isFriend: true
        },
        'user2': {
          id: 'user2',
          name: 'Alex Johnson',
          username: 'alexj',
          avatar: 'https://i.pravatar.cc/150?img=2',
          bio: 'Frontend Developer | React enthusiast | Learning Next.js',
          posts: 156,
          followers: 892,
          following: 245,
          isFriend: true
        },
        'user3': {
          id: 'user3',
          name: 'Sam Wilson',
          username: 'samw',
          avatar: 'https://i.pravatar.cc/150?img=3',
          bio: 'Book lover | Tech enthusiast | Always learning',
          posts: 87,
          followers: 543,
          following: 321,
          isFriend: false
        },
        'user4': {
          id: 'user4',
          name: 'Emily Chen',
          username: 'emilyc',
          avatar: 'https://i.pravatar.cc/150?img=5',
          bio: 'Product Designer | Travel enthusiast | Coffee addict',
          posts: 124,
          followers: 753,
          following: 289,
          isFriend: false
        },
        'user5': {
          id: 'user5',
          name: 'Michael Brown',
          username: 'mikeb',
          avatar: 'https://i.pravatar.cc/150?img=8',
          bio: 'Software Engineer | Open source contributor | Gamer',
          posts: 76,
          followers: 421,
          following: 198,
          isFriend: false
        }
      },
      currentUser: 'user1', // Default logged in user
      isAuthenticated: false, // Default authentication state
      
      addPost: (content) => set((state) => {
        const newPost = {
          id: `p${Date.now()}`,
          content,
          authorId: state.currentUser,
          timestamp: 'Just now',
          likes: 0
        };
        return { 
          posts: [newPost, ...state.posts],
          authors: {
            ...state.authors,
            [state.currentUser]: {
              ...state.authors[state.currentUser],
              posts: (state.authors[state.currentUser].posts || 0) + 1
            }
          }
        };
      }),
      
      updatePost: (id, content) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === id ? { ...post, content } : post
        )
      })),
      
      deletePost: (id) => set((state) => {
        const postToDelete = state.posts.find(post => post.id === id);
        if (!postToDelete) return state;
        
        return {
          posts: state.posts.filter(post => post.id !== id),
          authors: {
            ...state.authors,
            [postToDelete.authorId]: {
              ...state.authors[postToDelete.authorId],
              posts: Math.max(0, (state.authors[postToDelete.authorId].posts || 1) - 1)
            }
          }
        };
      }),
      
      likePost: (id) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        )
      })),
      
      toggleFriendship: (userId) => set((state) => ({
        authors: {
          ...state.authors,
          [userId]: {
            ...state.authors[userId],
            isFriend: !state.authors[userId].isFriend
          }
        }
      })),
      
      login: (username, password) => {
        // Simple mock authentication
        if (username && password) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      bypass: () => {
        set({ isAuthenticated: true });
      },
      
      logout: () => {
        set({ isAuthenticated: false });
      }
    }),
    {
      name: 'posts-storage'
    }
  )
)