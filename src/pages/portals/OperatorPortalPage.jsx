import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, QrCode, Truck, UserCheck, Scale, Microscope, Gavel, 
  FileText, ArrowRight, Building2, Bell, Search, Filter, Plus, CheckCircle2, 
  RefreshCw, Clock, Layers, Lock, Download, DollarSign, Trophy
} from 'lucide-react';
import { dbEngine } from '../../data/dbEngine';

export default function OperatorPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sharedProcurements, setSharedProcurements] = useState(() => dbEngine.getAllSharedProcurements());

  const [weighInputs, setWeighInputs] = useState({});

  useEffect(() => {
    const unsub = dbEngine.subscribe((db) => {
      setSharedProcurements(db.sharedProcurements || []);
    });
    return () => unsub();
  }, []);

  // 1. Mandi Metrics
  const metrics = {
    farmersArrived: 126,
    vehiclesInside: 42,
    pendingWeighment: 18,
    pendingInspection: 27,
    lotsProcessed: 84,
    qtyReceived: '428 MT',
  };

  // 2. Farmer Arrival & Tokens
  const [arrivals, setArrivals] = useState([
    { token: 'MND-184', farmer: 'Raj Kumar', farmerId: 'FRM-10245', crop: 'Wheat', qty: '5,000 KG', vehicle: 'BR-XX-1234', time: '09:42 AM', status: 'WAITING FOR WEIGHMENT' },
    { token: 'MND-185', farmer: 'Gurpreet Singh', farmerId: 'PB-99482', crop: 'Paddy Basmati', qty: '18,000 KG', vehicle: 'HR-10-AB-9981', time: '10:15 AM', status: 'WEIGHMENT COMPLETED' },
    { token: 'MND-186', farmer: 'Amarjit Kaur', farmerId: 'PB-99483', crop: 'Mustard', qty: '8,000 KG', vehicle: 'PB-12-CD-4421', time: '10:50 AM', status: 'INSIDE MANDI' },
  ]);

  // 3. Weighment Calculations (Gross - Tare = Net)
  const [weighments, setWeighments] = useState([
    { weighId: 'WGH-4401', lotId: 'LOT-2026-00045', farmer: 'Gurpreet Singh', crop: 'Wheat (Sharbati)', gross: 5850, tare: 850, net: 5000, status: 'RECORDED', receiptNo: 'RCP-99482' },
    { weighId: 'WGH-4402', lotId: 'LOT-2026-00046', farmer: 'Baldev Ram', crop: 'Paddy (Basmati)', gross: 9200, tare: 1200, net: 8000, status: 'RECORDED', receiptNo: 'RCP-99483' },
  ]);

  // Live Auctions in Mandi Yard
  const [auctions, setAuctions] = useState([
    { auctionId: 'MND-AUC-8801', crop: 'Wheat (Sharbati)', qty: '5,000 KG', highestBid: '₹2,490', winner: 'Karnal Agro Traders', bids: [{ buyer: 'Karnal Agro', bid: '₹2,490' }, { buyer: 'North Wheat Mill', bid: '₹2,475' }, { buyer: 'Haryana Foods', bid: '₹2,460' }], status: 'ROUND CLOSED', finalPrice: '₹2,490 / Qtl' },
    { auctionId: 'MND-AUC-8802', crop: 'Paddy (Basmati)', qty: '8,000 KG', highestBid: '₹3,750', winner: 'Rice Exports Ltd', bids: [{ buyer: 'Rice Exports Ltd', bid: '₹3,750' }, { buyer: 'Punjab Grain Corp', bid: '₹3,720' }], status: 'ROUND CLOSED', finalPrice: '₹3,750 / Qtl' },
  ]);

  // Handlers
  const registerNewArrival = () => {
    alert(`New Arrival Token Generated: MND-${Math.floor(200+Math.random()*100)}. Added to Weighment Queue.`);
  };

  // Nav Items list matching user specification (17 items)
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: QrCode },
    { key: 'arrivals', label: 'Farmer Arrivals & Tokens', icon: UserCheck },
    { key: 'vehicles', label: 'Vehicle Entry Control', icon: Truck },
    { key: 'queue', label: 'Queue Management', icon: Clock },
    { key: 'registration', label: 'Lot Registration', icon: Layers },
    { key: 'weighment', label: 'Physical Weighment (Gross/Tare/Net)', icon: Scale },
    { key: 'inspection', label: 'Quality Inspection Coordination', icon: Microscope },
    { key: 'auction', label: 'Auction & Bidding', icon: Gavel },
    { key: 'buyer', label: 'Buyer Coordination', icon: Building2 },
    { key: 'status', label: 'Procurement Status Tracking', icon: FileText },
    { key: 'receipts', label: 'Digital Receipts', icon: Download },
    { key: 'dispatch', label: 'Mandi Yard Dispatch', icon: Truck },
    { key: 'inventory', label: 'Mandi Yard Stock View', icon: Layers },
    { key: 'reports', label: 'Reports & Analytics', icon: FileText },
    { key: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#243118] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-[#abbe99]/40">
        <div className="flex items-center gap-2">
          <span className="bg-[#71873f] text-white font-extrabold px-2 py-0.5 rounded text-[10px]">APMC MANDI GATE</span>
          <span>AAGAM Mandi Terminal • Karnal Central Yard (Haryana APMC #HR-10-MND)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Operator: <strong className="text-amber-400">{currentUser?.name || 'Rakesh Verma'}</strong></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Gate #02 Active</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* Sidebar Navigation (Responsive Horizontal Scroll on Mobile, Vertical Sidebar on Desktop) */}
        <aside className="w-full md:w-64 bg-[#1b2612] text-slate-200 p-3 md:p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 border-b md:border-b-0 md:border-r border-[#abbe99]/40 shadow-xl gap-1 md:space-y-1">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-[#abbe99]/30 mb-2">
            MANDI OPERATOR DIRECTORY
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
                    ? 'bg-[#71873f] text-white shadow-lg shadow-[#71873f]/30' 
                    : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="hidden md:block pt-4 border-t border-[#abbe99]/30 mt-4">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>Back to Portal Home</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#fcfaf7]">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#abbe99]/60 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#243118]">MANDI CENTER OPERATOR DASHBOARD</h2>
                  <p className="text-xs text-[#637554]">Real-time vehicle arrivals, weighbridge operations, and auction coordination</p>
                </div>
                <button onClick={registerNewArrival} className="bg-[#71873f] hover:bg-[#5c7031] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Register Farmer Arrival Token
                </button>
              </div>

              {/* Mandi Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 font-mono text-xs">
                {[
                  { label: 'Farmers Arrived', val: `${metrics.farmersArrived}`, sub: '126 Today', icon: UserCheck },
                  { label: 'Vehicles Inside', val: `${metrics.vehiclesInside}`, sub: '42 Active Trucks', icon: Truck },
                  { label: 'Pending Weighment', val: `${metrics.pendingWeighment}`, sub: 'In Queue', icon: Scale },
                  { label: 'Pending Inspection', val: `${metrics.pendingInspection}`, sub: 'Assay Requested', icon: Microscope },
                  { label: 'Lots Processed', val: `${metrics.lotsProcessed}`, sub: '84 Completed', icon: CheckCircle2 },
                  { label: 'Quantity Received', val: metrics.qtyReceived, sub: '428 MT Total', icon: Layers },
                ].map(card => {
                  const CIcon = card.icon;
                  return (
                    <div key={card.label} className="bg-white border border-[#abbe99]/60 rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase text-[#637554]">{card.label}</span>
                        <CIcon className="w-4 h-4 text-[#71873f]" />
                      </div>
                      <div className="text-lg font-extrabold text-[#243118]">{card.val}</div>
                      <div className="text-[10px] text-[#637554] mt-1">{card.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* UNIFIED 8-ROLE SHARED PROCUREMENT WEIGHMENT QUEUE */}
              <div className="bg-[#243118] text-white rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs border border-[#abbe99]/40">
                <div className="flex justify-between items-center border-b border-[#abbe99]/30 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-amber-400" />
                      <span>UNIFIED SHARED PROCUREMENT WEIGHBRIDGE QUEUE</span>
                    </h3>
                    <p className="text-[11px] text-slate-300">Synchronized live with Mandi Operator scale using ONE shared Procurement ID</p>
                  </div>
                  <span className="bg-[#71873f] text-white font-bold px-2.5 py-0.5 rounded text-[10px]">ELECTRONIC WEIGHBRIDGE #02</span>
                </div>

                {sharedProcurements.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">No active shared procurement requests awaiting weighment.</div>
                ) : (
                  <div className="space-y-3">
                    {sharedProcurements.map(proc => {
                      const isWeighed = proc.weighmentVerified;
                      const inputGross = weighInputs[proc.id]?.gross || (proc.quantityKg + 180);
                      const inputTare = weighInputs[proc.id]?.tare || 180;

                      return (
                        <div key={proc.id} className="bg-[#1c2713] border border-[#abbe99]/40 rounded-xl p-4 space-y-3">
                          <div className="flex flex-wrap justify-between items-center border-b border-[#abbe99]/20 pb-2">
                            <div>
                              <div className="font-black text-amber-300 text-sm flex items-center gap-2">
                                <span>{proc.id}</span>
                                <span className="bg-[#28381c] text-amber-200 text-[10px] px-2 py-0.5 rounded border border-[#abbe99]/30">
                                  {proc.crop} ({proc.quantityKg} KG Estimated)
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-300">
                                Farmer: <strong>{proc.farmerName}</strong> • Quality Grade: <strong className="text-emerald-400">{proc.qualityVerified ? (proc.qualityDetails?.grade || 'GRADE A') : 'Pending Quality'}</strong>
                              </div>
                            </div>

                            <div>
                              {isWeighed ? (
                                <span className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-lg text-[10px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> WEIGHMENT RECORDED ({proc.netWeight} KG NET)
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    dbEngine.recordWeighmentByOperator(proc.id, inputGross, inputTare);
                                    alert(`Weighment Recorded for Shared Procurement ID ${proc.id}!\nGross: ${inputGross} KG, Tare: ${inputTare} KG\nNet Weight: ${inputGross - inputTare} KG.`);
                                  }}
                                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg animate-pulse"
                                >
                                  <Scale className="w-4 h-4" />
                                  <span>Record Actual Net Weight</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {!isWeighed && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#28381c] p-2.5 rounded-lg border border-[#abbe99]/30">
                              <div>
                                <label className="text-[10px] text-slate-300 font-bold block mb-1">Gross Weight (KG):</label>
                                <input
                                  type="number"
                                  value={inputGross}
                                  onChange={(e) => setWeighInputs(prev => ({ ...prev, [proc.id]: { ...prev[proc.id], gross: e.target.value } }))}
                                  className="w-full bg-[#1c2713] border border-[#abbe99]/50 rounded p-1.5 text-amber-300 font-extrabold text-xs"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-300 font-bold block mb-1">Tare Weight (Truck/Bags KG):</label>
                                <input
                                  type="number"
                                  value={inputTare}
                                  onChange={(e) => setWeighInputs(prev => ({ ...prev, [proc.id]: { ...prev[proc.id], tare: e.target.value } }))}
                                  className="w-full bg-[#1c2713] border border-[#abbe99]/50 rounded p-1.5 text-amber-300 font-extrabold text-xs"
                                />
                              </div>

                              <div className="text-right flex flex-col justify-center">
                                <div className="text-[10px] text-slate-400 font-bold">Calculated Net Weight:</div>
                                <div className="text-base font-black text-emerald-400">{inputGross - inputTare} KG</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mandi Arrivals Queue Preview */}
              <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-5 shadow-sm space-y-3 font-mono text-xs">
                <h3 className="font-extrabold text-sm text-[#243118] flex items-center justify-between">
                  <span>LIVE MANDI ARRIVALS & WEIGHMENT QUEUE</span>
                  <button onClick={() => setActiveTab('arrivals')} className="text-[#71873f] underline font-bold">View Full Queue →</button>
                </h3>
                <div className="space-y-2">
                  {arrivals.map(a => (
                    <div key={a.token} className="p-3 bg-[#f0f4ea] border border-[#abbe99]/40 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-extrabold text-[#243118]">{a.token} — {a.farmer} ({a.farmerId})</div>
                        <div className="text-[#637554]">Crop: <strong>{a.crop}</strong> • Qty: {a.qty} • Vehicle: {a.vehicle}</div>
                      </div>
                      <span className="bg-[#71873f] text-white font-extrabold px-3 py-1 rounded-lg text-[10px]">{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. FARMER ARRIVALS & WEIGHMENT */}
          {(activeTab === 'arrivals' || activeTab === 'vehicles' || activeTab === 'weighment') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">PHYSICAL WEIGHMENT (GROSS - TARE = NET WEIGHT)</h2>
              <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-5 shadow-sm space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Restriction Rule: Net Weight is calculated automatically. Re-weighment requests preserve historical records.</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#243118] text-white">
                    <tr>
                      <th className="p-3">Weighment ID & Lot</th>
                      <th className="p-3">Farmer & Crop</th>
                      <th className="p-3">Gross Weight</th>
                      <th className="p-3">Tare Weight</th>
                      <th className="p-3">Calculated Net Weight</th>
                      <th className="p-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#abbe99]/30">
                    {weighments.map(w => (
                      <tr key={w.weighId}>
                        <td className="p-3 font-bold text-[#243118]">{w.weighId}<br/><span className="text-[#637554]">{w.lotId}</span></td>
                        <td className="p-3">{w.farmer}<br/><span className="text-[#637554]">{w.crop}</span></td>
                        <td className="p-3">{w.gross} KG</td>
                        <td className="p-3">{w.tare} KG</td>
                        <td className="p-3 font-extrabold text-emerald-800">{w.net} KG</td>
                        <td className="p-3 text-right">
                          <button onClick={() => alert(`Printing receipt ${w.receiptNo}...`)} className="bg-[#71873f] text-white font-bold px-3 py-1 rounded text-[10px]">Print Receipt</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. AUCTION / SALE MANAGEMENT */}
          {activeTab === 'auction' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">AUCTION & BIDDING SESSIONS</h2>
              <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-5 shadow-sm space-y-3">
                {auctions.map(auc => (
                  <div key={auc.auctionId} className="border border-[#abbe99]/60 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-extrabold text-[#243118]">{auc.auctionId} — {auc.crop} ({auc.qty})</div>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded">{auc.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-[#f0f4ea] p-3 rounded-lg">
                      {auc.bids.map((b, i) => (
                        <div key={i} className="text-center">
                          <div className="text-[#637554]">{b.buyer}</div>
                          <div className="font-extrabold text-sm text-[#243118]">{b.bid}</div>
                        </div>
                      ))}
                    </div>
                    <div className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Winning Buyer: {auc.winner} @ {auc.finalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'arrivals', 'vehicles', 'weighment', 'auction'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-8 text-center space-y-3 shadow-sm font-mono">
              <div className="w-12 h-12 bg-[#f0f4ea] text-[#71873f] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                <Building2 className="w-6 h-6 text-[#71873f]" />
              </div>
              <h3 className="text-base font-extrabold text-[#243118] uppercase">{activeTab.replace('_', ' ')} Mandi Terminal</h3>
              <p className="text-xs text-[#637554]">Mandi Operator physical arrival, weighbridge receipt, and auction coordination active.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
