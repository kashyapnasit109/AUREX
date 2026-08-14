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
  Cell,
} from 'recharts';
import {
  mockRegionalMetrics,
  mockMonthlyPerformance,
  mockAutonomousInsights,
} from '../data/mockData';

export const DataMart: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState('Retail Transactions FY25 (42.8M Records)');
  const [activeView, setActiveView] = useState<'regional' | 'monthly' | 'table'>('regional');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [regionalData, setRegionalData] = useState(mockRegionalMetrics);
  const [insights, setInsights] = useState(mockAutonomousInsights);

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
          grossRevenue: `$${(r.revenue / 1000000).toFixed(1)}M`,
          growthMoM: `${r.growth_pct >= 0 ? '+' : ''}${r.growth_pct}%`,
          ordersCount: r.order_count.toLocaleString(),
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
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] font-semibold">
              ENTERPRISE DATAMART EXPLORER
            </span>
            <span className="font-mono text-xs text-slate-400">
              AGGREGATING 42,850,200 ROWS IN 18ms
            </span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
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

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 font-bold shadow-cyan-glow transition-all">
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
            <span className="font-mono text-[10px] text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">
              AUTONOMOUS FEED
            </span>
          </div>

          <div className="space-y-3">
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-cyan-400/40 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                    {insight.category}
                  </span>
                  <span className="font-mono text-[10px] text-lime-400 font-bold bg-obsidian-950 px-2 py-0.5 rounded border border-white/5">
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
                  <span className="text-white font-bold">{insight.metric}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                      insight.type === 'positive'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {insight.impact}
                  </span>
                </div>

                <div className="mt-3 p-2.5 bg-obsidian-950 rounded-xl border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-300">
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
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="text-[10px] text-slate-500 uppercase">Gross Aggregated Volume</div>
              <div className="text-2xl font-bold text-white mt-1">$58,800,000</div>
              <div className="text-[10px] text-emerald-400 mt-1">+18.4% vs Baseline</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="text-[10px] text-slate-500 uppercase">Total Order Units</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">514,900</div>
              <div className="text-[10px] text-slate-400 mt-1">Avg Order Value: $114.20</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="text-[10px] text-slate-500 uppercase">Query Execution Latency</div>
              <div className="text-2xl font-bold text-lime-400 mt-1">18.4 ms</div>
              <div className="text-[10px] text-slate-400 mt-1">Parallel In-Memory Scan</div>
            </div>
          </div>

          {/* Interactive Chart & Table Container */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* View Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 rounded-xl border border-white/10 font-mono text-xs">
                <button
                  onClick={() => setActiveView('regional')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeView === 'regional'
                      ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-cyan-glow'
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
                      ? 'bg-lime-500 text-obsidian-950 font-bold shadow-lime-glow'
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
              </div>

              {/* Inline Search Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter dimension..."
                  className="bg-obsidian-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-white outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* View 1: Regional Bar Matrix */}
            {activeView === 'regional' && (
              <div className="w-full h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredRegions} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                    <XAxis
                      dataKey="region"
                      stroke="#334155"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#334155"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0f17',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '11px',
                      }}
                      itemStyle={{ color: '#00E5FF' }}
                      formatter={(v: any) => [`$${(Number(v) / 1000000).toFixed(2)}M`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {filteredRegions.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#00E5FF' : index === 2 ? '#D4F938' : '#2a364f'}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 2: Monthly Performance Growth Curve */}
            {activeView === 'monthly' && (
              <div className="w-full h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthlyPerformance} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorMonthlyRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      stroke="#334155"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#334155"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0f17',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue ($M)"
                      stroke="#00E5FF"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorMonthlyRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 3: Enterprise Data Grid */}
            {activeView === 'table' && (
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead className="sticky top-0 bg-obsidian-950 text-slate-500 uppercase text-[10px] border-b border-white/5">
                    <tr>
                      <th className="py-3 px-3">Geographic Region</th>
                      <th className="py-3 px-3 text-right">Revenue (USD)</th>
                      <th className="py-3 px-3 text-right">Total Orders</th>
                      <th className="py-3 px-3 text-right">Avg Basket</th>
                      <th className="py-3 px-3 text-right">Growth YoY</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegions.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white">{row.region}</td>
                        <td className="py-3 px-3 text-right text-cyan-400 font-bold">
                          ${row.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-300">
                          {row.orders.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-300">
                          ${row.aov.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-semibold">
                          {row.growth}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-500/10 text-lime-400 border border-lime-500/20">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
