import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def test_novel(client: TestClient):
    novel_data = {"name": "Test Novel"}
    response = client.post("/novels/", json=novel_data)
    return response.json()

def test_create_chapter(client: TestClient, test_novel):
    chapter_data = {
        "name": "Test Chapter",
        "summary": "Test Summary",
        "description": "Test Description",
        "novel_id": test_novel["id"],
        "status": "draft"
    }
    
    response = client.post("/chapters/", json=chapter_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == chapter_data["name"]
    assert data["novel_id"] == chapter_data["novel_id"]
    assert "id" in data

def test_get_chapters_by_novel(client: TestClient, test_novel):
    # Create multiple chapters
    chapters = [
        {
            "name": f"Chapter {i}",
            "novel_id": test_novel["id"],
            "status": "draft"
        } for i in range(3)
    ]
    
    for chapter in chapters:
        client.post("/chapters/", json=chapter)
    
    response = client.get(f"/chapters/novel/{test_novel['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(chapters)
    assert all(chapter["novel_id"] == test_novel["id"] for chapter in data)

def test_update_chapter(client: TestClient, test_novel):
    # Create a chapter first
    chapter_data = {
        "name": "Original Chapter",
        "novel_id": test_novel["id"]
    }
    response = client.post("/chapters/", json=chapter_data)
    created_chapter = response.json()
    
    # Test updating the chapter
    update_data = {
        "name": "Updated Chapter",
        "status": "completed"
    }
    response = client.put(f"/chapters/{created_chapter['id']}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["status"] == update_data["status"]
    assert data["novel_id"] == chapter_data["novel_id"]

def test_delete_chapter(client: TestClient, test_novel):
    # Create a chapter first
    chapter_data = {
        "name": "To Be Deleted",
        "novel_id": test_novel["id"]
    }
    response = client.post("/chapters/", json=chapter_data)
    created_chapter = response.json()
    
    # Delete the chapter
    response = client.delete(f"/chapters/{created_chapter['id']}")
    assert response.status_code == 200
    
    # Verify chapter is deleted
    response = client.get(f"/chapters/{created_chapter['id']}")
    assert response.status_code == 404 