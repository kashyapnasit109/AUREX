from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Health Schemas ---
class HealthResponse(BaseModel):
    status: str
    version: str
    engine_latency_ms: float
    database_status: str
    active_connections: int

# --- Quant Studio Schemas ---
class BacktestRequest(BaseModel):
    strategy_id: str = Field(default="strat_alpha_momentum")
    strategy_name: str = Field(default="Alpha Trend Momentum v4")
    train_split: float = Field(default=0.70, ge=0.5, le=0.9, description="Walk-forward training split ratio")
    initial_capital: float = Field(default=100000.0, gt=0)
    leverage: float = Field(default=1.0, ge=1.0, le=10.0)
    asset_pair: str = Field(default="BTC/USD")

class StressTestRequest(BaseModel):
    market_shock_pct: float = Field(default=-10.0, ge=-50.0, le=0.0)
    volatility_spike_pct: float = Field(default=50.0, ge=0.0, le=200.0)
    slippage_increase_bps: float = Field(default=20.0, ge=0.0, le=100.0)

class StressTestResponse(BaseModel):
    base_cagr: float
    stressed_cagr: float
    base_max_drawdown: float
    stressed_max_drawdown: float
    resilience_score: int
    regime_classification: str
    reproducibility_run_id: str
    run_hash: str

class EquityPoint(BaseModel):
    timestamp: str
    in_sample: Optional[float] = None
    out_of_sample: Optional[float] = None
    benchmark: float

class DrawdownPoint(BaseModel):
    timestamp: str
    drawdown: float

class TradeRecord(BaseModel):
    id: str
    timestamp: str
    type: str
    asset: str
    amount: str
    price: float
    pnl: float
    status: str

class QuantMetrics(BaseModel):
    sharpe_ratio: float
    sortino_ratio: float
    calmar_ratio: float
    max_drawdown: float
    win_rate: float
    cagr: float
    execution_time_ms: float

class BacktestResponse(BaseModel):
    strategy_id: str
    strategy_name: str
    train_split: float
    metrics: QuantMetrics
    equity_curve: List[EquityPoint]
    drawdown_series: List[DrawdownPoint]
    trades: List[TradeRecord]
    alpha_narrative: str
    bias_quarantine_verified: bool
    reproducibility_run_id: str
    run_hash: str

# --- DataMart Schemas ---
class DataMartQueryRequest(BaseModel):
    dataset: str = Field(default="omnichannel_retail")
    region: str = Field(default="All")
    timeframe: str = Field(default="YTD")

class RegionalMetric(BaseModel):
    region: str
    revenue: float
    growth_pct: float
    order_count: int
    avg_order_value: float
    churn_risk_score: float

class AutonomousInsight(BaseModel):
    id: str
    type: str
    title: str
    description: str
    confidence_pct: float
    impact_tier: str
    action_item: str
    z_score: Optional[float] = None
    evidence_sources: List[str] = Field(default_factory=list)

class DataMartResponse(BaseModel):
    dataset: str
    region_filter: str
    total_records_processed: int
    regional_matrix: List[RegionalMetric]
    growth_trajectory: List[Dict[str, Any]]
    insights: List[AutonomousInsight]

# --- Aiden AI Schemas ---
class AidenMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class ScoreDecomposition(BaseModel):
    anc_isolation: int = 0
    battery_efficiency: int = 0
    weight_ergonomics: int = 0

class ProductMatch(BaseModel):
    sku: str
    name: str
    brand: str
    match_score: int
    price: float
    inventory: int
    scores: ScoreDecomposition
    key_feature: str

class LineageTrace(BaseModel):
    source_table: str
    records_queried: int
    sha256_hash: str
    timestamp: str
    execution_ms: float

class AidenChatRequest(BaseModel):
    messages: List[AidenMessage]
    user_context: Optional[Dict[str, Any]] = None
    # Model selection fields
    model_provider: Optional[str] = None  # "cloud", "local", "custom"
    model_name: Optional[str] = None  # e.g. "claude-opus-4-8", "llama3.2"
    custom_url: Optional[str] = None  # Custom API endpoint
    custom_api_key: Optional[str] = None  # Custom API key

class AidenChatResponse(BaseModel):
    message: str
    reasoning: List[str]
    suggested_products: List[ProductMatch] = Field(default_factory=list)
    lineage_trace: LineageTrace
    zero_hallucination_verified: bool
    model_used: Optional[str] = None  # Which model actually answered
