from pydantic import BaseModel
from typing import Optional

class CharacterBase(BaseModel):
    name: str
    nickname: Optional[str] = None
    summary: Optional[str] = None
    personality: Optional[str] = None
    description: Optional[str] = None
    dialogue_style: Optional[str] = None
    key_details_and_quirks: Optional[str] = None

class CharacterCreate(CharacterBase):
    pass

class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    nickname: Optional[str] = None
    summary: Optional[str] = None
    personality: Optional[str] = None
    description: Optional[str] = None
    dialogue_style: Optional[str] = None
    key_details_and_quirks: Optional[str] = None

class Character(CharacterBase):
    id: int

    class Config:
        from_attributes = True 