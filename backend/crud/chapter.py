from sqlalchemy.orm import Session
from database.models import Chapter
from schemas.chapter import ChapterCreate, ChapterUpdate

def get_chapter(db: Session, chapter_id: int):
    return db.query(Chapter).filter(Chapter.id == chapter_id).first()

def get_chapters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Chapter).offset(skip).limit(limit).all()

def get_chapters_by_novel(db: Session, novel_id: int, skip: int = 0, limit: int = 100):
    return db.query(Chapter)\
        .filter(Chapter.novel_id == novel_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_chapter(db: Session, chapter: ChapterCreate):
    db_chapter = Chapter(**chapter.model_dump())
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter

def update_chapter(db: Session, chapter_id: int, chapter: ChapterUpdate):
    db_chapter = get_chapter(db, chapter_id)
    if db_chapter:
        update_data = chapter.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_chapter, key, value)
        db.commit()
        db.refresh(db_chapter)
    return db_chapter

def delete_chapter(db: Session, chapter_id: int):
    db_chapter = get_chapter(db, chapter_id)
    if db_chapter:
        db.delete(db_chapter)
        db.commit()
        return True
    return False 