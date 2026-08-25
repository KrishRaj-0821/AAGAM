import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const STOCK = [
  { crop: 'Wheat (FAQ)', lotId: 'WH-WHT-001', qty: 18400, block: 'A', date: '15-Aug-2025', enwr: 'WH-NWR-001' },
  { crop: 'Paddy Basmati', lotId: 'WH-PAD-042', qty: 9200, block: 'B', date: '18-Aug-2025', enwr: 'WH-NWR-042' },
  { crop: 'Chana Desi', lotId: 'WH-CHN-018', qty: 3200, block: 'C', date: '20-Aug-2025', enwr: 'WH-NWR-018' },
  { crop: 'Mustard Bold', lotId: 'WH-MST-009', qty: 1840, block: 'A', date: '22-Aug-2025', enwr: 'WH-NWR-009' },
];

export default function WarehousePortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stock, setStock] = useState(STOCK);
  const [inwardForm, setInwardForm] = useState({ lot: '', qty: '', block: 'A', date: '' });

  const addInward = () => {
    if (!inwardForm.lot || !inwardForm.qty) return;
    setStock(s => [...s, {
      crop: inwardForm.lot, lotId: `WH-NEW-${Date.now()}`, qty: parseInt(inwardForm.qty),
      block: inwardForm.block, date: inwardForm.date || new Date().toLocaleDateString('en-IN'),
      enwr: `WH-NWR-${Math.floor(Math.random() * 9999)}`
    }]);
    setInwardForm({ lot: '', qty: '', block: 'A', date: '' });
  };

  const totalStock = stock.reduce((a, s) => a + s.qty, 0);
  const totalCapacity = 48000;
  const pct = Math.round((totalStock / totalCapacity) * 100);

  const tabs = [
    { key: 'dashboard', label: '🏭 Dashboard', hi: 'डैशबोर्ड' },
    { key: 'inventory', label: '📦 Stock Ledger', hi: 'स्टॉक लेजर' },
    { key: 'inward', label: '⬇ Stock Inward', hi: 'स्टॉक इन' },
    { key: 'outward', label: '⬆ Stock Outward', hi: 'स्टॉक आउट' },
    { key: 'enwr', label: '📜 e-NWR Receipts', hi: 'ई-एनडब्ल्यूआर' },
    { key: 'alerts', label: '🚨 Capacity Alerts', hi: 'क्षमता चेतावनी' },
  ];

  return (
    <section className="min-h-screen bg-[#f5f2fb] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-[#2d1464] to-[#4a24a8] rounded-3xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
            <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl shadow-lg">🏭</div>
            <div>
              <h1 className="text-2xl font-extrabold">Warehouse Manager Portal</h1>
              <p className="text-sm text-purple-300">{currentUser?.name || 'Manager Deepak Sharma'} • FCI Granary Karnal — WDRA Certified</p>
            </div>
          </div>
          <div className="text-right hidden md:block font-mono text-sm">
            <div className="text-purple-200">Total: <span className="text-white font-bold">48,000 MT Capacity</span></div>
            <div className="text-purple-200">Used: <span className="text-white font-bold">{totalStock.toLocaleString('en-IN')} MT ({pct}%)</span></div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-purple-700 text-white shadow-md' : 'bg-white text-[#243118] border border-[#abbe99] hover:bg-purple-50'}`}>
              {t(tab.label, tab.hi)}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Stock', val: `${(totalStock / 1000).toFixed(1)}K MT`, sub: `${pct}% of 48,000 MT`, color: 'purple', icon: '📦' },
                { label: 'Active e-NWR', val: `${stock.length} Lots`, sub: 'WDRA Registry Linked', color: 'sky', icon: '📜' },
                { label: 'Inward Today', val: '2,400 MT', sub: 'From Karnal + Khanna', color: 'emerald', icon: '⬇' },
                { label: 'Released Today', val: '1,200 MT', sub: 'To FCI Delhi Buffer', color: 'amber', icon: '⬆' },
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
              <h3 className="font-extrabold text-sm text-[#243118] mb-3">Block-wise Capacity</h3>
              {['A', 'B', 'C'].map(b => {
                const blockStock = stock.filter(s => s.block === b).reduce((a, s) => a + s.qty, 0);
                const blockCap = 16000;
                const bPct = Math.round((blockStock / blockCap) * 100);
                return (
                  <div key={b} className="mb-3 text-xs font-mono">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-[#243118]">Block {b}</span>
                      <span className={`${bPct > 85 ? 'text-red-600 font-bold' : 'text-[#637554]'}`}>{blockStock.toLocaleString('en-IN')} / {blockCap.toLocaleString('en-IN')} MT ({bPct}%)</span>
                    </div>
                    <div className="w-full bg-[#e0e8d6] rounded-full h-3">
                      <div className={`h-3 rounded-full ${bPct > 85 ? 'bg-red-500' : 'bg-purple-600'}`} style={{ width: `${bPct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STOCK LEDGER */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📦 Current Stock Ledger</h3>
            <div className="space-y-2 text-xs font-mono">
              {stock.map(s => (
                <div key={s.lotId} className="flex items-center justify-between p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div>
                    <div className="font-bold text-[#243118]">{s.lotId} — {s.crop}</div>
                    <div className="text-[#637554]">Block {s.block} • Inward: {s.date} • e-NWR: {s.enwr}</div>
                  </div>
                  <div className="font-extrabold text-purple-700">{s.qty.toLocaleString('en-IN')} MT</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STOCK INWARD */}
        {activeTab === 'inward' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4 max-w-lg mx-auto">
            <h3 className="font-extrabold text-base text-[#243118]">⬇ Log Stock Inward</h3>
            <div className="space-y-3 text-xs font-mono">
              {[
                { label: 'Crop / Lot Name', key: 'lot', placeholder: 'e.g. Wheat FAQ' },
                { label: 'Quantity (MT)', key: 'qty', placeholder: 'e.g. 1200' },
                { label: 'Inward Date', key: 'date', type: 'date' },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="font-bold text-[#243118]">{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.placeholder}
                    value={inwardForm[f.key]} onChange={e => setInwardForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-[#abbe99] rounded-xl p-2.5 font-mono text-[#243118] focus:outline-none focus:border-purple-500" />
                </div>
              ))}
              <div className="space-y-1">
                <label className="font-bold text-[#243118]">Storage Block</label>
                <select value={inwardForm.block} onChange={e => setInwardForm(p => ({ ...p, block: e.target.value }))}
                  className="w-full border border-[#abbe99] rounded-xl p-2.5 bg-white text-[#243118] focus:outline-none focus:border-purple-500">
                  {['A', 'B', 'C'].map(b => <option key={b}>Block {b}</option>)}
                </select>
              </div>
              <button onClick={addInward} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 rounded-xl transition-all">
                📜 Log Inward & Auto-Generate e-NWR
              </button>
            </div>
          </div>
        )}

        {/* STOCK OUTWARD */}
        {activeTab === 'outward' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">⬆ Stock Release / Outward</h3>
            <div className="space-y-2 text-xs font-mono">
              {[
                { lot: 'WH-WHT-001', to: 'FCI Delhi Buffer Store', qty: '1,200 MT', date: '25-Aug-2025', utr: 'FCI-2025-48291', status: 'RELEASED' },
                { lot: 'WH-PAD-042', to: 'NAFED Export Terminal', qty: '800 MT', date: '24-Aug-2025', utr: 'NAFED-2025-88210', status: 'RELEASED' },
                { lot: 'WH-CHN-018', to: 'Pending — Buyer Confirmation', qty: '400 MT', date: '—', utr: '—', status: 'PENDING' },
              ].map(r => (
                <div key={r.lot} className="flex justify-between p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div>
                    <div className="font-bold text-[#243118]">{r.lot} → {r.to}</div>
                    <div className="text-[#637554]">{r.qty} • {r.date} • UTR: {r.utr}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'RELEASED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* e-NWR */}
        {activeTab === 'enwr' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📜 Electronic Negotiable Warehouse Receipts (e-NWR)</h3>
            <div className="space-y-2 text-xs font-mono">
              {stock.map(s => (
                <div key={s.enwr} className="flex justify-between p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div>
                    <div className="font-bold text-[#243118]">{s.enwr} — {s.crop} ({s.lotId})</div>
                    <div className="text-[#637554]">Block {s.block} • {s.qty.toLocaleString('en-IN')} MT • WDRA Certified</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold text-[10px]">✓ ACTIVE</span>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">⬇ PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {[
              { level: 'WARNING', block: 'Block B', msg: 'Block B at 57.5% capacity. Expected to reach 80% in 3 days based on current inward rate.', action: 'Plan transfer to Block C or request new allocation.' },
              { level: 'INFO', block: 'Block A', msg: 'Block A at 51.25% capacity. Normal operations, no action needed.', action: 'Continue monitoring.' },
              { level: 'OK', block: 'Block C', msg: 'Block C at 20% capacity. Ample space available for upcoming harvests.', action: 'Pre-book this block for Kharif season arrivals.' },
            ].map(a => (
              <div key={a.block} className={`rounded-2xl border p-4 text-xs font-mono ${a.level === 'WARNING' ? 'bg-amber-50 border-amber-300' : a.level === 'INFO' ? 'bg-sky-50 border-sky-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className={`font-extrabold text-sm mb-1 ${a.level === 'WARNING' ? 'text-amber-800' : a.level === 'INFO' ? 'text-sky-700' : 'text-emerald-700'}`}>
                  {a.level === 'WARNING' ? '⚠️' : a.level === 'INFO' ? 'ℹ️' : '✅'} [{a.level}] {a.block}
                </div>
                <div className="text-[#637554]">{a.msg}</div>
                <div className="font-bold text-[#243118] mt-1">Action: {a.action}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
