# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import novel, chapter, character, location, discovery, scene, memory
from database.database import engine
import database.models as models
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Story Development API",
    description="API for managing story development including novels, chapters, characters, and more",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Currently allowing all origins in development
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

logger.info("=" * 50)
logger.info("FastAPI Starting Up")
logger.info("=" * 50)

@app.get("/")
async def read_root():
    return {"message": "Story Development API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}