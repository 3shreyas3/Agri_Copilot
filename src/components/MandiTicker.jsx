import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { LIVE_MANDI_TICKER } from '../data/agriKnowledge';

export default function MandiTicker({ currentLang = 'en' }) {
  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-400 shrink-0 uppercase tracking-wider text-[11px] bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Agmarknet Mandis
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-6 whitespace-nowrap animate-none">
            {LIVE_MANDI_TICKER.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-800/70 px-3 py-1 rounded-md border border-slate-700/50 hover:border-emerald-500/50 transition">
                <span className="text-slate-300 font-medium">{item.commodity}</span>
                <span className="text-slate-400 text-[10px]">({item.mandi})</span>
                <span className="font-bold text-white">{item.price}</span>
                <span className={`inline-flex items-center text-[10px] font-semibold px-1 py-0.5 rounded ${item.trend === 'up' ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'}`}>
                  {item.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-slate-400 text-[11px] shrink-0">
          <RefreshCw className="w-3 h-3 text-emerald-400" />
          <span>Real-time Spot Data</span>
        </div>
      </div>
    </div>
  );
}
