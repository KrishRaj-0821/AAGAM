import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

const PENDING_FARMERS = [
  { id: 'PB-FARM-99482', name: 'Gurpreet Singh', district: 'Karnal, HR', crop: 'Wheat 180 Qtl', khasra: '48/2', land: '4.5 Acres', aadhaar: '✓', status: 'PENDING' },
  { id: 'PB-FARM-99483', name: 'Amarjit Kaur', district: 'Ludhiana, PB', crop: 'Paddy 220 Qtl', khasra: '12/3', land: '6.0 Acres', aadhaar: '✓', status: 'PENDING' },
  { id: 'MH-FARM-44210', name: 'Vijay Patil', district: 'Latur, MH', crop: 'Chana 80 Qtl', khasra: '22/1', land: '3.2 Acres', aadhaar: '✓', status: 'APPROVED' },
  { id: 'RJ-FARM-88120', name: 'Ramesh Sharma', district: 'Bharatpur, RJ', crop: 'Mustard 120 Qtl', khasra: '7/4', land: '8.0 Acres', aadhaar: '✓', status: 'PENDING' },
];

export default function OfficerPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [farmers, setFarmers] = useState(PENDING_FARMERS);

  const approve = (id) => setFarmers(f => f.map(x => x.id === id ? { ...x, status: 'APPROVED' } : x));
  const reject = (id) => setFarmers(f => f.map(x => x.id === id ? { ...x, status: 'REJECTED' } : x));

  const tabs = [
    { key: 'dashboard', label: '🏛️ Dashboard', hi: 'डैशबोर्ड' },
    { key: 'farmers', label: '✅ Farmer Verification', hi: 'किसान सत्यापन' },
    { key: 'centers', label: '🏪 Procurement Centers', hi: 'खरीद केंद्र' },
    { key: 'slots', label: '📅 Slot Management', hi: 'स्लॉट प्रबंधन' },
    { key: 'disbursement', label: '💳 Payment Escrow', hi: 'भुगतान एस्क्रो' },
    { key: 'reports', label: '📊 Daily Reports', hi: 'दैनिक रिपोर्ट' },
  ];

  return (
    <section className="min-h-screen bg-[#f0f5fb] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-[#0c3060] to-[#1e4e9a] rounded-3xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl shadow-lg">🏛️</div>
            <div>
              <h1 className="text-2xl font-extrabold">Procurement Officer Portal</h1>
              <p className="text-sm text-blue-200">{currentUser?.name || 'Officer Rajesh Kumar'} • DPO-HR-KRN-001 • Karnal District, Haryana</p>
            </div>
          </div>
          <div className="text-right hidden md:block font-mono text-sm">
            <div className="text-blue-200">Target: <span className="text-white font-bold">4,50,000 MT</span></div>
            <div className="text-blue-200">Achieved: <span className="text-emerald-400 font-bold">82.4% (3,70,800 MT)</span></div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-[#243118] border border-[#abbe99] hover:bg-blue-50'}`}>
              {t(tab.label, tab.hi)}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Procurement Today', val: '14,800 MT', sub: '82.4% of target', color: 'blue', icon: '🏪' },
                { label: 'KYC Pending', val: '12 Cases', sub: 'Avg review: 4.2 min', color: 'amber', icon: '📋' },
                { label: 'DBT Released Today', val: '₹4.82 Cr', sub: 'SLA: 26h (target <48h)', color: 'emerald', icon: '💳' },
                { label: 'Active Centers', val: '248 Yards', sub: '2 near capacity alert', color: 'red', icon: '⚠️' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-4 rounded-2xl`}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[11px] font-bold text-${c.color}-700`}>{c.label}</div>
                  <div className={`text-[10px] text-${c.color}-600 mt-0.5`}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#abbe99] p-5">
              <h3 className="font-extrabold text-sm text-[#243118] mb-3">📊 State Procurement Progress</h3>
              {[
                { state: 'Haryana', done: 370800, target: 450000 },
                { state: 'Punjab', done: 890000, target: 1000000 },
                { state: 'Rajasthan', done: 240000, target: 400000 },
              ].map(s => {
                const pct = Math.round((s.done / s.target) * 100);
                return (
                  <div key={s.state} className="mb-3 text-xs font-mono">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-[#243118]">{s.state}</span>
                      <span className="text-[#637554]">{(s.done/1000).toFixed(0)}K / {(s.target/1000).toFixed(0)}K MT ({pct}%)</span>
                    </div>
                    <div className="w-full bg-[#e0e8d6] rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FARMER VERIFICATION */}
        {activeTab === 'farmers' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">✅ Farmer KYC Verification Queue</h3>
            <div className="space-y-3">
              {farmers.map(f => (
                <div key={f.id} className="border border-[#abbe99] rounded-2xl p-4 space-y-2">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="font-mono text-xs space-y-0.5">
                      <div className="font-extrabold text-sm text-[#243118]">{f.name} <span className="text-[#637554] font-normal">({f.id})</span></div>
                      <div className="text-[#637554]">📍 {f.district} • 🌾 {f.crop} • Land: {f.land} (Khasra {f.khasra})</div>
                      <div className="text-[#637554]">Aadhaar e-KYC: <span className="text-emerald-700 font-bold">{f.aadhaar} Verified</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                      {f.status === 'PENDING' ? (
                        <>
                          <button onClick={() => approve(f.id)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => reject(f.id)} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 transition-all">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${f.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {f.status === 'APPROVED' ? '✓ APPROVED' : '✗ REJECTED'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CENTERS */}
        {activeTab === 'centers' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">🏪 Procurement Center Capacity Dashboard</h3>
            <div className="space-y-3 text-xs font-mono">
              {[
                { name: 'Karnal Central Yard', state: 'Haryana', arrivals: 1420, cap: 2000, lanes: 14, status: 'OK' },
                { name: 'Khanna APMC', state: 'Punjab', arrivals: 3290, cap: 3500, lanes: 18, status: 'ALERT' },
                { name: 'Bharatpur APMC', state: 'Rajasthan', arrivals: 980, cap: 1800, lanes: 10, status: 'OK' },
                { name: 'Latur APMC', state: 'Maharashtra', arrivals: 1150, cap: 2200, lanes: 12, status: 'OK' },
              ].map(c => {
                const pct = Math.round((c.arrivals / c.cap) * 100);
                return (
                  <div key={c.name} className={`p-3 rounded-xl border ${c.status === 'ALERT' ? 'bg-red-50 border-red-200' : 'bg-[#fcfaf7] border-[#abbe99]/60'}`}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-bold text-[#243118]">{c.name} <span className="text-[#637554] font-normal">• {c.state}</span></span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#637554]">{c.arrivals} / {c.cap} MT</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'ALERT' ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{c.status === 'ALERT' ? '⚠ NEAR FULL' : '✓ OK'}</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#e0e8d6] rounded-full h-2">
                      <div className={`h-2 rounded-full ${pct > 85 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="text-[10px] text-[#637554] mt-1">{c.lanes} weighbridge lanes • {pct}% utilized</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SLOTS */}
        {activeTab === 'slots' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📅 Slot & Queue Management</h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs font-mono mb-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-center">
                <div className="text-xl font-extrabold text-blue-900">1,284</div>
                <div className="text-blue-700 font-bold">Slots Booked Today</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
                <div className="text-xl font-extrabold text-amber-900">48</div>
                <div className="text-amber-700 font-bold">Rescheduled (Rain Alert)</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                <div className="text-xl font-extrabold text-emerald-900">42 min</div>
                <div className="text-emerald-700 font-bold">Avg Queue Wait Time</div>
              </div>
            </div>
            <div className="bg-[#f0f5fb] border border-blue-100 rounded-xl p-3 text-xs font-mono text-[#243118]">
              <strong>⚠️ Auto-Reschedule Engine:</strong> 48 farmers auto-notified via SMS about tomorrow's slots due to rain forecast in Karnal district. New slots assigned: 07:00 AM–09:00 AM.
            </div>
          </div>
        )}

        {/* DISBURSEMENT */}
        {activeTab === 'disbursement' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">💳 Payment Escrow Monitoring</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              {[
                { label: 'Total Escrow Held', val: '₹42.8 Cr', color: 'sky' },
                { label: 'Released Today', val: '₹28.4 Cr', color: 'emerald' },
                { label: 'DBT Processing', val: '284 Cases', color: 'amber' },
                { label: 'SLA Breach Today', val: '0 Cases', color: 'emerald' },
                { label: 'NPCI Success Rate', val: '99.97%', color: 'blue' },
                { label: 'Avg Credit Time', val: '36 Hours', color: 'purple' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-3 rounded-xl text-center`}>
                  <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[10px] text-${c.color}-700 font-bold uppercase`}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📊 Daily Procurement Reports</h3>
            <div className="space-y-2 text-xs font-mono">
              {[
                { title: 'Daily Procurement Summary — 25 Aug 2025', size: '2.4 MB', type: 'PDF' },
                { title: 'Farmer KYC Verification Report — Aug 2025', size: '1.1 MB', type: 'Excel' },
                { title: 'DBT Disbursement Ledger — Q2 2025', size: '3.8 MB', type: 'PDF' },
                { title: 'Center Capacity Utilization — State-wise', size: '0.9 MB', type: 'CSV' },
              ].map(r => (
                <div key={r.title} className="flex justify-between items-center p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div>
                    <div className="font-bold text-[#243118]">{r.title}</div>
                    <div className="text-[#637554] text-[10px]">{r.type} • {r.size}</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">⬇ Download</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
