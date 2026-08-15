from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.models.schemas import AidenChatRequest, AidenChatResponse
from app.services.aiden_engine import AidenEngine
from app.services.seek_ai import SeekAIService

router = APIRouter(prefix="/aiden", tags=["Aiden Retail AI"])


class TestConnectionRequest(BaseModel):
    provider: str = "cloud"
    api_key: Optional[str] = ""
    url: Optional[str] = ""
    model: Optional[str] = ""


@router.post("/chat", response_model=AidenChatResponse)
def aiden_chat(request: AidenChatRequest):
    """
    Grounded retail AI conversational endpoint with cryptographic SHA-256 data lineage.
    """
    return AidenEngine.process_chat(request)


@router.post("/test-connection")
def test_ai_connection(request: TestConnectionRequest) -> Dict[str, Any]:
    """
    Live diagnostic check for AI provider connectivity (Groq, OpenAI, Anthropic, Gemini, LM Studio, Ollama).
    """
    return SeekAIService.test_ai_connection(
        provider=request.provider,
        api_key=request.api_key or "",
        url=request.url or "",
        model=request.model or ""
    )
