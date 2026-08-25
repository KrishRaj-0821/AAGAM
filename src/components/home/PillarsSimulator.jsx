import React, { useState } from 'react';
import { Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { pillarsData } from '../../data/mockData';

export default function PillarsSimulator({ highContrast, t }) {
  const [activePillar, setActivePillar] = useState(0);
  const currentPillar = pillarsData[activePillar];
  const IconComponent = currentPillar.icon;

  return (
    <section id="pillars" className={`py-16 ${highContrast ? 'bg-slate-950 border-t border-b border-yellow-500' : 'bg-[#f4efe6] border-t border-b border-[#abbe99]/40'}`}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#71873f]/10 border border-[#71873f]/30 text-[#71873f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#71873f]" />
            {t('END-TO-END GRAIN LIFECYCLE', 'संपूर्ण खाद्यान्न जीवनचक्र')}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#243118] tracking-tight">
            {t('The 4 Pillars of AAGAM Ecosystem', 'आगामी पारिस्थितिकी तंत्र के 4 मुख्य स्तंभ')}
          </h2>
          <p className="text-[#637554] text-sm font-medium">
            {t('Click on any step below to simulate the automated grain procurement and allocation workflow.', 'स्वचालित खाद्यान्न खरीद एवं वितरण कार्यप्रवाह को सिम्युलेट करने के लिए किसी भी चरण पर क्लिक करें।')}
          </p>
        </div>

        {/* 4 Pillars Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {pillarsData.map((pillar, index) => {
            const IconComp = pillar.icon;
            const isActive = activePillar === index;

            return (
              <button
                key={pillar.step}
                onClick={() => setActivePillar(index)}
                className={`text-left p-4 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${isActive ? 'bg-gradient-to-br from-[#71873f] to-[#688557] text-white border-[#71873f] shadow-xl shadow-[#71873f]/20 scale-[1.02]' : 'bg-white text-[#243118] border-[#abbe99]/60 hover:border-[#71873f]'}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-8 h-8 rounded-full font-mono text-xs font-extrabold flex items-center justify-center ${isActive ? 'bg-white text-[#71873f]' : 'bg-[#f0f4ea] text-[#71873f]'}`}>
                      0{pillar.step}
                    </span>
                    <IconComp className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#a36627]'}`} />
                  </div>

                  <h4 className="font-extrabold text-sm mb-1 leading-snug">
                    {t(pillar.titleEn, pillar.titleHi)}
                  </h4>
                  <p className={`text-xs ${isActive ? 'text-white/90 font-medium' : 'text-[#637554]'}`}>
                    {t(pillar.shortDescEn, pillar.shortDescHi)}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t text-[11px] font-mono font-bold flex items-center justify-between ${isActive ? 'border-white/20 text-white' : 'border-[#abbe99]/40 text-[#a36627]'}`}>
                  <span>{t('Click to Simulate', 'सिम्युलेट करें')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Interactive Preview Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#abbe99]/60 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#f0f4ea] text-[#688557] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#abbe99]">
              <span>PILLAR 0{currentPillar.step} SIMULATION</span>
              <span className="text-[#a36627]">●</span>
              <span>{currentPillar.codeLabel}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-[#243118]">
              {t(currentPillar.titleEn, currentPillar.titleHi)}
            </h3>

            <p className="text-sm text-[#4c633e] leading-relaxed font-medium">
              {t(currentPillar.fullDescEn, currentPillar.fullDescHi)}
            </p>

            <div className="space-y-2 pt-2">
              {(t(currentPillar.highlightsEn, currentPillar.highlightsHi) || []).map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#243118]">
                  <CheckCircle2 className="w-4 h-4 text-[#71873f] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#243118] to-[#1c2713] text-white p-6 rounded-2xl border border-[#abbe99]/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-mono text-[#e0b87e] font-bold">DIGITAL AUDIT TOKEN</span>
                <span className="bg-[#688557] text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  Active Verified
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#e0b87e] shrink-0">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white">{t(currentPillar.titleEn, currentPillar.titleHi)}</div>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">{currentPillar.codeLabel}</div>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono space-y-1 text-slate-300">
                <div>HASH: 0x98f2a...390a1</div>
                <div>BLOCK_HEIGHT: #849,203</div>
                <div>ENCRYPTION: SHA-256 GOI LEDGER</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
