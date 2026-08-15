from fastapi import APIRouter
from app.models.schemas import AidenChatRequest, AidenChatResponse
from app.services.aiden_engine import AidenEngine

router = APIRouter(prefix="/aiden", tags=["Aiden Retail AI"])

@router.post("/chat", response_model=AidenChatResponse)
def aiden_chat(request: AidenChatRequest):
    """
    Grounded retail AI conversational endpoint with cryptographic SHA-256 data lineage.
    """
    return AidenEngine.process_chat(request)
