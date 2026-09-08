import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, Sparkles, Package, DollarSign } from 'lucide-react';

export default function ValueAddCalculator({
  cropName,
  valueAddition,
  predictedMinPrice = 3000,
  predictedMaxPrice = 4000,
  landSize = 2.0
}) {
  // Default estimated yield based on land size (~15 quintals per acre standard)
  const defaultYield = Math.max(10, Math.round(landSize * 18));
  const [harvestYield, setHarvestYield] = useState(defaultYield);

  const avgBasePrice = Math.round((predictedMinPrice + predictedMaxPrice) / 2);
  const rawRevenue = harvestYield * avgBasePrice;

  // Extract margin percentage from estimatedMarginBoost (e.g. "25% to 32%" -> ~28%)
  let boostPercent = 25;
  const match = valueAddition?.estimatedMarginBoost?.match(/(\d+)%/);
  if (match && match[1]) {
    boostPercent = parseInt(match[1], 10);
  }

  const processedRevenue = Math.round(rawRevenue * (1 + boostPercent / 100));
  const extraProfit = processedRevenue - rawRevenue;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-emerald-500/30 overflow-hidden relative">
      {/* Background glowing subtle shape */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white tracking-wide">
                Value-Addition Profit Multiplier Simulator
              </h4>
              <p className="text-xs text-emerald-300/80">
                Direct comparison: Raw distress auction vs value-added processing
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 w-fit">
            +{boostPercent}% Est. Net Boost
          </span>
        </div>

        {/* Action Strategy Banner */}
        <div className="bg-emerald-950/70 border border-emerald-700/50 p-3.5 rounded-xl flex items-start gap-3">
          <Package className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-emerald-200">Recommended Strategy: </span>
            <span className="text-slate-200">{valueAddition?.action}</span>
            <p className="text-emerald-400/90 mt-1 font-medium">{valueAddition?.details}</p>
          </div>
        </div>

        {/* Interactive Yield Input Slider */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Simulated Harvest Yield:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="1000"
                value={harvestYield}
                onChange={(e) => setHarvestYield(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-2 py-0.5 text-xs text-right font-bold bg-slate-900 text-white rounded border border-slate-600 focus:border-emerald-400 outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">Quintals</span>
            </div>
          </div>

          <input
            type="range"
            min="10"
            max="300"
            step="5"
            value={harvestYield}
            onChange={(e) => setHarvestYield(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>10 Qtl</span>
            <span>150 Qtl</span>
            <span>300 Qtl</span>
          </div>
        </div>

        {/* Side-by-Side Financial Realization Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Raw Wholesale Sale */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1. Raw Mandi Spot Sale
            </div>
            <div className="text-xl font-bold text-slate-200 mt-1">
              ₹{rawRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              At benchmark avg ₹{avgBasePrice.toLocaleString('en-IN')}/qtl
            </p>
          </div>

          {/* Card 2: Value-Added Processing */}
          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-600/60 relative overflow-hidden">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              2. With Value Addition
            </div>
            <div className="text-xl font-extrabold text-emerald-300 mt-1">
              ₹{processedRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">
              Graded, processed or directly packed
            </p>
          </div>

          {/* Card 3: Net Additional Profit */}
          <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 p-3.5 rounded-xl border border-amber-400/40">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Net Added Profit
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              +₹{extraProfit.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-amber-200/90 mt-1">
              Pure extra farmer income ({boostPercent}% margin jump)
            </p>
          </div>

        </div>

        {/* By-Products & Secondary Realization */}
        {valueAddition?.byProducts && (
          <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/60 text-xs">
            <span className="font-semibold text-emerald-300">Monetizable By-Products: </span>
            <span className="text-slate-300">{valueAddition.byProducts.join(' • ')}</span>
          </div>
        )}

      </div>
    </div>
  );
}
