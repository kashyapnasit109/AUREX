import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { AurexLogo } from '../brand/AurexLogo';

interface AskAurexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextPrompt?: string;
  contextTitle?: string;
}

export const AskAurexDrawer: React.FC<AskAurexDrawerProps> = ({
  isOpen,
  onClose,
  contextPrompt = 'Explain the key drivers behind current performance.',
  contextTitle = 'AUREX Enterprise Context',
}) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'aurex'; text: string; time: string }[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          sender: 'aurex',
          text: `AUREX Neural Core synchronized with context: "${contextTitle}". How would you like to interrogate this data stream?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, contextTitle]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const aiResponse = {
        sender: 'aurex' as const,
        text: `Cross-referenced 42.8M transactional logs and point-in-time orderbook states for "${text}":\n\n• Primary Driver: Positive volume elasticity (+24.2%) across Tier-1 enterprise renewals.\n• Risk Vector: Supply chain transit bottleneck in Southern EU (+1.8 days latency) mitigated by auto-rerouting.\n• Recommended Action: Deploy automated volume discount schedule across EMEA pipelines to capture +$1.4M ARR expansion.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 900);
  };

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

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-obsidian-950/95 border-l border-white/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl z-10"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <AurexLogo size={28} />
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">Ask AUREX</h3>
                    <span className="font-mono text-[10px] text-lime-400">Context: {contextTitle}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors font-mono"
                >
                  ✕ Close
                </button>
              </div>

              {/* Quick Prompt Discovery */}
              <div className="mb-4">
                <button
                  onClick={() => handleSend(contextPrompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-lime-500/10 hover:bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs flex items-center justify-between transition-all group"
                >
                  <span className="truncate pr-2">{contextPrompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Message Feed */}
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-500 font-mono mb-1">
                      {msg.sender === 'user' ? 'Operator' : 'AUREX Cognitive Core'} • {msg.time}
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-obsidian-800 text-white border border-white/10 font-medium'
                          : 'glass-card text-slate-200 border border-white/10'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-center gap-2 p-3 text-xs text-lime-400 font-mono glass-card rounded-2xl w-fit">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Cross-referencing 42.8M warehouse records...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input Bar */}
            <div className="pt-4 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 bg-obsidian-850 p-2 rounded-2xl border border-white/10 focus-within:border-lime-500/50"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Interrogate AUREX across quantitative and data streams..."
                  className="flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isThinking}
                  className="p-2.5 bg-lime-500 hover:bg-lime-400 text-obsidian-950 rounded-xl disabled:opacity-40 shadow-lime-glow transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
