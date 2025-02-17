# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import novel, chapter, character, location, discovery, scene, memory
from database.database import engine
import database.models as models
import os

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Story Development API",
    description="API for managing story development including novels, chapters, characters, and more",
    version="1.0.0"
)

# Get CORS origins from environment variable or use default
origins = os.getenv("CORS_ORIGINS", "http://192.168.1.185:4444").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(novel.router, prefix="/api")
app.include_router(chapter.router, prefix="/api")
app.include_router(character.router, prefix="/api")
app.include_router(location.router, prefix="/api")
app.include_router(discovery.router, prefix="/api")
app.include_router(scene.router, prefix="/api")
app.include_router(memory.router, prefix="/api")

@app.get("/")
async def read_root():
    return {"message": "Story Development API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}