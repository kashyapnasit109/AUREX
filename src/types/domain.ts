// Unified Shared Domain Model for AUREX Enterprise Intelligence Platform

export interface EvidenceTrace {
  id: string;
  sourceTable: string;
  recordCount: number;
  dataSnapshot: string;
  sha256Hash: string;
  confidence: number;
  sampleQuery: string;
}

export interface EnterpriseInsight {
  id: string;
  signal: string;
  category: 'REVENUE' | 'VOLATILITY' | 'SUPPLY' | 'CHURN' | 'ARBITRAGE';
  title: string;
  why: string;
  drivers: { label: string; change: string; positive: boolean }[];
  impact: string;
  confidence: string;
  confidenceScore: number;
  recommendation: string;
  actions: string[];
  evidence: EvidenceTrace;
  createdAt: string;
}

export interface CrossDomainSignal {
  id: string;
  timestamp: string;
  title: string;
  sourceDomain: 'QUANT' | 'DATAMART' | 'RETAIL';
  targetDomain: 'QUANT' | 'DATAMART' | 'RETAIL';
  causalFlow: string[];
  magnitude: string;
  impactScore: number;
  recommendedAction: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  segment: 'Enterprise VIP' | 'Mid-Market Growth' | 'High-Velocity Retail';
  ltv: string;
  ordersCount: number;
  aov: string;
  retentionProbability: number;
  churnRisk: number;
  timeline: {
    event: 'SEARCHED' | 'VIEWED' | 'PURCHASED' | 'RETURNED' | 'REVIEWED' | 'EXPANDED';
    timestamp: string;
    detail: string;
  }[];
  aiInterpretation: string;
  recommendedSkus: string[];
}

export interface ProductAnalytics {
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  inventoryCount: number;
  demandVelocity: string;
  conversionRate: string;
  returnRate: string;
  grossMargin: string;
  targetSegments: string[];
  aiAttributionScore: number;
  aiPerception: string;
}

export interface DataQualityReport {
  overallScore: number;
  completeness: number;
  validity: number;
  freshness: number;
  consistency: number;
  totalTables: number;
  totalRows: string;
  lastIngestionTime: string;
  validationChecks: {
    table: string;
    check: string;
    status: 'PASSED' | 'WARNING' | 'FAILED';
    detail: string;
  }[];
}
