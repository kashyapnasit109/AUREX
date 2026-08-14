import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root or backend folder
env_path_root = Path(__file__).resolve().parent.parent.parent / ".env"
env_path_backend = Path(__file__).resolve().parent.parent / ".env"

if env_path_root.exists():
    load_dotenv(dotenv_path=env_path_root, override=True)
elif env_path_backend.exists():
    load_dotenv(dotenv_path=env_path_backend, override=True)

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
        # Reload dotenv dynamically to capture changes to .env file
        if env_path_root.exists():
            load_dotenv(dotenv_path=env_path_root, override=True)
        elif env_path_backend.exists():
            load_dotenv(dotenv_path=env_path_backend, override=True)
        return os.getenv("NEW_API_KEY", "").strip()

    @property
    def SEEK_AI_MODEL(self) -> str:
        return os.getenv("SEEK_AI_MODEL", "claude-opus-5").strip()

settings = Settings()
