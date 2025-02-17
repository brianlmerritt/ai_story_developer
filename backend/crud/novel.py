from sqlalchemy.orm import Session
from database.models import Novel
from schemas.novel import NovelCreate, NovelUpdate

def get_novel(db: Session, novel_id: int):
    return db.query(Novel).filter(Novel.id == novel_id).first()

def get_novels(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Novel).offset(skip).limit(limit).all()

def create_novel(db: Session, novel: NovelCreate):
    db_novel = Novel(**novel.model_dump())
    db.add(db_novel)
    db.commit()
    db.refresh(db_novel)
    return db_novel

def update_novel(db: Session, novel_id: int, novel: NovelUpdate):
    db_novel = get_novel(db, novel_id)
    if db_novel:
        update_data = novel.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_novel, key, value)
        db.commit()
        db.refresh(db_novel)
    return db_novel

def delete_novel(db: Session, novel_id: int):
    db_novel = get_novel(db, novel_id)
    if db_novel:
        db.delete(db_novel)
        db.commit()
        return True
    return False 