from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from database.database import Base

class Memory(Base):
    __tablename__ = "memories"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text)
    description = Column(Text)
    key_details_and_quirks = Column(Text)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    scene_id = Column(Integer, ForeignKey("scenes.id"))
    characters = Column(JSON)
    locations = Column(JSON)
    discoveries = Column(JSON)
    status = Column(String, server_default='draft')