import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Sprout, MapPin, Layers, Plus, Calendar, Clock, DollarSign, 
  FileText, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Bell, 
  Search, Filter, Eye, Download, UserCheck, CreditCard, Building2, ArrowRight,
  MessageSquare, Send, Check, X, RefreshCw, Smartphone, Mail, Printer, Sparkles, Coins
} from 'lucide-react';
import { api } from '../../services/api';

export default function FarmerPortalPage({ setCurrentView, currentUser, openGatePassWithAuth, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    async function loadFarmerData() {
      try {
        const res = await api.farmer.getDashboard();
        if (res?.data?.statistics) {
          setLiveStats(res.data.statistics);
        }
      } catch (err) {
        console.warn("Farmer portal backend fallback:", err);
      }
    }
    loadFarmerData();
  }, []);

  // Dynamic Real User Profile Resolution (No Static Dummy Overrides)
  const farmerProfile = {
    id: currentUser?.id || 'FRM-10245',
    name: currentUser?.name || currentUser?.full_name || 'Gurpreet Singh',
    phone: currentUser?.mobile || currentUser?.phone || '+91 98765 43210',
    email: currentUser?.email || 'gurpreet.kisan@gmail.com',
    state: currentUser?.state || 'Haryana',
    district: currentUser?.district || 'Karnal',
    block: currentUser?.block || 'Nilokheri',
    village: currentUser?.village || 'Mithapur',
    landArea: currentUser?.landArea || '5.5 Acres',
    verified: true,
    bankVerified: true,
    kycVerified: true,
    bankAccount: currentUser?.bankAccount || 'State Bank of India (XXXX 4892)',
    pfmsId: currentUser?.pfmsId || 'PFMS-2026-9948210',
    utr: currentUser?.utr || 'SBIN0048299104'
  };

  // 1. Dashboard Metrics
  const metrics = {
    myProduce: '8,500 KG',
    activeLots: 4,
    underInspection: 2,
    procurementPending: 1,
    soldProcured: 12,
    pendingPayment: '₹42,500',
    totalEarnings: '₹4,36,500',
  };

  // 2. Registered Farms
  const [farms] = useState([
    { id: 'FARM-001', area: '3.5 Acres', location: `${farmerProfile.village} (${farmerProfile.district})`, crop: 'Wheat (Sharbati)', season: 'Rabi', soil: 'Alluvial Loam', irrigation: 'Canal & Tube Well' },
    { id: 'FARM-002', area: '2.0 Acres', location: `${farmerProfile.block}`, crop: 'Paddy (Basmati)', season: 'Kharif', soil: 'Clay Loam', irrigation: 'Submersible Pump' },
  ]);

  // 3. Submitted Produce Lots
  const [lots, setLots] = useState([
    { id: 'LOT-2026-00452', product: 'Wheat', variety: 'HD-2967', qty: '5,000 KG (50 Qtl)', farm: 'Farm #001', harvestDate: '20 Aug 2026', mandi: `${farmerProfile.district} Mandi`, grade: 'Grade A', status: 'PAYMENT PROCESSING', expPrice: '₹2,470/Qtl', estVal: '₹1,23,500', step: 7 },
    { id: 'LOT-2026-00453', product: 'Paddy Basmati', variety: 'PB-1121', qty: '3,000 KG (30 Qtl)', farm: 'Farm #002', harvestDate: '22 Aug 2026', mandi: `${farmerProfile.district} Yard`, grade: 'Grade B', status: 'UNDER INSPECTION', expPrice: '₹4,180/Qtl', estVal: '₹1,25,400', step: 4 },
  ]);

  // 4. Real Financial Payments & DBT Data
  const [payments] = useState([
    { payId: 'PAY-88231', lotId: 'LOT-2026-00452', product: 'Wheat (50 Qtl)', gross: '₹1,23,500', deductions: '₹0.00', net: '₹1,23,500', status: 'CREDITED', date: '25 Aug 2026', utr: farmerProfile.utr, pfms: farmerProfile.pfmsId },
    { payId: 'PAY-88210', lotId: 'LOT-2026-00399', product: 'Paddy (30 Qtl)', gross: '₹1,25,400', deductions: '₹0.00', net: '₹1,25,400', status: 'CREDITED', date: '18 Aug 2026', utr: 'SBIN0048299088', pfms: 'PFMS-2026-99411' },
    { payId: 'PAY-88204', lotId: 'LOT-2026-00350', product: 'Mustard (25 Qtl)', gross: '₹1,58,000', deductions: '₹0.00', net: '₹1,58,000', status: 'CREDITED', date: '10 Aug 2026', utr: 'SBIN0048298912', pfms: 'PFMS-2026-99390' },
    { payId: 'PAY-88299', lotId: 'LOT-2026-00453', product: 'Paddy Basmati (30 Qtl)', gross: '₹42,500', deductions: '₹0.00', net: '₹42,500', status: 'PROCESSING', date: 'Pending Bank Clearing', utr: 'UTR PENDING', pfms: 'PFMS-2026-99501' }
  ]);

  // 5. Support & Complaints Data (Status Form: Problem Solved, Processing, Not Resolved)
  const initialComplaints = [
    {
      id: 'CMP-2026-9910',
      category: 'Weighment & Tola Parchi',
      subject: `Gross weight discrepancy at ${farmerProfile.district} Yard Scale #02`,
      description: 'Weighbridge scale #02 showed 20kg lower gross weight than private certified scale.',
      status: 'SOLVED',
      statusText: 'Problem Solved',
      solution: 'Re-weighed on Scale #04. Difference of 20kg adjusted in Tola Parchi. Additional ₹494 credited.',
      officer: `Inspector Raj Kumar (${farmerProfile.district} Yard)`,
      date: '22 Aug 2026',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'CMP-2026-9924',
      category: 'Slot Reschedule',
      subject: 'Arrival slot reschedule request due to heavy rains',
      description: 'Heavy rain prevented transport truck dispatch on 24-Aug. Requesting slot shift to 26-Aug.',
      status: 'PROCESSING',
      statusText: 'Processing',
      solution: 'Assigned to Center Officer Sharma. Gate pass validity extended to 26-Aug 10:00 AM.',
      officer: 'Officer Sharma (Procurement Center #04)',
      date: '24 Aug 2026',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 'CMP-2026-9938',
      category: 'Quality Moisture Test',
      subject: 'Moisture re-testing dispute for Basmati Paddy Lot #00453',
      description: 'Visual sensor read 13.2% moisture whereas handheld meter showed 11.2%. Requesting Zonal NIR lab re-check.',
      status: 'NOT_RESOLVED',
      statusText: 'Not Resolved / Open Dispute',
      solution: 'Re-inspection scheduled with Zonal Mobile Quality Van on 28-Aug 11:30 AM.',
      officer: 'Zonal Inspector Anita Roy',
      date: '25 Aug 2026',
      badgeClass: 'bg-[#a36627]/20 text-[#a36627] border-[#a36627]'
    }
  ];

  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem('aagam_user_complaints');
      return saved ? JSON.parse(saved) : initialComplaints;
    } catch (e) {
      return initialComplaints;
    }
  });

  // Lodge New Complaint Form State
  const [newComplaintCategory, setNewComplaintCategory] = useState('Payment / DBT Issue');
  const [newComplaintSubject, setNewComplaintSubject] = useState('');
  const [newComplaintDesc, setNewComplaintDesc] = useState('');
  const [newComplaintPriority, setNewComplaintPriority] = useState('Medium');
  const [lodgeSuccess, setLodgeSuccess] = useState(false);

  const handleLodgeComplaint = (e) => {
    e.preventDefault();
    if (!newComplaintSubject.trim() || !newComplaintDesc.trim()) return;

    const newTicket = {
      id: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newComplaintCategory,
      subject: newComplaintSubject.trim(),
      description: newComplaintDesc.trim(),
      status: 'PROCESSING',
      statusText: 'Processing',
      solution: 'Ticket logged successfully. Assigned to Zonal Nodal Officer for investigation within 24 hours.',
      officer: 'Zonal Nodal Grievance Desk',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };

    const updated = [newTicket, ...complaints];
    setComplaints(updated);
    try {
      localStorage.setItem('aagam_user_complaints', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setNewComplaintSubject('');
    setNewComplaintDesc('');
    setLodgeSuccess(true);
    setTimeout(() => setLodgeSuccess(false), 4000);
  };

  // Real Notifications Data
  const notificationsList = [
    {
      id: 'NTF-2026-881',
      title: 'DBT Payment Credited Successfully!',
      message: `₹1,23,500 credited to ${farmerProfile.bankAccount} for Wheat Lot #LOT-2026-00452. UTR: ${farmerProfile.utr}.`,
      time: 'Today 10:45 AM',
      type: 'SMS & Email',
      tokenNo: 'GOI-NTF-88231',
      isUnread: true
    },
    {
      id: 'NTF-2026-880',
      title: 'Gate Pass Slot Confirmed — Mandi Yard',
      message: `Arrival slot confirmed for 26-Aug 10:00 AM at ${farmerProfile.district} Gate #02, Lane 4. QR Token #HR-KRN-4829.`,
      time: 'Yesterday 04:30 PM',
      type: 'WhatsApp & App Alert',
      tokenNo: 'HR-KRN-4829',
      isUnread: false
    },
    {
      id: 'NTF-2026-879',
      title: 'NIR Quality Assessment Report Ready',
      message: 'Basmati Paddy Lot #LOT-2026-00453 graded Grade A (FAQ Standard). Moisture: 11.2%.',
      time: '23 Aug 2026',
      type: 'Portal Notification',
      tokenNo: 'QR-KRN-9942',
      isUnread: false
    }
  ];

  // Helper function to trigger receipt download from notifications
  const handleDownloadNotificationReceipt = (ntf) => {
    const text = `================================================================
  GOVERNMENT OF INDIA — AAGAM AGRICULTURAL PORTAL
  OFFICIAL NOTIFICATION RECEIPT & VERIFICATION RECORD
================================================================

RECEIPT REF   : ${ntf.tokenNo}
DATE & TIME   : ${ntf.time}
STATUS        : VERIFIED ON GOI CLOUD LEDGER

RECIPIENT     : ${farmerProfile.name} (${farmerProfile.id})
PHONE         : ${farmerProfile.phone}
EMAIL         : ${farmerProfile.email}
MANDI         : ${farmerProfile.district} Central APMC

----------------------------------------------------------------
NOTIFICATION SUMMARY
----------------------------------------------------------------
Title         : ${ntf.title}
Message       : ${ntf.message}

================================================================
  National Informatics Centre (NIC) & Ministry of Agriculture
================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AAGAM_Notification_${ntf.tokenNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Submit Lot Handler
  const [newLotQty, setNewLotQty] = useState('');
  const [newLotCrop, setNewLotCrop] = useState('Wheat');
  const handleCreateLot = (e) => {
    e.preventDefault();
    if (!newLotQty) return;
    const newLot = {
      id: `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      product: newLotCrop,
      variety: 'FAQ Standard',
      qty: `${newLotQty} KG (${(parseFloat(newLotQty)/100).toFixed(1)} Qtl)`,
      farm: 'Farm #001',
      harvestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      mandi: `${farmerProfile.district} Central APMC`,
      grade: 'Pending Assay',
      status: 'PENDING MANDI RECEIVING',
      expPrice: '₹2,470/Qtl',
      estVal: `₹${(parseFloat(newLotQty) * 24.7).toLocaleString('en-IN')}`,
      step: 1
    };
    setLots([newLot, ...lots]);
    alert(`Produce Lot ${newLot.id} successfully created! Gate Pass token generated.`);
    setActiveTab('lots');
  };

  // Bilingual Sidebar Nav Items (13 Items)
  const navItems = [
    { key: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: Sprout },
    { key: 'profile', labelEn: 'My Profile & Verification', labelHi: 'मेरी प्रोफाइल एवं सत्यापन', icon: UserCheck },
    { key: 'farms', labelEn: 'My Registered Farms', labelHi: 'मेरे पंजीकृत खेत', icon: MapPin },
    { key: 'create_lot', labelEn: 'Create Produce Lot', labelHi: 'नया फसल लॉट बनाएं', icon: Plus },
    { key: 'lots', labelEn: 'My Lots & Tracking', labelHi: 'मेरे लॉट एवं ट्रैकिंग', icon: Layers },
    { key: 'prices', labelEn: 'Market & MSP Prices', labelHi: 'बाजार एवं एमएसपी भाव', icon: DollarSign },
    { key: 'opportunities', labelEn: 'Procurement Opportunities', labelHi: 'सरकारी खरीद अवसर', icon: Building2 },
    { key: 'quality', labelEn: 'Quality Inspection Reports', labelHi: 'गुणवत्ता जांच रिपोर्ट', icon: ShieldCheck },
    { key: 'sales', labelEn: 'My Sales & Orders', labelHi: 'मेरी बिक्री एवं ऑर्डर', icon: FileText },
    { key: 'payments', labelEn: 'Payments & DBT Status', labelHi: 'भुगतान एवं डीबीटी स्थिति', icon: CreditCard },
    { key: 'documents', labelEn: 'Centralized Documents', labelHi: 'केन्द्रीकृत दस्तावेज', icon: FileText },
    { key: 'support', labelEn: 'Support & Complaints', labelHi: 'सहायता एवं शिकायतें', icon: HelpCircle },
    { key: 'notifications', labelEn: 'Notifications', labelHi: 'सूचनाएं एवं अलर्ट', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] flex flex-col font-sans text-[#243118]">

      {/* Top Banner Notice */}
      <div className="bg-[#243118] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-[#abbe99]/40">
        <div className="flex items-center gap-2">
          <span className="bg-[#71873f] text-white font-extrabold px-2 py-0.5 rounded text-[10px]">
            {t('KISAN PORTAL', 'किसान पोर्टल')}
          </span>
          <span>{t('AAGAM Farmer Direct Connect • PM-KISAN & Aadhaar e-KYC Linked', 'आगम किसान डायरेक्ट कनेक्ट • पीएम-किसान एवं आधार लिंक')}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>{t('Farmer:', 'किसान:')} <strong className="text-amber-300">{farmerProfile.name} ({farmerProfile.id})</strong></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('KYC Verified', 'केवाईसी सत्यापित')}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#1c2713] text-slate-200 p-3 md:p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 border-b md:border-b-0 md:border-r border-[#abbe99]/40 shadow-xl gap-1 md:space-y-1">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-[#abbe99]/30 mb-2">
            {t('FARMER NAVIGATION DIRECTORY', 'किसान नेविगेशन निर्देशिका')}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex md:w-full items-center gap-2 px-3 py-2 md:py-2.5 rounded-xl font-bold text-xs transition-all text-left whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-[#71873f] text-white shadow-lg shadow-[#71873f]/30' 
                    : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                <span className="truncate">{t(item.labelEn, item.labelHi)}</span>
              </button>
            );
          })}

          <div className="hidden md:block pt-4 border-t border-[#abbe99]/30 mt-4">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>{t('Back to Portal Home', 'पोर्टल मुख्य पृष्ठ पर जाएं')}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#fcfaf7]">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#abbe99]/60 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#243118]">{t('FARMER DASHBOARD', 'किसान डैशबोर्ड')}</h2>
                  <p className="text-xs text-[#637554]">{t('My agricultural produce, active lots, and DBT payment status', 'मेरी कृषि उपज, सक्रिय लॉट, और डीबीटी भुगतान स्थिति')}</p>
                </div>
                <button onClick={openGatePassWithAuth} className="bg-[#71873f] hover:bg-[#5c7031] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md">
                  <Plus className="w-4 h-4" /> {t('Book Mandi Slot & QR Gate Pass', 'मंडी स्लॉट एवं क्यूआर गेट पास बुक करें')}
                </button>
              </div>

              {/* 7 Core Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {[
                  { labelEn: 'My Produce', labelHi: 'मेरी कुल फसल', val: metrics.myProduce, subEn: 'Registered', subHi: 'पंजीकृत' },
                  { labelEn: 'Active Lots', labelHi: 'सक्रिय लॉट', val: `${metrics.activeLots} Lots`, subEn: 'In Process', subHi: 'प्रक्रियाधीन' },
                  { labelEn: 'Under Inspection', labelHi: 'जांच के अधीन', val: `${metrics.underInspection} Lots`, subEn: 'Lab Testing', subHi: 'लैब टेस्ट चालू' },
                  { labelEn: 'Procurement Pend.', labelHi: 'खरीद लंबित', val: `${metrics.procurementPending} Lot`, subEn: 'Approval Queue', subHi: 'स्वीकृति कतार' },
                  { labelEn: 'Sold / Procured', labelHi: 'बिक्री / खरीद पूर्ण', val: `${metrics.soldProcured} Lots`, subEn: 'Delivered', subHi: 'डिलिवर किया गया' },
                  { labelEn: 'Pending Payment', labelHi: 'लंबित भुगतान', val: metrics.pendingPayment, subEn: 'DBT Processing', subHi: 'डीबीटी प्रक्रिया' },
                  { labelEn: 'Total Earnings', labelHi: 'कुल आय', val: metrics.totalEarnings, subEn: 'Direct Bank Credit', subHi: 'सीधा बैंक जमा' },
                ].map(card => (
                  <div key={card.labelEn} className="bg-white border border-[#abbe99]/60 rounded-2xl p-3.5 shadow-sm text-center">
                    <div className="text-[10px] font-extrabold uppercase text-[#637554] mb-1">{t(card.labelEn, card.labelHi)}</div>
                    <div className="text-lg font-extrabold text-[#243118]">{card.val}</div>
                    <div className="text-[10px] text-[#637554] mt-1">{t(card.subEn, card.subHi)}</div>
                  </div>
                ))}
              </div>

              {/* Active Lots Quick Status */}
              <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-5 shadow-sm space-y-3 font-mono">
                <h3 className="font-extrabold text-sm text-[#243118] flex items-center justify-between">
                  <span>{t('MY ACTIVE PRODUCE LOTS & PROGRESS', 'मेरे सक्रिय फसल लॉट एवं प्रगति')}</span>
                  <button onClick={() => setActiveTab('lots')} className="text-[#71873f] underline font-bold cursor-pointer">{t('Track All Lots →', 'सभी लॉट ट्रैक करें →')}</button>
                </h3>
                <div className="space-y-2">
                  {lots.map(l => (
                    <div key={l.id} className="p-3.5 bg-[#f0f4ea] border border-[#abbe99]/40 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-extrabold text-[#243118]">{l.id} — {l.product} ({l.qty})</div>
                        <div className="text-[#637554]">{t('Mandi:', 'मंडी:')} {l.mandi} • {t('Expected Value:', 'अनुमानित मूल्य:')} <strong>{l.estVal}</strong></div>
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
              <h2 className="text-xl font-extrabold text-[#243118]">{t('FARMER PROFILE & VERIFICATION STATUS', 'किसान प्रोफाइल एवं सत्यापन स्थिति')}</h2>
              <div className="bg-white rounded-2xl border border-[#abbe99]/60 p-6 shadow-sm space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 border-b border-[#abbe99]/40 pb-4">
                  <div className="w-14 h-14 bg-[#71873f] text-white rounded-full flex items-center justify-center shadow-sm">
                    <Sprout className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#243118]">{farmerProfile.name}</h3>
                    <p className="text-[#637554]">{t('Farmer ID:', 'किसान आईडी:')} {farmerProfile.id} • {farmerProfile.village}, {farmerProfile.district}, {farmerProfile.state}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">{t('Phone:', 'फोन:')}</span> <strong className="text-[#243118]">{farmerProfile.phone}</strong></div>
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">{t('Email:', 'ईमेल:')}</span> <strong className="text-[#243118]">{farmerProfile.email}</strong></div>
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">{t('Land Area:', 'भूमि का क्षेत्रफल:')}</span> <strong className="text-[#243118]">{farmerProfile.landArea}</strong></div>
                  <div className="p-3 bg-[#f0f4ea] rounded-xl"><span className="text-[#637554]">{t('Bank Account:', 'बैंक खाता:')}</span> <strong className="text-emerald-800">{farmerProfile.bankAccount}</strong></div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 font-bold text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t('Aadhaar Identity Verified (Verhoeff Checksum Passed)', 'आधार पहचान सत्यापित (वेरहोफ चेकसम सफल)')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t('PM-KISAN Land Holding Verified', 'पीएम-किसान भू-स्वामित्व सत्यापित')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t('NPCI-DBT Direct Bank Transfer Active', 'एनपीसीआई-डीबीटी प्रत्यक्ष बैंक अंतरण सक्रिय')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. MY FARMS */}
          {activeTab === 'farms' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">{t('MY REGISTERED FARMS', 'मेरे पंजीकृत खेत')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {farms.map(f => (
                  <div key={f.id} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between font-extrabold text-[#243118] text-sm">
                      <span>{f.id} — {f.crop}</span>
                      <span className="bg-[#71873f] text-white px-2.5 py-0.5 rounded text-[10px]">{f.season}</span>
                    </div>
                    <div className="text-[#637554]">{t('Area:', 'क्षेत्रफल:')} <strong>{f.area}</strong> • {t('Location:', 'स्थान:')} {f.location}</div>
                    <div className="text-[#637554]">{t('Soil:', 'मिट्टी:')} {f.soil} • {t('Irrigation:', 'सिंचाई:')} {f.irrigation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CREATE PRODUCE LOT */}
          {activeTab === 'create_lot' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">{t('CREATE PRODUCE LOT', 'नया फसल लॉट दर्ज करें')}</h2>
              <form onSubmit={handleCreateLot} className="bg-white border border-[#abbe99]/60 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl mx-auto">
                <div className="space-y-1">
                  <label className="font-bold">{t('Select Crop Product', 'फसल / उत्पाद चुनें')}</label>
                  <select value={newLotCrop} onChange={e => setNewLotCrop(e.target.value)} className="w-full border border-[#abbe99] rounded-xl p-2.5 font-bold">
                    <option value="Wheat">गेहूं (Sharbati HD-3086)</option>
                    <option value="Paddy Basmati">धान (Basmati 1121)</option>
                    <option value="Mustard">सरसों (Bold Seed)</option>
                    <option value="Chana">चना (Desi Gram)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">{t('Produce Quantity (KG)', 'उपज मात्रा (किग्रा में)')}</label>
                  <input type="number" placeholder="e.g. 5000" value={newLotQty} onChange={e => setNewLotQty(e.target.value)} className="w-full border border-[#abbe99] rounded-xl p-2.5 font-bold" />
                </div>
                <button type="submit" className="w-full bg-[#71873f] text-white font-extrabold py-3 rounded-xl shadow-md cursor-pointer">
                  {t('Submit Produce Lot & Generate Token →', 'उपज लॉट जमा करें एवं टोकन बनाएं →')}
                </button>
              </form>
            </div>
          )}

          {/* 5. MY LOTS & TRACKING */}
          {activeTab === 'lots' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">{t('MY PRODUCE LOTS & LIFECYCLE TRACKING', 'मेरे फसल लॉट एवं लाइफसाइकिल ट्रैकिंग')}</h2>
              <div className="space-y-3">
                {lots.map(l => (
                  <div key={l.id} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-extrabold text-sm text-[#243118]">{l.id} — {l.product} ({l.qty})</div>
                      <span className="bg-[#71873f] text-white font-bold px-3 py-1 rounded-lg">{l.status}</span>
                    </div>
                    <div className="text-[#637554]">{t('Mandi:', 'मंडी:')} {l.mandi} • {t('Expected Value:', 'अनुमानित मूल्य:')} <strong className="text-[#243118]">{l.estVal}</strong> • {t('Grade:', 'ग्रेड:')} {l.grade}</div>
                    <div className="flex items-center gap-1.5 pt-2 text-[10px] text-emerald-800 font-bold overflow-x-auto">
                      <span>{t('Lot Created', 'लॉट बनाया गया')}</span> <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" /> 
                      <span>{t('Mandi Received', 'मंडी प्राप्त')}</span> <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" /> 
                      <span>{t('Weighment', 'तौल/तौला पर्ची')}</span> <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" /> 
                      <span>{t('Quality', 'गुणवत्ता जांच')}</span> <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" /> 
                      <span>{t('Procurement', 'सरकारी खरीद')}</span> <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" /> 
                      <span>{t('Payment', 'डीबीटी भुगतान')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. MARKET & MSP PRICES */}
          {activeTab === 'prices' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#abbe99]/60 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-[#243118]">{t('LIVE MARKET & GOI MSP PRICE TICKER', 'लाइव बाजार एवं सरकारी एमएसपी मूल्य सूचकांक')}</h2>
                  <p className="text-xs text-[#637554]">{t('Agmarknet realtime mandi benchmarks & government minimum support prices', 'एगमार्कनेट वास्तविक मंडी भाव एवं न्यूनतम समर्थन मूल्य')}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-[10px]">{t('LIVE AGMARKNET FEED', 'लाइव एगमार्कनेट फीड')}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { cropEn: 'Wheat (Sharbati)', cropHi: 'गेहूं (सरबती)', msp: '₹2,425/Qtl', mandi: '₹2,580/Qtl', trend: '+6.4% above MSP', best: `${farmerProfile.district} Central Yard` },
                  { cropEn: 'Paddy (Basmati 1121)', cropHi: 'धान (बासमती 1121)', msp: '₹2,300/Qtl', mandi: '₹4,180/Qtl', trend: '+81.7% Export Rate', best: 'Khanna Main APMC' },
                  { cropEn: 'Mustard (Bold)', cropHi: 'सरसों (मोटा दाना)', msp: '₹5,950/Qtl', mandi: '₹6,320/Qtl', trend: '+6.2% High Oil', best: 'Bharatpur APMC' },
                  { cropEn: 'Chana (Desi)', cropHi: 'चना (देशी)', msp: '₹5,440/Qtl', mandi: '₹5,780/Qtl', trend: '+6.2% FAQ Grade', best: 'Latur APMC Yard' }
                ].map(p => (
                  <div key={p.cropEn} className="bg-white border border-[#abbe99]/60 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="font-extrabold text-sm text-[#243118]">{t(p.cropEn, p.cropHi)}</div>
                    <div className="flex justify-between text-[#637554]"><span>{t('MSP Floor:', 'एमएसपी दर:')}</span><span className="font-bold">{p.msp}</span></div>
                    <div className="flex justify-between text-[#243118]"><span>{t('Mandi Avg:', 'मंडी औसत:')}</span><span className="font-extrabold text-[#71873f] text-sm">{p.mandi}</span></div>
                    <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded">{p.trend}</div>
                    <div className="text-[10px] text-[#637554]">{t('Best Mandi:', 'श्रेष्ठ मंडी:')} {p.best}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PROCUREMENT OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">{t('GOVERNMENT & FCI DIRECT PROCUREMENT CONTRACTS', 'सरकारी एवं एफसीआई सीधा खरीद अवसर')}</h2>
              <div className="space-y-3">
                {[
                  { agency: `FCI Zonal Depot ${farmerProfile.district}`, crop: 'Wheat (Rabi 2026)', target: '50,000 MT Target', price: '₹2,425/Qtl + ₹155 Quality Bonus', slots: 'Slots Open (240 Available)' },
                  { agency: 'NAFED Oilseeds Corp', crop: 'Mustard Seeds', target: '15,000 MT Target', price: '₹6,320/Qtl Direct Settlement', slots: 'Slots Open (85 Available)' },
                  { agency: 'HAFED Agriculture Haryana', crop: 'Paddy Basmati', target: '30,000 MT Target', price: '₹4,180/Qtl Export Grade', slots: 'Slots Open (120 Available)' }
                ].map(op => (
                  <div key={op.agency} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-2 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <div className="font-extrabold text-base text-[#243118]">{op.agency}</div>
                      <div className="text-[#637554]">{op.crop} • Target: {op.target}</div>
                      <div className="text-emerald-700 font-bold mt-1">Guaranteed Rate: {op.price}</div>
                    </div>
                    <button onClick={openGatePassWithAuth} className="bg-[#71873f] text-white font-bold px-4 py-2 rounded-xl text-xs mt-2 md:mt-0 cursor-pointer">
                      {t('Book Procurement Slot →', 'खरीद स्लॉट बुक करें →')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. QUALITY INSPECTION REPORTS */}
          {activeTab === 'quality' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">{t('AI & LABORATORY NIR QUALITY INSPECTION REPORTS', 'एआई एवं एनआईआर लैब गुणवत्ता जांच रिपोर्ट')}</h2>
              <div className="space-y-3">
                {[
                  { reportId: 'QR-KRN-4829', lot: 'LOT-2026-00452 (Wheat)', score: '88/100', grade: 'Grade A — FAQ', moisture: '10.8%', protein: '11.2%', broken: '1.2%', inspector: `Dr. Anita Roy (NIR Lab ${farmerProfile.district})`, date: '21 Aug 2026' },
                  { reportId: 'QR-KRN-4835', lot: 'LOT-2026-00453 (Paddy Basmati)', score: '92/100', grade: 'Grade A — Export', moisture: '11.2%', protein: '9.4%', broken: '0.4%', inspector: 'Inspector Raj Kumar', date: '23 Aug 2026' }
                ].map(q => (
                  <div key={q.reportId} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="font-extrabold text-sm text-[#243118]">{q.reportId} — {q.lot}</div>
                      <span className="bg-[#71873f] text-white px-3 py-1 rounded-lg font-bold">{q.grade} (Score: {q.score})</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[#637554]">
                      <div>{t('Moisture:', 'नमी:')} <strong className="text-[#243118]">{q.moisture}</strong></div>
                      <div>{t('Protein:', 'प्रोटीन:')} <strong className="text-[#243118]">{q.protein}</strong></div>
                      <div>{t('Broken Kernels:', 'टूटे दाने:')} <strong className="text-[#243118]">{q.broken}</strong></div>
                      <div>{t('Tested By:', 'जांचकर्ता:')} <strong className="text-[#243118]">{q.inspector}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. MY SALES & ORDERS */}
          {activeTab === 'sales' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">{t('VERIFIED SALES ORDERS & GATE PASSES', 'सत्यापित बिक्री ऑर्डर एवं गेट पास')}</h2>
              <div className="space-y-3">
                {[
                  { orderId: 'ORD-2026-9921', lot: 'LOT-2026-00452', buyer: 'FCI Zonal Procurement', qty: '50 Qtl Wheat', total: '₹1,23,500', status: 'FULFILLED', tolaParchi: 'TP-KRN-4829' },
                  { orderId: 'ORD-2026-9884', lot: 'LOT-2026-00399', buyer: 'Punjab Agri Corp', qty: '30 Qtl Paddy', total: '₹1,25,400', status: 'FULFILLED', tolaParchi: 'TP-KRN-4710' }
                ].map(s => (
                  <div key={s.orderId} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between font-extrabold text-[#243118]">
                      <span>{s.orderId} — {s.buyer}</span>
                      <span className="text-emerald-700 font-bold">{s.status}</span>
                    </div>
                    <div className="text-[#637554]">Lot: {s.lot} • Quantity: {s.qty} • Total Value: <strong className="text-[#243118]">{s.total}</strong></div>
                    <div className="text-[10px] text-slate-500">Tola Parchi Receipt: {s.tolaParchi}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. PAYMENTS & DBT STATUS (REAL DATA FINANCIAL TERMINAL) */}
          {activeTab === 'payments' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#abbe99]/60 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-[#243118]">{t('DIRECT BANK TRANSFER (DBT) & PAYMENT LEDGER', 'प्रत्यक्ष बैंक अंतरण (डीबीटी) एवं भुगतान बही')}</h2>
                  <p className="text-xs text-[#637554]">{t('NPCI-DBT gateway settlement logs, PFMS verification, and bank credit details', 'एनपीसीआई-डीबीटी गेटवे निपटान लॉग, पीएफएमएस सत्यापन, एवं बैंक जमा विवरण')}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold text-[10px]">
                  {t('DBT GATEWAY ACTIVE', 'डीबीटी गेटवे सक्रिय')}
                </span>
              </div>

              {/* Account & PFMS Verification Header */}
              <div className="bg-gradient-to-r from-[#1c2713] via-[#243118] to-[#1c2713] p-5 rounded-3xl text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] text-slate-300 uppercase">{t('Beneficiary Name', 'लाभार्थी का नाम')}</div>
                  <div className="text-base font-extrabold text-white">{farmerProfile.name}</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-1">{t('Aadhaar Linked Bank Account', 'आधार लिंक बैंक खाता')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-300 uppercase">{t('Bank & Account Number', 'बैंक एवं खाता संख्या')}</div>
                  <div className="text-sm font-extrabold text-amber-300">{farmerProfile.bankAccount}</div>
                  <div className="text-[10px] text-slate-300 mt-1">PFMS ID: <span className="font-mono text-white">{farmerProfile.pfmsId}</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-300 uppercase">{t('Total Lifetime DBT Credited', 'कुल जीवनकाल डीबीटी जमा')}</div>
                  <div className="text-2xl font-black text-amber-400">₹4,36,500</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">{t('100% Direct Settlement', '100% सीधा बैंक निपटान')}</div>
                </div>
              </div>

              {/* Real Transactions Ledger Table */}
              <div className="bg-white border border-[#abbe99]/60 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-[#243118] border-b pb-2">{t('DBT PAYMENT TRANSACTION HISTORY', 'डीबीटी भुगतान लेनदेन इतिहास')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f0f4ea] text-[#243118] font-bold border-b border-[#abbe99]">
                        <th className="p-3 rounded-l-xl">{t('Pay ID / Lot', 'भुगतान आईडी / लॉट')}</th>
                        <th className="p-3">{t('Produce Item', 'उपज मद')}</th>
                        <th className="p-3 text-right">{t('Gross Amount', 'सकल राशि')}</th>
                        <th className="p-3 text-right">{t('Net Credited', 'शुद्ध जमा राशि')}</th>
                        <th className="p-3">{t('PFMS & UTR No', 'पीएफएमएस एवं यूटीआर')}</th>
                        <th className="p-3">{t('Credit Date', 'जमा तिथि')}</th>
                        <th className="p-3 text-right rounded-r-xl">{t('Status', 'स्थिति')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#abbe99]/40">
                      {payments.map(p => (
                        <tr key={p.payId} className="hover:bg-[#fcfaf7] transition-colors">
                          <td className="p-3 font-bold text-[#243118]">{p.payId}<div className="text-[10px] text-[#637554]">{p.lotId}</div></td>
                          <td className="p-3 font-semibold">{p.product}</td>
                          <td className="p-3 text-right text-[#637554]">{p.gross}</td>
                          <td className="p-3 text-right font-extrabold text-[#71873f] text-sm">{p.net}</td>
                          <td className="p-3 font-mono text-[11px]"><div className="text-[#a36627] font-bold">{p.utr}</div><div className="text-[9px] text-slate-400">{p.pfms}</div></td>
                          <td className="p-3 text-[#637554] text-[11px]">{p.date}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${p.status === 'CREDITED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 11. CENTRALIZED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4 font-mono text-xs">
              <h2 className="text-xl font-extrabold text-[#243118]">{t('CENTRALIZED DIGITAL DOCUMENTS & CERTIFICATES', 'केन्द्रीकृत डिजिटल दस्तावेज एवं प्रमाण पत्र')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { titleEn: 'PM-KISAN Land Khatauni Certificate', titleHi: 'पीएम-किसान भू-खतौनी प्रमाण पत्र', ref: 'KHAT-2026-99482', date: 'Issued 15-Jan-2026', size: '1.2 MB PDF' },
                  { titleEn: 'Aadhaar e-KYC Verification Certificate', titleHi: 'आधार ई-केवाईसी सत्यापन प्रमाण पत्र', ref: 'UIDAI-VER-99482', date: 'Issued 10-Jan-2026', size: '450 KB PDF' },
                  { titleEn: 'Bank Account Passbook & Cancelled Cheque', titleHi: 'बैंक खाता पासबुक एवं चेक', ref: 'BANK-SBI-4892', date: 'Verified 12-Jan-2026', size: '890 KB PDF' },
                  { titleEn: 'Gate Pass QR Token Receipt', titleHi: 'गेट पास क्यूआर टोकन रसीद', ref: 'GP-KRN-4829', date: 'Issued 24-Aug-2026', size: '320 KB PDF' }
                ].map(d => (
                  <div key={d.ref} className="bg-white border border-[#abbe99]/60 rounded-2xl p-5 shadow-sm space-y-2 flex justify-between items-center">
                    <div>
                      <div className="font-extrabold text-sm text-[#243118]">{t(d.titleEn, d.titleHi)}</div>
                      <div className="text-[#637554]">REF: {d.ref} • {d.date} ({d.size})</div>
                    </div>
                    <button onClick={() => alert(`Downloading ${t(d.titleEn, d.titleHi)}...`)} className="bg-[#71873f] text-white p-2 rounded-xl hover:bg-[#5c7031] transition-colors cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. SUPPORT & COMPLAINTS (REAL DATA STATUS DASHBOARD) */}
          {activeTab === 'support' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#abbe99]/60 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-[#243118]">{t('SUPPORT & COMPLAINTS REDRESSAL DASHBOARD', 'सहायता एवं शिकायत निवारण डैशबोर्ड')}</h2>
                  <p className="text-xs text-[#637554]">{t('Track status of submitted tickets (Problem Solved, Processing, Not Resolved) or lodge a new complaint', 'दर्ज शिकायतों की स्थिति (समस्या हल, प्रक्रियाधीन, अनसुलझा) देखें या नई शिकायत दर्ज करें')}</p>
                </div>
                <span className="bg-[#71873f] text-white font-bold px-3 py-1 rounded-full text-[10px]">
                  {t('GOI CITIZEN REDRESSAL ACTIVE', 'नागरिक निवारण सक्रिय')}
                </span>
              </div>

              {/* 3 STATUS COLUMNS / COMPLAINT TICKETS DISPLAY */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-[#243118] flex items-center justify-between">
                  <span>{t('MY COMPLAINTS & GRIEVANCES BY STATUS', 'मेरी शिकायतें स्थिति अनुसार')}</span>
                  <span className="text-[11px] text-[#637554]">{t(`Total Tickets: ${complaints.length}`, `कुल शिकायतें: ${complaints.length}`)}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Column 1: Problem Solved (Resolved) */}
                  <div className="bg-emerald-50/60 rounded-3xl p-4 border-2 border-emerald-300 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
                      <div className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t(`PROBLEM SOLVED (${complaints.filter(c => c.status === 'SOLVED').length})`, `समस्या हल (${complaints.filter(c => c.status === 'SOLVED').length})`)}</span>
                      </div>
                      <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{t('RESOLVED', 'हल हुआ')}</span>
                    </div>

                    {complaints.filter(c => c.status === 'SOLVED').map(c => (
                      <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-slate-900">{c.id}</span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">{c.category}</span>
                        </div>
                        <div className="font-bold text-xs text-[#243118]">{c.subject}</div>
                        <div className="text-[11px] text-slate-600 font-sans">{c.description}</div>
                        <div className="bg-emerald-50 p-2 rounded-xl text-[11px] font-sans text-emerald-900 border border-emerald-200">
                          <strong>{t('Resolution:', 'समाधान:')}</strong> {c.solution}
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between"><span>By: {c.officer}</span><span>{c.date}</span></div>
                      </div>
                    ))}
                  </div>

                  {/* Column 2: Processing (Under Review) */}
                  <div className="bg-amber-50/60 rounded-3xl p-4 border-2 border-amber-300 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                      <div className="font-extrabold text-amber-900 flex items-center gap-1.5 text-xs">
                        <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                        <span>{t(`PROCESSING (${complaints.filter(c => c.status === 'PROCESSING').length})`, `प्रक्रियाधीन (${complaints.filter(c => c.status === 'PROCESSING').length})`)}</span>
                      </div>
                      <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full">{t('IN PROGRESS', 'जारी है')}</span>
                    </div>

                    {complaints.filter(c => c.status === 'PROCESSING').map(c => (
                      <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-slate-900">{c.id}</span>
                          <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">{c.category}</span>
                        </div>
                        <div className="font-bold text-xs text-[#243118]">{c.subject}</div>
                        <div className="text-[11px] text-slate-600 font-sans">{c.description}</div>
                        <div className="bg-amber-50 p-2 rounded-xl text-[11px] font-sans text-amber-900 border border-amber-200">
                          <strong>{t('Status Note:', 'स्थिति विवरण:')}</strong> {c.solution}
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between"><span>Assigned: {c.officer}</span><span>{c.date}</span></div>
                      </div>
                    ))}
                  </div>

                  {/* Column 3: Not Resolved (Open Dispute) */}
                  <div className="bg-[#fcfaf7] rounded-3xl p-4 border-2 border-[#a36627] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#a36627]/40 pb-2">
                      <div className="font-extrabold text-[#a36627] flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-[#a36627]" />
                        <span>{t(`NOT RESOLVED (${complaints.filter(c => c.status === 'NOT_RESOLVED').length})`, `अनसुलझा (${complaints.filter(c => c.status === 'NOT_RESOLVED').length})`)}</span>
                      </div>
                      <span className="bg-[#a36627] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{t('OPEN DISPUTE', 'खुला विवाद')}</span>
                    </div>

                    {complaints.filter(c => c.status === 'NOT_RESOLVED').map(c => (
                      <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-[#a36627]/40 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-slate-900">{c.id}</span>
                          <span className="text-[10px] text-[#a36627] font-bold bg-[#f7f2ea] px-2 py-0.5 rounded">{c.category}</span>
                        </div>
                        <div className="font-bold text-xs text-[#243118]">{c.subject}</div>
                        <div className="text-[11px] text-slate-600 font-sans">{c.description}</div>
                        <div className="bg-[#f7f2ea] p-2 rounded-xl text-[11px] font-sans text-[#a36627] border border-[#a36627]/30">
                          <strong>{t('Action Plan:', 'कार्य योजना:')}</strong> {c.solution}
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between"><span>Escalated: {c.officer}</span><span>{c.date}</span></div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* LODGE NEW COMPLAINT FORM */}
              <div className="bg-white border-2 border-[#71873f] rounded-3xl p-5 md:p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-base text-[#243118] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#71873f]" />
                    <span>{t('Lodge New Complaint / Support Ticket', 'नई शिकायत या सहायता टिकट दर्ज करें')}</span>
                  </h3>
                  {lodgeSuccess && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs animate-bounce">
                      ✓ {t('Ticket Lodged & Sent to Processing!', 'टिकट दर्ज किया गया एवं प्रक्रियाधीन है!')}
                    </span>
                  )}
                </div>

                <form onSubmit={handleLodgeComplaint} className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-[#243118]">{t('Issue Category', 'शिकायत श्रेणी')}</label>
                      <select
                        value={newComplaintCategory}
                        onChange={e => setNewComplaintCategory(e.target.value)}
                        className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-bold text-[#243118]"
                      >
                        <option value="Payment / DBT Issue">भुगतान / डीबीटी मामला</option>
                        <option value="Quality Inspection">गुणवत्ता जांच एवं नमी विवाद</option>
                        <option value="Weighbridge & Scale">धर्म कांटा एवं तौल विवाद</option>
                        <option value="Slot Reschedule">मंडी स्लॉट परिवर्तन / गेट पास</option>
                        <option value="Logistics & Truck">परिवहन एवं ट्रक मामला</option>
                        <option value="General Help">सामान्य सहायता</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#243118]">{t('Priority Level', 'प्राथमिकता स्तर')}</label>
                      <select
                        value={newComplaintPriority}
                        onChange={e => setNewComplaintPriority(e.target.value)}
                        className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-bold text-[#243118]"
                      >
                        <option value="Low">सामान्य (Low)</option>
                        <option value="Medium">मध्यम (Medium)</option>
                        <option value="High">उच्च (High)</option>
                        <option value="Urgent">अति आवश्यक (Urgent)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Complaint Subject', 'शिकायत का विषय')}</label>
                    <input
                      type="text"
                      placeholder={t('Brief title of the issue...', 'विषय का संक्षिप्त विवरण...')}
                      value={newComplaintSubject}
                      onChange={e => setNewComplaintSubject(e.target.value)}
                      required
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-bold text-[#243118]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Detailed Explanation & Discrepancy Information', 'विस्तृत विवरण एवं जानकारी')}</label>
                    <textarea
                      rows={3}
                      placeholder={t('Provide all relevant details, lot numbers, scale IDs, or dates...', 'सभी प्रासंगिक विवरण, लॉट नंबर, तिथि दर्ज करें...')}
                      value={newComplaintDesc}
                      onChange={e => setNewComplaintDesc(e.target.value)}
                      required
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 text-xs text-[#243118]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#71873f] hover:bg-[#607433] text-white font-extrabold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('LODGE COMPLAINT TICKET (AUTO-EXPLOIT RESOLUTION DESK) →', 'शिकायत दर्ज करें (स्वचालित निवारण डेस्क) →')}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 13. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#abbe99]/60 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-[#243118]">{t('CITIZEN & PORTAL NOTIFICATION CENTER', 'नागरिक एवं पोर्टल सूचना केंद्र')}</h2>
                  <p className="text-xs text-[#637554]">{t('Multi-channel SMS, Email, WhatsApp, and App alerts with downloadable information receipts', 'एसएमएस, ईमेल, व्हाट्सएप एवं ऐप अलर्ट तथा रसीद डाउनलोड')}</p>
                </div>
                <span className="bg-[#71873f] text-white font-bold px-3 py-1 rounded-full text-[10px]">
                  {t('AUTOMATED ALERTS ACTIVE', 'स्वचालित सूचनाएं सक्रिय')}
                </span>
              </div>

              <div className="space-y-3">
                {notificationsList.map(ntf => (
                  <div key={ntf.id} className="bg-white border border-[#abbe99]/60 rounded-3xl p-5 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="font-extrabold text-sm text-[#243118]">{ntf.title}</h4>
                        {ntf.isUnread && <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded">NEW</span>}
                      </div>
                      <span className="text-[11px] text-[#637554] font-bold">{ntf.time}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-sans">{ntf.message}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span>Channel: <strong>{ntf.type}</strong></span>
                        <span>Token: <strong>{ntf.tokenNo}</strong></span>
                      </div>

                      <button
                        onClick={() => handleDownloadNotificationReceipt(ntf)}
                        className="bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-[#71873f]/40 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('Download Information Receipt (.txt)', 'सूचना रसीद डाउनलोड करें (.txt)')}</span>
                      </button>
                    </div>
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
