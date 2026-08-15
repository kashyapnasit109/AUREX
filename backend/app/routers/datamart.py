from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.models.schemas import DataMartQueryRequest, DataMartResponse
from app.services.datamart_engine import DataMartEngine

router = APIRouter(prefix="/datamart", tags=["DataMart Explorer"])


class NLQueryRequest(BaseModel):
    prompt: str


class CustomSQLRequest(BaseModel):
    sql: str


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
    Translates natural language questions into DuckDB SQL via AI and queries records.
    """
    return DataMartEngine.process_nl_query(request.prompt)


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    custom_name: Optional[str] = Form(None)
):
    """
    Uploads and registers CSV, JSON, Parquet, or Excel files into DuckDB in memory.
    """
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        meta = DataMartEngine.upload_dataset(
            file_bytes=content,
            filename=file.filename or "uploaded_dataset.csv",
            custom_name=custom_name
        )
        return {
            "success": True,
            "message": f"Successfully ingested {meta['row_count']:,} records into DuckDB table '{meta['table_name']}'.",
            "metadata": meta
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/tables")
def list_tables() -> List[Dict[str, Any]]:
    """
    Lists all active tables registered in DuckDB with row counts and schema information.
    """
    return DataMartEngine.list_all_tables()


@router.post("/sql")
def execute_sql(request: CustomSQLRequest):
    """
    Executes custom SQL against DuckDB tables and returns structured results.
    """
    if not request.sql.strip():
        raise HTTPException(status_code=400, detail="SQL query cannot be empty.")
    return DataMartEngine.execute_custom_sql(request.sql)
