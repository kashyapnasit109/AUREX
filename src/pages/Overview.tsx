import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Terminal,
  Database,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingUp,

} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { generateEquityData, mockAutonomousInsights } from '../data/mockData';

export const Overview: React.FC = () => {
  const equityData = generateEquityData(60, 1.2);

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      {/* Top Banner / Pulse Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold tracking-wide">
              Tri-Domain Intelligence Nexus
            </span>
            <span className="text-xs text-slate-300 font-medium">Synchronized</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            Executive Command Center
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-1">
            Real-time orchestration across quantitative risk, multi-dimensional data, and conversational retail AI.
          </p>
        </div>

        {/* Global Action Shortcut */}
        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/app/quant"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-200 hover:border-lime-500/30 transition-all font-sans font-semibold shadow-sm"
          >
            <Terminal className="w-4 h-4 text-lime-400" />
            <span>Launch Backtest</span>
          </Link>
          <Link
            to="/app/aiden"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-500 text-obsidian-950 font-bold hover:bg-lime-400 shadow-lime-glow transition-all font-sans"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult Aiden</span>
          </Link>
        </div>
      </div>

      {/* Pulse KPI Grid (4 Domain Anchors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Quant Portfolio Return */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5 rounded-2xl border-l-2 border-l-lime-400 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2 font-medium">
            <span>Active Strategy Alpha</span>
            <Terminal className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">+48.2%</div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
            <span className="text-emerald-400 font-semibold">Sharpe 2.84 • Win 64.8%</span>
            <span className="text-slate-300 font-mono">BTC / ETH</span>
          </div>
        </motion.div>

        {/* Metric 2: Enterprise Revenue Ingestion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="glass-card p-5 rounded-2xl border-l-2 border-l-cyan-400 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2 font-medium">
            <span>DataMart ARR Velocity</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">$58.8M</div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
            <span className="text-cyan-400 font-semibold">+18.4% YoY Expansion</span>
            <span className="text-slate-300 font-mono">42.8M Tx</span>
          </div>
        </motion.div>

        {/* Metric 3: Aiden AI Assist Volume */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-5 rounded-2xl border-l-2 border-l-amber-400 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2 font-medium">
            <span>Aiden Conversion Multiple</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">3.2x LTV</div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
            <span className="text-amber-400 font-semibold">98.4% Match Precision</span>
            <span className="text-slate-300 font-mono">8.4k Queries</span>
          </div>
        </motion.div>

        {/* Metric 4: Zero-Bias Verification */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="glass-card p-5 rounded-2xl border-l-2 border-l-emerald-400 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2 font-medium">
            <span>Look-Ahead Bias Guard</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-400 tracking-tight">100% Pass</div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
            <span className="text-slate-200 font-semibold">Point-in-Time Verified</span>
            <span className="text-emerald-400">Zero Leakage</span>
          </div>
        </motion.div>
      </div>

      {/* Main Asymmetric Analytical Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Cross-Module Simulation & Volume Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-8 glass-card p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs mb-1 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                <span>Active Simulation Telemetry</span>
              </div>
              <h3 className="text-xl font-sans font-bold text-white">
                Momentum Alpha Multi-Regime Equity Curve
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-obsidian-950 border border-white/10 text-slate-200">
                In-Sample: $100k → $148.2k
              </span>
              <span className="px-3 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                OOS Validated
              </span>
            </div>
          </div>

          {/* High-Performance Recharts Area */}
          <div className="w-full h-72 md:h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverviewStrat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4F938" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#D4F938" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOverviewBench" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#334155"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  stroke="#334155"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0f17',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark (BTC Index)"
                  stroke="#00E5FF"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorOverviewBench)"
                />
                <Area
                  type="monotone"
                  dataKey="strategy"
                  name="AUREX Alpha v4"
                  stroke="#D4F938"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOverviewStrat)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-white/10 font-mono text-center text-xs">
            <div>
              <div className="text-slate-400 text-xs">Total Return</div>
              <div className="text-lime-400 font-bold text-sm mt-0.5">+48.20%</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Max Drawdown</div>
              <div className="text-coral-400 font-bold text-sm mt-0.5">-8.10%</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Execution Latency</div>
              <div className="text-cyan-400 font-bold text-sm mt-0.5">Real-Time</div>
            </div>

          </div>
        </motion.div>

        {/* Right 4 Cols: High-Visibility High-Conviction Signals Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Signal Radar with Highly Visible Typography & Styling */}
          <div className="glass-card p-6 rounded-3xl border border-white/15 flex-1 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                <span className="text-sm text-amber-400 font-bold flex items-center gap-2 font-sans tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  High-Conviction Signals
                </span>
                <span className="text-xs text-lime-400 font-mono font-semibold bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">
                  Live Feed
                </span>
              </div>

              <div className="space-y-4">
                {mockAutonomousInsights.slice(0, 2).map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 bg-obsidian-950 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all space-y-2.5"
                  >
                    {/* Category & Confidence */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300 font-semibold bg-white/5 px-2 py-0.5 rounded">
                        {insight.category}
                      </span>
                      <span className="font-mono text-xs text-lime-400 font-bold">
                        {insight.confidence}
                      </span>
                    </div>

                    {/* Headline */}
                    <h4 className="text-white text-sm font-bold font-sans leading-snug">
                      {insight.title}
                    </h4>

                    {/* Highly Legible Body */}
                    <p className="text-slate-200 text-xs leading-relaxed font-sans font-normal">
                      {insight.description}
                    </p>

                    {/* Action Guideline */}
                    <div className="pt-2 border-t border-white/10 flex items-start gap-1.5 text-xs text-amber-300 font-sans font-medium">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{insight.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/app/query-studio"
              className="mt-5 w-full text-center py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 text-xs transition-all flex items-center justify-center gap-2 font-sans font-bold shadow-lg"
            >
              <span>Open Query Studio & Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Unified Analytics & Capabilities Section (Matching Screenshot 1 & 3) */}
      <div className="rounded-3xl bg-obsidian-850 border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            Enterprise Architecture
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Unified Analytics & Intelligence Capabilities
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Engineered for quantitative research, business analytics, and generative decision-making in a single governed pipeline.
          </p>
        </div>

        {/* 8 Core Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/5 space-y-2 hover:border-cyan-400/30 transition-all">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>Quantitative Backtesting</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Run historical strategy simulations with bias-aware execution and drawdown benchmark comparisons.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/5 space-y-2 hover:border-emerald-400/30 transition-all">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Database className="w-4 h-4" />
              <span>DataMart SQL Analytics</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Transform raw transactional datasets into industrial-grade BI powered by DuckDB analytical processing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/5 space-y-2 hover:border-lime-400/30 transition-all">
            <div className="flex items-center gap-2 text-lime-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Retail AI Assistant</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Query enterprise datasets in natural language and receive dataset-aware, explainable recommendations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/5 space-y-2 hover:border-purple-400/30 transition-all">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Bias Quarantine</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ground executive and operational decisions in reproducible, auditable dataset evidence.
            </p>
          </div>
        </div>

        {/* Quick Actions Router */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <Link
            to="/app/query-studio"
            className="p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-cyan-400/40 text-center font-bold text-cyan-300 hover:text-white transition-all"
          >
            ⚡ Open Query Builder
          </Link>
          <Link
            to="/app/data"
            className="p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-purple-400/40 text-center font-bold text-purple-300 hover:text-white transition-all"
          >
            📦 Ingest Datasets
          </Link>
          <Link
            to="/app/quant"
            className="p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-amber-400/40 text-center font-bold text-amber-300 hover:text-white transition-all"
          >
            📈 Run Backtest
          </Link>
          <Link
            to="/app/aiden"
            className="p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-lime-400/40 text-center font-bold text-lime-300 hover:text-white transition-all"
          >
            💬 Consult Aiden AI
          </Link>
        </div>
      </div>
    </div>
  );
};

