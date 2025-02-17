from pydantic import BaseModel
from typing import Optional

class NovelBase(BaseModel):
    name: str
    summary: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class NovelCreate(NovelBase):
    pass

class NovelUpdate(NovelBase):
    name: Optional[str] = None

class Novel(NovelBase):
    id: int

    class Config:
        from_attributes = True 