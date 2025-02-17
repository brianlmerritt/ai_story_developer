import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def test_chapter(client: TestClient):
    # Create a novel first
    novel_response = client.post("/novels/", json={"name": "Test Novel"})
    novel = novel_response.json()
    
    # Create a chapter
    chapter_data = {
        "name": "Test Chapter",
        "novel_id": novel["id"]
    }
    response = client.post("/chapters/", json=chapter_data)
    return response.json()

def test_create_discovery(client: TestClient, test_chapter):
    discovery_data = {
        "name": "Hidden Treasure",
        "summary": "A mysterious treasure",
        "description": "Ancient artifacts hidden in a secret location",
        "key_details_and_quirks": "Only visible during full moon",
        "foreshadow_chapter_id": test_chapter["id"],
        "reveal_chapter_id": test_chapter["id"],
        "characters": {"hero": 1},
        "locations": {"cave": 1}
    }
    
    response = client.post("/discoveries/", json=discovery_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == discovery_data["name"]
    assert data["characters"] == discovery_data["characters"]
    assert data["locations"] == discovery_data["locations"]
    assert "id" in data

def test_create_duplicate_discovery(client: TestClient):
    discovery_data = {
        "name": "Duplicate Discovery",
    }
    
    # Create first discovery
    response = client.post("/discoveries/", json=discovery_data)
    assert response.status_code == 200
    
    # Try to create duplicate
    response = client.post("/discoveries/", json=discovery_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Discovery name already registered"

def test_get_discoveries_by_chapter(client: TestClient, test_chapter):
    # Create multiple discoveries
    discoveries = [
        {
            "name": f"Discovery {i}",
            "foreshadow_chapter_id": test_chapter["id"]
        } for i in range(3)
    ]
    
    for discovery in discoveries:
        client.post("/discoveries/", json=discovery)
    
    response = client.get(f"/discoveries/chapter/{test_chapter['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(discoveries)
    assert all(d["foreshadow_chapter_id"] == test_chapter["id"] for d in data)

def test_update_discovery(client: TestClient, test_chapter):
    # Create a discovery first
    discovery_data = {
        "name": "Original Discovery",
        "foreshadow_chapter_id": test_chapter["id"]
    }
    response = client.post("/discoveries/", json=discovery_data)
    created_discovery = response.json()
    
    # Test updating the discovery
    update_data = {
        "name": "Updated Discovery",
        "summary": "Updated summary",
        "characters": {"villain": 2}
    }
    response = client.put(
        f"/discoveries/{created_discovery['id']}", 
        json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["summary"] == update_data["summary"]
    assert data["characters"] == update_data["characters"]
    assert data["foreshadow_chapter_id"] == discovery_data["foreshadow_chapter_id"]

def test_search_discoveries(client: TestClient):
    # Create discoveries with searchable content
    discoveries = [
        {"name": "Ancient Prophecy", "summary": "A foretelling of doom"},
        {"name": "Magic Sword", "description": "A powerful weapon"},
        {"name": "Dark Secret", "summary": "Hidden truth about the kingdom"}
    ]
    
    for discovery in discoveries:
        client.post("/discoveries/", json=discovery)
    
    # Test search by name
    response = client.get("/discoveries/?search=Prophecy")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Ancient Prophecy"
    
    # Test search by description
    response = client.get("/discoveries/?search=weapon")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Magic Sword"

def test_delete_discovery(client: TestClient):
    # Create a discovery first
    discovery_data = {"name": "To Be Deleted"}
    response = client.post("/discoveries/", json=discovery_data)
    created_discovery = response.json()
    
    # Delete the discovery
    response = client.delete(f"/discoveries/{created_discovery['id']}")
    assert response.status_code == 200
    
    # Verify discovery is deleted
    response = client.get(f"/discoveries/{created_discovery['id']}")
    assert response.status_code == 404 