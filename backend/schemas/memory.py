from pydantic import BaseModel
from typing import Optional, Dict

class MemoryBase(BaseModel):
    title: str
    summary: Optional[str] = None
    description: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    characters: Optional[Dict[str, int]] = None
    locations: Optional[Dict[str, int]] = None
    status: Optional[str] = None

class MemoryCreate(MemoryBase):
    pass

class MemoryUpdate(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    characters: Optional[Dict[str, int]] = None
    locations: Optional[Dict[str, int]] = None
    status: Optional[str] = None

class Memory(MemoryBase):
    id: int

    class Config:
        from_attributes = True 