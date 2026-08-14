import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  BarChart3,
  TrendingUp,
  Search,
  Sparkles,
  Table as TableIcon,
  RefreshCw,
  Database,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Activity,
  ShieldCheck,
  ArrowRight,
  Zap,
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
  CartesianGrid,
} from 'recharts';
import {
  mockRegionalMetrics,
  mockMonthlyPerformance,
  mockEnterpriseInsights,
} from '../data/mockData';
import { AskAurexDrawer } from '../components/common/AskAurexDrawer';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';
import type { EvidenceTrace } from '../types/domain';

const datasetOptions = [
  'Retail Transactions FY25 (42.8M Records)',
  'Enterprise SaaS ARR & Churn Telemetry',
  'Global Omnichannel Supply Chain Logistics',
];

export const DataMart: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState(datasetOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<'regional' | 'monthly' | 'table'>('regional');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [askAurexOpen, setAskAurexOpen] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceTrace | null>(null);

  // Quick Slice Filter State
  const [selectedCohort, setSelectedCohort] = useState<'ENTERPRISE' | 'HIGH_GROWTH'>('ENTERPRISE');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredRegions = mockRegionalMetrics.filter(
    (r) => r.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      <AskAurexDrawer
        isOpen={askAurexOpen}
        onClose={() => setAskAurexOpen(false)}
        contextTitle={`DataMart: ${selectedDataset}`}
        contextPrompt="Explain why North America and APAC are leading revenue growth this quarter."
      />

      <EvidenceDrawer
        isOpen={!!activeEvidence}
        onClose={() => setActiveEvidence(null)}
        evidence={activeEvidence}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-xs font-semibold">
              ENTERPRISE DATAMART EXPLORER
            </span>
            <span className="font-mono text-xs text-slate-300 font-medium">
              Aggregating 42,850,200 Rows in 18ms
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            Multi-Dimensional Enterprise Analytics
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-1">
            Sub-second dimensional slice-and-dice, cohort aggregations, and autonomous anomaly signals.
          </p>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setAskAurexOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-200 font-semibold transition-all font-sans"
          >
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Ask AUREX</span>
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-300 transition-all font-sans font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold shadow-lime-glow transition-all font-sans">
            <Download className="w-4 h-4" />
            <span>Export Parquet</span>
          </button>
        </div>
      </div>

      {/* Main Symmetrical Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Ingestion Feeds & Autonomous Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Custom Bespoke Glassmorphism Dataset Dropdown */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 relative z-30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider font-sans">
                Active Ingestion Pipeline
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                LIVE SYNC
              </span>
            </div>

            {/* Custom Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-obsidian-950 hover:bg-obsidian-900 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs text-white flex items-center justify-between transition-all font-sans font-medium shadow-inner"
              >
                <span className="truncate pr-2">{selectedDataset}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {/* Custom Animated Glass Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-obsidian-950/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 p-1.5 space-y-1"
                  >
                    {datasetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedDataset(opt);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-sans flex items-center justify-between transition-colors ${
                          selectedDataset === opt
                            ? 'bg-lime-500 text-obsidian-950 font-bold shadow-sm'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate pr-2">{opt}</span>
                        {selectedDataset === opt && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Autonomous Insights Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider font-sans">
                  Autonomous Insights Feed
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">3 Signals</span>
            </div>

            {mockEnterpriseInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-lime-400 font-bold bg-lime-500/10 px-2.5 py-1 rounded border border-lime-500/20 text-xs">
                    {insight.signal}
                  </span>
                  <span className="text-slate-300 text-xs font-semibold">
                    {insight.confidence}
                  </span>
                </div>

                <h4 className="font-sans font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {insight.title}
                </h4>

                <p className="text-slate-300 text-xs leading-relaxed font-sans font-normal">
                  {insight.why}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs">
                  <span className="text-white font-bold text-sm">{insight.impact}</span>
                  <button
                    onClick={() => setActiveEvidence(insight.evidence)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 transition-colors"
                  >
                    <Database className="w-3.5 h-3.5" /> View Trace
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Visual Canvas + Elegant Cohort Intelligence */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
            <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Aggregated</div>
              <div className="text-3xl font-bold font-mono text-white mt-1.5">$58,800,000</div>
              <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +21.4% vs Previous Cycle
              </div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div className="text-xs text-slate-400 uppercase font-semibold">Transactions Filtered</div>
              <div className="text-3xl font-bold font-mono text-cyan-400 mt-1.5">415,500 Orders</div>
              <div className="text-xs text-slate-300 font-medium mt-2">Sub-second Materialization</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div className="text-xs text-slate-400 uppercase font-semibold">Average Fulfillment Latency</div>
              <div className="text-3xl font-bold font-mono text-lime-400 mt-1.5">1.7 Days</div>
              <div className="text-xs text-emerald-400 font-semibold mt-2">Optimal Fleet Distribution</div>
            </div>
          </div>

          {/* Interactive Chart Canvas with Radiant Gradients */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 p-1 bg-obsidian-950 rounded-xl border border-white/10 text-xs font-sans">
                <button
                  onClick={() => setActiveView('regional')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold ${
                    activeView === 'regional'
                      ? 'bg-cyan-500 text-obsidian-950 shadow-cyan-glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Regional Breakdown</span>
                </button>
                <button
                  onClick={() => setActiveView('monthly')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold ${
                    activeView === 'monthly'
                      ? 'bg-lime-500 text-obsidian-950 shadow-lime-glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Monthly Trajectory</span>
                </button>
                <button
                  onClick={() => setActiveView('table')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold ${
                    activeView === 'table'
                      ? 'bg-amber-500 text-obsidian-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-4 h-4" />
                  <span>Tabular Grid</span>
                </button>
              </div>

              {activeView === 'table' && (
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by region..."
                    className="bg-obsidian-950 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 font-sans"
                  />
                </div>
              )}
            </div>

            {/* View 1: Radiant Stylized Regional Bar Chart */}
            {activeView === 'regional' && (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockRegionalMetrics} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity={0.3} />
                      </linearGradient>
                      <linearGradient id="barGradEmerald" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#047857" stopOpacity={0.3} />
                      </linearGradient>
                      <linearGradient id="barGradLime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4F938" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#84CC16" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="region"
                      stroke="#475569"
                      tick={{ fill: '#cbd5e1', fontSize: 12, fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#475569"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="glass-card p-3.5 rounded-xl border border-white/20 text-xs shadow-2xl font-sans space-y-1">
                              <div className="font-bold text-white text-sm">{data.region}</div>
                              <div className="text-cyan-400 font-mono font-bold text-sm">
                                Revenue: ${data.revenue.toLocaleString()}
                              </div>
                              <div className="text-emerald-400 font-mono text-xs font-semibold">
                                Growth: +{data.growth}% YoY
                              </div>
                              <div className="text-slate-300 font-mono text-[11px]">
                                Orders: {data.orders.toLocaleString()}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                      {mockRegionalMetrics.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? 'url(#barGradCyan)' : index === 2 ? 'url(#barGradLime)' : 'url(#barGradEmerald)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 2: Monthly Trajectory Area Chart */}
            {activeView === 'monthly' && (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthlyPerformance} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMonthlyRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#475569"
                      tick={{ fill: '#cbd5e1', fontSize: 12, fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#475569"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0f17',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Monthly Rev ($M)"
                      stroke="#00E5FF"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorMonthlyRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 3: Enterprise Data Grid */}
            {activeView === 'table' && (
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead className="sticky top-0 bg-obsidian-950 text-slate-300 uppercase text-xs border-b border-white/10 font-sans font-bold">
                    <tr>
                      <th className="py-3 px-4">Geographic Region</th>
                      <th className="py-3 px-4 text-right">Revenue (USD)</th>
                      <th className="py-3 px-4 text-right">Total Orders</th>
                      <th className="py-3 px-4 text-right">Growth YoY</th>
                      <th className="py-3 px-4 text-center">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredRegions.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white text-sm">{row.region}</td>
                        <td className="py-3.5 px-4 text-right text-cyan-400 font-mono font-bold text-sm">
                          ${row.revenue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-200 font-mono">
                          {row.orders.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right text-emerald-400 font-mono font-bold">
                          +{row.growth}%
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-300 font-medium">
                          {row.latency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* High-Contrast Dimensional Cohort Decomposition & Strategic Action Strip */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">
                    Dimensional Cohort Intelligence
                  </h3>
                  <span className="text-xs text-slate-400 font-sans">
                    Micro-segment retention, margin density & AI revenue expansion
                  </span>
                </div>
              </div>

              {/* Segment Toggle */}
              <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 rounded-xl border border-white/15 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setSelectedCohort('ENTERPRISE')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                    selectedCohort === 'ENTERPRISE'
                      ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-cyan-glow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Enterprise Tier
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCohort('HIGH_GROWTH')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                    selectedCohort === 'HIGH_GROWTH'
                      ? 'bg-lime-500 text-obsidian-950 font-bold shadow-lime-glow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  High-Growth Mid-Market
                </button>
              </div>
            </div>

            {/* 3 High-Contrast Telemetry Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-sans">
              {/* Pillar 1 */}
              <div className="p-5 rounded-2xl bg-obsidian-950/90 border border-white/10 flex flex-col justify-between space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Gross Margin Density
                  </span>
                  <Activity className="w-4 h-4 text-lime-400" />
                </div>
                <div className="text-3xl font-mono font-extrabold text-lime-400">
                  {selectedCohort === 'ENTERPRISE' ? '42.8%' : '36.4%'}
                </div>
                <p className="text-slate-200 text-xs font-medium leading-relaxed">
                  {selectedCohort === 'ENTERPRISE'
                    ? 'Optimal gross profit contribution across Tier-1 multi-seat enterprise contracts.'
                    : 'Rapid volume adoption with expanding unit economics across growth tiers.'}
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-2xl bg-obsidian-950/90 border border-white/10 flex flex-col justify-between space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Retention Score
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-mono font-extrabold text-emerald-400">
                  {selectedCohort === 'ENTERPRISE' ? '94.2%' : '88.7%'}
                </div>
                <p className="text-slate-200 text-xs font-medium leading-relaxed">
                  {selectedCohort === 'ENTERPRISE'
                    ? 'Zero high-value contract churn detected across North America Q3 renewal cycles.'
                    : '12-month cohort retention stabilized after automated proactive onboarding.'}
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-2xl bg-obsidian-950/90 border border-white/10 flex flex-col justify-between space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Cross-Domain AI Uplift
                  </span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-mono font-extrabold text-cyan-400">
                  {selectedCohort === 'ENTERPRISE' ? '+$1.40M' : '+$820k'}
                </div>
                <p className="text-slate-200 text-xs font-medium leading-relaxed">
                  {selectedCohort === 'ENTERPRISE'
                    ? 'Incremental ARR generated from automated pricing elasticity recommendations.'
                    : 'Targeted hardware and accessory procurement bundles driving cross-sell.'}
                </p>
              </div>
            </div>

            {/* Clean Enterprise Synthesis & Action Bar (Replacing raw SQL) */}
            <div className="p-4 bg-obsidian-950 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20 shrink-0">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">
                    Strategic AI Cohort Synthesis
                  </div>
                  <div className="text-xs text-slate-300 font-sans mt-0.5">
                    Enterprise tier renewals are driving <strong className="text-lime-400">64% of net incremental ARR</strong> this quarter.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAskAurexOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold text-xs shadow-lime-glow transition-all shrink-0 font-sans"
              >
                <span>Ask AUREX to Explain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
