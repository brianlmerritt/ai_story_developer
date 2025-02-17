from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
import crud.novel as novel_crud
from schemas.novel import Novel, NovelCreate, NovelUpdate

router = APIRouter(
    prefix="/novels",
    tags=["novels"]
)

@router.post("/", response_model=Novel)
def create_novel(novel: NovelCreate, db: Session = Depends(get_db)):
    return novel_crud.create_novel(db=db, novel=novel)

@router.get("/", response_model=List[Novel])
def read_novels(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    novels = novel_crud.get_novels(db, skip=skip, limit=limit)
    return novels

@router.get("/{novel_id}", response_model=Novel)
def read_novel(novel_id: int, db: Session = Depends(get_db)):
    db_novel = novel_crud.get_novel(db, novel_id=novel_id)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db_novel

@router.put("/{novel_id}", response_model=Novel)
def update_novel(novel_id: int, novel: NovelUpdate, db: Session = Depends(get_db)):
    db_novel = novel_crud.update_novel(db, novel_id=novel_id, novel=novel)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db_novel

@router.delete("/{novel_id}")
def delete_novel(novel_id: int, db: Session = Depends(get_db)):
    success = novel_crud.delete_novel(db, novel_id=novel_id)
    if not success:
        raise HTTPException(status_code=404, detail="Novel not found")
    return {"message": "Novel deleted successfully"} 