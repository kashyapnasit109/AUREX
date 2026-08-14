import React, { useState } from 'react';
import {
  Sparkles,
  Tag,
} from 'lucide-react';
import { mockProductIntelligence } from '../data/mockData';
import type { ProductAnalytics } from '../types/domain';
import { AskAurexDrawer } from '../components/common/AskAurexDrawer';

export const ProductIntelligence: React.FC = () => {
  const [products] = useState<ProductAnalytics[]>(mockProductIntelligence);
  const [selectedProduct, setSelectedProduct] = useState<ProductAnalytics>(mockProductIntelligence[0]);
  const [askAurexOpen, setAskAurexOpen] = useState(false);

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      <AskAurexDrawer
        isOpen={askAurexOpen}
        onClose={() => setAskAurexOpen(false)}
        contextTitle={`Product Intelligence: ${selectedProduct.name}`}
        contextPrompt={`Analyze pricing elasticity and demand velocity for SKU: ${selectedProduct.sku}.`}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold tracking-wide">
              Product Catalog Analytics & Telemetry
            </span>
            <span className="text-xs text-slate-300 font-medium">Grounded Warehouse SKUs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            Product Intelligence Matrix
          </h1>
          <p className="text-slate-300 font-sans text-sm mt-1">
            Real-time demand velocity, returns risk decomposition, customer segment affinity, and Aiden recommendation scores.
          </p>
        </div>

        {/* Action Trigger */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setAskAurexOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 text-obsidian-950 font-bold hover:bg-lime-400 shadow-lime-glow transition-all font-sans"
          >
            <Sparkles className="w-4 h-4" />
            <span>Optimize Catalog Pricing</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Cols: SKU Catalog Selection */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
            Verified Hardware Catalog ({products.length})
          </span>

          <div className="space-y-3">
            {products.map((prod) => (
              <div
                key={prod.sku}
                onClick={() => setSelectedProduct(prod)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedProduct.sku === prod.sku
                    ? 'glass-card border-lime-500/50 shadow-lime-glow'
                    : 'bg-obsidian-950/80 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm line-clamp-1">{prod.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-1">
                  <span>{prod.sku}</span>
                  <span className="text-lime-400 font-bold">${prod.price}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-slate-300">{prod.brand}</span>
                  <span className="text-emerald-400 font-semibold">{prod.demandVelocity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Deep SKU Intelligence */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Inventory Level</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{selectedProduct.inventoryCount} Units</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Warehouse North Hub</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Demand Velocity</div>
              <div className="text-2xl font-mono font-bold text-lime-400 mt-1">{selectedProduct.demandVelocity}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">High Velocity Trend</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Gross Margin</div>
              <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">{selectedProduct.grossMargin}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Optimal Pricing Tier</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Return Rate</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{selectedProduct.returnRate}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Industry Low (1.4%)</div>
            </div>
          </div>

          {/* Aiden Recommendation Attribution */}
          <div className="glass-card p-6 rounded-3xl border border-lime-500/25 bg-lime-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Aiden AI Recommendation Attribution</span>
              </div>
              <span className="font-mono text-xs font-bold text-lime-400 bg-lime-500/10 px-2.5 py-0.5 rounded border border-lime-500/20">
                {selectedProduct.aiAttributionScore}% Match Rating
              </span>
            </div>
            <p className="text-slate-100 text-sm leading-relaxed font-sans">
              {selectedProduct.aiPerception}
            </p>
          </div>

          {/* Customer Segment Breakdown */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="font-bold text-white text-base">Target Enterprise Segments</div>
            <div className="flex flex-wrap gap-3">
              {selectedProduct.targetSegments.map((seg, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-2"
                >
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{seg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
