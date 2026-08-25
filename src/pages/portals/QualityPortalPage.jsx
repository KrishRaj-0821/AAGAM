import React, { useState } from 'react';
import { 
  ChevronLeft, Microscope, CheckCircle2, XCircle, AlertTriangle, FileText, 
  RotateCcw, History, Bell, BarChart3, Search, Filter, Camera, ShieldCheck, 
  Sparkles, Check, ArrowRight, Layers, Lock, Download
} from 'lucide-react';

export default function QualityPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Inspection Queue & Lots
  const [inspectionQueue, setInspectionQueue] = useState([
    { id: 'INSP-8821', lotId: 'LOT-2026-00045', crop: 'Wheat (Sharbati)', farmer: 'Gurpreet Singh', qty: '5,000 KG', mandi: 'Karnal Yard', arrival: '25 Aug 2026, 09:30 AM', status: 'SAMPLE COLLECTED', sampleId: 'SMP-88210', sampleQty: '2 KG' },
    { id: 'INSP-8822', lotId: 'LOT-2026-00046', crop: 'Paddy (Basmati)', farmer: 'Amarjit Kaur', qty: '8,000 KG', mandi: 'Khanna APMC', arrival: '25 Aug 2026, 10:15 AM', status: 'WAITING', sampleId: '—', sampleQty: '—' },
    { id: 'INSP-8823', lotId: 'LOT-2026-00047', crop: 'Mustard (Bold)', farmer: 'Ramesh Sharma', qty: '3,500 KG', mandi: 'Bharatpur Yard', arrival: '25 Aug 2026, 11:00 AM', status: 'UNDER TESTING', sampleId: 'SMP-88212', sampleQty: '1.5 KG' },
    { id: 'INSP-8824', lotId: 'LOT-2026-00040', crop: 'Chana (Desi)', farmer: 'Vijay Patil', qty: '2,000 KG', mandi: 'Latur APMC', arrival: '24 Aug 2026, 02:00 PM', status: 'FAILED', grade: 'REJECTED', sampleId: 'SMP-88200', sampleQty: '2 KG' },
  ]);

  // Inspection Testing Form state
  const [testForm, setTestForm] = useState({
    inspId: 'INSP-8821',
    moisture: '10.8',
    foreignMatter: '0.4',
    damagedGrains: '1.1',
    brokenGrains: '0.8',
    insectDamage: '0.0',
    remarks: 'Produce meets GOI FAQ Grade A moisture and purity standards.',
  });

  // Passed & Completed Inspection Reports
  const [completedReports, setCompletedReports] = useState([
    { id: 'REP-7701', lotId: 'LOT-2026-00038', crop: 'Wheat (Sharbati)', farmer: 'Sukhwinder Singh', qty: '6,200 KG', grade: 'GRADE A', moisture: '10.5%', fm: '0.3%', result: 'PASSED', date: '24 Aug 2026', inspector: 'Dr. Anita Roy' },
    { id: 'REP-7702', lotId: 'LOT-2026-00039', crop: 'Paddy Basmati', farmer: 'Harpreet Singh', qty: '4,500 KG', grade: 'GRADE B', moisture: '11.8%', fm: '0.8%', result: 'PASSED', date: '24 Aug 2026', inspector: 'Dr. Anita Roy' },
    { id: 'REP-7703', lotId: 'LOT-2026-00040', crop: 'Chana Desi', farmer: 'Vijay Patil', qty: '2,000 KG', grade: 'REJECTED', moisture: '14.8%', fm: '2.8%', result: 'FAILED', date: '24 Aug 2026', inspector: 'Dr. Anita Roy', reason: 'Excessive Moisture (>12%) & High Contamination' },
  ]);

  // Reinspection / Disputes
  const [disputes, setDisputes] = useState([
    { disputeId: 'DSP-101', origInsp: 'INSP-8824', lotId: 'LOT-2026-00040', farmer: 'Vijay Patil', crop: 'Chana Desi', origGrade: 'REJECTED', reason: 'Farmer disputes 14.8% moisture reading; claims re-dried.', status: 'REINSPECTION SCHEDULED' }
  ]);

  // Farmer Quality History
  const [farmerHistory, setFarmerHistory] = useState([
    { farmer: 'Gurpreet Singh', crop: 'Wheat', lotId: 'LOT-001', grade: 'GRADE A', moisture: '10.5%', status: 'PASSED' },
    { farmer: 'Gurpreet Singh', crop: 'Rice', lotId: 'LOT-012', grade: 'GRADE B', moisture: '11.4%', status: 'PASSED' },
    { farmer: 'Vijay Patil', crop: 'Chana Desi', lotId: 'LOT-040', grade: 'REJECTED', moisture: '14.8%', status: 'FAILED' },
  ]);

  const submitQualityGrade = () => {
    const m = parseFloat(testForm.moisture);
    const fm = parseFloat(testForm.foreignMatter);
    const pass = m <= 12.0 && fm <= 1.0;
    const assignedGrade = pass ? (m <= 11.0 ? 'GRADE A' : 'GRADE B') : 'REJECTED';

    setInspectionQueue(prev => prev.map(item => item.id === testForm.inspId ? { ...item, status: pass ? 'PASSED' : 'FAILED', grade: assignedGrade } : item));
    alert(`🔬 Inspection Report & NIR Assay Finalized!\n\nFinal Grade Assigned: ${assignedGrade}\nResult: ${pass ? 'PASSED ✓' : 'REJECTED ✗'}\n\nReport is now LOCKED and READ-ONLY.`);
  };

  // Nav Items list matching user specification (15 items)
  const navItems = [
    { key: 'dashboard', label: '📊 Dashboard', icon: Microscope },
    { key: 'queue', label: '📋 Inspection Queue', icon: Layers },
    { key: 'assigned', label: '🔍 Assigned Lots', icon: Search },
    { key: 'sampling', label: '🧪 Sample Collection', icon: Camera },
    { key: 'testing', label: '📡 Quality Testing (NIR)', icon: Sparkles },
    { key: 'grading', label: '⭐ Grade Assignment', icon: CheckCircle2 },
    { key: 'reports', label: '📄 Formal Inspection Reports', icon: FileText },
    { key: 'disputes', label: '🔄 Reinspection & Disputes', icon: RotateCcw },
    { key: 'history', label: '📜 Farmer Quality History', icon: History },
    { key: 'alerts', label: '🚨 Quality Alerts', icon: AlertTriangle },
    { key: 'evidence', label: '📷 Documents & Evidence', icon: Camera },
    { key: 'analytics', label: '📈 Quality Analytics', icon: BarChart3 },
    { key: 'notifications', label: '🔔 Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#f0fbf4] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#083c22] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">ICAR CERTIFIED</span>
          <span>AAGAM National Automated Grain Quality & NIR Assay Terminal</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Inspector: <strong className="text-emerald-300">{currentUser?.name || 'Dr. Anita Roy'}</strong></span>
          <span className="text-emerald-400">Pass Rate: 88% Today</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* Sidebar Navigation (Responsive Horizontal Scroll on Mobile, Vertical Sidebar on Desktop) */}
        <aside className="w-full md:w-64 bg-[#052816] text-slate-200 p-3 md:p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 border-b md:border-b-0 md:border-r border-emerald-900 shadow-xl gap-1 md:space-y-1">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-800/80 mb-2">
            QUALITY INSPECTOR NAVIGATION
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex md:w-full items-center gap-2 px-3 py-2 md:py-2.5 rounded-xl font-bold text-xs transition-all text-left whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                    : 'hover:bg-emerald-900/60 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="hidden md:block pt-4 border-t border-emerald-800/80 mt-4">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Portal Home</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#f6fcf8]">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#052816]">QUALITY INSPECTOR DASHBOARD</h2>
                  <p className="text-xs text-[#637554]">Real-time overview of produce sampling, testing, and grading activities</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  NIR Sensor Band: 950nm–1650nm (Active)
                </span>
              </div>

              {/* Quality Inspector Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 font-mono text-xs">
                {[
                  { label: 'Pending Inspections', val: '24 Lots', color: 'indigo' },
                  { label: 'Today Inspections', val: '18 Lots', color: 'emerald' },
                  { label: 'Passed Lots', val: '14 Lots', color: 'emerald' },
                  { label: 'Rejected Lots', val: '3 Lots', color: 'rose' },
                  { label: 'Reinspection Req.', val: '2 Requests', color: 'amber' },
                  { label: 'Grade A Lots', val: '8 Lots', color: 'emerald' },
                  { label: 'Grade B Lots', val: '5 Lots', color: 'sky' },
                  { label: 'Grade C Lots', val: '1 Lot', color: 'purple' },
                ].map(card => (
                  <div key={card.label} className="bg-white border border-emerald-100 rounded-2xl p-3.5 shadow-sm text-center">
                    <div className="text-[10px] font-extrabold uppercase text-[#637554] mb-1">{card.label}</div>
                    <div className="text-lg font-extrabold text-[#052816]">{card.val}</div>
                  </div>
                ))}
              </div>

              {/* Inspection Queue Preview */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3 font-mono text-xs">
                <h3 className="font-extrabold text-sm text-[#052816] flex items-center justify-between">
                  <span>PENDING QUALITY INSPECTION QUEUE</span>
                  <button onClick={() => setActiveTab('queue')} className="text-emerald-700 underline font-bold">View All 24 Queue Items →</button>
                </h3>
                <div className="space-y-2">
                  {inspectionQueue.map(item => (
                    <div key={item.id} className="p-3 bg-[#f0fbf4] border border-emerald-200/60 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-extrabold text-[#052816]">{item.id} — {item.crop} ({item.lotId})</div>
                        <div className="text-[#637554]">Farmer: {item.farmer} • Mandi: {item.mandi} • Qty: {item.qty}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${item.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : item.status === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. INSPECTION QUEUE & ASSIGNED LOTS */}
          {(activeTab === 'queue' || activeTab === 'assigned' || activeTab === 'sampling') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#052816]">INSPECTION QUEUE & SAMPLE COLLECTION</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <table className="w-full text-left">
                  <thead className="bg-[#052816] text-white">
                    <tr>
                      <th className="p-3">Inspection ID & Lot</th>
                      <th className="p-3">Crop & Quantity</th>
                      <th className="p-3">Source Farmer</th>
                      <th className="p-3">Sample Details</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {inspectionQueue.map(q => (
                      <tr key={q.id} className="hover:bg-emerald-50/40">
                        <td className="p-3 font-bold text-[#052816]">{q.id}<br/><span className="text-[#637554] font-normal">{q.lotId}</span></td>
                        <td className="p-3">{q.crop}<br/><span className="text-[#637554]">{q.qty}</span></td>
                        <td className="p-3">{q.farmer}</td>
                        <td className="p-3">{q.sampleId}<br/><span className="text-[#637554]">{q.sampleQty}</span></td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${q.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : q.status === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => { setTestForm(prev => ({ ...prev, inspId: q.id })); setActiveTab('testing'); }} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]">
                            Perform Assay →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. QUALITY TESTING & GRADE ASSIGNMENT */}
          {(activeTab === 'testing' || activeTab === 'grading') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#052816]">📡 QUALITY TESTING & GRADE ASSIGNMENT</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm space-y-4 max-w-2xl mx-auto">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">
                  🔒 Permission Rule: Quality Inspector records measured test parameters. Once finalized, reports are locked and read-only.
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold">Active Inspection Lot ID</label>
                    <input type="text" value={testForm.inspId} readOnly className="w-full bg-[#f4f6f4] border border-emerald-200 rounded-xl p-2.5 font-bold text-[#052816]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold flex justify-between">Moisture (%) <span className="text-[#637554]">Max: 12.0%</span></label>
                      <input type="number" step="0.1" value={testForm.moisture} onChange={e => setTestForm(p => ({ ...p, moisture: e.target.value }))} className="w-full border border-emerald-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-600 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold flex justify-between">Foreign Matter (%) <span className="text-[#637554]">Max: 1.0%</span></label>
                      <input type="number" step="0.1" value={testForm.foreignMatter} onChange={e => setTestForm(p => ({ ...p, foreignMatter: e.target.value }))} className="w-full border border-emerald-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-600 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold flex justify-between">Damaged Grains (%) <span className="text-[#637554]">Max: 2.0%</span></label>
                      <input type="number" step="0.1" value={testForm.damagedGrains} onChange={e => setTestForm(p => ({ ...p, damagedGrains: e.target.value }))} className="w-full border border-emerald-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-600 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold flex justify-between">Broken Grains (%) <span className="text-[#637554]">Max: 2.0%</span></label>
                      <input type="number" step="0.1" value={testForm.brokenGrains} onChange={e => setTestForm(p => ({ ...p, brokenGrains: e.target.value }))} className="w-full border border-emerald-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-600 font-bold" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">Inspector Remarks & Notes</label>
                    <textarea rows="2" value={testForm.remarks} onChange={e => setTestForm(p => ({ ...p, remarks: e.target.value }))} className="w-full border border-emerald-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-600 font-bold" />
                  </div>

                  <button onClick={submitQualityGrade} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-sm">
                    🔒 Finalize Quality Assay & Assign Official Grade →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. FORMAL INSPECTION REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#052816]">FORMAL DIGITAL INSPECTION REPORTS (LOCKED)</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <table className="w-full text-left">
                  <thead className="bg-[#052816] text-white">
                    <tr>
                      <th className="p-3">Report ID & Date</th>
                      <th className="p-3">Lot ID & Crop</th>
                      <th className="p-3">Farmer</th>
                      <th className="p-3">Assayed Moisture</th>
                      <th className="p-3">Final Grade</th>
                      <th className="p-3">Inspector</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {completedReports.map(rep => (
                      <tr key={rep.id}>
                        <td className="p-3 font-bold text-[#052816]">{rep.id}<br/><span className="text-[#637554]">{rep.date}</span></td>
                        <td className="p-3 font-bold">{rep.lotId}<br/><span className="text-[#637554]">{rep.crop}</span></td>
                        <td className="p-3">{rep.farmer}</td>
                        <td className="p-3">{rep.moisture} (FM: {rep.fm})</td>
                        <td className="p-3 font-bold"><span className={`px-2 py-0.5 rounded ${rep.result === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{rep.grade}</span></td>
                        <td className="p-3">{rep.inspector}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => alert(`Downloading formal PDF report ${rep.id}...`)} className="bg-emerald-700 text-white font-bold px-3 py-1 rounded">Download PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. REINSPECTION & DISPUTES */}
          {activeTab === 'disputes' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#052816]">REINSPECTION & DISPUTE WORKFLOW</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">
                  🔒 Preservation Rule: Reinspection creates a new decision record. Original inspection report is preserved permanently.
                </div>
                {disputes.map(d => (
                  <div key={d.disputeId} className="border border-emerald-200 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-extrabold text-[#052816]">{d.disputeId} — {d.farmer} ({d.crop})</div>
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded font-bold">{d.status}</span>
                    </div>
                    <div className="text-[#637554]">Original Grade: <strong className="text-red-700">{d.origGrade}</strong> • Reason: {d.reason}</div>
                    <button onClick={() => alert(`Reinspection started for ${d.disputeId}. Sampling code: SMP-RE-${Date.now()}`)} className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl">
                      Perform Secondary Reinspection Sample →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. FARMER QUALITY HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#052816]">FARMER HISTORICAL QUALITY RECORDS</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <table className="w-full text-left">
                  <thead className="bg-[#052816] text-white">
                    <tr>
                      <th className="p-3">Farmer Name</th>
                      <th className="p-3">Crop Produce</th>
                      <th className="p-3">Lot ID</th>
                      <th className="p-3">Moisture</th>
                      <th className="p-3">Assigned Grade</th>
                      <th className="p-3">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {farmerHistory.map((h, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-[#052816]">{h.farmer}</td>
                        <td className="p-3">{h.crop}</td>
                        <td className="p-3">{h.lotId}</td>
                        <td className="p-3">{h.moisture}</td>
                        <td className="p-3 font-bold">{h.grade}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded font-bold ${h.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{h.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. QUALITY ALERTS & ANALYTICS */}
          {(activeTab === 'alerts' || activeTab === 'analytics' || activeTab === 'evidence' || activeTab === 'notifications') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#052816]">QUALITY ALERTS & ANALYTICS DASHBOARD</h2>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-[#637554] font-bold">Grade A Distribution</div>
                  <div className="text-2xl font-extrabold text-emerald-800 mt-1">62%</div>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-[#637554] font-bold">Grade B Distribution</div>
                  <div className="text-2xl font-extrabold text-sky-800 mt-1">25%</div>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-[#637554] font-bold">Rejection Rate</div>
                  <div className="text-2xl font-extrabold text-red-800 mt-1">4%</div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
