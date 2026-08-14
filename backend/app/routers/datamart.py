from fastapi import APIRouter
from app.models.schemas import DataMartQueryRequest, DataMartResponse
from app.services.datamart_engine import DataMartEngine

router = APIRouter(prefix="/datamart", tags=["DataMart Explorer"])

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
