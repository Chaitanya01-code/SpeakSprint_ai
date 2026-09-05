# SpeakSprint AI

SpeakSprint AI is a React and FastAPI application for speech practice. It streams microphone audio to Deepgram, stores user-owned transcripts and AI evaluations, and displays results in user and admin dashboards.

## Requirements

- Docker Desktop with Docker Compose
- A Deepgram API key for live speech-to-text
- A Gemini API key for AI feedback (optional; local scoring fallback remains available)

## Run With Docker Compose

Create a `.env` file in the repository root:

```env
DEEPGRAM_API_KEY=your_deepgram_api_key
GEMINI_API_KEY=your_gemini_api_key
ADMIN_USERNAME=admin123
ADMIN_EMAIL=admin@speaksprint.com
ADMIN_PASSWORD=change-this-password
```

Start the application:

```bash
docker compose up --build
```

Open the frontend at `http://localhost:5173`.

Backend documentation is available at `http://localhost:8000/docs` and `http://localhost:8000/redoc` when using Docker. Local development uses port `8001`.

Stop the services with:

```bash
docker compose down
```

To remove the local PostgreSQL data volume as well:

```bash
docker compose down -v
```

## Services

| Service | Address | Purpose |
| --- | --- | --- |
| `frontend` | `http://localhost:5173` | React/Vite application |
| `backend` | `http://localhost:8000` | FastAPI API and WebSockets |
| `db` | `localhost:5432` | PostgreSQL database |

The backend creates and migrates its tables on startup. Saved speech is stored in `speech_transcripts.transcript` and `texts.content`. Each transcript stores local analysis and Gemini/fallback evaluation JSON for the same user.

User and admin panels poll for database changes every five seconds, skip unchanged state updates, and use uncached API reads. Admins can export dashboard metrics and recent attempts as a PDF.

## Local Development

Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

For local backend development, set `DB_URL`, `DEEPGRAM_API_KEY`, `GEMINI_API_KEY`, and JWT settings in `backend/.env`.
