<div align="center">

  <img src="public/aurex-logo.svg" alt="AUREX Intelligence Platform" width="100" height="100" />

  <h1>AUREX</h1>
  <h3>Autonomous Enterprise Intelligence Platform</h3>
  <p><strong>Unified Quantitative Strategy • Multi-Dimensional DataMart • Grounded Retail AI</strong></p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Framer_Motion-12.0-FF0055?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/License-Proprietary-D4F938?style=for-the-badge" alt="License" />
  </p>

</div>

---

## 🌟 Executive Overview

**AUREX** is a unified cognitive enterprise platform designed to eliminate the fragmentation between quantitative market execution, transactional data exploration, and retail artificial intelligence.

Instead of deploying disconnected dashboards, AUREX provides a singular, closed-loop telemetry pipeline:

$$\text{DATA} \longrightarrow \text{ANALYSIS} \longrightarrow \text{INTELLIGENCE} \longrightarrow \text{DECISION} \longrightarrow \text{ACTION}$$

---

## 🏛️ Tri-Domain Architecture

```
                            AUREX
                              │
                    ┌─────────▼─────────┐
                    │ INTELLIGENCE CORE │  (Cross-Domain Synthesis)
                    └─────────┬─────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
       QUANT STUDIO       DATAMART         RETAIL AI
      (Backtesting)     (Analytics)       (Commerce)
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                       INSIGHT ENGINE      (Autonomous Anomaly Engine)
                              │
                              ▼
                        ASK AUREX &        (SHA-256 Verified Lineage)
                     EVIDENCE PROVENANCE
                              │
                              ▼
                     AUTONOMOUS ACTION
```

---

## ⚡ Key Modules & Capabilities

### 1. Quant Strategy Studio (`/app/quant`)
- **Zero Look-Ahead Bias Quarantine**: Mathematically isolates In-Sample training data from Out-of-Sample validation windows via an interactive walk-forward split slider.
- **Institutional Metric Scorecard**: Real-time computation of Sharpe Ratio (2.84), Sortino Ratio (3.65), Calmar Ratio (5.95), Maximum Drawdown (-8.1%), Win Rate (64.8%), and CAGR (+48.2%).
- **Interactive Stress Lab**: Real-time simulation of market shocks (-15%), volatility expansion (+50%), and execution slippage (+25%) computing live resilience scores.
- **Deterministic Run Reproducibility**: Cryptographic Run IDs (`BT-2026-89421`), seed numbers, and SHA-256 result hashes.

### 2. DataMart Analytics (`/app/datamart`)
- **Sub-Second Aggregation**: High-velocity dimensional exploration across 42.8M+ transaction records.
- **Multi-View Canvas**: Radiant multi-stop regional revenue bar charts, monthly trajectory area graphs, and high-density tabular grids.
- **Dimensional Cohort Intelligence**: Real-time decomposition of gross margin density (42.8%), customer retention scores (94.2%), and cross-domain AI revenue expansion (+$1.40M ARR).

### 3. Aiden Retail AI (`/app/aiden`)
- **Grounded Semantic Commerce**: Conversational retail procurement grounded strictly in warehouse inventory tables (`DW_RETAIL.CATALOG_MASTER`).
- **Multidimensional Match Scoring**: Transparent parameter breakdown (Acoustic ANC 99%, Battery 95%, Weight Ergonomics 94%).
- **Cryptographic Evidence Provenance**: Live SHA-256 lineage traces showing exact warehouse rows, tables, and pricing models with Zero-Hallucination verification.

### 4. AUREX Intelligence Core (`/app/intelligence`)
- **Cross-Modal Causal Pipeline**: Real-time signal propagation demonstrating how market alpha flows trigger regional DataMart spikes, which in turn drive personalized retail procurement recommendations.

### 5. Insight Engine (`/app/insights`)
- **Autonomous Anomaly Decision Center**: Real-time anomaly detection with financial ARR impact projections, quantified driver breakdowns, and 1-click execution dispatchers.

### 6. Customer 360 & Product Matrix (`/app/customers`, `/app/products`)
- **Customer 360**: Account dossier with chronological behavioral lifecycle timelines (`SEARCH` $\rightarrow$ `VIEW` $\rightarrow$ `PURCHASE` $\rightarrow$ `REVIEW`), retention probability, and churn risk.
- **Product Matrix**: Real-time SKU demand velocity telemetry, return rate risk decomposition, and AI recommendation attribution scores.

### 7. Enterprise Data Hub (`/app/data`)
- **Data Governance & Quality Center**: 4-gauge scorecard tracking Completeness (99.2%), Validity (98.8%), Freshness (99.7%), and Consistency (97.9%) with an interactive visual data lineage graph.

---

## 🛠️ Tech Stack & Design System

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling & Aesthetics**: Tailwind CSS with custom Obsidian Glassmorphism token layers
- **Data Visualizations**: Recharts (Walk-Forward Area, Multi-Dimensional Radiant Bar, Drawdown)
- **Kinetic Animations**: Framer Motion
- **Typography**: Plus Jakarta Sans, Inter, JetBrains Mono
- **Canvas Rendering**: 3D Spherical Multi-Plane Orbital Matrix (800+ nodes)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm, pnpm, or yarn

```bash
# 1. Clone the repository
git clone https://github.com/kashyapnasit109/AUREX.git
cd AUREX

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📁 Project Structure

```
AUREX/
├── index.html                  # HTML entry point with Plus Jakarta Sans & Inter typography
├── package.json                # React 19, TypeScript, TailwindCSS, Framer Motion, Recharts
├── tailwind.config.js          # Obsidian, Electric Lime, Arctic Cyan, Emerald tokens
├── vite.config.ts              # Vite configuration with strict TypeScript verification
├── public/
│   └── aurex-logo.svg          # Standalone scalable vector brand mark
├── src/
│   ├── main.tsx                # Application DOM mounting
│   ├── App.tsx                 # React Router routing configuration
│   ├── index.css               # Procedural grain, glassmorphism utilities, CSS variables
│   ├── components/
│   │   ├── brand/
│   │   │   └── AurexLogo.tsx   # Custom vector geometric AUREX brand mark
│   │   ├── canvas/
│   │   │   └── ParticleCore.tsx# Volumetric 3D multi-ring spherical particle orbitor
│   │   ├── common/
│   │   │   ├── AskAurexDrawer.tsx # Cross-platform contextual AI copilot
│   │   │   └── EvidenceDrawer.tsx # Cryptographic SHA-256 provenance drawer
│   │   └── layout/
│   │       ├── AppShell.tsx    # Enterprise layout with persistent navigation rail
│   │       ├── Navbar.tsx      # Floating frosted glass navigation bar
│   │       └── TickerTape.tsx  # High-contrast live system telemetry marquee
│   ├── data/
│   │   └── mockData.ts         # Unified domain models, backtest data, catalog, insights
│   ├── types/
│   │   └── domain.ts           # Shared TypeScript enterprise domain models
│   └── pages/
│       ├── Landing.tsx         # Full-bleed editorial hero & interactive module explorer
│       ├── Overview.tsx        # Executive command center & high-contrast telemetry
│       ├── IntelligenceCore.tsx# Cross-domain causal signal propagation
│       ├── QuantStudio.tsx     # Strategy backtesting, bias guard & stress lab
│       ├── DataMart.tsx        # Multi-dimensional enterprise analytics explorer
│       ├── InsightEngine.tsx   # Autonomous anomaly decision center
│       ├── Aiden.tsx           # Grounded conversational retail commerce assistant
│       ├── Customer360.tsx     # Account dossier & behavioral lifecycle timeline
│       ├── ProductIntelligence.tsx # SKU telemetry & recommendation attribution
│       ├── DataHub.tsx         # Data governance & cryptographic lineage pipeline
│       ├── Security.tsx        # 6-layer trust and governance stack
│       └── Auth.tsx            # Terminal login with biometric authentication
└── DOCUMENTATION.md            # Comprehensive technical specifications & backend blueprint
```

---

## 📖 Full Documentation & Backend Roadmap

For the complete technical blueprint, production database schemas (TimescaleDB, ClickHouse, PostgreSQL/pgvector), and step-by-step AI prompt sequences for backend/database expansion, refer to:  
👉 **[`DOCUMENTATION.md`](./DOCUMENTATION.md)**

---

## 📄 License & Credits

Developed for the **AUREX Enterprise Intelligence Platform**.  
© 2026 AUREX Cognitive Systems. All rights reserved.
