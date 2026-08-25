import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, ScanLine } from 'lucide-react';

const QUEUE = [
  { pos: 1, token: 'HR-KRN-4829', farmer: 'Gurpreet Singh', crop: 'Wheat 180 Qtl', vehicle: 'HR-10-AB-1234', arrived: '09:58 AM', lane: '4A' },
  { pos: 2, token: 'HR-KRN-4830', farmer: 'Sukhwinder Singh', crop: 'Mustard 80 Qtl', vehicle: 'PB-10-ZZ-9921', arrived: '10:02 AM', lane: '4A' },
  { pos: 3, token: 'HR-KRN-4831', farmer: 'Amarjit Kaur', crop: 'Wheat 220 Qtl', vehicle: 'HR-14-BB-4821', arrived: '10:08 AM', lane: '4B' },
];

export default function OperatorPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [queue, setQueue] = useState(QUEUE);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const scan = () => {
    const found = QUEUE.find(q => q.token.toLowerCase().includes(scanInput.toLowerCase()) || q.farmer.toLowerCase().includes(scanInput.toLowerCase()));
    setScanResult(found ? { ...found, valid: true } : { valid: false });
    setScanInput('');
  };

  const advance = (token) => setQueue(q => q.filter(x => x.token !== token));

  const tabs = [
    { key: 'dashboard', label: '🏪 Dashboard', hi: 'डैशबोर्ड' },
    { key: 'scanner', label: '📷 QR Scanner', hi: 'QR स्कैनर' },
    { key: 'queue', label: '🚦 Live Queue', hi: 'लाइव कतार' },
    { key: 'weighment', label: '⚖️ Weighment Entry', hi: 'तौल प्रविष्टि' },
    { key: 'summary', label: '📊 Day Summary', hi: 'दिवसीय सारांश' },
  ];

  return (
    <section className="min-h-screen bg-[#f4f8f0] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-[#1a3010] to-[#2d5018] rounded-3xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
            <div className="w-14 h-14 rounded-2xl bg-[#71873f] flex items-center justify-center text-2xl shadow-lg">🏪</div>
            <div>
              <h1 className="text-2xl font-extrabold">Mandi Center Operator</h1>
              <p className="text-sm text-emerald-300">{currentUser?.name || 'Operator Rakesh Kumar'} • Karnal Central Grain Yard • Haryana</p>
            </div>
          </div>
          <div className="text-right hidden md:block font-mono text-sm">
            <div className="text-emerald-200">Queue: <span className="text-white font-bold">{queue.length} Trucks Waiting</span></div>
            <div className="text-emerald-200">Weighments Done: <span className="text-white font-bold">1,280 Today</span></div>
          </div>
        </div>

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'QR Scans Today', val: '1,276', sub: '99.4% valid', color: 'emerald', icon: '📷' },
              { label: 'Weighments Done', val: '1,280', sub: 'Avg 2.4 min/truck', color: 'amber', icon: '⚖️' },
              { label: 'Tola Parchis Issued', val: '1,280', sub: '100% Digital', color: 'sky', icon: '🧾' },
              { label: 'Current Queue', val: `${queue.length} Trucks`, sub: 'Avg wait 42 min', color: 'red', icon: '🚦' },
            ].map(c => (
              <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-4 rounded-2xl`}>
                <div className="text-2xl mb-1">{c.icon}</div>
                <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
                <div className={`text-[11px] font-bold text-${c.color}-700`}>{c.label}</div>
                <div className={`text-[10px] text-${c.color}-600 mt-0.5`}>{c.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* QR SCANNER */}
        {activeTab === 'scanner' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4 max-w-lg mx-auto">
            <h3 className="font-extrabold text-base text-[#243118]">📷 QR Token Scanner Terminal</h3>
            <div className="bg-[#1a3010] rounded-2xl flex items-center justify-center h-36">
              <div className="text-center text-white">
                <ScanLine className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                <div className="text-xs font-bold">Camera QR Scanner Active</div>
                <div className="text-[10px] text-emerald-300">Point at farmer's Gate Pass QR code</div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                placeholder="Or type Token # / Farmer Name..."
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && scan()}
                className="flex-1 border border-[#abbe99] rounded-xl p-2.5 text-xs font-mono text-[#243118] focus:outline-none focus:border-[#71873f]"
              />
              <button onClick={scan} className="bg-[#71873f] hover:bg-[#688557] text-white font-bold px-4 py-2.5 rounded-xl text-xs">Scan</button>
            </div>
            {scanResult && (
              <div className={`p-4 rounded-2xl border-2 text-xs font-mono space-y-1 ${scanResult.valid ? 'bg-emerald-50 border-emerald-400' : 'bg-red-50 border-red-400'}`}>
                {scanResult.valid ? (
                  <>
                    <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm"><CheckCircle2 className="w-5 h-5" /> TOKEN VALID — GATE OPEN</div>
                    <div>Farmer: <strong>{scanResult.farmer}</strong></div>
                    <div>Token: <strong>{scanResult.token}</strong> • Vehicle: {scanResult.vehicle}</div>
                    <div>Crop: <strong>{scanResult.crop}</strong> • Lane: {scanResult.lane}</div>
                    <button onClick={() => advance(scanResult.token)} className="mt-2 bg-emerald-600 text-white px-4 py-1.5 rounded-xl font-bold">Mark Entered → Send to Weighbridge</button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-red-700 font-extrabold"><XCircle className="w-5 h-5" /> INVALID TOKEN — DENY ENTRY</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* LIVE QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-3">
            <h3 className="font-extrabold text-base text-[#243118]">🚦 Live Yard Queue — {queue.length} Trucks Waiting</h3>
            {queue.length === 0 ? (
              <div className="text-center py-8 text-[#71873f] font-bold">✓ Queue Clear — No trucks waiting</div>
            ) : queue.map((t, i) => (
              <div key={t.token} className="flex items-center justify-between p-4 border border-[#abbe99] rounded-2xl">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="w-8 h-8 rounded-full bg-[#71873f] text-white flex items-center justify-center font-extrabold text-sm">{t.pos}</div>
                  <div>
                    <div className="font-extrabold text-[#243118]">#{t.token} — {t.farmer}</div>
                    <div className="text-[#637554]">{t.crop} • {t.vehicle} • Lane {t.lane}</div>
                    <div className="text-[10px] text-[#637554]">Arrived: {t.arrived}</div>
                  </div>
                </div>
                <button onClick={() => advance(t.token)} className="bg-[#71873f] hover:bg-[#688557] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
                  Advance →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* WEIGHMENT */}
        {activeTab === 'weighment' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4 max-w-lg mx-auto">
            <h3 className="font-extrabold text-base text-[#243118]">⚖️ Digital Weighment Entry Terminal</h3>
            <div className="space-y-3 text-xs font-mono">
              {[
                { label: 'Token / Tola Parchi No.', placeholder: 'e.g. HR-KRN-4829' },
                { label: 'Gross Weight (kg)', placeholder: 'e.g. 12600' },
                { label: 'Tare Weight (kg)', placeholder: 'e.g. 6800' },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <label className="font-bold text-[#243118]">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full border border-[#abbe99] rounded-xl p-2.5 font-mono text-[#243118] focus:outline-none focus:border-[#71873f]" />
                </div>
              ))}
              <div className="bg-[#f0f4ea] border border-[#71873f] p-3 rounded-xl">
                <div className="font-bold text-[#243118]">Calculated Net Weight:</div>
                <div className="text-2xl font-extrabold text-[#a36627]">5,800 kg = <span className="text-[#71873f]">58 Quintals</span></div>
              </div>
              <button className="w-full bg-[#71873f] hover:bg-[#688557] text-white font-extrabold py-3 rounded-xl transition-all">
                🧾 Issue Digital Tola Parchi & Blockchain Hash
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">📊 Day Summary — 25 Aug 2025</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              {[
                { label: 'Total Arrivals', val: '14,800 MT', color: 'emerald' },
                { label: 'Wheat', val: '8,200 MT (55%)', color: 'amber' },
                { label: 'Paddy', val: '4,200 MT (28%)', color: 'sky' },
                { label: 'Revenue Booked', val: '₹42.8 Cr', color: 'purple' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-3 rounded-xl text-center`}>
                  <div className={`text-base font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[10px] text-${c.color}-700 font-bold uppercase`}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
