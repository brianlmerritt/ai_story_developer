from pydantic import BaseModel
from typing import Optional, Dict

class MemoryBase(BaseModel):
    chapter_id: int
    scene_id: Optional[int] = None
    characters: Optional[Dict[str, int]] = None  # Dictionary of nickname:character_id
    locations: Optional[Dict[str, int]] = None   # Dictionary of name:location_id
    discoveries: Optional[Dict[str, int]] = None # Dictionary of name:discovery_id

class MemoryCreate(MemoryBase):
    pass

class MemoryUpdate(BaseModel):
    chapter_id: Optional[int] = None
    scene_id: Optional[int] = None
    characters: Optional[Dict[str, int]] = None
    locations: Optional[Dict[str, int]] = None
    discoveries: Optional[Dict[str, int]] = None

class Memory(MemoryBase):
    id: int

    class Config:
        from_attributes = True 