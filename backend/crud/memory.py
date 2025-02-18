from sqlalchemy.orm import Session
from database.models import Memory
from schemas.memory import MemoryCreate, MemoryUpdate

def get_memory(db: Session, memory_id: int):
    return db.query(Memory).filter(Memory.id == memory_id).first()

def get_memories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Memory).offset(skip).limit(limit).all()

def get_memories_by_chapter(db: Session, chapter_id: int, skip: int = 0, limit: int = 100):
    return db.query(Memory)\
        .filter(Memory.chapter_id == chapter_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_memories_by_scene(db: Session, scene_id: int, skip: int = 0, limit: int = 100):
    return db.query(Memory)\
        .filter(Memory.scene_id == scene_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_memories_by_character(db: Session, character_id: int, skip: int = 0, limit: int = 100):
    return db.query(Memory)\
        .filter(Memory.characters.cast(str).contains(str(character_id)))\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_memories_by_location(db: Session, location_id: int, skip: int = 0, limit: int = 100):
    return db.query(Memory)\
        .filter(Memory.locations.cast(str).contains(str(location_id)))\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_memories_by_discovery(db: Session, discovery_id: int, skip: int = 0, limit: int = 100):
    return db.query(Memory)\
        .filter(Memory.discoveries.cast(str).contains(str(discovery_id)))\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_memory(db: Session, memory: MemoryCreate):
    db_memory = Memory(**memory.model_dump())
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)
    return db_memory

def update_memory(db: Session, memory_id: int, memory: MemoryUpdate):
    db_memory = get_memory(db, memory_id)
    if db_memory:
        update_data = memory.model_dump(exclude_unset=True)
        print("Updating memory with data:", update_data)  # Debug
        for key, value in update_data.items():
            print(f"Setting {key} = {value}")  # Debug
            setattr(db_memory, key, value)
        db.commit()
        db.refresh(db_memory)
        print("Updated memory:", db_memory.__dict__)  # Debug
    return db_memory

def delete_memory(db: Session, memory_id: int):
    db_memory = get_memory(db, memory_id)
    if db_memory:
        db.delete(db_memory)
        db.commit()
        return True
    return False 