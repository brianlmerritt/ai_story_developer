# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import novel, chapter, character, location, discovery, scene, memory
from database.database import engine
import database.models as models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Story Development API",
    description="API for managing story development including novels, chapters, characters, and more",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4444"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(novel.router)
app.include_router(chapter.router)
app.include_router(character.router)
app.include_router(location.router)
app.include_router(discovery.router)
app.include_router(scene.router)
app.include_router(memory.router)

@app.get("/")
async def read_root():
    return {"message": "Story Development API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}