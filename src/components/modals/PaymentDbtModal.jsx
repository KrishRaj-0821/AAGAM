import React, { useState } from 'react';
import { Coins, Search, CheckCircle2, X } from 'lucide-react';

export default function PaymentDbtModal({ isOpen, onClose, t }) {
  const [dbtSearchInput, setDbtSearchInput] = useState('');
  const [searchedRecord, setSearchedRecord] = useState(null);

  if (!isOpen) return null;

  const handleSearch = () => {
    setSearchedRecord({
      farmerName: 'Gurpreet Singh',
      aadhaarLast4: '4829',
      bankName: 'State Bank of India',
      ifsc: 'SBIN0004829',
      utrNo: '39482019482710',
      amount: '₹6,02,612',
      status: 'CREDITED & VERIFIED',
      date: '2026-08-24 11:02 UTC',
      mandi: 'Karnal Central Grain Yard',
      commodity: 'Wheat (Sharbati) - 248.5 Qtl'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full border border-[#abbe99] shadow-2xl space-y-6 text-[#243118] relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#a36627] text-white flex items-center justify-center font-bold">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#243118]">
                {t('Direct Benefit Transfer (DBT) Payment Tracker', 'डीबीटी भुगतान एवं बैंक यूटीआर ट्रैकर')}
              </h3>
              <p className="text-xs text-[#637554]">
                {t('NPCI Aadhaar Payment Bridge Live Status Monitor', 'एनपीसीआई आधार भुगतान स्थिति जांचें')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#637554] hover:bg-[#f0f4ea] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#243118]">
            {t('Enter Farmer ID / Aadhaar / Gate Pass Token No:', 'किसान आईडी / आधार / गेट पास नंबर दर्ज करें:')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={dbtSearchInput}
              onChange={(e) => setDbtSearchInput(e.target.value)}
              placeholder="e.g. PB-FARM-99482 or 9948-2019-4827"
              className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono font-bold text-[#243118] focus:border-[#71873f] focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-[#71873f] hover:bg-[#688557] text-white font-bold px-5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow"
            >
              <Search className="w-4 h-4" />
              <span>{t('Track Payment', 'खोजें')}</span>
            </button>
          </div>
        </div>

        {/* Payment Record Result Card */}
        {searchedRecord && (
          <div className="bg-[#f0f4ea] rounded-2xl p-5 border border-[#71873f]/40 space-y-4 shadow-md">
            
            <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-3">
              <div>
                <div className="text-xs text-[#637554] font-medium">{t('Beneficiary Farmer', 'लाभार्थी किसान')}</div>
                <div className="text-base font-extrabold text-[#243118]">{searchedRecord.farmerName}</div>
              </div>
              <span className="bg-[#688557] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {searchedRecord.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <div className="text-[#637554] text-[10px]">{t('DBT Amount Transferred:', 'डीबीटी हस्तांतरित राशि:')}</div>
                <div className="text-lg font-extrabold text-[#71873f]">{searchedRecord.amount}</div>
              </div>

              <div>
                <div className="text-[#637554] text-[10px]">{t('Bank UTR Transaction No:', 'बैंक यूटीआर नंबर:')}</div>
                <div className="font-bold text-[#a36627]">{searchedRecord.utrNo}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#abbe99]/40 space-y-1 text-xs text-[#4c633e] font-medium">
              <div><strong>{t('Aadhaar-linked Bank:', 'आधार-लिंक्ड बैंक:')}</strong> {searchedRecord.bankName} ({searchedRecord.ifsc})</div>
              <div><strong>{t('Commodity & Weight:', 'फसल एवं तौल:')}</strong> {searchedRecord.commodity}</div>
              <div><strong>{t('Procurement Yard:', 'खरीद केंद्र:')}</strong> {searchedRecord.mandi}</div>
              <div className="text-[10px] font-mono text-[#637554]">NPCI SETTLEMENT TIMESTAMP: {searchedRecord.date}</div>
            </div>

          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-[#71873f] text-white font-bold py-3 rounded-xl text-xs hover:bg-[#688557]"
        >
          {t('Close Payment Window', 'बंद करें')}
        </button>

      </div>
    </div>
  );
}
