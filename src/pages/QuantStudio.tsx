import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  strategyPresets,
  generateEquityData,
  mockTradeLedger,
  type StrategyPreset,
} from '../data/mockData';

export const QuantStudio: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyPreset>(strategyPresets[0]);
  const [instrument, setInstrument] = useState('BTC-PERP');
  const [capital, setCapital] = useState(100000);
  const [leverage, setLeverage] = useState(2.0);
  const [slippageBps, setSlippageBps] = useState(2.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'equity' | 'drawdown' | 'trades'>('equity');
  const [trainSplit, setTrainSplit] = useState(70); // 70% IS, 30% OOS

  const [equityData, setEquityData] = useState(generateEquityData(100, 1.0));

  const handleStrategyChange = (preset: StrategyPreset) => {
    setSelectedStrategy(preset);
    setInstrument(preset.defaultInstrument);
    handleRunSimulation();
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setEquityData(generateEquityData(100, selectedStrategy.sharpe / 2.5));
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Module Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              Quantitative Strategy Lab
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Look-Ahead Bias Guard: 100% Enforced
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            Strategy Backtesting & Walk-Forward Simulation
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-0.5">
            Point-in-time state machine isolating out-of-sample execution to eliminate backtest overfitting.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => {
              setCapital(100000);
              setLeverage(2.0);
              setSlippageBps(2.5);
              handleRunSimulation();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-300 transition-all font-sans font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold shadow-lime-glow transition-all disabled:opacity-50 font-sans"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Computing Walk-Forward...' : 'Execute Backtest'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Strategy Configuration & Look-Ahead Guard */}
        <div className="lg:col-span-4 space-y-6">
          {/* Strategy Presets Selector */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-200 font-bold uppercase tracking-wider">
                Strategy Blueprint
              </span>
              <span className="text-xs text-lime-400 font-mono font-semibold">3 Presets Loaded</span>
            </div>

            <div className="space-y-2">
              {strategyPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleStrategyChange(preset)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedStrategy.id === preset.id
                      ? 'bg-lime-500/10 border-lime-500/40 shadow-[0_0_15px_rgba(212,249,56,0.1)]'
                      : 'bg-obsidian-950/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans font-bold text-xs text-white">
                      {preset.name}
                    </span>
                    <span className="font-mono text-xs text-lime-400 font-bold">
                      {preset.sharpe} Sharpe
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs font-sans line-clamp-2">
                    {preset.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Look-Ahead Bias Protection Slider */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                  Bias Guard (Walk-Forward)
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                Strict Chronology
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-200 mb-1.5">
                <span>In-Sample (Train): {trainSplit}%</span>
                <span className="text-emerald-400 font-bold">Out-of-Sample (Test): {100 - trainSplit}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                value={trainSplit}
                onChange={(e) => setTrainSplit(Number(e.target.value))}
                className="w-full accent-lime-500 bg-obsidian-950 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex h-2 w-full rounded-full overflow-hidden mt-2 border border-white/10">
                <div style={{ width: `${trainSplit}%` }} className="bg-slate-600" />
                <div style={{ width: `${100 - trainSplit}%` }} className="bg-emerald-500 shadow-lime-glow" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Model weights calibrated strictly on In-Sample window. Validation executed forward in time with zero future leak.
            </p>
          </div>

          {/* Parameter Tuning Inputs */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold uppercase tracking-wider">
                Execution Parameters
              </span>
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Target Instrument</label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="w-full mt-1 bg-obsidian-950 border border-white/10 rounded-xl p-2.5 text-slate-200 outline-none focus:border-lime-500 transition-colors font-sans text-xs"
                >
                  <option value="BTC-PERP">BTC-PERP (Perpetual)</option>
                  <option value="ETH-PERP">ETH-PERP (Perpetual)</option>
                  <option value="SOL-PERP">SOL-PERP (High-Beta Momentum)</option>
                  <option value="ETH/BTC Pairs">ETH/BTC Cointegrated Vector</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Initial Capital</label>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    className="w-full mt-1 bg-obsidian-950 border border-white/10 rounded-xl p-2 text-slate-200 outline-none focus:border-lime-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Leverage</label>
                  <input
                    type="number"
                    step="0.5"
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className="w-full mt-1 bg-obsidian-950 border border-white/10 rounded-xl p-2 text-slate-200 outline-none focus:border-lime-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Slippage & Impact (BPS)</label>
                <input
                  type="number"
                  step="0.5"
                  value={slippageBps}
                  onChange={(e) => setSlippageBps(Number(e.target.value))}
                  className="w-full mt-1 bg-obsidian-950 border border-white/10 rounded-xl p-2 text-slate-200 outline-none focus:border-lime-500 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Visual Analytics, Quantitative Scorecard, Trade Logs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quantitative Performance Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="glass-card p-3.5 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Sharpe Ratio</div>
              <div className="text-xl font-bold font-mono text-lime-400 mt-1">{selectedStrategy.sharpe}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Benchmark 1.20</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Sortino Ratio</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{selectedStrategy.sortino}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Downside Vol 4.1%</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Max Drawdown</div>
              <div className="text-xl font-bold font-mono text-coral-400 mt-1">{selectedStrategy.maxDrawdown}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Recovery 14d</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Win Rate</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{selectedStrategy.winRate}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">384 Trades</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Profit Factor</div>
              <div className="text-xl font-bold font-mono text-white mt-1">{selectedStrategy.profitFactor}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Gross 2.38x</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">CAGR Alpha</div>
              <div className="text-xl font-bold font-mono text-lime-400 mt-1">+{selectedStrategy.cagr}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ann. Vol 13.7%</div>
            </div>
          </div>

          {/* Interactive Chart Canvas with Fixed Bounds and No Clipping */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 rounded-xl border border-white/10 text-xs font-sans">
                <button
                  onClick={() => setActiveTab('equity')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                    activeTab === 'equity'
                      ? 'bg-lime-500 text-obsidian-950 shadow-lime-glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Equity Curve
                </button>
                <button
                  onClick={() => setActiveTab('drawdown')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                    activeTab === 'drawdown'
                      ? 'bg-coral-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Drawdown Profile
                </button>
                <button
                  onClick={() => setActiveTab('trades')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                    activeTab === 'trades'
                      ? 'bg-cyan-500 text-obsidian-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Trade Ledger ({mockTradeLedger.length})
                </button>
              </div>

              {/* Chart Legend Telemetry */}
              <div className="flex items-center gap-4 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-lime-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                  <span>Strategy Alpha</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>Benchmark</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>OOS Boundary</span>
                </div>
              </div>
            </div>

            {/* Rendering Tab Content with Generous Safe Margins */}
            {activeTab === 'equity' && (
              <div className="w-full h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={equityData}
                    margin={{ top: 28, right: 20, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorQuantStrat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4F938" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#D4F938" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorQuantBench" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="#334155"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={40}
                    />
                    <YAxis
                      stroke="#334155"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0f17',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '11px',
                      }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    {/* Fixed Reference Line with Safe Inset Text Position */}
                    <ReferenceLine
                      x={equityData[Math.floor((equityData.length * trainSplit) / 100)].date}
                      stroke="#10B981"
                      strokeDasharray="4 4"
                      label={{
                        position: 'insideTopLeft',
                        value: 'OOS Boundary',
                        fill: '#34D399',
                        fontSize: 11,
                        fontFamily: 'Plus Jakarta Sans',
                        fontWeight: 600,
                        offset: 8,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      name="Benchmark"
                      stroke="#00E5FF"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#colorQuantBench)"
                    />
                    <Area
                      type="monotone"
                      dataKey="strategy"
                      name="Strategy"
                      stroke="#D4F938"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorQuantStrat)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'drawdown' && (
              <div className="w-full h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={equityData}
                    margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorQuantDD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
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
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0f17',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="drawdown"
                      name="Drawdown"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorQuantDD)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'trades' && (
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead className="sticky top-0 bg-obsidian-950 text-slate-300 uppercase text-[10px] border-b border-white/10 font-sans font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Trade ID</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Asset</th>
                      <th className="py-2.5 px-3">Side</th>
                      <th className="py-2.5 px-3">Entry / Exit</th>
                      <th className="py-2.5 px-3 text-right">PnL Net</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mockTradeLedger.map((trade) => (
                      <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 text-slate-200 font-semibold">{trade.id}</td>
                        <td className="py-2.5 px-3 text-slate-400">{trade.timestamp}</td>
                        <td className="py-2.5 px-3 text-white font-medium">{trade.symbol}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              trade.side === 'LONG'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-coral-500/10 text-coral-400 border border-coral-500/20'
                            }`}
                          >
                            {trade.side}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          ${trade.entry.toFixed(2)} → ${trade.exit.toFixed(2)}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-bold ${
                            trade.pnl >= 0 ? 'text-emerald-400' : 'text-coral-400'
                          }`}
                        >
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)} ({trade.pnlPct}%)
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-[10px] text-slate-300 bg-obsidian-850 px-2 py-0.5 rounded font-sans">
                            {trade.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* AUREX Interpretation */}
          <div className="glass-card p-6 rounded-3xl border border-lime-500/20 bg-lime-950/10 space-y-3">
            <div className="flex items-center gap-2 text-lime-400 text-xs font-semibold font-sans">
              <Sparkles className="w-4 h-4" />
              <span>AUREX Quantitative Interpretation & Alpha Decomposition</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-sans">
              The <strong className="text-white font-semibold">{selectedStrategy.name}</strong> demonstrated strong statistical persistence across the <strong>{100 - trainSplit}% Out-of-Sample evaluation window</strong>. The strategy captured upside regime shifts during high-volatility expansions with a low drawdown correlation to the BTC index (-0.14). Calmar ratio of <strong>{selectedStrategy.calmar}</strong> confirms institutional-grade risk-adjusted efficiency.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300 border-t border-white/5 font-sans">
              <span>• Alpha Confidence: <strong className="text-lime-400 font-mono">99.1%</strong></span>
              <span>• Max Regime Drawdown: <strong className="text-coral-400 font-mono">{selectedStrategy.maxDrawdown}%</strong></span>
              <span>• Zero Look-Ahead Isolation: <strong className="text-emerald-400 font-semibold">Verified</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
