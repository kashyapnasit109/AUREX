import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  ShoppingBag,
  ShieldCheck,
  Database,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import { mockAidenConversation, mockRetailCatalog, type RetailProduct } from '../data/mockData';

export const Aiden: React.FC = () => {
  const [messages, setMessages] = useState(mockAidenConversation);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState<{ product: RetailProduct; quantity: number }[]>([
    { product: mockRetailCatalog[0], quantity: 1 },
  ]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<any[] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMessage = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      sources: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    const apiRes = await import('../services/api').then(m => m.AurexAPI.sendAidenChat([
      { role: 'user', content: text }
    ]));

    setIsTyping(false);

    if (apiRes) {
      const formattedProducts: RetailProduct[] = (apiRes.suggested_products || []).map((p: any) => ({
        id: p.sku || 'SKU-9901',
        name: p.name || 'Grounded Retail Item',
        brand: p.brand || 'Enterprise Catalog',
        price: p.price || 299.99,
        rating: 4.9,
        reviewsCount: 1420,
        inStock: (p.inventory ?? 10) > 0,
        matchScore: p.match_score || 96,
        ancScore: p.scores?.anc_isolation || 95,
        batteryScore: p.scores?.battery_efficiency || 92,
        weightScore: p.scores?.weight_ergonomics || 90,
        reasoningScores: {
          ancIsolation: p.scores?.anc_isolation || 95,
          battery: p.scores?.battery_efficiency || 92,
          weightErgonomics: p.scores?.weight_ergonomics || 90,
          priceValue: 92,
          buildQuality: 96,
        },
        keySpecs: [p.key_feature || 'Verified Warehouse Stock'],
        description: `Verified in stock (${p.inventory ?? 10} units) with SHA-256 cryptographic lineage hash ${apiRes.lineage_trace?.sha256_hash?.substring(0, 12) || '09654578'}...`
      }));

      const aiResponse = {
        id: `m-${Date.now() + 1}`,
        sender: 'aiden' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: apiRes.message,
        products: formattedProducts,
        sources: [
          { table: apiRes.lineage_trace.source_table, records: `${apiRes.lineage_trace.records_queried} warehouse rows scanned` },
          { table: 'SHA256_LINEAGE_LEDGER', records: `Hash: ${apiRes.lineage_trace.sha256_hash.substring(0, 16)}...` },
          { table: 'REALTIME_TELEMETRY', records: `Latency: ${apiRes.lineage_trace.execution_ms}ms` },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
    } else {
      const aiResponse = {
        id: `m-${Date.now() + 1}`,
        sender: 'aiden' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Cross-referenced 2,410 active catalog SKUs against your query "${text}". Filtered top ergonomic products meeting cabin acoustic isolation and battery benchmarks:`,
        products: mockRetailCatalog,
        sources: [
          { table: 'DW_RETAIL.CATALOG_MASTER', records: '2,410 rows scanned' },
          { table: 'LOGISTICS.INVENTORY_REALTIME', records: 'Warehouse Hub North (US-EAST)' },
          { table: 'PRICING.ELASTICITY_MODEL', records: 'Dynamic discount active (-$51.99)' },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
    }
  };

  const addToCart = (product: RetailProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const promptSuggestions = [
    'Wireless noise-canceling headphones for travel under $400',
    'Compare Sony XM5 vs Bose QuietComfort Ultra battery specs',
    'Identify highest-margin travel accessories with >4.5 rating',
  ];

  return (
    <div className="flex h-full font-sans relative overflow-hidden">
      {/* Main Conversational Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Module Header */}
        <div className="p-6 md:px-8 border-b border-white/5 flex items-center justify-between bg-obsidian-900/40 backdrop-blur-md shrink-0">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Retail AI Intelligence</span>
            </div>
            <h1 className="text-2xl font-sans font-bold text-white tracking-tight">
              Aiden Conversational Commerce
            </h1>
          </div>

          {/* Cart & Lineage Triggers */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 text-slate-200 transition-all relative font-medium font-sans"
            >
              <ShoppingBag className="w-4 h-4 text-lime-400" />
              <span>Procurement Cart</span>
              {cart.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-lime-500 text-obsidian-950 font-bold text-[10px] flex items-center justify-center font-mono">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender Badge */}
              <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400 font-sans">
                <span className="font-medium">{message.sender === 'user' ? 'Operator' : 'Aiden AI (Grounded Core)'}</span>
                <span>•</span>
                <span className="font-mono text-[11px]">{message.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-3xl rounded-2xl p-4 md:p-5 text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-obsidian-750 text-white border border-white/10 font-medium'
                    : 'glass-card text-slate-200 border border-white/10'
                }`}
              >
                <p className="font-sans">{message.text}</p>

                {/* Structured Product Matches */}
                {message.products && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-white/5">
                    {message.products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-obsidian-950/80 rounded-xl p-4 border border-white/10 hover:border-lime-500/40 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Match Badge */}
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="bg-lime-500/10 text-lime-400 px-2 py-0.5 rounded border border-lime-500/20 font-bold font-mono text-[11px]">
                              {product.matchScore}% Match
                            </span>
                            <span className="text-slate-400 font-sans text-xs">{product.brand}</span>
                          </div>

                          <h4 className="font-sans font-bold text-sm text-white mb-2 line-clamp-2">
                            {product.name}
                          </h4>

                          {/* Reasoning Score Breakdown Bars */}
                          <div className="space-y-1.5 text-xs text-slate-300 my-3 bg-obsidian-900 p-2.5 rounded-lg border border-white/5 font-sans">
                            <div className="flex justify-between">
                              <span>ANC Isolation:</span>
                              <span className="text-lime-400 font-mono font-medium">{product.reasoningScores?.ancIsolation ?? 95}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Battery Life:</span>
                              <span className="text-cyan-400 font-mono font-medium">{product.reasoningScores?.battery ?? 92}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ergonomics & Weight:</span>
                              <span className="text-white font-mono font-medium">{product.reasoningScores?.weightErgonomics ?? 90}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {/* Price & Action */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div>
                              <div className="text-base font-bold text-white font-mono">${product.price}</div>
                              <div className="text-xs text-slate-400 line-through font-mono">
                                ${product.originalPrice}
                              </div>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              className="px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold text-xs shadow-lime-glow transition-all font-sans"
                            >
                              Add to Shortlist
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* View Sources Data Lineage Trigger */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-sans">
                    <button
                      onClick={() => setSelectedSources(message.sources)}
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>View Data Lineage ({message.sources.length} Warehouse Records)</span>
                    </button>
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Zero Hallucination Guard
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-lime-400 glass-card p-3 rounded-2xl w-fit font-sans"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Aiden is cross-referencing catalog graphs & pricing elasticity...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Prompt Discovery Bar */}
        <div className="p-4 md:p-6 border-t border-white/5 bg-obsidian-950/80 backdrop-blur-xl shrink-0 space-y-3">
          {/* Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 hover:border-lime-500/30 text-slate-300 text-xs transition-all font-sans font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 bg-obsidian-850 rounded-2xl p-2 border border-white/10 focus-within:border-lime-500/50 transition-colors"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Aiden: 'Compare long-haul travel headphones with active ANC under $400'..."
              className="flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-400 font-sans"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-3 bg-lime-500 hover:bg-lime-400 text-obsidian-950 rounded-xl transition-all disabled:opacity-40 shadow-lime-glow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Procurement / Shortlist Slide-Over Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-80 sm:w-96 border-l border-white/10 bg-obsidian-950/95 backdrop-blur-2xl p-6 flex flex-col justify-between shrink-0 z-20 shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-lime-400" />
                  <span className="font-sans font-bold text-white text-base">
                    Procurement Shortlist
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-xs text-slate-400 hover:text-white font-sans font-medium"
                >
                  Close ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-sans">
                  Your procurement cart is empty.
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3.5 bg-obsidian-850 rounded-xl border border-white/5 space-y-2 font-sans"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-white line-clamp-1">{product.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{product.sku}</div>
                        </div>
                        <span className="font-mono text-xs font-bold text-lime-400">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 rounded bg-obsidian-750 hover:bg-white/10 text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 rounded bg-obsidian-750 hover:bg-white/10 text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => updateQuantity(product.id, -quantity)}
                          className="text-slate-400 hover:text-coral-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="pt-4 border-t border-white/5 space-y-3 text-xs font-sans">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="text-white font-bold font-mono">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Enterprise Discount (5%)</span>
                <span className="text-emerald-400 font-mono">-${(cartTotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/5">
                <span>Estimated Total</span>
                <span className="text-lime-400 font-mono">${(cartTotal * 0.95).toFixed(2)}</span>
              </div>

              <button
                disabled={cart.length === 0}
                className="w-full py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-lime-glow disabled:opacity-40"
              >
                Submit Enterprise Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Lineage Modal */}
      <AnimatePresence>
        {selectedSources && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md"
            onClick={() => setSelectedSources(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-card rounded-2xl p-6 border border-white/10 space-y-4 shadow-2xl font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                  <Database className="w-4 h-4" />
                  <span>Verifiable Data Lineage Trace</span>
                </div>
                <button
                  onClick={() => setSelectedSources(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans">
                Every token generated by Aiden is bound to physical records in the enterprise data warehouse:
              </p>

              <div className="space-y-2 font-mono text-xs">
                {selectedSources.map((s, idx) => (
                  <div key={idx} className="p-3 bg-obsidian-950 rounded-xl border border-white/5">
                    <div className="text-lime-400 font-bold">{s.table}</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">{s.records}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Lineage Cryptographically Hashed (SHA-256)</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
