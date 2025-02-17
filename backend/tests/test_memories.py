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

@pytest.fixture
def test_scene(client: TestClient, test_chapter):
    scene_data = {
        "name": "Test Scene",
        "chapter_id": test_chapter["id"]
    }
    response = client.post("/scenes/", json=scene_data)
    return response.json()

def test_create_memory(client: TestClient, test_chapter, test_scene):
    memory_data = {
        "chapter_id": test_chapter["id"],
        "scene_id": test_scene["id"],
        "characters": {"hero": 1, "villain": 2},
        "locations": {"castle": 1},
        "discoveries": {"secret": 1}
    }
    
    response = client.post("/memories/", json=memory_data)
    assert response.status_code == 200
    data = response.json()
    assert data["chapter_id"] == memory_data["chapter_id"]
    assert data["scene_id"] == memory_data["scene_id"]
    assert data["characters"] == memory_data["characters"]
    assert data["locations"] == memory_data["locations"]
    assert data["discoveries"] == memory_data["discoveries"]
    assert "id" in data

def test_get_memories_by_chapter(client: TestClient, test_chapter):
    # Create multiple memories
    memories = [
        {
            "chapter_id": test_chapter["id"],
            "characters": {"character1": 1}
        } for _ in range(3)
    ]
    
    for memory in memories:
        client.post("/memories/", json=memory)
    
    response = client.get(f"/memories/chapter/{test_chapter['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(memories)
    assert all(memory["chapter_id"] == test_chapter["id"] for memory in data)

def test_update_memory(client: TestClient, test_chapter):
    # Create a memory first
    memory_data = {
        "chapter_id": test_chapter["id"],
        "characters": {"hero": 1}
    }
    response = client.post("/memories/", json=memory_data)
    created_memory = response.json()
    
    # Test updating the memory
    update_data = {
        "characters": {"hero": 1, "ally": 3},
        "discoveries": {"clue": 2}
    }
    response = client.put(
        f"/memories/{created_memory['id']}", 
        json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["characters"] == update_data["characters"]
    assert data["discoveries"] == update_data["discoveries"]
    assert data["chapter_id"] == memory_data["chapter_id"]

def test_delete_memory(client: TestClient, test_chapter):
    # Create a memory first
    memory_data = {
        "chapter_id": test_chapter["id"]
    }
    response = client.post("/memories/", json=memory_data)
    created_memory = response.json()
    
    # Delete the memory
    response = client.delete(f"/memories/{created_memory['id']}")
    assert response.status_code == 200
    
    # Verify memory is deleted
    response = client.get(f"/memories/{created_memory['id']}")
    assert response.status_code == 404 