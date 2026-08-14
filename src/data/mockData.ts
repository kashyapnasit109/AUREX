import type {
  EnterpriseInsight,
  CrossDomainSignal,
  CustomerProfile,
  ProductAnalytics,
  DataQualityReport,
} from '../types/domain';

export interface StrategyPreset {
  id: string;
  name: string;
  category: string;
  sharpe: number;
  sortino: number;
  calmar: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  cagr: number;
  description: string;
  defaultInstrument: string;
}

export interface TradeLog {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  pnl: number;
  pnlPct: number;
  status: 'SETTLED' | 'ACTIVE';
}

export interface RetailProduct {
  id: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  originalPrice: number;
  matchScore: number;
  reasoningScores: {
    ancIsolation: number;
    battery: number;
    weightErgonomics: number;
  };
  inStock: boolean;
  image?: string;
}

export const strategyPresets: StrategyPreset[] = [
  {
    id: 'strat-1',
    name: 'Momentum Alpha Multi-Regime',
    category: 'Trend Following & Volatility',
    sharpe: 2.84,
    sortino: 3.65,
    calmar: 5.95,
    maxDrawdown: -8.1,
    winRate: 64.8,
    profitFactor: 2.18,
    cagr: 48.2,
    description: 'Dynamic volatility-adjusted momentum capturing high-beta trend regimes while minimizing drawdown during sideways chop.',
    defaultInstrument: 'BTC-PERP',
  },
  {
    id: 'strat-2',
    name: 'Statistical Arbitrage Cointegration',
    category: 'Mean Reversion',
    sharpe: 3.12,
    sortino: 4.21,
    calmar: 7.82,
    maxDrawdown: -4.7,
    winRate: 71.4,
    profitFactor: 2.45,
    cagr: 36.8,
    description: 'Pairwise cointegrated vector execution exploiting cross-exchange orderbook spread inefficiencies with sub-millisecond execution.',
    defaultInstrument: 'ETH/BTC Pairs',
  },
  {
    id: 'strat-3',
    name: 'Perpetual Funding Rate Harvester',
    category: 'Market Neutral Yield',
    sharpe: 2.15,
    sortino: 2.94,
    calmar: 3.68,
    maxDrawdown: -14.3,
    winRate: 54.2,
    profitFactor: 1.82,
    cagr: 52.6,
    description: 'Delta-neutral cash-and-carry basis harvester algorithm capturing annualized 18-35% perpetual swap funding rate premia.',
    defaultInstrument: 'SOL-PERP',
  },
];

export const generateEquityData = (days = 60, multiplier = 1.0) => {
  const data = [];
  let stratVal = 100000;
  let benchVal = 100000;
  let maxVal = 100000;

  const startDate = new Date(2026, 0, 5);

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i * 3);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const benchReturn = (Math.sin(i * 0.25) * 0.015 + (Math.random() - 0.44) * 0.02) * 0.9;
    const stratReturn = (Math.sin(i * 0.2) * 0.008 + 0.009 + (Math.random() - 0.35) * 0.018) * multiplier;

    benchVal = Math.round(benchVal * (1 + benchReturn));
    stratVal = Math.round(stratVal * (1 + stratReturn));

    if (stratVal > maxVal) maxVal = stratVal;
    const drawdown = Number((((stratVal - maxVal) / maxVal) * 100).toFixed(2));

    data.push({
      date: dateStr,
      benchmark: benchVal,
      strategy: stratVal,
      drawdown: drawdown > 0 ? 0 : drawdown,
    });
  }
  return data;
};

export const mockTradeLedger: TradeLog[] = [
  { id: 'TX-89214', timestamp: '14:28:12 UTC', symbol: 'BTC-PERP', side: 'LONG', entry: 94250.0, exit: 96800.0, pnl: 2550.0, pnlPct: 2.7, status: 'SETTLED' },
  { id: 'TX-89215', timestamp: '13:10:45 UTC', symbol: 'ETH-PERP', side: 'SHORT', entry: 3420.5, exit: 3310.0, pnl: 1105.0, pnlPct: 3.2, status: 'SETTLED' },
  { id: 'TX-89216', timestamp: '11:45:00 UTC', symbol: 'SOL-PERP', side: 'LONG', entry: 188.4, exit: 194.8, pnl: 640.0, pnlPct: 3.4, status: 'SETTLED' },
  { id: 'TX-89217', timestamp: '09:30:18 UTC', symbol: 'BTC-PERP', side: 'SHORT', entry: 95800.0, exit: 95200.0, pnl: 600.0, pnlPct: 0.6, status: 'SETTLED' },
  { id: 'TX-89218', timestamp: '07:15:32 UTC', symbol: 'ETH-PERP', side: 'LONG', entry: 3280.0, exit: 3360.0, pnl: 800.0, pnlPct: 2.4, status: 'SETTLED' },
  { id: 'TX-89219', timestamp: '05:02:11 UTC', symbol: 'AVAX-PERP', side: 'LONG', entry: 42.1, exit: 44.3, pnl: 220.0, pnlPct: 5.2, status: 'SETTLED' },
];

export const mockRegionalData = [
  { region: 'North America', revenue: 28400000, growth: 24.2, orders: 184200, latency: '1.2d' },
  { region: 'EMEA', revenue: 16800000, growth: 14.8, orders: 112400, latency: '2.1d' },
  { region: 'APAC', revenue: 10400000, growth: 31.4, orders: 94800, latency: '1.8d' },
  { region: 'LATAM', revenue: 3200000, growth: 9.6, orders: 24100, latency: '3.4d' },
];

export const mockRegionalMetrics = mockRegionalData;

export const mockMonthlyGrowth = [
  { month: 'Jan', revenue: 3.8, arr: 45.6, margin: 68.2 },
  { month: 'Feb', revenue: 4.1, arr: 49.2, margin: 69.4 },
  { month: 'Mar', revenue: 4.5, arr: 54.0, margin: 70.1 },
  { month: 'Apr', revenue: 4.8, arr: 57.6, margin: 71.4 },
  { month: 'May', revenue: 5.2, arr: 62.4, margin: 72.8 },
  { month: 'Jun', revenue: 5.8, arr: 69.6, margin: 74.2 },
];

export const mockMonthlyPerformance = mockMonthlyGrowth;

export const mockRetailCatalog: RetailProduct[] = [
  {
    id: 'prod-1',
    name: 'Sony WH-1000XM5 Flagship Noise-Canceling',
    sku: 'SNY-XM5-SLV',
    brand: 'Sony',
    price: 348.0,
    originalPrice: 399.99,
    matchScore: 98.4,
    reasoningScores: {
      ancIsolation: 99,
      battery: 95,
      weightErgonomics: 94,
    },
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'Bose QuietComfort Ultra Spatial Audio',
    sku: 'BOS-QCU-BLK',
    brand: 'Bose',
    price: 379.0,
    originalPrice: 429.0,
    matchScore: 94.1,
    reasoningScores: {
      ancIsolation: 98,
      battery: 88,
      weightErgonomics: 99,
    },
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Sennheiser Momentum 4 High-Fidelity',
    sku: 'SNN-M4-WHT',
    brand: 'Sennheiser',
    price: 299.95,
    originalPrice: 379.95,
    matchScore: 91.8,
    reasoningScores: {
      ancIsolation: 87,
      battery: 100,
      weightErgonomics: 88,
    },
    inStock: true,
  },
];

export const mockAidenConversation = [
  {
    id: 'm-1',
    sender: 'user' as const,
    timestamp: '10:42 AM',
    text: 'I need high-performance wireless noise-canceling headphones for international long-haul flights under $400 with exceptional battery and weight ergonomics.',
    sources: [],
  },
  {
    id: 'm-2',
    sender: 'aiden' as const,
    timestamp: '10:43 AM',
    text: 'I queried our enterprise inventory graph (2,410 SKUs) and filtered by cabin pressure acoustic attenuation, battery duration >= 24h, and weight <= 300g. Here are the top 3 verified matches with structured parameter decomposition:',
    products: mockRetailCatalog,
    sources: [
      { table: 'DW_RETAIL.CATALOG_MASTER', records: '2,410 rows scanned' },
      { table: 'LOGISTICS.INVENTORY_REALTIME', records: 'Warehouse Hub North (US-EAST)' },
      { table: 'PRICING.ELASTICITY_MODEL', records: 'Dynamic discount active (-$51.99)' },
    ],
  },
];

// Phase 2: First-Class Enterprise Insights System
export const mockEnterpriseInsights: EnterpriseInsight[] = [
  {
    id: 'INS-01',
    signal: 'REVENUE ANOMALY',
    category: 'REVENUE',
    title: 'North America Enterprise Renewals Up +24.2%',
    why: 'Higher conversion velocity observed across Q3 mid-market renewals following automated tier pricing optimization.',
    drivers: [
      { label: 'Enterprise Tier', change: '+31.4%', positive: true },
      { label: 'Mid-Market Base', change: '+17.2%', positive: true },
      { label: 'Renewal Rate', change: '+12.0%', positive: true },
    ],
    impact: '+$3.82M ARR',
    confidence: '99.4%',
    confidenceScore: 99.4,
    recommendation: 'Replicate Q3 volume-tier pricing models across EMEA enterprise pipelines to capture projected +$1.4M ARR.',
    actions: ['Investigate DataMart', 'Ask AUREX', 'Trigger CRM Action'],
    evidence: {
      id: 'EV-8921',
      sourceTable: 'DW_ENTERPRISE.SUBSCRIPTION_EVENTS',
      recordCount: 18421,
      dataSnapshot: '2026-08-14T11:30:00Z',
      sha256Hash: 'a8f42b91c0e39487d2105e6b4129dca71e2890bfa384',
      confidence: 99.4,
      sampleQuery: 'SELECT region, sum(arr_delta) FROM subscription_events WHERE event_type="RENEWAL" GROUP BY region;',
    },
    createdAt: '12 mins ago',
  },
  {
    id: 'INS-02',
    signal: 'SUPPLY & CHURN WARNING',
    category: 'SUPPLY',
    title: 'Fulfillment Latency Spike in Southern EU Hubs',
    why: 'Carrier handoff bottleneck in Milan regional depot increased delivery latency by 1.8 days for Consumer Audio category.',
    drivers: [
      { label: 'Carrier Latency', change: '+1.8 Days', positive: false },
      { label: 'Ticket Churn Risk', change: '+4.2%', positive: false },
      { label: 'Southern EU Hubs', change: '840 Orders', positive: false },
    ],
    impact: '-$140k At Risk',
    confidence: '96.8%',
    confidenceScore: 96.8,
    recommendation: 'Auto-reroute regional inventory from Frankfurt Central Depot to bypass Milan transshipment facility.',
    actions: ['Reroute Logistics', 'Ask AUREX', 'Notify Logistics Lead'],
    evidence: {
      id: 'EV-8922',
      sourceTable: 'LOGISTICS.CARRIER_TELEMETRY',
      recordCount: 4210,
      dataSnapshot: '2026-08-14T11:45:00Z',
      sha256Hash: '94c1e82a0d1b3f749a0283c7104b981e3a76201f9c81',
      confidence: 96.8,
      sampleQuery: 'SELECT hub_id, avg(transit_hours) FROM carrier_logs WHERE status="DELAYED" GROUP BY hub_id;',
    },
    createdAt: '24 mins ago',
  },
  {
    id: 'INS-03',
    signal: 'CROSS-DOMAIN ARBITRAGE',
    category: 'ARBITRAGE',
    title: 'High-Beta Momentum Surge Fuses with Tech Demand',
    why: 'Quant Studio crypto momentum alpha triggered high volatility regime simultaneously with APAC retail travel audio demand surge.',
    drivers: [
      { label: 'Quant Alpha Correlation', change: '+0.74 r', positive: true },
      { label: 'APAC Travel Demand', change: '+31.4%', positive: true },
      { label: 'Perpetual Volume', change: '+$14.2M', positive: true },
    ],
    impact: '+$890k Alpha',
    confidence: '98.1%',
    confidenceScore: 98.1,
    recommendation: 'Expand hedge liquidity in APAC trading session to capture cross-market retail purchasing momentum.',
    actions: ['Execute Strategy', 'Ask AUREX', 'View Cross-Domain Flow'],
    evidence: {
      id: 'EV-8923',
      sourceTable: 'QUANT_ENGINE.ORDERBOOK_CORRELATION',
      recordCount: 89400,
      dataSnapshot: '2026-08-14T12:00:00Z',
      sha256Hash: 'c71b0928e4a9102834b71f90e8234a10c98234f9a012',
      confidence: 98.1,
      sampleQuery: 'SELECT corr(market_volatility, retail_spend) FROM unified_telemetry;',
    },
    createdAt: '38 mins ago',
  },
];

// Fallback for older imports
export const mockAutonomousInsights = mockEnterpriseInsights.map((ins) => ({
  id: ins.id,
  type: ins.category,
  category: ins.category,
  title: ins.title,
  metric: ins.impact,
  impact: ins.impact,
  description: ins.why,
  confidence: ins.confidence,
  action: ins.recommendation,
}));

// Phase 2: Cross-Domain Signals
export const mockCrossDomainSignals: CrossDomainSignal[] = [
  {
    id: 'SIG-101',
    timestamp: '12:44:02 UTC',
    title: 'APAC Regional Revenue Spike Triggers Premium Audio Opportunity',
    sourceDomain: 'DATAMART',
    targetDomain: 'RETAIL',
    causalFlow: [
      'DataMart: APAC Enterprise revenue increases +27.6% MoM',
      'Anomaly Engine: Electronics Category expansion +34% in Tokyo/Singapore Hubs',
      'Customer 360: Returning VIP Enterprise accounts driving travel accessories demand',
      'Aiden AI: Auto-bundles Sony XM5 + Travel GaN Chargers for 98.4% match rate',
    ],
    magnitude: '+$840k Pipeline',
    impactScore: 94,
    recommendedAction: 'Target verified APAC VIP segment with premium noise-canceling corporate travel bundles.',
  },
  {
    id: 'SIG-102',
    timestamp: '12:38:15 UTC',
    title: 'Volatility Regime Expansion Alerts Institutional Risk Engine',
    sourceDomain: 'QUANT',
    targetDomain: 'DATAMART',
    causalFlow: [
      'Quant Studio: BTC/ETH perpetual funding rate surges to +0.038% 8h premium',
      'Risk Engine: Zero Look-Ahead walk-forward model shifts from Mean Reversion to Momentum Alpha',
      'DataMart: Ingestion rates scale from 1.2M tx/sec to 1.84M tx/sec with 0 drop rate',
      'Audit Ledger: Cryptographic snapshot SHA-256 (AUX-9F12) committed for trade verification',
    ],
    magnitude: 'Sharpe 3.12 Alpha',
    impactScore: 98,
    recommendedAction: 'Lock in out-of-sample execution parameters for next 24h trading cycle.',
  },
];

// Phase 2: Customer 360 Profiles
export const mockCustomers: CustomerProfile[] = [
  {
    id: 'CUST-28491',
    name: 'Elena Rostova',
    email: 'e.rostova@vanguard-tech.corp',
    company: 'Vanguard Systems',
    segment: 'Enterprise VIP',
    ltv: '$82,420',
    ordersCount: 17,
    aov: '$4,848',
    retentionProbability: 94,
    churnRisk: 4.2,
    timeline: [
      { event: 'SEARCHED', timestamp: 'Aug 14, 09:12', detail: 'Searched for "international noise isolation audio"' },
      { event: 'VIEWED', timestamp: 'Aug 14, 09:15', detail: 'Inspected Sony WH-1000XM5 product intelligence page' },
      { event: 'PURCHASED', timestamp: 'Aug 12, 14:30', detail: 'Procured 12x Enterprise Noise-Canceling Hub units ($4,176)' },
      { event: 'REVIEWED', timestamp: 'Jul 28, 11:20', detail: 'Rated acoustic clarity 5/5 with positive cabin feedback' },
      { event: 'EXPANDED', timestamp: 'Jun 15, 16:00', detail: 'Upgraded enterprise procurement tier from Mid-Market to VIP' },
    ],
    aiInterpretation: 'Customer demonstrates strong repeat purchase loyalty with high sensitivity to travel acoustic ergonomics. Projected to expand fleet hardware by +30% in Q4.',
    recommendedSkus: ['SNY-XM5-SLV', 'BOS-QCU-BLK'],
  },
  {
    id: 'CUST-89210',
    name: 'Marcus Vance',
    email: 'm.vance@quantex-global.io',
    company: 'Quantex Global Capital',
    segment: 'Enterprise VIP',
    ltv: '$142,800',
    ordersCount: 24,
    aov: '$5,950',
    retentionProbability: 98,
    churnRisk: 1.8,
    timeline: [
      { event: 'EXPANDED', timestamp: 'Aug 10, 08:30', detail: 'Subscribed to AUREX Quant Strategy Execution API' },
      { event: 'PURCHASED', timestamp: 'Jul 22, 14:00', detail: 'Enterprise DataMart Custom Pipeline license ($24,000)' },
      { event: 'REVIEWED', timestamp: 'Jun 30, 18:15', detail: 'Zero Look-Ahead bias audit passed external risk committee' },
    ],
    aiInterpretation: 'Institutional account running daily multi-regime simulations. High engagement with Stat Arb and funding rate harvesting modules.',
    recommendedSkus: ['STRAT-STAT-ARB', 'DATAMART-CUSTOM-FEED'],
  },
];

// Phase 2: Product Intelligence Data
export const mockProductIntelligence: ProductAnalytics[] = [
  {
    sku: 'SNY-XM5-SLV',
    name: 'Sony WH-1000XM5 Flagship Noise-Canceling',
    brand: 'Sony',
    category: 'Consumer Audio & Ergonomics',
    price: 348.0,
    inventoryCount: 284,
    demandVelocity: '+18.4% MoM',
    conversionRate: '7.8%',
    returnRate: '1.4%',
    grossMargin: '42.8%',
    targetSegments: ['Enterprise Business Travel', 'Remote Engineers', 'Aviation Commuters'],
    aiAttributionScore: 98.4,
    aiPerception: 'Customer reviews emphasize leading flight cabin ANC attenuation. Zero thermal complaints during 12h+ continuous flights.',
  },
  {
    sku: 'BOS-QCU-BLK',
    name: 'Bose QuietComfort Ultra Spatial Audio',
    brand: 'Bose',
    category: 'Spatial Audio',
    price: 379.0,
    inventoryCount: 142,
    demandVelocity: '+12.1% MoM',
    conversionRate: '6.4%',
    returnRate: '2.1%',
    grossMargin: '38.5%',
    targetSegments: ['Executive Commuters', 'Acoustic Purists'],
    aiAttributionScore: 94.1,
    aiPerception: 'Preferred for lightweight headband distribution. Spatial audio mode widely adopted across mobile conferencing workflows.',
  },
];

// Phase 2: Data Hub Quality & Lineage
export const mockDataQualityReport: DataQualityReport = {
  overallScore: 98.7,
  completeness: 99.2,
  validity: 98.8,
  freshness: 99.7,
  consistency: 97.9,
  totalTables: 48,
  totalRows: '42.8M',
  lastIngestionTime: '0.42s ago',
  validationChecks: [
    { table: 'MARKET_TICKS.ORDERBOOK_L2', check: 'Point-in-Time Non-Lookahead Check', status: 'PASSED', detail: '0 chronological timestamp leaks detected across 18.4M ticks' },
    { table: 'DW_RETAIL.CATALOG_MASTER', check: 'SKU Referential Integrity', status: 'PASSED', detail: '2,410 of 2,410 SKUs verified against Warehouse North inventory' },
    { table: 'DW_ENTERPRISE.SUBSCRIPTION_EVENTS', check: 'Customer ID Null Verification', status: 'WARNING', detail: '0.08% legacy test accounts flagged with null enterprise tags' },
    { table: 'PRICING.ELASTICITY_MODEL', check: 'Dynamic Margin Boundary Validation', status: 'PASSED', detail: 'Minimum gross margin floor (30%) enforced across all tiers' },
  ],
};
