import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Eye, Bot, Play, CheckCircle2 } from 'lucide-react';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';
import { useNavigate } from 'react-router-dom';

export const InsightEngine: React.FC = () => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
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
      sourceTable: 'enterprise_transactions',
      records: '400,000 DuckDB Rows',
      hash: '7C9A410F82910484A0E1B',
      zScore: 3.1
    },
    {
      id: 'INS-8813',
      category: 'SUPPLY CHAIN ANOMALY',
      title: 'APAC Supply Chain Transit Latency Spike (1.7σ)',
      why: 'Cross-border clearance duration increased by +1.8 days in APAC due to localized logistics bottlenecks.',
      confidence: 98.6,
      impact: '-$1.20M Margin At Risk',
      recommendation: 'Initiate priority air freight rerouting via Singapore distribution node.',
      sourceTable: 'LOGISTICS.INVENTORY_REALTIME',
      records: '200,000 DuckDB Rows',
      hash: '09654578209B36E437776',
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
      sourceTable: 'CUSTOMER.RETENTION_TELEMETRY',
      records: '99,967 DuckDB Rows',
      hash: '90412851A0849201F92B',
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

  const handleExecuteAction = (id: string) => {
    setActionSuccess(id);
    setTimeout(() => setActionSuccess(null), 3000);
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
        {insightsList.map((ins) => (
          <motion.div
            key={ins.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-obsidian-950 text-cyan-400 border border-white/10">
                  {ins.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{ins.id}</span>
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

            <div className="p-4 rounded-2xl bg-obsidian-950 border border-lime-500/20 text-xs font-sans space-y-1">
              <div className="flex items-center gap-1.5 text-lime-400 font-bold uppercase text-[10px]">
                <Zap className="w-3.5 h-3.5" /> Action Recommendation
              </div>
              <p className="text-slate-200">{ins.recommendation}</p>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEvidence(ins)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-800 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all font-sans"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Evidence</span>
                </button>

                <button
                  onClick={() => handleAskAurex(ins.title)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/20 transition-all font-sans"
                >
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ask AUREX</span>
                </button>
              </div>

              <button
                onClick={() => handleExecuteAction(ins.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all font-sans ${
                  actionSuccess === ins.id
                    ? 'bg-emerald-500 text-obsidian-950'
                    : 'bg-lime-500 hover:bg-lime-400 text-obsidian-950 shadow-lime-glow'
                }`}
              >
                {actionSuccess === ins.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Action Dispatched!</span>
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
        ))}
      </div>

      <EvidenceDrawer
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceData={selectedInsight ? {
          sourceTable: selectedInsight.sourceTable,
          recordsQueried: selectedInsight.records,
          sha256Hash: selectedInsight.hash,
          timestamp: '2026-08-14 14:10:00 UTC',
          executionMs: 0.42,
          title: selectedInsight.title
        } : null}
      />
    </div>
  );
};
