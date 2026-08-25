import React, { useState } from 'react';
import { 
  ChevronLeft, ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, 
  FileText, ArrowRight, Building2, Warehouse, Coins, DollarSign, Bell, 
  Search, Filter, Plus, Eye, RefreshCw, BarChart3, Users, Lock, Download, Truck
} from 'lucide-react';

export default function OfficerPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Procurement Metrics
  const metrics = {
    pendingProcurement: 42,
    todayProcurement: 18,
    qtyProcured: '524 MT',
    procurementValue: '₹1.28 Cr',
    pendingApprovals: 12,
    paymentPending: 9,
    warehouseAllocation: 15,
  };

  // 2. Procurement Queue & Lot Verification
  const [procurementQueue, setProcurementQueue] = useState([
    { lotId: 'LOT-00452', farmer: 'Raj Kumar (FRM-10245)', product: 'Wheat (Sharbati)', qty: '5,000 KG (50 Qtl)', mandi: 'Mithapur Mandi', grade: 'Grade A', price: 2470, estValue: '₹1,23,500', warehouse: 'WH-BR-004', status: 'PENDING_REVIEW', weightVerified: true, farmerVerified: true, qualityVerified: true },
    { lotId: 'LOT-00453', farmer: 'Gurpreet Singh (PB-99482)', product: 'Paddy (Basmati)', qty: '18,000 KG (180 Qtl)', mandi: 'Karnal Yard', grade: 'Grade A', price: 2300, estValue: '₹4,14,000', warehouse: 'WH-HR-001', status: 'APPROVED', weightVerified: true, farmerVerified: true, qualityVerified: true },
    { lotId: 'LOT-00454', farmer: 'Amarjit Kaur (PB-99483)', product: 'Mustard (Bold)', qty: '8,000 KG (80 Qtl)', mandi: 'Khanna APMC', grade: 'Grade A', price: 5950, estValue: '₹4,76,000', warehouse: 'WH-PB-002', status: 'PENDING_REVIEW', weightVerified: true, farmerVerified: true, qualityVerified: true },
  ]);

  // 3. Procurement Orders
  const [procurementOrders, setProcurementOrders] = useState([
    { poNumber: 'PO-2026-00982', lotId: 'LOT-00452', farmer: 'Raj Kumar', product: 'Wheat', qty: '5,000 KG', grade: 'Grade A', price: '₹2,470 / Qtl', totalValue: '₹1,23,500', mandi: 'Mithapur', warehouse: 'WH-BR-004', status: 'APPROVED', paymentStatus: 'PROCESSING' },
    { poNumber: 'PO-2026-00983', lotId: 'LOT-00453', farmer: 'Gurpreet Singh', product: 'Paddy Basmati', qty: '18,000 KG', grade: 'Grade A', price: '₹2,300 / Qtl', totalValue: '₹4,14,000', mandi: 'Karnal Yard', warehouse: 'WH-HR-001', status: 'WAREHOUSE ALLOCATED', paymentStatus: 'COMPLETED' },
  ]);

  // 4. Payment Tracking
  const [payments, setPayments] = useState([
    { payId: 'PAY-88231', farmer: 'Raj Kumar', poNumber: 'PO-2026-00982', gross: '₹1,23,500', deductions: '₹0.00', netPayable: '₹1,23,500', status: 'PROCESSING', bank: 'SBI A/C XXXX4892 (NPCI-DBT)' },
    { payId: 'PAY-88232', farmer: 'Gurpreet Singh', poNumber: 'PO-2026-00983', gross: '₹4,14,000', deductions: '₹0.00', netPayable: '₹4,14,000', status: 'COMPLETED', bank: 'SBI A/C XXXX9482 (UTR SBIN0048291)' },
  ]);

  // 5. Warehouse Allocation Choices
  const warehouses = [
    { id: 'WH-BR-001', name: 'Patna Granary', avail: '1,200 MT' },
    { id: 'WH-BR-002', name: 'Gaya Silo Complex', avail: '650 MT' },
    { id: 'WH-BR-004', name: 'Mithapur Storage Complex', avail: '2,400 MT (Selected)' },
  ];

  // Actions
  const approveProcurement = (lotId) => {
    setProcurementQueue(prev => prev.map(l => l.lotId === lotId ? { ...l, status: 'APPROVED' } : l));
    alert(`✅ Procurement Approved for Lot ${lotId}! Unique PO PO-2026-${Math.floor(1000+Math.random()*9000)} generated.`);
  };

  // Nav Items list matching user specification (14 items)
  const navItems = [
    { key: 'dashboard', label: '📊 Dashboard', icon: ShieldCheck },
    { key: 'queue', label: '📋 Procurement Queue', icon: FileText },
    { key: 'verification', label: '🔍 Lot & Farmer Verification', icon: CheckCircle2 },
    { key: 'pricing', label: '💰 Official Price Application', icon: DollarSign },
    { key: 'approvals', label: '✅ Procurement Approvals', icon: CheckCircle2 },
    { key: 'orders', label: '📜 Procurement Orders (PO)', icon: FileText },
    { key: 'settlement', label: '💳 Farmer Settlement', icon: Coins },
    { key: 'payments', label: '🏦 Payment Tracking', icon: DollarSign },
    { key: 'warehouse', label: '🏭 Warehouse Allocation', icon: Warehouse },
    { key: 'demand', label: '🏪 Buyer Demand Match', icon: Building2 },
    { key: 'disputes', label: '⚠️ Procurement Disputes', icon: AlertTriangle },
    { key: 'history', label: '📜 Farmer History', icon: Users },
    { key: 'reports', label: '📊 Reports & Analytics', icon: BarChart3 },
    { key: 'notifications', label: '🔔 Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4fb] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#0c2448] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-blue-900">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">GOI DPO GOVERNANCE</span>
          <span>AAGAM District Procurement Officer Management Portal • Central MSP Procurement Bridge</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Officer: <strong className="text-blue-300">{currentUser?.name || 'Officer Rajesh Kumar, DPO'}</strong></span>
          <span className="text-emerald-400">Target Achieved: 82.4%</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* Sidebar Navigation (Responsive Horizontal Scroll on Mobile, Vertical Sidebar on Desktop) */}
        <aside className="w-full md:w-64 bg-[#081830] text-slate-200 p-3 md:p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 border-b md:border-b-0 md:border-r border-blue-900 shadow-xl gap-1 md:space-y-1">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider border-b border-blue-800/80 mb-2">
            PROCUREMENT OFFICER DIRECTORY
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
                    ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30' 
                    : 'hover:bg-blue-900/60 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="hidden md:block pt-4 border-t border-blue-800/80 mt-4">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-blue-400" />
              <span>Back to Portal Home</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#f6f9fc]">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#081830]">PROCUREMENT OFFICER DASHBOARD</h2>
                  <p className="text-xs text-[#637554]">Real-time procurement queue, value calculations, and warehouse allocation overview</p>
                </div>
                <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  Total Value Procured: ₹1.28 Cr Today
                </span>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 font-mono text-xs">
                {[
                  { label: 'Pending Proc.', val: `${metrics.pendingProcurement} Lots`, sub: 'Awaiting Approval', color: 'blue' },
                  { label: 'Today Procured', val: `${metrics.todayProcurement} Lots`, sub: 'Confirmed Today', color: 'emerald' },
                  { label: 'Qty Procured', val: metrics.qtyProcured, sub: '524 MT Net', color: 'sky' },
                  { label: 'Total Value', val: metrics.procurementValue, sub: 'MSP Protected', color: 'purple' },
                  { label: 'Pending Appr.', val: `${metrics.pendingApprovals} Lots`, sub: 'Review Required', color: 'amber' },
                  { label: 'Payment Pend.', val: `${metrics.paymentPending} Cases`, sub: 'NPCI Processing', color: 'rose' },
                  { label: 'WH Allocated', val: `${metrics.warehouseAllocation} Lots`, sub: 'Storage Assigned', color: 'indigo' },
                ].map(card => (
                  <div key={card.label} className="bg-white border border-blue-100 rounded-2xl p-3.5 shadow-sm text-center">
                    <div className="text-[10px] font-extrabold uppercase text-[#637554] mb-1">{card.label}</div>
                    <div className="text-lg font-extrabold text-[#081830]">{card.val}</div>
                    <div className="text-[10px] text-[#637554] mt-1">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Operational Alerts */}
              <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm space-y-3 font-mono text-xs">
                <h3 className="font-extrabold text-sm text-[#081830] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>PROCUREMENT OPERATIONAL ALERTS</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { alert: 'Procurement Pending: 12 lots verified by Quality Inspector awaiting final procurement approval.', level: 'ACTION' },
                    { alert: 'Warehouse Allocation Required: 15 approved lots require designated silo allocation.', level: 'ACTION' },
                    { alert: 'Payment Processing: 9 DBT transactions currently in processing queue with SBI NPCI bridge.', level: 'INFO' },
                  ].map((a, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center text-blue-900">
                      <span>ℹ️ {a.alert}</span>
                      <span className="font-bold underline cursor-pointer text-[10px]">Review →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. PROCUREMENT QUEUE & LOT VERIFICATION */}
          {(activeTab === 'queue' || activeTab === 'verification' || activeTab === 'approvals') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#081830]">PROCUREMENT QUEUE & LOT VERIFICATION</h2>
              <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">
                  🔒 Restriction Rule: Officer applies system-configured MSP rates. Official price configuration cannot be changed here.
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#081830] text-white">
                    <tr>
                      <th className="p-3">Lot ID & Product</th>
                      <th className="p-3">Farmer & Mandi</th>
                      <th className="p-3">Quantity & Grade</th>
                      <th className="p-3">MSP Rate & Total Value</th>
                      <th className="p-3">Verifications</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {procurementQueue.map(q => (
                      <tr key={q.lotId} className="hover:bg-blue-50/40">
                        <td className="p-3 font-bold text-[#081830]">{q.lotId}<br/><span className="text-[#637554]">{q.product}</span></td>
                        <td className="p-3">{q.farmer}<br/><span className="text-[#637554]">{q.mandi}</span></td>
                        <td className="p-3 font-bold">{q.qty}<br/><span className="text-emerald-700">{q.grade}</span></td>
                        <td className="p-3 font-extrabold text-blue-900">₹{q.price}/Qtl<br/><span className="text-amber-800">{q.estValue}</span></td>
                        <td className="p-3 text-[10px]">
                          <span className="text-emerald-700 font-bold">✓ Farmer</span> • <span className="text-emerald-700 font-bold">✓ Weight</span> • <span className="text-emerald-700 font-bold">✓ Quality</span>
                        </td>
                        <td className="p-3 text-right">
                          {q.status !== 'APPROVED' ? (
                            <button onClick={() => approveProcurement(q.lotId)} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]">
                              Approve Procurement →
                            </button>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded">✓ APPROVED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PROCUREMENT ORDERS & FARMER SETTLEMENT */}
          {(activeTab === 'orders' || activeTab === 'settlement' || activeTab === 'payments') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#081830]">PROCUREMENT ORDERS & FARMER SETTLEMENT TRACKING</h2>
              <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm space-y-3">
                <table className="w-full text-left">
                  <thead className="bg-[#081830] text-white">
                    <tr>
                      <th className="p-3">PO Number & Lot</th>
                      <th className="p-3">Farmer</th>
                      <th className="p-3">Net Quantity</th>
                      <th className="p-3">Gross Value</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {payments.map(p => (
                      <tr key={p.payId}>
                        <td className="p-3 font-bold text-[#081830]">{p.poNumber}<br/><span className="text-[#637554]">{p.payId}</span></td>
                        <td className="p-3">{p.farmer}<br/><span className="text-[10px] text-[#637554]">{p.bank}</span></td>
                        <td className="p-3 font-bold">5,000 KG</td>
                        <td className="p-3 font-extrabold text-blue-900">{p.netPayable}</td>
                        <td className="p-3"><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{p.status}</span></td>
                        <td className="p-3 text-right">
                          <button onClick={() => alert(`Tracking payment status for ${p.payId}...`)} className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-[10px]">Track DBT</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. WAREHOUSE ALLOCATION */}
          {activeTab === 'warehouse' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#081830]">PRODUCE WAREHOUSE ALLOCATION</h2>
              <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">
                  🔒 Restriction Rule: Procurement Officer selects warehouse destination & creates receiving instruction. Physical inventory cannot be altered.
                </div>
                <div className="space-y-2">
                  {warehouses.map(w => (
                    <div key={w.id} className="p-3 bg-[#f6f9fc] border border-blue-100 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-extrabold text-[#081830]">{w.id} — {w.name}</div>
                        <div className="text-[#637554]">Available Storage Capacity: <strong className="text-emerald-700">{w.avail}</strong></div>
                      </div>
                      <button onClick={() => alert(`Allocated to ${w.id}`)} className="bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]">Select Warehouse</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'queue', 'verification', 'approvals', 'orders', 'settlement', 'payments', 'warehouse'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-blue-100 p-8 text-center space-y-3 shadow-sm font-mono">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">🏛️</div>
              <h3 className="text-base font-extrabold text-[#081830] uppercase">{activeTab.replace('_', ' ')} Officer Module</h3>
              <p className="text-xs text-[#637554]">District Procurement Officer lifecycle, price application, and settlement coordination active.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
