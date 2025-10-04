import os
from typing import List
from pathlib import Path

# Load environment variables from .env file
from dotenv import load_dotenv

# Get the path to the backend directory (where .env should be)
backend_dir = Path(__file__).parent.parent.parent.parent
env_path = backend_dir / ".env"

# Load .env file if it exists
load_dotenv(env_path)


class Settings:
    PROJECT_NAME: str = "Backend API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
    ]

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-in-production-please")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "another-secret-for-jwt")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Third-party API Keys (add as needed)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Email settings (for future use)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")


settings = Settings()
