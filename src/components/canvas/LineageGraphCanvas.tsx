import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LineageGraphCanvas: React.FC<{ onNodeSelect?: (node: any) => void }> = ({ onNodeSelect }) => {
  const [activeNode, setActiveNode] = useState('duckdb_olap');

  const nodes = [
    { id: 'raw_sources', name: 'Raw Ingestion', sub: 'TimescaleDB / CSV', icon: <Database className="w-5 h-5 text-amber-400" />, status: '1.0M Records', x: '10%' },
    { id: 'duckdb_olap', name: 'DuckDB OLAP', sub: 'In-Memory Engine', icon: <Server className="w-5 h-5 text-cyan-400" />, status: '0.42ms Query', x: '35%' },
    { id: 'sha256_hasher', name: 'SHA-256 Hasher', sub: 'Cryptographic Audit', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, status: 'Verified Audit', x: '60%' },
    { id: 'aiden_rag', name: 'Aiden AI RAG', sub: 'Grounded Intelligence', icon: <Cpu className="w-5 h-5 text-purple-400" />, status: 'Zero-Hallucination', x: '85%' },
  ];

  const handleSelect = (node: any) => {
    setActiveNode(node.id);
    if (onNodeSelect) onNodeSelect(node);
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-obsidian-950/80 border border-white/10 space-y-6 font-sans relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Interactive Data Lineage Node Flow Graph
        </span>
        <span className="text-xs text-emerald-400 font-mono font-semibold">SOC2 Aligned Architecture</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            onClick={() => handleSelect(node)}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative ${
              activeNode === node.id
                ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                : 'bg-obsidian-900 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-obsidian-850 border border-white/10">
                {node.icon}
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase">{node.name}</h4>
              <p className="text-[10px] font-mono text-slate-400">{node.sub}</p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-lime-400 font-semibold">
              {node.status}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
