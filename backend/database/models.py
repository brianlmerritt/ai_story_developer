from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Novel(Base):
    __tablename__ = "novels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    summary = Column(Text)
    description = Column(Text)
    status = Column(String)

    chapters = relationship("Chapter", back_populates="novel")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text)
    sequence = Column(String)
    description = Column(Text)
    novel_id = Column(Integer, ForeignKey("novels.id"))
    status = Column(String)

    novel = relationship("Novel", back_populates="chapters")
    scenes = relationship("Scene", back_populates="chapter")
    memories = relationship("Memory", back_populates="chapter")

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    nickname = Column(String)
    summary = Column(Text)
    personality = Column(Text)
    description = Column(Text)
    dialogue_style = Column(Text)
    key_details_and_quirks = Column(Text)
    status = Column(String, default='draft')

class Discovery(Base):
    __tablename__ = "discoveries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    summary = Column(Text)
    description = Column(Text)
    key_details_and_quirks = Column(Text)
    foreshadow_chapter_id = Column(Integer, ForeignKey("chapters.id"))
    reveal_chapter_id = Column(Integer, ForeignKey("chapters.id"))
    characters = Column(JSON)  # Dictionary of nickname:character_id
    locations = Column(JSON)   # Dictionary of name:location_id

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    summary = Column(Text)
    description = Column(Text)
    key_details_and_quirks = Column(Text)

class Scene(Base):
    __tablename__ = "scenes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    summary = Column(Text)
    description = Column(Text)
    content = Column(Text)
    sequence = Column(String)
    key_details_and_quirks = Column(Text)
    scene_beats = Column(Text)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    characters = Column(JSON)  # Dictionary of nickname:character_id
    locations = Column(JSON)   # Dictionary of name:location_id
    discoveries = Column(JSON) # Dictionary of name:discovery_id
    memories = Column(JSON)    # Dictionary of title:memory_id
    status = Column(String, server_default='draft')

    chapter = relationship("Chapter", back_populates="scenes")
    scene_memories = relationship("Memory", back_populates="scene")

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

    chapter = relationship("Chapter", back_populates="memories")
    scene = relationship("Scene", back_populates="scene_memories") 