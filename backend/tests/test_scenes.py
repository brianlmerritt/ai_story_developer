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

def test_create_scene(client: TestClient, test_chapter):
    scene_data = {
        "name": "Opening Scene",
        "summary": "The hero enters the tavern",
        "description": "A dimly lit tavern with mysterious patrons",
        "key_details_and_quirks": "Creaky floorboards, flickering candles",
        "scene_beats": "1. Hero enters\n2. Meets mysterious stranger\n3. Receives quest",
        "chapter_id": test_chapter["id"],
        "characters": {"hero": 1, "stranger": 2},
        "locations": {"tavern": 1}
    }
    
    response = client.post("/scenes/", json=scene_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == scene_data["name"]
    assert data["chapter_id"] == scene_data["chapter_id"]
    assert data["characters"] == scene_data["characters"]
    assert data["locations"] == scene_data["locations"]
    assert "id" in data

def test_get_scenes_by_chapter(client: TestClient, test_chapter):
    # Create multiple scenes
    scenes = [
        {
            "name": f"Scene {i}",
            "chapter_id": test_chapter["id"],
            "characters": {"character1": 1}
        } for i in range(3)
    ]
    
    for scene in scenes:
        client.post("/scenes/", json=scene)
    
    response = client.get(f"/scenes/chapter/{test_chapter['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(scenes)
    assert all(scene["chapter_id"] == test_chapter["id"] for scene in data)

def test_update_scene(client: TestClient, test_chapter):
    # Create a scene first
    scene_data = {
        "name": "Original Scene",
        "chapter_id": test_chapter["id"],
        "characters": {"hero": 1}
    }
    response = client.post("/scenes/", json=scene_data)
    created_scene = response.json()
    
    # Test updating the scene
    update_data = {
        "name": "Updated Scene",
        "summary": "New summary",
        "characters": {"hero": 1, "villain": 2}
    }
    response = client.put(
        f"/scenes/{created_scene['id']}", 
        json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["summary"] == update_data["summary"]
    assert data["characters"] == update_data["characters"]
    assert data["chapter_id"] == scene_data["chapter_id"]

def test_search_scenes(client: TestClient, test_chapter):
    # Create scenes with searchable content
    scenes = [
        {
            "name": "Tavern Fight",
            "summary": "An epic battle breaks out",
            "chapter_id": test_chapter["id"]
        },
        {
            "name": "Secret Meeting",
            "description": "Conspirators gather in shadows",
            "chapter_id": test_chapter["id"]
        },
        {
            "name": "Chase Scene",
            "scene_beats": "1. Pursuit begins\n2. Through marketplace\n3. Escape",
            "chapter_id": test_chapter["id"]
        }
    ]
    
    for scene in scenes:
        client.post("/scenes/", json=scene)
    
    # Test search by name
    response = client.get("/scenes/?search=Fight")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Tavern Fight"
    
    # Test search by scene beats
    response = client.get("/scenes/?search=marketplace")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Chase Scene"

def test_delete_scene(client: TestClient, test_chapter):
    # Create a scene first
    scene_data = {
        "name": "To Be Deleted",
        "chapter_id": test_chapter["id"]
    }
    response = client.post("/scenes/", json=scene_data)
    created_scene = response.json()
    
    # Delete the scene
    response = client.delete(f"/scenes/{created_scene['id']}")
    assert response.status_code == 200
    
    # Verify scene is deleted
    response = client.get(f"/scenes/{created_scene['id']}")
    assert response.status_code == 404 