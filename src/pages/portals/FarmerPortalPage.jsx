import React, { useState } from 'react';
import { 
  ChevronLeft, Sprout, MapPin, Layers, Plus, Calendar, Clock, DollarSign, 
  FileText, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Bell, 
  Search, Filter, Eye, Download, UserCheck, CreditCard, Building2
} from 'lucide-react';

export default function FarmerPortalPage({ setCurrentView, currentUser, openGatePassWithAuth, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Farmer Profile
  const farmerProfile = {
    id: 'FRM-10245',
    name: currentUser?.name || 'Gurpreet Singh',
    phone: currentUser?.mobile || '+91 98765 43210',
    email: currentUser?.email || 'gurpreet.kisan@gmail.com',
    state: 'Haryana',
    district: 'Karnal',
    block: 'Nilokheri',
    village: 'Mithapur',
    landArea: '5.5 Acres',
    verified: true,
    bankVerified: true,
    kycVerified: true,
    bankAccount: 'State Bank of India (XXXX 4892)',
  };

  // 1. Dashboard Metrics
  const metrics = {
    myProduce: '8,500 KG',
    activeLots: 4,
    underInspection: 2,
    procurementPending: 1,
    soldProcured: 12,
    pendingPayment: '₹42,500',
    totalEarnings: '₹3.84 Lakh',
  };

  // 2. Registered Farms
  const [farms, setFarms] = useState([
    { id: 'FARM-001', area: '3.5 Acres', location: 'Mithapur (Karnal)', crop: 'Wheat (Sharbati)', season: 'Rabi', soil: 'Alluvial Loam', irrigation: 'Canal & Tube Well' },
    { id: 'FARM-002', area: '2.0 Acres', location: 'Nilokheri', crop: 'Paddy (Basmati)', season: 'Kharif', soil: 'Clay Loam', irrigation: 'Submersible Pump' },
  ]);

  // 3. Submitted Produce Lots
  const [lots, setLots] = useState([
    { id: 'LOT-2026-00452', product: 'Wheat', variety: 'HD-2967', qty: '5,000 KG (50 Qtl)', farm: 'Farm #001', harvestDate: '20 Aug 2026', mandi: 'Mithapur Mandi', grade: 'Grade A', status: 'PAYMENT PROCESSING', expPrice: '₹2,470/Qtl', estVal: '₹1,23,500', step: 7 },
    { id: 'LOT-2026-00453', product: 'Paddy Basmati', variety: 'PB-1121', qty: '3,000 KG (30 Qtl)', farm: 'Farm #002', harvestDate: '22 Aug 2026', mandi: 'Karnal Yard', grade: 'Grade B', status: 'UNDER INSPECTION', expPrice: '₹2,300/Qtl', estVal: '₹69,000', step: 4 },
  ]);

  // 4. Sales & Payments
  const [payments, setPayments] = useState([
    { payId: 'PAY-88231', lotId: 'LOT-2026-00452', product: 'Wheat (5,000 KG)', gross: '₹1,23,500', deductions: '₹0.00', net: '₹1,23,500', status: 'PROCESSING', date: '25 Aug 2026' },
    { payId: 'PAY-88210', lotId: 'LOT-2026-00399', product: 'Paddy (3,000 KG)', gross: '₹84,000', deductions: '₹0.00', net: '₹84,000', status: 'COMPLETED', date: '18 Aug 2026' },
  ]);

  // 5. Support Tickets
  const [tickets, setTickets] = useState([
    { ticketId: 'CMP-2026-00231', issue: 'Weight Discrepancy Inquiry', status: 'UNDER REVIEW', date: '24 Aug 2026' }
  ]);

  // Submit Lot Handler
  const [newLotQty, setNewLotQty] = useState('5000');
  const [newLotCrop, setNewLotCrop] = useState('Wheat');
  const handleCreateLot = (e) => {
    e.preventDefault();
    const newLot = {
      id: `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      product: newLotCrop,
      variety: 'FAQ Standard',
      qty: `${newLotQty} KG`,
      farm: 'Farm #001',
      harvestDate: '25 Aug 2026',
      mandi: 'Mithapur Mandi',
      grade: 'Pending Assay',
      status: 'PENDING MANDI RECEIVING',
      expPrice: '₹2,470/Qtl',
      estVal: `₹${(parseFloat(newLotQty) * 24.7).toLocaleString('en-IN')}`,
      step: 1
    };
    setLots([newLot, ...lots]);
    alert(`🎉 Produce Lot ${newLot.id} successfully created! Gate Pass token generated.`);
    setActiveTab('lots');
  };

  // Nav Items list matching user specification (14 items)
  const navItems = [
    { key: 'dashboard', label: '📊 Dashboard', icon: Sprout },
    { key: 'profile', label: '👤 My Profile & Verification', icon: UserCheck },
    { key: 'farms', label: '🏞️ My Registered Farms', icon: MapPin },
    { key: 'create_lot', label: '➕ Create Produce Lot', icon: Plus },
    { key: 'lots', label: '📦 My Lots & Tracking', icon: Layers },
    { key: 'prices', label: '📈 Market & MSP Prices', icon: DollarSign },
    { key: 'opportunities', label: '🎯 Procurement Opportunities', icon: Building2 },
    { key: 'quality', label: '🔬 Quality Inspection Reports', icon: ShieldCheck },
    { key: 'sales', label: '📜 My Sales & Orders', icon: FileText },
    { key: 'payments', label: '💳 Payments & DBT Status', icon: CreditCard },
    { key: 'documents', label: '📄 Centralized Documents', icon: FileText },
    { key: 'support', label: '💬 Support & Complaints', icon: HelpCircle },
    { key: 'notifications', label: '🔔 Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#243118] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-[#abbe99]/40">
        <div className="flex items-center gap-2">
          <span className="bg-[#71873f] text-white font-extrabold px-2 py-0.5 rounded text-[10px]">KISAN PORTAL</span>
          <span>AAGAM Farmer Direct Connect • PM-KISAN & Aadhaar e-KYC Linked</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Farmer: <strong className="text-amber-300">{farmerProfile.name} ({farmerProfile.id})</strong></span>
          <span className="text-emerald-400">KYC Verified ✓</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#1c2713] text-slate-200 p-4 space-y-1 overflow-y-auto shrink-0 border-r border-[#abbe99]/40 shadow-xl">
          <div className="px-3 py-2 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-[#abbe99]/30 mb-2">
            FARMER NAVIGATION DIRECTORY
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all text-left ${
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

          <div className="pt-4 border-t border-[#abbe99]/30 mt-4">
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
            <div className="space-y-6 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#abbe99]/60 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#243118]">FARMER DASHBOARD</h2>
                  <p className="text-xs text-[#637554]">My agricultural produce, active lots, and DBT payment status</p>
                </div>
                <button onClick={openGatePassWithAuth} className="bg-[#71873f] hover:bg-[#5c7031] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Book Mandi Slot & QR Gate Pass
                </button>
              </div>

              {/* 7 Core Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {[
                  { label: 'My Produce', val: metrics.myProduce, sub: 'Registered' },
                  { label: 'Active Lots', val: `${metrics.activeLots} Lots`, sub: 'In Process' },
                  { label: 'Under Inspection', val: `${metrics.underInspection} Lots`, sub: 'Lab Testing' },
                  { label: 'Procurement Pend.', val: `${metrics.procurementPending} Lot`, sub: 'Approval Queue' },
                  { label: 'Sold / Procured', val: `${metrics.soldProcured} Lots`, sub: 'Delivered' },
                  { label: 'Pending Payment', val: metrics.pendingPayment, sub: 'DBT Processing' },
                  { label: 'Total Earnings', val: metrics.totalEarnings, sub: 'Direct Bank Credit' },
                ].map(card => (
                  <div key={card.label} className="bg-white border border-[#abbe99]/60 rounded-2xl p-3.5 shadow-sm text-center">
                    <div className="text-[10px] font-extrabold uppercase text-[#637554] mb-1">{card.label}</div>
                    <div className="text-lg font-extrabold text-[#243118]">{card.val}</div>
                    <div className="text-[10px] text-[#637554] mt-1">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Active Lots Quick Status */}
              <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-5 shadow-sm space-y-3 font-mono">
                <h3 className="font-extrabold text-sm text-[#243118] flex items-center justify-between">
                  <span>MY ACTIVE PRODUCE LOTS & PROGRESS</span>
                  <button onClick={() => setActiveTab('lots')} className="text-[#71873f] underline font-bold">Track All Lots →</button>
                </h3>
                <div className="space-y-2">
                  {lots.map(l => (
                    <div key={l.id} className="p-3.5 bg-[#f0f4ea] border border-[#abbe99]/40 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-extrabold text-[#243118]">{l.id} — {l.product} ({l.qty})</div>
                        <div className="text-[#637554]">Mandi: {l.mandi} • Expected Value: <strong>{l.estVal}</strong></div>
                      </div>
                      <span className="bg-[#71873f] text-white font-bold px-3 py-1 rounded-lg text-[10px]">{l.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. FARMER PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">FARMER PROFILE & VERIFICATION STATUS</h2>
              <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-6 shadow-sm space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 border-b border-[#abbe99]/40 pb-4">
                  <div className="w-14 h-14 bg-[#71873f] text-white rounded-full flex items-center justify-center text-xl font-bold">🌾</div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#243118]">{farmerProfile.name}</h3>
                    <p className="text-[#637554]">Farmer ID: {farmerProfile.id} • {farmerProfile.village}, {farmerProfile.district}, {farmerProfile.state}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">Phone:</span> <strong className="text-[#243118]">{farmerProfile.phone}</strong></div>
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">Email:</span> <strong className="text-[#243118]">{farmerProfile.email}</strong></div>
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">Land Area:</span> <strong className="text-[#243118]">{farmerProfile.landArea}</strong></div>
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">Bank Account:</span> <strong className="text-emerald-800">{farmerProfile.bankAccount}</strong></div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 font-bold text-emerald-900">
                  <div>✓ Aadhaar Identity Verified</div>
                  <div>✓ PM-KISAN Land Holding Verified</div>
                  <div>✓ NPCI-DBT Direct Bank Transfer Verified</div>
                </div>
              </div>
            </div>
          )}

          {/* 3. MY FARMS */}
          {activeTab === 'farms' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">MY REGISTERED FARMS</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {farms.map(f => (
                  <div key={f.id} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between font-extrabold text-[#243118] text-sm">
                      <span>{f.id} — {f.crop}</span>
                      <span className="bg-[#71873f] text-white px-2.5 py-0.5 rounded text-[10px]">{f.season}</span>
                    </div>
                    <div className="text-[#637554]">Area: <strong>{f.area}</strong> • Location: {f.location}</div>
                    <div className="text-[#637554]">Soil: {f.soil} • Irrigation: {f.irrigation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CREATE PRODUCE LOT */}
          {activeTab === 'create_lot' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">CREATE PRODUCE LOT</h2>
              <form onSubmit={handleCreateLot} className="bg-white border border-[#abbe99]/60 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl mx-auto">
                <div className="space-y-1">
                  <label className="font-bold">Select Crop Product</label>
                  <select value={newLotCrop} onChange={e => setNewLotCrop(e.target.value)} className="w-full border border-[#abbe99] rounded-xl p-2.5 font-bold">
                    <option value="Wheat">Wheat (Sharbati)</option>
                    <option value="Paddy Basmati">Paddy (Basmati 1121)</option>
                    <option value="Mustard">Mustard (Bold)</option>
                    <option value="Chana">Chana (Desi)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Produce Quantity (KG)</label>
                  <input type="number" value={newLotQty} onChange={e => setNewLotQty(e.target.value)} className="w-full border border-[#abbe99] rounded-xl p-2.5 font-bold" />
                </div>
                <button type="submit" className="w-full bg-[#71873f] text-white font-extrabold py-3 rounded-xl shadow-md">
                  Submit Produce Lot & Generate Token →
                </button>
              </form>
            </div>
          )}

          {/* 5. MY LOTS & TRACKING */}
          {activeTab === 'lots' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">MY PRODUCE LOTS & LIFECYCLE TRACKING</h2>
              <div className="space-y-3">
                {lots.map(l => (
                  <div key={l.id} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-extrabold text-sm text-[#243118]">{l.id} — {l.product} ({l.qty})</div>
                      <span className="bg-[#71873f] text-white font-bold px-3 py-1 rounded-lg">{l.status}</span>
                    </div>
                    <div className="text-[#637554]">Mandi: {l.mandi} • Expected Value: <strong className="text-[#243118]">{l.estVal}</strong> • Grade: {l.grade}</div>
                    <div className="flex items-center gap-2 pt-2 text-[10px] text-emerald-800 font-bold overflow-x-auto">
                      <span>✓ Lot Created</span> ➔ <span>✓ Mandi Received</span> ➔ <span>✓ Weighment</span> ➔ <span>✓ Quality</span> ➔ <span>✓ Procurement</span> ➔ <span>✓ Payment</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'profile', 'farms', 'create_lot', 'lots'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-8 text-center space-y-3 shadow-sm font-mono">
              <div className="w-12 h-12 bg-[#f0f4ea] text-[#71873f] rounded-full flex items-center justify-center mx-auto text-xl font-bold">🌾</div>
              <h3 className="text-base font-extrabold text-[#243118] uppercase">{activeTab.replace('_', ' ')} Kisan Module</h3>
              <p className="text-xs text-[#637554]">Farmer direct procurement, market prices, and DBT payment terminal active.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
