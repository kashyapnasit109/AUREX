import React, { useState } from 'react';
import { ShieldCheck, Zap, Play, CheckCircle2 } from 'lucide-react';
import { WorkflowCanvas } from '../components/canvas/WorkflowCanvas';

export const WorkflowEngine: React.FC = () => {
  const [executed, setExecuted] = useState(false);

  const workflows = [
    { id: 'WF-9042', name: 'APAC Transit Bottleneck Auto-Restock', trigger: 'Fulfillment Latency > 1.5σ', action: 'Reroute Air Freight via Singapore Node', status: 'ACTIVE' },
    { id: 'WF-9043', name: 'LATAM Churn Risk Mitigation', trigger: 'Churn Score > 2.0', action: 'Deploy Enterprise Retention Discount', status: 'ACTIVE' },
    { id: 'WF-9044', name: 'Quant Volatility Leverage Lock', trigger: 'Downside Vol > 20%', icon: <Zap className="w-4 h-4 text-lime-400" />, action: 'Cap Max Leverage to 1.5x', status: 'ACTIVE' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold">
              AUTONOMOUS WORKFLOW ENGINE
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Closed-Loop Execution Core
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            Trigger → Analysis → Intelligence → Action Engine
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-0.5">
            Automating cross-module enterprise responses when statistical z-score anomalies or market shifts occur.
          </p>
        </div>

        <button
          onClick={() => setExecuted(true)}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            executed
              ? 'bg-emerald-500 text-obsidian-950'
              : 'bg-lime-500 hover:bg-lime-400 text-obsidian-950 shadow-lime-glow'
          }`}
        >
          {executed ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{executed ? 'All Workflows Executed!' : 'Run Active Workflows'}</span>
        </button>
      </div>

      {/* Visual Canvas */}
      <WorkflowCanvas />

      {/* Workflows Table */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Cross-Module Automation Rules
          </h3>
          <span className="text-xs text-lime-400 font-mono font-semibold">3 Active Pipelines</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-obsidian-950 text-slate-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3 px-3">Workflow ID</th>
                <th className="py-3 px-3">Rule Name</th>
                <th className="py-3 px-3">Trigger Condition</th>
                <th className="py-3 px-3">Automated Action</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {workflows.map((wf) => (
                <tr key={wf.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-lime-400">{wf.id}</td>
                  <td className="py-3 px-3 font-semibold text-white">{wf.name}</td>
                  <td className="py-3 px-3 text-slate-300">{wf.trigger}</td>
                  <td className="py-3 px-3 text-cyan-400">{wf.action}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {wf.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
