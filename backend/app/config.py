import os
from pathlib import Path
from dotenv import load_dotenv

# Path resolution
env_path_root = Path(__file__).resolve().parent.parent.parent / ".env"
env_path_backend = Path(__file__).resolve().parent.parent / ".env"

def reload_env():
    # Always load both root and backend .env files
    if env_path_root.exists():
        load_dotenv(dotenv_path=env_path_root, override=True)
    if env_path_backend.exists():
        load_dotenv(dotenv_path=env_path_backend, override=True)

reload_env()

class Settings:
    PROJECT_NAME: str = "AUREX Enterprise Intelligence Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    
    @property
    def SEEK_AI_URL(self) -> str:
        return os.getenv("SEEK_AI_URL", "https://seekai.cc/v1/messages")

    @property
    def SEEK_AI_KEY(self) -> str:
        reload_env()
        key = os.getenv("NEW_API_KEY", "").strip()
        return key

    @property
    def SEEK_AI_MODEL(self) -> str:
        reload_env()
        return os.getenv("SEEK_AI_MODEL", "claude-opus-5").strip()

settings = Settings()
