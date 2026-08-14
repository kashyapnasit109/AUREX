# AUREX — Enterprise Intelligence Platform

> **Unified Analytics + Quantitative Strategy Intelligence + Grounded Retail AI**

An enterprise cognitive intelligence platform converging **Market Alpha Streams**, **Multi-Dimensional Enterprise DataMart Records**, and **Grounded Retail AI** into a unified telemetry pipeline.

---

## Live System Architecture

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

## Core Capabilities

1. **AUREX Intelligence Core (`/app/intelligence`)**: Central cross-modal nervous system fusing Market Alpha streams, Regional Transaction logs, and Retail Commerce signals into real-time causal flow sequences.
2. **Quant Studio (`/app/quant`)**: Mathematical walk-forward backtesting with **strict Point-in-Time Quarantine (zero look-ahead bias)**, Stress Testing Lab (Market Shock, Volatility Multiplier, Slippage), and deterministic Run Hashes.
3. **DataMart Analytics (`/app/datamart`)**: Sub-second dimensional aggregation across 40M+ transaction logs, dynamic cohort filtering, and exportable Parquet workflows.
4. **Insight Engine (`/app/insights`)**: Autonomous decision system scoring high-conviction anomalies with financial impact projections (+$3.82M ARR), causal drivers, and 1-click execution dispatchers.
5. **Aiden Retail AI (`/app/aiden`)**: Grounded conversational commerce assistant with multi-criteria match decomposition and verifiable warehouse lineage.
6. **Customer 360 (`/app/customers`)**: Account dossier with chronological lifecycle event streams (`SEARCH` $\rightarrow$ `VIEW` $\rightarrow$ `PURCHASE` $\rightarrow$ `REVIEW`), retention probabilities, and tailored retail recommendations.
7. **Product Matrix (`/app/products`)**: SKU demand velocity telemetry, return rate risk decomposition, and Aiden AI recommendation attribution scores.
8. **Data Hub & Governance (`/app/data`)**: 4-gauge Data Quality scorecard (Completeness 99.2%, Validity 98.8%, Freshness 99.7%, Consistency 97.9%) and end-to-end cryptographic data lineage tracking.

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Obsidian Glassmorphism System
- **Data Visualizations**: Recharts (Walk-Forward Area, Multi-Dimensional Bar, Drawdown)
- **Kinetic Animations**: Framer Motion
- **Typography**: Plus Jakarta Sans, Inter, JetBrains Mono
- **Canvas Rendering**: 3D Spherical Multi-Plane Orbital Matrix (800+ nodes)

---

## Getting Started

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

## Complete Project Documentation
See [`DOCUMENTATION.md`](./DOCUMENTATION.md) for full architectural specs, target backend microservices, SQL schemas, and AI prompt sequences.
