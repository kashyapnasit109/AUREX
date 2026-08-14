import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Bot, Play, ArrowRight } from 'lucide-react';

export const WorkflowCanvas: React.FC = () => {
  const steps = [
    { title: 'TRIGGER', label: 'Revenue Drop > 10%', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { title: 'ANALYSIS', label: 'DuckDB Z-Score Scan', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
    { title: 'AI REASONING', label: 'Aiden Restock Plan', icon: <Bot className="w-4 h-4 text-purple-400" /> },
    { title: 'ACTION', label: 'Dispatch Re-allocation', icon: <Play className="w-4 h-4 text-lime-400" /> },
  ];

  return (
    <div className="p-6 rounded-3xl bg-obsidian-950/80 border border-white/10 space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Automated Cross-Module Workflow Canvas
        </span>
        <span className="text-xs text-lime-400 font-mono font-semibold">Active Workflow #WF-9042</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="w-full md:w-1/4 p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{step.title}</span>
                <div className="p-1.5 rounded-lg bg-obsidian-850 border border-white/5">{step.icon}</div>
              </div>
              <p className="text-xs font-bold text-white font-sans">{step.label}</p>
            </motion.div>
            {idx < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
