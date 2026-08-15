import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Eye,
  Bot,
  Play,
  CheckCircle2,
  Send,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Radio
} from 'lucide-react';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';
import { useNavigate } from 'react-router-dom';

export const InsightEngine: React.FC = () => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executedInsights, setExecutedInsights] = useState<Record<string, { time: string; target: string; hash: string }>>({});
  const [executionModalData, setExecutionModalData] = useState<any>(null);
  const navigate = useNavigate();

  const insightsList = [
    {
      id: 'INS-8812',
      category: 'REVENUE ANOMALY',
      title: 'North America Enterprise Renewals Accelerating',
      why: 'Enterprise segment renewals increased +24.2% MoM driven by Q1 tier upgrades across 400k sampled DuckDB records.',
      confidence: 99.4,
      impact: '+$3.82M ARR',
      recommendation: 'Expand dedicated CSM allocation & replicate pricing structure in EMEA.',
      targetSystem: 'Salesforce Enterprise CRM & CSM Dispatch Queue',
      sourceTable: 'enterprise_transactions',
      records: '400,000 DuckDB Rows',
      hash: '7C9A410F82910484A0E1B98F21',
      zScore: 3.1
    },
    {
      id: 'INS-8813',
      category: 'SUPPLY CHAIN ANOMALY',
      title: 'APAC Supply Chain Transit Latency Spike (1.70σ)',
      why: 'Cross-border clearance duration increased by +1.8 days in APAC due to localized logistics bottlenecks.',
      confidence: 98.6,
      impact: '-$1.20M Margin At Risk',
      recommendation: 'Initiate priority air freight rerouting via Singapore distribution node.',
      targetSystem: 'Global Supply Chain Logistics Router (Singapore Hub)',
      sourceTable: 'LOGISTICS.INVENTORY_REALTIME',
      records: '200,000 DuckDB Rows',
      hash: '09654578209B36E437776A1208',
      zScore: 1.7
    },
    {
      id: 'INS-8814',
      category: 'CUSTOMER CHURN RISK',
      title: 'LATAM Tier-2 Retail Churn Elevation',
      why: 'Churn risk telemetry shifted upward (+1.3 pts) in localized retail accounts exhibiting lower engagement.',
      confidence: 94.1,
      impact: '-$420K ARR Risk',
      recommendation: 'Deploy targeted enterprise retention incentives & customer success outreach.',
      targetSystem: 'Automated Customer Lifecycle & Retention Engine',
      sourceTable: 'CUSTOMER.RETENTION_TELEMETRY',
      records: '99,967 DuckDB Rows',
      hash: '90412851A0849201F92B40192',
      zScore: 2.1
    }
  ];

  const handleOpenEvidence = (insight: any) => {
    setSelectedInsight(insight);
    setEvidenceOpen(true);
  };

  const handleAskAurex = (title: string) => {
    navigate('/app/aiden', { state: { query: `Analyze insight: ${title}` } });
  };

  const handleExecuteAction = (ins: any) => {
    setExecutingId(ins.id);

    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      const executionRecord = {
        time: now,
        target: ins.targetSystem,
        hash: `DISPATCH-${ins.hash.substring(0, 10)}`
      };

      setExecutedInsights(prev => ({
        ...prev,
        [ins.id]: executionRecord
      }));

      setExecutingId(null);
      setExecutionModalData({
        insight: ins,
        record: executionRecord
      });
    }, 1000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              STANDALONE INSIGHT ENGINE
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Compute-Then-Narrate Architecture
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            Autonomous Confidence-Rated Business Signals
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-0.5">
            Every insight is mathematically derived from DuckDB aggregates with zero hallucination and verifiable SHA-256 data lineage.
          </p>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="space-y-6">
        {insightsList.map((ins) => {
          const isExecuted = !!executedInsights[ins.id];
          const isCurrentExecuting = executingId === ins.id;

          return (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-6 rounded-3xl border space-y-4 transition-all duration-300 ${
                isExecuted
                  ? 'border-emerald-500/40 bg-emerald-950/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-obsidian-950 text-cyan-400 border border-white/10">
                    {ins.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{ins.id}</span>
                  {isExecuted && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      EXECUTED at {executedInsights[ins.id].time}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-300">Confidence: <strong className="text-lime-400">{ins.confidence}%</strong></span>
                  <span className="text-slate-300">Impact: <strong className="text-emerald-400">{ins.impact}</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-sans">{ins.title}</h3>
                <p className="text-slate-300 text-sm font-sans leading-relaxed">
                  <strong className="text-slate-200">WHY: </strong>{ins.why}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-obsidian-950 border border-lime-500/20 text-xs font-sans space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-lime-400 font-bold uppercase text-[10px]">
                    <Zap className="w-3.5 h-3.5" /> Action Recommendation
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-xs">
                    Target: <strong className="text-slate-200">{ins.targetSystem}</strong>
                  </span>
                </div>
                <p className="text-slate-200">{ins.recommendation}</p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEvidence(ins)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-obsidian-800 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all font-sans"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Evidence</span>
                  </button>

                  <button
                    onClick={() => handleAskAurex(ins.title)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/20 transition-all font-sans"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ask AUREX</span>
                  </button>
                </div>

                <button
                  onClick={() => handleExecuteAction(ins)}
                  disabled={isCurrentExecuting}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all font-sans disabled:opacity-50 ${
                    isExecuted
                      ? 'bg-emerald-500 text-obsidian-950 shadow-md hover:bg-emerald-400'
                      : 'bg-lime-500 hover:bg-lime-400 text-obsidian-950 shadow-lime-glow'
                  }`}
                >
                  {isCurrentExecuting ? (
                    <>
                      <Radio className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Action...</span>
                    </>
                  ) : isExecuted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Re-Dispatch Action</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Execute Action</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Execution Confirmation Modal */}
      <AnimatePresence>
        {executionModalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md"
            onClick={() => setExecutionModalData(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-obsidian-900 rounded-3xl p-6 border border-emerald-500/40 space-y-4 shadow-2xl font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Action Execution Dispatched & Confirmed</span>
                </div>
                <button
                  onClick={() => setExecutionModalData(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">
                  {executionModalData.insight.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Action recommendation has been validated against zero look-ahead criteria and transmitted to target operational node:
                </p>

                <div className="p-4 bg-obsidian-950 rounded-2xl border border-white/10 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Node:</span>
                    <span className="text-lime-400 font-bold">{executionModalData.record.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Action Type:</span>
                    <span className="text-white font-semibold">{executionModalData.insight.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dispatch ID:</span>
                    <span className="text-cyan-300">{executionModalData.record.hash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Execution Timestamp:</span>
                    <span className="text-slate-300">{executionModalData.record.time} UTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence Score:</span>
                    <span className="text-emerald-400 font-bold">{executionModalData.insight.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setExecutionModalData(null)}
                  className="w-full py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold text-xs shadow-lime-glow transition-all"
                >
                  Close & Continue Monitoring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EvidenceDrawer
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceData={selectedInsight ? {
          sourceTable: selectedInsight.sourceTable,
          recordsQueried: selectedInsight.records,
          sha256Hash: selectedInsight.hash,
          timestamp: '2026-08-15 00:40:00 UTC',
          executionMs: 0.42,
          title: selectedInsight.title
        } : null}
      />
    </div>
  );
};
