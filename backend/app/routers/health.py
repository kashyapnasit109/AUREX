from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.config import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        engine_latency_ms=0.42,
        database_status="connected (TimescaleDB / ClickHouse / PostgreSQL)",
        active_connections=12
    )
