from fastapi import APIRouter
from pydantic import BaseModel
from app.models.schemas import DataMartQueryRequest, DataMartResponse
from app.services.datamart_engine import DataMartEngine

router = APIRouter(prefix="/datamart", tags=["DataMart Explorer"])

class NLQueryRequest(BaseModel):
    prompt: str

@router.post("/query", response_model=DataMartResponse)
def query_datamart(request: DataMartQueryRequest):
    """
    Executes OLAP aggregations and returns confidence-rated autonomous insights.
    """
    return DataMartEngine.query_datamart(request)

@router.get("/metrics", response_model=DataMartResponse)
def get_metrics(dataset: str = "omnichannel_retail", region: str = "All"):
    """
    Fast GET endpoint for telemetry dashboards.
    """
    req = DataMartQueryRequest(dataset=dataset, region=region)
    return DataMartEngine.query_datamart(req)

@router.post("/nl-query")
def execute_nl_query(request: NLQueryRequest):
    """
    Translates natural language questions into DuckDB SQL via SeekAI (claude-opus-5)
    and queries 1,000,000+ transactional records.
    """
    return DataMartEngine.process_nl_query(request.prompt)
