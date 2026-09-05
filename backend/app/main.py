from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth
from app.api import speech
from app.api import settings
from app.models import topic
from app.models import user
from app.models import attempt
from app.models import transcript
from app.core import create_all_tables, initialize_admin_user, initialize_default_settings
from app.voice.speech_to_text import router as speech_to_text_router

@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Initialize database objects and seed data once when the app starts."""
    create_all_tables()
    transcript.ensure_transcript_analysis_columns()
    initialize_admin_user()
    initialize_default_settings()
    transcript.sync_transcripts_to_attempts()
    yield


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(auth.router)
app.include_router(topic.router)
app.include_router(speech.router)
app.include_router(settings.router)
app.include_router(user.router)
app.include_router(attempt.router)
app.include_router(transcript.router)
app.include_router(speech_to_text_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"Hello": "from backend!"}