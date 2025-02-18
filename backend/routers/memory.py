from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
import crud.memory as memory_crud
from schemas.memory import Memory, MemoryCreate, MemoryUpdate
import logging

router = APIRouter(
    prefix="/memories",
    tags=["memories"]
)

logger = logging.getLogger(__name__)

@router.post("/", response_model=Memory)
def create_memory(memory: MemoryCreate, db: Session = Depends(get_db)):
    return memory_crud.create_memory(db=db, memory=memory)

@router.get("/", response_model=List[Memory])
def read_memories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        memories = memory_crud.get_memories(db, skip=skip, limit=limit)
        return memories
    except Exception as e:
        logger.error(f"Error fetching memories: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while fetching memories: {str(e)}"
        )

@router.get("/chapter/{chapter_id}", response_model=List[Memory])
def read_memories_by_chapter(
    chapter_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    memories = memory_crud.get_memories_by_chapter(
        db, chapter_id=chapter_id, skip=skip, limit=limit
    )
    return memories

@router.get("/scene/{scene_id}", response_model=List[Memory])
def read_memories_by_scene(
    scene_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    memories = memory_crud.get_memories_by_scene(
        db, scene_id=scene_id, skip=skip, limit=limit
    )
    return memories

@router.get("/character/{character_id}", response_model=List[Memory])
def read_memories_by_character(
    character_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    memories = memory_crud.get_memories_by_character(
        db, character_id=character_id, skip=skip, limit=limit
    )
    return memories

@router.get("/location/{location_id}", response_model=List[Memory])
def read_memories_by_location(
    location_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    memories = memory_crud.get_memories_by_location(
        db, location_id=location_id, skip=skip, limit=limit
    )
    return memories

@router.get("/discovery/{discovery_id}", response_model=List[Memory])
def read_memories_by_discovery(
    discovery_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    memories = memory_crud.get_memories_by_discovery(
        db, discovery_id=discovery_id, skip=skip, limit=limit
    )
    return memories

@router.get("/{memory_id}", response_model=Memory)
def read_memory(memory_id: int, db: Session = Depends(get_db)):
    db_memory = memory_crud.get_memory(db, memory_id=memory_id)
    if db_memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")
    return db_memory

@router.put("/{memory_id}", response_model=Memory)
def update_memory(
    memory_id: int, 
    memory: MemoryUpdate, 
    db: Session = Depends(get_db)
):
    db_memory = memory_crud.update_memory(
        db, memory_id=memory_id, memory=memory
    )
    if db_memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")
    return db_memory

@router.delete("/{memory_id}")
def delete_memory(memory_id: int, db: Session = Depends(get_db)):
    success = memory_crud.delete_memory(db, memory_id=memory_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"message": "Memory deleted successfully"} 