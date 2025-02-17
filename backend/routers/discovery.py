from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database.database import get_db
import crud.discovery as discovery_crud
from schemas.discovery import Discovery, DiscoveryCreate, DiscoveryUpdate

router = APIRouter(
    prefix="/discoveries",
    tags=["discoveries"]
)

@router.post("/", response_model=Discovery)
def create_discovery(discovery: DiscoveryCreate, db: Session = Depends(get_db)):
    db_discovery = discovery_crud.get_discovery_by_name(db, name=discovery.name)
    if db_discovery:
        raise HTTPException(status_code=400, detail="Discovery name already registered")
    return discovery_crud.create_discovery(db=db, discovery=discovery)

@router.get("/", response_model=List[Discovery])
def read_discoveries(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if search:
        discoveries = discovery_crud.search_discoveries(db, search, skip=skip, limit=limit)
    else:
        discoveries = discovery_crud.get_discoveries(db, skip=skip, limit=limit)
    return discoveries

@router.get("/chapter/{chapter_id}", response_model=List[Discovery])
def read_discoveries_by_chapter(
    chapter_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    discoveries = discovery_crud.get_discoveries_by_chapter(
        db, chapter_id=chapter_id, skip=skip, limit=limit
    )
    return discoveries

@router.get("/{discovery_id}", response_model=Discovery)
def read_discovery(discovery_id: int, db: Session = Depends(get_db)):
    db_discovery = discovery_crud.get_discovery(db, discovery_id=discovery_id)
    if db_discovery is None:
        raise HTTPException(status_code=404, detail="Discovery not found")
    return db_discovery

@router.put("/{discovery_id}", response_model=Discovery)
def update_discovery(
    discovery_id: int, 
    discovery: DiscoveryUpdate, 
    db: Session = Depends(get_db)
):
    db_discovery = discovery_crud.update_discovery(
        db, discovery_id=discovery_id, discovery=discovery
    )
    if db_discovery is None:
        raise HTTPException(status_code=404, detail="Discovery not found")
    return db_discovery

@router.delete("/{discovery_id}")
def delete_discovery(discovery_id: int, db: Session = Depends(get_db)):
    success = discovery_crud.delete_discovery(db, discovery_id=discovery_id)
    if not success:
        raise HTTPException(status_code=404, detail="Discovery not found")
    return {"message": "Discovery deleted successfully"} 