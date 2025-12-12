"""
BrainClip Backend - Tests
"""

import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock

from app.main import app


@pytest.fixture
def anyio_backend():
    return 'asyncio'


@pytest.mark.anyio
async def test_root():
    """Test root endpoint returns API info"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "BrainClip" in data["message"]


@pytest.mark.anyio
async def test_health_check():
    """Test health check endpoint"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.anyio
async def test_clip_missing_content():
    """Test clip endpoint rejects empty content"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/clip",
            json={
                "url": "https://example.com",
                "title": "Test",
                "content": ""
            }
        )
    
    assert response.status_code == 400


@pytest.mark.anyio
async def test_clip_short_content():
    """Test clip endpoint rejects very short content"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/clip",
            json={
                "url": "https://example.com",
                "title": "Test",
                "content": "Too short"
            }
        )
    
    assert response.status_code == 400
