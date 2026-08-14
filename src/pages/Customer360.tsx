import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Clock,
} from 'lucide-react';
import { mockCustomers, mockRetailCatalog } from '../data/mockData';
import type { CustomerProfile } from '../types/domain';
import { AskAurexDrawer } from '../components/common/AskAurexDrawer';

export const Customer360: React.FC = () => {
  const [customers] = useState<CustomerProfile[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(mockCustomers[0]);
  const [askAurexOpen, setAskAurexOpen] = useState(false);

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      <AskAurexDrawer
        isOpen={askAurexOpen}
        onClose={() => setAskAurexOpen(false)}
        contextTitle={`Customer 360: ${selectedCustomer.name} (${selectedCustomer.company})`}
        contextPrompt={`Analyze ${selectedCustomer.name}'s retention profile and suggest cross-sell opportunities.`}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold tracking-wide">
              Customer Intelligence Portfolio
            </span>
            <span className="text-xs text-slate-300 font-medium">DataMart • AI Grounding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            Customer 360 Intelligence
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-1">
            Real-time behavioral telemetry, lifetime value trajectory, and AI-powered retention synthesis.
          </p>
        </div>

        {/* Action Trigger */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setAskAurexOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 text-obsidian-950 font-bold hover:bg-lime-400 shadow-lime-glow transition-all font-sans"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Churn Prevention Plan</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Cols: Account Roster */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
            Enterprise Accounts ({customers.length})
          </span>

          <div className="space-y-3">
            {customers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCustomer.id === cust.id
                    ? 'glass-card border-lime-500/50 shadow-lime-glow'
                    : 'bg-obsidian-950/80 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{cust.name}</span>
                  <span className="font-mono text-xs text-lime-400 font-bold">{cust.ltv}</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">{cust.company}</div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-slate-300">{cust.segment}</span>
                  <span className="text-emerald-400 font-semibold">{cust.retentionProbability}% Retention</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Comprehensive 360 Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Lifetime Value</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{selectedCustomer.ltv}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{selectedCustomer.ordersCount} Total Orders</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Order Value</div>
              <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">{selectedCustomer.aov}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Top 5% Tier</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Retention Probability</div>
              <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{selectedCustomer.retentionProbability}%</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">High Stability</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Churn Risk</div>
              <div className="text-2xl font-mono font-bold text-lime-400 mt-1">{selectedCustomer.churnRisk}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Zero Anomaly</div>
            </div>
          </div>

          {/* AI Behavioral Synthesis Card */}
          <div className="glass-card p-6 rounded-3xl border border-lime-500/25 bg-lime-950/10 space-y-3">
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AUREX Behavioral Synthesis</span>
            </div>
            <p className="text-slate-100 text-sm leading-relaxed font-sans">
              {selectedCustomer.aiInterpretation}
            </p>
          </div>

          {/* Chronological Behavioral Lifecycle Timeline */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Behavioral Lifecycle Stream</span>
              </div>
              <span className="font-mono text-xs text-slate-400">Point-in-Time Trace</span>
            </div>

            <div className="space-y-3">
              {selectedCustomer.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 bg-obsidian-950 rounded-xl border border-white/5">
                  <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0">
                    {event.event}
                  </span>
                  <div className="flex-1 text-xs">
                    <div className="text-white font-medium">{event.detail}</div>
                    <div className="text-slate-500 text-[10px] font-mono mt-0.5">{event.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grounded Recommended Retail Products */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <ShoppingBag className="w-4 h-4 text-lime-400" />
                <span>Aiden Recommended Hardware for Account</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Grounded Match</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockRetailCatalog.slice(0, 2).map((prod) => (
                <div key={prod.id} className="p-4 bg-obsidian-950 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-lime-400 font-mono font-bold text-[11px] bg-lime-500/10 px-2 py-0.5 rounded">{prod.matchScore}% MATCH</span>
                      <span className="text-slate-400">{prod.brand}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{prod.name}</h4>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5 font-mono text-xs">
                    <span className="text-white font-bold">${prod.price}</span>
                    <button
                      onClick={() => setAskAurexOpen(true)}
                      className="px-3 py-1 bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold rounded-lg text-xs"
                    >
                      Propose Bundle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
