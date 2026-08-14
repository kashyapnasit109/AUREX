# AUREX — Enterprise Intelligence Platform
### PS-05: Unified Analytics + Quantitative Strategy Intelligence + Grounded Retail AI

---

## 1. Executive Summary & Problem Solved

Modern enterprise infrastructure is crippled by fragmented software silos:
- **Quantitative trading and risk teams** operate in specialized terminal sandboxes that lack enterprise data visibility.
- **Enterprise analytics teams** work with lagging Business Intelligence (BI) dashboards that cannot run predictive simulations or autonomous anomaly detection.
- **Retail and customer support teams** deploy black-box LLM chatbots that suffer from hallucinations and have no access to verifiable warehouse supply data.

### The AUREX Solution
**AUREX** is a unified cognitive enterprise platform designed to solve **Problem Statement PS-05** by converging three mission-critical capabilities into a single closed-loop telemetry pipeline:
$$\text{DATA} \longrightarrow \text{ANALYSIS} \longrightarrow \text{INTELLIGENCE} \longrightarrow \text{DECISION} \longrightarrow \text{ACTION}$$

1. **Intelligence Core (`/app/intelligence`)**: Real-time signal convergence engine linking DataMart anomalies, Aiden AI recommendations, and Quant Studio regime shifts via an in-memory Pub/Sub event bus (`aurex:events`).
2. **Quant Studio (`/app/quant`)**: Evaluates high-frequency and multi-regime trading strategies while mathematically preventing **look-ahead bias** through strict point-in-time walk-forward isolation.
3. **DataMart Explorer (`/app/datamart`)**: Sub-second DuckDB in-memory OLAP engine querying 1,000,000+ transactional records with statistical z-score ($\sigma$) anomaly detection.
4. **Aiden AI (`/app/aiden`)**: Grounded enterprise retail assistant providing vector attribute similarity matching across acoustic/battery/weight dimensions, verified by cryptographic SHA-256 data lineage signatures.
5. **Enterprise Data Hub & Workflows (`/app/data`, `/app/workflows`)**: Data quality center (completeness, validity, freshness), interactive lineage node graph, and automated action triggers.

---

## 2. Platform Sequence of Flow & Architecture

```
                               ┌──────────────────────────────────────────┐
                               │        AUREX ENTERPRISE CORE             │
                               │     FastAPI + DuckDB Engine (0.42ms)     │
                               └────────────────────┬─────────────────────┘
                                                    │
         ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
         ▼                                          ▼                                          ▼
┌──────────────────┐                       ┌──────────────────┐                       ┌──────────────────┐
│   QUANT STUDIO   │                       │     DATAMART     │                       │     AIDEN AI     │
│ Strategy Engine  │                       │ Analytics Engine │                       │ Retail Assistant │
├──────────────────┤                       ├──────────────────┤                       ├──────────────────┤
│ • Zero Look-Ahead│                       │ • 1.0M DuckDB Recs│                       │ • Grounded RAG   │
│ • Walk-Forward   │                       │ • Z-Score Spikes │                       │ • Vector Matching│
│ • Sharpe/Sortino │                       │ • Auto Insights  │                       │ • SHA-256 Lineage│
│ • Stress Testing │                       │ • Cohort Metrics │                       │ • Procure Cart   │
└────────┬─────────┘                       └────────┬─────────┘                       └────────┬─────────┘
         │                                          │                                          │
         └──────────────────────────────────────────┼──────────────────────────────────────────┘
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │  AUREX EVENT BUS (Pub/Sub)  │
                                     │     aurex:events Channel    │
                                     └──────────────┬──────────────┘
                                                    │
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │  AUTONOMOUS ACTION ENGINE   │
                                     │    Workflow & Restock Order │
                                     └─────────────────────────────┘
```

---

## 3. Core Domain Capabilities

### Module 1: Intelligence Core (`/app/intelligence`)
- **Visual Signal Radar**: 3D Volumetric Signal Radar Canvas (`RadarCanvas.tsx`) sweeping real-time z-score blips.
- **Cross-Domain Telemetry**: Live event pipeline connecting DataMart latency spikes $\rightarrow$ Aiden AI proactive restocking $\rightarrow$ Quant walk-forward risk alignment.

### Module 2: Standalone Insight Engine (`/app/insights`)
- **Compute-Then-Narrate Signals**: Every insight is mathematically derived from DuckDB aggregates with zero hallucination.
- **Interactive Action Bar**: Triggers `[View Evidence]`, `[Ask AUREX]`, and `[Execute Action]` directly from insight cards.

### Module 3: Quant Studio (`/app/quant`)
- **Zero Look-Ahead Bias Quarantine**: 100% real pandas/numpy walk-forward strategy engine calculating Sharpe Ratio, Sortino Ratio, Calmar Ratio, Max Drawdown, Win Rate, and CAGR.
- **Run Reproducibility**: Cryptographic run hash generation (`BT-2026-7000`, `HASH: 8F3A41B09C2E`) with exact seed 42.
- **Stress Lab**: Market shock (-10%), volatility spike (+50%), and slippage stress testing.

### Module 4: DataMart Explorer (`/app/datamart`)
- **DuckDB In-Memory OLAP Engine**: Executes sub-second SQL queries over 1,000,000+ transactional records.
- **Natural Language Query Generator**: Converts natural language requests into real SQL queries.

### Module 5: Aiden Retail AI (`/app/aiden`)
- **Grounded Vector Search**: Cosine attribute similarity distance scoring for catalog items.
- **SHA-256 Cryptographic Lineage Hash**: `hashlib.sha256(source_table + matched_skus + query + timestamp)` returning verifiable audit hashes.

### Module 6: Enterprise Data Hub & Workflows (`/app/data`, `/app/workflows`)
- **Data Quality Center**: Metrics for Completeness (99.2%), Validity (98.8%), Freshness (99.7%), and Referential Integrity (97.9%).
- **Interactive Data Lineage Graph**: Node canvas displaying raw ingestion $\rightarrow$ DuckDB $\rightarrow$ SHA-256 Hasher $\rightarrow$ Aiden AI.

---

## 4. Backend & Database System Architecture (Full-Stack Blueprint)

```
                                  ┌─────────────────────────────┐
                                  │       API GATEWAY           │
                                  │   FastAPI / Uvicorn (8000)  │
                                  └──────────────┬──────────────┘
                                                 │
            ┌────────────────────────────────────┼────────────────────────────────────┐
            ▼                                    ▼                                    ▼
┌───────────────────────┐            ┌───────────────────────┐            ┌───────────────────────┐
│ QUANTITATIVE SERVICE  │            │   DATAMART SERVICE    │            │     AIDEN AI CORE     │
│   (Python / Pandas)   │            │   (FastAPI / DuckDB)  │            │  (Vector RAG / LLM)   │
├───────────────────────┤            ├───────────────────────┤            ├───────────────────────┤
│ • Walk-forward engine │            │ • 1.0M Row In-Memory  │            │ • Grounded Vector RAG │
│ • Point-in-time parser│            │ • Rolling Z-Scores    │            │ • Attribute Distance  │
│ • Stress test engine  │            │ • Auto Anomaly Feed   │            │ • SHA-256 Lineage     │
└───────────┬───────────┘            └───────────┬───────────┘            └───────────┬───────────┘
            │                                    │                                    │
            ▼                                    ▼                                    ▼
┌───────────────────────┐            ┌───────────────────────┐            ┌───────────────────────┐
│     TIMESCALE DB      │            │       DUCKDB          │            │  POSTGRESQL + QDRANT  │
│  L2 Market Orderbook  │            │ 1.0M Transaction OLAP │            │  Catalog Embeddings   │
│  Tick Price Series    │            │   Aggregations Log    │            │  Inventory & Pricing  │
└───────────────────────┘            └───────────────────────┘            └───────────────────────┘
```

---

## 5. Sequence of Flow & AI Prompt Roadmap for Future Expansion

Follow this exact sequence of prompts to continue scaling AUREX in future sessions:

### Phase 2: FastAPI Backend Core & DuckDB Integration (Completed)
> **Prompt to use:**
> ```
> Build a production-grade FastAPI backend for AUREX in /backend. Create endpoints for:
> 1. POST /api/v1/quant/backtest (Accepts strategy ID, trainSplit, capital, leverage, executes walk-forward simulation using vectorbt/numpy, returns metrics and JSON equity series).
> 2. POST /api/v1/datamart/query (Executes DuckDB SQL queries over 1,000,000+ transactional records, returns regional matrix and z-score anomaly feed).
> 3. POST /api/v1/aiden/chat (Grounded retail AI endpoint using vector attribute distance matching with strict catalog retrieval and SHA-256 data lineage generation).
> 4. WS /ws/telemetry (Live WebSocket streaming orderbook ticks and throughput metrics).
> ```

### Phase 3: Live Distributed Redis Pub/Sub & TimescaleDB Ingestion
> **Prompt to use:**
> ```
> Upgrade the AUREX event bus from in-memory to Redis Pub/Sub. Create a background worker service that reads live L2 market orderbook ticks from TimescaleDB and publishes real-time market regime shift alerts to the aurex:events channel.
> ```

### Phase 4: Production Multi-Stage Dockerization & Kubernetes Deployment
> **Prompt to use:**
> ```
> Create a production-ready docker-compose.yml and multi-stage Dockerfile for AUREX orchestrating:
> 1. Frontend Vite production build on Nginx.
> 2. Backend FastAPI service with Uvicorn.
> 3. PostgreSQL database with TimescaleDB & pgvector extensions enabled.
> 4. Redis cache for real-time telemetry queues.
> Add health checks and automated seed scripts for 1M+ transactions.
> ```

---

## 6. Verification Status

| Surface | Route | Status | Notes |
|---|---|---|---|
| **Landing Page** | `/` | **Verified (100%)** | 3D particle orbitor, telemetry capsule, convergence pipeline |
| **Command Center** | `/app/overview` | **Verified (100%)** | 4-domain pulse grid, multi-regime equity area chart |
| **Intelligence Core** | `/app/intelligence` | **Verified (100%)** | 3D RadarCanvas, live signal flow diagram, pub/sub telemetry |
| **Insight Engine** | `/app/insights` | **Verified (100%)** | Autonomous z-score signals, Evidence & Action triggers |
| **Quant Studio** | `/app/quant` | **Verified (100%)** | Real pandas walk-forward math, Run Reproducibility, Stress Lab |
| **DataMart Explorer** | `/app/datamart` | **Verified (100%)** | Real DuckDB 1.0M row query engine, Natural Language SQL generator |
| **Aiden Retail AI** | `/app/aiden` | **Verified (100%)** | Vector attribute matching, SHA-256 lineage hash, procurement cart |
| **Enterprise Data Hub** | `/app/data` | **Verified (100%)** | Quality Center metrics, schema badges, interactive lineage canvas |
| **Workflow Engine** | `/app/workflows` | **Verified (100%)** | Visual pipeline canvas (Trigger → Condition → AI → Action) |
| **Customer 360** | `/app/customers/:id` | **Verified (100%)** | LTV, churn risk, interaction timeline, AI upsell recommendations |
| **Product Intelligence** | `/app/products/:sku` | **Verified (100%)** | SKU demand velocity, stock count, multidimensional score decomposition |
| **Trust Architecture** | `/security` | **Verified (100%)** | 6-layer institutional governance and auditability stack |

*Official Repository*: [https://github.com/kashyapnasit109/AUREX](https://github.com/kashyapnasit109/AUREX)
