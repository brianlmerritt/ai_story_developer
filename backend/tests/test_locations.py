import pytest
from fastapi.testclient import TestClient

def test_create_location(client: TestClient):
    location_data = {
        "name": "Crystal Cave",
        "summary": "A mysterious cave system",
        "description": "A vast network of crystalline caves with glowing minerals",
        "key_details_and_quirks": "Contains rare magical crystals that hum at night",
        "status": "draft"
    }
    
    print("\nSending location data:", location_data)
    response = client.post("/api/locations/", json=location_data)
    print("Response status:", response.status_code)
    print("Response body:", response.text)
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == location_data["name"]
    assert data["summary"] == location_data["summary"]
    assert "id" in data

def test_create_duplicate_location(client: TestClient):
    location_data = {
        "name": "Duplicate Location",
        "summary": None,
        "description": None,
        "key_details_and_quirks": None
    }
    
    # Create first location
    response = client.post("/api/locations/", json=location_data)
    assert response.status_code == 200
    
    # Try to create duplicate
    response = client.post("/api/locations/", json=location_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Location name already registered"

def test_get_location(client: TestClient):
    # Create a location first
    location_data = {"name": "Test Location"}
    response = client.post("/api/locations/", json=location_data)
    created_location = response.json()
    
    # Test getting the location
    response = client.get(f"/api/locations/{created_location['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == location_data["name"]
    assert data["id"] == created_location["id"]

def test_search_locations(client: TestClient):
    # Create multiple locations
    locations = [
        {"name": "Mystic Forest", "summary": "A magical woodland"},
        {"name": "Dragon's Peak", "summary": "A mountain summit"},
        {"name": "Sunken City", "summary": "An underwater metropolis"}
    ]
    
    for location in locations:
        client.post("/api/locations/", json=location)
    
    # Test search by name
    response = client.get("/api/locations/?search=Forest")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Mystic Forest"
    
    # Test search by summary
    response = client.get("/api/locations/?search=underwater")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Sunken City"

def test_update_location(client: TestClient):
    # Create a location first
    location_data = {
        "name": "Original Location",
        "summary": "Original summary"
    }
    response = client.post("/api/locations/", json=location_data)
    created_location = response.json()
    
    # Test updating the location
    update_data = {
        "name": "Updated Location",
        "summary": "Updated summary",
        "key_details_and_quirks": "New important details"
    }
    response = client.put(
        f"/api/locations/{created_location['id']}", 
        json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["summary"] == update_data["summary"]
    assert data["key_details_and_quirks"] == update_data["key_details_and_quirks"]

def test_delete_location(client: TestClient):
    # Create a location first
    location_data = {"name": "To Be Deleted"}
    response = client.post("/api/locations/", json=location_data)
    created_location = response.json()
    
    # Delete the location
    response = client.delete(f"/api/locations/{created_location['id']}")
    assert response.status_code == 200
    
    # Verify location is deleted
    response = client.get(f"/api/locations/{created_location['id']}")
    assert response.status_code == 404 