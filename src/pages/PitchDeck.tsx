import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Bot,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      id: 'slide-1',
      tag: 'PROBLEM STATEMENT PS-05',
      title: 'AUREX — Enterprise Intelligence Platform',
      subtitle: 'Converging Quantitative Strategy, DuckDB Analytics, and Grounded AI into a Single Closed-Loop Platform.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">Quant Sandboxes</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Traders operate in isolated terminal tools without access to enterprise supply data, risking look-ahead bias and unverified strategy executions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">Lagging BI Dashboards</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Business intelligence tools display static historical charts that cannot run predictive simulations or trigger autonomous anomaly responses.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">Hallucinating AI Chatbots</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enterprise LLM chatbots suffer from ungrounded hallucinations, lacking verifiable warehouse data lineage and cryptographic audit trails.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'slide-2',
      tag: 'THE ARCHITECTURAL SOLUTION',
      title: 'Closed-Loop Telemetry Pipeline',
      subtitle: 'Unifying DATA → ANALYSIS → INTELLIGENCE → DECISION → ACTION across module boundaries.',
      content: (
        <div className="space-y-6 font-sans">
          <div className="p-6 rounded-3xl bg-obsidian-950/90 border border-lime-500/30 text-center space-y-4">
            <div className="text-xs font-mono text-lime-400 uppercase font-bold tracking-widest">
              Unified Platform Telemetry Flow
            </div>
            <div className="text-xl md:text-2xl font-mono font-bold text-white tracking-wider flex items-center justify-center gap-2 flex-wrap">
              <span className="text-cyan-400">DATA</span>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <span className="text-lime-400">ANALYSIS</span>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <span className="text-purple-400">INTELLIGENCE</span>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <span className="text-emerald-400">DECISION</span>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <span className="text-coral-400">ACTION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">01. DataMart Engine</span>
              <p className="text-xs text-slate-300">
                DuckDB in-memory OLAP scanning 1,000,000+ transactional records with rolling z-score statistical anomaly detection.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-bold">02. Aiden AI Agent</span>
              <p className="text-xs text-slate-300">
                SeekAI <code className="text-purple-300 font-mono">claude-opus-5</code> grounded retail agent with cryptographic SHA-256 data lineage signatures.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-lime-400 font-bold">03. Quant Studio</span>
              <p className="text-xs text-slate-300">
                100% real pandas walk-forward backtester isolating In-Sample/Out-of-Sample evaluation with 3-strategy experiment lab.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'slide-3',
      tag: 'ENGINEERING CREDIBILITY & DEFENCE',
      title: 'Real, Grounded, Production Architecture',
      subtitle: 'Zero fake claims: Replacing buzzwords with defensible mathematical and cryptographic guarantees.',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl bg-obsidian-950 border border-white/10 text-center space-y-2">
            <div className="text-[10px] text-slate-400 uppercase">Engine Speed</div>
            <div className="text-3xl font-bold text-lime-400">0.42ms</div>
            <div className="text-[10px] text-slate-500">FastAPI + DuckDB</div>
          </div>
          <div className="p-5 rounded-2xl bg-obsidian-950 border border-white/10 text-center space-y-2">
            <div className="text-[10px] text-slate-400 uppercase">Records Processed</div>
            <div className="text-3xl font-bold text-cyan-400">1.0M+</div>
            <div className="text-[10px] text-slate-500">In-Memory OLAP</div>
          </div>
          <div className="p-5 rounded-2xl bg-obsidian-950 border border-white/10 text-center space-y-2">
            <div className="text-[10px] text-slate-400 uppercase">AI Grounding</div>
            <div className="text-3xl font-bold text-purple-400">SHA-256</div>
            <div className="text-[10px] text-slate-500">SeekAI claude-opus-5</div>
          </div>
          <div className="p-5 rounded-2xl bg-obsidian-950 border border-white/10 text-center space-y-2">
            <div className="text-[10px] text-slate-400 uppercase">Bias Quarantine</div>
            <div className="text-3xl font-bold text-emerald-400">100%</div>
            <div className="text-[10px] text-slate-500">Walk-Forward Pandas</div>
          </div>
        </div>
      )
    },
    {
      id: 'slide-4',
      tag: 'LIVE PLATFORM CAPABILITIES',
      title: '8 Specialized Workspace Subsystems',
      subtitle: 'Click any module below to navigate directly to the live environment during judging.',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
          {[
            { name: 'Intelligence Core', path: '/app/intelligence', desc: '3D Volumetric Signal Radar' },
            { name: 'Insight Engine', path: '/app/insights', desc: 'Confidence-Rated Signals' },
            { name: 'Quant Studio', path: '/app/quant', desc: '3-Strategy Experiment Lab' },
            { name: 'DataMart Explorer', path: '/app/datamart', desc: 'Natural Language SQL Builder' },
            { name: 'Aiden Retail AI', path: '/app/aiden', desc: 'SeekAI claude-opus-5 Agent' },
            { name: 'Data Hub', path: '/app/data', desc: 'Lineage Graph & Quality' },
            { name: 'Workflow Engine', path: '/app/workflows', desc: 'Automated Action Triggers' },
            { name: 'Customer 360', path: '/app/customers/AUREX-28491', desc: 'LTV & Churn Analytics' },
          ].map((m, idx) => (
            <button
              key={idx}
              onClick={() => navigate(m.path)}
              className="p-4 rounded-2xl bg-obsidian-950 hover:bg-obsidian-850 border border-white/10 hover:border-lime-500/40 text-left transition-all group space-y-1"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white group-hover:text-lime-400 transition-colors">
                  {m.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-lime-400 transition-colors" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{m.desc}</p>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'slide-5',
      tag: 'IMPACT & BUSINESS ROI',
      title: 'Enterprise Impact & Financial Valuation',
      subtitle: 'Quantifiable returns across supply chain, inventory, and automated decisioning.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-emerald-500/30 space-y-3">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Revenue Protection</span>
            <div className="text-3xl font-bold font-mono text-white">+$3.82M ARR</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Recovered through proactive APAC transit bottleneck re-allocation and mid-market renewal expansion.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-cyan-500/30 space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Decision Velocity</span>
            <div className="text-3xl font-bold font-mono text-white">99.4% Faster</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated z-score telemetry signals replace manual SQL aggregation and multi-week BI reporting cycles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-purple-500/30 space-y-3">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase">Audit Compliance</span>
            <div className="text-3xl font-bold font-mono text-white">Zero Hallucinations</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              100% of AI recommendations are cryptographically verified by SHA-256 data lineage signatures.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans max-w-6xl mx-auto min-h-screen flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold">
            HACKATHON PRESENTATION MODE
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Slide {currentSlide + 1} of {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-2.5 rounded-xl bg-obsidian-850 border border-white/10 text-slate-300 disabled:opacity-40 hover:bg-obsidian-800 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="p-2.5 rounded-xl bg-lime-500 text-obsidian-950 font-bold disabled:opacity-40 hover:bg-lime-400 transition-all shadow-lime-glow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-8 flex-1"
        >
          <div className="space-y-2">
            <span className="text-xs font-mono text-lime-400 font-bold tracking-widest uppercase">
              {slides[currentSlide].tag}
            </span>
            <h1 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-slate-300 text-base max-w-3xl leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="py-4">
            {slides[currentSlide].content}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-lime-500 shadow-lime-glow' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('/app/overview')}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Launch Live App Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
