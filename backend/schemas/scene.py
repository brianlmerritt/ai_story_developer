from pydantic import BaseModel
from typing import Optional, Dict

class SceneBase(BaseModel):
    name: str
    summary: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    sequence: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    scene_beats: Optional[str] = None
    chapter_id: Optional[int] = None
    characters: Optional[Dict[str, int]] = None
    locations: Optional[Dict[str, int]] = None
    discoveries: Optional[Dict[str, int]] = None
    memories: Optional[Dict[str, int]] = None
    status: Optional[str] = None

class SceneCreate(SceneBase):
    pass

class SceneUpdate(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    sequence: Optional[str] = None
    key_details_and_quirks: Optional[str] = None
    scene_beats: Optional[str] = None
    chapter_id: Optional[int] = None
    characters: Optional[Dict[str, int]] = None
    locations: Optional[Dict[str, int]] = None
    discoveries: Optional[Dict[str, int]] = None
    memories: Optional[Dict[str, int]] = None
    status: Optional[str] = None

class Scene(SceneBase):
    id: int

    class Config:
        from_attributes = True 