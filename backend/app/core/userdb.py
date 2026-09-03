from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String, inspect, text
from .database import Base, SessionLocal, create_all_tables, engine


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    role = Column(String(50), default="user", nullable=False)


# Import all models to ensure they are registered with Base before creating tables
from .topicdb import Topic
from .speechdb import TextModel

# Create all tables in the database
create_all_tables()


def ensure_domain_column():
    """Add the domain column for databases created before domain was introduced."""
    columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "domain" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN domain VARCHAR(255)"))


ensure_domain_column()


def initialize_admin_user():
    """Create default admin user if it doesn't exist"""
    from .database import get_db
    import bcrypt
    
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.username == "admin123").first()
        if not admin_user:
            password_hash = bcrypt.hashpw(b"admin 123", bcrypt.gensalt()).decode("utf-8")
            admin_user = User(
                username="admin123",
                email="admin@speaksprint.com",
                password_hash=password_hash,
                is_admin=True,
                is_active=True,
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created with username: admin123 and password: admin 123")
    finally:
        db.close()
