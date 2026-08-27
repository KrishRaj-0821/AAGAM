import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, QrCode, Search, Building2, Truck, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { mandisList } from '../data/mockData';
import { api } from '../services/api';

export default function ProcurementPage({ setCurrentView, setSlotStep, setIsSlotModalOpen, t }) {
  const [mandis, setMandis] = useState(mandisList);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCenters() {
      try {
        const res = await api.centers.getCenters();
        if (res?.data && res.data.length > 0) {
          const formatted = res.data.map(c => ({
            id: c.code || c.id,
            nameEn: c.name,
            nameHi: c.name_hi || c.name,
            districtEn: c.district,
            districtHi: c.district,
            stateEn: c.state,
            stateHi: c.state,
            distance: '3.2 KM',
            statusEn: c.operational_status === 'ACTIVE' ? 'Active Today' : c.operational_status,
            statusHi: 'सक्रिय',
            capacityToday: `${c.daily_capacity_mt} MT`,
            availableSlots: 45,
            phone: c.contact_phone
          }));
          setMandis(prev => [...formatted, ...prev.filter(p => !formatted.some(f => f.id === p.id))]);
        }
      } catch (err) {
        console.warn("Centers backend fallback:", err);
      }
    }
    loadCenters();
  }, []);

  const filteredMandis = mandis.filter(m =>
    m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.districtEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.stateEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {t('Government Procurement Centers & Mandi Locator', 'सरकारी खरीद केंद्र एवं मंडी लोकेटर')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#f0f4ea] text-[#688557] font-mono text-xs font-bold px-3 py-1 rounded-full border border-[#abbe99]">
              2,840 Central Mandis Live
            </span>
          </div>
        </div>

        {/* Hero Section Banner */}
        <div className="bg-gradient-to-r from-[#243118] via-[#334423] to-[#243118] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#e0b87e]/40">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-[#71873f] text-white font-mono text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {t('CAPACITY & QUEUE MANAGEMENT', 'क्षमता और कतार प्रबंधन')}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {t('Procurement Center Network', 'सरकारी खरीद केंद्र नेटवर्क')}
            </h1>
            <p className="text-xs text-slate-200 leading-relaxed">
              {t('Find nearest FCI & State Procurement yards, monitor live weighbridge queues, and book digital QR gate pass slots.', 'निकटतम एफसीआई और राज्य खरीद यार्ड खोजें, लाइव कतारों की निगरानी करें और डिजिटल गेट पास स्लॉट बुक करें।')}
            </p>
          </div>

          <button
            onClick={() => {
              setSlotStep(1);
              setIsSlotModalOpen(true);
            }}
            className="bg-[#71873f] hover:bg-[#688557] text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-lg flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <QrCode className="w-4 h-4 text-white" />
            <span>{t('Book Gate Pass Slot', 'गेट पास बुक करें')}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-[#71873f] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('Search mandi by district or state...', 'जिले या राज्य के नाम से मंडी खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#243118] focus:border-[#71873f] focus:outline-none"
            />
          </div>
        </div>

        {/* Mandis Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMandis.map((mandi) => (
            <div key={mandi.id} className="bg-white rounded-2xl border border-[#abbe99] p-6 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-base text-[#243118]">
                    {t(mandi.nameEn, mandi.nameHi)}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#637554] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#71873f]" />
                    <span>{t(mandi.districtEn, mandi.districtHi)}, {t(mandi.stateEn, mandi.stateHi)}</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                  {t(mandi.statusEn, mandi.statusHi)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#fcfaf7] p-4 rounded-xl border border-[#abbe99]/50 text-xs font-mono">
                <div>
                  <span className="text-[#637554] text-[10px] block">{t('Weighbridges', 'धर्म कांटा')}</span>
                  <span className="font-bold text-[#243118]">{t(mandi.weighbridgesEn, mandi.weighbridgesHi)}</span>
                </div>
                <div>
                  <span className="text-[#637554] text-[10px] block">{t('Queue Waiting', 'कतार समय')}</span>
                  <span className="font-bold text-[#a36627]">{t(mandi.queueEn, mandi.queueHi)}</span>
                </div>
                <div>
                  <span className="text-[#637554] text-[10px] block">{t('Slots Available', 'उपलब्ध स्लॉट')}</span>
                  <span className="font-bold text-[#71873f]">{mandi.availableSlotsToday} Slots</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#abbe99]/40">
                <div className="flex items-center gap-2 text-xs font-medium text-[#637554]">
                  <span>{t('Distance:', 'दूरी:')} <strong>{mandi.distance}</strong></span>
                </div>

                <button
                  onClick={() => {
                    setSlotStep(1);
                    setIsSlotModalOpen(true);
                  }}
                  className="bg-[#71873f] hover:bg-[#688557] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{t('Book Arrival Slot', 'स्लॉट बुक करें')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
