from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth
from app.models import topic
from app.models import user
from app.models import attempt
from app.core.userdb import initialize_admin_user

app = FastAPI()

# Initialize admin user on startup
@app.on_event("startup")
async def startup_event():
    initialize_admin_user()
    initialize_default_settings()

# Include routers
app.include_router(auth.router)
app.include_router(topic.router)

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