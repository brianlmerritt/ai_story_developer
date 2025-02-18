from sqlalchemy.orm import Session
from database.models import Scene
from schemas.scene import SceneCreate, SceneUpdate
import logging

logger = logging.getLogger(__name__)

def get_scene(db: Session, scene_id: int):
    return db.query(Scene).filter(Scene.id == scene_id).first()

def get_scenes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Scene).offset(skip).limit(limit).all()

def get_scenes_by_chapter(db: Session, chapter_id: int, skip: int = 0, limit: int = 100):
    return db.query(Scene)\
        .filter(Scene.chapter_id == chapter_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_scenes_by_character(db: Session, character_id: int, skip: int = 0, limit: int = 100):
    return db.query(Scene)\
        .filter(Scene.characters.cast(str).contains(str(character_id)))\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_scenes_by_location(db: Session, location_id: int, skip: int = 0, limit: int = 100):
    return db.query(Scene)\
        .filter(Scene.locations.cast(str).contains(str(location_id)))\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_scene(db: Session, scene: SceneCreate):
    db_scene = Scene(**scene.model_dump())
    db.add(db_scene)
    db.commit()
    db.refresh(db_scene)
    return db_scene

def update_scene(db: Session, scene_id: int, scene: SceneUpdate):
    db_scene = get_scene(db, scene_id)
    if db_scene:
        update_data = scene.model_dump(exclude_unset=True)
        logger.info("=== SCENE UPDATE DEBUG ===")
        logger.info(f"Scene ID: {scene_id}")
        logger.info(f"Update data received: {update_data}")
        logger.info("Current scene data:")
        logger.info({
            'characters': db_scene.characters,
            'locations': db_scene.locations,
            'discoveries': db_scene.discoveries,
            'memories': db_scene.memories
        })
        
        for key, value in update_data.items():
            logger.info(f"Setting {key} = {value}")
            setattr(db_scene, key, value)
        
        db.commit()
        db.refresh(db_scene)
        
        logger.info("Updated scene data:")
        logger.info({
            'characters': db_scene.characters,
            'locations': db_scene.locations,
            'discoveries': db_scene.discoveries,
            'memories': db_scene.memories
        })
        logger.info("=== END SCENE UPDATE DEBUG ===")
    return db_scene

def delete_scene(db: Session, scene_id: int):
    db_scene = get_scene(db, scene_id)
    if db_scene:
        db.delete(db_scene)
        db.commit()
        return True
    return False

def search_scenes(db: Session, query: str, skip: int = 0, limit: int = 100):
    return db.query(Scene)\
        .filter(
            Scene.name.ilike(f"%{query}%") |
            Scene.summary.ilike(f"%{query}%") |
            Scene.description.ilike(f"%{query}%") |
            Scene.scene_beats.ilike(f"%{query}%")
        )\
        .offset(skip)\
        .limit(limit)\
        .all() 