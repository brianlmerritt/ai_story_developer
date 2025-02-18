from pydantic import BaseModel
from typing import Optional

class ChapterBase(BaseModel):
    title: str
    summary: Optional[str] = None
    sequence: Optional[str] = None  # Optional ordering (e.g., "1", "2", "2.1", etc.)
    description: Optional[str] = None
    novel_id: int
    status: Optional[str] = None

class ChapterCreate(ChapterBase):
    pass

class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    sequence: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class Chapter(ChapterBase):
    id: int

    class Config:
        from_attributes = True 