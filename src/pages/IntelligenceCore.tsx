import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Database, Bot, ShieldCheck, Eye } from 'lucide-react';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';
import { RadarCanvas } from '../components/canvas/RadarCanvas';

export const IntelligenceCore: React.FC = () => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(2); // Default active step

  const pipelineSteps = [
    { id: 1, title: 'DATA INGESTION', subtitle: 'DuckDB 1.0M Records', icon: <Database className="w-5 h-5 text-amber-400" />, desc: 'Sub-second OLAP scan across NA, EMEA, APAC, and LATAM transactional hubs.' },
    { id: 2, title: 'ANALYSIS & ANOMALY', subtitle: 'Rolling Z-Score (1.7σ)', icon: <Activity className="w-5 h-5 text-cyan-400" />, desc: 'Statistical z-score spike detected in APAC fulfillment latency (+1.8 days).' },
    { id: 3, title: 'GROUNDED AI INTELLIGENCE', subtitle: 'Aiden Vector Retrieval', icon: <Bot className="w-5 h-5 text-purple-400" />, desc: 'Evaluated 2,410 active catalog SKUs & generated proactive restocking plan.' },
    { id: 4, title: 'QUANT REGIME ALIGNMENT', subtitle: 'Walk-Forward Quarantine', icon: <Zap className="w-5 h-5 text-lime-400" />, desc: 'Synchronized cross-module risk profile into out-of-sample execution ledger.' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold">
              AUREX INTELLIGENCE CORE
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cross-Module Pub/Sub Active (aurex:events)
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            Closed-Loop Telemetry Pipeline & Signal Convergence
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-0.5">
            Unifying quantitative strategy, enterprise analytics, and grounded retail intelligence into a single execution core.
          </p>
        </div>

        <button
          onClick={() => setEvidenceOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>View Provenance Evidence</span>
        </button>
      </div>

      {/* Interactive Pipeline Pipeline Flow Diagram */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Live Cross-Domain Convergence Graph
          </span>
          <span className="text-xs text-lime-400 font-mono font-semibold">0.42ms Engine Latency</span>
        </div>

        {/* 3D Volumetric Signal Radar Canvas */}
        <div className="w-full h-56 rounded-2xl bg-obsidian-950/90 border border-white/5 relative overflow-hidden flex items-center justify-center">
          <RadarCanvas />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {pipelineSteps.map((step) => (
            <motion.div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                activeStep === step.id
                  ? 'bg-lime-500/10 border-lime-500/40 shadow-[0_0_20px_rgba(212,249,56,0.15)]'
                  : 'bg-obsidian-950/60 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-obsidian-900 border border-white/10">
                  {step.icon}
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">0{step.id}</span>
              </div>
              <div>
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">{step.title}</h3>
                <p className="text-[11px] font-mono text-lime-400 font-semibold">{step.subtitle}</p>
              </div>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-Time Signal Stream Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase">DataMart Anomaly</span>
            <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded">1.7σ Spike</span>
          </div>
          <h4 className="text-sm font-bold text-white">APAC Supply Chain Transit Latency</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Fulfillment duration in APAC shifted to 2.47 days (+1.7σ above standard deviation) across 200k sampled DuckDB records.
          </p>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Confidence: <strong className="text-lime-400">98.6%</strong></span>
            <span className="text-emerald-400">Pub/Sub Sent</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase">Aiden AI Recommendation</span>
            <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">Grounded RAG</span>
          </div>
          <h4 className="text-sm font-bold text-white">Proactive APAC Inventory Allocation</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Interception trigger activated: Initiating air freight rerouting for SKU-AUDIO-9000 to mitigate APAC transit bottleneck.
          </p>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Lineage Hash: <strong className="text-purple-400">09654578...</strong></span>
            <span className="text-emerald-400">Verified</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-lime-400 uppercase">Quant Alpha Regime</span>
            <span className="text-[10px] font-mono bg-lime-500/10 text-lime-300 px-2 py-0.5 rounded">Walk-Forward</span>
          </div>
          <h4 className="text-sm font-bold text-white">Regime Shift Risk Alignment</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Out-of-sample execution parameters adjusted: Leverage locked at 1.5x to preserve Sharpe ratio (2.90) under volatility expansion.
          </p>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Sharpe: <strong className="text-lime-400">2.90</strong></span>
            <span className="text-emerald-400">Zero-Bias</span>
          </div>
        </div>
      </div>

      <EvidenceDrawer
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceData={{
          sourceTable: 'AUREX_CROSS_MODULE_EVENT_BUS',
          recordsQueried: '1,000,000 DuckDB Records',
          sha256Hash: '09654578209b36e4377765c4008466c769f16ebed8490ecc4f444a4f3d34a73d',
          timestamp: '2026-08-14 14:10:00 UTC',
          executionMs: 0.42,
          title: 'Cross-Module Telemetry Pipeline Convergence'
        }}
      />
    </div>
  );
};
