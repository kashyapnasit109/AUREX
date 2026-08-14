import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Server,
  Activity,
  Database,
  ShoppingBag,
} from 'lucide-react';
import { mockDataQualityReport } from '../data/mockData';
import { AskAurexDrawer } from '../components/common/AskAurexDrawer';

export const DataHub: React.FC = () => {
  const [report] = useState(mockDataQualityReport);
  const [askAurexOpen, setAskAurexOpen] = useState(false);

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      <AskAurexDrawer
        isOpen={askAurexOpen}
        onClose={() => setAskAurexOpen(false)}
        contextTitle="Enterprise Data Quality & Lineage"
        contextPrompt="Validate point-in-time state integrity across all active tables."
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold tracking-wide font-mono">
              Enterprise Data Governance & Quality Center
            </span>
            <span className="text-xs text-slate-300 font-medium font-mono">42.8M Rows Ingested</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            Data Hub & Lineage Matrix
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-1">
            Deterministic catalog schemas, continuous data quality validation, and end-to-end provenance traces.
          </p>
        </div>

        {/* Action Trigger */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setAskAurexOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 text-obsidian-950 font-bold hover:bg-lime-400 shadow-lime-glow transition-all font-sans"
          >
            <Sparkles className="w-4 h-4" />
            <span>Interrogate Schemas</span>
          </button>
        </div>
      </div>

      {/* 4 Data Quality Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border-t-2 border-t-emerald-400 text-center flex flex-col justify-between">
          <div className="text-xs text-slate-400 uppercase font-semibold">Completeness</div>
          <div className="text-3xl font-mono font-bold text-emerald-400 mt-2">{report.completeness}%</div>
          <div className="text-xs text-slate-300 font-medium mt-1">0.08% Null Tolerance</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border-t-2 border-t-cyan-400 text-center flex flex-col justify-between">
          <div className="text-xs text-slate-400 uppercase font-semibold">Validity</div>
          <div className="text-3xl font-mono font-bold text-cyan-400 mt-2">{report.validity}%</div>
          <div className="text-xs text-slate-300 font-medium mt-1">Schema Type Strict</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border-t-2 border-t-lime-400 text-center flex flex-col justify-between">
          <div className="text-xs text-slate-400 uppercase font-semibold">Freshness</div>
          <div className="text-3xl font-mono font-bold text-lime-400 mt-2">{report.freshness}%</div>
          <div className="text-xs text-slate-300 font-medium mt-1">0.42s Sync Latency</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border-t-2 border-t-amber-400 text-center flex flex-col justify-between">
          <div className="text-xs text-slate-400 uppercase font-semibold">Consistency</div>
          <div className="text-3xl font-mono font-bold text-amber-400 mt-2">{report.consistency}%</div>
          <div className="text-xs text-slate-300 font-medium mt-1">Cross-Table Key Aligned</div>
        </div>
      </div>

      {/* Symmetrical Harmonized 4-Stage Data Lineage Pipeline */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs text-cyan-400 font-mono font-semibold uppercase tracking-wider">
              Cryptographic Data Lineage Pipeline
            </span>
            <h3 className="text-xl font-bold text-white mt-1">End-to-End Information Flow</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> Immutable SHA-256 Hashes
          </span>
        </div>

        {/* Symmetrical 4 Pipeline Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stage 1 */}
          <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 hover:border-cyan-500/50 flex flex-col justify-between space-y-4 transition-all group">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyan-400 font-bold tracking-wider">STAGE 01</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="font-bold text-white text-base leading-snug">Market L2 & POS Ingestion</h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
                Continuous streaming from Binance perpetual feeds, Stripe webhooks, and enterprise ERP logs.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-medium">Throughput:</span>
              <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 text-xs">
                1.84M msgs/sec
              </span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-500/50 flex flex-col justify-between space-y-4 transition-all group">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-emerald-400 font-bold tracking-wider">STAGE 02</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="font-bold text-white text-base leading-snug">Point-in-Time Quarantine</h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
                Air-gapping historical backtest timelines to mathematically prevent look-ahead bias leakage.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-medium">Guarantee:</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 text-xs">
                Zero Look-Ahead
              </span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-500/50 flex flex-col justify-between space-y-4 transition-all group">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-amber-400 font-bold tracking-wider">STAGE 03</span>
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="font-bold text-white text-base leading-snug">Columnar DataMart</h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
                42.8M rows materializing regional KPI dimensions, cohort retentions, and growth trajectories.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-medium">Latency:</span>
              <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 text-xs">
                Sub-Second (18ms)
              </span>
            </div>
          </div>

          {/* Stage 4 - Harmonized Glassmorphism */}
          <div className="p-5 rounded-2xl glass-card border border-lime-500/30 hover:border-lime-500/50 flex flex-col justify-between space-y-4 transition-all group">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-lime-400 font-bold tracking-wider">STAGE 04</span>
                <ShoppingBag className="w-4 h-4 text-lime-400" />
              </div>
              <h4 className="font-bold text-white text-base leading-snug">Grounded AI & Action</h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
                Deterministic catalog retrieval binding every response to physical warehouse inventory tables.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-medium">Integrity:</span>
              <span className="text-lime-400 font-bold bg-lime-500/10 px-2.5 py-1 rounded border border-lime-500/20 text-xs">
                SHA-256 Hashed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Table Validation Logs */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="font-bold text-white text-base flex items-center gap-2">
            <Server className="w-4 h-4 text-lime-400" />
            <span>Continuous Schema & Integrity Checks</span>
          </div>
          <span className="font-mono text-xs text-slate-400">Checked {report.lastIngestionTime}</span>
        </div>

        <div className="space-y-3 font-sans text-xs">
          {report.validationChecks.map((check, idx) => (
            <div key={idx} className="p-4 bg-obsidian-950 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white text-sm">{check.table}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-xs">{check.check}</span>
                </div>
                <div className="text-slate-300 font-sans text-xs">{check.detail}</div>
              </div>
              <span
                className={`font-mono text-xs font-bold px-3 py-1 rounded-full border shrink-0 text-center ${
                  check.status === 'PASSED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                }`}
              >
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
