from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import health, quant, datamart, aiden, websocket
from app.services.datamart_engine import DataMartEngine

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DuckDB database on server startup
@app.on_event("startup")
def startup_event():
    print("[AUREX BACKEND] Initializing DuckDB Engine & Event Bus...")
    DataMartEngine.get_connection()

# Include Routers under API v1 prefix
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(quant.router, prefix=settings.API_V1_STR)
app.include_router(datamart.router, prefix=settings.API_V1_STR)
app.include_router(aiden.router, prefix=settings.API_V1_STR)
app.include_router(websocket.router) # Root level ws endpoint /ws/telemetry

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": f"{settings.API_V1_STR}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
