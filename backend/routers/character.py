from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database.database import get_db
import crud.character as character_crud
from schemas.character import Character, CharacterCreate, CharacterUpdate

router = APIRouter(
    prefix="/characters",
    tags=["characters"]
)

@router.post("/", response_model=Character)
def create_character(character: CharacterCreate, db: Session = Depends(get_db)):
    db_character = character_crud.get_character_by_name(db, name=character.name)
    if db_character:
        raise HTTPException(status_code=400, detail="Character name already registered")
    return character_crud.create_character(db=db, character=character)

@router.get("/", response_model=List[Character])
def read_characters(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if search:
        characters = character_crud.search_characters(db, search, skip=skip, limit=limit)
    else:
        characters = character_crud.get_characters(db, skip=skip, limit=limit)
    return characters

@router.get("/{character_id}", response_model=Character)
def read_character(character_id: int, db: Session = Depends(get_db)):
    db_character = character_crud.get_character(db, character_id=character_id)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character

@router.put("/{character_id}", response_model=Character)
def update_character(
    character_id: int, 
    character: CharacterUpdate, 
    db: Session = Depends(get_db)
):
    db_character = character_crud.update_character(
        db, character_id=character_id, character=character
    )
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character

@router.delete("/{character_id}")
def delete_character(character_id: int, db: Session = Depends(get_db)):
    success = character_crud.delete_character(db, character_id=character_id)
    if not success:
        raise HTTPException(status_code=404, detail="Character not found")
    return {"message": "Character deleted successfully"} 