from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database.database import get_db
import crud.location as location_crud
from schemas.location import Location, LocationCreate, LocationUpdate

router = APIRouter(
    prefix="/locations",
    tags=["locations"]
)

@router.post("/", response_model=Location)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    db_location = location_crud.get_location_by_name(db, name=location.name)
    if db_location:
        raise HTTPException(status_code=400, detail="Location name already registered")
    return location_crud.create_location(db=db, location=location)

@router.get("/", response_model=List[Location])
def read_locations(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if search:
        locations = location_crud.search_locations(db, search, skip=skip, limit=limit)
    else:
        locations = location_crud.get_locations(db, skip=skip, limit=limit)
    return locations

@router.get("/{location_id}", response_model=Location)
def read_location(location_id: int, db: Session = Depends(get_db)):
    db_location = location_crud.get_location(db, location_id=location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@router.put("/{location_id}", response_model=Location)
def update_location(
    location_id: int, 
    location: LocationUpdate, 
    db: Session = Depends(get_db)
):
    db_location = location_crud.update_location(
        db, location_id=location_id, location=location
    )
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    success = location_crud.delete_location(db, location_id=location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Location not found")
    return {"message": "Location deleted successfully"} 