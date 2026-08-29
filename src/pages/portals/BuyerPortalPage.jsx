import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Gavel, Search, Filter, ShoppingCart, Truck, CreditCard, 
  FileText, ShieldCheck, CheckCircle2, DollarSign, Bell, Layers, Building2, 
  Heart, Download, ArrowRight, HelpCircle, BarChart3, Coins, Sprout
} from 'lucide-react';
import { dbEngine } from '../../data/dbEngine';

export default function BuyerPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [sharedProcurements, setSharedProcurements] = useState(() => dbEngine.getAllSharedProcurements());

  useEffect(() => {
    const unsub = dbEngine.subscribe((db) => {
      setSharedProcurements(db.sharedProcurements || []);
    });
    return () => unsub();
  }, []);

  // Buyer Profile
  const buyerProfile = {
    id: 'BUY-88391',
    businessName: 'Punjab Agri Logistics & Trade Corp',
    contact: 'Rajesh Agarwal',
    phone: '+91 98110 88391',
    email: 'rajesh.trader@agri-corp.in',
    gstin: '07AAAAA0000A1Z5',
    verified: true,
    license: 'e-NAM Validated License #DL-TR-881',
  };

  // 1. Dashboard Metrics
  const metrics = {
    availableProduce: '1,248 Lots',
    activeOrders: 18,
    pendingRequests: 7,
    completedOrders: 84,
    totalPurchaseValue: '₹42.8 Lakh',
    pendingPayments: 3,
  };

  // 2. Marketplace Produce Lots
  const [marketplaceLots, setMarketplaceLots] = useState([
    { lotId: 'LOT-2026-00452', crop: 'Wheat', variety: 'HD-2967', qty: '5,000 KG', grade: 'Grade A', mandi: 'Mithapur Mandi', warehouse: 'WH-BR-004', price: '₹2,470/Qtl', total: '₹1,23,500', status: 'AVAILABLE', qualityVerified: true },
    { lotId: 'LOT-2026-00453', crop: 'Paddy Basmati', variety: 'PB-1121', qty: '18,000 KG', grade: 'Grade A', mandi: 'Karnal Yard', warehouse: 'WH-HR-001', price: '₹2,300/Qtl', total: '₹4,14,000', status: 'AVAILABLE', qualityVerified: true },
    { lotId: 'LOT-2026-00454', crop: 'Mustard Bold', variety: 'Desi Bold', qty: '8,000 KG', grade: 'Grade A', mandi: 'Khanna APMC', warehouse: 'WH-PB-002', price: '₹5,950/Qtl', total: '₹4,76,000', status: 'AVAILABLE', qualityVerified: true },
    { lotId: 'LOT-2026-00455', crop: 'Chana Desi', variety: 'Yellow Hybrid', qty: '10,000 KG', grade: 'Grade B', mandi: 'Latur Yard', warehouse: 'WH-MH-001', price: '₹5,650/Qtl', total: '₹5,65,000', status: 'AVAILABLE', qualityVerified: true },
  ]);

  // Buyer's Orders
  const [orders, setOrders] = useState([
    { orderId: 'ORD-BUY-9921', lotId: 'LOT-2026-00452', crop: 'Wheat (HD-2967)', qty: '5,000 KG', price: '₹2,470/Qtl', total: '₹1,23,500', status: 'ESCROW LOCKED', delivery: 'Northern Silo #04', paymentStatus: 'PAID TO ESCROW' },
    { orderId: 'ORD-BUY-9922', lotId: 'LOT-2026-00454', crop: 'Mustard (Bold)', qty: '8,000 KG', price: '₹5,950/Qtl', total: '₹4,76,000', status: 'IN TRANSIT', delivery: 'Agri Hub #01', paymentStatus: 'ESCROW RELEASED' },
  ]);

  const handlePurchaseRequest = (lot) => {
    const newOrder = {
      orderId: `ORD-BUY-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: lot.lotId,
      crop: `${lot.crop} (${lot.variety})`,
      qty: lot.qty,
      price: lot.price,
      total: lot.total || '₹2,50,000',
      delivery: 'Destination Hub',
      status: 'UNDER REVIEW',
      paymentStatus: 'PENDING'
    };
    setOrders([newOrder, ...orders]);
    alert(`Purchase Request Submitted for Lot ${lot.lotId}!\nOrder ${newOrder.orderId} created.`);
  };

  // Nav Items list matching user specification
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Gavel },
    { key: 'marketplace', label: 'Produce Marketplace', icon: ShoppingCart },
    { key: 'profile', label: 'Business Profile', icon: ShieldCheck },
    { key: 'orders', label: 'My Purchase Orders', icon: FileText },
    { key: 'payments', label: 'Payment Management', icon: CreditCard },
    { key: 'logistics', label: 'Delivery & Logistics', icon: Truck },
    { key: 'quality', label: 'Quality Certificates', icon: ShieldCheck },
    { key: 'suppliers', label: 'Saved Suppliers', icon: Building2 },
    { key: 'saved', label: 'Saved Lots', icon: Heart },
    { key: 'prices', label: 'Market & MSP Trends', icon: DollarSign },
    { key: 'documents', label: 'Invoices & Documents', icon: FileText },
    { key: 'disputes', label: 'Disputes & Support', icon: HelpCircle },
    { key: 'analytics', label: 'Purchase Analytics', icon: BarChart3 },
    { key: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8fb] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#0e2a47] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-sky-900">
        <div className="flex items-center gap-2">
          <span className="bg-sky-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">e-NAM BUYER PORTAL</span>
          <span>AAGAM National E-Auction & Wholesale Produce Marketplace</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Trader: <strong className="text-sky-300">{buyerProfile.businessName}</strong></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GST Verified</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#091b2e] text-slate-200 p-3 md:p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 border-b md:border-b-0 md:border-r border-sky-900 shadow-xl gap-1 md:space-y-1">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider border-b border-sky-800/80 mb-2">
            BUYER / TRADER DIRECTORY
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
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' 
                    : 'hover:bg-sky-900/60 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="hidden md:block pt-4 border-t border-sky-800/80 mt-4">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-sky-400" />
              <span>Back to Portal Home</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#f8fafc]">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-sky-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0e2a47]">BUYER & TRADER DASHBOARD</h2>
                  <p className="text-xs text-[#637554]">Explore available agricultural lots, manage orders, and track dispatches</p>
                </div>
                <button onClick={() => setActiveTab('marketplace')} className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Browse Marketplace
                </button>
              </div>

              {/* UNIFIED 8-ROLE SHARED PROCUREMENT MARKETPLACE INVENTORY */}
              <div className="bg-[#0e2a47] text-white rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs border border-sky-800">
                <div className="flex justify-between items-center border-b border-sky-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-sky-300 flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-sky-400" />
                      <span>UNIFIED SHARED PROCUREMENT GRAIN MARKETPLACE (AVAILABLE FOR TRADING)</span>
                    </h3>
                    <p className="text-[11px] text-slate-300">Procured grain stock from AAGAM direct procurement available for verified buyers & traders.</p>
                  </div>
                  <span className="bg-sky-600 text-white font-bold px-2.5 py-0.5 rounded text-[10px]">GOI ASSAYED GRAIN</span>
                </div>

                {sharedProcurements.filter(p => p.approvalStatus === 'APPROVED').length === 0 ? (
                  <div className="text-center py-4 text-slate-400">No shared procurement grain stock available for trading yet.</div>
                ) : (
                  <div className="space-y-3">
                    {sharedProcurements.filter(p => p.approvalStatus === 'APPROVED').map(proc => (
                      <div key={proc.id} className="bg-[#183a5e] border border-sky-700/60 rounded-xl p-4 space-y-2">
                        <div className="flex flex-wrap justify-between items-center border-b border-sky-800/80 pb-2">
                          <div>
                            <div className="font-black text-amber-300 text-sm flex items-center gap-2">
                              <span>{proc.id}</span>
                              <span className="bg-sky-950 text-sky-300 text-[10px] px-2 py-0.5 rounded border border-sky-600/40">
                                {proc.crop} ({proc.quantityKg} KG Available)
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300">
                              Storage Warehouse: <strong>{proc.warehouseName} ({proc.warehouseId})</strong>
                            </div>
                          </div>

                          <div>
                            <button
                              onClick={() => alert(`Purchase Order Request Placed for Lot ${proc.id}!\nQuantity: ${proc.quantityKg} KG\nTotal Value: ₹${proc.estimatedPayable?.toLocaleString('en-IN')}`)}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Place Buy Offer (₹{proc.aiAnalysis?.mspPerQtl}/Qtl)</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] bg-[#0e2a47] p-2 rounded-lg text-slate-300">
                          <div>Quality Grade: <strong className="text-emerald-400">{proc.qualityDetails?.grade || 'GRADE A'}</strong></div>
                          <div>Total Valuation: <strong className="text-amber-300">₹{proc.estimatedPayable?.toLocaleString('en-IN')}</strong></div>
                          <div>Status: <strong className="text-emerald-300">READY FOR TRADER DISPATCH</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {[
                  { label: 'Available Produce', val: metrics.availableProduce, sub: 'Grade A Verified' },
                  { label: 'Active Orders', val: `${metrics.activeOrders} Orders`, sub: 'In Transit' },
                  { label: 'Pending Requests', val: `${metrics.pendingRequests} Requests`, sub: 'Under Review' },
                  { label: 'Completed Orders', val: `${metrics.completedOrders} Orders`, sub: 'Delivered' },
                  { label: 'Total Purchase', val: metrics.totalPurchaseValue, sub: 'Escrow Protected' },
                  { label: 'Pending Payments', val: `${metrics.pendingPayments} Pending`, sub: 'Escrow Locked' },
                ].map(card => (
                  <div key={card.label} className="bg-white border border-sky-100 rounded-2xl p-3.5 shadow-sm text-center">
                    <div className="text-[10px] font-extrabold uppercase text-[#637554] mb-1">{card.label}</div>
                    <div className="text-lg font-extrabold text-[#0e2a47]">{card.val}</div>
                    <div className="text-[10px] text-[#637554] mt-1">{card.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PRODUCE MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b border-sky-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0e2a47]">AGRICULTURAL PRODUCE MARKETPLACE</h2>
                  <p className="text-xs text-[#637554]">Verified produce lots available for immediate purchase or bidding</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-sky-200">
                  <Search className="w-3.5 h-3.5 text-sky-600" />
                  <input type="text" placeholder="Search crop, lot ID, mandi..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent focus:outline-none font-bold" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {marketplaceLots.map(lot => (
                  <div key={lot.lotId} className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-extrabold text-base text-[#0e2a47]">{lot.crop} ({lot.variety})</div>
                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-[10px]">{lot.grade}</span>
                    </div>
                    <div className="text-[#637554]">Lot ID: <strong>{lot.lotId}</strong> • Available Quantity: <strong className="text-sky-900">{lot.qty}</strong></div>
                    <div className="text-[#637554]">Location: {lot.mandi} ({lot.warehouse})</div>
                    <div className="flex justify-between items-center pt-2 border-t border-sky-50">
                      <div>
                        <div className="text-[10px] text-[#637554]">Unit Price:</div>
                        <div className="text-base font-extrabold text-sky-900">{lot.price}</div>
                      </div>
                      <button onClick={() => handlePurchaseRequest(lot)} className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-4 py-2 rounded-xl">
                        Request Purchase →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. MY PURCHASE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#0e2a47]">MY PURCHASE ORDERS</h2>
              <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm space-y-3">
                <table className="w-full text-left">
                  <thead className="bg-[#0e2a47] text-white">
                    <tr>
                      <th className="p-3">Order ID & Lot</th>
                      <th className="p-3">Crop Product</th>
                      <th className="p-3">Quantity & Price</th>
                      <th className="p-3">Total Value</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50">
                    {orders.map(o => (
                      <tr key={o.orderId}>
                        <td className="p-3 font-bold text-[#0e2a47]">{o.orderId}<br/><span className="text-[#637554]">{o.lotId}</span></td>
                        <td className="p-3 font-bold">{o.crop}</td>
                        <td className="p-3">{o.qty}<br/><span className="text-sky-700">{o.price}</span></td>
                        <td className="p-3 font-extrabold text-sky-900">{o.total}</td>
                        <td className="p-3"><span className="bg-sky-100 text-sky-800 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">{o.status}</span></td>
                        <td className="p-3 text-right">
                          <button onClick={() => alert(`Tracking delivery for ${o.orderId}...`)} className="bg-sky-700 text-white font-bold px-3 py-1 rounded text-[10px]">Track Order</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'marketplace', 'orders'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-sky-100 p-8 text-center space-y-3 shadow-sm font-mono">
              <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                <Coins className="w-6 h-6 text-sky-700" />
              </div>
              <h3 className="text-base font-extrabold text-[#0e2a47] uppercase">{activeTab.replace('_', ' ')} Buyer Module</h3>
              <p className="text-xs text-[#637554]">Verified trader procurement, order negotiation, and escrow logistics terminal active.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
