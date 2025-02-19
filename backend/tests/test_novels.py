import pytest
from fastapi.testclient import TestClient

def test_create_novel(client: TestClient):
    # Test creating a novel
    novel_data = {
        "name": "Test Novel",
        "summary": "Test Summary",
        "description": "Test Description",
        "status": "draft"
    }
    
    response = client.post("/api/novels/", json=novel_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == novel_data["name"]
    assert data["summary"] == novel_data["summary"]
    assert data["description"] == novel_data["description"]
    assert data["status"] == novel_data["status"]
    assert "id" in data

def test_create_novel_minimal(client: TestClient):
    # Test creating a novel with only required fields
    novel_data = {
        "name": "Minimal Novel"
    }
    
    response = client.post("/api/novels/", json=novel_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == novel_data["name"]
    assert data["summary"] is None
    assert data["description"] is None
    assert data["status"] is None

def test_get_novel(client: TestClient):
    # Create a novel first
    novel_data = {"name": "Test Novel"}
    response = client.post("/api/novels/", json=novel_data)
    created_novel = response.json()
    
    # Test getting the novel
    response = client.get(f"/api/novels/{int(created_novel['id'])}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == novel_data["name"]
    assert data["id"] == created_novel["id"]

def test_get_nonexistent_novel(client: TestClient):
    response = client.get("/api/novels/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Novel not found"

def test_get_all_novels(client: TestClient):
    # Create multiple novels
    novels = [
        {"name": "Novel 1"},
        {"name": "Novel 2"},
        {"name": "Novel 3"}
    ]
    
    for novel in novels:
        client.post("/api/novels/", json=novel)
    
    # Test getting all novels
    response = client.get("/api/novels/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(novels)
    assert all(novel["name"] in [n["name"] for n in novels] for novel in data)

def test_update_novel(client: TestClient):
    # Create a novel first
    novel_data = {"name": "Original Name"}
    response = client.post("/api/novels/", json=novel_data)
    created_novel = response.json()
    
    # Test updating the novel - convert id to int
    update_data = {
        "name": "Updated Name",
        "summary": "New Summary",
        "status": "published"
    }
    response = client.put(f"/api/novels/{int(created_novel['id'])}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["summary"] == update_data["summary"]
    assert data["status"] == update_data["status"]

def test_update_nonexistent_novel(client: TestClient):
    update_data = {"name": "Updated Name"}
    response = client.put("/api/novels/999", json=update_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "Novel not found"

def test_delete_novel(client: TestClient):
    # Create a novel first
    novel_data = {"name": "To Be Deleted"}
    response = client.post("/api/novels/", json=novel_data)
    created_novel = response.json()
    
    # Test deleting the novel - convert id to int
    response = client.delete(f"/api/novels/{int(created_novel['id'])}")
    assert response.status_code == 200
    assert response.json()["message"] == "Novel deleted successfully"
    
    # Verify novel is deleted - convert id to int
    response = client.get(f"/api/novels/{int(created_novel['id'])}")
    assert response.status_code == 404

def test_delete_nonexistent_novel(client: TestClient):
    response = client.delete("/api/novels/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Novel not found"

def test_create_novel_invalid_data(client: TestClient):
    # Test creating a novel with invalid data (missing required field)
    novel_data = {
        "summary": "Test Summary",
        "description": "Test Description"
    }
    
    response = client.post("/api/novels/", json=novel_data)
    assert response.status_code == 422  # Validation error

def test_partial_update_novel(client: TestClient):
    # Create a novel first
    novel_data = {
        "name": "Original Name",
        "summary": "Original Summary",
        "status": "draft"
    }
    response = client.post("/api/novels/", json=novel_data)
    created_novel = response.json()
    
    # Test partial update (only update name)
    update_data = {"name": "Updated Name"}
    response = client.put(f"/api/novels/{created_novel['id']}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["summary"] == novel_data["summary"]  # Should remain unchanged
    assert data["status"] == novel_data["status"]    # Should remain unchanged 