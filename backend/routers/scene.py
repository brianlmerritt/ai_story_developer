from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database.database import get_db
import crud.scene as scene_crud
from schemas.scene import Scene, SceneCreate, SceneUpdate
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/scenes",
    tags=["scenes"]
)

@router.post("/", response_model=Scene)
def create_scene(scene: SceneCreate, db: Session = Depends(get_db)):
    return scene_crud.create_scene(db=db, scene=scene)

@router.get("/", response_model=List[Scene])
def read_scenes(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if search:
        scenes = scene_crud.search_scenes(db, search, skip=skip, limit=limit)
    else:
        scenes = scene_crud.get_scenes(db, skip=skip, limit=limit)
    return scenes

@router.get("/chapter/{chapter_id}", response_model=List[Scene])
def read_scenes_by_chapter(
    chapter_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    scenes = scene_crud.get_scenes_by_chapter(
        db, chapter_id=chapter_id, skip=skip, limit=limit
    )
    return scenes

@router.get("/character/{character_id}", response_model=List[Scene])
def read_scenes_by_character(
    character_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    scenes = scene_crud.get_scenes_by_character(
        db, character_id=character_id, skip=skip, limit=limit
    )
    return scenes

@router.get("/location/{location_id}", response_model=List[Scene])
def read_scenes_by_location(
    location_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    scenes = scene_crud.get_scenes_by_location(
        db, location_id=location_id, skip=skip, limit=limit
    )
    return scenes

@router.get("/{scene_id}", response_model=Scene)
def read_scene(scene_id: int, db: Session = Depends(get_db)):
    logger.info("*" * 50)
    logger.info(f"GET REQUEST for scene {scene_id}")
    logger.info("*" * 50)
    db_scene = scene_crud.get_scene(db, scene_id=scene_id)
    if db_scene is None:
        raise HTTPException(status_code=404, detail="Scene not found")
    logger.info(f"Returning scene data: {db_scene.__dict__}")
    return db_scene

@router.put("/{scene_id}", response_model=Scene)
def update_scene(
    scene_id: int, 
    scene: SceneUpdate, 
    db: Session = Depends(get_db)
):
    logger.info("*" * 50)
    logger.info(f"PUT REQUEST for scene {scene_id}")
    logger.info(f"Update data: {scene.model_dump()}")
    logger.info("*" * 50)
    db_scene = scene_crud.update_scene(
        db, scene_id=scene_id, scene=scene
    )
    if db_scene is None:
        raise HTTPException(status_code=404, detail="Scene not found")
    return db_scene

@router.delete("/{scene_id}")
def delete_scene(scene_id: int, db: Session = Depends(get_db)):
    success = scene_crud.delete_scene(db, scene_id=scene_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scene not found")
    return {"message": "Scene deleted successfully"} 