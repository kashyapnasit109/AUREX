import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, Eye } from 'lucide-react';
import { EvidenceDrawer } from '../components/common/EvidenceDrawer';

export const ProductIntelligence: React.FC = () => {
  const { sku = 'SKU-AUDIO-9000' } = useParams<{ sku: string }>();
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const productData = {
    sku: sku,
    name: 'AUREX Apex Studio Wireless Headphones',
    brand: 'AUREX Audio Systems',
    price: '$349.99',
    inventory: 1420,
    demandVelocity: '+18.4% MoM',
    conversionRate: '7.8%',
    returnRate: '2.1%',
    ancScore: 99,
    batteryScore: 95,
    weightScore: 94,
    recommendationStrength: '98% Grounded Match'
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold">
              PRODUCT INTELLIGENCE & DEMAND VELOCITY
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              DW Catalog Vector Verified
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            {productData.name}
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-0.5">
            SKU: <span className="font-mono text-lime-400">{productData.sku}</span> | Brand: {productData.brand}
          </p>
        </div>

        <button
          onClick={() => setEvidenceOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/10 text-slate-300 text-xs font-bold transition-all"
        >
          <Eye className="w-4 h-4 text-lime-400" />
          <span>View Catalog Lineage</span>
        </button>
      </div>

      {/* Product Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Retail Price</div>
          <div className="text-2xl font-bold text-lime-400 mt-1">{productData.price}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Warehouse Stock</div>
          <div className="text-2xl font-bold text-white mt-1">{productData.inventory} Units</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Demand Velocity</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{productData.demandVelocity}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Return Rate</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{productData.returnRate}</div>
        </div>
      </div>

      {/* Multidimensional Attribute Score Breakdown */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Multidimensional Acoustic & Hardware Score Decomposition
          </span>
          <span className="text-xs text-lime-400 font-mono font-semibold">{productData.recommendationStrength}</span>
        </div>

        <div className="space-y-4 font-mono">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Acoustic ANC Cabin Isolation</span>
              <span className="text-lime-400 font-bold">{productData.ancScore}%</span>
            </div>
            <div className="h-2 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/10">
              <div style={{ width: `${productData.ancScore}%` }} className="h-full bg-lime-400 shadow-lime-glow" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Battery Efficiency & Longevity (48h)</span>
              <span className="text-emerald-400 font-bold">{productData.batteryScore}%</span>
            </div>
            <div className="h-2 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/10">
              <div style={{ width: `${productData.batteryScore}%` }} className="h-full bg-emerald-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Weight Ergonomics & Frame Distribution</span>
              <span className="text-cyan-400 font-bold">{productData.weightScore}%</span>
            </div>
            <div className="h-2 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/10">
              <div style={{ width: `${productData.weightScore}%` }} className="h-full bg-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      <EvidenceDrawer
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidenceData={{
          sourceTable: 'DW_RETAIL.CATALOG_MASTER',
          recordsQueried: '3 Vector Rows Evaluated',
          sha256Hash: '09654578209B36E4377765C4008466C7',
          timestamp: '2026-08-14 14:10:00 UTC',
          executionMs: 0.42,
          title: `Product Vector Audit for ${productData.sku}`
        }}
      />
    </div>
  );
};
