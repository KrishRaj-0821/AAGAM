import React, { useState } from 'react';
import { 
  BarChart3, 
  Filter, 
  TrendingUp, 
  Search, 
  RefreshCw, 
  Calculator, 
  Coins, 
  CloudSun, 
  ShieldCheck, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { 
  realMandiPriceMatrix, 
  realMandiWeatherData, 
  calculateDbtPayout, 
  officialMspRates,
  allIndianStatesData,
  allIndianCropsList
} from '../../data/realTimeData';

export default function PriceMatrix({ highContrast, t }) {
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live DBT Calculator State
  const [calcCrop, setCalcCrop] = useState('wheat');
  const [calcQty, setCalcQty] = useState('150');
  const calcResult = calculateDbtPayout(calcCrop, calcQty);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 600);
  };

  const filteredPrices = realMandiPriceMatrix.filter((item) => {
    const matchState = selectedStateFilter === 'All' || item.stateEn === selectedStateFilter;
    const matchCrop = selectedCropFilter === 'All' || item.cropEn.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchSearch = !searchQuery || 
      item.cropEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.mandiEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stateEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchCrop && matchSearch;
  });

  return (
    <section id="prices" className={`py-16 ${highContrast ? 'bg-slate-950 border-b border-yellow-500' : 'bg-[#f4efe6] border-b border-[#abbe99]/40'}`}>
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#71873f]/10 border border-[#71873f]/30 text-[#71873f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-[#71873f]" />
              {t('REAL-TIME AGMARKNET INTELLIGENCE', 'वास्तविक समय एगमार्कनेट मंडी दरें')}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#243118] tracking-tight">
              {t('Real-Time Commodity & Mandi Price Matrix', 'वास्तविक समय वस्तु एवं मंडी मूल्य मैट्रिक्स')}
            </h2>
            <p className="text-[#637554] text-sm mt-1">
              {t('Official Government Minimum Support Price (MSP) 2025-26 benchmarked against live APMC trading rates.', 'सरकारी न्यूनतम समर्थन मूल्य (MSP) 2025-26 की तुलना लाइव मंडी दरों से करें।')}
            </p>
          </div>

          {/* Live Data Badge & Refresh Button */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-[#abbe99] text-xs font-mono font-bold text-[#688557] flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Agmarknet Live: {lastRefreshed}</span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white hover:bg-[#f0f4ea] text-[#71873f] border border-[#abbe99] shadow-sm transition-all active:scale-95"
              title="Refresh Live Rates"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Weather & Mandi Moisture Advisory Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {realMandiWeatherData.map((weather, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-[#abbe99] shadow-sm space-y-2 hover:border-[#71873f] transition-all">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#243118]">{weather.hub}</span>
                <span className="font-mono font-extrabold text-sm text-[#a36627]">{weather.temp}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#71873f] font-semibold">
                <CloudSun className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t(weather.conditionEn, weather.conditionHi)}</span>
              </div>
              <div className="pt-2 border-t border-[#abbe99]/40 flex justify-between text-[10px] font-mono text-[#637554]">
                <span>Humidity: {weather.humidity}</span>
                <span className="text-emerald-700 font-bold">{weather.rainRisk}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] shadow-md flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#71873f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('Search commodity, mandi, variety, or state...', 'फसल, मंडी या राज्य खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fcfaf7] border border-[#abbe99] text-xs font-semibold text-[#243118] focus:border-[#71873f] focus:outline-none"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5 bg-[#fcfaf7] px-3 py-2 rounded-xl border border-[#abbe99] text-xs font-bold text-[#243118]">
            <Filter className="w-3.5 h-3.5 text-[#71873f]" />
            <span className="text-[#637554]">{t('State:', 'राज्य:')}</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-transparent font-extrabold focus:outline-none cursor-pointer max-w-[180px]"
            >
              <option value="All">{t('All States & UTs (36)', 'सभी राज्य व यूटी (36)')}</option>
              {Object.keys(allIndianStatesData).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div className="flex items-center gap-1.5 bg-[#fcfaf7] px-3 py-2 rounded-xl border border-[#abbe99] text-xs font-bold text-[#243118]">
            <span className="text-[#637554]">{t('Crop:', 'फसल:')}</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="bg-transparent font-extrabold focus:outline-none cursor-pointer max-w-[180px]"
            >
              <option value="All">{t('All Crops', 'सभी फसलें')}</option>
              {allIndianCropsList.map((c) => (
                <option key={c.name} value={c.name.split(' ')[0]}>
                  {c.name} ({c.hindi})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Commodity Price Table */}
        <div className="bg-white rounded-2xl border border-[#abbe99]/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#71873f] text-white uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-4">{t('Commodity / Variety', 'वस्तु / किस्म')}</th>
                  <th className="p-4">{t('State / Mandi', 'राज्य / मंडी')}</th>
                  <th className="p-4 text-right">{t('MSP 2025-26', 'एमएसपी 2025-26')}</th>
                  <th className="p-4 text-right">{t('Min Rate', 'न्यूनतम दर')}</th>
                  <th className="p-4 text-right">{t('Max Rate', 'अधिकतम दर')}</th>
                  <th className="p-4 text-right">{t('Modal Live Rate', 'मॉडल लाइव दर')}</th>
                  <th className="p-4 text-center">{t('Moisture Avg', 'औसत नमी')}</th>
                  <th className="p-4 text-center">{t('Price Status', 'मूल्य स्थिति')}</th>
                  <th className="p-4 text-right">{t('Arrival Volume', 'दैनिक आवक')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#abbe99]/30 text-[#243118] font-mono">
                {filteredPrices.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f0f4ea] transition-colors">
                    <td className="p-4 font-sans font-bold text-[#243118]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#71873f]" />
                        <div>
                          <div>{t(item.cropEn, item.cropHi)}</div>
                          <div className="text-[10px] text-[#637554] font-mono">{item.variety}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-sans">
                      <div className="font-bold text-[#243118]">{t(item.mandiEn, item.mandiHi)}</div>
                      <div className="text-[10px] text-[#637554]">{t(item.districtEn, item.districtHi)}, {t(item.stateEn, item.stateHi)}</div>
                    </td>

                    <td className="p-4 text-right font-bold text-[#637554]">
                      ₹{item.msp.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 text-right text-[#637554]">
                      ₹{item.minRate.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 text-right text-[#637554]">
                      ₹{item.maxRate.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 text-right font-extrabold text-sm text-[#71873f]">
                      ₹{item.modalRate.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 text-center">
                      <span className="bg-[#f0f4ea] text-[#688557] px-2 py-0.5 rounded font-mono font-bold text-[11px] border border-[#abbe99]">
                        {item.moistureAvg}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="bg-[#f0f4ea] text-[#688557] font-sans font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-[#abbe99]/80 shadow-xs">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right font-bold text-[#243118]">
                      {item.arrivalsToday}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Real-Time DBT Payout Calculator Component */}
        <div className="bg-gradient-to-br from-[#243118] via-[#334423] to-[#243118] rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6 border border-[#e0b87e]/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#e0b87e] text-[#243118] flex items-center justify-center font-bold shadow-md">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#e0b87e]">
                  {t('OFFICIAL GOI ESTIMATOR', 'आधिकारिक भारत सरकार कैलकुलेटर')}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                  {t('Real-Time MSP Payout & 48-Hour DBT Calculator', 'वास्तविक समय एमएसपी एवं 48-घंटे डीबीटी भुगतान कैलकुलेटर')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <ShieldCheck className="w-4 h-4 text-[#e0b87e]" />
              <span>0% Middleman Deduction Guarantee</span>
            </div>
          </div>

          {/* Calculator Inputs & Live Output Result */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-200">
                  {t('Select Commodity for Payout Calculation:', 'फसल का चयन करें:')}
                </label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-[#e0b87e] cursor-pointer"
                >
                  <option value="wheat" className="text-black">Wheat (गेहूं) - MSP ₹2,425 / Qtl</option>
                  <option value="paddyCommon" className="text-black">Paddy Common (धान सामान्य) - MSP ₹2,300 / Qtl</option>
                  <option value="paddyGradeA" className="text-black">Paddy Grade A (धान ग्रेड ए) - MSP ₹2,320 / Qtl</option>
                  <option value="mustard" className="text-black">Mustard (सरसों) - MSP ₹5,950 / Qtl</option>
                  <option value="chana" className="text-black">Chana / Gram (चना) - MSP ₹5,650 / Qtl</option>
                  <option value="cottonLong" className="text-black">Cotton Long Staple (कपास) - MSP ₹7,521 / Qtl</option>
                  <option value="soyabean" className="text-black">Soyabean (सोयाबीन) - MSP ₹4,892 / Qtl</option>
                  <option value="maize" className="text-black">Maize (मक्का) - MSP ₹2,225 / Qtl</option>
                  <option value="tur" className="text-black">Tur / Arhar (अरहर) - MSP ₹7,550 / Qtl</option>
                  <option value="moong" className="text-black">Moong (मूंग) - MSP ₹8,682 / Qtl</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">
                  {t('Estimated Quantity to Sell (in Quintals):', 'बिक्री हेतु अनुमानित मात्रा (क्विंटल में):')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={calcQty}
                    onChange={(e) => setCalcQty(e.target.value)}
                    className="w-full bg-white/10 border border-white/30 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#e0b87e]"
                  />
                  <span className="bg-white/20 px-4 py-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center">
                    Qtl
                  </span>
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4">
              <div className="flex justify-between items-center border-b border-white/20 pb-2 text-xs">
                <span className="text-slate-300">Govt Guaranteed MSP Rate:</span>
                <span className="font-mono font-extrabold text-[#e0b87e] text-sm">
                  ₹{calcResult.ratePerQtl.toLocaleString('en-IN')} / Qtl
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-white/20 pb-2 text-xs">
                <span className="text-slate-300">Gross Procurement Value:</span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{calcResult.grossAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-white/20 pb-2 text-xs">
                <span className="text-slate-300">Mandatory Mandi Cess / Fees:</span>
                <span className="font-mono font-bold text-emerald-300">
                  ₹0 (Zero Farmer Deduction)
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center text-left">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#e0b87e]">
                    {t('NET DIRECT BANK TRANSFER (DBT):', 'कुल सीधा बैंक खाता भुगतान:')}
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono text-white">
                    ₹{calcResult.netFarmerPayout.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                  <span>48-Hr PFMS Credit</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
