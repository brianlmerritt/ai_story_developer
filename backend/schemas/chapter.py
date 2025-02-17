from pydantic import BaseModel
from typing import Optional

class ChapterBase(BaseModel):
    name: str
    summary: Optional[str] = None
    description: Optional[str] = None
    novel_id: int
    status: Optional[str] = None

class ChapterCreate(ChapterBase):
    pass

class ChapterUpdate(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class Chapter(ChapterBase):
    id: int

    class Config:
        from_attributes = True 