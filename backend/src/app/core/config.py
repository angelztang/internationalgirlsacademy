from typing import List


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
    # DATABASE_URL: str = "postgresql://user:password@localhost/dbname"


settings = Settings()
