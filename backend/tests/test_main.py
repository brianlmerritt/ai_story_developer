from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Story Development API"}

def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_docs_available(client: TestClient):
    response = client.get("/docs")
    assert response.status_code == 200

def test_openapi_schema(client: TestClient):
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "paths" in schema
    assert "/api/novels/" in schema["paths"]
    assert "/api/novels/{novel_id}" in schema["paths"] 