import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, Bot, Eye } from 'lucide-react';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';

export const Customer360: React.FC = () => {
  const { id = 'AUREX-28491' } = useParams<{ id: string }>();
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const navigate = useNavigate();

  const customerData = {
    id: `#${id}`,
    name: 'Enterprise Client — Acme Corp Hub',
    ltv: '$12,480.00',
    ordersCount: 17,
    aov: '$734.12',
    retentionProb: '87%',
    churnRisk: '8%',
    segment: 'Returning Premium Enterprise',
    timeline: [
      { date: '2026-08-14 13:40', action: 'Searched "Cabin ANC Wireless Headphones"' },
      { date: '2026-08-12 11:15', action: 'Purchased AUREX Apex Studio Wireless (Qty: 2)' },
      { date: '2026-07-28 09:30', action: 'Reviewed Product (5.0 ★ — "Outstanding ANC isolation")' },
      { date: '2026-06-15 16:45', action: 'Re-ordered Enterprise Audio Fleet Accessories' },
    ]
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              CUSTOMER 360 INTELLIGENCE
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Unified Behavioral Profile
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            Customer {customerData.id} Profile
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-0.5">
            Cross-domain customer analytics bridging DataMart transactions, retail behavior, and AI churn prevention.
          </p>
        </div>

        <button
          onClick={() => setEvidenceOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-300 text-xs font-bold transition-all"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>View Customer Lineage</span>
        </button>
      </div>

      {/* Metrics Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Lifetime Value (LTV)</div>
          <div className="text-2xl font-bold text-lime-400 mt-1">{customerData.ltv}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Orders</div>
          <div className="text-2xl font-bold text-white mt-1">{customerData.ordersCount}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Retention Probability</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{customerData.retentionProb}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Churn Risk Score</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{customerData.churnRisk}</div>
        </div>
      </div>

      {/* Timeline & AI Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Interaction Timeline */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Behavioral Interaction Timeline
          </h3>
          <div className="space-y-4 border-l-2 border-white/10 pl-4">
            {customerData.timeline.map((event, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-obsidian-950" />
                <span className="text-[10px] font-mono text-slate-500">{event.date}</span>
                <p className="text-xs font-semibold text-white font-sans">{event.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: AUREX Interpretation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-purple-500/30 bg-purple-950/10 space-y-4 font-sans">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AUREX AI Customer Behavioral Analysis</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              Customer exhibits strong repeat-purchase behavior with high affinity for premium travel electronics. Low churn risk (8%) confirmed across 17 transaction logs in DuckDB.
            </p>
            <button
              onClick={() => navigate('/app/aiden', { state: { query: `What product upsells should we offer customer ${customerData.id}?` } })}
              className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-obsidian-950 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AUREX Churn Recommendations</span>
            </button>
          </div>
        </div>
      </div>

      <EvidenceDrawer
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceData={{
          sourceTable: 'CUSTOMER.RETENTION_TELEMETRY',
          recordsQueried: '17 Transaction Logs',
          sha256Hash: '90412851A0849201F92B3C',
          timestamp: '2026-08-14 14:10:00 UTC',
          executionMs: 10.2,
          title: `Customer 360 Audit for ${customerData.id}`

        }}
      />
    </div>
  );
};
