class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    summary = Column(Text)
    description = Column(Text)
    key_details_and_quirks = Column(Text)
    status = Column(String, server_default='draft') 