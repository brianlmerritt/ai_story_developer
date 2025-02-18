from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
import crud.chapter as chapter_crud
from schemas.chapter import Chapter, ChapterCreate, ChapterUpdate
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chapters",
    tags=["chapters"]
)

@router.post("/", response_model=Chapter)
def create_chapter(chapter: ChapterCreate, db: Session = Depends(get_db)):
    # debugging: log received chapter data
    logger.info(f"Received chapter data: {chapter.dict()}")
    try:
        return chapter_crud.create_chapter(db=db, chapter=chapter)
    except Exception as e:
        # debugging: log chapter creation error
        logger.error(f"Error creating chapter: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Chapter])
def read_chapters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    chapters = chapter_crud.get_chapters(db, skip=skip, limit=limit)
    return chapters

@router.get("/novel/{novel_id}", response_model=List[Chapter])
def read_chapters_by_novel(
    novel_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    chapters = chapter_crud.get_chapters_by_novel(db, novel_id=novel_id, skip=skip, limit=limit)
    return chapters

@router.get("/{chapter_id}", response_model=Chapter)
def read_chapter(chapter_id: int, db: Session = Depends(get_db)):
    db_chapter = chapter_crud.get_chapter(db, chapter_id=chapter_id)
    if db_chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return db_chapter

@router.put("/{chapter_id}", response_model=Chapter)
def update_chapter(chapter_id: int, chapter: ChapterUpdate, db: Session = Depends(get_db)):
    db_chapter = chapter_crud.update_chapter(db, chapter_id=chapter_id, chapter=chapter)
    if db_chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return db_chapter

@router.delete("/{chapter_id}")
def delete_chapter(chapter_id: int, db: Session = Depends(get_db)):
    success = chapter_crud.delete_chapter(db, chapter_id=chapter_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {"message": "Chapter deleted successfully"} 