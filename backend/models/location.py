class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    summary = Column(Text)
    description = Column(Text)
    key_details_and_quirks = Column(Text)
    status = Column(String, server_default='draft')  # Make sure this exists 