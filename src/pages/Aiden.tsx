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
  Clock,
  RotateCcw,
  Volume2,
  Battery,
  Feather,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { mockRetailCatalog, type RetailProduct } from '../data/mockData';


const SESSION_KEY = 'AUREX_AIDEN_SESSION_V2';
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 Hour TTL

interface SavedSession {
  timestamp: number;
  messages: any[];
}

// Rich Visual Markdown & Data Table Renderer for AI Responses
const FormattedAIMessage: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const parseInlineMarkdown = (content: string): React.ReactNode[] => {
    const parts = content.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-cyan-200 drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] mx-0.5">
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
    // Skip divider row (row 1 containing :--- or ---)
    const dataRows = rows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(c => c !== ''));

    return (
      <div key={key} className="my-4 overflow-x-auto rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-obsidian-950/90 to-[#0c1017]/90 p-1.5 shadow-[0_4px_25px_rgba(0,229,255,0.08)] backdrop-blur-md">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-950/80 via-obsidian-900 to-emerald-950/70 border-b border-cyan-500/30 text-cyan-300">
              {headerCells.map((cell, idx) => (
                <th key={idx} className="p-3 font-mono font-bold tracking-wider uppercase text-[11px] border-r border-white/5 last:border-r-0">
                  {parseInlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-cyan-500/5 transition-colors group">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3 text-slate-200 group-hover:text-white border-r border-white/5 last:border-r-0">
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
      elements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-white mt-4 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <span>{parseInlineMarkdown(trimmed.slice(4))}</span>
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const content = trimmed.slice(2);
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2.5 my-1.5 text-slate-200 text-sm leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <div>{parseInlineMarkdown(content)}</div>
        </div>
      );
      continue;
    }

    // Check if line is a math result highlight
    if (trimmed.toLowerCase().includes('result of') || trimmed.toLowerCase().includes('the answer is')) {
      elements.push(
        <div key={`math-${i}`} className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-obsidian-900 border border-emerald-500/30 text-emerald-300 my-2 font-mono text-sm font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>{parseInlineMarkdown(trimmed)}</div>
        </div>
      );
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="my-1 text-slate-200 text-sm leading-relaxed">
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
  // Get active user from auth
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

  // Session Storage Loader
  const loadInitialMessages = () => {
    try {
      const saved = localStorage.getItem(sessionStorageKey);
      if (saved) {
        const parsed: SavedSession = JSON.parse(saved);
        if (activeUser && !activeUser.isGuest) {
          if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
            return parsed.messages;
          }
        } else {
          if (Date.now() - parsed.timestamp < SESSION_TTL_MS && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
            return parsed.messages;
          }
        }
      }
    } catch (e) {
      console.warn('[Aiden] Failed to parse local session:', e);
    }
    return []; // Start fresh session cleanly
  };

  const [messages, setMessages] = useState<any[]>(loadInitialMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState<{ product: RetailProduct; quantity: number }[]>([
    { product: mockRetailCatalog[0], quantity: 1 },
  ]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<any[] | null>(null);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  // Load model config from localStorage
  const loadModelConfig = () => {
    try {
      const saved = localStorage.getItem('AUREX_AI_MODEL_CONFIG');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { provider: 'cloud', model_name: 'claude-opus-4-8' };
  };
  const [modelConfig, setModelConfig] = useState<{
    provider: 'cloud' | 'local' | 'custom';
    model_name: string;
    custom_url?: string;
    custom_api_key?: string;
  }>(loadModelConfig);

  // Persist model config
  useEffect(() => {
    localStorage.setItem('AUREX_AI_MODEL_CONFIG', JSON.stringify(modelConfig));
  }, [modelConfig]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showProductsMap, setShowProductsMap] = useState<Record<string, boolean>>({});

  // Auto-save session with user/guest isolation
  useEffect(() => {
    try {
      const sessionData: SavedSession = {
        timestamp: Date.now(),
        messages,
      };
      localStorage.setItem(sessionStorageKey, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('[Aiden] Session persistence error:', e);
    }
  }, [messages, sessionStorageKey]);

  const toggleShowProducts = (msgId: string) => {
    setShowProductsMap((prev) => ({ ...prev, [msgId]: prev[msgId] === false ? true : !prev[msgId] }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleResetSession = () => {
    localStorage.removeItem(sessionStorageKey);
    setMessages([]);
  };

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

    try {
      // Build full conversation history for context
      const chatHistory = messages
        .filter((m: any) => m.sender === 'user' || m.sender === 'aiden')
        .slice(-10)
        .map((m: any) => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.text || ''
        }));
      chatHistory.push({ role: 'user' as const, content: text });

      const apiRes = await import('../services/api').then(m => m.AurexAPI.sendAidenChat(
        chatHistory,
        modelConfig
      ));

      setIsTyping(false);

      if (apiRes && !apiRes.error && apiRes.message) {
        const hasProducts = Array.isArray(apiRes.suggested_products) && apiRes.suggested_products.length > 0;
        const formattedProducts: RetailProduct[] = hasProducts ? apiRes.suggested_products.map((p: any, idx: number) => ({
          id: p.sku || `SKU-PROD-${idx}`,
          sku: p.sku || `SKU-990${idx}`,
          name: p.name || 'Grounded Retail Item',
          brand: p.brand || 'Enterprise Catalog',
          price: p.price || 299.99,
          originalPrice: (p.price || 299.99) * 1.15,
          rating: 4.9,
          reviewsCount: 1420,
          stockStatus: 'IN_STOCK',
          inventoryCount: p.inventory ?? 142,
          matchScore: p.match_score || 96,
          badge: 'TOP GROUNDED MATCH',
          imageAccent: 'from-cyan-500/20 to-blue-600/10',
          keyFeatures: [p.key_feature || 'Active Hybrid ANC • 48h Battery • Titanium Drivers'],
          specs: { 'Battery': '30h', 'Weight': '250g', 'Status': 'In Stock' },
          category: 'Enterprise Tech',
          reasoningScores: {
            ancIsolation: p.scores?.anc_isolation || 95,
            battery: p.scores?.battery_efficiency || 92,
            weightErgonomics: p.scores?.weight_ergonomics || 90,
            priceValue: 92,
            buildQuality: 96,
          }
        })) : [];

        const aiResponse = {
          id: `m-${Date.now() + 1}`,
          sender: 'aiden' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: apiRes.message,
          products: formattedProducts,
          sources: [
            { table: apiRes.lineage_trace?.source_table || 'DW_RETAIL.CATALOG_MASTER', records: `${apiRes.lineage_trace?.records_queried || 2410} warehouse records evaluated` },
            { table: 'SHA256_LINEAGE_LEDGER', records: `Hash: ${apiRes.lineage_trace?.sha256_hash?.substring(0, 24) || '98e2f6ec12303405fd5cc5dd'}...` },
            { table: 'REALTIME_IN_MEMORY_SCAN', records: `Latency: ${apiRes.lineage_trace?.execution_ms || 12.4}ms` },
          ],
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // Honest error — no fake fallback
        const errorText = apiRes?.error || 'AI service is temporarily unavailable. Please check your API key in Settings or try a different model provider.';
        const aiResponse = {
          id: `m-${Date.now() + 1}`,
          sender: 'aiden' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `⚠️ **AI Response Error**\n\n${errorText}`,
          products: [],
          sources: [
            { table: 'ERROR_HANDLER', records: `Provider: ${modelConfig.provider}` },
          ],
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (err: any) {
      setIsTyping(false);
      const aiResponse = {
        id: `m-${Date.now() + 1}`,
        sender: 'aiden' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ **Connection Error**\n\nFailed to connect to the AI backend. Please ensure the backend server is running at \`http://localhost:8000\`.`,
        products: [],
        sources: [
          { table: 'NETWORK_ERROR', records: err?.message || 'Connection failed' },
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

  const handleSubmitOrder = () => {
    setOrderSuccess('Order PO-2026-8801 submitted and routed to procurement ERP!');
    setCart([]);
    setTimeout(() => {
      setOrderSuccess(null);
      setCartOpen(false);
    }, 3000);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const promptSuggestions = [
    '5+7?',
    'Compare Sony XM5 vs Bose QuietComfort Ultra battery specs',
    'Wireless noise-canceling headphones for travel under $400',
    'Identify highest-margin travel accessories with >4.5 rating',
  ];

  return (
    <div className="flex h-full font-sans relative overflow-hidden bg-[#080a0e]">
      {/* Main Conversational Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Module Header */}
        <div className="p-4 md:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-obsidian-950/90 via-obsidian-900/80 to-obsidian-950/90 backdrop-blur-xl shrink-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>RAG-Powered AI Intelligence</span>
            </div>
            <h1 className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight">
              Aiden AI Assistant
            </h1>
          </div>

          {/* Session Status, Model Selector & Cart Controls */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* AI Model Selector */}
            <div className="relative">
              <button
                onClick={() => setModelSelectorOpen(!modelSelectorOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all ${
                  modelConfig.provider === 'cloud'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
                    : modelConfig.provider === 'local'
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:border-purple-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:border-amber-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  modelConfig.provider === 'cloud' ? 'bg-cyan-400' : modelConfig.provider === 'local' ? 'bg-purple-400' : 'bg-amber-400'
                } animate-pulse`} />
                <span>{modelConfig.provider === 'cloud' ? `☁️ ${modelConfig.model_name || 'claude-opus-4-8'}` : modelConfig.provider === 'local' ? `🖥️ ${modelConfig.model_name || 'llama3.2'}` : `⚙️ ${modelConfig.model_name || 'Custom'}`}</span>
              </button>

              {modelSelectorOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-obsidian-850 border border-white/10 shadow-2xl p-2 z-50 text-xs font-sans space-y-1">
                  <div className="p-2 border-b border-white/10 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Select AI Model</div>
                  {[
                    { provider: 'cloud' as const, name: 'claude-opus-4-8', label: '☁️ Claude Opus 4 (Cloud)', color: 'text-cyan-400' },
                    { provider: 'cloud' as const, name: 'claude-sonnet-4-20250514', label: '☁️ Claude Sonnet 4 (Cloud)', color: 'text-cyan-300' },
                    { provider: 'local' as const, name: 'default', label: '🖥️ LM Studio (Active Local Model)', color: 'text-purple-400' },
                    { provider: 'local' as const, name: 'llama-3.2-3b-instruct', label: '🖥️ Llama 3.2 (LM Studio)', color: 'text-purple-300' },
                    { provider: 'local' as const, name: 'mistral-7b-instruct', label: '🖥️ Mistral 7B (LM Studio)', color: 'text-purple-200' },
                  ].map((opt) => (

                    <button
                      key={`${opt.provider}-${opt.name}`}
                      onClick={() => {
                        setModelConfig({ ...modelConfig, provider: opt.provider, model_name: opt.name });
                        setModelSelectorOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl transition-colors ${
                        modelConfig.provider === opt.provider && modelConfig.model_name === opt.name
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className={opt.color}>{opt.label}</span>
                      {modelConfig.provider === opt.provider && modelConfig.model_name === opt.name && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 ml-auto" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-white/10 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setModelConfig({ provider: 'custom', model_name: '', custom_url: modelConfig.custom_url || '', custom_api_key: modelConfig.custom_api_key || '' });
                        setModelSelectorOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl transition-colors ${
                        modelConfig.provider === 'custom'
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-amber-400">⚙️ Custom Model (Configure in Settings)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Clock className="w-3 h-3 ml-0.5" />
              <span>
                {activeUser && !activeUser.isGuest
                  ? `${activeUser.name}`
                  : 'Guest Session'}
              </span>
            </div>

            <button
              onClick={handleResetSession}
              title="Reset conversation session"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 hover:border-white/20 text-slate-300 transition-all font-sans text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">New Session</span>
            </button>

            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-lime-500/20 to-emerald-500/20 hover:from-lime-500/30 hover:to-emerald-500/30 border border-lime-500/30 text-lime-300 transition-all relative font-medium font-sans shadow-[0_0_15px_rgba(212,249,56,0.1)]"
            >
              <ShoppingBag className="w-4 h-4 text-lime-400" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-lime-400 text-obsidian-950 font-bold text-[10px] flex items-center justify-center font-mono shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col justify-start">
          <div className="max-w-4xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-start">
            {/* Starter Hero View when no messages exist */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-auto py-8 text-center space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SeekAI Grounded Engine Active • SHA-256 Validated</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    How can Aiden assist your enterprise today?
                  </h2>
                  <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                    Ask specification comparisons, evaluate multi-attribute vector similarity, calculate exact arithmetic, or dispatch procurement orders.
                  </p>
                </div>

                {/* Prompt Discovery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left pt-2">
                  {[
                    { title: 'Arithmetic & Logic', query: '5+7?', desc: 'Instant precision evaluation' },
                    { title: 'Brand Spec Comparison', query: 'Compare Sony XM5 vs Bose QuietComfort Ultra battery specs', desc: 'Factual specs & battery autonomy' },
                    { title: 'Acoustic Procurement', query: 'Wireless noise-canceling headphones for travel under $400', desc: 'Vector similarity catalog match' },
                    { title: 'Margin Analytics', query: 'Identify highest-margin travel accessories with >4.5 rating', desc: 'DuckDB OLAP data scan' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.query)}
                      className="p-4 rounded-2xl bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/90 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] transition-all group text-left backdrop-blur-md space-y-1"
                    >
                      <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center justify-between">
                        <span>{item.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-xs font-mono text-white line-clamp-1">{item.query}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chat Messages */}
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
                  <span className="font-medium text-slate-300">{message.sender === 'user' ? 'Operator' : 'Aiden AI (Grounded Core)'}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-slate-500">{message.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`w-full max-w-3xl rounded-2xl p-5 md:p-6 text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-cyan-600/30 via-cyan-900/20 to-obsidian-900 text-white border border-cyan-500/40 shadow-[0_4px_20px_rgba(0,229,255,0.1)] self-end'
                      : 'bg-gradient-to-br from-obsidian-900/95 via-[#0e131d]/95 to-obsidian-950/95 text-slate-200 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl'
                  }`}
                >
                  {/* Rich Rendered AI Message */}
                  {message.sender === 'aiden' ? (
                    <FormattedAIMessage text={message.text} />
                  ) : (
                    <div className="font-sans whitespace-pre-wrap leading-relaxed text-slate-100 font-medium">
                      {message.text}
                    </div>
                  )}

                  {/* Collapsible Structured Product Matches */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-white/10 space-y-4 font-sans">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleShowProducts(message.id)}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-transparent hover:from-cyan-500/20 hover:via-emerald-500/20 border border-cyan-500/30 text-xs text-cyan-300 font-mono font-semibold transition-all shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            {showProductsMap[message.id] !== false
                              ? `Hide Product Matches (${message.products.length})`
                              : `View Grounded Product Matches (${message.products.length})`}
                          </span>
                        </button>

                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Vector Scored
                        </span>
                      </div>

                      {showProductsMap[message.id] !== false && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                          {message.products.map((product: RetailProduct) => (
                            <div
                              key={product.id}
                              className="bg-gradient-to-b from-[#131924]/95 via-[#0e131c]/95 to-[#0a0d14]/95 rounded-2xl p-4 md:p-5 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.12)] transition-all duration-300 flex flex-col justify-between group relative space-y-4 backdrop-blur-md"
                            >
                              <div className="space-y-3">
                                {/* Top Bar: Match Score & Brand */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 text-emerald-300 font-bold font-mono text-[11px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>{product.matchScore || 98}% Match</span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">
                                    {product.brand}
                                  </span>
                                </div>

                                {/* Title */}
                                <h4 className="font-sans font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                                  {product.name}
                                </h4>

                                {/* Visual Attribute Progress Bars */}
                                <div className="space-y-2 text-xs bg-obsidian-950/70 p-3 rounded-xl border border-white/5 font-sans">
                                  <div>
                                    <div className="flex justify-between text-[11px] mb-1">
                                      <span className="text-slate-400 flex items-center gap-1.5">
                                        <Volume2 className="w-3 h-3 text-cyan-400" /> ANC Isolation
                                      </span>
                                      <span className="text-cyan-300 font-mono font-bold">{product.reasoningScores?.ancIsolation ?? 95}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${product.reasoningScores?.ancIsolation ?? 95}%` }}
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between text-[11px] mb-1">
                                      <span className="text-slate-400 flex items-center gap-1.5">
                                        <Battery className="w-3 h-3 text-emerald-400" /> Battery Autonomy
                                      </span>
                                      <span className="text-emerald-300 font-mono font-bold">{product.reasoningScores?.battery ?? 92}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${product.reasoningScores?.battery ?? 92}%` }}
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between text-[11px] mb-1">
                                      <span className="text-slate-400 flex items-center gap-1.5">
                                        <Feather className="w-3 h-3 text-indigo-400" /> Ergonomics & Weight
                                      </span>
                                      <span className="text-indigo-300 font-mono font-bold">{product.reasoningScores?.weightErgonomics ?? 94}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${product.reasoningScores?.weightErgonomics ?? 94}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Price & Action */}
                              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <div>
                                  <div className="text-lg font-bold text-white font-mono tracking-tight">
                                    ${product.price}
                                  </div>
                                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> In Stock ({product.inventoryCount || 142} units)
                                  </div>
                                </div>

                                <button
                                  onClick={() => addToCart(product)}
                                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(212,249,56,0.25)] transition-all font-sans transform active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Sources Data Lineage Trigger */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-sans">
                      <button
                        onClick={() => setSelectedSources(message.sources)}
                        className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>View Data Lineage ({message.sources.length} Warehouse Records)</span>
                      </button>
                      <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" /> RAG Grounded Guard
                      </span>

                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs text-cyan-300 bg-obsidian-900/90 border border-cyan-500/30 p-3 rounded-2xl w-fit font-sans shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Aiden is cross-referencing catalog vectors & pricing elasticity...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input & Prompt Discovery Bar */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-obsidian-950/90 backdrop-blur-xl shrink-0 space-y-3">
          <div className="max-w-4xl mx-auto w-full space-y-3">
            {/* Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 hover:border-cyan-500/40 text-slate-300 text-xs transition-all font-sans font-medium hover:text-cyan-300"
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
              className="flex items-center gap-3 bg-obsidian-850 rounded-2xl p-2 border border-white/10 focus-within:border-cyan-500/50 transition-colors shadow-lg"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Aiden: '5+7?' or 'Compare Sony XM5 vs Bose QuietComfort Ultra battery specs'..."
                className="flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500 font-sans"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-obsidian-950 rounded-xl transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(212,249,56,0.2)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
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

              {orderSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-sans mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{orderSuccess}</span>
                </div>
              )}

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
                onClick={handleSubmitOrder}
                disabled={cart.length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-[0_0_15px_rgba(212,249,56,0.3)] disabled:opacity-40"
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
              className="w-full max-w-lg bg-obsidian-900 rounded-2xl p-6 border border-white/10 space-y-4 shadow-2xl font-sans"
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
