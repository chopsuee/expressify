# Expressify Backend API

A Flask-based backend for the Expressify social media application with PostgreSQL database.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example` and set your database connection string and secret key.

5. Initialize the database:
   ```
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

6. Seed the database with initial data (optional):
   ```
   python seed.py
   ```

7. Run the server:
   ```
   flask run
   ```

## Database Schema

### Users Table
- id (PK)
- name
- username (unique)
- email (unique)
- password_hash
- avatar
- bio
- created_at

### Posts Table
- id (PK)
- content
- author_id (FK to users.id)
- created_at
- updated_at
- likes

### Friendships Table (Many-to-Many)
- user_id (PK, FK to users.id)
- friend_id (PK, FK to users.id)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `PUT /api/posts/<post_id>` - Update a post
- `DELETE /api/posts/<post_id>` - Delete a post
- `POST /api/posts/<post_id>/like` - Like a post

### Users
- `GET /api/users` - Get all users
- `GET /api/users/<user_id>` - Get a specific user
- `GET /api/users/<user_id>/posts` - Get posts by a specific user
- `POST /api/users/<user_id>/friends` - Toggle friendship with another user

### Current User
- `GET /api/me` - Get current user profile
- `PUT /api/me` - Update current user profile

## Authentication

All endpoints except `/api/auth/login` and `/api/auth/register` require authentication.
Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```