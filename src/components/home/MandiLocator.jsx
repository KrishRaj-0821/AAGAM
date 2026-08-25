import React, { useState } from 'react';
import { MapPin, Filter, Scale, Clock, QrCode } from 'lucide-react';
import { mandisList } from '../../data/mockData';
import { allIndianStatesData, allIndianCropsList } from '../../data/realTimeData';

export default function MandiLocator({
  highContrast,
  setBookingDetails,
  setSlotStep,
  setIsSlotModalOpen,
  openGatePassWithAuth,
  language = 'en',
  t
}) {
  const [locatorState, setLocatorState] = useState('All');
  const [locatorCommodity, setLocatorCommodity] = useState('All');

  // Dynamic Mandi aggregation from both mockData and allIndianStatesData
  const allStatesList = Object.keys(allIndianStatesData);

  const dynamicStateMandis = locatorState === 'All' 
    ? mandisList 
    : (allIndianStatesData[locatorState] 
      ? Object.entries(allIndianStatesData[locatorState].mandis).flatMap(([district, mList], distIdx) => 
          mList.map((mName, mIdx) => ({
            id: `dyn-${locatorState.slice(0,3)}-${distIdx}-${mIdx}`,
            nameEn: mName,
            nameHi: mName,
            districtEn: district,
            districtHi: district,
            stateEn: locatorState,
            stateHi: locatorState,
            statusEn: 'OPEN NOW',
            statusHi: 'खुला है',
            commoditiesEn: ['Wheat', 'Paddy', 'Mustard', 'Chana'],
            commoditiesHi: ['गेहूं', 'धान', 'सरसों', 'चना'],
            weighbridgesEn: '6 Active',
            weighbridgesHi: '6 सक्रिय',
            queueEn: '5 Trucks (~12 min wait)',
            queueHi: '5 ट्रैक्टर (~12 मिनट प्रतीक्षा)',
            code: `${locatorState.slice(0,2).toUpperCase()}-${district.slice(0,3).toUpperCase()}-0${mIdx+1}`
          }))
        )
      : mandisList.filter(m => m.stateEn === locatorState));

  const filteredMandis = dynamicStateMandis.filter((mandi) => {
    const matchState = locatorState === 'All' || mandi.stateEn === locatorState;
    const matchComm = locatorCommodity === 'All' || 
      (mandi.commoditiesEn && mandi.commoditiesEn.some((c) => c.toLowerCase().includes(locatorCommodity.toLowerCase()))) ||
      mandi.nameEn.toLowerCase().includes(locatorCommodity.toLowerCase());
    return matchState && matchComm;
  });

  const handleBookSlot = (mandi) => {
    if (setBookingDetails) {
      setBookingDetails(prev => ({ 
        ...prev, 
        state: mandi.stateEn,
        district: mandi.districtEn,
        mandi: t(mandi.nameEn, mandi.nameHi) 
      }));
    }
    if (openGatePassWithAuth) {
      openGatePassWithAuth();
    } else {
      if (setSlotStep) setSlotStep(1);
      if (setIsSlotModalOpen) setIsSlotModalOpen(true);
    }
  };

  return (
    <section id="locator" className={`py-16 ${highContrast ? 'bg-slate-900 border-b border-yellow-500' : 'bg-[#fcfaf7]'}`}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#71873f]/10 border border-[#71873f]/30 text-[#71873f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#71873f]" />
              {t('PROCUREMENT CENTER DIRECTORY (ALL 36 STATES & UTS)', 'खरीद केंद्र निर्देशिका (सभी 36 राज्य एवं केंद्र शासित प्रदेश)')}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#243118] tracking-tight">
              {t('Mandi Locator & Queue Monitor', 'मंडी लोकेटर एवं कतार मॉनिटर')}
            </h2>
            <p className="text-[#637554] text-sm mt-1">
              {t('Locate nearby government procurement centers across all Indian states, check live queue status, and reserve arrival slots.', 'देश के सभी राज्यों में निकटतम मंडी खोजें, कतार स्थिति जांचें और ऑनलाइन स्लॉट बुक करें।')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* State Filter with ALL Indian States & UTs */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#abbe99] text-xs shadow-sm">
              <Filter className="w-3.5 h-3.5 text-[#71873f]" />
              <span className="text-[#637554] font-bold">{t('State:', 'राज्य:')}</span>
              <select
                value={locatorState}
                onChange={(e) => setLocatorState(e.target.value)}
                className="bg-transparent text-[#243118] font-bold focus:outline-none cursor-pointer max-w-[180px]"
              >
                <option value="All">{t('All States & UTs (36)', 'सभी राज्य व यूटी (36)')}</option>
                {allStatesList.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Commodity Filter with ALL Indian Crops */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#abbe99] text-xs shadow-sm">
              <span className="text-[#637554] font-bold">{t('Crop:', 'फसल:')}</span>
              <select
                value={locatorCommodity}
                onChange={(e) => setLocatorCommodity(e.target.value)}
                className="bg-transparent text-[#243118] font-bold focus:outline-none cursor-pointer max-w-[180px]"
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
        </div>

        {/* Mandis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMandis.map((mandi) => (
            <div
              key={mandi.id}
              className="bg-white rounded-2xl border border-[#abbe99] p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold bg-[#f0f4ea] text-[#71873f] px-2 py-0.5 rounded border border-[#abbe99]">
                    {mandi.code}
                  </span>
                  <span className="text-xs text-[#a36627] font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {t(mandi.districtEn, mandi.districtHi)}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#243118] line-clamp-1">
                  {t(mandi.nameEn, mandi.nameHi)}
                </h3>
                <p className="text-xs text-[#637554] font-medium">{t(mandi.stateEn, mandi.stateHi)}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(language === 'hi' ? (mandi.commoditiesHi || mandi.commoditiesEn) : (mandi.commoditiesEn || [])).map((c, i) => (
                    <span key={i} className="text-[10px] bg-[#fcfaf7] border border-[#abbe99] px-2 py-0.5 rounded font-mono font-semibold text-[#243118]">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#abbe99]/40 space-y-2 text-xs text-[#243118]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#637554] flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-[#71873f]" />
                      {t('Weighbridges:', 'धर्म कांटा:')}
                    </span>
                    <span className="font-mono font-bold text-[#71873f]">{t(mandi.weighbridgesEn, mandi.weighbridgesHi)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#637554] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#a36627]" />
                      {t('Live Queue:', 'कतार स्थिति:')}
                    </span>
                    <span className="font-mono font-bold text-[#a36627]">{t(mandi.queueEn, mandi.queueHi)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBookSlot(mandi)}
                className="w-full mt-4 bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>{t('Book Gate Pass', 'गेट पास बुक करें')}</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
