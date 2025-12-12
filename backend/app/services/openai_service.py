"""
BrainClip Backend - OpenAI Service
Handles communication with GPT-4o for note generation
"""

from openai import AsyncOpenAI
from typing import Optional
import json
import logging

from app.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.openai_api_key)

# System prompt for note generation
SYSTEM_PROMPT = """You are an expert research assistant that creates well-structured Obsidian notes from web content.

Your task is to analyze the provided web page content and create a comprehensive note for a personal knowledge base.

You MUST respond with a valid JSON object containing:
{
  "title": "A clear, concise title for the note",
  "summary": "A 2-3 sentence summary of the key points",
  "tags": ["tag1", "tag2", "tag3"],
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "content": "The main markdown content of the note with proper formatting, headers, bullet points, and highlights"
}

Guidelines:
- Extract the most important information
- Use clear, professional language
- Create meaningful tags (3-7 tags)
- Identify 3-5 key takeaways
- Format the content with proper Markdown (headers, lists, bold, links)
- Include relevant quotes if present
- Keep the note focused and actionable
- Add a "Related Topics" section if applicable"""


async def generate_note_content(
    url: str,
    title: str,
    content: str,
    excerpt: Optional[str] = "",
    byline: Optional[str] = ""
) -> dict:
    """
    Generate structured note content using GPT-4o
    
    Args:
        url: Source URL of the page
        title: Page title
        content: Extracted page content
        excerpt: Page excerpt/description
        byline: Author information
        
    Returns:
        Dictionary containing structured note data
    """
    # Prepare the user message
    user_message = f"""Please create an Obsidian note from this web page:

**URL:** {url}
**Title:** {title}
**Author:** {byline or 'Unknown'}
**Excerpt:** {excerpt or 'N/A'}

**Content:**
{content[:8000]}  # Limit content to avoid token limits
"""

    try:
        logger.info(f"Generating note for: {title}")
        
        response = await client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            max_tokens=settings.openai_max_tokens,
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        response_text = response.choices[0].message.content
        note_data = json.loads(response_text)
        
        # Validate required fields
        required_fields = ["title", "summary", "tags", "content"]
        for field in required_fields:
            if field not in note_data:
                raise ValueError(f"Missing required field: {field}")
        
        logger.info(f"Note generated successfully: {note_data['title']}")
        return note_data
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse GPT response: {e}")
        # Return a basic structure if parsing fails
        return {
            "title": title,
            "summary": excerpt or "No summary available",
            "tags": ["web-clip", "unprocessed"],
            "key_points": [],
            "content": f"# {title}\n\n{content[:2000]}"
        }
    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        raise
