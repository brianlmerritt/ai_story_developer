from sqlalchemy.orm import Session
from database.models import Location
from schemas.location import LocationCreate, LocationUpdate

def get_location(db: Session, location_id: int):
    return db.query(Location).filter(Location.id == location_id).first()

def get_locations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Location).offset(skip).limit(limit).all()

def get_location_by_name(db: Session, name: str):
    return db.query(Location).filter(Location.name == name).first()

def create_location(db: Session, location: LocationCreate):
    db_location = Location(**location.model_dump())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

def update_location(db: Session, location_id: int, location: LocationUpdate):
    db_location = get_location(db, location_id)
    if db_location:
        update_data = location.model_dump(exclude_unset=True)
        print("Updating location with data:", update_data)  # Debug
        for key, value in update_data.items():
            print(f"Setting {key} = {value}")  # Debug
            setattr(db_location, key, value)
        db.commit()
        db.refresh(db_location)
        print("Updated location:", db_location.__dict__)  # Debug
    return db_location

def delete_location(db: Session, location_id: int):
    db_location = get_location(db, location_id)
    if db_location:
        db.delete(db_location)
        db.commit()
        return True
    return False

def search_locations(db: Session, query: str, skip: int = 0, limit: int = 100):
    return db.query(Location)\
        .filter(
            Location.name.ilike(f"%{query}%") |
            Location.summary.ilike(f"%{query}%") |
            Location.description.ilike(f"%{query}%")
        )\
        .offset(skip)\
        .limit(limit)\
        .all() 