# Expressify

Expressify is a modern social media application built with Next.js and Flask, allowing users to create posts, connect with friends, and interact with content.

## Features

- User authentication (signup, login)
- Create, edit, and delete posts
- Like posts
- User profiles
- Friend connections
- Dark/light mode toggle
- Responsive design

## Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Components**: Custom components with Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API, Zustand
- **Authentication**: JWT token-based auth

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- PostgreSQL

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example` and set your database connection string and secret key.

6. Initialize the database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

7. (Optional) Seed the database:
   ```bash
   python seed.py
   ```

8. Run the server:
   ```bash
   flask run
   ```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/api/auth/login` | User login | `{email, password}` | `{token, user}` |
| POST | `/api/auth/register` | User registration | `{name, username, email, password}` | `{token, user}` |

### Posts Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/api/posts` | Get all posts | - | Array of posts |
| POST | `/api/posts` | Create a post | `{content}` | Created post |
| PUT | `/api/posts/<post_id>` | Update a post | `{content}` | Updated post |
| DELETE | `/api/posts/<post_id>` | Delete a post | - | Success message |
| POST | `/api/posts/<post_id>/like` | Like/unlike a post | - | Updated likes count |

### Users Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/api/users` | Get all users | - | Array of users |
| GET | `/api/users/<user_id>` | Get user profile | - | User object |
| GET | `/api/users/<user_id>/posts` | Get user's posts | - | Array of posts |
| POST | `/api/users/<user_id>/friends` | Add/remove friend | - | Updated friendship status |
| GET | `/api/me` | Get current user | - | User object |
| PUT | `/api/me` | Update profile | `{name, bio, avatar}` | Updated user |

## Frontend Structure

```
expressify/
├── app/                  # Next.js app directory
│   ├── friends/          # Friends page
│   ├── home/             # Home feed page
│   ├── login/            # Login page
│   ├── profile/          # User profile page
│   └── signup/           # Signup page
├── components/           # React components
│   ├── ui/               # UI components
│   ├── create-post-compact.tsx
│   ├── navigation-bar.tsx
│   ├── post-card.tsx
│   └── ...
├── lib/                  # Utility functions and context
│   ├── api-client.ts     # API client
│   ├── auth-context.tsx  # Authentication context
│   ├── posts-context.tsx # Posts context
│   └── ...
└── public/               # Static assets
```

## Best Practices

- **State Management**: Use context for global state (auth, posts)
- **Data Fetching**: Fetch data in useEffect or during page load
- **Error Handling**: Implement proper error handling for API calls
- **Responsive Design**: Use Tailwind's responsive classes
- **Authentication**: Protect routes with AuthGuard component
- **Loading States**: Use skeleton components for better user experience


## License

MIT