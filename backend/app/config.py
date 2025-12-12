"""
BrainClip Backend - Configuration Settings
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # OpenAI Configuration
    openai_api_key: str = Field(
        ...,
        description="OpenAI API key for GPT-4o access"
    )
    openai_model: str = Field(
        default="gpt-4o",
        description="OpenAI model to use for note generation"
    )
    openai_max_tokens: int = Field(
        default=2000,
        description="Maximum tokens for GPT response"
    )
    
    # Vault Configuration
    vault_path: str = Field(
        default="/app/vault",
        description="Path to Obsidian vault directory"
    )
    
    # Application Configuration
    debug: bool = Field(
        default=False,
        description="Enable debug mode"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Create global settings instance
settings = Settings()
