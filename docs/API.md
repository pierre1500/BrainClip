# API Reference

This document describes the BrainClip backend API endpoints.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication. It's designed to run locally.

> ⚠️ **Security Note**: If deploying publicly, add authentication!

---

## Endpoints

### Health Check

Check if the API is running.

```http
GET /health
```

**Response**

```json
{
  "status": "healthy"
}
```

---

### Root

Get API information.

```http
GET /
```

**Response**

```json
{
  "status": "ok",
  "message": "BrainClip API is running",
  "version": "1.0.0"
}
```

---

### Clip Page

Submit a web page to be clipped and saved as an Obsidian note.

```http
POST /api/clip
```

**Request Headers**

```
Content-Type: application/json
```

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Source URL of the page |
| `title` | string | Yes | Page title |
| `content` | string | Yes | Extracted text content |
| `excerpt` | string | No | Page excerpt/description |
| `byline` | string | No | Author name |
| `siteName` | string | No | Website name |
| `length` | number | No | Content length |

**Example Request**

```json
{
  "url": "https://example.com/article",
  "title": "Understanding AI in 2025",
  "content": "Artificial intelligence has evolved significantly...",
  "excerpt": "A comprehensive guide to modern AI",
  "byline": "John Doe",
  "siteName": "Example Blog",
  "length": 5000
}
```

**Success Response**

```json
{
  "success": true,
  "message": "Note created successfully",
  "path": "example.com/2025-12-11-understanding-ai-in-2025.md",
  "title": "Understanding AI in 2025"
}
```

**Error Responses**

| Status | Description |
|--------|-------------|
| 400 | Bad Request — Content too short or missing |
| 500 | Internal Server Error — Failed to process |

```json
{
  "detail": "Page content is too short or empty"
}
```

---

## Interactive Documentation

When the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive documentation where you can test endpoints directly.

---

## Code Examples

### Python

```python
import httpx

async def clip_page(url: str, title: str, content: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/clip",
            json={
                "url": url,
                "title": title,
                "content": content
            }
        )
        return response.json()
```

### JavaScript

```javascript
async function clipPage(url, title, content) {
  const response = await fetch('http://localhost:8000/api/clip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, title, content }),
  });
  
  return await response.json();
}
```

### cURL

```bash
curl -X POST http://localhost:8000/api/clip \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/article",
    "title": "Test Article",
    "content": "This is the article content..."
  }'
```

---

## Rate Limits

The API itself has no rate limits, but OpenAI API usage is subject to their [rate limits](https://platform.openai.com/docs/guides/rate-limits).

---

## Error Handling

All errors follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

Common error scenarios:

| Error | Cause | Solution |
|-------|-------|----------|
| "Page content is too short" | Content < 50 characters | Extract more content |
| "Failed to create note" | OpenAI API error | Check API key and credits |
| "Connection refused" | Backend not running | Start Docker container |

---

## Security Notes

- This API is designed for **local use only**
- Never expose port 8000 to the public internet without authentication
- Notes are saved to `vault/` which is git-ignored by default