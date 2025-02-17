from sqlalchemy.orm import Session
from database.models import Character
from schemas.character import CharacterCreate, CharacterUpdate

def get_character(db: Session, character_id: int):
    return db.query(Character).filter(Character.id == character_id).first()

def get_characters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Character).offset(skip).limit(limit).all()

def get_character_by_name(db: Session, name: str):
    return db.query(Character).filter(Character.name == name).first()

def create_character(db: Session, character: CharacterCreate):
    db_character = Character(**character.model_dump())
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

def update_character(db: Session, character_id: int, character: CharacterUpdate):
    db_character = get_character(db, character_id)
    if db_character:
        update_data = character.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_character, key, value)
        db.commit()
        db.refresh(db_character)
    return db_character

def delete_character(db: Session, character_id: int):
    db_character = get_character(db, character_id)
    if db_character:
        db.delete(db_character)
        db.commit()
        return True
    return False

def search_characters(db: Session, query: str, skip: int = 0, limit: int = 100):
    return db.query(Character)\
        .filter(
            Character.name.ilike(f"%{query}%") |
            Character.nickname.ilike(f"%{query}%") |
            Character.summary.ilike(f"%{query}%")
        )\
        .offset(skip)\
        .limit(limit)\
        .all() 