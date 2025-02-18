from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    name: str
    summary: Optional[str] = None
    description: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    status: Optional[str] = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    status: Optional[str] = None

class Location(LocationBase):
    id: int

    class Config:
        from_attributes = True 