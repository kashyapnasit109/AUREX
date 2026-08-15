import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Database, Terminal } from 'lucide-react';
import { AurexAPI } from '../../services/api';

export const TickerTape: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [telemetryState, setTelemetryState] = useState({
    btcPrice: '$65,120.50',
    ethPrice: '$3,450.20',
    latency: '0.42ms',
    throughput: '42.8M RECS'
  });

  useEffect(() => {
    const cleanup = AurexAPI.connectTelemetry((data) => {
      if (data.type === 'TELEMETRY_TICK') {
        setTelemetryState({
          btcPrice: `$${data.btc_price.toLocaleString()}`,
          ethPrice: `$${data.eth_price.toLocaleString()}`,
          latency: `${data.latency_ms}ms`,
          throughput: `${data.processed_tx_rate.toLocaleString()} TX/S`
        });
      }
    });
    return cleanup;
  }, []);

  const telemetryItems = [
    { icon: <Cpu className="w-3 h-3 text-lime-500" />, label: 'CORE LATENCY', value: telemetryState.latency, status: 'optimal' },
    { icon: <Activity className="w-3 h-3 text-cyan-500" />, label: 'BTC TICK', value: telemetryState.btcPrice, status: 'live' },
    { icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />, label: 'LOOK-AHEAD GUARD', value: '100% ZERO-BIAS', status: 'verified' },
    { icon: <Database className="w-3 h-3 text-amber-400" />, label: 'DATAMART DUCKDB', value: '1,000,000 ROWS', status: 'synced' },
    { icon: <Zap className="w-3 h-3 text-lime-400" />, label: 'ETH TICK', value: telemetryState.ethPrice, status: 'optimal' },
    { icon: <Terminal className="w-3 h-3 text-cyan-400" />, label: 'THROUGHPUT', value: telemetryState.throughput, status: 'active' },
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
