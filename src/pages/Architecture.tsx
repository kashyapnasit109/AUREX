import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Database,
  Terminal,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  GitBranch,
  Key,
  Table,
  CheckCircle2,
  ArrowRight,
  Code2,
  Server,
  Lock,
  Activity,
  ChevronRight,
  Info,
  Radio,
  Share2,
  Search,
  Sliders,
  Check,
  RefreshCw,
  Copy
} from 'lucide-react';
import { AurexLogo } from '../components/brand/AurexLogo';

// Database Schema Table Definition
interface DatabaseTable {
  id: string;
  name: string;
  category: 'Catalog' | 'Analytics' | 'Quant' | 'Security' | 'Events' | 'Auth';
  color: string;
  description: string;
  recordsCount: string;
  fields: {
    name: string;
    type: string;
    isPk?: boolean;
    isFk?: boolean;
    isHash?: boolean;
    description: string;
  }[];
}

const DATABASE_SCHEMA: DatabaseTable[] = [
  {
    id: 'catalog_master',
    name: 'DW_RETAIL.CATALOG_MASTER',
    category: 'Catalog',
    color: 'emerald',
    description: 'Master inventory catalog with multi-dimensional acoustic & physical specifications.',
    recordsCount: '124,500 SKUs',
    fields: [
      { name: 'sku', type: 'VARCHAR(64)', isPk: true, description: 'Unique Stock Keeping Unit Identifier' },
      { name: 'product_name', type: 'VARCHAR(256)', description: 'Commercial Item Name' },
      { name: 'category', type: 'VARCHAR(64)', description: 'Product Taxonomy Group' },
      { name: 'price_usd', type: 'DECIMAL(10,2)', description: 'Unit Selling Price' },
      { name: 'stock_level', type: 'INTEGER', description: 'Real-time Warehouse Inventory Count' },
      { name: 'noise_reduction_db', type: 'FLOAT', description: 'Acoustic ANC Attenuation (dB)' },
      { name: 'battery_hours', type: 'FLOAT', description: 'Battery Stamina Duration (Hours)' },
      { name: 'weight_grams', type: 'INTEGER', description: 'Physical Product Weight (Grams)' },
      { name: 'lineage_hash', type: 'CHAR(64)', isHash: true, description: 'SHA-256 Row Integrity Verification Signature' }
    ]
  },
  {
    id: 'datamart_tx',
    name: 'DATAMART_TRANSACTIONS',
    category: 'Analytics',
    color: 'cyan',
    description: 'High-velocity transactional OLAP stream executed in-memory via DuckDB.',
    recordsCount: '42,800,000 Records',
    fields: [
      { name: 'transaction_id', type: 'UUID', isPk: true, description: 'Global Unique Transaction Key' },
      { name: 'timestamp', type: 'TIMESTAMP_TZ', description: 'Sub-millisecond Execution Timestamp' },
      { name: 'region', type: 'VARCHAR(32)', description: 'Geographic Sales Sector' },
      { name: 'sku', type: 'VARCHAR(64)', isFk: true, description: 'Foreign Key to CATALOG_MASTER' },
      { name: 'units_sold', type: 'INTEGER', description: 'Quantity Purchased' },
      { name: 'revenue_usd', type: 'DECIMAL(12,2)', description: 'Gross Transaction Value' },
      { name: 'fulfillment_latency_days', type: 'FLOAT', description: 'Order Delivery Delay Score' },
      { name: 'churn_risk_zscore', type: 'FLOAT', description: 'Statistical Z-Score Anomaly Rating' }
    ]
  },
  {
    id: 'quant_runs',
    name: 'QUANT_STRATEGY_RUNS',
    category: 'Quant',
    color: 'lime',
    description: 'Point-in-Time walk-forward strategy backtest performance registry.',
    recordsCount: '15,200 Backtests',
    fields: [
      { name: 'run_id', type: 'VARCHAR(32)', isPk: true, description: 'Strategy Execution ID (e.g. BT-2026-7000)' },
      { name: 'strategy_name', type: 'VARCHAR(128)', description: 'Quantitative Model Archetype' },
      { name: 'train_split_pct', type: 'FLOAT', description: 'In-Sample / Out-of-Sample Split (50%-85%)' },
      { name: 'sharpe_ratio', type: 'FLOAT', description: 'Annualized Risk-Adjusted Return' },
      { name: 'sortino_ratio', type: 'FLOAT', description: 'Downside Volatility Risk Ratio' },
      { name: 'max_drawdown_pct', type: 'FLOAT', description: 'Maximum Peak-to-Trough Decline (%)' },
      { name: 'annualized_cagr', type: 'FLOAT', description: 'Compound Annual Growth Rate (%)' },
      { name: 'seed_hash', type: 'CHAR(64)', isHash: true, description: 'Reproducibility Cryptographic Hash' }
    ]
  },
  {
    id: 'lineage_audit',
    name: 'LINEAGE_SHA256_AUDIT',
    category: 'Security',
    color: 'indigo',
    description: 'Zero-Hallucination cryptographic audit trail logging exact query grounding states.',
    recordsCount: '1,840,000 Audit Logs',
    fields: [
      { name: 'audit_id', type: 'UUID', isPk: true, description: 'Unique Lineage Event Record' },
      { name: 'timestamp', type: 'TIMESTAMP_TZ', description: 'Audit Signature Generation Time' },
      { name: 'user_prompt', type: 'TEXT', description: 'Raw Input Query Sent to Aiden AI' },
      { name: 'source_tables', type: 'VARCHAR[]', description: 'Catalog & Warehouse Tables Queried' },
      { name: 'matched_skus', type: 'VARCHAR[]', description: 'Vector Similarity Result Set' },
      { name: 'lineage_sha256', type: 'CHAR(64)', isHash: true, description: 'Deterministic SHA-256 Verifiable Hash' },
      { name: 'verification_status', type: 'VARCHAR(16)', description: 'PASS / FAIL Lineage Check' }
    ]
  },
  {
    id: 'users_federation',
    name: 'USERS_FEDERATION',
    category: 'Auth',
    color: 'amber',
    description: 'Role-Based Access Control (RBAC) and enterprise SAML 2.0 user registry.',
    recordsCount: '8,420 Active Users',
    fields: [
      { name: 'user_id', type: 'UUID', isPk: true, description: 'Primary User Identity Identifier' },
      { name: 'email', type: 'VARCHAR(256)', description: 'User Primary Work Email Address' },
      { name: 'password_hash', type: 'VARCHAR(512)', description: 'Argon2id Salted Cryptographic Password Hash' },
      { name: 'role', type: 'VARCHAR(64)', description: 'Institutional Role (Operator, Risk Lead, Admin)' },
      { name: 'org_id', type: 'VARCHAR(64)', description: 'Enterprise SSO Organization Key' },
      { name: 'saml_enabled', type: 'BOOLEAN', description: 'Okta / Azure AD SSO Integration State' }
    ]
  },
  {
    id: 'event_bus_logs',
    name: 'TELEMETRY_EVENT_BUS',
    category: 'Events',
    color: 'purple',
    description: 'Cross-Domain pub/sub telemetry events binding DataMart, Quant, and Aiden AI.',
    recordsCount: '89,400,000 Events',
    fields: [
      { name: 'event_id', type: 'UUID', isPk: true, description: 'Pub/Sub Channel Event Key' },
      { name: 'timestamp', type: 'TIMESTAMP_TZ', description: 'Event Dispatch Time' },
      { name: 'channel', type: 'VARCHAR(64)', description: 'Topic Stream (e.g. aurex:events)' },
      { name: 'source_module', type: 'VARCHAR(32)', description: 'Origin (DataMart / Quant / Aiden)' },
      { name: 'event_type', type: 'VARCHAR(64)', description: 'ANOMALY_SPIKE / REGIME_SHIFT / RESTOCK' },
      { name: 'payload_json', type: 'JSONB', description: 'Structured Telemetry Telemetry Payload' }
    ]
  }
];

export const Architecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'techstack' | 'logics' | 'innovations' | 'schema' | 'pipeline'>('techstack');
  const [selectedTable, setSelectedTable] = useState<DatabaseTable>(DATABASE_SCHEMA[0]);
  const [copiedHash, setCopiedHash] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const sampleSha256 = '8f3a41b09c2e5671d4e9f02b1a8c3d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sampleSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-lime-500/10 border border-lime-500/30 text-lime-400">
                <Layers className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-lime-500/10 text-lime-400 text-xs font-mono font-semibold border border-lime-500/30">
                    PS-05 ARCHITECTURE SPECIFICATION
                  </span>
                  <span className="text-xs text-amber-400 font-mono">• FULL-STACK BLUEPRINT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mt-1">
                  AUREX System Architecture & Innovations
                </h1>
              </div>
            </div>

            {/* HiVizStudios Signature Branding */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/40 text-xs font-sans text-slate-200 shadow-lg">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>Crafted by <strong className="text-white font-bold tracking-wide">HiVizStudios</strong></span>
            </div>
          </div>

          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed font-sans">
            A comprehensive visual specification of the AUREX enterprise cognitive platform. Explore our full technology stack, zero-bias backtesting mathematical engines, grounded vector semantic RAG pipeline, and visual DuckDB database ER schema.
          </p>

          {/* Key Metrics Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-obsidian-850/80 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 font-sans uppercase font-medium">OLAP Latency</div>
              <div className="text-xl font-mono font-bold text-lime-400 mt-0.5">&lt; 0.42 ms</div>
              <div className="text-[10px] text-slate-500">DuckDB In-Memory</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-obsidian-850/80 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 font-sans uppercase font-medium">Look-Ahead Bias</div>
              <div className="text-xl font-mono font-bold text-cyan-400 mt-0.5">0.00 %</div>
              <div className="text-[10px] text-slate-500">Walk-Forward Isolated</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-obsidian-850/80 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 font-sans uppercase font-medium">Data Lineage</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">SHA-256</div>
              <div className="text-[10px] text-slate-500">Cryptographically Audited</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-obsidian-850/80 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 font-sans uppercase font-medium">Telemetry Volume</div>
              <div className="text-xl font-mono font-bold text-purple-400 mt-0.5">42.8M Recs</div>
              <div className="text-[10px] text-slate-500">Sub-Second Processing</div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        <TabButton
          active={activeTab === 'techstack'}
          onClick={() => setActiveTab('techstack')}
          icon={<Cpu className="w-4 h-4" />}
          label="1. Full Tech Stack Matrix"
        />
        <TabButton
          active={activeTab === 'logics'}
          onClick={() => setActiveTab('logics')}
          icon={<Code2 className="w-4 h-4" />}
          label="2. Core Logics & Math"
        />
        <TabButton
          active={activeTab === 'innovations'}
          onClick={() => setActiveTab('innovations')}
          icon={<Sparkles className="w-4 h-4" />}
          label="3. Unique Solution & Innovations"
        />
        <TabButton
          active={activeTab === 'schema'}
          onClick={() => setActiveTab('schema')}
          icon={<Database className="w-4 h-4" />}
          label="4. Visual ER Database Schema"
        />
        <TabButton
          active={activeTab === 'pipeline'}
          onClick={() => setActiveTab('pipeline')}
          icon={<GitBranch className="w-4 h-4" />}
          label="5. Live Telemetry Pipeline"
        />
      </div>

      {/* TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {/* PANEL 1: TECH STACK MATRIX */}
        {activeTab === 'techstack' && (
          <motion.div
            key="techstack"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Full-Stack Technology Ecosystem</h2>
                <p className="text-xs text-slate-400 font-sans">Multi-layered software components powering AUREX</p>
              </div>
              <span className="text-xs font-mono text-lime-400 px-3 py-1 bg-lime-500/10 rounded-full border border-lime-500/20">
                5 Active Subsystems
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <TechStackCard
                category="Frontend Presentation Core"
                badge="Client Layer"
                color="lime"
                icon={<Code2 className="w-5 h-5 text-lime-400" />}
                items={[
                  { name: 'React 19 & TypeScript', desc: 'Strictly typed component architecture with concurrent rendering' },
                  { name: 'Vite 8.2 & TailwindCSS', desc: 'Sub-second HMR bundler with bespoke utility design tokens' },
                  { name: 'Framer Motion 13', desc: 'Fluid spring micro-animations and spatial transition curves' },
                  { name: 'Recharts & Canvas API', desc: 'High-performance interactive charting & 3D Radar Canvas' }
                ]}
              />

              <TechStackCard
                category="Backend & API Gateway"
                badge="Server Layer"
                color="cyan"
                icon={<Server className="w-5 h-5 text-cyan-400" />}
                items={[
                  { name: 'Python 3.13 & FastAPI', desc: 'Asynchronous microsecond RESTful endpoint handlers' },
                  { name: 'Uvicorn & WatchFiles', desc: 'ASGI server with non-blocking worker event loop' },
                  { name: 'Pydantic v2 & Email-Validator', desc: 'Strict binary schema validation & request serialization' },
                  { name: 'Native WebSockets API', desc: 'Real-time telemetry stream broadcasting via /ws/telemetry' }
                ]}
              />

              <TechStackCard
                category="In-Memory OLAP Engine"
                badge="Data Layer"
                color="emerald"
                icon={<Database className="w-5 h-5 text-emerald-400" />}
                items={[
                  { name: 'DuckDB 1.5 OLAP Engine', desc: 'Columnar in-memory analytical SQL processing over 42.8M rows' },
                  { name: 'NumPy & Pandas 2.2', desc: 'Vectorized walk-forward numerical math & matrix computations' },
                  { name: 'SciPy & Scikit-Learn', desc: 'Statistical z-score calculations and signal anomaly scoring' },
                  { name: 'Threadpoolctl & OpenBLAS', desc: 'Multithreaded CPU SIMD hardware acceleration' }
                ]}
              />

              <TechStackCard
                category="AI & Vector Grounding Engine"
                badge="Intelligence Layer"
                color="purple"
                icon={<MessageSquare className="w-5 h-5 text-purple-400" />}
                items={[
                  { name: 'Grounded Semantic RAG', desc: 'Vector attribute distance matching strictly grounded in catalog tables' },
                  { name: 'Multi-Dimension Matcher', desc: 'Acoustic (dB), Battery (Hrs), & Ergonomic (g) scoring matrix' },
                  { name: 'SHA-256 Lineage Hasher', desc: 'Cryptographic proof generation for zero-hallucination verification' },
                  { name: '1-Hour Session Memory', desc: 'Stateful conversation context with visitor profile isolation' }
                ]}
              />

              <TechStackCard
                category="Trust & Security Architecture"
                badge="Governance Layer"
                color="amber"
                icon={<Lock className="w-5 h-5 text-amber-400" />}
                items={[
                  { name: 'Zero Look-Ahead Quarantine', desc: 'Point-in-time walk-forward isolation state machine' },
                  { name: 'SHA-256 Audit Trail', desc: 'Immutable cryptographic hash verification ledger' },
                  { name: 'Argon2id & JWT Auth', desc: 'Salted password hashing & bearer token validation' },
                  { name: 'SAML 2.0 / Okta SSO', desc: 'Role-Based Access Control (RBAC) enterprise federation' }
                ]}
              />

              <TechStackCard
                category="Event Bus & Automation"
                badge="Telemetry Layer"
                color="indigo"
                icon={<Zap className="w-5 h-5 text-indigo-400" />}
                items={[
                  { name: 'aurex:events Pub/Sub Bus', desc: 'In-memory pub/sub channel routing cross-domain events' },
                  { name: 'Autonomous Action Engine', desc: 'Automated order dispatch & risk mitigation triggers' },
                  { name: 'Data Quality Monitor', desc: 'Real-time telemetry for completeness, validity & freshness' },
                  { name: 'HiVizStudios Pipeline', desc: 'Bespoke end-to-end cognitive telemetry orchestration' }
                ]}
              />
            </div>
          </motion.div>
        )}

        {/* PANEL 2: CORE LOGICS & MATH */}
        {activeTab === 'logics' && (
          <motion.div
            key="logics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Core Business Logics & Mathematical Foundations</h2>
                <p className="text-xs text-slate-400 font-sans">The deterministic algorithms powering zero-bias strategy math and grounded AI</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logic 1: Walk-Forward Isolation */}
              <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/30">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">1. Zero Look-Ahead Bias Quarantine Engine</h3>
                  </div>
                  <span className="text-[10px] font-mono text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-full border border-lime-500/20">
                    Point-in-Time Math
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Traditional backtests suffer from look-ahead bias by calculating statistics over the full dataset. AUREX strictly partitions historical price series into <strong className="text-white">In-Sample (Training)</strong> and <strong className="text-white">Out-of-Sample (Validation)</strong> windows.
                </p>

                <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Train Window [t_0 → t_split]</span>
                    <span>Test Window [t_split → t_end]</span>
                  </div>
                  <div className="h-3 w-full bg-obsidian-850 rounded-full overflow-hidden flex">
                    <div className="h-full bg-lime-400 w-[70%]" title="In-Sample (70%)" />
                    <div className="h-full bg-cyan-400 w-[30%]" title="Out-of-Sample (30%)" />
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    $$\text{Sharpe Ratio} = \frac{E[R_p - R_f]}{\sigma_p} \quad \text{evaluated strictly on Out-of-Sample } t > t_{\text{split}}$$
                  </div>
                </div>
              </div>

              {/* Logic 2: Grounded SHA-256 Lineage */}
              <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <Key className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">2. Cryptographic SHA-256 Lineage Ledger</h3>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    Zero-Hallucination
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Aiden AI verifies every single product recommendation with a cryptographic SHA-256 hash. The hash is computed deterministically from the database table name, matched SKUs, query string, and timestamp.
                </p>

                <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Generated SHA-256 Digest:</span>
                    <button
                      onClick={handleCopyHash}
                      className="text-lime-400 hover:text-lime-300 flex items-center gap-1 text-[11px]"
                    >
                      {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? 'Copied!' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-obsidian-850 rounded-lg text-[11px] text-lime-400 break-all border border-white/5">
                    {sampleSha256}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    $$\text{LineageHash} = \text{SHA256}(\text{Table} \parallel \text{SKUs} \parallel \text{Query} \parallel \text{Timestamp})$$
                  </div>
                </div>
              </div>

              {/* Logic 3: DuckDB Z-Score Engine */}
              <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">3. DuckDB Z-Score Anomaly Engine</h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    Statistical Spikes
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  DataMart continuously runs vectorized z-score aggregations over 42.8M transactional records in DuckDB to autonomously identify regional revenue drops or fulfillment latency anomalies.
                </p>

                <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 font-mono text-xs space-y-2">
                  <div className="text-slate-400">SQL Vectorized Aggregation:</div>
                  <pre className="text-[11px] text-cyan-300 bg-obsidian-850 p-2.5 rounded-lg overflow-x-auto">
                    {`SELECT region, (latency - AVG(latency)) / STDDEV(latency) AS z_score
FROM datamart_transactions
GROUP BY region HAVING z_score > 3.0;`}
                  </pre>
                </div>
              </div>

              {/* Logic 4: Closed-Loop Telemetry Bus */}
              <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">4. Closed-Loop Telemetry Convergence</h3>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    Pub/Sub Bus
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Signals from DataMart, Aiden AI, and Quant Studio converge into the in-memory <code className="text-purple-300 bg-purple-500/10 px-1 py-0.5 rounded">aurex:events</code> pub/sub channel, triggering automated workflow dispatches without human latency.
                </p>

                <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Event Payload Stream</span>
                    <span className="text-lime-400 animate-pulse">● LIVE</span>
                  </div>
                  <div className="p-2.5 bg-obsidian-850 rounded-lg text-[11px] text-purple-300 space-y-1">
                    <div>&#123; "event": "ANOMALY_SPIKE", "source": "DataMart", "z_score": 3.42, "action": "RESTOCK_DISPATCH" &#125;</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 3: UNIQUE SOLUTION & INNOVATIONS */}
        {activeTab === 'innovations' && (
          <motion.div
            key="innovations"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">The AUREX Paradigm & Unique Approach</h2>
                <p className="text-xs text-slate-400 font-sans">Why traditional enterprise software silos fail and how AUREX solves PS-05</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Legacy Silos vs AUREX */}
              <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">The Legacy Enterprise Problem</h3>
                    <p className="text-[11px] text-rose-300">Fragmented Software Silos</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong>Quant Trading Sandboxes:</strong> Isolated terminals with zero visibility into enterprise supply chain inventory or customer churn data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong>Lagging BI Dashboards:</strong> Static SQL tools that cannot perform predictive simulation or walk-forward strategy backtests.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong>Black-Box AI Chatbots:</strong> Hallucinating LLMs that fabricate spec data and lack verifiable data lineage to physical warehouse tables.</span>
                  </li>
                </ul>
              </div>

              {/* The AUREX Unified Solution */}
              <div className="p-6 rounded-2xl bg-lime-500/5 border border-lime-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">The AUREX Unified Cognitive Platform</h3>
                    <p className="text-[11px] text-lime-400">Closed-Loop Cognitive Telemetry</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-lime-400 mt-0.5">•</span>
                    <span><strong>Unified Telemetry Pipeline:</strong> Seamless flow from DataMart analytics $\rightarrow$ Aiden AI recommendations $\rightarrow$ Quant Studio backtests.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lime-400 mt-0.5">•</span>
                    <span><strong>Zero Look-Ahead Guarantee:</strong> Point-in-time isolation state machine ensuring strategy backtests never leak future market price data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lime-400 mt-0.5">•</span>
                    <span><strong>Cryptographically Audited AI:</strong> Deterministic SHA-256 data lineage signatures guaranteeing 100% catalog grounding.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Most Interesting Innovation Highlight */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-purple-500/30 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
                    MOST INTERESTING PROJECT INNOVATION
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-white">
                    The Dual-Layer Safeguard: Point-in-Time Math + SHA-256 Verifiable Lineage
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The single most compelling aspect of AUREX is its dual mathematical safeguard: while traditional platforms trust black-box AI and unverified backtests, AUREX enforces <strong>Zero Look-Ahead Bias</strong> on quantitative strategies and <strong>SHA-256 Cryptographic Verification</strong> on conversational AI recommendations. It bridges quantitative math and retail commerce into a single verifiable engine.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  <span>0.42ms DuckDB Processing</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>100% Vector Grounded</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Crafted by HiVizStudios</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 4: VISUAL DATABASE ER SCHEMA */}
        {activeTab === 'schema' && (
          <motion.div
            key="schema"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Visual Entity-Relationship (ER) Database Schema</h2>
                <p className="text-xs text-slate-400 font-sans">Interactive visual node representation of AUREX database tables and field schemas</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Selected Node:</span>
                <span className="text-lime-400 font-bold bg-lime-500/10 px-2.5 py-1 rounded-full border border-lime-500/20">
                  {selectedTable.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Table Nodes Selection */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">
                  Database Table Entities ({DATABASE_SCHEMA.length})
                </div>
                {DATABASE_SCHEMA.map((table) => {
                  const isSelected = selectedTable.id === table.id;
                  return (
                    <div
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-obsidian-850 border-lime-400 shadow-lime-glow'
                          : 'bg-obsidian-900/60 border-white/10 hover:border-white/20 hover:bg-obsidian-850/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Table className={`w-4 h-4 ${isSelected ? 'text-lime-400' : 'text-slate-400'}`} />
                          <span className="font-mono text-xs font-bold text-white">{table.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          table.category === 'Catalog' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          table.category === 'Analytics' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          table.category === 'Quant' ? 'bg-lime-500/10 text-lime-400 border-lime-500/20' :
                          table.category === 'Security' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                          table.category === 'Auth' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {table.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 font-sans line-clamp-2">{table.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-white/5">
                        <span>Fields: {table.fields.length}</span>
                        <span className="text-slate-300 font-semibold">{table.recordsCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed Field Schema Inspection */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 rounded-3xl bg-obsidian-900 border border-white/10 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-lime-500/10 text-lime-400 text-[10px] font-mono border border-lime-500/20">
                          {selectedTable.category} Table
                        </span>
                        <span className="text-xs text-slate-400 font-mono">• {selectedTable.recordsCount}</span>
                      </div>
                      <h3 className="text-xl font-mono font-extrabold text-white mt-1">
                        {selectedTable.name}
                      </h3>
                    </div>

                    <div className="p-2 rounded-xl bg-obsidian-850 border border-white/10 text-slate-400">
                      <Database className="w-5 h-5 text-lime-400" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans">{selectedTable.description}</p>

                  {/* Fields Table */}
                  <div className="overflow-x-auto rounded-2xl border border-white/10 bg-obsidian-950">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-obsidian-850 border-b border-white/10 text-[11px] text-slate-400">
                        <tr>
                          <th className="p-3">Field Name</th>
                          <th className="p-3">Data Type</th>
                          <th className="p-3">Attributes</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedTable.fields.map((field) => (
                          <tr key={field.name} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-slate-200">
                              <span className="flex items-center gap-1.5">
                                {field.isPk && <Key className="w-3.5 h-3.5 text-amber-400" title="Primary Key" />}
                                {field.isFk && <Share2 className="w-3.5 h-3.5 text-cyan-400" title="Foreign Key" />}
                                {field.isHash && <Lock className="w-3.5 h-3.5 text-lime-400" title="SHA-256 Hash" />}
                                <span>{field.name}</span>
                              </span>
                            </td>
                            <td className="p-3 text-lime-400 text-[11px]">{field.type}</td>
                            <td className="p-3">
                              {field.isPk && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] border border-amber-500/20 mr-1">PK</span>}
                              {field.isFk && <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] border border-cyan-500/20 mr-1">FK</span>}
                              {field.isHash && <span className="px-2 py-0.5 rounded bg-lime-500/10 text-lime-400 text-[9px] border border-lime-500/20">SHA256</span>}
                            </td>
                            <td className="p-3 text-slate-400 text-[11px] font-sans">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 5: LIVE TELEMETRY PIPELINE SIMULATOR */}
        {activeTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Interactive Telemetry Pipeline Simulator</h2>
                <p className="text-xs text-slate-400 font-sans">Simulate how data flows end-to-end through AUREX components</p>
              </div>

              <button
                onClick={() => setSimStep((prev) => (prev + 1) % 4)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-lime-glow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Next Stage (Step {simStep + 1}/4)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <PipelineStepCard
                step={1}
                active={simStep === 0}
                title="1. Event Ingestion"
                sub="FastAPI Endpoint"
                desc="Incoming telemetry payload ingested at /api/v1/datamart/query"
                color="cyan"
              />
              <PipelineStepCard
                step={2}
                active={simStep === 1}
                title="2. DuckDB Processing"
                sub="In-Memory OLAP"
                desc="Sub-millisecond query aggregation across 42.8M rows"
                color="lime"
              />
              <PipelineStepCard
                step={3}
                active={simStep === 2}
                title="3. Vector RAG Grounding"
                sub="Aiden AI Core"
                desc="Cosine similarity match and SHA-256 cryptographic lineage hash generation"
                color="purple"
              />
              <PipelineStepCard
                step={4}
                active={simStep === 3}
                title="4. Action Trigger"
                sub="Event Bus"
                desc="Automated restock dispatch published to aurex:events channel"
                color="emerald"
              />
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Simulator Stage Inspector</span>
                <span className="text-lime-400">STAGE {simStep + 1} OF 4 ACTIVE</span>
              </div>
              <div className="p-4 bg-obsidian-950 rounded-xl text-slate-200 border border-white/10">
                {simStep === 0 && (
                  <div>
                    <span className="text-cyan-400 font-bold">[INGESTION]</span> HTTP POST request received at API Gateway with payload: <code className="text-lime-300">&#123; "region": "NORTH_AMERICA", "anomaly_check": true &#125;</code>
                  </div>
                )}
                {simStep === 1 && (
                  <div>
                    <span className="text-lime-400 font-bold">[DUCKDB OLAP]</span> In-memory execution finished in <span className="text-lime-400">0.38ms</span>. Computed regional z-score = <span className="text-amber-400">3.42</span> (Fulfillment delay anomaly detected).
                  </div>
                )}
                {simStep === 2 && (
                  <div>
                    <span className="text-purple-400 font-bold">[AIDEN AI RAG]</span> Matched SKU voyager-pro-anc with 99.4% attribute similarity. Generated SHA-256 lineage hash: <span className="text-lime-400">8f3a41b09c2e5671...</span>
                  </div>
                )}
                {simStep === 3 && (
                  <div>
                    <span className="text-emerald-400 font-bold">[ACTION ENGINE]</span> Order RESTOCK-NA-8840 dispatched to warehouse. Telemetry broadcast to <code className="text-purple-300">aurex:events</code> channel.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER SIGNATURE BANNER */}
      <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs">
        <div className="flex items-center gap-3">
          <AurexLogo size={28} />
          <div>
            <div className="text-white font-bold">AUREX Cognitive Enterprise Systems</div>
            <div className="text-slate-400 text-[11px]">PS-05 Architecture Specification Specification Document</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-purple-500/30 text-slate-300">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>Crafted with excellence by <strong className="text-white font-bold">HiVizStudios</strong></span>
        </div>
      </div>
    </div>
  );
};

// UI HELPER COMPONENTS
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-all select-none ${
      active
        ? 'bg-lime-500 text-obsidian-950 shadow-lime-glow scale-105'
        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface TechStackCardProps {
  category: string;
  badge: string;
  color: string;
  icon: React.ReactNode;
  items: { name: string; desc: string }[];
}

const TechStackCard: React.FC<TechStackCardProps> = ({ category, badge, icon, items }) => (
  <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {icon}
          <h3 className="font-display font-bold text-sm text-white">{category}</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
          {badge}
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {items.map((item) => (
          <div key={item.name} className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              <span>{item.name}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans pl-3">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface PipelineStepCardProps {
  step: number;
  active: boolean;
  title: string;
  sub: string;
  desc: string;
  color: string;
}

const PipelineStepCard: React.FC<PipelineStepCardProps> = ({ step, active, title, sub, desc }) => (
  <div className={`p-4 rounded-2xl border transition-all ${
    active ? 'bg-obsidian-850 border-lime-400 shadow-lime-glow scale-105' : 'bg-obsidian-900 border-white/10 opacity-70'
  }`}>
    <div className="text-[10px] font-mono uppercase text-lime-400 font-bold mb-1">STAGE 0{step}</div>
    <div className="text-sm font-bold text-white">{title}</div>
    <div className="text-[11px] text-slate-400 font-mono mb-2">{sub}</div>
    <p className="text-[11px] text-slate-300 font-sans">{desc}</p>
  </div>
);
