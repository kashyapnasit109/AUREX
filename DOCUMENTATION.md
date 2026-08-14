# AUREX — Master Project Documentation & Architectural Blueprint

```
                            AUREX
                              │
                    ┌─────────▼─────────┐
                    │ INTELLIGENCE CORE │  ← (/app/intelligence)
                    └─────────┬─────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
       QUANT STUDIO       DATAMART         RETAIL AI
      (Backtesting)     (Analytics)       (Commerce)
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                       INSIGHT ENGINE      ← (/app/insights)
                              │
                              ▼
                        ASK AUREX &        ← (Cross-Platform AI Drawer
                     EVIDENCE PROVENANCE      & SHA-256 Lineage Tracing)
                              │
                              ▼
                     AUTONOMOUS ACTION
```

---

## 1. Executive Problem Statement & Value Proposition

### The Enterprise Disconnect
Modern enterprises run on fragmented data workflows:
- **Quantitative & Risk teams** execute backtests on historical datasets that inadvertently leak future information (**look-ahead bias**), creating un-reproducible alphas that collapse in production.
- **Enterprise Analytics & Finance teams** stare at lagging BI dashboards unable to run predictive cross-domain simulations or isolate root-cause anomalies.
- **Retail & Customer Operations teams** deploy black-box chatbots prone to hallucination without verifiable ties to physical warehouse inventories or dynamic price elasticity models.

### The AUREX Unified Solution
**AUREX** converges these disconnected workflows into a single closed-loop telemetry pipeline:
$$\text{DATA} \longrightarrow \text{ANALYSIS} \longrightarrow \text{INTELLIGENCE} \longrightarrow \text{DECISION} \longrightarrow \text{ACTION}$$

1. **AUREX Intelligence Core (`/app/intelligence`)**: Central cross-modal nervous system fusing Market Alpha streams, Regional Transaction logs, and Retail Commerce signals into real-time causal flow sequences.
2. **Quant Studio (`/app/quant`)**: Mathematical walk-forward backtesting with **strict Point-in-Time Quarantine (zero look-ahead bias)**, Stress Testing Lab (Market Shock, Volatility Multiplier, Slippage), and deterministic Run Hashes.
3. **DataMart Analytics (`/app/datamart`)**: Sub-second dimensional aggregation across 40M+ transaction logs, dynamic cohort filtering, and exportable Parquet workflows.
4. **Insight Engine (`/app/insights`)**: Autonomous decision system scoring high-conviction anomalies with financial impact projections (+$3.82M ARR), causal drivers, and 1-click execution dispatchers.
5. **Aiden Retail AI (`/app/aiden`)**: Grounded conversational commerce assistant with multi-criteria match decomposition and verifiable warehouse lineage.
6. **Customer 360 (`/app/customers`)**: Account dossier with chronological lifecycle event streams (`SEARCH` $\rightarrow$ `VIEW` $\rightarrow$ `PURCHASE` $\rightarrow$ `REVIEW`), retention probabilities, and tailored retail recommendations.
7. **Product Matrix (`/app/products`)**: SKU demand velocity telemetry, return rate risk decomposition, and Aiden AI recommendation attribution scores.
8. **Data Hub & Governance (`/app/data`)**: 4-gauge Data Quality scorecard (Completeness 99.2%, Validity 98.8%, Freshness 99.7%, Consistency 97.9%) and end-to-end cryptographic data lineage tracking.

---

## 2. Frontend Component Tree & System Architecture

```
src/
├── app/
│   └── (App routing & root providers)
├── components/
│   ├── brand/
│   │   └── AurexLogo.tsx            # Bespoke isometric quantum prism emblem
│   ├── canvas/
│   │   └── ParticleCore.tsx         # 3D multi-ring spherical orbital system (800+ nodes)
│   ├── common/
│   │   ├── AskAurexDrawer.tsx       # Contextual cross-platform AI copilot
│   │   └── EvidenceDrawer.tsx       # SHA-256 cryptographic provenance drawer
│   └── layout/
│       ├── AppShell.tsx             # Enterprise workspace layout with navigation rail
│       ├── Navbar.tsx               # Floating glass dock header
│       └── TickerTape.tsx           # Real-time multi-asset telemetry ticker
├── data/
│   └── mockData.ts                  # Domain models, strategies, datasets, and catalog
├── pages/
│   ├── Landing.tsx                  # Populous editorial hero & interactive previewer
│   ├── Overview.tsx                 # Tri-domain command dashboard
│   ├── IntelligenceCore.tsx         # Cross-domain causal signal propagation
│   ├── QuantStudio.tsx              # Backtesting, bias guard, stress lab, & comparison
│   ├── DataMart.tsx                 # 40M+ row dimensional analytics canvas
│   ├── InsightEngine.tsx            # Autonomous anomaly decision center
│   ├── Aiden.tsx                    # Grounded conversational retail commerce
│   ├── Customer360.tsx              # Account dossier & behavioral lifecycle timeline
│   ├── ProductIntelligence.tsx      # SKU telemetry & recommendation attribution
│   ├── DataHub.tsx                  # Data governance & cryptographic lineage pipeline
│   ├── Security.tsx                 # 6-layer trust & SOC2-aligned governance stack
│   └── Auth.tsx                     # Terminal authentication screen
└── types/
    └── domain.ts                    # Shared TypeScript enterprise domain models
```

---

## 3. Target Full-Stack Backend & Database Architecture

*(Target Architecture for Backend Integration Phase)*

```
                                  ┌─────────────────────────────┐
                                  │      CLIENT APPS (VITE)     │
                                  └──────────────┬──────────────┘
                                                 │ HTTPS / WSS
                                  ┌──────────────▼──────────────┐
                                  │    FASTAPI API GATEWAY      │
                                  │  (JWT Auth, Rate Limiter)   │
                                  └──────────────┬──────────────┘
                                                 │
          ┌──────────────────────────────────────┼──────────────────────────────────────┐
          ▼                                      ▼                                      ▼
┌──────────────────┐                   ┌──────────────────┐                   ┌──────────────────┐
│   QUANT SERVICE  │                   │ DATAMART SERVICE │                   │    AIDEN RAG     │
│ (Rust / vectorbt)│                   │   (ClickHouse)   │                   │ (Qdrant/pgvector)│
├──────────────────┤                   ├──────────────────┤                   ├──────────────────┤
│ • Walk-Forward   │                   │ • 42.8M Records  │                   │ • Grounded Embeds│
│ • Point-in-Time  │                   │ • Sub-second Agg │                   │ • SHA-256 Trace  │
│ • Stress Shocks  │                   │ • Auto-Anomalies │                   │ • Multi-Match    │
└─────────┬────────┘                   └─────────┬────────┘                   └─────────┬────────┘
          │                                      │                                      │
          ▼                                      ▼                                      ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PERSISTENCE & DATA STORAGE                                   │
│  • TimescaleDB (L2 Market Ticks)  • ClickHouse (OLAP Logs)  • PostgreSQL + pgvector (Catalogs) │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Production Database Schemas

### A. Point-in-Time Market Ticks (TimescaleDB)
```sql
CREATE TABLE market_ticks (
    time TIMESTAMPTZ NOT NULL,
    symbol VARCHAR(32) NOT NULL,
    price NUMERIC(18, 8) NOT NULL,
    volume NUMERIC(18, 8) NOT NULL,
    funding_rate NUMERIC(10, 6),
    bid_depth_l2 NUMERIC(18, 4),
    ask_depth_l2 NUMERIC(18, 4)
);
SELECT create_hypertable('market_ticks', 'time');
```

### B. High-Velocity Transactions (ClickHouse OLAP)
```sql
CREATE TABLE enterprise_transactions (
    transaction_id UUID,
    customer_id VARCHAR(64),
    sku VARCHAR(64),
    region LowCardinality(String),
    gross_amount Decimal64(2),
    discount_applied Decimal64(2),
    fulfillment_latency_hours Float32,
    created_at DateTime
) ENGINE = MergeTree()
ORDER BY (region, created_at, customer_id);
```

### C. Grounded Retail Catalog (PostgreSQL + pgvector)
```sql
CREATE TABLE product_catalog (
    sku VARCHAR(64) PRIMARY KEY,
    name TEXT NOT NULL,
    brand VARCHAR(64),
    price NUMERIC(10, 2),
    inventory_count INT,
    anc_score FLOAT,
    battery_hours INT,
    weight_grams INT,
    embedding vector(1536),
    last_verified_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Step-by-Step AI Prompts for Future Backend Buildout

Follow these exact prompts in sequence to implement the backend and database:

### Prompt 1: FastAPI Core Service & Data Adapters
```text
Build a production-grade FastAPI backend for AUREX in /backend.
Create structured routers for:
1. /api/v1/intelligence (Cross-domain signal aggregation and causality propagation).
2. /api/v1/quant (Walk-forward backtesting with strict point-in-time isolation and stress testing lab).
3. /api/v1/datamart (High-velocity aggregation queries returning regional and cohort metrics).
4. /api/v1/insights (Autonomous anomaly detection and ARR impact scoring).
5. /api/v1/aiden (Grounded retail chat with deterministic catalog retrieval and SHA-256 evidence hashing).
6. /api/v1/customers & /api/v1/products (Customer 360 and SKU intelligence feeds).
Set up Pydantic v2 schemas matching src/types/domain.ts and CORS middleware.
```

### Prompt 2: Real-time Streaming & Telemetry
```text
Implement a real-time WebSocket streaming server for AUREX at /ws/telemetry.
Stream live simulated market ticks, real-time ARR updates, and active cross-domain anomaly triggers directly to the React frontend with zero dropped frames.
```

### Prompt 3: Docker & Database Infrastructure
```text
Create docker-compose.yml and Dockerfiles for AUREX with:
1. Frontend container (Vite + Nginx production bundle).
2. Backend container (FastAPI + Uvicorn).
3. TimescaleDB container for point-in-time market data.
4. ClickHouse container for 40M+ OLAP transaction queries.
5. Qdrant / PostgreSQL (pgvector) container for catalog embeddings.
6. Automated Python seed script generating 40M+ realistic mock transaction records.
```
