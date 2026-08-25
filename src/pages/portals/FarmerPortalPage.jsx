import React, { useState } from 'react';
import { ChevronLeft, Sprout, Coins, QrCode, MapPin, TrendingUp, CheckCircle2, Clock, Download, Bell, FileText, BarChart3 } from 'lucide-react';

const CROPS = ['Wheat (Sharbati)', 'Paddy (Basmati 1121)', 'Mustard (Bold)', 'Chana (Desi)', 'Soyabean', 'Cotton (Long Staple)', 'Maize', 'Tur Dal', 'Moong', 'Urad', 'Sunflower', 'Groundnut'];
const MSP = { 'Wheat (Sharbati)': 2425, 'Paddy (Basmati 1121)': 2300, 'Mustard (Bold)': 5950, 'Chana (Desi)': 5650, 'Soyabean': 4892, 'Cotton (Long Staple)': 7521, 'Maize': 2225, 'Tur Dal': 7550, 'Moong': 8558, 'Urad': 7400, 'Sunflower': 6760, 'Groundnut': 6783 };

export default function FarmerPortalPage({ setCurrentView, currentUser, openGatePassWithAuth, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCrop, setSelectedCrop] = useState('Wheat (Sharbati)');

  const farmerData = {
    name: currentUser?.name || 'Gurpreet Singh',
    id: 'PB-FARM-99482',
    district: 'Karnal, Haryana',
    land: '4.5 Acres (Khasra 48/2)',
    aadhaar: 'XXXX-XXXX-9482 ✓',
    bank: 'SBI XXXX4892 (NPCI-DBT Linked)',
    pmkisan: 'PMKN-99482 ✓',
    crops: [
      { name: 'Wheat (Sharbati)', qty: 180, grade: 'A', moisture: 10.8, status: 'SOLD', dbt: '₹4,36,500', utr: 'SBIN0048291' },
      { name: 'Mustard (Bold)', qty: 80, grade: 'A', moisture: 8.2, status: 'IN AUCTION', dbt: '—', utr: '—' },
    ],
    slots: [
      { token: 'HR-KRN-4829', mandi: 'Karnal Central Yard', date: '08-Sep-2025', time: '10:00–11:00 AM', status: 'CONFIRMED' },
      { token: 'HR-KRN-4830', mandi: 'Kurukshetra APMC', date: '15-Sep-2025', time: '09:00–10:00 AM', status: 'PENDING' },
    ],
    payments: [
      { crop: 'Wheat 180 Qtl', amt: '₹4,36,500', date: '10-Sep-2025', status: 'CREDITED', utr: 'SBIN0048291' },
      { crop: 'Mustard 80 Qtl', amt: '₹4,76,000', date: 'Pending', status: 'PENDING', utr: '—' },
    ]
  };

  const tabs = [
    { key: 'dashboard', label: '🌾 Dashboard', hi: 'डैशबोर्ड' },
    { key: 'crops', label: '🌿 My Crops', hi: 'मेरी फसलें' },
    { key: 'slots', label: '🎫 Slots & QR', hi: 'स्लॉट व QR' },
    { key: 'payments', label: '💳 Payments (DBT)', hi: 'भुगतान (DBT)' },
    { key: 'prices', label: '📊 Price Checker', hi: 'मूल्य जांच' },
    { key: 'trace', label: '🔗 Traceability', hi: 'ट्रैसेबिलिटी' },
  ];

  return (
    <section className="min-h-screen bg-[#f0f4ea] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a3010] to-[#243118] rounded-3xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-[#71873f] flex items-center justify-center text-2xl shadow-lg">🌾</div>
            <div>
              <h1 className="text-2xl font-extrabold">Farmer Portal</h1>
              <p className="text-sm text-emerald-300">{farmerData.name} • {farmerData.id} • {farmerData.district}</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm text-emerald-300 font-mono">Aadhaar e-KYC: {farmerData.aadhaar}</div>
            <div className="text-sm text-amber-300 font-mono">PM-KISAN: {farmerData.pmkisan}</div>
            <div className="text-xs text-slate-300 mt-1">Land: {farmerData.land}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-[#71873f] text-white shadow-md' : 'bg-white text-[#243118] border border-[#abbe99] hover:bg-[#f0f4ea]'}`}>
              {t(tab.label, tab.hi)}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'DBT Earned', val: '₹4,36,500', sub: 'SBIN0048291 Credited', color: 'emerald', icon: '💳' },
                { label: 'Active Crops', val: '2 Lots', sub: '1 Sold • 1 In Auction', color: 'amber', icon: '🌿' },
                { label: 'Next Slot', val: '08-Sep-25', sub: 'Karnal Yard • 10:00 AM', color: 'sky', icon: '🎫' },
                { label: 'Grade Average', val: 'Grade A', sub: 'Moisture Avg: 10.5%', color: 'purple', icon: '⭐' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-4 rounded-2xl`}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[11px] font-bold text-${c.color}-700`}>{c.label}</div>
                  <div className={`text-[10px] text-${c.color}-600 mt-0.5`}>{c.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#abbe99] p-5">
                <h3 className="font-extrabold text-sm text-[#243118] mb-3 border-b pb-2">🌾 My Registered Crops</h3>
                <div className="space-y-2 text-xs font-mono">
                  {farmerData.crops.map(c => (
                    <div key={c.name} className="flex justify-between items-center p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                      <div>
                        <div className="font-bold text-[#243118]">{c.name}</div>
                        <div className="text-[#637554]">{c.qty} Qtl • Grade {c.grade} • {c.moisture}% Moisture</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${c.status === 'SOLD' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('crops')} className="w-full mt-3 bg-[#71873f] hover:bg-[#688557] text-white py-2 rounded-xl text-xs font-bold transition-all">
                  + Add New Crop Declaration →
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#abbe99] p-5">
                <h3 className="font-extrabold text-sm text-[#243118] mb-3 border-b pb-2">🎫 Upcoming Mandi Slots</h3>
                <div className="space-y-2 text-xs font-mono">
                  {farmerData.slots.map(s => (
                    <div key={s.token} className="flex justify-between items-center p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                      <div>
                        <div className="font-bold text-[#243118]">#{s.token} — {s.mandi}</div>
                        <div className="text-[#637554]">{s.date} • {s.time}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
                <button onClick={openGatePassWithAuth} className="w-full mt-3 bg-[#a36627] hover:bg-[#804d19] text-white py-2 rounded-xl text-xs font-bold transition-all">
                  📅 Book New Mandi Slot →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CROPS TAB */}
        {activeTab === 'crops' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">🌿 My Crop Declarations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[...farmerData.crops, { name: 'Soyabean', qty: 120, grade: '—', moisture: '—', status: 'DECLARED', dbt: '—', utr: '—' }].map(c => (
                <div key={c.name} className="border border-[#abbe99] rounded-xl p-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-[#243118]">{c.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'SOLD' ? 'bg-emerald-100 text-emerald-700' : c.status === 'IN AUCTION' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'}`}>{c.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[#637554]">
                    <div><span className="text-[#243118] font-bold">Quantity:</span> {c.qty} Qtl</div>
                    <div><span className="text-[#243118] font-bold">Grade:</span> {c.grade}</div>
                    <div><span className="text-[#243118] font-bold">Moisture:</span> {c.moisture}%</div>
                    <div><span className="text-[#243118] font-bold">MSP:</span> ₹{MSP[c.name] || '—'}/Qtl</div>
                    <div><span className="text-[#243118] font-bold">DBT Amt:</span> {c.dbt}</div>
                    <div><span className="text-[#243118] font-bold">UTR:</span> {c.utr}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#f0f4ea] border border-[#71873f] rounded-xl p-4">
              <h4 className="font-bold text-sm text-[#243118] mb-2">+ Declare New Crop</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <select className="border border-[#abbe99] rounded-xl p-2.5 bg-white font-mono text-[#243118] focus:outline-none">
                  {CROPS.map(c => <option key={c}>{c}</option>)}
                </select>
                <input placeholder="Quantity (Qtl)" className="border border-[#abbe99] rounded-xl p-2.5 bg-white font-mono text-[#243118] focus:outline-none" />
                <input placeholder="Khasra / Plot No." className="border border-[#abbe99] rounded-xl p-2.5 bg-white font-mono text-[#243118] focus:outline-none" />
                <input placeholder="Sowing Date" type="date" className="border border-[#abbe99] rounded-xl p-2.5 bg-white font-mono text-[#243118] focus:outline-none" />
              </div>
              <button className="mt-3 bg-[#71873f] hover:bg-[#688557] text-white font-bold px-6 py-2 rounded-xl text-xs transition-all">Submit Declaration →</button>
            </div>
          </div>
        )}

        {/* SLOTS TAB */}
        {activeTab === 'slots' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
              <h3 className="font-extrabold text-base text-[#243118] mb-4">🎫 My Mandi Slots & QR Gate Passes</h3>
              <div className="space-y-3">
                {farmerData.slots.map(s => (
                  <div key={s.token} className="border border-[#abbe99] rounded-2xl p-4 flex items-center justify-between">
                    <div className="font-mono text-xs space-y-1">
                      <div className="font-extrabold text-sm text-[#243118]">Token #{s.token}</div>
                      <div className="text-[#637554]">🏪 {s.mandi}</div>
                      <div className="text-[#637554]">📅 {s.date} • ⏰ {s.time}</div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${s.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-20 h-20 bg-[#1a3010] rounded-xl flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-white" />
                      </div>
                      <button className="bg-[#71873f] text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={openGatePassWithAuth} className="w-full mt-4 bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-3 rounded-xl text-sm transition-all">
                📅 Book New Slot at Any Mandi Center →
              </button>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">💳 DBT Payment Tracker</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div className="text-emerald-700 font-bold uppercase text-[10px]">Total Received</div>
                <div className="text-2xl font-extrabold text-emerald-900">₹4,36,500</div>
                <div className="text-[10px] text-emerald-600">1 Transaction Cleared</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <div className="text-amber-700 font-bold uppercase text-[10px]">Pending Disbursement</div>
                <div className="text-2xl font-extrabold text-amber-900">₹4,76,000</div>
                <div className="text-[10px] text-amber-600">Mustard 80 Qtl • In Auction</div>
              </div>
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl">
                <div className="text-sky-700 font-bold uppercase text-[10px]">NPCI-DBT Status</div>
                <div className="text-lg font-extrabold text-sky-900">99.97% SLA</div>
                <div className="text-[10px] text-sky-600">Avg Credit: 36 Hours</div>
              </div>
            </div>
            <div className="space-y-2">
              {farmerData.payments.map(p => (
                <div key={p.utr} className="flex justify-between items-center p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60 text-xs font-mono">
                  <div>
                    <div className="font-bold text-[#243118]">{p.crop}</div>
                    <div className="text-[#637554]">UTR: {p.utr} • {p.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[#a36627]">{p.amt}</div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'CREDITED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRICE CHECKER TAB */}
        {activeTab === 'prices' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">📊 MSP vs Market Price Checker</h3>
            <div className="flex flex-wrap gap-2">
              {CROPS.map(c => (
                <button key={c} onClick={() => setSelectedCrop(c)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${selectedCrop === c ? 'bg-[#71873f] text-white' : 'bg-white text-[#637554] border-[#abbe99] hover:border-[#71873f]'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#f0f4ea] border border-[#71873f] p-4 rounded-xl text-center">
                <div className="text-[10px] text-[#637554] font-bold uppercase">GOI MSP Rate</div>
                <div className="text-3xl font-extrabold text-[#243118]">₹{(MSP[selectedCrop] || 2425).toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-[#71873f]">per Quintal (2025–26)</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
                <div className="text-[10px] text-amber-700 font-bold uppercase">Current Mandi Rate</div>
                <div className="text-3xl font-extrabold text-amber-900">₹{((MSP[selectedCrop] || 2425) + Math.floor(Math.random() * 200 + 50)).toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-amber-600">Karnal APMC • Live</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">Best Buyer Offer</div>
                <div className="text-3xl font-extrabold text-emerald-900">₹{((MSP[selectedCrop] || 2425) + Math.floor(Math.random() * 250 + 100)).toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-emerald-600">Punjab Agri Corp (48h valid)</div>
              </div>
            </div>
          </div>
        )}

        {/* TRACEABILITY TAB */}
        {activeTab === 'trace' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">🔗 Crop Blockchain Traceability Journey</h3>
            <div className="space-y-0">
              {[
                { step: 1, title: 'Farm Origin Declared', detail: 'Khasra 48/2, Karnal, HR — Gurpreet Singh', hash: '0x4f82...1a2b', ts: '01-Sep-2025 06:00 AM', done: true },
                { step: 2, title: 'Mandi Slot Booked', detail: 'Karnal Central Yard, Lane 4 — Token #HR-KRN-4829', hash: '0x8c14...9d3e', ts: '04-Sep-2025 10:12 AM', done: true },
                { step: 3, title: 'AI Quality Assay Passed', detail: 'NIR: 10.8% Moisture — Grade A FAQ', hash: '0xe7a2...4f1c', ts: '08-Sep-2025 11:02 AM', done: true },
                { step: 4, title: 'Weighment Recorded', detail: 'Net: 5,800 kg (58 Qtl) — Tola Parchi TP-KRN-4829', hash: '0x2b91...8e4d', ts: '08-Sep-2025 11:45 AM', done: true },
                { step: 5, title: 'Accepted by Buyer', detail: 'Punjab Agri Corp — eNAM Contract #NC-4829', hash: '0x1d4f...3c8a', ts: '08-Sep-2025 01:20 PM', done: true },
                { step: 6, title: 'DBT Credited to Bank', detail: 'SBI A/C XXXX4892 — ₹4,36,500 — UTR SBIN0048291', hash: '0x9e3c...7b2f', ts: '10-Sep-2025 09:30 AM', done: true },
              ].map((s, i, arr) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow ${s.done ? 'bg-[#71873f]' : 'bg-[#abbe99]'}`}>{s.step}</div>
                    {i < arr.length - 1 && <div className="w-0.5 h-10 bg-[#abbe99]"></div>}
                  </div>
                  <div className="pb-5 text-xs font-mono">
                    <div className="font-extrabold text-[#243118]">{s.title}</div>
                    <div className="text-[#637554]">{s.detail}</div>
                    <div className="flex gap-3 mt-0.5 flex-wrap">
                      <span className="text-emerald-700 font-bold">{s.hash}</span>
                      <span className="text-[#637554] text-[10px]">{s.ts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
