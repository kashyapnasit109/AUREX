import React from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Database, Terminal } from 'lucide-react';

export const TickerTape: React.FC<{ className?: string }> = ({ className = '' }) => {
  const telemetryItems = [
    { icon: <Cpu className="w-3 h-3 text-lime-500" />, label: 'CORE LATENCY', value: '0.42ms', status: 'optimal' },
    { icon: <Activity className="w-3 h-3 text-cyan-500" />, label: 'ENGINE THROUGHPUT', value: '1.84M OPS/S', status: 'optimal' },
    { icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />, label: 'LOOK-AHEAD GUARD', value: '100% ZERO-BIAS', status: 'verified' },
    { icon: <Database className="w-3 h-3 text-amber-400" />, label: 'DATAMART INGESTION', value: '42.8M RECORDS', status: 'synced' },
    { icon: <Zap className="w-3 h-3 text-lime-400" />, label: 'AI REASONING LATENCY', value: '148ms', status: 'optimal' },
    { icon: <Terminal className="w-3 h-3 text-cyan-400" />, label: 'ACTIVE QUANT REGIMES', value: '14 LIVE ALPHA', status: 'active' },
  ];

  return (
    <div className={`w-full overflow-hidden bg-obsidian-950 border-y border-white/5 py-2 select-none ${className}`}>
      <div className="flex w-max animate-marquee space-x-8 items-center">
        {[...telemetryItems, ...telemetryItems, ...telemetryItems].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 font-mono text-[11px] uppercase tracking-wider text-slate-400">
            <span className="flex items-center">{item.icon}</span>
            <span className="text-slate-500 font-medium">{item.label}</span>
            <span className="text-white font-semibold">{item.value}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-500/80 animate-pulse ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
