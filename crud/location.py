from database.models import Location

def create_location(db: Session, location: LocationCreate):
    print("\nLocation data before model_dump:", location)
    dumped_data = location.model_dump()
    print("Dumped data:", dumped_data)
    
    # Debug which Location model we're using
    from database.models import Location as DBLocation
    from models.location import Location as ModelLocation
    
    print("\nDB Location model:")
    print("Module:", DBLocation.__module__)
    print("Fields:", DBLocation.__table__.columns.keys())
    
    print("\nModel Location:")
    print("Module:", ModelLocation.__module__)
    print("Fields:", ModelLocation.__table__.columns.keys())
    
    db_location = Location(**dumped_data)
    print("Created db_location:", db_location.__dict__)
    
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location 