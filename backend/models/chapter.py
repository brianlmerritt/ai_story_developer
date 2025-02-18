from sqlalchemy import Column, Integer, String, ForeignKey
from database.database import Base

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)  # Make sure this exists
    summary = Column(String, nullable=True)
    sequence = Column(String, nullable=True)
    description = Column(String, nullable=True)
    novel_id = Column(Integer, ForeignKey("novels.id"))
    status = Column(String, nullable=True) 