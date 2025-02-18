from pydantic import BaseModel
from typing import Optional, Dict

class DiscoveryBase(BaseModel):
    name: str
    summary: Optional[str] = None
    description: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    foreshadow_chapter_id: Optional[int] = None
    reveal_chapter_id: Optional[int] = None
    characters: Optional[Dict[str, int]] = None  # Dictionary of nickname:character_id
    locations: Optional[Dict[str, int]] = None   # Dictionary of name:location_id
    status: Optional[str] = None

class DiscoveryCreate(DiscoveryBase):
    pass

class DiscoveryUpdate(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    foreshadow_chapter_id: Optional[int] = None
    reveal_chapter_id: Optional[int] = None
    characters: Optional[Dict[str, int]] = None
    locations: Optional[Dict[str, int]] = None
    status: Optional[str] = None

class Discovery(DiscoveryBase):
    id: int

    class Config:
        from_attributes = True 