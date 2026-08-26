import React, { useState } from 'react';
import { Lock, Eye, X } from 'lucide-react';
import { blockchainTrail } from '../../data/mockData';

export default function BlockchainLedger({ highContrast, t }) {
  const [selectedTx, setSelectedTx] = useState(null);

  return (
    <section id="blockchain" className={`py-16 ${highContrast ? 'bg-slate-950 text-yellow-300 border-b border-yellow-500' : 'bg-[#f0f4ea] border-t border-b border-[#abbe99]/50 text-[#243118]'}`}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#71873f]/10 border border-[#71873f]/30 text-[#71873f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-[#71873f]" />
            {t('IMMUTABLE GRAIN PROVENANCE', 'अपरिवर्तनीय खाद्यान्न उत्पत्ति')}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#243118] tracking-tight">
            {t('Blockchain Traceability Ledger Audit Trail', 'ब्लॉकचेन ट्रैसेबिलिटी लेजर ऑडिट ट्रेल')}
          </h2>
          <p className="text-[#4c633e] text-sm font-medium">
            {t('Every grain lot lifecycle event is cryptographically sealed and accessible to farmers, buyers, and audit agencies.', 'प्रत्येक खाद्यान्न लाट का रिकॉर्ड डिजिटल रूप से ब्लॉकचेन लेजर पर सुरक्षित है।')}
          </p>
        </div>

        {/* Timeline Records */}
        <div className="relative border-l-2 border-[#71873f]/40 ml-4 md:ml-32 space-y-8">
          {blockchainTrail.map((item, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8 group">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#71873f] group-hover:bg-[#71873f] transition-colors" />
              
              <div className="bg-white rounded-2xl p-5 border border-[#abbe99]/60 hover:border-[#71873f] transition-all space-y-3 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="bg-[#f0f4ea] text-[#71873f] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded border border-[#abbe99]">
                    BLOCK {item.blockHeight}
                  </span>
                  <span className="text-[11px] font-mono text-[#637554]">{item.timestamp}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h4 className="text-base font-extrabold text-[#243118]">
                    {t(item.titleEn, item.titleHi)}
                  </h4>
                  <span className="text-xs font-mono text-[#a36627] font-bold truncate max-w-xs">{item.hash}</span>
                </div>

                <p className="text-xs text-[#4c633e] font-medium leading-relaxed">
                  {t(item.detailsEn, item.detailsHi)}
                </p>

                <div className="pt-2 border-t border-[#abbe99]/30 flex flex-wrap items-center justify-between text-[11px] text-[#637554] gap-2">
                  <div>
                    <span className="font-bold">{t('Actor:', 'कर्ता:')}</span> {t(item.actorEn, item.actorHi)}
                  </div>

                  <button
                    onClick={() => setSelectedTx(item)}
                    className="flex items-center gap-1 text-[#71873f] font-bold hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('Verify Hash', 'हैश की जांच करें')}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Block Hash Verification Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full border border-[#abbe99] shadow-2xl space-y-4 text-[#243118]">
            <div className="flex items-center justify-between border-b border-[#abbe99]/40 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2 text-[#71873f]">
                <Lock className="w-5 h-5" />
                <span>{t('Cryptographic Block Hash Certificate', 'क्रिप्टोग्राफिक ब्लॉक हैश प्रमाणपत्र')}</span>
              </h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-[#637554] hover:text-[#243118] font-bold text-sm p-1.5 bg-[#f0f4ea] hover:bg-[#e0e8d6] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#f0f4ea] p-3 rounded-xl border border-[#abbe99]/60">
                <div className="text-[10px] text-[#a36627] font-bold">TRANSACTION HASH</div>
                <div className="text-sm font-bold text-[#71873f] break-all">{selectedTx.hash}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-[#fcfaf7] rounded-lg border">
                  <div className="text-[#637554]">BLOCK HEIGHT</div>
                  <div className="font-bold">{selectedTx.blockHeight}</div>
                </div>
                <div className="p-2 bg-[#fcfaf7] rounded-lg border">
                  <div className="text-[#637554]">STATUS</div>
                  <div className="font-bold text-[#688557]">CONFIRMED & SEALED</div>
                </div>
              </div>

              <div className="p-3 bg-[#fcfaf7] rounded-xl border space-y-1">
                <div className="text-[#637554] text-[10px] uppercase font-bold">Event Log Payload</div>
                <div className="text-xs text-[#243118] font-sans font-medium">{t(selectedTx.detailsEn, selectedTx.detailsHi)}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full bg-[#71873f] text-white font-bold py-3 rounded-xl text-xs hover:bg-[#688557]"
            >
              {t('Close Verification Window', 'सत्यापन विंडो बंद करें')}
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
