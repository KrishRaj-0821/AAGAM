import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';

const PENDING_SAMPLES = [
  { id: 'QI-4829', farmer: 'Gurpreet Singh', crop: 'Wheat (Sharbati)', qty: 180, moisture: null, protein: null, fm: null, status: 'PENDING' },
  { id: 'QI-4830', farmer: 'Sukhwinder Singh', crop: 'Mustard Bold', qty: 80, moisture: 8.2, protein: 22.4, fm: 1.2, status: 'PASSED' },
  { id: 'QI-4831', farmer: 'Amarjit Kaur', crop: 'Paddy Basmati', qty: 220, moisture: 14.2, protein: 7.1, fm: 2.8, status: 'FAILED' },
  { id: 'QI-4832', farmer: 'Ramesh Sharma', crop: 'Chana Desi', qty: 60, moisture: null, protein: null, fm: null, status: 'PENDING' },
];

export default function QualityPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [samples, setSamples] = useState(PENDING_SAMPLES);
  const [nirInput, setNirInput] = useState({ id: '', moisture: '', protein: '', fm: '' });

  const submitNIR = () => {
    if (!nirInput.id) return;
    const m = parseFloat(nirInput.moisture), p = parseFloat(nirInput.protein), f = parseFloat(nirInput.fm);
    const passed = m <= 12 && f <= 2;
    setSamples(s => s.map(x => x.id === nirInput.id ? { ...x, moisture: m, protein: p, fm: f, status: passed ? 'PASSED' : 'FAILED' } : x));
    setNirInput({ id: '', moisture: '', protein: '', fm: '' });
  };

  const tabs = [
    { key: 'dashboard', label: '🔬 Dashboard', hi: 'डैशबोर्ड' },
    { key: 'nir', label: '📡 NIR Assay Entry', hi: 'NIR जांच' },
    { key: 'queue', label: '📋 Inspection Queue', hi: 'निरीक्षण कतार' },
    { key: 'reports', label: '📄 Lab Reports', hi: 'लैब रिपोर्ट' },
    { key: 'deviation', label: '📊 AI vs Manual', hi: 'AI विचलन' },
  ];

  return (
    <section className="min-h-screen bg-[#f0fbf4] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-[#064e2d] to-[#0d7a4a] rounded-3xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl shadow-lg">🔬</div>
            <div>
              <h1 className="text-2xl font-extrabold">Quality Inspector Portal</h1>
              <p className="text-sm text-emerald-300">{currentUser?.name || 'Inspector Raj Kumar'} • ICAR Certified • Karnal Central Yard</p>
            </div>
          </div>
          <div className="text-right hidden md:block font-mono text-sm">
            <div className="text-emerald-200">Tests Today: <span className="text-white font-bold">1,240</span></div>
            <div className="text-emerald-200">Grade A: <span className="text-white font-bold">94.2% Pass Rate</span></div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-[#243118] border border-[#abbe99] hover:bg-emerald-50'}`}>
              {t(tab.label, tab.hi)}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'NIR Tests Done', val: '1,240', sub: 'Avg 45 sec/sample', color: 'emerald', icon: '📡' },
                { label: 'Grade A Passed', val: '1,168', sub: '94.2% pass rate', color: 'sky', icon: '✅' },
                { label: 'Moisture Avg', val: '10.4%', sub: 'Threshold: ≤12%', color: 'amber', icon: '💧' },
                { label: 'AI vs Manual Match', val: '98.7%', sub: 'Deviation: <0.3%', color: 'purple', icon: '🤖' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-4 rounded-2xl`}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[11px] font-bold text-${c.color}-700`}>{c.label}</div>
                  <div className={`text-[10px] text-${c.color}-600 mt-0.5`}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#abbe99] p-4 text-xs font-mono">
              <h4 className="font-extrabold text-[#243118] mb-2">NIR Spectroscopy Calibration Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Sensor Bandwidth', val: '950nm – 1650nm', ok: true },
                  { label: 'Last Calibration', val: '45 minutes ago', ok: true },
                  { label: 'Temperature', val: '24.2°C (within range)', ok: true },
                  { label: 'AI Model Version', val: 'AgriVision v3.1 (ICAR)', ok: true },
                ].map(s => (
                  <div key={s.label} className="p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60 flex justify-between">
                    <span className="text-[#637554]">{s.label}:</span>
                    <span className={`font-bold ${s.ok ? 'text-emerald-700' : 'text-red-600'}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NIR ASSAY ENTRY */}
        {activeTab === 'nir' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4 max-w-lg mx-auto">
            <h3 className="font-extrabold text-base text-[#243118]">📡 NIR Moisture & Quality Entry</h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="font-bold text-[#243118]">Sample ID / QI Token</label>
                <select value={nirInput.id} onChange={e => setNirInput(p => ({ ...p, id: e.target.value }))}
                  className="w-full border border-[#abbe99] rounded-xl p-2.5 text-[#243118] focus:outline-none focus:border-emerald-500 bg-white">
                  <option value="">— Select Sample —</option>
                  {samples.filter(s => s.status === 'PENDING').map(s => <option key={s.id} value={s.id}>{s.id} — {s.farmer} ({s.crop})</option>)}
                </select>
              </div>
              {[
                { key: 'moisture', label: 'Moisture Content (%)', placeholder: 'e.g. 10.8 (PASS if ≤12%)', limit: '≤12%' },
                { key: 'protein', label: 'Protein Content (%)', placeholder: 'e.g. 11.2 (PASS if ≥10%)', limit: '≥10%' },
                { key: 'fm', label: 'Foreign Matter (%)', placeholder: 'e.g. 0.8 (PASS if ≤2%)', limit: '≤2%' },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="font-bold text-[#243118] flex justify-between">{f.label} <span className="text-[#637554] font-normal">Threshold: {f.limit}</span></label>
                  <input type="number" step="0.1" placeholder={f.placeholder}
                    value={nirInput[f.key]} onChange={e => setNirInput(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-[#abbe99] rounded-xl p-2.5 font-mono text-[#243118] focus:outline-none focus:border-emerald-500" />
                </div>
              ))}
              <button onClick={submitNIR} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl transition-all">
                📡 Submit NIR Assay Result & Grade Automatically
              </button>
            </div>
          </div>
        )}

        {/* INSPECTION QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-3">
            <h3 className="font-extrabold text-base text-[#243118]">📋 Inspection Queue — All Samples</h3>
            {samples.map(s => (
              <div key={s.id} className="border border-[#abbe99] rounded-2xl p-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="font-mono text-xs">
                    <div className="font-extrabold text-sm text-[#243118]">{s.id} — {s.farmer}</div>
                    <div className="text-[#637554]">🌾 {s.crop} • {s.qty} Qtl</div>
                    {s.moisture && (
                      <div className="mt-1 flex gap-3 text-[10px]">
                        <span>Moisture: <strong className={s.moisture <= 12 ? 'text-emerald-700' : 'text-red-600'}>{s.moisture}%</strong></span>
                        <span>Protein: <strong>{s.protein}%</strong></span>
                        <span>FM: <strong className={s.fm <= 2 ? 'text-emerald-700' : 'text-red-600'}>{s.fm}%</strong></span>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${s.status === 'PASSED' ? 'bg-emerald-100 text-emerald-700' : s.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {s.status === 'PASSED' ? '✓ GRADE A' : s.status === 'FAILED' ? '✗ REJECTED' : '⏳ PENDING NIR'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📄 Quality Lab Reports</h3>
            <div className="space-y-2 text-xs font-mono">
              {samples.filter(s => s.status !== 'PENDING').map(s => (
                <div key={s.id} className="flex justify-between p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div>
                    <div className="font-bold text-[#243118]">Report {s.id} — {s.farmer} ({s.crop})</div>
                    <div className="text-[#637554]">Moisture: {s.moisture}% • Protein: {s.protein}% • FM: {s.fm}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'PASSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{s.status}</span>
                    <button className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">⬇ PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI VS MANUAL */}
        {activeTab === 'deviation' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">📊 AI AgriVision vs Manual Inspector Agreement</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              {[
                { label: 'Total Samples Compared', val: '1,240', color: 'sky' },
                { label: 'AI-Manual Agreement', val: '1,224 (98.7%)', color: 'emerald' },
                { label: 'Deviations Flagged', val: '16 Lots', color: 'amber' },
                { label: 'Manual Override Used', val: '16 Times', color: 'purple' },
                { label: 'Avg Moisture Delta', val: '0.28%', color: 'emerald' },
                { label: 'AI Model Accuracy', val: '99.1% ICAR', color: 'sky' },
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
