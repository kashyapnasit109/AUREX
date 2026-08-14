import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { ParticleCore } from '../components/canvas/ParticleCore';
import { TickerTape } from '../components/layout/TickerTape';
import { AurexLogo } from '../components/brand/AurexLogo';

export const Landing: React.FC = () => {
  const [activePreview, setActivePreview] = useState<'quant' | 'datamart' | 'aiden'>('quant');

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 font-sans overflow-x-hidden relative bg-grain">
      {/* Floating Pill Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Top Header Telemetry Badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 font-mono text-xs text-slate-400"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              AUREX System Online
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300 font-sans">Autonomous Enterprise Cognitive Architecture</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>4.89 PFLOPS Synchronized</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Look-Ahead Bias Guard</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Grid: Populous Editorial Typography Left, Grand Volumetric Particle Orbitor Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-12">
          {/* Headline & Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start z-10"
          >
            <div className="inline-block mb-6 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-xs tracking-wider">
              Unified Analytics • Quant Intelligence • Retail AI
            </div>

            {/* Populous-inspired clean editorial headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight leading-[1.05] text-white mb-6">
              See the signal. <br />
              <span className="text-slate-400 font-normal">Architect the system.</span> <br />
              <span className="text-lime-400 text-glow-lime">Decide with certainty.</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed mb-8 font-sans font-normal">
              AUREX unifies fragmented market flows, multi-dimensional enterprise data, and conversational customer intelligence into a singular, high-precision cognitive platform.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/app/overview"
                className="inline-flex items-center space-x-3 bg-lime-500 hover:bg-lime-400 text-obsidian-950 px-7 py-3.5 rounded-full font-sans font-bold text-sm transition-all duration-200 shadow-lime-glow hover:scale-105 active:scale-95 group"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/app/quant"
                className="inline-flex items-center space-x-2 text-slate-300 hover:text-white px-6 py-3.5 rounded-full font-mono text-xs border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all"
              >
                <span>Test Strategy Engine</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-lime-400" />
              </Link>
            </div>
          </motion.div>

          {/* Clean, Volumetric 3D Particle Intelligence Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] w-full"
          >
            <ParticleCore className="w-full h-full" customRadius={240} particleCount={800} />

            {/* Seamless, Non-Intrusive Bottom Telemetry Capsule */}
            <div className="mt-4 inline-flex items-center gap-4 px-4 py-2 rounded-full glass-pill border border-white/10 text-xs font-sans shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                <span className="text-white font-medium">Neural Convergence:</span>
                <span className="font-mono text-lime-400 font-bold">99.8%</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="text-slate-300 text-xs">
                Fusing 3 Data Streams in <span className="text-cyan-400 font-mono font-semibold">0.42ms</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive Module Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Interactive Surface Explorer
            </span>
            <div className="flex items-center gap-2 p-1 bg-obsidian-850 rounded-full border border-white/10">
              <button
                onClick={() => setActivePreview('quant')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs transition-all ${
                  activePreview === 'quant'
                    ? 'bg-lime-500 text-obsidian-950 font-bold shadow-lime-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                01 Quant Studio
              </button>
              <button
                onClick={() => setActivePreview('datamart')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs transition-all ${
                  activePreview === 'datamart'
                    ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-cyan-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                02 DataMart
              </button>
              <button
                onClick={() => setActivePreview('aiden')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs transition-all ${
                  activePreview === 'aiden'
                    ? 'bg-amber-500 text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                03 Aiden AI
              </button>
            </div>
          </div>

          {/* Interactive Preview Card Container */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
            {activePreview === 'quant' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-lime-400 font-mono text-xs uppercase tracking-wider bg-lime-500/10 px-2.5 py-1 rounded border border-lime-500/20 font-semibold">
                    Zero Look-Ahead Simulation
                  </span>
                  <h3 className="text-2xl font-sans font-bold text-white">
                    Quant Strategy Studio
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-sans">
                    Rigorous walk-forward validation separating in-sample training from out-of-sample execution to eliminate backtesting bias.
                  </p>
                  <Link
                    to="/app/quant"
                    className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 font-mono text-xs pt-2"
                  >
                    <span>Launch Strategy Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="md:col-span-2 bg-obsidian-950/80 rounded-xl p-5 border border-white/5 font-mono text-xs">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                    <span className="text-slate-300">Momentum Alpha v4 (BTC-PERP)</span>
                    <span className="text-emerald-400 font-bold">Sharpe 2.84 • Sortino 3.65</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-obsidian-850 rounded-lg">
                      <div className="text-xs text-slate-400">Max Drawdown</div>
                      <div className="text-coral-400 font-bold text-lg mt-1">-8.1%</div>
                    </div>
                    <div className="p-3 bg-obsidian-850 rounded-lg">
                      <div className="text-xs text-slate-400">Win Rate</div>
                      <div className="text-emerald-400 font-bold text-lg mt-1">64.8%</div>
                    </div>
                    <div className="p-3 bg-obsidian-850 rounded-lg">
                      <div className="text-xs text-slate-400">CAGR</div>
                      <div className="text-lime-400 font-bold text-lg mt-1">+48.2%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreview === 'datamart' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-cyan-400 font-mono text-xs uppercase tracking-wider bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 font-semibold">
                    Real-Time Dimensional Aggregation
                  </span>
                  <h3 className="text-2xl font-sans font-bold text-white">
                    DataMart Intelligence
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-sans">
                    Ingest 40M+ transaction logs, slice by dynamic customer cohorts, and automatically surface high-conviction anomalies.
                  </p>
                  <Link
                    to="/app/datamart"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs pt-2"
                  >
                    <span>Open Analytics Explorer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="md:col-span-2 bg-obsidian-950/80 rounded-xl p-5 border border-white/5 font-mono text-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-300">Autonomous Insight #892</span>
                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">99.4% Confidence</span>
                  </div>
                  <div className="text-white font-medium text-sm mb-2 font-sans">
                    North America Enterprise Renewals Up +24.2% MoM
                  </div>
                  <p className="text-slate-300 text-xs mb-3 font-sans">
                    Automated pricing elasticity engine reduced churn across mid-market cohorts, generating +$3.82M in incremental ARR.
                  </p>
                </div>
              </div>
            )}

            {activePreview === 'aiden' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-semibold">
                    Structured Data Grounding
                  </span>
                  <h3 className="text-2xl font-sans font-bold text-white">
                    Aiden Retail AI
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-sans">
                    Conversational procurement engine with transparent reasoning scores, real-time inventory telemetry, and verifiable warehouse lineage.
                  </p>
                  <Link
                    to="/app/aiden"
                    className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-mono text-xs pt-2"
                  >
                    <span>Chat with Aiden</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="md:col-span-2 bg-obsidian-950/80 rounded-xl p-5 border border-white/5 font-mono text-xs">
                  <div className="flex items-center gap-2 text-lime-400 text-xs mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Aiden Reasoning Breakdown</span>
                  </div>
                  <div className="text-slate-200 text-xs mb-3 font-sans">
                    "Matched Sony WH-1000XM5 (98.4% Match): Cabin ANC 99%, Battery 95%, Weight Ergonomics 94%."
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Grounded in DW_RETAIL.CATALOG_MASTER (2,410 rows verified)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Marquee Telemetry Ticker */}
      <TickerTape />

      {/* Tri-Domain Convergence Visual Pipeline Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-lime-400 uppercase tracking-widest bg-lime-500/10 px-3 py-1 rounded-full border border-lime-500/20 font-semibold">
            The Architectural Paradigm
          </span>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mt-4 mb-6">
            Three Disconnected Workflows. <br />
            <span className="text-slate-400 font-normal">One Unified Cognitive Core.</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed font-sans">
            Traditional enterprises maintain separate silos for quantitative risk, BI dashboards, and AI bots. AUREX converges all three into a single closed-loop telemetry pipeline: <strong className="text-white font-mono">DATA → ANALYSIS → INTELLIGENCE → DECISION → ACTION</strong>.
          </p>
        </div>

        {/* Visual 3-to-1-to-3 Convergence Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Input Data Streams */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-4 font-semibold">
              01 • Enterprise Ingestion
            </h4>
            <div className="glass-card p-5 rounded-2xl border-l-2 border-l-cyan-400">
              <div className="font-sans font-bold text-white text-base mb-1">Market Tick & Orderflow</div>
              <div className="font-mono text-xs text-slate-400">L2/L3 orderbook depth, perpetual funding rates, and volume-weighted indicators.</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border-l-2 border-l-amber-400">
              <div className="font-sans font-bold text-white text-base mb-1">Transactional DataMart</div>
              <div className="font-mono text-xs text-slate-400">Omnichannel revenue, cohort retention, and fulfillment logistics latency.</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border-l-2 border-l-lime-400">
              <div className="font-sans font-bold text-white text-base mb-1">Customer Behavioral Signals</div>
              <div className="font-mono text-xs text-slate-400">Conversational intent, product affinity scores, and real-time inventory telemetry.</div>
            </div>
          </div>

          {/* Central AUREX Core Node */}
          <div className="flex flex-col items-center justify-center p-8 glass-card rounded-3xl border border-lime-500/30 text-center relative shadow-2xl">
            <div className="mb-4">
              <AurexLogo size={56} />
            </div>
            <h3 className="text-2xl font-sans font-bold text-white mb-1">AUREX Core</h3>
            <p className="font-mono text-xs text-lime-400 tracking-wider uppercase mb-4 font-semibold">
              Cross-Modal Cognitive Engine
            </p>
            <div className="space-y-1 text-xs font-mono text-slate-300 bg-obsidian-950 p-3 rounded-xl w-full border border-white/5">
              <div>• Zero Look-Ahead Isolation</div>
              <div>• 0.42ms Inference Latency</div>
              <div>• Verifiable Data Lineage</div>
            </div>
          </div>

          {/* Output Intelligence Surfaces */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-4 font-semibold">
              02 • Decision Surfaces
            </h4>
            <Link to="/app/quant" className="block glass-card p-5 rounded-2xl border-r-2 border-r-cyan-400 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-center mb-1">
                <div className="font-sans font-bold text-white text-base">Quant Studio</div>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="font-mono text-xs text-slate-400">Backtested execution alphas with mathematical Sharpe and drawdown proof.</div>
            </Link>
            <Link to="/app/datamart" className="block glass-card p-5 rounded-2xl border-r-2 border-r-amber-400 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-center mb-1">
                <div className="font-sans font-bold text-white text-base">DataMart Analytics</div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="font-mono text-xs text-slate-400">Autonomous business insights with confidence scores and action guides.</div>
            </Link>
            <Link to="/app/aiden" className="block glass-card p-5 rounded-2xl border-r-2 border-r-lime-400 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-center mb-1">
                <div className="font-sans font-bold text-white text-base">Aiden Assistant</div>
                <ArrowRight className="w-4 h-4 text-lime-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="font-mono text-xs text-slate-400">Grounded conversational commerce with structured match reasoning.</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Trust & Recognition */}
      <section className="py-20 bg-obsidian-950 border-t border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Institutional Credibility & Reliability Standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
              <div className="font-sans font-bold text-lg text-white mb-2">Zero Look-Ahead Bias</div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                Strict chronological point-in-time state reconstruction ensures no future price leaks contaminate backtest alphas.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <Lock className="w-8 h-8 text-cyan-400 mb-4" />
              <div className="font-sans font-bold text-lg text-white mb-2">Cryptographic Auditability</div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                Every AI query and quantitative execution is hashed with complete data lineage back to immutable warehouse records.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <Zap className="w-8 h-8 text-lime-400 mb-4" />
              <div className="font-sans font-bold text-lg text-white mb-2">Sub-Millisecond Execution</div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                Distributed Rust/C++ simulation runtime delivering 1.84M operations per second across multi-asset portfolios.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-8 h-8 text-amber-400 mb-4" />
              <div className="font-sans font-bold text-lg text-white mb-2">Enterprise Ready</div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                Role-based access control, SOC2 Type II compliant pipelines, and instant export capabilities for institutional stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action & Footer */}
      <footer className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <div className="mb-2">
              <AurexLogo size={36} withText textClassName="text-2xl" />
            </div>
            <p className="font-sans text-xs text-slate-300 max-w-md mt-2">
              Enterprise Intelligence Platform uniting Quantitative Strategy, Analytics, and Retail AI.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/app/overview"
              className="inline-flex items-center space-x-2 bg-lime-500 hover:bg-lime-400 text-obsidian-950 px-6 py-3 rounded-full font-bold text-xs shadow-lime-glow transition-all font-sans"
            >
              <span>Launch Platform</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 font-mono text-xs text-slate-400">
          <div>© 2026 AUREX Cognitive Systems. All rights reserved.</div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link to="/security" className="hover:text-slate-200">Trust & Security</Link>
            <Link to="/login" className="hover:text-slate-200">Terminal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
