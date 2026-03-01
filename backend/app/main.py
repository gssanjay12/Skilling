from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .api import auth, users, matches, dashboard, skills

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skilling MVP API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (safe for MVP/testing)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(matches.router)
app.include_router(dashboard.router)
app.include_router(skills.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Skilling API"}