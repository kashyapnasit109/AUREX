import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, Database, Bot, ShieldCheck, User, Package, Zap } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commandItems = [
    { label: 'Intelligence Core', path: '/app/intelligence', icon: <Zap className="w-4 h-4 text-lime-400" />, section: 'Platform Navigation' },
    { label: 'Standalone Insight Engine', path: '/app/insights', icon: <Activity className="w-4 h-4 text-cyan-400" />, section: 'Platform Navigation' },
    { label: 'Quant Studio (Strategy Lab)', path: '/app/quant', icon: <Activity className="w-4 h-4 text-emerald-400" />, section: 'Platform Navigation' },
    { label: 'DataMart Explorer (DuckDB)', path: '/app/datamart', icon: <Database className="w-4 h-4 text-amber-400" />, section: 'Platform Navigation' },
    { label: 'Aiden AI Conversational Engine', path: '/app/aiden', icon: <Bot className="w-4 h-4 text-purple-400" />, section: 'Platform Navigation' },
    { label: 'Trust & Governance Enclave', path: '/security', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, section: 'Platform Navigation' },
    { label: 'Customer 360 (#AUREX-28491)', path: '/app/customers/AUREX-28491', icon: <User className="w-4 h-4 text-cyan-400" />, section: 'Domain Entities' },
    { label: 'Product Intelligence (Apex Studio)', path: '/app/products/SKU-AUDIO-9000', icon: <Package className="w-4 h-4 text-lime-400" />, section: 'Domain Entities' },
  ];

  const filteredCommands = commandItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-obsidian-950/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-obsidian-950">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search platform routes, strategies, datasets, customers..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm outline-none font-sans"
              autoFocus
            />
            <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-obsidian-850 rounded border border-white/10">
              ESC
            </kbd>
          </div>

          {/* Command List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs font-mono">
                No matching routes found for "{query}"
              </div>
            ) : (
              filteredCommands.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-semibold text-white group-hover:text-lime-400 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {item.section}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
