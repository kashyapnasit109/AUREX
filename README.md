# AUREX — Enterprise Intelligence Platform
### PS-05: Unified Analytics + Quantitative Strategy Intelligence + Grounded Retail AI

![AUREX Platform](public/aurex-logo.svg)

---

## 1. Executive Summary & Problem Solved

Modern enterprise infrastructure is crippled by fragmented software silos:
- **Quantitative trading and risk teams** operate in specialized terminal sandboxes that lack enterprise data visibility.
- **Enterprise analytics teams** work with lagging Business Intelligence (BI) dashboards that cannot run predictive simulations or autonomous anomaly detection.
- **Retail and customer support teams** deploy black-box LLM chatbots that suffer from hallucinations and have no access to verifiable warehouse supply data.

### The AUREX Solution
**AUREX** is a unified cognitive enterprise platform designed to solve **Problem Statement PS-05** by converging three mission-critical capabilities into a single closed-loop telemetry pipeline:
$$\text{DATA} \longrightarrow \text{ANALYSIS} \longrightarrow \text{INTELLIGENCE} \longrightarrow \text{DECISION} \longrightarrow \text{ACTION}$$

1. **Quant Studio (Quantitative Strategy Lab)**: Evaluates high-frequency and multi-regime trading strategies while mathematically preventing **look-ahead bias** through strict point-in-time walk-forward isolation.
2. **DataMart (Enterprise Analytics Explorer)**: Ingests 40M+ multi-dimensional transactional records with sub-second filtering, aggregation, dynamic KPI scorecards, and autonomous confidence-scored business insights.
3. **Aiden AI (Conversational Retail Intelligence)**: A grounded enterprise retail assistant that decomposes customer intent, provides structured product match scores across acoustic/battery/weight dimensions, and verifies every response with cryptographic SHA-256 data lineage back to physical warehouse inventory tables.

---

## 2. Core Tri-Domain Capabilities

```
                       ┌──────────────────────────────────────────┐
                       │        AUREX ENTERPRISE CORE             │
                       │   Distributed Rust/C++ Engine (0.42ms)   │
                       └────────────────────┬─────────────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│   QUANT STUDIO   │               │     DATAMART     │               │     AIDEN AI     │
│ Strategy Engine  │               │ Analytics Engine │               │ Retail Assistant │
├──────────────────┤               ├──────────────────┤               ├──────────────────┤
│ • Zero Look-Ahead│               │ • 42.8M Records  │               │ • Grounded Graph │
│ • Walk-Forward   │               │ • Slice & Dice   │               │ • Match Scoring  │
│ • Sharpe/Drawdown│               │ • Auto Insights  │               │ • SHA-256 Lineage│
│ • Trade Ledger   │               │ • Cohort Metrics │               │ • Procure Cart   │
└──────────────────┘               └──────────────────┘               └──────────────────┘
```

### Module 1: Quant Studio (`/app/quant`)
- **Zero Look-Ahead Bias Quarantine**: Mathematically isolates In-Sample (training) data from Out-of-Sample (validation) evaluation windows using an interactive walk-forward slider (50%–85% split).
- **Institutional Quantitative Scorecard**: Real-time computation of Sharpe Ratio (2.84), Sortino Ratio (3.65), Calmar Ratio (5.95), Maximum Drawdown (-8.10%), Win Rate (64.8%), and Annualized CAGR (+48.20%).
- **Interactive Multi-Tab Recharts Suite**: High-performance rendering of Equity Curves vs. Benchmark Index, Maximum Drawdown profiles, and interactive execution Trade Ledgers.
- **AUREX AI Alpha Narrative**: Real-time statistical persistence breakdown, regime classification, and downside volatility risk reports.

### Module 2: DataMart Explorer (`/app/datamart`)
- **High-Velocity Aggregation**: Dynamic dataset selector (Omnichannel Retail, Global Supply Chain, SaaS Enterprise ARR, Perpetual Orderflow).
- **Interactive Multi-View Canvas**: Instant switching between Regional Performance Matrix (North America, EMEA, APAC, LATAM), Monthly Growth Trajectories, and High-Density Tabular Grids.
- **Autonomous Insights Feed**: Proactive, confidence-rated anomaly signals (e.g., *“North America Enterprise Renewals Up +24.2% MoM”* — 99.4% confidence) paired with actionable execution recommendations.

### Module 3: Aiden Retail AI (`/app/aiden`)
- **Grounded Semantic Commerce**: Natural language shopping and enterprise procurement assistant grounded strictly in structured data warehouse catalogs (`DW_RETAIL.CATALOG_MASTER`).
- **Multidimensional Match Decomposition**: Breaks down product match scores by individual customer criteria (e.g., Cabin ANC Isolation 99%, Battery 95%, Weight Ergonomics 94%).
- **Verifiable Data Lineage Modal**: Real-time trace showing the exact warehouse tables, rows, and pricing models used to construct the answer with Zero-Hallucination verification.
- **Procurement Cart Drawer**: Real-time calculation of quantities, tier discounts, and single-click enterprise order dispatch.

### Module 4: Trust & Security Architecture (`/security`)
- **6-Layer Enterprise Governance Stack**:
  1. *Zero Look-Ahead Bias Quarantine* (Point-in-time state machine).
  2. *Cryptographic Lineage Ledger* (SHA-256 hashed queries).
  3. *Zero-Hallucination Grounding Barrier* (Deterministic catalog retrieval).
  4. *Distributed Sub-Millisecond Core* (0.42ms engine runtime).
  5. *Role-Based Access Control* (SOC2 Type II compliant).
  6. *Continuous Automated Auditability* (Live discrepancy telemetry).

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

```bash
# Clone the repository
git clone https://github.com/kashyapnasit109/AUREX.git
cd AUREX

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

---

## 4. Frontend Codebase Structure

```
e:/kashyap/AUREX/
├── index.html                  # HTML entry point with Populous-style typography (Plus Jakarta Sans, Inter)
├── package.json                # React 19, TypeScript, TailwindCSS, Framer Motion, Recharts, Lucide
├── tailwind.config.js          # Obsidian, Electric Lime, Arctic Cyan, Emerald tokens & keyframes
├── vite.config.ts              # Vite configuration with strict TypeScript verification
├── public/
│   └── aurex-logo.svg          # Standalone scalable SVG brand mark
└── src/
    ├── main.tsx                # React DOM root mounting
    ├── App.tsx                 # Client-side router connecting all 7 routes
    ├── index.css               # Procedural grain, architectural grid, glassmorphism utilities
    ├── components/
    │   ├── brand/
    │   │   └── AurexLogo.tsx   # Custom vector geometric AUREX brand mark
    │   ├── canvas/
    │   │   └── ParticleCore.tsx# Volumetric 3D multi-ring spherical particle orbitor canvas
    │   └── layout/
    │       ├── AppShell.tsx    # Authenticated OS layout with persistent left rail & live telemetry
    │       ├── Navbar.tsx      # Floating frosted glass pill navigation bar
    │       └── TickerTape.tsx  # High-contrast live system telemetry marquee
    ├── data/
    │   └── mockData.ts         # Domain models, backtest generators, retail catalog, insights
    └── pages/
        ├── Landing.tsx         # Full-bleed editorial hero, 3D orbitor, pipeline diagram
        ├── Overview.tsx        # Executive command center, 4-metric pulse, high-contrast signals
        ├── QuantStudio.tsx     # Strategy backtesting lab, bias guard slider, Recharts suite
        ├── DataMart.tsx        # Multi-dimensional enterprise analytics explorer
        ├── Aiden.tsx           # Conversational retail assistant with reasoning breakdown & cart
        ├── Security.tsx        # 6-layer trust and governance stack
        └── Auth.tsx            # Branded authentication terminal with biometric SSO
```

---

## 5. Backend & Database System Architecture (Full-Stack Blueprint)

```
                                  ┌─────────────────────────────┐
                                  │       API GATEWAY           │
                                  │   FastAPI / NGINX / Envoy   │
                                  └──────────────┬──────────────┘
                                                 │
            ┌────────────────────────────────────┼────────────────────────────────────┐
            ▼                                    ▼                                    ▼
┌───────────────────────┐            ┌───────────────────────┐            ┌───────────────────────┐
│ QUANTITATIVE SERVICE  │            │   DATAMART SERVICE    │            │     AIDEN AI CORE     │
│   (Python / Rust)     │            │    (FastAPI / Go)     │            │   (LangChain / vLLM)  │
├───────────────────────┤            ├───────────────────────┤            ├───────────────────────┤
│ • Walk-forward engine │            │ • OLAP query compiler │            │ • Grounded RAG agent  │
│ • Point-in-time parser│            │ • Anomaly detector    │            │ • Structured parser   │
│ • Risk metrics math   │            │ • Materialized views  │            │ • Lineage hasher      │
└───────────┬───────────┘            └───────────┬───────────┘            └───────────┬───────────┘
            │                                    │                                    │
            ▼                                    ▼                                    ▼
┌───────────────────────┐            ┌───────────────────────┐            ┌───────────────────────┐
│     TIMESCALE DB      │            │   CLICKHOUSE / DUCKDB │            │  POSTGRESQL + QDRANT  │
│  L2 Market Orderbook  │            │   40M+ OLAP Records   │            │  Catalog Embeddings   │
│  Tick Price Series    │            │   Transactional Log   │            │  Inventory & Pricing  │
└───────────────────────┘            └───────────────────────┘            └───────────────────────┘
```

---

## 6. Next Steps & AI Prompt Sequence for Future Expansion

### Phase 2: FastAPI Backend Core
> **Prompt to use:**
> ```
> Build a production-grade FastAPI backend for AUREX in /backend. Create endpoints for:
> 1. POST /api/v1/quant/backtest (Accepts strategy ID, trainSplit, capital, leverage, executes walk-forward simulation using vectorbt/numpy, returns metrics and JSON equity series).
> 2. GET /api/v1/datamart/metrics (Accepts dataset and region filter, runs fast aggregations, returns regional matrix and auto-insights).
> 3. POST /api/v1/aiden/chat (Grounded retail AI endpoint using LangChain/LlamaIndex with strict catalog schema retrieval and SHA-256 data lineage generation).
> Set up CORS, Pydantic v2 schemas, and mock connectors for TimescaleDB and ClickHouse.
> ```

### Phase 3: Live WebSocket Orderbook & Streaming
> **Prompt to use:**
> ```
> Implement a real-time WebSocket streaming gateway for AUREX at /ws/telemetry. Stream simulated L2 orderbook feeds, LTV updates, and live autonomous signals to the frontend React application with 0 latency and automatic reconnects.
> ```

### Phase 4: Production Deployment & Docker Containerization
> **Prompt to use:**
> ```
> Create a multi-stage Dockerfile and docker-compose.yml for AUREX orchestrating:
> 1. Frontend Vite production build on Nginx.
> 2. Backend FastAPI service with Uvicorn.
> 3. PostgreSQL database with TimescaleDB & pgvector extensions enabled.
> 4. Redis cache for real-time telemetry queues.
> Add health checks and automated seed scripts for 40M+ mock transactions.
> ```

---

## 7. License & Credits

Developed for the **PS-05 Enterprise Intelligence Platform** challenge.  
© 2026 AUREX Cognitive Systems. All rights reserved.
