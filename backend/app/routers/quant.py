from fastapi import APIRouter
from app.models.schemas import BacktestRequest, BacktestResponse, StressTestRequest, StressTestResponse
from app.services.quant_engine import QuantEngine

router = APIRouter(prefix="/quant", tags=["Quant Studio"])

@router.post("/backtest", response_model=BacktestResponse)
def execute_backtest(request: BacktestRequest):
    """
    Executes a walk-forward strategy backtest with Zero Look-Ahead Isolation & Run Hashes.
    """
    return QuantEngine.run_backtest(request)

@router.post("/stress-test", response_model=StressTestResponse)
def execute_stress_test(request: StressTestRequest):
    """
    Executes market shock, volatility spike, and slippage stress testing.
    """
    return QuantEngine.run_stress_test(request)

@router.get("/experiment")
def get_experiment_lab():
    """
    Returns 3-strategy side-by-side comparison matrix with SeekAI claude-opus-5 verdict.
    """
    return QuantEngine.run_experiment_lab()
