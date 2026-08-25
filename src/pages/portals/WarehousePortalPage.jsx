import React, { useState } from 'react';
import { 
  ChevronLeft, Warehouse, Package, Truck, Calendar, Clock, AlertTriangle, 
  CheckCircle2, XCircle, FileText, ArrowRight, ShieldCheck, RefreshCw, 
  MapPin, Layers, Ban, Lock, Bell, Search, Filter, Plus, ArrowUpRight, ArrowDownLeft, Download
} from 'lucide-react';

export default function WarehousePortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Dashboard Metrics
  const metrics = {
    totalInventory: '12,450 MT',
    totalValue: '₹30.19 Cr',
    availableCapacity: '4,200 MT',
    occupiedCapacity: '12,450 MT',
    utilization: 74,
    incomingLots: 18,
    pendingReceiving: 5,
    pendingDispatch: 7,
    damagedStock: '120 KG',
  };

  // 2. Incoming Arrivals & Receiving
  const [incomingProcurement, setIncomingProcurement] = useState([
    { lotId: 'LOT-2026-00045', crop: 'Wheat (Sharbati)', expectedQty: '500 Qtl', vehicle: 'HR-10-AB-9981', driver: 'Gurpreet Singh', mandi: 'Karnal Yard', time: '10:30 AM', status: 'EXPECTED', grade: 'Grade A (Assayed)' },
    { lotId: 'LOT-2026-00046', crop: 'Paddy (Basmati)', expectedQty: '800 Qtl', vehicle: 'PB-12-CD-4421', driver: 'Amarjit Kaur', mandi: 'Khanna APMC', time: '11:15 AM', status: 'ARRIVED', grade: 'Grade A (Assayed)' },
    { lotId: 'LOT-2026-00047', crop: 'Mustard (Bold)', expectedQty: '350 Qtl', vehicle: 'RJ-05-EF-7712', driver: 'Ramesh Sharma', mandi: 'Bharatpur Yard', time: '12:00 PM', status: 'EXPECTED', grade: 'Grade A (Assayed)' },
  ]);

  // 3. Storage Allocation Zones
  const [storageZones, setStorageZones] = useState([
    { zone: 'Zone A (Bulk Grain)', crop: 'Wheat', allocatedQty: '6,200 MT', cap: '8,000 MT', temp: '22°C', humidity: '54%', lots: ['LOT-001', 'LOT-002', 'LOT-005'] },
    { zone: 'Zone B (Paddy Silos)', crop: 'Paddy / Rice', allocatedQty: '4,100 MT', cap: '5,000 MT', temp: '21°C', humidity: '50%', lots: ['LOT-012', 'LOT-014'] },
    { zone: 'Zone C (Pulses & Oilseeds)', crop: 'Chana & Mustard', allocatedQty: '1,800 MT', cap: '3,000 MT', temp: '20°C', humidity: '48%', lots: ['LOT-022', 'LOT-025'] },
    { zone: 'Cold Storage 1', crop: 'Perishables', allocatedQty: '350 MT', cap: '660 MT', temp: '4°C', humidity: '85%', lots: ['LOT-030'] },
  ]);

  // 4. Inventory Records (FIFO / Status Tracking)
  const [inventory, setInventory] = useState([
    { id: 'INV-1001', lotId: 'LOT-2026-00010', crop: 'Wheat (Sharbati)', source: 'Gurpreet Singh (Karnal)', recQty: '500 Qtl', availQty: '350 Qtl', resQty: '150 Qtl', dispQty: '0 Qtl', damagedQty: '0 KG', grade: 'Grade A', zone: 'Zone A - Bin 04', date: '20-Aug-2026', ageDays: 5, status: 'RESERVED' },
    { id: 'INV-1002', lotId: 'LOT-2026-00014', crop: 'Paddy Basmati', source: 'Amarjit Kaur (Ludhiana)', recQty: '800 Qtl', availQty: '800 Qtl', resQty: '0 Qtl', dispQty: '0 Qtl', damagedQty: '0 KG', grade: 'Grade A', zone: 'Zone B - Silo 02', date: '22-Aug-2026', ageDays: 3, status: 'AVAILABLE' },
    { id: 'INV-1003', lotId: 'LOT-2026-00018', crop: 'Mustard Bold', source: 'Vijay Patil (Latur)', recQty: '350 Qtl', availQty: '350 Qtl', resQty: '0 Qtl', dispQty: '0 Qtl', damagedQty: '0 KG', grade: 'Grade A', zone: 'Zone C - Bin 01', date: '23-Aug-2026', ageDays: 2, status: 'STORED' },
    { id: 'INV-1004', lotId: 'LOT-2026-00022', crop: 'Chana Desi', source: 'Ramesh Sharma (Bharatpur)', recQty: '200 Qtl', availQty: '0 Qtl', resQty: '0 Qtl', dispQty: '200 Qtl', damagedQty: '0 KG', grade: 'Grade B', zone: 'Zone C - Bin 02', date: '15-Aug-2026', ageDays: 10, status: 'DISPATCHED' },
  ]);

  // 5. Stock Movement Log
  const [stockMovements, setStockMovements] = useState([
    { id: 'MOV-9901', lotId: 'LOT-2026-00010', crop: 'Wheat', from: 'Loading Dock A', to: 'Zone A - Bin 04', qty: '500 Qtl', reason: 'Initial Receiving', by: 'Deepak Sharma (WM)', time: '20-Aug-2026 10:15 AM' },
    { id: 'MOV-9902', lotId: 'LOT-2026-00022', crop: 'Chana Desi', from: 'Zone C - Bin 02', to: 'Dispatch Bay 2', qty: '200 Qtl', reason: 'Approved Dispatch', by: 'Deepak Sharma (WM)', time: '24-Aug-2026 02:40 PM' },
    { id: 'MOV-9903', lotId: 'LOT-2026-00008', crop: 'Wheat', from: 'Zone A - Bin 01', to: 'Quarantine Yard', qty: '120 KG', reason: 'Moisture Spoilage', by: 'Deepak Sharma (WM)', time: '25-Aug-2026 09:30 AM' },
  ]);

  // 6. Approved Dispatch Orders
  const [dispatchOrders, setDispatchOrders] = useState([
    { id: 'ORD-1052', buyer: 'Punjab Agri Corp', crop: 'Wheat', reqQty: '5,000 KG', avail: '8,500 KG', reserved: '5,000 KG', deadline: '26-Aug-2026', vehicle: 'PB-10-XX-4891', status: 'READY FOR DISPATCH' },
    { id: 'ORD-1053', buyer: 'Adani Agri Logistics', crop: 'Paddy Basmati', reqQty: '10,000 KG', avail: '18,000 KG', reserved: '10,000 KG', deadline: '27-Aug-2026', vehicle: 'HR-12-YY-1122', status: 'STOCK RESERVED' },
  ]);

  // 7. Damaged Stock Quarantine
  const [damagedStock, setDamagedStock] = useState([
    { id: 'DMG-4401', lotId: 'LOT-2026-00008', crop: 'Wheat', qty: '120 KG', reason: 'Moisture Damage', date: '25-Aug-2026', status: 'QUARANTINED', inspectionReq: 'Pending Officer Review' },
  ]);

  // 8. Physical Reconciliation Data
  const [reconciliations, setReconciliations] = useState([
    { lotId: 'LOT-2026-00010', crop: 'Wheat', sysQty: '35,000 KG', physQty: '34,950 KG', diff: '-50 KG', reason: 'Natural Moisture Loss', status: 'DISCREPANCY REPORTED' },
    { lotId: 'LOT-2026-00014', crop: 'Paddy Basmati', sysQty: '80,000 KG', physQty: '80,000 KG', diff: '0 KG', reason: 'Match Exact', status: 'VERIFIED MATCH' },
  ]);

  // Handlers
  const confirmReceiving = (lotId) => {
    setIncomingProcurement(prev => prev.map(l => l.lotId === lotId ? { ...l, status: 'RECEIVED' } : l));
    alert(`✅ Goods Receiving Note (GRN) generated for ${lotId}. Physical receiving confirmed.`);
  };

  const confirmDispatch = (orderId) => {
    setDispatchOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'DISPATCHED' } : o));
    alert(`🚚 Dispatch Note generated for ${orderId}. Stock loaded and inventory updated.`);
  };

  // Nav Items list matching user specification (14 items)
  const navItems = [
    { key: 'dashboard', label: '📊 Dashboard', icon: Warehouse },
    { key: 'incoming', label: '⬇ Incoming Stock', icon: ArrowDownLeft },
    { key: 'receiving', label: '🧾 Goods Receiving (GRN)', icon: CheckCircle2 },
    { key: 'inventory', label: '📦 Inventory Records', icon: Package },
    { key: 'storage', label: '🧱 Storage Locations & Zones', icon: Layers },
    { key: 'movement', label: '🔄 Stock Movement Log', icon: RefreshCw },
    { key: 'reservations', label: '🔒 Stock Reservations', icon: Lock },
    { key: 'dispatch', label: '📋 Approved Dispatch Orders', icon: FileText },
    { key: 'loading', label: '🚚 Loading & Dispatch', icon: Truck },
    { key: 'damaged', label: '⚠️ Damaged & Quarantine', icon: AlertTriangle },
    { key: 'reconciliation', label: '⚖️ Physical Reconciliation', icon: RefreshCw },
    { key: 'capacity', label: '📈 Warehouse Capacity', icon: Layers },
    { key: 'documents', label: '📄 Warehouse Documents', icon: FileText },
    { key: 'reports', label: '📊 Reports & Analytics', icon: ArrowUpRight },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#1f3a24] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">WDRA REGISTERED</span>
          <span>AAGAM Central Silo & Granary Terminal • FCI & CWC Authorized Granary #CWC-HR-048</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Manager: <strong className="text-emerald-300">{currentUser?.name || 'Deepak Sharma'}</strong></span>
          <span className="text-amber-300 font-bold">Capacity: 74% Occupied</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#142618] text-slate-200 p-4 space-y-1 overflow-y-auto shrink-0 border-r border-emerald-900 shadow-xl">
          <div className="px-3 py-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-800/80 mb-2">
            WAREHOUSE MANAGER NAVIGATION
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
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/30' 
                    : 'hover:bg-emerald-900/60 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-emerald-800/80 mt-4">
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
        <main className="flex-1 p-6 overflow-y-auto bg-[#f8fbf8]">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#142618]">WAREHOUSE DASHBOARD</h2>
                  <p className="text-xs text-[#637554]">Real-time storage, stock movements, and inventory allocation overview</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  WDRA Certified • 12,450 MT Stored
                </span>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 font-mono text-xs">
                {[
                  { label: 'Total Inventory', val: metrics.totalInventory, sub: metrics.totalValue, color: 'emerald', icon: Package },
                  { label: 'Available Cap.', val: metrics.availableCapacity, sub: '4,200 MT Remaining', color: 'sky', icon: Warehouse },
                  { label: 'Utilization', val: `${metrics.utilization}%`, sub: '74% Occupied', color: 'purple', icon: Layers },
                  { label: 'Incoming Lots', val: `${metrics.incomingLots} Lots`, sub: '5 Receiving Pending', color: 'amber', icon: ArrowDownLeft },
                  { label: 'Pending Dispatch', val: `${metrics.pendingDispatch} Orders`, sub: 'Ready for Loading', color: 'indigo', icon: Truck },
                  { label: 'Damaged Stock', val: metrics.damagedStock, sub: 'Quarantined', color: 'rose', icon: AlertTriangle },
                ].map(card => {
                  const CIcon = card.icon;
                  return (
                    <div key={card.label} className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase text-[#637554]">{card.label}</span>
                        <CIcon className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div className="text-lg font-extrabold text-[#142618]">{card.val}</div>
                      <div className="text-[10px] text-[#637554] mt-1">{card.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Warehouse Alerts List */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3 font-mono text-xs">
                <h3 className="font-extrabold text-sm text-[#142618] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>CRITICAL WAREHOUSE ALERTS</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { alert: 'Storage Capacity Warning: Zone A is at 77.5% capacity. Reallocate incoming Wheat to Zone B.', level: 'WARNING' },
                    { alert: 'Pending Receiving: 5 trucks waiting at Receiving Gate #02 for GRN verification.', level: 'ACTION' },
                    { alert: 'Aging Inventory Alert: Lot LOT-2026-00004 (Wheat) has reached 45 days in storage.', level: 'NOTICE' },
                    { alert: 'Damaged Stock Quarantined: 120 KG Wheat isolated in Bay Q-1 (Moisture Spoilage).', level: 'WARNING' },
                  ].map((a, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${a.level === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' : a.level === 'ACTION' ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                      <span>⚠️ {a.alert}</span>
                      <span className="font-extrabold text-[10px] underline cursor-pointer">View Details →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. INCOMING STOCK & RECEIVING */}
          {(activeTab === 'incoming' || activeTab === 'receiving') && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#142618]">INCOMING PRODUCE RECEIVING & VERIFICATION</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3 font-mono text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">
                  🔒 Restriction Rule: The Warehouse Manager verifies physical weight and generates GRN. Quality Grade cannot be altered.
                </div>
                <div className="space-y-2">
                  {incomingProcurement.map(lot => (
                    <div key={lot.lotId} className="border border-emerald-100 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
                      <div>
                        <div className="font-extrabold text-sm text-[#142618]">{lot.lotId} — {lot.crop}</div>
                        <div className="text-[#637554]">Expected: <strong>{lot.expectedQty}</strong> • Vehicle: {lot.vehicle} ({lot.driver})</div>
                        <div className="text-[#637554]">Source Mandi: {lot.mandi} • Grade: <span className="text-emerald-700 font-bold">{lot.grade}</span></div>
                      </div>
                      <div className="flex gap-2">
                        {lot.status !== 'RECEIVED' ? (
                          <button onClick={() => confirmReceiving(lot.lotId)} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl">
                            Confirm Receiving & Issue GRN
                          </button>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-xl">✓ RECEIVED & GRN ISSUED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. INVENTORY & STORAGE ZONES */}
          {(activeTab === 'inventory' || activeTab === 'storage') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#142618]">INVENTORY & STORAGE ZONE ALLOCATION</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#142618] text-white">
                    <tr>
                      <th className="p-3">Lot ID & Product</th>
                      <th className="p-3">Source Farmer</th>
                      <th className="p-3">Received / Available</th>
                      <th className="p-3">Quality Grade</th>
                      <th className="p-3">Storage Location</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {inventory.map(inv => (
                      <tr key={inv.id} className="hover:bg-emerald-50/40">
                        <td className="p-3 font-bold text-[#142618]">{inv.lotId}<br/><span className="text-[#637554] font-normal">{inv.crop}</span></td>
                        <td className="p-3 text-[#637554]">{inv.source}</td>
                        <td className="p-3 font-bold">{inv.availQty} <span className="text-[10px] text-[#637554]">(Rec: {inv.recQty})</span></td>
                        <td className="p-3 font-bold text-emerald-700">{inv.grade}</td>
                        <td className="p-3">{inv.zone}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${inv.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'RESERVED' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. STOCK MOVEMENT LOG */}
          {activeTab === 'movement' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#142618]">PHYSICAL STOCK MOVEMENT AUDIT TRAIL</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <table className="w-full text-left">
                  <thead className="bg-[#142618] text-white">
                    <tr>
                      <th className="p-3">Movement ID & Time</th>
                      <th className="p-3">Lot ID & Crop</th>
                      <th className="p-3">From ➔ To Location</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Performed By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {stockMovements.map(m => (
                      <tr key={m.id} className="hover:bg-emerald-50/40">
                        <td className="p-3 font-bold text-[#142618]">{m.id}<br/><span className="text-[10px] text-[#637554]">{m.time}</span></td>
                        <td className="p-3 font-bold">{m.lotId}<br/><span className="text-[#637554]">{m.crop}</span></td>
                        <td className="p-3">{m.from} ➔ <strong className="text-emerald-700">{m.to}</strong></td>
                        <td className="p-3 font-bold">{m.qty}</td>
                        <td className="p-3 text-[#637554]">{m.reason}</td>
                        <td className="p-3">{m.by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. DISPATCH ORDERS & RESERVATIONS */}
          {(activeTab === 'dispatch' || activeTab === 'loading' || activeTab === 'reservations') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#142618]">APPROVED DISPATCH ORDERS & LOADING</h2>
              <div className="space-y-3">
                {dispatchOrders.map(order => (
                  <div key={order.id} className="bg-white border border-emerald-100 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3 shadow-sm">
                    <div>
                      <div className="font-extrabold text-sm text-[#142618]">{order.id} — Buyer: {order.buyer}</div>
                      <div className="text-[#637554]">Product: <strong>{order.crop}</strong> • Required: {order.reqQty} • Reserved: {order.reserved}</div>
                      <div className="text-[#637554]">Vehicle: {order.vehicle} • Deadline: {order.deadline}</div>
                    </div>
                    <div>
                      {order.status !== 'DISPATCHED' ? (
                        <button onClick={() => confirmDispatch(order.id)} className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-2 rounded-xl">
                          Confirm Loading & Issue Dispatch Note →
                        </button>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-xl">✓ DISPATCHED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. DAMAGED / QUARANTINE STOCK */}
          {activeTab === 'damaged' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#142618]">DAMAGED & QUARANTINED STOCK WORKFLOW</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 font-bold">
                  🔒 Permission Rule: Damaged stock cannot be deleted independently. All adjustments create an audit record and require authorization.
                </div>
                {damagedStock.map(d => (
                  <div key={d.id} className="p-3 bg-[#f8fbf8] border border-emerald-100 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#142618]">{d.id} — {d.crop} ({d.lotId})</div>
                      <div className="text-[#637554]">Quantity: {d.qty} • Reason: <strong className="text-red-700">{d.reason}</strong></div>
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded">{d.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PHYSICAL RECONCILIATION */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#142618]">PHYSICAL VS SYSTEM INVENTORY RECONCILIATION</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <table className="w-full text-left">
                  <thead className="bg-[#142618] text-white">
                    <tr>
                      <th className="p-3">Lot ID & Crop</th>
                      <th className="p-3">System Qty</th>
                      <th className="p-3">Physical Count Qty</th>
                      <th className="p-3">Discrepancy Difference</th>
                      <th className="p-3">Reason / Remarks</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {reconciliations.map(r => (
                      <tr key={r.lotId}>
                        <td className="p-3 font-bold text-[#142618]">{r.lotId}<br/><span className="text-[#637554]">{r.crop}</span></td>
                        <td className="p-3 font-bold">{r.sysQty}</td>
                        <td className="p-3 font-bold">{r.physQty}</td>
                        <td className="p-3 font-extrabold text-red-700">{r.diff}</td>
                        <td className="p-3 text-[#637554]">{r.reason}</td>
                        <td className="p-3"><span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. WAREHOUSE CAPACITY MANAGEMENT */}
          {activeTab === 'capacity' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#142618]">WAREHOUSE CAPACITY & ZONE UTILIZATION</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-4">
                {storageZones.map(z => {
                  const used = parseInt(z.allocatedQty.replace(/[^0-9]/g, ''));
                  const cap = parseInt(z.cap.replace(/[^0-9]/g, ''));
                  const pct = Math.round((used / cap) * 100);
                  return (
                    <div key={z.zone} className="space-y-1">
                      <div className="flex justify-between font-bold text-[#142618]">
                        <span>{z.zone} ({z.crop})</span>
                        <span>{z.allocatedQty} / {z.cap} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#e2ece2] h-3 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct > 80 ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="text-[10px] text-[#637554]">Climate: {z.temp} • Humidity: {z.humidity} • Lots: {z.lots.join(', ')}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. DOCUMENTS & REPORTS */}
          {(activeTab === 'documents' || activeTab === 'reports') && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#142618]">WAREHOUSE DOCUMENTS & REPORTS</h2>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-2">
                {[
                  { name: 'Goods Receiving Note (GRN) — GRN-2026-4821', date: '25 Aug 2026', type: 'PDF' },
                  { name: 'Official Warehouse Receipt (e-NWR) — CWC-NWR-9981', date: '24 Aug 2026', type: 'PDF' },
                  { name: 'Stock Transfer Note — STN-1002', date: '23 Aug 2026', type: 'PDF' },
                  { name: 'Stock Reconciliation & Loss Audit — AUD-REC-04', date: '22 Aug 2026', type: 'Excel' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 bg-[#f8fbf8] border border-emerald-100 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#142618]">{doc.name}</div>
                      <div className="text-[#637554]">{doc.date} • Format: {doc.type}</div>
                    </div>
                    <button onClick={() => alert(`Downloading ${doc.name}...`)} className="bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
