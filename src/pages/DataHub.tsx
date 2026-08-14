import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Eye } from 'lucide-react';
import { LineageGraphCanvas } from '../components/canvas/LineageGraphCanvas';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';

export const DataHub: React.FC = () => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const qualityMetrics = [
    { label: 'Overall Quality Score', value: '98.7%', status: 'optimal' },
    { label: 'Completeness', value: '99.2%', status: 'optimal' },
    { label: 'Schema Validity', value: '98.8%', status: 'optimal' },
    { label: 'Data Freshness', value: '99.7%', status: 'optimal' },
    { label: 'Referential Integrity', value: '97.9%', status: 'optimal' },
  ];

  const schemasList = [
    { table: 'enterprise_transactions', engine: 'DuckDB 1.0M In-Memory', columns: 9, nullCheck: 'Passed', status: 'Optimal' },
    { table: 'DW_RETAIL.CATALOG_MASTER', engine: 'PostgreSQL + pgvector', columns: 12, nullCheck: 'Passed', status: 'Optimal' },
    { table: 'market_ticks', engine: 'TimescaleDB Hypertable', columns: 7, nullCheck: 'Passed', status: 'Optimal' },
    { table: 'customer_profiles', engine: 'ClickHouse OLAP Log', columns: 15, nullCheck: '1.2% Missing Customer IDs', status: 'Warning' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              ENTERPRISE DATA HUB & QUALITY CENTER
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              SOC2-Aligned Data Architecture
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            Data Architecture & Lineage Management
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-0.5">
            Unified data quality center, schema validation, and interactive cryptographic lineage tracing.
          </p>
        </div>

        <button
          onClick={() => setEvidenceOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-300 text-xs font-bold transition-all"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>View Audit Evidence</span>
        </button>
      </div>

      {/* Quality Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        {qualityMetrics.map((qm, idx) => (
          <div key={idx} className="glass-card p-4 rounded-2xl border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{qm.label}</div>
            <div className="text-2xl font-bold text-lime-400 mt-1">{qm.value}</div>
          </div>
        ))}
      </div>

      {/* Interactive Lineage Canvas */}
      <LineageGraphCanvas />

      {/* Schema Audit Table */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Managed Data Schemas & Validation Status
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-obsidian-950 text-slate-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3 px-3">Table Identifier</th>
                <th className="py-3 px-3">Storage Engine</th>
                <th className="py-3 px-3 text-center">Columns</th>
                <th className="py-3 px-3">Validation Check</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {schemasList.map((sch, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{sch.table}</td>
                  <td className="py-3 px-3 text-slate-300">{sch.engine}</td>
                  <td className="py-3 px-3 text-center text-cyan-400 font-bold">{sch.columns}</td>
                  <td className="py-3 px-3 text-slate-400">{sch.nullCheck}</td>
                  <td className="py-3 px-3 text-center">
                    {sch.status === 'Optimal' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ✓ Validated
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Warning
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EvidenceDrawer
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceData={{
          sourceTable: 'DATA_QUALITY_CENTER_AUDIT',
          recordsQueried: '1,000,000 DuckDB Records',
          sha256Hash: '987A10F284910284A0E1B',
          timestamp: '2026-08-14 14:24:00 UTC',
          executionMs: 0.42,
          title: 'Enterprise Data Hub Audit'
        }}
      />
    </div>
  );
};
