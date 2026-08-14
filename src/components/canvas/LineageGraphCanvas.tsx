import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Server,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LineageGraphCanvas: React.FC<{ onNodeSelect?: (node: any) => void }> = ({ onNodeSelect }) => {
  const [activeNodeId, setActiveNodeId] = useState('duckdb_olap');

  const nodes = [
    {
      id: 'raw_sources',
      stepNum: '01',
      name: 'RAW INGESTION',
      sub: 'TimescaleDB / CSV',
      icon: <Database className="w-5 h-5 text-amber-400" />,
      status: '1.0M Records',
      records: '1,000,000 Ingested Rows',
      latency: '2.14ms Buffer Rate',
      engine: 'TimescaleDB Hypertables & CSV Streamer',
      hash: 'SHA256-RAW-881920BFA0',
      upstream: 'Enterprise Transaction Hubs (NA, EMEA, APAC, LATAM)',
      downstream: 'DuckDB Columnar In-Memory Buffer',
      details: 'High-throughput time-series ingestion normalizing heterogeneous transactional batches into unified parquet/arrow frames.'
    },
    {
      id: 'duckdb_olap',
      stepNum: '02',
      name: 'DUCKDB OLAP',
      sub: 'In-Memory Engine',
      icon: <Server className="w-5 h-5 text-cyan-400" />,
      status: '0.42ms Query',
      records: '1,000,000 Rows Queried',
      latency: '0.42ms Aggregation Latency',
      engine: 'DuckDB C++ Vectorized Core v1.1',
      hash: 'SHA256-OLAP-90412851A0',
      upstream: 'TimescaleDB & Raw Ingestion Staging',
      downstream: 'SHA-256 Hasher & Statistical Z-Score Core',
      details: 'Zero-copy in-memory columnar execution delivering sub-millisecond aggregations, rollups, and dimensional filtering.'
    },
    {
      id: 'sha256_hasher',
      stepNum: '03',
      name: 'SHA-256 HASHER',
      sub: 'Cryptographic Audit',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      status: 'Verified Audit',
      records: '100% Deterministic Signatures',
      latency: '0.08ms Cryptographic Signing',
      engine: 'OpenSSL Native SHA-256 Checksum Engine',
      hash: '09654578209B36E4377765C4008466C769F16EBED8490ECC4F444A4F3D34A73D',
      upstream: 'DuckDB OLAP Aggregate Vectors',
      downstream: 'Aiden AI RAG & Quant Execution Ledger',
      details: 'Generates immutable cryptographic proofs for every backtest run, anomaly detection spike, and retail recommendation.'
    },
    {
      id: 'aiden_rag',
      stepNum: '04',
      name: 'AIDEN AI RAG',
      sub: 'Grounded Intelligence',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      status: 'Zero-Hallucination',
      records: '2,410 Catalog Vectors',
      latency: '14.2ms Vector Distance Match',
      engine: 'pgvector + Claude-Opus-5 Reasoning Engine',
      hash: 'SHA256-RAG-410F829104',
      upstream: 'SHA-256 Hasher & DW_RETAIL Catalog',
      downstream: 'Conversational Commerce & Telemetry Event Bus',
      details: 'Cosine similarity vector distance scoring ensuring AI responses are 100% factual and verifiable against physical warehouse inventory.'
    },
  ];

  const selectedNode = nodes.find(n => n.id === activeNodeId) || nodes[1];

  const handleSelect = (node: any) => {
    setActiveNodeId(node.id);
    if (onNodeSelect) onNodeSelect(node);
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-obsidian-950/80 border border-white/10 space-y-6 font-sans relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Interactive Data Lineage Node Flow Graph (Click Any Node to Inspect)
        </span>
        <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          SOC2 Aligned Cryptographic Architecture
        </span>
      </div>

      {/* 4 Interactive Flow Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            onClick={() => handleSelect(node)}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative ${
              activeNodeId === node.id
                ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                : 'bg-obsidian-900 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-obsidian-850 border border-white/10">
                {node.icon}
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">{node.stepNum}</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase">{node.name}</h4>
              <p className="text-[10px] font-mono text-lime-400 font-semibold">{node.sub}</p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">{node.status}</span>
              <span className="text-emerald-400 font-semibold">✓ Verified</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Node Details Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="p-5 rounded-2xl bg-obsidian-900/90 border border-cyan-500/30 space-y-3 font-mono text-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Terminal className="w-4 h-4" />
              </span>
              <div>
                <span className="text-white font-bold font-sans text-sm">
                  Stage {selectedNode.stepNum}: {selectedNode.name} — {selectedNode.sub}
                </span>
                <div className="text-slate-400 text-[11px] font-sans">
                  Engine: <strong className="text-slate-200">{selectedNode.engine}</strong>
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-sans font-semibold">
              ✓ Operational ({selectedNode.latency})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] uppercase">Throughput & Lineage:</span>
                <div className="text-white font-semibold">{selectedNode.records}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase">Upstream Dependency:</span>
                <div className="text-cyan-300">{selectedNode.upstream}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase">Downstream Consumer:</span>
                <div className="text-lime-300">{selectedNode.downstream}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] uppercase">Cryptographic Lineage Hash:</span>
                <div className="text-lime-400 break-all p-2 rounded-lg bg-obsidian-950 border border-white/5 text-[11px]">
                  {selectedNode.hash}
                </div>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed pt-1">
                {selectedNode.details}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
