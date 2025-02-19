def test_create_location(client: TestClient):
    location_data = {
        "name": "Crystal Cave",
        "summary": "A mysterious cave system",
        "description": "A vast network of crystalline caves with glowing minerals",
        "key_details_and_quirks": "Contains rare magical crystals that hum at night",
        "status": "draft"
    }
    
    print("\nSending location data:", location_data)
    print("\nLocation schema:", LocationCreate.model_json_schema())
    
    response = client.post("/api/locations/", json=location_data)
    print("\nResponse status:", response.status_code)
    print("Response headers:", response.headers)
    print("Response body:", response.text)
    
    # Debug the actual request
    print("\nRequest URL:", response.request.url)
    print("Request method:", response.request.method)
    print("Request headers:", response.request.headers)
    print("Request body:", response.request.content)
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == location_data["name"]
    assert data["summary"] == location_data["summary"]
    assert "id" in data 