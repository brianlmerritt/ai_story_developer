from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database.database import Base

class Discovery(Base):
    __tablename__ = "discoveries"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    summary = Column(Text)
    description = Column(Text)
    key_details_and_quirks = Column(Text)
    foreshadow_chapter_id = Column(Integer, ForeignKey("chapters.id"))
    reveal_chapter_id = Column(Integer, ForeignKey("chapters.id"))
    characters = Column(JSON)
    locations = Column(JSON)
    status = Column(String, server_default='draft') 