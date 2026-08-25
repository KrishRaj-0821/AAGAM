import React, { useState } from 'react';
import { ChevronLeft, Search, Filter, ShieldCheck, CheckCircle2, ArrowRight, Coins, MapPin, Tag } from 'lucide-react';
import { marketplaceItems } from '../data/mockData';

export default function MarketplacePage({ setCurrentView, setIsDbtModalOpen, t }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedListing, setSelectedListing] = useState(null);

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.cropEn.toLowerCase().includes(searchTerm.toLowerCase()) || item.farmerEn.toLowerCase().includes(searchTerm.toLowerCase()) || item.locationEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'All' || item.cropEn.includes(selectedCrop);
    return matchesSearch && matchesCrop;
  });

  return (
    <section className="py-10 bg-[#fcfaf7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#abbe99]/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] font-bold px-3.5 py-2 rounded-xl border border-[#71873f]/40 text-xs transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('Back to Home', 'मुख्य पृष्ठ पर लौटें')}</span>
            </button>
            <span className="text-xs font-mono text-[#637554]">/</span>
            <span className="text-xs font-mono font-bold text-[#243118]">
              {t('National Crop Marketplace (e-Trading)', 'राष्ट्रीय फसल बाजार')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#f0f4ea] text-[#688557] font-mono text-xs font-bold px-3 py-1 rounded-full border border-[#abbe99]">
              {t('Direct Farmer-to-Trader Sales', 'प्रत्यक्ष किसान-व्यापारी बिक्री')}
            </span>
          </div>
        </div>

        {/* Hero Section Banner */}
        <div className="bg-gradient-to-r from-[#243118] via-[#334423] to-[#243118] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#e0b87e]/40">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-[#e0b87e] text-[#243118] font-mono text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {t('Verified e-NAM Listings', 'सत्यापित ई-नाम फसलें')}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {t('Direct Crop Trading Marketplace', 'सीधा फसल क्रय-विक्रय बाजार')}
            </h1>
            <p className="text-xs text-slate-200 leading-relaxed">
              {t('Buy certified grain lots directly from registered farmers with AI-verified moisture laboratory certificates and zero agent commission.', 'सत्यापित किसानों से एआई-जांची गुणवत्ता और 0% एजेंट कमीशन के साथ सीधे अनाज खरीदें।')}
            </p>
          </div>

          <button
            onClick={() => setIsDbtModalOpen(true)}
            className="bg-[#e0b87e] hover:bg-[#cba063] text-[#243118] font-extrabold px-5 py-3 rounded-2xl text-xs shadow-lg flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Coins className="w-4 h-4" />
            <span>{t('Check Trader Escrow Balance', 'व्यापारी वॉलेट बैलेंस जांचें')}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#71873f] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('Search crop, farmer, or location...', 'फसल, किसान या स्थान खोजें...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#243118] focus:border-[#71873f] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-[#71873f] shrink-0" />
            {['All', 'Wheat', 'Basmati', 'Mustard', 'Chana'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors whitespace-nowrap ${selectedCrop === c ? 'bg-[#71873f] text-white shadow-sm' : 'bg-[#f0f4ea] text-[#637554] border border-[#abbe99]/60 hover:bg-[#e0e8d6]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#abbe99] p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#a36627] font-bold block">{item.lotNo}</span>
                    <h3 className="font-extrabold text-base text-[#243118] mt-0.5">
                      {t(item.cropEn, item.cropHi)}
                    </h3>
                  </div>
                  {item.verified && (
                    <span className="bg-[#f0f4ea] text-[#688557] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#abbe99] shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#71873f]" />
                      VERIFIED
                    </span>
                  )}
                </div>

                <div className="bg-[#fcfaf7] p-3 rounded-xl border border-[#abbe99]/50 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#637554]">{t('Farmer:', 'किसान:')}</span>
                    <span className="font-bold text-[#243118]">{t(item.farmerEn, item.farmerHi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#637554]">{t('Quantity:', 'मात्रा:')}</span>
                    <span className="font-bold text-[#71873f]">{item.qty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#637554]">{t('AI Moisture:', 'नमी:')}</span>
                    <span className="font-bold text-[#a36627]">{item.moisture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#637554]">{t('Location:', 'स्थान:')}</span>
                    <span className="font-bold text-[#243118]">{t(item.locationEn, item.locationHi)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#abbe99]/40 pt-3">
                  <div>
                    <span className="text-[10px] text-[#637554] font-bold block">{t('Asking Price', 'मांगी गई दर')}</span>
                    <span className="text-lg font-extrabold text-[#71873f]">{item.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#637554] block">{t('MSP Floor', 'न्यूनतम एमएसपी')}</span>
                    <span className="text-xs font-mono font-bold text-[#a36627]">{item.msp}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedListing(item)}
                className="w-full bg-[#71873f] hover:bg-[#688557] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t('Buy / Submit Purchase Offer', 'खरीदें / ऑफ़र जमा करें')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Purchase Offer Modal */}
        {selectedListing && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#abbe99] max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-3">
                <h3 className="font-extrabold text-lg text-[#243118]">
                  {t('Submit Purchase Offer', 'खरीद ऑफ़र जमा करें')}
                </h3>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-slate-400 hover:text-slate-600 font-mono text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99] space-y-2 text-xs">
                <div className="font-bold text-sm text-[#243118]">
                  {t(selectedListing.cropEn, selectedListing.cropHi)} ({selectedListing.lotNo})
                </div>
                <div className="flex justify-between text-[#637554] font-mono">
                  <span>{t('Farmer:', 'किसान:')} {t(selectedListing.farmerEn, selectedListing.farmerHi)}</span>
                  <span>{t('Quantity:', 'मात्रा:')} {selectedListing.qty}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Your Offered Price (Per Quintal):', 'आपकी प्रस्तावित दर (प्रति कुंतल):')}</label>
                  <input
                    type="text"
                    defaultValue={selectedListing.price}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 font-mono font-bold text-[#71873f] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Delivery Terms:', 'वितरण शर्तें:')}</label>
                  <select className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 font-medium text-[#243118] focus:outline-none">
                    <option>{t('Direct Farmgate Pickup by Buyer', 'खरीदार द्वारा सीधे खेत से उठाव')}</option>
                    <option>{t('Mandi Yard Delivery by Farmer', 'किसान द्वारा मंडी यार्ड डिलीवरी')}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="w-1/3 bg-[#f4efe6] text-[#243118] font-bold py-3 rounded-xl border border-[#abbe99] text-xs"
                >
                  {t('Cancel', 'रद्द करें')}
                </button>
                <button
                  onClick={() => {
                    alert(t('Purchase offer submitted successfully! Farmer notified via SMS.', 'खरीद ऑफ़र सफलतापूर्वक जमा किया गया! किसान को एसएमएस भेज दिया गया है।'));
                    setSelectedListing(null);
                  }}
                  className="w-2/3 bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3 rounded-xl text-xs shadow flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('Confirm Offer & Escrow Lock', 'ऑफ़र और एस्क्रो लॉक पुष्टि करें')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
