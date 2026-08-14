import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Database,
  TrendingUp,
} from 'lucide-react';
import { mockEnterpriseInsights } from '../data/mockData';
import type { EnterpriseInsight, EvidenceTrace } from '../types/domain';
import { AskAurexDrawer } from '../components/common/AskAurexDrawer';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';

export const InsightEngine: React.FC = () => {
  const [insights] = useState<EnterpriseInsight[]>(mockEnterpriseInsights);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeEvidence, setActiveEvidence] = useState<EvidenceTrace | null>(null);
  const [askAurexOpen, setAskAurexOpen] = useState(false);
  const [activeInsight, setActiveInsight] = useState<EnterpriseInsight>(mockEnterpriseInsights[0]);

  const filteredInsights = selectedCategory === 'ALL'
    ? insights
    : insights.filter((i) => i.category === selectedCategory);

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      <AskAurexDrawer
        isOpen={askAurexOpen}
        onClose={() => setAskAurexOpen(false)}
        contextTitle={activeInsight.title}
        contextPrompt={`Explain the drivers and recommendations for insight: ${activeInsight.title}`}
      />

      <EvidenceDrawer
        isOpen={!!activeEvidence}
        onClose={() => setActiveEvidence(null)}
        evidence={activeEvidence}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold tracking-wide font-mono">
              Autonomous Decision System
            </span>
            <span className="text-xs text-slate-300 font-medium">Continuous Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            AUREX Insight Engine
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-1">
            Automated anomaly detection, causal driver decomposition, and actionable enterprise execution guides.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 p-1.5 bg-obsidian-850 rounded-2xl border border-white/15 text-xs font-sans">
          {['ALL', 'REVENUE', 'SUPPLY', 'ARBITRAGE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition-all font-semibold text-xs ${
                selectedCategory === cat
                  ? 'bg-lime-500 text-obsidian-950 shadow-lime-glow font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border-l-2 border-l-lime-400 flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-semibold uppercase">Net Projected ARR Impact</div>
          <div className="text-3xl font-mono font-bold text-white mt-2">+$4.71M</div>
          <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Across 3 High-Conviction Signals
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-2 border-l-cyan-400 flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-semibold uppercase">Average Anomaly Confidence</div>
          <div className="text-3xl font-mono font-bold text-cyan-400 mt-2">98.1%</div>
          <div className="text-xs text-slate-300 font-medium mt-2">Validated by Deterministic Warehouse Grounding</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-2 border-l-amber-400 flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-semibold uppercase">Automated Actions Ready</div>
          <div className="text-3xl font-mono font-bold text-amber-400 mt-2">6 Actions</div>
          <div className="text-xs text-amber-300 font-semibold mt-2">1-Click Dispatch Available</div>
        </div>
      </div>

      {/* Insight Decision Cards */}
      <div className="space-y-6">
        {filteredInsights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 rounded-3xl border border-white/15 space-y-5 shadow-2xl"
          >
            {/* Top Insight Badge Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full border border-lime-500/25">
                  {insight.signal}
                </span>
                <span className="text-xs text-slate-300 font-mono font-medium">{insight.createdAt}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-300">Confidence: <strong className="text-lime-400 font-bold">{insight.confidence}</strong></span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/25 text-xs">
                  {insight.impact}
                </span>
              </div>
            </div>

            {/* Title & Core Reason */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{insight.title}</h3>
              <p className="text-slate-200 text-sm leading-relaxed font-sans font-normal">{insight.why}</p>
            </div>

            {/* Drivers Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {insight.drivers.map((driver, idx) => (
                <div key={idx} className="p-4 bg-obsidian-950 rounded-2xl border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-200 font-semibold">{driver.label}</span>
                  <span className={`font-mono text-sm font-bold ${driver.positive ? 'text-emerald-400' : 'text-coral-400'}`}>
                    {driver.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommendation Box */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">AUREX Strategic Recommendation</div>
                <div className="text-xs text-slate-100 font-sans leading-relaxed font-medium">{insight.recommendation}</div>
              </div>
            </div>

            {/* Action Bar & Provenance Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setActiveEvidence(insight.evidence)}
                className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>View Evidence Trace ({insight.evidence.recordCount.toLocaleString()} Records • SHA-256)</span>
              </button>

              <div className="flex items-center gap-3 text-xs font-sans">
                <button
                  onClick={() => {
                    setActiveInsight(insight);
                    setAskAurexOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-white/15 font-semibold text-xs transition-all"
                >
                  Ask AUREX
                </button>
                <button
                  onClick={() => {
                    setActiveInsight(insight);
                    setAskAurexOpen(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold shadow-lime-glow text-xs transition-all"
                >
                  Trigger Action
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
