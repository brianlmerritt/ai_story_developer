from sqlalchemy.orm import Session
from database.models import Discovery
from schemas.discovery import DiscoveryCreate, DiscoveryUpdate

def get_discovery(db: Session, discovery_id: int):
    return db.query(Discovery).filter(Discovery.id == discovery_id).first()

def get_discoveries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Discovery).offset(skip).limit(limit).all()

def get_discovery_by_name(db: Session, name: str):
    return db.query(Discovery).filter(Discovery.name == name).first()

def get_discoveries_by_chapter(db: Session, chapter_id: int, skip: int = 0, limit: int = 100):
    return db.query(Discovery)\
        .filter(
            (Discovery.foreshadow_chapter_id == chapter_id) |
            (Discovery.reveal_chapter_id == chapter_id)
        )\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_discovery(db: Session, discovery: DiscoveryCreate):
    db_discovery = Discovery(**discovery.model_dump())
    db.add(db_discovery)
    db.commit()
    db.refresh(db_discovery)
    return db_discovery

def update_discovery(db: Session, discovery_id: int, discovery: DiscoveryUpdate):
    db_discovery = get_discovery(db, discovery_id)
    if db_discovery:
        update_data = discovery.model_dump(exclude_unset=True)
        print("Updating discovery with data:", update_data)  # Debug
        for key, value in update_data.items():
            print(f"Setting {key} = {value}")  # Debug
            setattr(db_discovery, key, value)
        db.commit()
        db.refresh(db_discovery)
        print("Updated discovery:", db_discovery.__dict__)  # Debug
    return db_discovery

def delete_discovery(db: Session, discovery_id: int):
    db_discovery = get_discovery(db, discovery_id)
    if db_discovery:
        db.delete(db_discovery)
        db.commit()
        return True
    return False

def search_discoveries(db: Session, query: str, skip: int = 0, limit: int = 100):
    return db.query(Discovery)\
        .filter(
            Discovery.name.ilike(f"%{query}%") |
            Discovery.summary.ilike(f"%{query}%") |
            Discovery.description.ilike(f"%{query}%")
        )\
        .offset(skip)\
        .limit(limit)\
        .all() 