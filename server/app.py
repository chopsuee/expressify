from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
import jwt
import os
import datetime
from functools import wraps
from dotenv import load_dotenv
from models import db, User, Post

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all routes with credentials support

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:temporary@localhost:5432/blogpost')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        # Pass the current user to the route
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': user.to_dict(include_email=True)
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name') or not data.get('username'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if email or username already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 409
    
    # Create new user
    user = User(
        name=data['name'],
        username=data['username'],
        email=data['email'],
        avatar=f"https://i.pravatar.cc/150?u={data['email']}"  # Random avatar based on email
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': user.to_dict(include_email=True)
    }), 201

@app.route('/api/posts', methods=['GET'])
@token_required
def get_posts(current_user):
    """Get all posts"""
    # Get all posts with author information
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([post.to_dict() for post in posts])

@app.route('/api/posts', methods=['POST'])
@token_required
def create_post(current_user):
    """Create a new post"""
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'message': 'Missing content'}), 400
    
    # Create new post
    post = Post(
        content=data['content'],
        author_id=current_user.id
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
@token_required
def update_post(current_user, post_id):
    """Update a post"""
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'message': 'Missing content'}), 400
    
    # Find post
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # Check if user is the author
    if post.author_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Update post
    post.content = data['content']
    db.session.commit()
    
    return jsonify(post.to_dict())

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@token_required
def delete_post(current_user, post_id):
    """Delete a post"""
    # Find post
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # Check if user is the author
    if post.author_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Delete post
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({'message': 'Post deleted'})

@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
@token_required
def like_post(current_user, post_id):
    """Like a post"""
    # Find post
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # Increment likes
    post.likes += 1
    db.session.commit()
    
    return jsonify({'likes': post.likes})

@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    """Get all users"""
    users = User.query.filter(User.id != current_user.id).all()
    
    result = []
    for user in users:
        user_data = user.to_dict()
        user_data['isFriend'] = current_user.is_friend(user)
        result.append(user_data)
    
    return jsonify(result)

@app.route('/api/users/<int:user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    """Get a specific user"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    user_data = user.to_dict()
    user_data['isFriend'] = current_user.is_friend(user)
    
    return jsonify(user_data)

@app.route('/api/users/<int:user_id>/posts', methods=['GET'])
@token_required
def get_user_posts(current_user, user_id):
    """Get posts by a specific user"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get user's posts
    posts = Post.query.filter_by(author_id=user_id).order_by(Post.created_at.desc()).all()
    
    return jsonify([post.to_dict() for post in posts])

@app.route('/api/users/<int:user_id>/friends', methods=['POST'])
@token_required
def toggle_friendship(current_user, user_id):
    """Toggle friendship with another user"""
    if user_id == current_user.id:
        return jsonify({'message': 'Cannot friend yourself'}), 400
    
    target_user = User.query.get(user_id)
    if not target_user:
        return jsonify({'message': 'User not found'}), 404
    
    # Toggle friendship
    if current_user.is_friend(target_user):
        current_user.remove_friend(target_user)
        is_friend = False
    else:
        current_user.add_friend(target_user)
        is_friend = True
    
    db.session.commit()
    
    return jsonify({'isFriend': is_friend})

@app.route('/api/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user profile"""
    return jsonify(current_user.to_dict(include_email=True))

@app.route('/api/me', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile"""
    data = request.get_json()
    
    if 'name' in data:
        current_user.name = data['name']
    
    if 'bio' in data:
        current_user.bio = data['bio']
    
    if 'avatar' in data:
        current_user.avatar = data['avatar']
    
    db.session.commit()
    
    return jsonify(current_user.to_dict(include_email=True))

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)