import os

class Settings:
    PROJECT_NAME: str = "AUREX Enterprise Intelligence Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    SEEK_AI_URL: str = "https://seekai.cc/v1/messages"
    SEEK_AI_KEY: str = os.getenv("NEW_API_KEY", "")
    SEEK_AI_MODEL: str = "claude-opus-5"

settings = Settings()
