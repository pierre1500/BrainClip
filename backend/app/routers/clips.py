"""
BrainClip Backend - Clips Router
Handles web clip submission and note generation
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional
import logging

from app.services.openai_service import generate_note_content
from app.services.note_service import save_note

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


class ClipRequest(BaseModel):
    """Request model for clipping a web page"""
    url: str
    title: str
    content: str
    excerpt: Optional[str] = ""
    byline: Optional[str] = ""
    siteName: Optional[str] = ""
    length: Optional[int] = 0


class ClipResponse(BaseModel):
    """Response model for successful clip"""
    success: bool
    message: str
    path: str
    title: str


@router.post("/clip", response_model=ClipResponse)
async def clip_page(request: ClipRequest):
    """
    Clip a web page and generate an Obsidian note
    
    1. Receives page content from Chrome extension
    2. Sends content to GPT-4o for summarization
    3. Saves generated note to Obsidian vault
    """
    try:
        logger.info(f"Clipping page: {request.url}")
        
        # Validate content
        if not request.content or len(request.content.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Page content is too short or empty"
            )
        
        # Generate note content using GPT-4o
        note_data = await generate_note_content(
            url=request.url,
            title=request.title,
            content=request.content,
            excerpt=request.excerpt,
            byline=request.byline
        )
        
        # Save note to vault
        note_path = await save_note(
            url=request.url,
            note_data=note_data
        )
        
        logger.info(f"Note saved: {note_path}")
        
        return ClipResponse(
            success=True,
            message="Note created successfully",
            path=note_path,
            title=note_data.get("title", request.title)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error clipping page: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create note: {str(e)}"
        )
