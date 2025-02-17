import pytest
from fastapi.testclient import TestClient

def test_create_character(client: TestClient):
    character_data = {
        "name": "John Doe",
        "nickname": "Johnny",
        "summary": "A mysterious character",
        "personality": "Introverted but kind",
        "description": "Tall with dark hair",
        "dialogue_style": "Speaks slowly and thoughtfully",
        "key_details_and_quirks": "Always carries a pocket watch"
    }
    
    response = client.post("/characters/", json=character_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == character_data["name"]
    assert data["nickname"] == character_data["nickname"]
    assert "id" in data

def test_create_duplicate_character(client: TestClient):
    character_data = {
        "name": "Duplicate Character",
    }
    
    # Create first character
    response = client.post("/characters/", json=character_data)
    assert response.status_code == 200
    
    # Try to create duplicate
    response = client.post("/characters/", json=character_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Character name already registered"

def test_get_character(client: TestClient):
    # Create a character first
    character_data = {"name": "Test Character"}
    response = client.post("/characters/", json=character_data)
    created_character = response.json()
    
    # Test getting the character
    response = client.get(f"/characters/{created_character['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == character_data["name"]
    assert data["id"] == created_character["id"]

def test_search_characters(client: TestClient):
    # Create multiple characters
    characters = [
        {"name": "Alice Smith", "nickname": "Ali"},
        {"name": "Bob Jones", "nickname": "Bobby"},
        {"name": "Charlie Brown", "nickname": "Chuck"}
    ]
    
    for character in characters:
        client.post("/characters/", json=character)
    
    # Test search by name
    response = client.get("/characters/?search=Alice")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Alice Smith"
    
    # Test search by nickname
    response = client.get("/characters/?search=Bobby")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["nickname"] == "Bobby"

def test_update_character(client: TestClient):
    # Create a character first
    character_data = {
        "name": "Original Name",
        "nickname": "Original Nickname"
    }
    response = client.post("/characters/", json=character_data)
    created_character = response.json()
    
    # Test updating the character
    update_data = {
        "name": "Updated Name",
        "nickname": "Updated Nickname",
        "personality": "New personality trait"
    }
    response = client.put(
        f"/characters/{created_character['id']}", 
        json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["nickname"] == update_data["nickname"]
    assert data["personality"] == update_data["personality"]

def test_delete_character(client: TestClient):
    # Create a character first
    character_data = {"name": "To Be Deleted"}
    response = client.post("/characters/", json=character_data)
    created_character = response.json()
    
    # Delete the character
    response = client.delete(f"/characters/{created_character['id']}")
    assert response.status_code == 200
    
    # Verify character is deleted
    response = client.get(f"/characters/{created_character['id']}")
    assert response.status_code == 404 