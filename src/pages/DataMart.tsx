import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  BarChart3,
  TrendingUp,
  Zap,
  Search,
  Sparkles,
  Table as TableIcon,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  mockRegionalMetrics,
  mockMonthlyPerformance,
  mockAutonomousInsights,
} from '../data/mockData';

// Custom Glassmorphic Tooltip for Regional Bar Chart
const CustomRegionalTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0b0f19]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] font-mono text-xs space-y-2 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-bold text-white text-sm">{data.region}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium">
            {data.status}
          </span>
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Revenue:</span>
            <span className="text-cyan-300 font-bold">${(Number(data.revenue) / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Orders:</span>
            <span className="text-slate-200">{Number(data.orders).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Avg Order Value:</span>
            <span className="text-slate-200">${Number(data.aov).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Growth:</span>
            <span className="text-emerald-400 font-bold">{data.growth}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Growth Trajectory
const CustomGrowthTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b0f19]/95 backdrop-blur-xl border border-lime-500/30 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] font-mono text-xs space-y-2 min-w-[180px]">
        <div className="font-bold text-white text-sm border-b border-white/10 pb-1.5">{label}</div>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}:
            </span>
            <span className="font-bold text-white">${p.value}M</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DataMart: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState('Retail Transactions FY25 (42.8M Records)');
  const [activeView, setActiveView] = useState<'regional' | 'monthly' | 'table' | 'nl_query'>('regional');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [regionalData, setRegionalData] = useState(mockRegionalMetrics);
  const [insights, setInsights] = useState(mockAutonomousInsights);

  const [nlPrompt, setNlPrompt] = useState('Show me the regions with highest revenue and active growth');
  const [nlResult, setNlResult] = useState<any>(null);
  const [isNLQuerying, setIsNLQuerying] = useState(false);

  const handleNLQuery = async () => {
    if (!nlPrompt.trim()) return;
    setIsNLQuerying(true);
    const res = await import('../services/api').then(m => m.AurexAPI.runNLQuery(nlPrompt));
    if (res) setNlResult(res);
    setIsNLQuerying(false);
  };

  const fetchLiveMetrics = async () => {
    setIsRefreshing(true);
    const apiRes = await import('../services/api').then(m => m.AurexAPI.getDataMartMetrics({
      dataset: selectedDataset,
      region: 'All'
    }));

    if (apiRes) {
      if (apiRes.regional_matrix && apiRes.regional_matrix.length > 0) {
        const formatted = apiRes.regional_matrix.map((r: any) => ({
          region: r.region,
          revenue: r.revenue,
          grossRevenue: `$${(r.revenue / 1000000).toFixed(1)}M`,
          growth: `${r.growth_pct >= 0 ? '+' : ''}${r.growth_pct}%`,
          orders: r.order_count,
          ordersCount: r.order_count.toLocaleString(),
          aov: r.avg_order_value,
          avgBasketValue: `$${r.avg_order_value.toFixed(2)}`,
          churnRiskScore: `${r.churn_risk_score}/5.0`,
          status: r.churn_risk_score < 2.0 ? 'Optimal Growth' : 'Action Required'
        }));
        setRegionalData(formatted);
      }

      if (apiRes.insights && apiRes.insights.length > 0) {
        const formattedInsights = apiRes.insights.map((ins: any) => ({
          id: ins.id,
          title: ins.title,
          description: ins.description,
          impact: ins.impact_tier,
          confidence: `${ins.confidence_pct}%`,
          action: ins.action_item
        }));
        setInsights(formattedInsights);
      }
    }
    setIsRefreshing(false);
  };

  const handleRefresh = () => {
    fetchLiveMetrics();
  };

  const filteredRegions = regionalData.filter(
    (r) =>
      r.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 font-sans bg-[#080a0e]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              ENTERPRISE DATAMART EXPLORER
            </span>
            <span className="font-mono text-xs text-slate-400">
              AGGREGATING 42,850,200 ROWS IN 18ms
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Multi-Dimensional Analytics & Ingestion Workspace
          </h1>
          <p className="text-slate-400 font-sans text-xs sm:text-sm mt-0.5">
            Fast filtering, dimensional cohort analysis, and automated business anomaly detection.
          </p>
        </div>

        {/* Dataset Selector & Export Actions */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="bg-obsidian-850 border border-white/10 text-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-cyan-400 transition-colors"
          >
            <option value="Retail Transactions FY25 (42.8M Records)">
              Retail Transactions FY25 (42.8M Rows)
            </option>
            <option value="Supply Chain & Fulfillment Logs (14.2M Records)">
              Supply Chain Logs (14.2M Rows)
            </option>
            <option value="Omnichannel Customer Cohorts (8.9M Records)">
              Customer Cohorts (8.9M Rows)
            </option>
          </select>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-300 transition-all"
            title="Refresh Ingestion"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-obsidian-950 font-bold shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Insights Sidebar (Left 4 cols) + Analytics Canvas (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: AUREX Autonomous Insights Feed */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">
                AUREX Business Insights
              </span>
            </div>
            <span className="font-mono text-[10px] text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              AUTONOMOUS FEED
            </span>
          </div>

          <div className="space-y-3">
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-obsidian-900/90 via-[#0e131d]/90 to-obsidian-950/90 p-5 rounded-2xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group relative overflow-hidden backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                    {insight.category || 'REVENUE & ANOMALY'}
                  </span>
                  <span className="font-mono text-[10px] text-lime-400 font-bold bg-obsidian-950/80 px-2 py-0.5 rounded border border-white/5">
                    {insight.confidence} Confidence
                  </span>
                </div>

                <h4 className="font-display font-bold text-sm text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {insight.title}
                </h4>

                <p className="text-slate-400 text-xs leading-relaxed mb-3 font-sans">
                  {insight.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 font-mono text-xs">
                  <span className="text-white font-bold">{insight.metric || 'Positive Drift'}</span>
                  <span
                    className={`text-[9px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                      insight.impact === 'HIGH' || insight.type === 'positive'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {insight.impact}
                  </span>
                </div>

                <div className="mt-3 p-2.5 bg-obsidian-950/90 rounded-xl border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="text-lime-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Action:
                  </span>
                  <span className="text-slate-400 truncate max-w-[200px]">{insight.action}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Exploration Canvas & Visual Switcher */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="bg-gradient-to-br from-obsidian-900/90 via-[#0e131d]/90 to-obsidian-950/90 p-4 rounded-2xl border border-white/10 shadow-md">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Gross Aggregated Volume</div>
              <div className="text-2xl font-bold text-white mt-1">$58,800,000</div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3 h-3" /> +18.4% vs Baseline
              </div>
            </div>
            <div className="bg-gradient-to-br from-obsidian-900/90 via-[#0e131d]/90 to-obsidian-950/90 p-4 rounded-2xl border border-white/10 shadow-md">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Order Units</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">514,900</div>
              <div className="text-[10px] text-slate-400 mt-1 font-sans">Avg Order Value: $114.20</div>
            </div>
            <div className="bg-gradient-to-br from-obsidian-900/90 via-[#0e131d]/90 to-obsidian-950/90 p-4 rounded-2xl border border-white/10 shadow-md">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Query Execution Latency</div>
              <div className="text-2xl font-bold text-lime-400 mt-1">18.4 ms</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-lime-400" /> Parallel In-Memory Scan
              </div>
            </div>
          </div>

          {/* Interactive Chart & Table Container */}
          <div className="bg-gradient-to-br from-obsidian-900/90 via-[#0d121c]/90 to-obsidian-950/90 p-6 rounded-3xl border border-white/10 space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* View Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-obsidian-950 rounded-xl border border-white/10 font-mono text-xs">
                <button
                  onClick={() => setActiveView('regional')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeView === 'regional'
                      ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Regional Matrix</span>
                </button>
                <button
                  onClick={() => setActiveView('monthly')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeView === 'monthly'
                      ? 'bg-lime-400 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,249,56,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Growth Trajectory</span>
                </button>
                <button
                  onClick={() => setActiveView('table')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeView === 'table'
                      ? 'bg-white text-obsidian-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Tabular Grid</span>
                </button>
                <button
                  onClick={() => setActiveView('nl_query')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeView === 'nl_query'
                      ? 'bg-purple-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Natural Language SQL Builder</span>
                </button>
              </div>

              {/* Inline Search Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter dimension..."
                  className="bg-obsidian-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-white outline-none focus:border-cyan-400 placeholder:text-slate-600 w-full sm:w-44"
                />
              </div>
            </div>

            {/* View 1: Regional Bar Matrix with Ultra-Sleek Gradient Styling */}
            {activeView === 'regional' && (
              <div className="w-full h-84 relative pt-2">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={filteredRegions} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="barGlowCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="barGlowEmerald" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="barGlowLime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d4f938" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#84cc16" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="region"
                      stroke="#475569"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      stroke="#475569"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
                      dx={-8}
                    />
                    <Tooltip content={<CustomRegionalTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                    <Bar
                      dataKey="revenue"
                      radius={[8, 8, 2, 2]}
                      fill="url(#barGlowCyan)"
                      className="hover:brightness-125 transition-all duration-300 cursor-pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 2: Monthly Performance Growth Curve */}
            {activeView === 'monthly' && (
              <div className="w-full h-84 relative pt-2">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={mockMonthlyPerformance} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorMonthlyRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#475569"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      stroke="#475569"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}M`}
                      dx={-8}
                    />
                    <Tooltip content={<CustomGrowthTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue ($M)"
                      stroke="#00E5FF"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorMonthlyRev)"
                      dot={{ r: 4, fill: '#00E5FF', stroke: '#080a0e', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#d4f938', stroke: '#00E5FF', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 3: Enterprise Data Grid */}
            {activeView === 'table' && (
              <div className="overflow-x-auto max-h-80 rounded-2xl border border-white/5">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead className="sticky top-0 bg-obsidian-950 text-slate-400 uppercase text-[10px] border-b border-white/10 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Geographic Region</th>
                      <th className="py-3.5 px-4 text-right font-bold">Revenue (USD)</th>
                      <th className="py-3.5 px-4 text-right font-bold">Total Orders</th>
                      <th className="py-3.5 px-4 text-right font-bold">Avg Basket</th>
                      <th className="py-3.5 px-4 text-right font-bold">Growth YoY</th>
                      <th className="py-3.5 px-4 text-center font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-obsidian-900/40">
                    {filteredRegions.map((row, idx) => (
                      <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{row.region}</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-bold">
                          ${row.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-300">
                          {row.orders.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-300">
                          ${row.aov.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-semibold">
                          {row.growth}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* View 4: Natural Language SQL Builder */}
            {activeView === 'nl_query' && (
              <div className="space-y-4 font-sans">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={nlPrompt}
                    onChange={(e) => setNlPrompt(e.target.value)}
                    placeholder="Ask AUREX to generate SQL and query DuckDB 1M records..."
                    className="flex-1 bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500 font-sans"
                  />
                  <button
                    onClick={handleNLQuery}
                    disabled={isNLQuerying}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isNLQuerying ? 'Generating SQL...' : 'Run Query'}</span>
                  </button>
                </div>

                {nlResult && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-obsidian-950 border border-purple-500/30 space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-purple-400">
                        <span>GENERATED DUCKDB SQL (SeekAI claude-opus-5)</span>
                        <span>Execution: {nlResult.execution_ms}ms • 1.0M Records</span>
                      </div>
                      <pre className="text-lime-400 text-[11px] overflow-x-auto p-3 rounded-xl bg-obsidian-900 border border-white/5">
                        {nlResult.generated_sql}
                      </pre>
                    </div>

                    <div className="overflow-x-auto max-h-60 rounded-xl border border-white/10 bg-obsidian-950">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-obsidian-900 text-slate-400 uppercase text-[10px]">
                          <tr>
                            {Object.keys(nlResult.results[0] || {}).map((k) => (
                              <th key={k} className="py-2.5 px-3">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {nlResult.results.map((r: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/5">
                              {Object.values(r).map((v: any, j: number) => (
                                <td key={j} className="py-2.5 px-3 text-slate-200">{String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
