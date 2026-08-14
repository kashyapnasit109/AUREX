import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Database,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react';
import { mockCrossDomainSignals } from '../data/mockData';
import { AskAurexDrawer } from '../components/common/AskAurexDrawer';

export const IntelligenceCore: React.FC = () => {
  const [selectedSignal, setSelectedSignal] = useState(mockCrossDomainSignals[0]);
  const [askAurexOpen, setAskAurexOpen] = useState(false);

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      <AskAurexDrawer
        isOpen={askAurexOpen}
        onClose={() => setAskAurexOpen(false)}
        contextTitle={selectedSignal.title}
        contextPrompt={`Explain how this signal bridges ${selectedSignal.sourceDomain} and ${selectedSignal.targetDomain}.`}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold tracking-wide font-mono">
              Central Intelligence Nervous System
            </span>
            <span className="text-xs text-slate-300 font-medium">Cross-Domain Synthesis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            AUREX Intelligence Core
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-1">
            Dynamic cause-and-effect orchestration linking Market Orderflow, Enterprise DataMart, and Grounded Retail Commerce.
          </p>
        </div>

        {/* Global Action Shortcut */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setAskAurexOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 text-obsidian-950 font-bold hover:bg-lime-400 shadow-lime-glow transition-all font-sans"
          >
            <Sparkles className="w-4 h-4" />
            <span>Interrogate Intelligence Core</span>
          </button>
        </div>
      </div>

      {/* Tri-Domain Live Synthesis Architecture Diagram */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-lime-400 font-mono font-semibold uppercase tracking-wider">
              Cross-Modal Causal Pipeline
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Live Multi-Domain Signal Propagation</h3>
          </div>
          <span className="font-mono text-xs text-slate-300 bg-obsidian-950 px-3.5 py-1.5 rounded-full border border-white/10 font-semibold">
            0.42ms Neural Ingestion Latency
          </span>
        </div>

        {/* Symmetrical Causal Flow Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold font-mono mb-2">
                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> 01 • QUANT ALPHA</span>
                <span>Market</span>
              </div>
              <h4 className="font-bold text-white text-sm">Momentum Regime</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                High-Beta Momentum detected with perpetual funding spread surge across perpetuals.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-xs text-cyan-400 font-mono font-bold">
              Sharpe 3.12 • +48.2% CAGR
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-amber-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold font-mono mb-2">
                <span className="flex items-center gap-1.5"><Database className="w-4 h-4" /> 02 • DATAMART</span>
                <span>Regional</span>
              </div>
              <h4 className="font-bold text-white text-sm">APAC Expansion</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                Enterprise renewals in APAC grow +27.6% with high volume-tier pricing conversion.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-xs text-amber-400 font-mono font-bold">
              +$3.82M ARR Expansion
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-lime-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-lime-400 font-bold font-mono mb-2">
                <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> 03 • RETAIL COMMERCE</span>
                <span>Catalog</span>
              </div>
              <h4 className="font-bold text-white text-sm">Grounded Hardware</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                Aiden AI grounds customer queries in 2,410 physical warehouse SKU records.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-xs text-lime-400 font-mono font-bold">
              98.4% Match Precision
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-lime-500/40 bg-lime-950/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-lime-400 font-bold font-mono mb-2">
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> 04 • AUTONOMOUS ACTION</span>
                <span>Execution</span>
              </div>
              <h4 className="font-bold text-white text-sm">Bundle Recommendation</h4>
              <p className="text-xs text-slate-200 leading-relaxed font-sans mt-1 font-medium">
                Target verified VIP travel accounts with dynamic noise-canceling hardware bundles.
              </p>
            </div>
            <button
              onClick={() => setAskAurexOpen(true)}
              className="w-full py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 text-xs font-bold transition-all shadow-lime-glow font-sans"
            >
              Deploy Action
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Domain Signal Feed */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Active Cross-Domain Telemetry Signals</h3>
          <span className="text-xs font-mono text-slate-400 font-semibold">{mockCrossDomainSignals.length} Active Signals</span>
        </div>

        <div className="space-y-4">
          {mockCrossDomainSignals.map((signal) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-7 rounded-3xl border border-white/10 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full border border-lime-500/25">
                    {signal.id}
                  </span>
                  <span className="text-base font-bold text-white">{signal.title}</span>
                </div>
                <span className="font-mono text-xs text-slate-300 font-medium">{signal.timestamp}</span>
              </div>

              {/* Step-by-Step Causal Trace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
                {signal.causalFlow.map((step, idx) => (
                  <div key={idx} className="p-4 bg-obsidian-950 rounded-2xl border border-white/10 space-y-1.5 flex flex-col justify-between">
                    <div className="text-cyan-400 font-mono text-xs font-bold">STAGE 0{idx + 1}</div>
                    <div className="text-slate-200 text-xs leading-relaxed font-medium">{step}</div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-sans font-medium text-xs">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Recommendation: <strong className="text-white">{signal.recommendedAction}</strong></span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedSignal(signal);
                      setAskAurexOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-white/15 font-semibold text-xs transition-all"
                  >
                    Ask AUREX
                  </button>
                  <button
                    onClick={() => setAskAurexOpen(true)}
                    className="px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold shadow-lime-glow text-xs transition-all"
                  >
                    Execute Workflow
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
