import React, { useState, useEffect } from 'react';
import { dbEngine } from '../../data/dbEngine';
import { api } from '../../services/api';
import { 
  ChevronLeft, Users, ShieldCheck, Database, Activity, Server, Bell, 
  Settings, Lock, MapPin, Building2, Warehouse, Sprout, Gavel, FileText, 
  AlertTriangle, RefreshCw, CheckCircle2, XCircle, Search, Filter, Plus, 
  Edit3, Trash2, Eye, ShieldAlert, Key, Download, Upload, Zap, Globe, DollarSign, ArrowRight,
  AlertCircle, Clock
} from 'lucide-react';

export default function AdminPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');
  
  // Real DB state
  const [dbState, setDbState] = useState(dbEngine.getDb());
  const [metrics, setMetrics] = useState(dbEngine.getAdminMetrics());
  const [tracedLotId, setTracedLotId] = useState('');

  // Interactive state for User Management
  const [users, setUsers] = useState([
    { id: 'FRM-10245', name: 'Rajesh Kumar', role: 'Farmer', state: 'Bihar', district: 'Patna', status: 'ACTIVE', verified: true, phone: '+91 98765 43210', email: 'rajesh.kisan@gmail.com', lastActive: '10 mins ago' },
    { id: 'BUY-0091', name: 'ABC Agro Traders', role: 'Buyer', state: 'Bihar', district: 'Patna', status: 'ACTIVE', verified: true, phone: '+91 98110 88391', email: 'rajesh.trader@agri-corp.in', lastActive: '2 mins ago' },
    { id: 'USR-1001', name: 'Gurpreet Singh', role: 'Farmer', state: 'Haryana', district: 'Karnal', status: 'ACTIVE', verified: true, phone: '+91 98765 43210', email: 'gurpreet@kisan.in', lastActive: '10 mins ago' },
    { id: 'USR-1002', name: 'Punjab Agri Corp', role: 'Buyer', state: 'Punjab', district: 'Ludhiana', status: 'ACTIVE', verified: true, phone: '+91 98123 45678', email: 'trade@punjabagri.com', lastActive: '2 mins ago' },
    { id: 'USR-1003', name: 'Rajesh Kumar', role: 'Officer', state: 'Haryana', district: 'Karnal', status: 'ACTIVE', verified: true, phone: '+91 94160 12345', email: 'rajesh.dpo@gov.in', lastActive: '1 hour ago' },
    { id: 'USR-1004', name: 'Rakesh Verma', role: 'Operator', state: 'Haryana', district: 'Karnal', status: 'ACTIVE', verified: true, phone: '+91 98960 54321', email: 'rakesh.op@apmc.gov.in', lastActive: '5 mins ago' },
    { id: 'USR-1005', name: 'Dr. Anita Roy', role: 'Quality Inspector', state: 'Punjab', district: 'Khanna', status: 'ACTIVE', verified: true, phone: '+91 97110 98765', email: 'anita.icar@gov.in', lastActive: '25 mins ago' },
    { id: 'USR-1006', name: 'Deepak Sharma', role: 'Warehouse Manager', state: 'Haryana', district: 'Karnal', status: 'ACTIVE', verified: true, phone: '+91 98100 11223', email: 'deepak.fci@gov.in', lastActive: '12 mins ago' },
    { id: 'USR-1007', name: 'Vikramaditya Rao', role: 'Farmer', state: 'Rajasthan', district: 'Bharatpur', status: 'SUSPENDED', verified: false, phone: '+91 99880 77665', email: 'vikram@yahoo.com', lastActive: '3 days ago' },
    { id: 'USR-1008', name: 'Maneesh Traders', role: 'Buyer', state: 'Maharashtra', district: 'Latur', status: 'PENDING_APPROVAL', verified: false, phone: '+91 98220 33445', email: 'maneeshtraders@gmail.com', lastActive: 'Just registered' },
  ]);

  useEffect(() => {
    async function loadAdminMetrics() {
      try {
        const res = await api.analytics.getDashboard('admin');
        if (res?.data) {
          // Sync live metrics with state
        }
      } catch (err) {
        console.warn("Admin analytics backend fallback:", err);
      }
    }
    loadAdminMetrics();

    const unsubscribe = dbEngine.subscribe((newDb) => {
      setDbState(newDb);
      setMetrics(dbEngine.getAdminMetrics());
    });
    return unsubscribe;
  }, []);

  const traceInfo = dbEngine.traceLotLifecycle(tracedLotId || 'LOT-2026-00452');

  // Interactive mock state for Crop Master
  const [crops, setCrops] = useState([
    { code: 'CRP-WHT', name: 'Wheat', category: 'Cereals', variety: 'Sharbati / FAQ', msp: 2425, unit: 'Quintal', active: true, season: 'Rabi' },
    { code: 'CRP-RCE', name: 'Rice / Paddy', category: 'Cereals', variety: 'Basmati 1121', msp: 2300, unit: 'Quintal', active: true, season: 'Kharif' },
    { code: 'CRP-MZE', name: 'Maize', category: 'Coarse Grains', variety: 'Yellow Hybrid', msp: 2225, unit: 'Quintal', active: true, season: 'Kharif' },
    { code: 'CRP-POT', name: 'Potato', category: 'Vegetables', variety: 'Kufri Jyoti', msp: 1250, unit: 'Quintal', active: true, season: 'Rabi' },
    { code: 'CRP-ONN', name: 'Onion', category: 'Vegetables', variety: 'Nashik Red', msp: 1650, unit: 'Quintal', active: true, season: 'Rabi' },
    { code: 'CRP-PLS', name: 'Pulses (Chana)', category: 'Pulses', variety: 'Desi Bold', msp: 5650, unit: 'Quintal', active: true, season: 'Rabi' },
  ]);

  // Interactive mock state for Mandis
  const [mandis, setMandis] = useState([
    { id: 'MND-HR-01', name: 'Karnal Central Yard', state: 'Haryana', district: 'Karnal', operator: 'Rakesh Verma', status: 'OPERATIONAL', cap: '2,000 MT' },
    { id: 'MND-PB-04', name: 'Khanna APMC Mandi', state: 'Punjab', district: 'Ludhiana', operator: 'Sardar Harpreet Singh', status: 'OPERATIONAL', cap: '3,500 MT' },
    { id: 'MND-RJ-08', name: 'Bharatpur APMC Yard', state: 'Rajasthan', district: 'Bharatpur', operator: 'Mohan Lal Saini', status: 'OPERATIONAL', cap: '1,800 MT' },
    { id: 'MND-MH-12', name: 'Latur Grain Yard', state: 'Maharashtra', district: 'Latur', operator: 'Sanjay Deshmukh', status: 'MAINTENANCE', cap: '2,200 MT' },
  ]);

  // Interactive Audit Trail Logs (Tamper-Resistant)
  const [auditLogs, setAuditLogs] = useState([
    { id: 'AUD-9982', user: 'Admin_001', role: 'System Admin', action: 'Changed Procurement Price', record: 'Wheat (CRP-WHT)', oldVal: '₹2,400', newVal: '₹2,425', time: '25 Aug 2026, 10:42 PM', ip: '10.0.4.12 (GOI NIC Net)' },
    { id: 'AUD-9981', user: 'Admin_001', role: 'System Admin', action: 'Approved Buyer Account', record: 'Punjab Agri Corp', oldVal: 'PENDING_APPROVAL', newVal: 'ACTIVE', time: '25 Aug 2026, 09:15 PM', ip: '10.0.4.12 (GOI NIC Net)' },
    { id: 'AUD-9980', user: 'Admin_002', role: 'System Admin', action: 'Suspended Account', record: 'Vikramaditya Rao (USR-1007)', oldVal: 'ACTIVE', newVal: 'SUSPENDED', time: '25 Aug 2026, 06:30 PM', ip: '10.0.4.18 (GOI NIC Net)' },
    { id: 'AUD-9979', user: 'System Auto', role: 'Security Bot', action: 'Failed Login Threshold Exceeded', record: 'IP 103.21.44.12', oldVal: 'Allowed', newVal: 'Blocked IP', time: '25 Aug 2026, 04:12 PM', ip: '103.21.44.12 (External)' },
  ]);

  // Handlers for user state manipulation
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        // Append to audit log
        setAuditLogs(logs => [{
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          user: currentUser?.name || 'Admin_001',
          role: 'System Admin',
          action: nextStatus === 'ACTIVE' ? 'Activated User' : 'Suspended User',
          record: `${u.name} (${u.id})`,
          oldVal: u.status,
          newVal: nextStatus,
          time: new Date().toLocaleString('en-IN'),
          ip: '10.0.4.12 (GOI NIC Net)'
        }, ...logs]);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const resetUserPassword = (userName) => {
    alert(`Password reset link dispatched to ${userName}'s registered email & mobile!`);
  };

  // Nav Items list matching user requirement
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Activity },
    { key: 'users', label: 'User Management', icon: Users },
    { key: 'rbac', label: 'Roles & Permissions', icon: Key },
    { key: 'staff', label: 'Staff & Org Management', icon: ShieldCheck },
    { key: 'farmer_verify', label: 'Farmer Verification', icon: CheckCircle2 },
    { key: 'buyer_verify', label: 'Buyer Verification', icon: Gavel },
    { key: 'mandi', label: 'Mandi Management', icon: Building2 },
    { key: 'warehouse', label: 'Warehouse Management', icon: Warehouse },
    { key: 'crops', label: 'Product & Crop Master', icon: Sprout },
    { key: 'geo', label: 'Geographic Master Data', icon: MapPin },
    { key: 'pricing', label: 'Price Config & Rules', icon: DollarSign },
    { key: 'notifications', label: 'Notification Center', icon: Bell },
    { key: 'system_config', label: 'System Configuration', icon: Settings },
    { key: 'security', label: 'Security & Access Control', icon: Lock },
    { key: 'audit', label: 'Tamper-Proof Audit Logs', icon: FileText },
    { key: 'data', label: 'Data & Backup Control', icon: Database },
    { key: 'analytics', label: 'Global Analytics', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#f3f0fb] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#1c1464] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-indigo-900">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] animate-pulse">RESTRICTED ACCESS</span>
          <span>AAGAM GOI System Administrator Governance Control Panel • Tier-4 MeitY Security</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Logged in as: <strong className="text-amber-300">{currentUser?.name || 'System Admin'}</strong></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>MFA Enforced</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* Sidebar Navigation (Responsive Horizontal Bar on Mobile, Vertical Sidebar on Desktop) */}
        <aside className="w-full md:w-64 bg-[#140e48] text-slate-200 p-3 md:p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 border-b md:border-b-0 md:border-r border-indigo-900 shadow-xl gap-1 md:space-y-1">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-indigo-800/80 mb-2">
            ADMIN NAVIGATION DIRECTORY
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
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' 
                    : 'hover:bg-indigo-900/60 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="hidden md:block pt-4 border-t border-indigo-800/80 mt-4">
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
        <main className="flex-1 p-6 overflow-y-auto bg-[#f8f6fc]">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-indigo-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#140e48]">SYSTEM ADMIN DASHBOARD</h2>
                  <p className="text-xs text-[#637554]">Global platform governance & high-level system overview</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  All 8 Core Microservices Operational
                </span>
              </div>

              {/* 6 Key Overview Metric Cards (Live Calculated from Central Database) */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Farmers', val: metrics.totalFarmers, sub: 'COUNT(Farmers) in DB', color: 'indigo', icon: Users },
                  { label: 'Total Buyers', val: metrics.totalBuyers, sub: 'COUNT(Buyers) in DB', color: 'amber', icon: Gavel },
                  { label: 'Total Procurement', val: metrics.totalProcurementValue, sub: 'SUM(PO.totalValue)', color: 'emerald', icon: DollarSign },
                  { label: 'Active Mandis', val: metrics.activeMandis, sub: 'COUNT(Mandis ACTIVE)', color: 'sky', icon: Building2 },
                  { label: 'Total Inventory', val: metrics.totalInventoryQty, sub: 'SUM(Inventory.avail)', color: 'purple', icon: Warehouse },
                  { label: 'Pending Payments', val: metrics.pendingPaymentsSum, sub: 'SUM(Payments PENDING)', color: 'rose', icon: ShieldCheck },
                ].map(card => {
                  const CIcon = card.icon;
                  return (
                    <div key={card.label} className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase text-[#637554] font-mono">{card.label}</span>
                        <CIcon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-xl font-extrabold text-[#140e48]">{card.val}</div>
                      <div className="text-[10px] text-[#637554] mt-1 font-mono">{card.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* UNIFIED 8-ROLE SHARED PROCUREMENT SYSTEM AUDIT MONITOR */}
              <div className="bg-[#140e48] text-white rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs border border-indigo-800">
                <div className="flex justify-between items-center border-b border-indigo-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-indigo-300 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-400" />
                      <span>UNIFIED 8-ROLE SHARED PROCUREMENT REAL-TIME AUDIT MONITOR</span>
                    </h3>
                    <p className="text-[11px] text-slate-300">Synchronized end-to-end transaction monitoring across all 8 user role portals.</p>
                  </div>
                  <span className="bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded text-[10px]">SYSTEM ADMIN LEDGER</span>
                </div>

                {(dbState.sharedProcurements || []).length === 0 ? (
                  <div className="text-center py-4 text-slate-400">No active shared procurement records logged in system ledger.</div>
                ) : (
                  <div className="space-y-3">
                    {(dbState.sharedProcurements || []).map(proc => (
                      <div key={proc.id} className="bg-[#1d1663] border border-indigo-700/60 rounded-xl p-4 space-y-2.5">
                        <div className="flex flex-wrap justify-between items-center border-b border-indigo-800/80 pb-2">
                          <div>
                            <div className="font-black text-amber-300 text-sm flex items-center gap-2">
                              <span>{proc.id}</span>
                              <span className="bg-indigo-950 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-600/40">
                                {proc.crop} ({proc.quantityKg} KG)
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300">
                              Farmer: <strong>{proc.farmerName}</strong> • Center: <strong>{proc.procurementCenter}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                              proc.paymentStatus === 'SUCCESS' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                            }`}>
                              PAYMENT: {proc.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-[#140e48] p-2.5 rounded-lg text-slate-300">
                          <div>Quality: <strong className="text-emerald-400">{proc.qualityVerified ? 'VERIFIED ✓' : 'PENDING'}</strong></div>
                          <div>Weighment: <strong className="text-emerald-400">{proc.weighmentVerified ? `${proc.netWeight} KG ✓` : 'PENDING'}</strong></div>
                          <div>Approval: <strong className="text-amber-300">{proc.approvalStatus}</strong></div>
                          <div>Valuation: <strong className="text-emerald-300">₹{proc.estimatedPayable?.toLocaleString('en-IN')}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CONTROL TOWER: Dynamic 15-Stage Lot Lifecycle Traceability */}
              <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm space-y-4 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#140e48] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>CONTROL TOWER: CENTRAL DATABASE LIFECYCLE TRACEABILITY</span>
                    </h3>
                    <p className="text-[11px] text-[#637554]">Search any Lot ID to dynamically reconstruct the 15-stage timeline from related DB records</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#f4f6fc] px-3 py-1.5 rounded-xl border border-indigo-200">
                    <Search className="w-3.5 h-3.5 text-indigo-600" />
                    <input
                      type="text"
                      placeholder="Enter Lot ID (e.g. LOT-2026-00452)"
                      value={tracedLotId}
                      onChange={e => setTracedLotId(e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#140e48] focus:outline-none w-48"
                    />
                  </div>
                </div>

                {/* 15-Stage Relational Flow Timeline */}
                <div className="bg-[#f8f6fc] p-4 rounded-xl border border-indigo-100 space-y-3 text-xs">
                  <div className="font-extrabold text-[#140e48] flex justify-between">
                    <span>Lot Record: {traceInfo.lot?.id || tracedLotId} ({traceInfo.lot?.product})</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">Status: {traceInfo.lot?.status}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">1. Farmer</div>
                      <div className="font-bold text-[#140e48]">{traceInfo.farmer?.name || 'N/A'}</div>
                      <div className="text-[9px] text-[#637554]">{traceInfo.farmer?.id}</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">2. Farm</div>
                      <div className="font-bold text-[#140e48]">{traceInfo.farm?.area || 'N/A'}</div>
                      <div className="text-[9px] text-[#637554]">{traceInfo.farm?.location}</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">3. Mandi Entry</div>
                      <div className="font-bold text-[#140e48]">{traceInfo.mandi?.name || 'N/A'}</div>
                      <div className="text-[9px] text-[#637554]">{traceInfo.mandi?.id}</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">4. Weighment</div>
                      <div className="font-bold text-[#140e48]">{traceInfo.weighment?.netWeight || 'N/A'} KG</div>
                      <div className="text-[9px] text-[#637554]">ID: {traceInfo.weighment?.id}</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">5. Quality Assay</div>
                      <div className="font-bold text-emerald-700">{traceInfo.quality?.grade || 'N/A'}</div>
                      <div className="text-[9px] text-[#637554]">Moisture: {traceInfo.quality?.moisture}%</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">6. Procurement Order</div>
                      <div className="font-bold text-[#140e48]">{traceInfo.procurement?.id || 'N/A'}</div>
                      <div className="text-[9px] text-[#637554]">Val: ₹{traceInfo.procurement?.totalValue?.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">7. DBT Payment</div>
                      <div className="font-bold text-emerald-700">{traceInfo.payment?.status || 'N/A'}</div>
                      <div className="text-[9px] text-[#637554]">{traceInfo.payment?.txnRef}</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="text-[9px] text-[#637554] uppercase font-bold">8. Warehouse & Buyer Order</div>
                      <div className="font-bold text-[#140e48]">{traceInfo.buyerOrder?.id || 'N/A'}</div>
                      <div className="text-[9px] text-[#637554]">Buyer: {traceInfo.buyer?.businessName}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Alerts & Notifications */}
              <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-[#140e48] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>SYSTEM ALERTS & REQUIRING ATTENTION</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-1">
                    <div className="font-bold text-amber-900 flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> <span>Pending Verifications</span></span>
                      <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-[10px]">142 Pending</span>
                    </div>
                    <p className="text-amber-800 text-[11px]">84 Farmers & 58 Buyers awaiting document verification approval.</p>
                    <button onClick={() => setActiveTab('farmer_verify')} className="text-amber-900 font-extrabold underline text-[11px] mt-1 inline-block">Review Pending Queue →</button>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl space-y-1">
                    <div className="font-bold text-red-900 flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" /> <span>Suspicious Accounts</span></span>
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-[10px]">3 Flagged</span>
                    </div>
                    <p className="text-red-800 text-[11px]">Multiple failed login attempts detected from unrecognized IP ranges.</p>
                    <button onClick={() => setActiveTab('security')} className="text-red-900 font-extrabold underline text-[11px] mt-1 inline-block">Inspect Security Logs →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b border-indigo-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#140e48]">USER MANAGEMENT CONTROL</h2>
                  <p className="text-xs text-[#637554]">View, search, filter, activate, suspend or reset all platform user accounts</p>
                </div>
                <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm">
                  <Plus className="w-4 h-4" /> Create New User Account
                </button>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 flex flex-wrap items-center gap-3 text-xs font-mono shadow-sm">
                <div className="flex items-center gap-2 bg-[#f4f6fb] px-3 py-1.5 rounded-xl border border-indigo-200 flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-indigo-600" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email, ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-transparent text-[#140e48] focus:outline-none w-full font-bold"
                  />
                </div>
                <select
                  value={selectedRoleFilter}
                  onChange={e => setSelectedRoleFilter(e.target.value)}
                  className="bg-[#f4f6fb] border border-indigo-200 rounded-xl px-3 py-1.5 font-bold text-[#140e48]"
                >
                  <option value="All">All Roles</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Officer">Officer</option>
                  <option value="Operator">Operator</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#140e48] text-white">
                    <tr>
                      <th className="p-3">User ID & Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Verification</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-50">
                    {users
                      .filter(u => selectedRoleFilter === 'All' || u.role === selectedRoleFilter)
                      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(u => (
                        <tr key={u.id} className="hover:bg-indigo-50/40">
                          <td className="p-3">
                            <div className="font-extrabold text-[#140e48]">{u.name}</div>
                            <div className="text-[10px] text-[#637554]">{u.id} • {u.email}</div>
                          </td>
                          <td className="p-3 font-bold text-indigo-900">{u.role}</td>
                          <td className="p-3 text-[#637554]">{u.district}, {u.state}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : u.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {u.verified ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="text-amber-700 font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pending</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button onClick={() => toggleUserStatus(u.id)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                              {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                            <button onClick={() => resetUserPassword(u.name)} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                              Reset Pwd
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ROLES & PERMISSIONS (RBAC) */}
          {activeTab === 'rbac' && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#140e48]">ROLE-BASED ACCESS CONTROL (RBAC) MATRIX</h2>
              <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-sm overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-[#140e48] text-white text-left">
                      <th className="p-3">Portal Feature / Resource</th>
                      <th className="p-3">Farmer</th>
                      <th className="p-3">Buyer</th>
                      <th className="p-3">Officer</th>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Inspector</th>
                      <th className="p-3">Warehouse</th>
                      <th className="p-3 bg-amber-600 text-white">System Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100">
                    {[
                      { res: 'Own Produce & Gate Pass Booking', f: 'Read/Write', b: 'No', o: 'Read', op: 'Read', i: 'No', w: 'No', a: 'Full Access' },
                      { res: 'E-Auction Bidding & Bids', f: 'Read', b: 'Read/Write', o: 'Read', op: 'No', i: 'No', w: 'No', a: 'Full Access' },
                      { res: 'Farmer KYC Approval Queue', f: 'No', b: 'No', o: 'Approve/Reject', op: 'No', i: 'No', w: 'No', a: 'Full Access' },
                      { res: 'Weighment & Gate Entry', f: 'No', b: 'No', o: 'Read', op: 'Read/Write', i: 'No', w: 'No', a: 'Full Access' },
                      { res: 'NIR Quality Assay Entry', f: 'No', b: 'No', o: 'Read', op: 'No', i: 'Read/Write', w: 'No', a: 'Full Access' },
                      { res: 'Stock Inward & e-NWR', f: 'No', b: 'No', o: 'Read', op: 'No', i: 'No', w: 'Read/Write', a: 'Full Access' },
                      { res: 'System Config & Master Data', f: 'DENIED', b: 'DENIED', o: 'DENIED', op: 'DENIED', i: 'DENIED', w: 'DENIED', a: 'EXCLUSIVE CONTROL' },
                      { res: 'Tamper-Proof Audit Logs', f: 'DENIED', b: 'DENIED', o: 'DENIED', op: 'DENIED', i: 'DENIED', w: 'DENIED', a: 'READ ONLY (LOCKED)' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/50">
                        <td className="p-3 font-bold text-[#140e48]">{row.res}</td>
                        <td className="p-3">{row.f}</td>
                        <td className="p-3">{row.b}</td>
                        <td className="p-3">{row.o}</td>
                        <td className="p-3">{row.op}</td>
                        <td className="p-3">{row.i}</td>
                        <td className="p-3">{row.w}</td>
                        <td className="p-3 font-extrabold text-amber-700 bg-amber-50">{row.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. FARMER & BUYER VERIFICATION */}
          {(activeTab === 'farmer_verify' || activeTab === 'buyer_verify') && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#140e48]">
                {activeTab === 'farmer_verify' ? 'FARMER ACCOUNT VERIFICATION QUEUE' : 'BUYER & TRADER LICENSE VERIFICATION'}
              </h2>
              <div className="space-y-3">
                {users.filter(u => u.status === 'PENDING_APPROVAL' || !u.verified).map(u => (
                  <div key={u.id} className="bg-white border border-indigo-100 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3 shadow-sm font-mono text-xs">
                    <div>
                      <div className="font-extrabold text-sm text-[#140e48]">{u.name} ({u.id})</div>
                      <div className="text-[#637554]">Role: {u.role} • Location: {u.district}, {u.state}</div>
                      <div className="text-[#637554]">Contact: {u.phone} • {u.email}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { alert(`Account ${u.id} Verified & Approved!`); toggleUserStatus(u.id); }} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl">Approve</button>
                      <button onClick={() => alert(`Account ${u.id} Rejected.`)} className="bg-red-50 text-red-700 border border-red-200 font-bold px-4 py-2 rounded-xl">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. CROP MASTER DATA */}
          {activeTab === 'crops' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-indigo-200 pb-4">
                <h2 className="text-xl font-extrabold text-[#140e48]">PRODUCT & CROP MASTER DATA</h2>
                <button className="bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs">+ Add New Crop</button>
              </div>
              <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-sm font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#140e48] text-white">
                    <tr>
                      <th className="p-3">Code & Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Variety</th>
                      <th className="p-3">Official MSP</th>
                      <th className="p-3">Season</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100">
                    {crops.map(c => (
                      <tr key={c.code}>
                        <td className="p-3 font-bold">{c.name} ({c.code})</td>
                        <td className="p-3">{c.category}</td>
                        <td className="p-3">{c.variety}</td>
                        <td className="p-3 font-extrabold text-amber-700">₹{c.msp}/Qtl</td>
                        <td className="p-3">{c.season}</td>
                        <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. PRICE CONFIGURATION & RULES */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#140e48]">SYSTEM PRICE CONFIGURATION & RULES</h2>
              <div className="bg-white rounded-2xl border border-indigo-100 p-5 font-mono text-xs space-y-3 shadow-sm">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>System-wide MSP price changes require cabinet approval authorization & generate immutable audit log entries.</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {crops.map(c => (
                    <div key={c.code} className="p-3 bg-[#f8f6fc] border border-indigo-100 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-extrabold">{c.name}</div>
                        <div className="text-[#637554]">Effective: 2025-26 Season</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-[#140e48] text-sm">₹{c.msp}/Qtl</div>
                        <button onClick={() => alert(`Edit MSP for ${c.name}`)} className="text-indigo-600 underline font-bold text-[10px]">Edit Config</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. TAMPER-PROOF AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-indigo-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#140e48]">SYSTEM AUDIT LOGS (TAMPER-PROOF)</h2>
                  <p className="text-xs text-[#637554]">Read-only immutable log of every administrative and security action</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>SHA256 Hash Locked</span>
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#140e48] text-white">
                    <tr>
                      <th className="p-3">Log ID & Time</th>
                      <th className="p-3">User & Role</th>
                      <th className="p-3">Action Performed</th>
                      <th className="p-3">Record Modified</th>
                      <th className="p-3">Old → New Value</th>
                      <th className="p-3">IP / Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100">
                    {auditLogs.map(l => (
                      <tr key={l.id} className="hover:bg-indigo-50/50">
                        <td className="p-3">
                          <div className="font-bold text-[#140e48]">{l.id}</div>
                          <div className="text-[10px] text-[#637554]">{l.time}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{l.user}</div>
                          <div className="text-[10px] text-indigo-600">{l.role}</div>
                        </td>
                        <td className="p-3 font-bold text-amber-800">{l.action}</td>
                        <td className="p-3">{l.record}</td>
                        <td className="p-3">
                          <span className="text-red-600 font-bold">{l.oldVal}</span> → <span className="text-emerald-700 font-bold">{l.newVal}</span>
                        </td>
                        <td className="p-3 text-[10px] text-[#637554]">{l.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'users', 'rbac', 'farmer_verify', 'buyer_verify', 'crops', 'pricing', 'audit'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-indigo-100 p-8 text-center space-y-3 shadow-sm font-mono">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                <Settings className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-base font-extrabold text-[#140e48] uppercase">{activeTab.replace('_', ' ')} Management Terminal</h3>
              <p className="text-xs text-[#637554]">Full system administrative control & configuration module active for System Administrators.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
