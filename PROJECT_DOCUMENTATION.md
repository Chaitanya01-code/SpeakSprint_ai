# SpeakSprint AI Project Documentation

## 1. Project Overview

SpeakSprint AI is a React and FastAPI application for spoken-English practice. A user selects a topic, records speech in the browser, receives live transcription from Deepgram, and gets local and optional Gemini-based feedback. Results are stored as transcripts, evaluations, and attempts for dashboards, history, analytics, leaderboards, and admin reporting.

## 2. Technology Stack

### Frontend

- **React 19**: UI components and page rendering.
- **React DOM 19**: Mounts the React application in the browser.
- **Vite 8**: Frontend development server and production bundler.
- **@vitejs/plugin-react**: React support for Vite.
- **@tailwindcss/vite**: Tailwind/Vite integration available in the frontend toolchain.
- **jsPDF**: Client-side admin report PDF export.
- **Oxc / oxlint**: JavaScript and JSX linting through `npm run lint`.
- **TypeScript React type packages**: `@types/react` and `@types/react-dom` provide editor and tooling types.
- **Browser Web APIs**: `MediaRecorder`, `WebSocket`, `getUserMedia`, `AudioContext`, and local storage support recording and session state.

### Backend

- **Python 3.11**: Docker runtime and CI runtime. Local development supports Python 3.8+ in the existing backend documentation.
- **FastAPI**: HTTP API and WebSocket route framework.
- **Uvicorn**: ASGI development and production server.
- **SQLAlchemy**: ORM, models, sessions, and database queries.
- **SQLite**: Default database for Docker and local development when `DB_URL` is not set.
- **PostgreSQL / psycopg2-binary**: Optional external database support through `DB_URL`.
- **bcrypt**: Password hashing and verification.
- **PyJWT**: JWT creation and validation.
- **python-dotenv**: Loads local environment files.
- **Deepgram SDK**: Live speech-to-text streaming from the backend WebSocket.
- **Gemini HTTPS API**: Optional AI evaluation through the Generative Language API. No Gemini SDK is required.
- **spaCy**: NLP processing and language model support.
- **TextBlob**: Text and language analysis support.
- **LanguageTool Python**: Grammar analysis support.
- **scikit-learn**: Available for analysis and scoring-related processing.
- **pytest**: Backend test runner.
- **pytest-asyncio**: Async test support.

### Infrastructure and Development Tools

- **Docker**: Builds the backend and frontend images.
- **Docker Compose**: Runs the backend and frontend services together.
- **Git and GitHub**: Source control and repository hosting.
- **GitHub Actions**: Continuous integration workflow in `.github/workflows/ci.yml`.
- **npm**: Frontend dependency installation and scripts.
- **pip**: Backend dependency installation.
- **VS Code**: Recommended development editor.

## 3. Repository Structure

```text
SpeakSprint_ai/
├── .github/workflows/ci.yml       # GitHub Actions CI workflow
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application and startup lifecycle
│   │   ├── api/                    # Authentication, speech, settings routes
│   │   ├── core/                   # Database, security, and settings services
│   │   ├── models/                 # API route modules and database response logic
│   │   ├── ai_analysis/            # Local speech metrics and analysis orchestration
│   │   ├── ai_feedback/            # Schemas, scoring, prompts, and fallback feedback
│   │   └── voice/                  # Deepgram live transcription integration
│   ├── requirements.txt            # Python dependencies
│   ├── dockerfile                  # Backend image definition
│   └── README.md                   # Backend-specific documentation
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Path-based frontend routing
│   │   ├── lib/api.js              # API base URL and authenticated fetch helper
│   │   ├── hooks/                  # Browser speech-to-text hook
│   │   └── pages/                  # Login, practice, dashboard, analytics, admin UI
│   ├── package.json                # JavaScript dependencies and scripts
│   ├── package-lock.json           # npm dependency lockfile
│   ├── Dockerfile                  # Frontend image definition
│   └── README.md                   # Frontend-specific documentation
├── docker-compose.yml              # Local multi-container setup
├── README.md                       # Root project quick-start guide
└── PROJECT_DOCUMENTATION.md        # This document
```

## 4. Application Workflow

1. The user registers or logs in through the FastAPI authentication routes.
2. The frontend stores the returned JWT and user metadata in `localStorage`.
3. The homepage loads active speakers and the user selects a speaker for practice.
4. The practice page loads topics and the configured session duration.
5. Browser microphone audio is recorded with `MediaRecorder`.
6. Audio chunks are sent over `/ws/speech-to-text` to the backend.
7. The backend forwards audio to Deepgram and returns interim and final transcripts.
8. When recording stops, the frontend waits for recorder shutdown and transcript draining.
9. The frontend submits the transcript to `POST /api/v1/transcripts`.
10. The backend stores the transcript and text record, calculates local metrics, optionally requests Gemini feedback, stores the evaluation, and creates an attempt.
11. Dashboard, history, analytics, leaderboard, and admin pages read the stored results through authenticated API requests.

## 5. Backend API Areas

### Authentication

- `POST /register`
- `POST /login`
- `POST /logout`

### Topics and Settings

- `GET /api/v1/topics`
- `POST /api/v1/topics`
- `PUT /api/v1/topics/{topic_id}`
- `DELETE /api/v1/topics/{topic_id}`
- `GET /api/v1/settings/session-duration`
- `PUT /api/v1/settings/session-duration`

### Transcripts and Reports

- `POST /api/v1/transcripts`
- `GET /api/v1/transcripts?user_id={id}`
- `GET /api/v1/transcripts/admin`
- `GET /api/v1/attempts`
- `GET /api/v1/attempts/leaderboard`

### WebSockets

- `/ws/speech-to-text`: Streams browser audio to Deepgram and returns transcript messages.
- `/ws/speech`: Additional live speech metrics endpoint used by the backend API surface.

### API Documentation

When the backend is running:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 6. Environment Variables

Do not commit real credentials. Use a local `.env` file or GitHub Secrets.

### Backend variables

```env
DB_URL=sqlite:///./speaksprint.db
DEEPGRAM_API_KEY=your_deepgram_key
GEMINI_API_KEY=your_gemini_key
JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_EXPIRE_MINUTES=60
ADMIN_USERNAME=admin123
ADMIN_EMAIL=admin@speaksprint.com
ADMIN_PASSWORD=change-this-password
```

`DEEPGRAMMAR_API_KEY` is also recognized as a legacy alias by the speech service, but new deployments should use `DEEPGRAM_API_KEY`.

### Frontend variable

```env
VITE_BACKEND_URL=http://localhost:8000
```

Vite exposes only variables prefixed with `VITE_` to browser code. API keys must remain in the backend environment.

## 7. Docker and Compose

The Compose stack contains two services:

- **backend**: FastAPI on port `8000`.
- **frontend**: Vite development server on port `5173`.

The PostgreSQL container was removed. The backend uses SQLite by default. An external PostgreSQL or compatible database can still be selected by setting `DB_URL`.

The root `.env` file is passed to both containers at runtime through Compose. It is optional, and the Compose file also supplies safe development defaults for the backend.

Start the stack:

```bash
docker compose up --build
```

Stop the stack:

```bash
docker compose down
```

Validate the Compose file:

```bash
docker compose config
```

Build images without starting services:

```bash
docker compose build
```

## 8. Local Development

### Backend on Windows PowerShell

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Useful frontend scripts:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## 9. Testing and Validation

Run backend tests:

```bash
cd backend
python -m pytest app/ai_feedback/tests tests -q
```

Run frontend validation:

```bash
cd frontend
npm run lint
npm run build
```

Run Compose validation:

```bash
docker compose config
git diff --check
```

## 10. Continuous Integration

The workflow at `.github/workflows/ci.yml` runs on pushes to `main` or `master` and on pull requests.

### Frontend job

- Checks out the repository.
- Installs Node.js 22.
- Restores npm cache using `frontend/package-lock.json`.
- Runs `npm install`.
- Runs `npm run lint`.
- Runs `npm run build`.

### Backend job

- Checks out the repository.
- Installs Python 3.11.
- Restores pip cache using `backend/requirements.txt`.
- Installs backend requirements.
- Runs `python -m pytest app/ai_feedback/tests tests -q`.
- Makes these GitHub Secrets available as environment variables:
  - `DB_URL`
  - `DEEPGRAM_API_KEY`
  - `GEMINI_API_KEY`

### Docker job

Runs after the frontend and backend jobs succeed and:

- Validates the Compose configuration with `docker compose config`.
- Builds the backend and frontend images with `docker compose build`.

## 11. GitHub Secrets Setup

Create these repository secrets in GitHub under **Settings > Secrets and variables > Actions**:

| Secret | Used for |
| --- | --- |
| `DB_URL` | External database connection string, if required by CI/runtime |
| `DEEPGRAM_API_KEY` | Live speech-to-text |
| `GEMINI_API_KEY` | Optional AI-generated feedback |

Never place secret values directly in `ci.yml`, Dockerfiles, source code, README files, or committed `.env` files. Rotate any credential that has been exposed in a chat, terminal output, screenshot, commit, or public repository.

## 12. Data Storage

The main database tables include:

- `users`: Accounts, roles, status, and profile data.
- `topics`: Speaking topics and descriptions.
- `texts`: Stored transcript text.
- `speech_transcripts`: Transcript content, duration, topic, local analysis, and evaluation JSON.
- `attempts`: Scores, duration, topic references, and leaderboard data.
- `app_settings`: Configurable application settings such as session duration.

## 13. Important Operational Notes

- Gemini feedback is optional; local scoring is used as a fallback.
- Deepgram is required for live speech-to-text functionality.
- The backend creates tables during application startup.
- The frontend uses path-based routing in `App.jsx` rather than React Router.
- Runtime credentials should be supplied through environment variables or GitHub Secrets.
- The CI workflow validates code and image builds; it does not deploy the application.
