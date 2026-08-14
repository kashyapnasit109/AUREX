import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldCheck, Hash, FileText, CheckCircle2 } from 'lucide-react';
import type { EvidenceTrace } from '../../types/domain';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceTrace | null;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  evidence,
}) => {
  if (!evidence) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-obsidian-950/95 border-l border-white/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white text-base">
                    Evidence & Provenance
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors font-mono"
                >
                  ✕ Close
                </button>
              </div>

              {/* Verified Badge */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Deterministic Warehouse Grounding</span>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  {evidence.confidence}% CONF
                </span>
              </div>

              {/* Metadata Records */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 bg-obsidian-850 rounded-xl border border-white/5 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Source Table</div>
                  <div className="text-lime-400 font-bold text-sm">{evidence.sourceTable}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-obsidian-850 rounded-xl border border-white/5">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Records Scanned</div>
                    <div className="text-white font-bold text-sm mt-0.5">{evidence.recordCount.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-obsidian-850 rounded-xl border border-white/5">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Snapshot Time</div>
                    <div className="text-slate-300 font-medium text-xs mt-0.5 truncate">{evidence.dataSnapshot}</div>
                  </div>
                </div>

                {/* SHA-256 Hash */}
                <div className="p-3.5 bg-obsidian-850 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                    <Hash className="w-3 h-3 text-cyan-400" />
                    <span>SHA-256 Lineage Hash</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 break-all font-mono bg-obsidian-950 p-2 rounded border border-white/5">
                    {evidence.sha256Hash}
                  </div>
                </div>

                {/* Audit Query */}
                <div className="p-3.5 bg-obsidian-850 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Audit Query Snapshot</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono bg-obsidian-950 p-2.5 rounded border border-white/5 whitespace-pre-wrap">
                    {evidence.sampleQuery}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between font-sans">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Audit Ledger
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-white font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
