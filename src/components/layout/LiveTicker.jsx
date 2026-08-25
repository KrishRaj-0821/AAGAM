import React, { useState, useEffect } from 'react';
import { TrendingUp, Radio, RefreshCw } from 'lucide-react';
import { realTimeTickerData } from '../../data/realTimeData';

export default function LiveTicker({ highContrast, t }) {
  const [tickerList, setTickerList] = useState(realTimeTickerData);
  const [lastTickTime, setLastTickTime] = useState(new Date().toLocaleTimeString());

  // Simulate real-time Agmarknet micro-variations
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerList((prev) =>
        prev.map((item) => {
          // Subtle realistic fluctuation of +/- 0.2%
          const isTick = Math.random() > 0.6;
          if (!isTick) return item;
          const currentNumeric = parseInt(item.rate.replace(/[^0-9]/g, ''));
          const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5 + 1);
          const newRate = currentNumeric + delta;
          return {
            ...item,
            rate: `₹${newRate.toLocaleString('en-IN')}`
          };
        })
      );
      setLastTickTime(new Date().toLocaleTimeString());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate items for seamless infinite marquee loop
  const displayItems = [...tickerList, ...tickerList];

  return (
    <div className={`${highContrast ? 'bg-slate-900 border-b border-yellow-500 text-yellow-300' : 'bg-[#536b44] text-white border-b border-[#71873f]/40'} py-2 px-4 overflow-hidden text-xs shadow-inner`}>
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        
        {/* Fixed Live Ticker Badge with Live Indicator */}
        <div className="bg-[#e0b87e] text-[#243118] font-mono font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider text-[10px] shrink-0 shadow-md flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <Radio className="w-3 h-3 text-[#243118]" />
          <span>{t('LIVE AGMARKNET FEED', 'लाइव मंडी दरें')}</span>
        </div>

        {/* Moving Marquee Ticker Feed */}
        <div className="relative overflow-hidden w-full pause-on-hover py-0.5 font-mono text-[11px]">
          <div className="flex animate-ticker gap-6 whitespace-nowrap">
            {displayItems.map((item, idx) => (
              <div 
                key={idx} 
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 px-3.5 py-1 rounded-xl border border-white/15 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <span className="font-sans font-extrabold text-white">{t(item.cropEn, item.cropHi)}:</span>
                <span className="text-slate-200">MSP {item.msp}</span>
                <span className="text-[#e0b87e] font-extrabold text-xs">{t('Modal', 'दर')} {item.rate}</span>
                <span className="text-emerald-300 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {item.change}
                </span>
                <span className="text-slate-300 text-[10px] font-sans font-medium">({t(item.locationEn, item.locationHi)})</span>
                <span className="text-[9px] bg-black/20 text-emerald-200 px-1.5 py-0.2 rounded font-mono">Vol: {item.volume}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Clock / Refresh indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-slate-200 shrink-0 border-l border-white/20 pl-3">
          <span className="text-emerald-300 font-bold">● LIVE</span>
          <span>{lastTickTime}</span>
        </div>

      </div>
    </div>
  );
}
