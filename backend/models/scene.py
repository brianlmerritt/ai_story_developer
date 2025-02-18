from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from database.database import Base

class Scene(Base):
    __tablename__ = "scenes"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    summary = Column(Text)
    description = Column(Text)
    key_details_and_quirks = Column(Text)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    characters = Column(JSON)
    locations = Column(JSON)
    status = Column(String, server_default='draft') 