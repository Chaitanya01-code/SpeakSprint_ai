# SpeakSprint AI - Backend API

FastAPI-based backend server for the SpeakSprint AI application. Handles user authentication, topic management, and text processing.

## 📋 Features

- **User Authentication**: Register, login with email/password, admin login
- **Topic Management**: CRUD operations for topics
- **Text Processing**: Store and manage text content
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL support
- **API Documentation**: Auto-generated Swagger UI
- **Security**: bcrypt password hashing, CORS middleware

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: SQLAlchemy with SQLite (default) / PostgreSQL
- **Authentication**: bcrypt
- **Speech-to-Text**: Deepgram SDK
- **Environment**: python-dotenv

## 📦 Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create virtual environment (optional but recommended)**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   # .env
   DB_URL=sqlite:///./speaksprint.db
   # or for PostgreSQL:
   # DB_URL=postgresql://user:password@localhost/speaksprint
   ```

5. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Auto-generated Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

#### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user/admin

#### Topics
- `GET /api/v1/topics` - List all topics
- `GET /api/v1/topics/{topic_id}` - Get topic by ID
- `POST /api/v1/topics` - Create new topic
- `PUT /api/v1/topics/{topic_id}` - Update topic
- `DELETE /api/v1/topics/{topic_id}` - Delete topic

## 📁 Project Structure

```
app/
├── main.py              # FastAPI application entry point
├── __init__.py
├── api/
│   ├── auth.py         # Authentication routes
│   └── __init__.py
├── models/
│   ├── topic.py        # Topic API routes & schemas
│   ├── admin.py        # Admin routes (placeholder)
│   ├── user.py         # User routes (placeholder)
│   └── __init__.py
└── core/
    ├── database.py     # Database configuration
    ├── userdb.py       # User model
    ├── topicdb.py      # Topic model
    ├── textdb.py       # Text model
    └── __init__.py
```

## 🗄️ Database

### Tables

**users**
- `id` (INTEGER, PRIMARY KEY)
- `username` (STRING, UNIQUE)
- `email` (STRING, UNIQUE, NOT NULL)
- `password_hash` (STRING, NOT NULL)
- `is_active` (BOOLEAN, DEFAULT: true)
- `is_admin` (BOOLEAN, DEFAULT: false)
- `created_at` (DATETIME, DEFAULT: UTC now)
- `role` (STRING, DEFAULT: 'user')

**topics**
- `id` (INTEGER, PRIMARY KEY)
- `topic_name` (STRING, UNIQUE, NOT NULL)
- `description` (STRING)
- `created_at` (DATETIME, DEFAULT: UTC now)

**texts**
- `id` (INTEGER, PRIMARY KEY)
- `title` (STRING, NOT NULL)
- `content` (TEXT)
- `created_at` (DATETIME, DEFAULT: UTC now)

### Default Admin User
Automatically created on first run:
- **Username**: admin123
- **Password**: admin 123
- **Email**: admin@speaksprint.com

## 🔐 Environment Variables

```env
# Database URL (SQLite or PostgreSQL)
DB_URL=sqlite:///./speaksprint.db

# Optional: Deepgram API key for speech-to-text
DEEPGRAM_API_KEY=your_api_key_here
```

## 🚀 Running the Application

### Development Mode
```bash
uvicorn app.main:app --reload
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker (if dockerfile exists)
```bash
docker build -t speaksprint-backend .
docker run -p 8000:8000 speaksprint-backend
```

## 📝 Usage Examples

### Register New User
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "confirm_password": "secure123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123"
  }'
```

### Create Topic
```bash
curl -X POST http://localhost:8000/api/v1/topics \
  -H "Content-Type: application/json" \
  -d '{
    "topic_name": "Python Basics",
    "description": "Learn Python fundamentals"
  }'
```

## 🧪 Testing

```bash
pip install pytest pytest-asyncio
pytest
```

## 📄 License

MIT License

## 👥 Contributing

Contributions are welcome! Please follow the existing code structure and style.

## 📞 Support

For issues and questions, please create an issue in the repository.
