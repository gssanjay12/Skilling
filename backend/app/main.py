from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .api import auth, users, matches, dashboard, skills

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skilling MVP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skilling-one.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(matches.router)
app.include_router(dashboard.router)
app.include_router(skills.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Skilling API"}
