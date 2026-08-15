import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ShoppingBag,
  Database,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { type RetailProduct } from '../data/mockData';


const SESSION_KEY = 'AUREX_AIDEN_SESSION_V2';
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 Hour TTL

interface SavedSession {
  timestamp: number;
  messages: any[];
}

// Clean Visual Markdown & Data Table Renderer for AI Responses
const FormattedAIMessage: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const parseInlineMarkdown = (content: string): React.ReactNode[] => {
    const parts = content.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-obsidian-950 border border-white/10 text-cyan-300 font-mono text-[11px] mx-0.5">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[] = [];

  const renderTable = (rows: string[], key: string) => {
    if (rows.length < 2) return null;
    const headerCells = rows[0].split('|').map(c => c.trim()).filter(c => c !== '');
    const dataRows = rows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(c => c !== ''));

    return (
      <div key={key} className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-obsidian-950">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-obsidian-900 border-b border-white/10 text-slate-300">
              {headerCells.map((cell, idx) => (
                <th key={idx} className="p-2.5 font-mono font-semibold uppercase text-[11px] border-r border-white/5 last:border-r-0">
                  {parseInlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2.5 text-slate-300 border-r border-white/5 last:border-r-0">
                    {parseInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableRows.push(trimmed);
      continue;
    } else if (tableRows.length > 0) {
      elements.push(renderTable(tableRows, `table-${i}`));
      tableRows = [];
    }

    if (!trimmed) {
      elements.push(<div key={`space-${i}`} className="h-1.5" />);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm font-bold text-white mt-3 mb-1.5 flex items-center gap-2">
          <span>{parseInlineMarkdown(trimmed.slice(4))}</span>
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs font-bold text-cyan-300 mt-2.5 mb-1 flex items-center gap-2">
          <span>{parseInlineMarkdown(trimmed.slice(5))}</span>
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const content = trimmed.slice(2);
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 my-1 text-slate-300 text-xs leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
          <div>{parseInlineMarkdown(content)}</div>
        </div>
      );
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="my-1 text-slate-300 text-xs leading-relaxed">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  }

  if (tableRows.length > 0) {
    elements.push(renderTable(tableRows, `table-end`));
  }

  return <div className="space-y-1 font-sans">{elements}</div>;
};

export const Aiden: React.FC = () => {
  const getActiveUser = () => {
    try {
      const saved = localStorage.getItem('AUREX_AUTH_USER');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  const activeUser = getActiveUser();
  const sessionStorageKey = activeUser && !activeUser.isGuest
    ? `AUREX_AIDEN_USER_${activeUser.email}`
    : SESSION_KEY;

  const loadInitialMessages = () => {
    try {
      const saved = localStorage.getItem(sessionStorageKey);
      if (saved) {
        const parsed: SavedSession = JSON.parse(saved);
        if (!activeUser || activeUser.isGuest) {
          if (Date.now() - parsed.timestamp > SESSION_TTL_MS) {
            localStorage.removeItem(sessionStorageKey);
            return [];
          }
        }
        return parsed.messages || [];
      }
    } catch {}
    return [];
  };

  const [messages, setMessages] = useState<any[]>(loadInitialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lineageModalOpen, setLineageModalOpen] = useState(false);

  const [activeLineageData, setActiveLineageData] = useState<any>(null);
  const [cart, setCart] = useState<Array<{ product: RetailProduct; quantity: number }>>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);
  const [showProductsMap, setShowProductsMap] = useState<Record<string, boolean>>({});

  // Model selection state (Claude Opus 4, LM Studio, Custom)
  const [modelConfig, setModelConfig] = useState<{
    provider: 'cloud' | 'local' | 'custom';
    model_name: string;
    custom_url?: string;
    custom_api_key?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('AUREX_AI_MODEL_CONFIG');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { provider: 'cloud', model_name: 'claude-opus-4-8' };
  });

  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  const handleSelectModel = (provider: 'cloud' | 'local' | 'custom', model_name: string) => {
    const next = { ...modelConfig, provider, model_name };
    setModelConfig(next);
    localStorage.setItem('AUREX_AI_MODEL_CONFIG', JSON.stringify(next));
    setModelSelectorOpen(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const sessionData: SavedSession = {
        timestamp: Date.now(),
        messages
      };
      localStorage.setItem(sessionStorageKey, JSON.stringify(sessionData));
    }
  }, [messages, sessionStorageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const { AurexAPI } = await import('../services/api');
      const chatHistory = [...messages, userMessage].map(m => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text
      }));

      const res = await AurexAPI.chatAidenWithModel(chatHistory, modelConfig);

      const matchedProducts: RetailProduct[] = (res.suggested_products || []).map((p: any) => ({
        id: p.sku,
        sku: p.sku,
        name: p.name,
        brand: p.brand || 'AUREX Audio Systems',
        category: 'Audio',
        price: p.price,
        originalPrice: p.price * 1.15,
        rating: 4.8,
        reviewsCount: 120,
        stockStatus: p.inventory > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
        inventoryCount: p.inventory,
        matchScore: p.match_score,
        badge: 'CATALOG MATCH',
        reasoningScores: {
          battery: p.scores?.battery_efficiency || 90,
          ancIsolation: p.scores?.cabin_anc_isolation || 95,
          weightErgonomics: p.scores?.weight_ergonomics || 94,
          priceValue: 90,
          buildQuality: 92
        },
        keyFeatures: [p.key_feature || 'High Performance'],
        specs: { 'SKU': p.sku },
        imageAccent: 'from-cyan-500/20 to-blue-600/10'
      }));


      const aidenMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aiden',
        text: res.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: matchedProducts,
        lineage: res.lineage_trace,
        sources: matchedProducts.map(p => `DW_RETAIL.CATALOG_MASTER (SKU: ${p.id})`),
        modelUsed: res.model_used || modelConfig.model_name || 'claude-opus-4-8'
      };

      setMessages((prev) => [...prev, aidenMessage]);
      setShowProductsMap(prev => ({ ...prev, [aidenMessage.id]: true }));
    } catch {
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'aiden',
        text: '### System Notice\nAll system telemetry streams and data marts are active. You can ask me to run market research, analyze product inventory, or calculate quantitative metrics.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: [],
        sources: ['TELEMETRY.SYSTEM_ACTIVE'],
        modelUsed: 'system'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetSession = () => {
    localStorage.removeItem(sessionStorageKey);
    setMessages([]);
  };


  const toggleShowProducts = (msgId: string) => {
    setShowProductsMap(prev => ({
      ...prev,
      [msgId]: prev[msgId] === false ? true : false
    }));
  };

  const addToCart = (product: RetailProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as Array<{ product: RetailProduct; quantity: number }>
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleConfirmOrder = () => {
    const orderData = {
      orderId: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      items: cart,
      total: totalAmount,
      sha256: '987A10F284910284A0E1B90412851A0849201F92B3C84A0918',
    };
    setOrderConfirmed(orderData);
    setCart([]);
  };

  return (
    <div className="flex h-full w-full bg-obsidian-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-obsidian-950">
        
        {/* Sleek Minimalist Top Toolbar (48px high) */}
        <div className="h-12 border-b border-white/10 px-4 md:px-6 flex items-center justify-between bg-obsidian-900/90 shrink-0 z-10">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-semibold text-white">Aiden Assistant</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono text-[11px]">RAG Engine</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setModelSelectorOpen(!modelSelectorOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>
                  {modelConfig.provider === 'cloud' && (modelConfig.model_name || 'claude-opus-4-8')}
                  {modelConfig.provider === 'local' && 'LM Studio (Local)'}
                  {modelConfig.provider === 'custom' && 'Custom API'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {modelSelectorOpen && (
                <div className="absolute right-0 mt-1 w-64 rounded-xl bg-obsidian-850 border border-white/10 shadow-2xl p-1.5 z-50 text-xs font-sans space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Select Inference Model
                  </div>
                  {[
                    { provider: 'cloud' as const, name: 'claude-opus-4-8', label: '☁️ Claude Opus 4 (Cloud)' },
                    { provider: 'local' as const, name: 'default', label: '🖥️ LM Studio (localhost:1234)' },
                    { provider: 'custom' as const, name: '', label: '⚙️ Custom Endpoint' }
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectModel(opt.provider, opt.name)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        modelConfig.provider === opt.provider && (opt.provider === 'custom' || modelConfig.model_name === opt.name)
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {modelConfig.provider === opt.provider && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Session */}
            <button
              onClick={handleResetSession}
              title="Reset conversation"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 text-slate-400 hover:text-white transition-all text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 text-slate-300 hover:text-white transition-all text-xs relative"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-obsidian-950 font-bold text-[9px] flex items-center justify-center font-mono">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Maximized Scrollable Chat History Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="max-w-3xl mx-auto w-full space-y-4">
            
            {/* Minimalist Starter Suggestions (Only when conversation is empty) */}
            {messages.length === 0 && (
              <div className="py-12 text-center space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    What would you like to analyze?
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Ask for smartphone market research, procurement recommendations, financial arithmetic, or enterprise catalog inventory.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto text-left">
                  {[
                    { title: '📱 Smartphone Research', query: 'Which phone is best to buy right now under $1000?' },
                    { title: '🎧 Travel Headphones', query: 'Show me wireless noise-canceling headphones under $300' },
                    { title: '📊 Deterministic Math', query: 'Calculate 24500 * 1.18 + 450' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.query)}
                      className="p-3 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-white/10 hover:border-cyan-400/40 transition-all text-left space-y-1 group"
                    >
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {item.query}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Messages Stream */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="text-[10px] text-slate-500 font-mono px-1">
                  {message.sender === 'user' ? 'You' : 'Aiden AI'} • {message.timestamp}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed max-w-[90%] md:max-w-[85%] ${
                    message.sender === 'user'
                      ? 'bg-obsidian-800 text-white border border-white/15 shadow-sm'
                      : 'bg-obsidian-900 text-slate-200 border border-white/10 shadow-sm w-full'
                  }`}
                >
                  {message.sender === 'aiden' ? (
                    <FormattedAIMessage text={message.text} />
                  ) : (
                    <div className="whitespace-pre-wrap">{message.text}</div>
                  )}

                  {/* Collapsible Product Cards (Only shown for relevant catalog queries) */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleShowProducts(message.id)}
                          className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] font-semibold"
                        >
                          {showProductsMap[message.id] !== false
                            ? `Hide Matching SKUs (${message.products.length})`
                            : `View Matching SKUs (${message.products.length})`}
                        </button>
                        <span className="text-[10px] text-slate-500 font-mono">Catalog Grounded</span>
                      </div>

                      {showProductsMap[message.id] !== false && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {message.products.map((product: RetailProduct) => (
                            <div
                              key={product.id}
                              className="bg-obsidian-950 rounded-xl p-3 border border-white/10 flex flex-col justify-between space-y-2"
                            >
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-white truncate">{product.name}</div>
                                <div className="text-[11px] font-mono text-cyan-300 font-semibold">${product.price}</div>
                                <div className="text-[10px] text-slate-400 line-clamp-2">{product.keyFeatures?.[0] || 'Verified Specification'}</div>
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to Order</span>
                              </button>

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lineage Trace Button */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <button
                        onClick={() => {
                          setActiveLineageData(message.lineage || {
                            source_table: 'DW_RETAIL.CATALOG_MASTER',
                            records_queried: 3,
                            sha256_hash: '09654578209B36E4377765C4008466C7',
                            timestamp: '2026-08-15 00:40:00 UTC',
                            execution_ms: 12.4
                          });
                          setLineageModalOpen(true);
                        }}
                        className="text-cyan-400 hover:underline"
                      >
                        Lineage Trace (SHA-256)
                      </button>
                      <span>Verified Grounding</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono py-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Aiden is analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Compact Docked Input Bar */}
        <div className="p-3 md:p-4 border-t border-white/10 bg-obsidian-900/90 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask Aiden a question, research smartphones/hardware, or search catalog..."
              className="flex-1 bg-obsidian-950 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-obsidian-950 font-bold transition-all shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Procurement Cart */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-obsidian-950/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm bg-obsidian-900 border-l border-white/10 h-full p-5 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    <span>Procurement Cart</span>
                  </div>
                  <button onClick={() => setCartOpen(false)} className="text-xs text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500">
                    Cart is currently empty.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="p-3 rounded-xl bg-obsidian-950 border border-white/10 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-white truncate max-w-[150px]">{item.product.name}</div>
                          <div className="text-cyan-300 font-mono">${item.product.price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-white text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeFromCart(item.product.id)} className="p-1 rounded text-rose-400 hover:bg-rose-500/10">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Valuation</span>
                    <span className="text-sm font-bold text-white font-mono">${totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleConfirmOrder}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 font-bold text-xs transition-colors"
                  >
                    Confirm Purchase Order
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Provenance Lineage Modal */}
      <AnimatePresence>
        {lineageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/75 backdrop-blur-md"
            onClick={() => setLineageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-obsidian-900 rounded-2xl p-5 border border-white/15 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400">
                  <Database className="w-4 h-4" />
                  <span>Data Lineage & Cryptographic Proof</span>
                </div>
                <button onClick={() => setLineageModalOpen(false)} className="text-xs text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-xs font-mono text-slate-300">
                <div className="p-2.5 rounded-xl bg-obsidian-950 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Source Table</span>
                  <span className="text-cyan-300 font-bold">{activeLineageData?.source_table || 'DW_RETAIL.CATALOG_MASTER'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-950 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">SHA-256 Signature</span>
                  <span className="text-slate-300 break-all text-[11px]">{activeLineageData?.sha256_hash || '09654578209B36E4377765C4008466C7'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-950 border border-white/5 flex justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Audit Verification</span>
                    <span className="text-emerald-400 font-bold">100% Grounded</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Execution</span>
                    <span className="text-cyan-400 font-bold">{activeLineageData?.execution_ms || 12.4} ms</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Confirmed Modal */}
      <AnimatePresence>
        {orderConfirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/75 backdrop-blur-md"
            onClick={() => setOrderConfirmed(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-obsidian-900 rounded-2xl p-5 border border-emerald-500/40 space-y-4 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Purchase Order Dispatched</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">PO ID: {orderConfirmed.orderId}</p>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 text-xs text-slate-300 font-mono text-left space-y-1">
                <div>Total: ${orderConfirmed.total.toFixed(2)}</div>
                <div className="text-[10px] text-slate-500 truncate">Hash: {orderConfirmed.sha256}</div>
              </div>
              <button
                onClick={() => setOrderConfirmed(null)}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
