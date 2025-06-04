from app import app, db
from models import User, Post
from werkzeug.security import generate_password_hash

def seed_database():
    """Seed the database with initial data"""
    print("Seeding database...")
    
    # Create users
    user1 = User(
        name='Jane Smith',
        username='janesmith',
        email='jane@example.com',
        password_hash=generate_password_hash('password123'),
        avatar='https://i.pravatar.cc/150?img=1',
        bio='UI/UX Designer | Creating beautiful interfaces | Coffee lover'
    )
    
    user2 = User(
        name='Alex Johnson',
        username='alexj',
        email='alex@example.com',
        password_hash=generate_password_hash('password123'),
        avatar='https://i.pravatar.cc/150?img=2',
        bio='Frontend Developer | React enthusiast | Learning Next.js'
    )
    
    user3 = User(
        name='Sam Wilson',
        username='samw',
        email='sam@example.com',
        password_hash=generate_password_hash('password123'),
        avatar='https://i.pravatar.cc/150?img=3',
        bio='Book lover | Tech enthusiast | Always learning'
    )
    
    # Add users to session
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()
    
    # Create friendships
    user1.add_friend(user2)
    db.session.commit()
    
    # Create posts
    post1 = Post(
        content='Just launched my new portfolio website! Check it out and let me know what you think.',
        author_id=user1.id,
        likes=24
    )
    
    post2 = Post(
        content='Working on a new React project using Next.js and Tailwind. The developer experience is amazing!',
        author_id=user2.id,
        likes=42
    )
    
    post3 = Post(
        content='Just finished reading "Atomic Habits" by James Clear. Highly recommend it to anyone looking to build better habits!',
        author_id=user3.id,
        likes=18
    )
    
    # Add posts to session
    db.session.add(post1)
    db.session.add(post2)
    db.session.add(post3)
    db.session.commit()
    
    print("Database seeded successfully!")

if __name__ == '__main__':
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Seed database
        seed_database()