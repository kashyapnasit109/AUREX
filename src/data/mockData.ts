// Quant Studio Data Layer
export interface StrategyPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  sharpe: number;
  sortino: number;
  calmar: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  cagr: number;
  volatility: number;
  defaultInstrument: string;
}

export const strategyPresets: StrategyPreset[] = [
  {
    id: 'momentum-alpha-v4',
    name: 'Momentum Alpha (Adaptive Multi-Scale)',
    category: 'Trend Following',
    description: 'Dynamic volatility-filtered momentum engine utilizing exponential moving average bands with regime breakout validation.',
    sharpe: 2.84,
    sortino: 3.65,
    calmar: 3.51,
    maxDrawdown: -8.1,
    winRate: 64.8,
    profitFactor: 2.38,
    totalTrades: 384,
    cagr: 48.2,
    volatility: 13.7,
    defaultInstrument: 'BTC-PERP',
  },
  {
    id: 'stat-arb-pairs',
    name: 'Statistical Arbitrage (Cointegrated Pairs)',
    category: 'Mean Reversion',
    description: 'High-frequency statistical arbitrage capturing short-term divergence between cross-asset cointegration vectors.',
    sharpe: 3.12,
    sortino: 4.20,
    calmar: 4.45,
    maxDrawdown: -4.7,
    winRate: 71.4,
    profitFactor: 2.92,
    totalTrades: 920,
    cagr: 36.8,
    volatility: 8.9,
    defaultInstrument: 'ETH/BTC Pairs',
  },
  {
    id: 'vol-regime-breakout',
    name: 'Volatility Regime Breakout (GARCH-Filtered)',
    category: 'Volatility Expansion',
    description: 'Exploits implied-vs-realized volatility dispersion with automated gamma hedge protection.',
    sharpe: 2.15,
    sortino: 2.78,
    calmar: 2.11,
    maxDrawdown: -14.3,
    winRate: 54.2,
    profitFactor: 1.88,
    totalTrades: 215,
    cagr: 52.6,
    volatility: 22.4,
    defaultInstrument: 'SOL-PERP',
  }
];

export const generateEquityData = (points = 120, regimeSeed = 1.0) => {
  let strategyVal = 100000;
  let benchmarkVal = 100000;
  let peakStrategy = strategyVal;
  
  const data = [];
  const startDate = new Date(2024, 0, 1);

  for (let i = 0; i < points; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i * 2);
    
    // In-sample vs Out-of-sample split at index 84 (70%)
    const isOutOfSample = i >= 84;
    
    // Random walk with trend and regime noise
    const stratReturn = (Math.sin(i / 8) * 0.003 + 0.0042 * regimeSeed + (Math.random() - 0.42) * 0.015);
    const benchReturn = (Math.sin(i / 10) * 0.002 + 0.0018 + (Math.random() - 0.48) * 0.018);

    strategyVal = Math.round(strategyVal * (1 + stratReturn));
    benchmarkVal = Math.round(benchmarkVal * (1 + benchReturn));
    
    if (strategyVal > peakStrategy) peakStrategy = strategyVal;
    const drawdownPct = Number((((strategyVal - peakStrategy) / peakStrategy) * 100).toFixed(2));

    data.push({
      index: i,
      date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      strategy: strategyVal,
      benchmark: benchmarkVal,
      drawdown: drawdownPct,
      isOOS: isOutOfSample,
      volume: Math.round(1500000 + Math.random() * 800000),
      regime: isOutOfSample ? 'OOS (Walk-Forward)' : 'In-Sample (Train)',
    });
  }
  return data;
};

export const mockTradeLedger = [
  { id: 'TX-8924', timestamp: '2024-06-18 14:32:01', symbol: 'BTC-PERP', side: 'LONG', entry: 64250.00, exit: 66890.50, size: '2.50 BTC', pnl: 6601.25, pnlPct: 4.11, status: 'EXECUTED', duration: '18h 42m' },
  { id: 'TX-8923', timestamp: '2024-06-17 09:15:44', symbol: 'ETH-PERP', side: 'SHORT', entry: 3540.20, exit: 3410.00, size: '40.0 ETH', pnl: 5208.00, pnlPct: 3.68, status: 'EXECUTED', duration: '6h 10m' },
  { id: 'TX-8922', timestamp: '2024-06-16 21:04:12', symbol: 'SOL-PERP', side: 'LONG', entry: 142.80, exit: 139.10, size: '300 SOL', pnl: -1110.00, pnlPct: -2.59, status: 'STOPPED', duration: '2h 15m' },
  { id: 'TX-8921', timestamp: '2024-06-15 11:48:30', symbol: 'BTC-PERP', side: 'LONG', entry: 62800.00, exit: 65100.00, size: '1.80 BTC', pnl: 4140.00, pnlPct: 3.66, status: 'EXECUTED', duration: '1d 04h' },
  { id: 'TX-8920', timestamp: '2024-06-14 04:22:19', symbol: 'AVAX-PERP', side: 'SHORT', entry: 32.40, exit: 30.15, size: '1200 AVAX', pnl: 2700.00, pnlPct: 6.94, status: 'EXECUTED', duration: '14h 50m' },
  { id: 'TX-8919', timestamp: '2024-06-12 18:05:00', symbol: 'ETH-PERP', side: 'LONG', entry: 3490.00, exit: 3580.00, size: '25.0 ETH', pnl: 2250.00, pnlPct: 2.58, status: 'EXECUTED', duration: '9h 30m' },
];

// DataMart Enterprise Analytics Data Layer
export const mockRegionalMetrics = [
  { region: 'North America (NA)', revenue: 18450000, orders: 142300, aov: 129.65, growth: '+18.4%', latency: '12ms', status: 'Optimal' },
  { region: 'Europe (EMEA)', revenue: 14200000, orders: 118400, aov: 119.93, growth: '+12.1%', latency: '18ms', status: 'Optimal' },
  { region: 'Asia-Pacific (APAC)', revenue: 16890000, orders: 168900, aov: 100.00, growth: '+27.6%', latency: '24ms', status: 'Accelerating' },
  { region: 'Latin America (LATAM)', revenue: 5640000, orders: 58200, aov: 96.90, growth: '+8.7%', latency: '35ms', status: 'Normal' },
  { region: 'Middle East (MEA)', revenue: 3820000, orders: 27100, aov: 140.95, growth: '+21.3%', latency: '29ms', status: 'Expanding' },
];

export const mockMonthlyPerformance = [
  { month: 'Jan', revenue: 4.2, orders: 34, returns: 0.12, margin: 42.4 },
  { month: 'Feb', revenue: 4.6, orders: 38, returns: 0.11, margin: 43.1 },
  { month: 'Mar', revenue: 5.1, orders: 41, returns: 0.10, margin: 44.0 },
  { month: 'Apr', revenue: 4.9, orders: 39, returns: 0.13, margin: 42.8 },
  { month: 'May', revenue: 5.8, orders: 46, returns: 0.09, margin: 45.2 },
  { month: 'Jun', revenue: 6.4, orders: 52, returns: 0.08, margin: 46.8 },
  { month: 'Jul', revenue: 6.9, orders: 57, returns: 0.07, margin: 47.4 },
  { month: 'Aug', revenue: 7.3, orders: 61, returns: 0.08, margin: 48.1 },
];

export const mockAutonomousInsights = [
  {
    id: 'INS-01',
    category: 'REVENUE CONCENTRATION',
    confidence: '99.4%',
    title: 'North American Enterprise Subscriptions Up 24.2%',
    description: 'Higher conversion velocity observed across Q3 mid-market renewals following the automated pricing adjustment algorithm.',
    metric: '+$3.82M ARR',
    impact: 'HIGH IMPACT',
    action: 'Scale targeted procurement tiering across EMEA & APAC.',
    affectedSegment: 'Enterprise / B2B SaaS',
    timestamp: '12m ago',
    type: 'positive'
  },
  {
    id: 'INS-02',
    category: 'SUPPLY & CHURN ANOMALY',
    confidence: '96.8%',
    title: 'Fulfillment Latency Spike in Southern EU Hubs',
    description: 'Carrier handoff delays increased lead times from 1.4 days to 3.8 days for Consumer Electronics categories.',
    metric: '+2.4d Latency',
    impact: 'ATTENTION REQUIRED',
    action: 'Auto-reroute regional inventory from Frankfurt Central Depot.',
    affectedSegment: 'Logistics / Consumer Tech',
    timestamp: '34m ago',
    type: 'warning'
  },
  {
    id: 'INS-03',
    category: 'CUSTOMER COHORT VELOCITY',
    confidence: '98.1%',
    title: 'Returning Shopper LTV Multiple Reaches 3.2x',
    description: 'Shoppers utilizing Aiden-assisted personalized bundles demonstrate 41% lower cart abandonment and 2.3x basket size.',
    metric: '3.2x LTV Multiple',
    impact: 'STRATEGIC OPPORTUNITY',
    action: 'Promote conversational setup builder at primary checkout node.',
    affectedSegment: 'Retail Omnichannel',
    timestamp: '1h ago',
    type: 'positive'
  }
];

// Aiden Retail AI Data Layer
export interface RetailProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'PREORDER';
  inventoryCount: number;
  matchScore: number;
  badge: string;
  reasoningScores: {
    battery: number;
    ancIsolation: number;
    weightErgonomics: number;
    priceValue: number;
    buildQuality: number;
  };
  keyFeatures: string[];
  specs: { [key: string]: string };
  imageAccent: string;
}

export const mockRetailCatalog: RetailProduct[] = [
  {
    id: 'SKU-SONY-1000XM5',
    sku: 'SNY-WH-XM5-SLV',
    name: 'Sony WH-1000XM5 Flagship Noise-Canceling',
    category: 'Wireless Audio / Travel',
    brand: 'Sony',
    price: 348.00,
    originalPrice: 399.99,
    rating: 4.85,
    reviewsCount: 3840,
    stockStatus: 'IN_STOCK',
    inventoryCount: 142,
    matchScore: 98.4,
    badge: 'TOP MATCH FOR TRAVEL',
    reasoningScores: {
      battery: 95,
      ancIsolation: 99,
      weightErgonomics: 94,
      priceValue: 92,
      buildQuality: 96,
    },
    keyFeatures: ['30h Battery Life', 'Dual QN1 ANC Processor', 'Ultra-Lightweight 250g', 'Multi-device Bluetooth 5.2'],
    specs: {
      'Battery': '30 Hours (ANC On)',
      'Weight': '250 grams',
      'Drivers': '30mm Carbon Fiber',
      'Codec': 'LDAC, AAC, SBC'
    },
    imageAccent: 'from-cyan-500/20 to-blue-600/10'
  },
  {
    id: 'SKU-BOSE-QCULTRA',
    sku: 'BSE-QC-ULTRA-BLK',
    name: 'Bose QuietComfort Ultra Spatial Audio',
    category: 'Wireless Audio / Travel',
    brand: 'Bose',
    price: 379.00,
    originalPrice: 429.00,
    rating: 4.78,
    reviewsCount: 2190,
    stockStatus: 'LOW_STOCK',
    inventoryCount: 18,
    matchScore: 94.1,
    badge: 'BEST IN CLASS COMFORT',
    reasoningScores: {
      battery: 88,
      ancIsolation: 98,
      weightErgonomics: 99,
      priceValue: 86,
      buildQuality: 95,
    },
    keyFeatures: ['CustomTune Audio Calibration', 'Bose Immersive Spatial Audio', 'Plush Protein Leather Seal', '24h Playtime'],
    specs: {
      'Battery': '24 Hours (Spatial On)',
      'Weight': '253 grams',
      'ANC Modes': 'Quiet, Aware, Immersion',
      'Microphones': '12 Beamforming Array'
    },
    imageAccent: 'from-amber-500/20 to-orange-600/10'
  },
  {
    id: 'SKU-SENN-M4',
    sku: 'SNN-MOM-4-WHT',
    name: 'Sennheiser Momentum 4 High-Fidelity',
    category: 'Audiophile Travel',
    brand: 'Sennheiser',
    price: 299.95,
    originalPrice: 379.95,
    rating: 4.70,
    reviewsCount: 1650,
    stockStatus: 'IN_STOCK',
    inventoryCount: 88,
    matchScore: 91.8,
    badge: 'UNRIVALED 60H BATTERY',
    reasoningScores: {
      battery: 100,
      ancIsolation: 89,
      weightErgonomics: 88,
      priceValue: 96,
      buildQuality: 92,
    },
    keyFeatures: ['60-Hour Class-Leading Battery', '42mm Audiophile Transducers', 'Smart Pause / Auto On-Off', 'Built-in 5-band EQ'],
    specs: {
      'Battery': '60 Hours Endurance',
      'Weight': '293 grams',
      'Fast Charge': '10 min = 6 hrs',
      'Codec': 'aptX Adaptive, AAC'
    },
    imageAccent: 'from-emerald-500/20 to-teal-600/10'
  }
];

export const mockAidenConversation = [
  {
    id: 'm-1',
    sender: 'aiden' as const,
    timestamp: '10:42 AM',
    text: 'AUREX Cognitive Commerce Engine online. Grounded against real-time catalog inventory, supply chain telemetry, and pricing elasticity. What objective can we solve today?',
    sources: []
  },
  {
    id: 'm-2',
    sender: 'user' as const,
    timestamp: '10:43 AM',
    text: 'I need high-performance wireless noise-canceling headphones for international long-haul flights under $400 with exceptional battery and weight ergonomics.',
    sources: []
  },
  {
    id: 'm-3',
    sender: 'aiden' as const,
    timestamp: '10:43 AM',
    text: 'I queried our enterprise inventory graph (2,410 SKUs) and filtered by cabin pressure acoustic attenuation, battery duration >= 24h, and weight <= 300g. Here are the top 3 verified matches with structured parameter decomposition:',
    products: mockRetailCatalog,
    sources: [
      { table: 'DW_RETAIL.CATALOG_MASTER', records: '2,410 rows scanned' },
      { table: 'LOGISTICS.INVENTORY_REALTIME', records: 'Warehouse Hub North (US-EAST)' },
      { table: 'ANALYTICS.CUSTOMER_SENTIMENT', records: '98.4% travel cohort satisfaction' }
    ]
  }
];
