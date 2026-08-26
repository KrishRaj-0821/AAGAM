import React, { useState } from 'react';
import {
  ChevronLeft, ArrowRight, Search, CheckCircle2, Check,
  TrendingUp, TrendingDown, BarChart3, Activity, Zap, Globe,
  Truck, Warehouse, QrCode, Phone, Mail, ShieldCheck,
  MapPin, Clock, Coins, Building2, UserCheck, FileText,
  Sprout, Gavel, Send, LifeBuoy, Users, Lock, Mic, Bot,
  CreditCard, Microscope, Scale, Shield, Settings, Wrench, Link as LinkIcon
} from 'lucide-react';

// ─── Crop price data for Analytics pages ──────────────────────────────────────
const CROP_PRICE_DATA = {
  Wheat: {
    msp: 2425,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [2380, 2410, 2450, 2510, 2570, 2530, 2495, 2590],
    color: '#f59e0b'
  },
  'Paddy (Basmati)': {
    msp: 2300,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [3800, 3950, 4100, 4250, 4180, 4000, 4150, 4180],
    color: '#3b82f6'
  },
  Mustard: {
    msp: 5950,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [6200, 6340, 6100, 5950, 5870, 6050, 6280, 6340],
    color: '#f97316'
  },
  Chana: {
    msp: 5650,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [5700, 5820, 5790, 5600, 5550, 5680, 5750, 5820],
    color: '#a78bfa'
  },
  Soyabean: {
    msp: 4892,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [4900, 5100, 5050, 4980, 4850, 4750, 4900, 4980],
    color: '#10b981'
  },
  Cotton: {
    msp: 7521,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [7600, 7750, 7920, 7800, 7650, 7500, 7700, 7920],
    color: '#ec4899'
  },
  Maize: {
    msp: 2225,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [2250, 2280, 2310, 2290, 2260, 2240, 2280, 2310],
    color: '#84cc16'
  },
  Tur: {
    msp: 7550,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    prices: [7800, 7950, 8120, 8000, 7900, 8050, 8100, 8120],
    color: '#f43f5e'
  }
};

// Mini Bar Chart Component (pure CSS/SVG, no external library)
function CropPriceChart({ cropName, data, msp }) {
  const max = Math.max(...data.prices, msp) * 1.08;
  const min = Math.min(...data.prices, msp) * 0.95;
  const range = max - min;
  const h = 120;
  const w = 320;
  const pad = 32;
  const chartW = w - pad * 2;
  const chartH = h - 20;

  const pts = data.prices.map((v, i) => {
    const x = pad + (i / (data.months.length - 1)) * chartW;
    const y = 10 + chartH - ((v - min) / range) * chartH;
    return `${x},${y}`;
  });
  const mspY = 10 + chartH - ((msp - min) / range) * chartH;

  const last = data.prices[data.prices.length - 1];
  const prev = data.prices[data.prices.length - 2];
  const pct = (((last - prev) / prev) * 100).toFixed(1);
  const isUp = last >= prev;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-extrabold text-[#243118]">{cropName}</span>
        <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(pct)}% ({isUp ? '+' : ''}₹{last - prev}/Qtl)
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="rounded-xl bg-[#fcfaf7] border border-[#abbe99]/60">
        {/* MSP dashed line */}
        <line x1={pad} y1={mspY} x2={w - pad} y2={mspY} stroke="#a36627" strokeWidth="1" strokeDasharray="4 3" />
        <text x={pad + 2} y={mspY - 3} fontSize="8" fill="#a36627" fontWeight="bold">MSP ₹{msp}</text>
        {/* Price area fill */}
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke={data.color}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Dots */}
        {data.prices.map((v, i) => {
          const x = pad + (i / (data.months.length - 1)) * chartW;
          const y = 10 + chartH - ((v - min) / range) * chartH;
          return <circle key={i} cx={x} cy={y} r="3.2" fill={data.color} stroke="white" strokeWidth="1.5" />;
        })}
        {/* Month labels */}
        {data.months.map((m, i) => {
          const x = pad + (i / (data.months.length - 1)) * chartW;
          return <text key={i} x={x} y={h - 2} textAnchor="middle" fontSize="8" fill="#637554">{m}</text>;
        })}
      </svg>
      <div className="flex justify-between text-[10px] font-mono text-[#637554]">
        <span>Current: <strong className="text-[#243118]">₹{last}/Qtl</strong></span>
        <span>MSP: <strong className="text-[#a36627]">₹{msp}/Qtl</strong></span>
        <span>vs MSP: <strong className={last >= msp ? 'text-emerald-700' : 'text-red-600'}>{last >= msp ? '+' : ''}₹{last - msp}</strong></span>
      </div>
    </div>
  );
}

export default function PersonaPortalPage({ activeRole, setActiveRole, setCurrentView, currentUser, onOpenVoiceAgent, t }) {
  const [activePageNum, setActivePageNum] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [simulationState, setSimulationState] = useState({});

  // Analytics page state
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [compareMode, setCompareMode] = useState(false);
  const [compareCrop, setCompareCrop] = useState('Mustard');

  // Payment page state
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Farmer page sub-tab
  const [farmerTab, setFarmerTab] = useState('overview');

  const all171Pages = [
    { id: 1, section: 'Public', titleEn: 'Home / Landing Page', titleHi: 'मुख्य पृष्ठ', category: 'Public' },
    { id: 2, section: 'Public', titleEn: 'About AAGAM', titleHi: 'आगामी के बारे में', category: 'Public' },
    { id: 3, section: 'Public', titleEn: 'How AAGAM Works', titleHi: 'आगामी कैसे काम करता है', category: 'Public' },
    { id: 4, section: 'Public', titleEn: 'Features & Architecture', titleHi: 'विशेषताएं एवं आर्किटेक्चर', category: 'Public' },
    { id: 5, section: 'Public', titleEn: 'Price Discovery Engine', titleHi: 'मूल्य खोज इंजन', category: 'Public' },
    { id: 6, section: 'Public', titleEn: 'Crop Marketplace', titleHi: 'फसल बाजार', category: 'Public' },
    { id: 7, section: 'Public', titleEn: 'Live E-Auction', titleHi: 'लाइव ई-नीलामी', category: 'Public' },
    { id: 8, section: 'Public', titleEn: 'Procurement Centers', titleHi: 'खरीद केंद्र', category: 'Public' },
    { id: 9, section: 'Public', titleEn: 'Analytics Overview', titleHi: 'विश्लेषण अवलोकन', category: 'Public' },
    { id: 10, section: 'Public', titleEn: 'Contact Us & Grievance', titleHi: 'संपर्क करें', category: 'Public' },
    { id: 11, section: 'Public', titleEn: 'FAQ & Helpdesk', titleHi: 'सामान्य प्रश्न', category: 'Public' },
    { id: 12, section: 'Public', titleEn: 'Terms & Conditions', titleHi: 'नियम और शर्तें', category: 'Public' },
    { id: 13, section: 'Public', titleEn: 'Privacy Policy', titleHi: 'गोपनीयता नीति', category: 'Public' },
    { id: 14, section: 'Auth', titleEn: 'GOI SSO Login', titleHi: 'लॉगिन', category: 'Auth' },
    { id: 15, section: 'Auth', titleEn: 'Stakeholder Registration', titleHi: 'पंजीकरण', category: 'Auth' },
    { id: 16, section: 'Auth', titleEn: 'Role Selection', titleHi: 'भूमिका चयन', category: 'Auth' },
    { id: 17, section: 'Auth', titleEn: 'Mobile / OTP Verification', titleHi: 'ओटीपी सत्यापन', category: 'Auth' },
    { id: 18, section: 'Auth', titleEn: 'Forgot Password', titleHi: 'पासवर्ड भूल गए', category: 'Auth' },
    { id: 19, section: 'Auth', titleEn: 'Reset Password', titleHi: 'पासवर्ड रीसेट', category: 'Auth' },
    { id: 20, section: 'Farmer', titleEn: 'Farmer Dashboard', titleHi: 'किसान डैशबोर्ड', category: 'Farmer' },
    { id: 21, section: 'Farmer', titleEn: 'My Profile & Aadhaar e-KYC', titleHi: 'मेरी प्रोफ़ाइल', category: 'Farmer' },
    { id: 22, section: 'Farmer', titleEn: 'Land Records & Khasra', titleHi: 'भूमि रिकॉर्ड', category: 'Farmer' },
    { id: 23, section: 'Farmer', titleEn: 'Add Land Record', titleHi: 'भूमि जोड़ें', category: 'Farmer' },
    { id: 24, section: 'Farmer', titleEn: 'Land Verification Status', titleHi: 'भूमि सत्यापन', category: 'Farmer' },
    { id: 25, section: 'Farmer', titleEn: 'My Registered Crops', titleHi: 'मेरी फसलें', category: 'Farmer' },
    { id: 26, section: 'Farmer', titleEn: 'Add New Crop Declaration', titleHi: 'नई फसल जोड़ें', category: 'Farmer' },
    { id: 27, section: 'Farmer', titleEn: 'Crop Details & Moisture', titleHi: 'फसल विवरण', category: 'Farmer' },
    { id: 28, section: 'Farmer', titleEn: 'Crop Offers', titleHi: 'फसल ऑफ़र', category: 'Farmer' },
    { id: 29, section: 'Farmer', titleEn: 'Price Comparison Tool', titleHi: 'मूल्य तुलना', category: 'Farmer' },
    { id: 30, section: 'Farmer', titleEn: 'Nearby Mandi Prices', titleHi: 'मंडी दरें', category: 'Farmer' },
    { id: 31, section: 'Farmer', titleEn: 'Private Buyer Offers', titleHi: 'खरीदार ऑफ़र', category: 'Farmer' },
    { id: 32, section: 'Farmer', titleEn: 'My Auctions', titleHi: 'मेरी नीलामी', category: 'Farmer' },
    { id: 33, section: 'Farmer', titleEn: 'Create Auction Lot', titleHi: 'नीलामी बनाएं', category: 'Farmer' },
    { id: 34, section: 'Farmer', titleEn: 'Auction Details', titleHi: 'नीलामी विवरण', category: 'Farmer' },
    { id: 35, section: 'Farmer', titleEn: 'Procurement Centers Directory', titleHi: 'खरीद केंद्र', category: 'Farmer' },
    { id: 36, section: 'Farmer', titleEn: 'Book Arrival Slot', titleHi: 'स्लॉट बुक करें', category: 'Farmer' },
    { id: 37, section: 'Farmer', titleEn: 'My Booked Slots', titleHi: 'मेरे स्लॉट', category: 'Farmer' },
    { id: 38, section: 'Farmer', titleEn: 'My QR Tokens', titleHi: 'क्यूआर टोकन', category: 'Farmer' },
    { id: 39, section: 'Farmer', titleEn: 'Digital Gate Pass', titleHi: 'गेट पास', category: 'Farmer' },
    { id: 40, section: 'Farmer', titleEn: 'Virtual Yard Queue', titleHi: 'वर्चुअल कतार', category: 'Farmer' },
    { id: 41, section: 'Farmer', titleEn: 'Queue Waiting Status', titleHi: 'कतार स्थिति', category: 'Farmer' },
    { id: 42, section: 'Farmer', titleEn: 'AI Quality Check', titleHi: 'गुणवत्ता जांच', category: 'Farmer' },
    { id: 43, section: 'Farmer', titleEn: 'Quality Lab Reports', titleHi: 'गुणवत्ता रिपोर्ट', category: 'Farmer' },
    { id: 44, section: 'Farmer', titleEn: 'Weighment / Tola Parchi', titleHi: 'तौल / तोला पर्ची', category: 'Farmer' },
    { id: 45, section: 'Farmer', titleEn: 'Acceptance Certificates', titleHi: 'स्वीकृति प्रमाण पत्र', category: 'Farmer' },
    { id: 46, section: 'Farmer', titleEn: 'Transport Booking', titleHi: 'परिवहन बुकिंग', category: 'Farmer' },
    { id: 47, section: 'Farmer', titleEn: 'Transport Tracking', titleHi: 'परिवहन ट्रैकिंग', category: 'Farmer' },
    { id: 48, section: 'Farmer', titleEn: 'My Payments & DBT', titleHi: 'मेरे भुगतान (DBT)', category: 'Farmer' },
    { id: 49, section: 'Farmer', titleEn: 'Payment Details & UTR', titleHi: 'भुगतान विवरण', category: 'Farmer' },
    { id: 50, section: 'Farmer', titleEn: 'Crop Traceability Journey', titleHi: 'फसल ट्रैसेबिलिटी', category: 'Farmer' },
    { id: 51, section: 'Farmer', titleEn: 'Notifications Center', titleHi: 'अधिसूचनाएं', category: 'Farmer' },
    { id: 52, section: 'Buyer', titleEn: 'Buyer Dashboard', titleHi: 'व्यापारी डैशबोर्ड', category: 'Buyer' },
    { id: 53, section: 'Buyer', titleEn: 'Buyer Profile & License', titleHi: 'व्यापारी प्रोफ़ाइल', category: 'Buyer' },
    { id: 54, section: 'Buyer', titleEn: 'Crop Marketplace Desk', titleHi: 'फसल बाजार', category: 'Buyer' },
    { id: 55, section: 'Buyer', titleEn: 'Crop Details & Assay', titleHi: 'फसल विवरण', category: 'Buyer' },
    { id: 56, section: 'Buyer', titleEn: 'My Submitted Offers', titleHi: 'मेरे ऑफ़र', category: 'Buyer' },
    { id: 57, section: 'Buyer', titleEn: 'Offer Details', titleHi: 'ऑफ़र विवरण', category: 'Buyer' },
    { id: 58, section: 'Buyer', titleEn: 'Live e-NAM Auctions', titleHi: 'लाइव नीलामी', category: 'Buyer' },
    { id: 59, section: 'Buyer', titleEn: 'Auction Details', titleHi: 'नीलामी विवरण', category: 'Buyer' },
    { id: 60, section: 'Buyer', titleEn: 'My Submitted Bids', titleHi: 'मेरी बोलियां', category: 'Buyer' },
    { id: 61, section: 'Buyer', titleEn: 'Won Auctions & Lots', titleHi: 'जीती नीलामी', category: 'Buyer' },
    { id: 62, section: 'Buyer', titleEn: 'Purchased Crops Inventory', titleHi: 'खरीदी गई फसलें', category: 'Buyer' },
    { id: 63, section: 'Buyer', titleEn: 'Order & Escrow History', titleHi: 'ऑर्डर इतिहास', category: 'Buyer' },
    { id: 64, section: 'Buyer', titleEn: 'Payment History & Receipts', titleHi: 'भुगतान इतिहास', category: 'Buyer' },
    { id: 65, section: 'Buyer', titleEn: 'Delivery Fleet Tracking', titleHi: 'डिलीवरी ट्रैकिंग', category: 'Buyer' },
    { id: 66, section: 'Officer', titleEn: 'Officer Dashboard', titleHi: 'अधिकारी डैशबोर्ड', category: 'Officer' },
    { id: 67, section: 'Officer', titleEn: 'Farmer Verification Review', titleHi: 'किसान सत्यापन', category: 'Officer' },
    { id: 68, section: 'Officer', titleEn: 'Land Record Verification', titleHi: 'भूमि सत्यापन', category: 'Officer' },
    { id: 69, section: 'Officer', titleEn: 'Crop Declaration Review', titleHi: 'फसल समीक्षा', category: 'Officer' },
    { id: 70, section: 'Officer', titleEn: 'Procurement Centers Management', titleHi: 'केंद्र प्रबंधन', category: 'Officer' },
    { id: 71, section: 'Officer', titleEn: 'Center Capacity Management', titleHi: 'क्षमता प्रबंधन', category: 'Officer' },
    { id: 72, section: 'Officer', titleEn: 'Daily Procurement Summary', titleHi: 'दैनिक खरीद', category: 'Officer' },
    { id: 73, section: 'Officer', titleEn: 'Slot Rescheduling Engine', titleHi: 'स्लॉट प्रबंधन', category: 'Officer' },
    { id: 74, section: 'Officer', titleEn: 'Delay & Rescheduling Log', titleHi: 'विलंब लॉग', category: 'Officer' },
    { id: 75, section: 'Officer', titleEn: 'Queue Monitoring Terminal', titleHi: 'कतार निगरानी', category: 'Officer' },
    { id: 76, section: 'Officer', titleEn: 'Gate Entry Monitoring', titleHi: 'गेट प्रवेश निगरानी', category: 'Officer' },
    { id: 77, section: 'Officer', titleEn: 'Weighment Monitoring', titleHi: 'तौल निगरानी', category: 'Officer' },
    { id: 78, section: 'Officer', titleEn: 'Quality Compliance Monitoring', titleHi: 'गुणवत्ता निगरानी', category: 'Officer' },
    { id: 79, section: 'Officer', titleEn: 'Acceptance Management', titleHi: 'स्वीकृति प्रबंधन', category: 'Officer' },
    { id: 80, section: 'Officer', titleEn: 'Payment Escrow Monitoring', titleHi: 'भुगतान निगरानी', category: 'Officer' },
    { id: 81, section: 'Operator', titleEn: 'Center Operator Dashboard', titleHi: 'संचालक डैशबोर्ड', category: 'Operator' },
    { id: 82, section: 'Operator', titleEn: 'QR Token Scanner Terminal', titleHi: 'क्यूआर स्कैनर', category: 'Operator' },
    { id: 83, section: 'Operator', titleEn: 'Manual Token Entry Fallback', titleHi: 'मैनुअल टोकन', category: 'Operator' },
    { id: 84, section: 'Operator', titleEn: 'Gate Entry Vehicle Log', titleHi: 'गेट प्रवेश', category: 'Operator' },
    { id: 85, section: 'Operator', titleEn: 'Vehicle Management', titleHi: 'वाहन प्रबंधन', category: 'Operator' },
    { id: 86, section: 'Operator', titleEn: 'Vehicle Priority Queue', titleHi: 'प्राथमिकता कतार', category: 'Operator' },
    { id: 87, section: 'Operator', titleEn: 'Live Yard Queue Monitor', titleHi: 'लाइव कतार', category: 'Operator' },
    { id: 88, section: 'Operator', titleEn: 'Weighment Entry Terminal', titleHi: 'तौल प्रविष्टि', category: 'Operator' },
    { id: 89, section: 'Operator', titleEn: 'Digital Tola Parchi Issuance', titleHi: 'तोला पर्ची', category: 'Operator' },
    { id: 90, section: 'Operator', titleEn: 'Daily Mandi Operations Summary', titleHi: 'दैनिक मंडी संचालन', category: 'Operator' },
    { id: 91, section: 'Quality', titleEn: 'Quality Inspector Dashboard', titleHi: 'गुणवत्ता निरीक्षक', category: 'Quality' },
    { id: 92, section: 'Quality', titleEn: 'Pending Inspections Queue', titleHi: 'लंबित निरीक्षण', category: 'Quality' },
    { id: 93, section: 'Quality', titleEn: 'Crop Physical Inspection', titleHi: 'फसल निरीक्षण', category: 'Quality' },
    { id: 94, section: 'Quality', titleEn: 'NIR Moisture Check Terminal', titleHi: 'नमी की जांच', category: 'Quality' },
    { id: 95, section: 'Quality', titleEn: 'Quality Grading (Grade A)', titleHi: 'गुणवत्ता ग्रेडिंग', category: 'Quality' },
    { id: 96, section: 'Quality', titleEn: 'Inspection History Audit', titleHi: 'निरीक्षण इतिहास', category: 'Quality' },
    { id: 97, section: 'Quality', titleEn: 'AI vs Manual Quality Deviation', titleHi: 'एआई बनाम मैनुअल', category: 'Quality' },
    { id: 98, section: 'Logistics', titleEn: 'Logistics Dashboard', titleHi: 'लॉजिस्टिक्स डैशबोर्ड', category: 'Logistics' },
    { id: 99, section: 'Logistics', titleEn: 'Transport Requests Pool', titleHi: 'परिवहन अनुरोध', category: 'Logistics' },
    { id: 100, section: 'Logistics', titleEn: 'Available Fleet Vehicles', titleHi: 'उपलब्ध वाहन', category: 'Logistics' },
    { id: 101, section: 'Logistics', titleEn: 'Vehicle Technical Details', titleHi: 'वाहन विवरण', category: 'Logistics' },
    { id: 102, section: 'Logistics', titleEn: 'Driver Management Registry', titleHi: 'चालक प्रबंधन', category: 'Logistics' },
    { id: 103, section: 'Logistics', titleEn: 'Transport Task Assignment', titleHi: 'परिवहन आवंटन', category: 'Logistics' },
    { id: 104, section: 'Logistics', titleEn: 'Pickup Yard Management', titleHi: 'पिकअप प्रबंधन', category: 'Logistics' },
    { id: 105, section: 'Logistics', titleEn: 'Live GPS Transport Tracking', titleHi: 'लाइव ट्रैकिंग', category: 'Logistics' },
    { id: 106, section: 'Logistics', titleEn: 'Completed Delivery Receipts', titleHi: 'पूर्ण सुपुर्दगी', category: 'Logistics' },
    { id: 107, section: 'Logistics', titleEn: 'Logistics Audit History', titleHi: 'लॉजिस्टिक्स इतिहास', category: 'Logistics' },
    { id: 108, section: 'Warehouse', titleEn: 'Warehouse Dashboard', titleHi: 'गोदाम डैशबोर्ड', category: 'Warehouse' },
    { id: 109, section: 'Warehouse', titleEn: 'Warehouse Capacity Holding', titleHi: 'गोदाम क्षमता', category: 'Warehouse' },
    { id: 110, section: 'Warehouse', titleEn: 'Current Grain Inventory', titleHi: 'अनाज सूची', category: 'Warehouse' },
    { id: 111, section: 'Warehouse', titleEn: 'Crop-wise Stock Ledger', titleHi: 'स्टॉक लेजर', category: 'Warehouse' },
    { id: 112, section: 'Warehouse', titleEn: 'Stock Inward Logging', titleHi: 'स्टॉक इन', category: 'Warehouse' },
    { id: 113, section: 'Warehouse', titleEn: 'Stock Outward Release', titleHi: 'स्टॉक आउट', category: 'Warehouse' },
    { id: 114, section: 'Warehouse', titleEn: 'Stock Movement Tracking', titleHi: 'स्टॉक आवाजाही', category: 'Warehouse' },
    { id: 115, section: 'Warehouse', titleEn: 'Warehouse Stock Transfers', titleHi: 'स्थानांतरण', category: 'Warehouse' },
    { id: 116, section: 'Warehouse', titleEn: 'Capacity Alert Engine', titleHi: 'क्षमता चेतावनी', category: 'Warehouse' },
    { id: 117, section: 'Warehouse', titleEn: 'Truck Inbound Request', titleHi: 'ट्रक अनुरोध', category: 'Warehouse' },
    { id: 118, section: 'Warehouse', titleEn: 'Electronic Receipt (e-NWR)', titleHi: 'ई-एनडब्ल्यूआर', category: 'Warehouse' },
    { id: 119, section: 'Payment', titleEn: 'Payment Dashboard', titleHi: 'भुगतान डैशबोर्ड', category: 'Payment' },
    { id: 120, section: 'Payment', titleEn: 'Pending Disbursals Queue', titleHi: 'लंबित भुगतान', category: 'Payment' },
    { id: 121, section: 'Payment', titleEn: 'Processing Escrow Payments', titleHi: 'प्रसंस्करण भुगतान', category: 'Payment' },
    { id: 122, section: 'Payment', titleEn: 'Completed DBT Transfers', titleHi: 'पूर्ण डीबीटी', category: 'Payment' },
    { id: 123, section: 'Payment', titleEn: 'Payment Details & Receipt', titleHi: 'भुगतान विवरण', category: 'Payment' },
    { id: 124, section: 'Payment', titleEn: 'Transaction History Audit', titleHi: 'लेनदेन इतिहास', category: 'Payment' },
    { id: 125, section: 'Payment', titleEn: 'NPCI DBT Tracking Engine', titleHi: 'डीबीटी ट्रैकिंग', category: 'Payment' },
    { id: 126, section: 'Payment', titleEn: 'Bank UTR Search Engine', titleHi: 'यूटीआर ट्रैकिंग', category: 'Payment' },
    { id: 127, section: 'Payment', titleEn: 'PFMS Audit Reports', titleHi: 'भुगतान रिपोर्ट', category: 'Payment' },
    { id: 128, section: 'Analytics', titleEn: 'AI Analytics Dashboard', titleHi: 'एआई डैशबोर्ड', category: 'Analytics' },
    { id: 129, section: 'Analytics', titleEn: 'Crop Supply Prediction', titleHi: 'फसल आपूर्ति पूर्वानुमान', category: 'Analytics' },
    { id: 130, section: 'Analytics', titleEn: 'Crop Arrival Forecast', titleHi: 'फसल आवक पूर्वानुमान', category: 'Analytics' },
    { id: 131, section: 'Analytics', titleEn: 'Center Overload Prediction', titleHi: 'केंद्र ओवरलोड भविष्यवाणी', category: 'Analytics' },
    { id: 132, section: 'Analytics', titleEn: 'Warehouse Capacity Forecast', titleHi: 'गोदाम पूर्वानुमान', category: 'Analytics' },
    { id: 133, section: 'Analytics', titleEn: 'Price Trend Prediction', titleHi: 'मूल्य प्रवृत्ति', category: 'Analytics' },
    { id: 134, section: 'Analytics', titleEn: 'AI Quality Prediction Model', titleHi: 'गुणवत्ता पूर्वानुमान', category: 'Analytics' },
    { id: 135, section: 'Analytics', titleEn: 'Demand Forecast Engine', titleHi: 'मांग पूर्वानुमान', category: 'Analytics' },
    { id: 136, section: 'Analytics', titleEn: 'Risk & Alert Dashboard', titleHi: 'जोखिम डैशबोर्ड', category: 'Analytics' },
    { id: 137, section: 'Traceability', titleEn: 'Crop Traceability Dashboard', titleHi: 'ट्रैसेबिलिटी डैशबोर्ड', category: 'Traceability' },
    { id: 138, section: 'Traceability', titleEn: 'Crop Journey Timeline', titleHi: 'फसल यात्रा', category: 'Traceability' },
    { id: 139, section: 'Traceability', titleEn: 'Cryptographic Ledger History', titleHi: 'लेनदेन इतिहास', category: 'Traceability' },
    { id: 140, section: 'Traceability', titleEn: 'Traceability Deep Details', titleHi: 'ट्रैसेबिलिटी विवरण', category: 'Traceability' },
    { id: 141, section: 'Traceability', titleEn: 'Audit Logs Certificate', titleHi: 'ऑडिट लॉग', category: 'Traceability' },
    { id: 142, section: 'Traceability', titleEn: 'Blockchain Block Records', titleHi: 'ब्लॉकचेन रिकॉर्ड', category: 'Traceability' },
    { id: 143, section: 'Admin', titleEn: 'Admin Master Dashboard', titleHi: 'प्रशासक डैशबोर्ड', category: 'Admin' },
    { id: 144, section: 'Admin', titleEn: 'User Management Portal', titleHi: 'उपयोगकर्ता प्रबंधन', category: 'Admin' },
    { id: 145, section: 'Admin', titleEn: 'Farmer Master Registry', titleHi: 'किसान प्रबंधन', category: 'Admin' },
    { id: 146, section: 'Admin', titleEn: 'Buyer Master Registry', titleHi: 'व्यापारी प्रबंधन', category: 'Admin' },
    { id: 147, section: 'Admin', titleEn: 'Procurement Centers Master', titleHi: 'खरीद केंद्र', category: 'Admin' },
    { id: 148, section: 'Admin', titleEn: 'Warehouse Granary Master', titleHi: 'गोदाम प्रबंधन', category: 'Admin' },
    { id: 149, section: 'Admin', titleEn: 'Commodity Crop Master', titleHi: 'फसल प्रबंधन', category: 'Admin' },
    { id: 150, section: 'Admin', titleEn: 'Government MSP Policy Master', titleHi: 'एमएसपी प्रबंधन', category: 'Admin' },
    { id: 151, section: 'Admin', titleEn: 'Role Access Control (RBAC)', titleHi: 'भूमिकाएं', category: 'Admin' },
    { id: 152, section: 'Admin', titleEn: 'Security & Audit Logs', titleHi: 'सुरक्षा ऑडिट', category: 'Admin' },
    { id: 153, section: 'Admin', titleEn: 'System Configuration', titleHi: 'सिस्टम विन्यास', category: 'Admin' },
    { id: 154, section: 'Admin', titleEn: 'API Gateway & Webhooks', titleHi: 'एपीआई प्रबंधन', category: 'Admin' },
    { id: 155, section: 'Admin', titleEn: 'SMS & WhatsApp Gateway', titleHi: 'एसएमएस गेटवे', category: 'Admin' },
    { id: 156, section: 'Admin', titleEn: 'Email Notification Services', titleHi: 'ईमेल सेवाएं', category: 'Admin' },
    { id: 157, section: 'Admin', titleEn: 'NPCI DBT Bridge Config', titleHi: 'डीबीटी गेटवे', category: 'Admin' },
    { id: 158, section: 'Admin', titleEn: 'Database Backup & DR', titleHi: 'बैकअप प्रबंधन', category: 'Admin' },
    { id: 159, section: 'Admin', titleEn: 'Microservices Health Monitor', titleHi: 'सेवा स्वास्थ्य', category: 'Admin' },
    { id: 160, section: 'Admin', titleEn: 'Real-time Server Cluster Status', titleHi: 'सर्वर स्थिति', category: 'Admin' },
    { id: 161, section: 'Admin', titleEn: 'Master Procurement Reports', titleHi: 'मास्टर रिपोर्ट', category: 'Admin' },
    { id: 162, section: 'Admin', titleEn: 'Export Data Central Kiosk', titleHi: 'डेटा निर्यात', category: 'Admin' },
    { id: 163, section: 'Common', titleEn: 'User Profile Settings', titleHi: 'प्रोफ़ाइल सेटिंग्स', category: 'Common' },
    { id: 164, section: 'Common', titleEn: 'Account Settings', titleHi: 'खाता सेटिंग्स', category: 'Common' },
    { id: 165, section: 'Common', titleEn: 'Security Settings', titleHi: 'सुरक्षा सेटिंग्स', category: 'Common' },
    { id: 166, section: 'Common', titleEn: 'Language Settings', titleHi: 'भाषा सेटिंग्स', category: 'Common' },
    { id: 167, section: 'Common', titleEn: 'Help & Support Kiosk', titleHi: 'सहायता', category: 'Common' },
    { id: 168, section: 'Common', titleEn: 'Report a Problem', titleHi: 'समस्या दर्ज करें', category: 'Common' },
    { id: 169, section: 'Common', titleEn: '404 Not Found Page', titleHi: '404 पृष्ठ', category: 'Common' },
    { id: 170, section: 'Common', titleEn: 'Access Denied Guard', titleHi: 'पहुंच अस्वीकृत', category: 'Common' },
    { id: 171, section: 'Common', titleEn: 'Server Error Handler', titleHi: 'सर्वर त्रुटि', category: 'Common' }
  ];

  const activePageObj = all171Pages.find(p => p.id === activePageNum) || all171Pages[0];
  const filteredPages = all171Pages.filter(p =>
    p.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.titleHi.includes(searchFilter) ||
    p.id.toString().includes(searchFilter)
  );

  const handleExecuteAction = () => {
    const time = new Date().toLocaleTimeString('en-IN');
    setActionSuccessMsg(`Page #${activePageObj.id} action executed at ${time} — Blockchain ledger synchronized.`);
    setSimulationState(prev => ({
      ...prev,
      [activePageObj.id]: { executed: true, time, code: `GOI-SYNC-0x${Math.floor(Math.random() * 999999).toString(16).toUpperCase()}` }
    }));
    setTimeout(() => setActionSuccessMsg(''), 4500);
  };

  // ── Per-page dynamic content renderer ─────────────────────────────────────
  const renderDynamicPageContent = () => {
    const p = activePageObj;
    const id = p.id;

    // PAGE 1: Home / Landing
    if (id === 1) return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Pan-India Mandis', val: '2,840 Live', sub: 'Agmarknet Gateway Active', bg: 'emerald', icon: Building2 },
            { label: 'Total DBT Transferred', val: '₹1,42,500 Cr', sub: '100% NPCI Escrow Backed', bg: 'amber', icon: CreditCard },
            { label: 'Registered Farmers', val: '4.2 Crore', sub: 'PM-KISAN Database Linked', bg: 'sky', icon: Sprout }
          ].map(c => {
            const IconComp = c.icon;
            return (
              <div key={c.label} className={`bg-${c.bg}-50 border border-${c.bg}-300 p-4 rounded-2xl font-mono`}>
                <IconComp className={`w-6 h-6 mb-1 text-${c.bg}-800`} />
                <div className={`text-[10px] text-${c.bg}-800 uppercase font-bold`}>{c.label}</div>
                <div className={`text-2xl font-extrabold text-${c.bg}-900`}>{c.val}</div>
                <div className={`text-[10px] text-${c.bg}-700`}>{c.sub}</div>
              </div>
            );
          })}
        </div>
        <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-xs text-[#243118] mb-2">Quick Navigation — Core AAGAM Workflows</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-[#243118]">
            <button onClick={() => setCurrentView('prices')} className="bg-white p-3 rounded-xl border border-[#abbe99] hover:bg-[#71873f] hover:text-white transition-all flex items-center justify-center gap-1.5">
              <BarChart3 className="w-4 h-4" /> <span>Live MSP Prices</span>
            </button>
            <button onClick={() => setCurrentView('marketplace')} className="bg-white p-3 rounded-xl border border-[#abbe99] hover:bg-[#71873f] hover:text-white transition-all flex items-center justify-center gap-1.5">
              <Sprout className="w-4 h-4" /> <span>Crop Market</span>
            </button>
            <button onClick={() => setCurrentView('eauction')} className="bg-white p-3 rounded-xl border border-[#abbe99] hover:bg-[#71873f] hover:text-white transition-all flex items-center justify-center gap-1.5">
              <Gavel className="w-4 h-4" /> <span>Live e-Auction</span>
            </button>
            <button onClick={() => setCurrentView('logistics')} className="bg-white p-3 rounded-xl border border-[#abbe99] hover:bg-[#71873f] hover:text-white transition-all flex items-center justify-center gap-1.5">
              <Truck className="w-4 h-4" /> <span>GPS Logistics</span>
            </button>
          </div>
        </div>
      </div>
    );

    // PAGES 2-4: About / How It Works / Features
    if (id >= 2 && id <= 4) return (
      <div className="space-y-4">
        <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-sm text-[#243118] mb-3">AAGAM 5-Stage End-to-End Automation Pipeline</h4>
          <div className="grid grid-cols-5 gap-2 text-[10px] font-mono text-center">
            {[
              { n: 1, title: 'e-Declaration', sub: 'Crop + Land Khasra', color: '#71873f' },
              { n: 2, title: 'Slot + QR Pass', sub: 'Staggered Hourly Gate', color: '#71873f' },
              { n: 3, title: 'AI NIR Assay', sub: '45-sec Moisture Scan', color: '#71873f' },
              { n: 4, title: 'Weighbridge', sub: 'Gross → Net Tola Parchi', color: '#71873f' },
              { n: 5, title: '48h DBT Credit', sub: 'NPCI Aadhaar Bridge', color: '#a36627' }
            ].map(s => (
              <div key={s.n} className="bg-white p-2 rounded-xl border border-[#abbe99]">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-extrabold text-xs mx-auto mb-1" style={{ background: s.color }}>
                  {s.n}
                </div>
                <div className="font-bold text-[#243118]">{s.title}</div>
                <div className="text-[#637554] text-[9px]">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
        {id === 4 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {['NIC MeitY Tier-4 Cloud', 'SHA-256 Encryption', 'NPCI DBT Bridge', 'AgriStack Linked'].map(f => (
              <div key={f} className="bg-white p-3 rounded-xl border border-emerald-300 text-center">
                <div className="text-emerald-600 font-bold text-[10px] flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active</span>
                </div>
                <div className="font-bold text-[#243118]">{f}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    // PAGE 5: Price Discovery Engine
    if (id === 5) return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-sm text-[#243118] mb-3 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-emerald-700" />
            <span>Live Price Discovery — Top Mandis Right Now</span>
          </h4>
          <div className="space-y-2">
            {[
              { crop: 'Wheat (Sharbati)', mandi: 'Karnal Central, HR', msp: 2425, price: 2590, vol: '1,420 MT' },
              { crop: 'Paddy (Basmati 1121)', mandi: 'Khanna APMC, PB', msp: 2300, price: 4180, vol: '2,890 MT' },
              { crop: 'Mustard (Bold)', mandi: 'Bharatpur APMC, RJ', msp: 5950, price: 6340, vol: '980 MT' },
              { crop: 'Soyabean (Yellow)', mandi: 'Ujjain Mandi, MP', msp: 4892, price: 4980, vol: '1,640 MT' },
              { crop: 'Cotton (Long Staple)', mandi: 'Rajkot Yard, GJ', msp: 7521, price: 7920, vol: '840 MT' }
            ].map(r => {
              const pct = (((r.price - r.msp) / r.msp) * 100).toFixed(1);
              return (
                <div key={r.crop} className="flex items-center justify-between bg-[#fcfaf7] p-2.5 rounded-xl border border-[#abbe99]/60 text-xs font-mono">
                  <div>
                    <div className="font-bold text-[#243118]">{r.crop}</div>
                    <div className="text-[10px] text-[#637554]">{r.mandi} • Volume: {r.vol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-base text-[#243118]">₹{r.price}/Qtl</div>
                    <div className="text-[10px] font-bold text-emerald-700">+{pct}% above MSP (₹{r.msp})</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    // PAGE 6: Marketplace
    if (id === 6) return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99]">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-extrabold text-sm text-[#243118]">Featured Verified Produce Lots</h4>
            <button onClick={() => setCurrentView('marketplace')} className="text-xs text-[#71873f] font-bold hover:underline">
              View All 4,820 Lots →
            </button>
          </div>
          <div className="space-y-2 text-xs font-mono">
            {[
              { crop: 'Wheat FAQ Sharbati', qty: '500 Qtl', seller: 'Gurpreet Singh (PB)', mandi: 'Khanna APMC', price: 2580 },
              { crop: 'Basmati Paddy 1121', qty: '800 Qtl', seller: 'Amarjit Kaur (HR)', mandi: 'Karnal Yard', price: 4180 },
              { crop: 'Mustard Bold Grade A', qty: '350 Qtl', seller: 'Ramesh Sharma (RJ)', mandi: 'Bharatpur', price: 6320 }
            ].map(l => (
              <div key={l.crop} className="flex justify-between items-center p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                <div>
                  <div className="font-bold text-[#243118]">{l.crop} — {l.qty}</div>
                  <div className="text-[10px] text-[#637554]">{l.seller} • {l.mandi}</div>
                </div>
                <div className="font-extrabold text-[#a36627]">₹{l.price}/Qtl</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // PAGE 7: Live E-Auction
    if (id === 7) return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-red-50 border border-red-300 p-4 rounded-2xl font-mono text-center">
            <div className="text-[10px] text-red-700 font-bold uppercase flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>LIVE NOW</span>
            </div>
            <div className="text-2xl font-extrabold text-red-900">12 Auctions</div>
            <div className="text-[10px] text-red-600">Active Bidding Rooms</div>
          </div>
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl font-mono text-center">
            <div className="text-[10px] text-amber-800 font-bold uppercase">Live Bids Cast</div>
            <div className="text-2xl font-extrabold text-amber-900">1,840</div>
            <div className="text-[10px] text-amber-700">Today's Session</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl font-mono text-center">
            <div className="text-[10px] text-emerald-800 uppercase font-bold">Value Transacted</div>
            <div className="text-2xl font-extrabold text-emerald-900">₹8.4 Cr</div>
            <div className="text-[10px] text-emerald-700">Today Total</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-red-200">
          <div className="font-extrabold text-xs text-[#243118] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Top 3 Live Ongoing Auctions — Join Now
          </div>
          <div className="space-y-2 text-xs font-mono">
            {[
              { lot: 'Lot #PB-KNH-2241', crop: 'Paddy Basmati 1121', qty: '420 Qtl', bid: 4200, leader: 'Arun Traders' },
              { lot: 'Lot #HR-KRN-0892', crop: 'Wheat FAQ Grade A', qty: '280 Qtl', bid: 2620, leader: 'Punjab Agri Corp' },
              { lot: 'Lot #MH-LAT-0445', crop: 'Chana Desi Premium', qty: '160 Qtl', bid: 5890, leader: 'Vimal Foods' }
            ].map(a => (
              <div key={a.lot} className="bg-red-50 border border-red-200 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#243118]">{a.lot} — {a.crop} ({a.qty})</div>
                  <div className="text-[10px] text-[#637554]">Leader: {a.leader}</div>
                </div>
                <div className="font-extrabold text-red-700">₹{a.bid}/Qtl <span className="text-red-400 text-[10px]">LIVE</span></div>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrentView('eauction')} className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5">
            <Gavel className="w-4 h-4" />
            <span>Enter Live Auction Room →</span>
          </button>
        </div>
      </div>
    );

    // PAGE 8: Procurement Centers
    if (id === 8) return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
          {[
            { label: 'Centers Active', val: '2,840', color: 'emerald' },
            { label: 'Daily Capacity', val: '18,000 MT', color: 'amber' },
            { label: 'States Covered', val: '36 States', color: 'sky' },
            { label: 'Avg Queue SLA', val: '< 3 Hours', color: 'purple' }
          ].map(c => (
            <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-300 p-3 rounded-2xl`}>
              <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
              <div className={`text-[10px] text-${c.color}-700 font-bold uppercase`}>{c.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-xs text-[#243118] mb-2">Top Procurement Centers — Today's Activity</h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'Karnal Central Yard', state: 'Haryana', arrivals: '1,420 MT', capacity: '2,000 MT', pct: 71 },
              { name: 'Khanna APMC', state: 'Punjab', arrivals: '2,890 MT', capacity: '3,500 MT', pct: 83 },
              { name: 'Bharatpur APMC', state: 'Rajasthan', arrivals: '980 MT', capacity: '1,800 MT', pct: 54 },
              { name: 'Latur APMC', state: 'Maharashtra', arrivals: '1,150 MT', capacity: '2,200 MT', pct: 52 }
            ].map(c => (
              <div key={c.name} className="p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#243118]">{c.name} <span className="text-[#637554] font-normal">• {c.state}</span></span>
                  <span className="font-bold text-[#a36627]">{c.arrivals} / {c.capacity}</span>
                </div>
                <div className="w-full bg-[#e0e8d6] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#71873f]" style={{ width: `${c.pct}%` }}></div>
                </div>
                <div className="text-[9px] text-[#637554] mt-0.5">{c.pct}% capacity utilized</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // PAGE 9: Analytics Overview — FULL INTERACTIVE CHART
    if (id === 9) return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h4 className="font-extrabold text-sm text-[#243118] flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Crop Price Trend — Jan–Aug 2025 (vs MSP Baseline)</span>
            </h4>
            <label className="flex items-center gap-2 text-xs font-bold text-[#637554] cursor-pointer select-none">
              <input type="checkbox" checked={compareMode} onChange={e => setCompareMode(e.target.checked)} className="w-3.5 h-3.5" />
              Compare Mode
            </label>
          </div>

          {/* Crop selector chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(CROP_PRICE_DATA).map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                  selectedCrop === c
                    ? 'text-white shadow-md'
                    : 'bg-white text-[#637554] border-[#abbe99] hover:border-[#71873f]'
                }`}
                style={selectedCrop === c ? { background: CROP_PRICE_DATA[c].color, borderColor: CROP_PRICE_DATA[c].color } : {}}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Main selected crop chart */}
          <CropPriceChart cropName={selectedCrop} data={CROP_PRICE_DATA[selectedCrop]} msp={CROP_PRICE_DATA[selectedCrop].msp} />

          {/* Compare Mode */}
          {compareMode && (
            <div className="mt-4 pt-4 border-t border-[#abbe99]/60">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-[#243118]">Compare with:</span>
                <select
                  value={compareCrop}
                  onChange={e => setCompareCrop(e.target.value)}
                  className="text-xs border border-[#abbe99] rounded-lg px-2 py-1 bg-[#fcfaf7] font-bold text-[#243118] focus:outline-none"
                >
                  {Object.keys(CROP_PRICE_DATA).filter(c => c !== selectedCrop).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <CropPriceChart cropName={compareCrop} data={CROP_PRICE_DATA[compareCrop]} msp={CROP_PRICE_DATA[compareCrop].msp} />
            </div>
          )}
        </div>

        {/* Price increase/decrease summary table */}
        <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-xs text-[#243118] mb-2">All Crops — Price Change Summary (Jan vs Aug 2025)</h4>
          <div className="space-y-1.5">
            {Object.entries(CROP_PRICE_DATA).map(([name, d]) => {
              const start = d.prices[0];
              const end = d.prices[d.prices.length - 1];
              const diff = end - start;
              const pct = (((end - start) / start) * 100).toFixed(1);
              const vsMsp = end - d.msp;
              return (
                <div key={name} className="flex items-center justify-between text-xs font-mono bg-white p-2 rounded-xl border border-[#abbe99]/50">
                  <button
                    onClick={() => { setSelectedCrop(name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="font-bold text-[#243118] hover:text-[#71873f] transition-colors text-left"
                  >
                    {name}
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-[#637554]">₹{start} → ₹{end}</span>
                    <span className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${diff >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {diff >= 0 ? '▲' : '▼'} {Math.abs(pct)}%
                    </span>
                    <span className={`font-bold text-[10px] ${vsMsp >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      vs MSP: {vsMsp >= 0 ? '+' : ''}₹{vsMsp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    // PAGE 10: Contact Us & Grievance
    if (id === 10) return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div 
            onClick={() => onOpenVoiceAgent && onOpenVoiceAgent()}
            className="bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-500 p-4 rounded-2xl font-mono text-center cursor-pointer transition-all shadow-sm group active:scale-95"
            title="Talk to 24x7 AI Voice Agent"
          >
            <div className="relative inline-block mb-1">
              <Mic className="w-6 h-6 text-emerald-700 animate-pulse group-hover:scale-110 transition-transform" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
            </div>
            <div className="text-xs font-extrabold text-emerald-950">AAGAM AI Voice Agent</div>
            <div className="text-[10px] text-emerald-700 font-bold">24x7 Live (Click to Speak)</div>
          </div>
          <div className="bg-sky-50 border border-sky-300 p-4 rounded-2xl font-mono text-center">
            <Mail className="w-6 h-6 text-sky-600 mx-auto mb-1" />
            <div className="text-xs font-extrabold text-sky-900">aagam.help.gov@gmail.com</div>
            <div className="text-[10px] text-sky-700">Official Email Support</div>
          </div>
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl font-mono text-center">
            <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <div className="text-xs font-extrabold text-amber-900">Krishi Bhawan, New Delhi</div>
            <div className="text-[10px] text-amber-700">Ministry of Agriculture HQ</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-xs text-[#243118] mb-2">Today's Grievance Tracker</h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { id: 'GOI-HELP-48291', cat: 'DBT Payment Delay', status: 'RESOLVED', time: '1h 12m ago' },
              { id: 'GOI-HELP-48290', cat: 'QR Code Not Scanning', status: 'IN PROGRESS', time: '2h 40m ago' },
              { id: 'GOI-HELP-48289', cat: 'Weighment Entry Error', status: 'ESCALATED', time: '3h 5m ago' }
            ].map(g => (
              <div key={g.id} className="flex justify-between p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                <div>
                  <span className="font-bold text-[#243118]">{g.id}</span>
                  <span className="text-[#637554] ml-2">{g.cat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : g.status === 'IN PROGRESS' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{g.status}</span>
                  <span className="text-[#637554] text-[10px]">{g.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // PAGE 11: FAQ & Helpdesk
    if (id === 11) return (
      <div className="space-y-3">
        <div className="bg-[#f0f4ea] p-3 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-xs text-[#243118] mb-2">Frequently Asked Questions</h4>
          <div className="space-y-2">
            {[
              { q: 'How do I register as a farmer on AAGAM?', a: 'Visit Login → Stakeholder Registration → enter Aadhaar, mobile and bank account details. e-KYC is auto-completed via DigiLocker.' },
              { q: 'When will my DBT payment arrive?', a: 'DBT transfers are initiated within 48 hours of weighment confirmation. Track via My Payments → UTR Status.' },
              { q: 'What is NIR Moisture Check?', a: 'NIR (Near Infra-Red) spectroscopy checks grain moisture in 45 seconds. Wheat must be ≤12% for Grade A acceptance.' },
              { q: 'How do I get my Gate Pass QR Code?', a: 'After booking a slot, go to My QR Tokens → Digital Gate Pass. Download the PDF and show at the mandi entrance.' },
              { q: 'Can I participate in e-Auction as a buyer?', a: 'Yes. Register as a Buyer, submit your eNAM trading license, and place bids in the Live E-Auction section.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-[#abbe99]">
                <div className="font-bold text-[11px] text-[#243118]">Q: {f.q}</div>
                <div className="text-[10px] text-[#637554] mt-1">A: {f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // PAGE 12: Terms & Conditions
    if (id === 12) return (
      <div className="space-y-3">
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono space-y-2">
          <h4 className="font-extrabold text-sm text-[#243118] border-b pb-2">AAGAM Portal — Terms & Conditions v2.1 (2025)</h4>
          {[
            { section: '1. Eligibility', text: 'Only PM-KISAN enrolled farmers with valid Aadhaar and land records are eligible for procurement through AAGAM Portal.' },
            { section: '2. Data Privacy', text: 'All biometric and banking data is encrypted using SHA-256 and stored on NIC MeitY Tier-4 servers. No data is shared with third parties.' },
            { section: '3. Payment Terms', text: 'MSP payments are guaranteed within 48 hours of weighment confirmation. PFMS and NPCI escrow mechanisms ensure zero fraud.' },
            { section: '4. Dispute Resolution', text: 'Any dispute on price, quality, or payment must be filed via the Grievance portal within 15 working days of the transaction.' },
            { section: '5. Auction Rules', text: 'Bids once placed in e-NAM auctions are binding. Bid withdrawal must occur before 30 minutes of lot closure.' }
          ].map(s => (
            <div key={s.section} className="p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
              <div className="font-extrabold text-[#243118]">{s.section}</div>
              <div className="text-[#637554] mt-0.5">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    );

    // PAGE 13: Privacy Policy
    if (id === 13) return (
      <div className="space-y-3">
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs space-y-3">
          <h4 className="font-extrabold text-sm text-[#243118] border-b pb-2">Privacy Policy — AAGAM Portal (IT Act 2000 & DPDP 2023 Compliant)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
            {[
              { icon: Lock, title: 'Data Encryption', desc: 'AES-256 + SHA-256 end-to-end for all PII data' },
              { icon: Shield, title: 'Aadhaar Policy', desc: 'UIDAI compliant — no Aadhaar raw data stored' },
              { icon: Building2, title: 'Banking Data', desc: 'Bank account data masked — only UTR reference kept' },
              { icon: MapPin, title: 'Location Data', desc: 'GPS data used only for logistics ETAs — not retained beyond 7 days' },
              { icon: Mail, title: 'Contact Data', desc: 'Mobile & email used only for OTP, notifications, DBT alerts' },
              { icon: BarChart3, title: 'Analytics', desc: 'Aggregated, anonymized data used for government policy planning only' }
            ].map(c => {
              const IconComp = c.icon;
              return (
                <div key={c.title} className="p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div className="font-bold text-[#243118] flex items-center gap-1.5">
                    <IconComp className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{c.title}</span>
                  </div>
                  <div className="text-[#637554] text-[10px] mt-0.5">{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    // PAGES 14-19: Auth Pages
    if (id >= 14 && id <= 19) return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="bg-sky-50 border border-sky-300 p-4 rounded-2xl text-center">
            <UserCheck className="w-7 h-7 text-sky-600 mx-auto mb-1" />
            <div className="text-sm font-extrabold text-sky-900">GOI SSO Gateway</div>
            <div className="text-[10px] text-sky-700">DigiLocker + Aadhaar e-KYC</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center">
            <Lock className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
            <div className="text-sm font-extrabold text-emerald-900">MFA Active</div>
            <div className="text-[10px] text-emerald-700">OTP via Mobile + Email</div>
          </div>
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl text-center">
            <ShieldCheck className="w-7 h-7 text-amber-600 mx-auto mb-1" />
            <div className="text-sm font-extrabold text-amber-900">RBAC Roles</div>
            <div className="text-[10px] text-amber-700">Farmer / Buyer / Officer / Admin</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono space-y-2">
          <h4 className="font-extrabold text-[#243118] border-b pb-2">Auth Module: {p.titleEn}</h4>
          {id === 14 && <p className="text-[#637554]">Secure Google SSO + Aadhaar e-KYC federated login. Registered users skip OTP if trusted device.</p>}
          {id === 15 && <p className="text-[#637554]">New stakeholder registration: fill Aadhaar, mobile, bank account, and role. e-KYC auto-verified via UIDAI API.</p>}
          {id === 16 && <p className="text-[#637554]">Select your portal role: Farmer, Buyer/Trader, Procurement Officer, Logistics, Warehouse, Quality Inspector, or Admin.</p>}
          {id === 17 && <p className="text-[#637554]">6-digit OTP sent to registered Aadhaar-linked mobile. OTP expires in 5 minutes. Retry after 30 seconds.</p>}
          {id === 18 && <p className="text-[#637554]">Forgot password link sent to registered email. Reset link valid for 15 minutes with CAPTCHA challenge.</p>}
          {id === 19 && <p className="text-[#637554]">New password must meet NIC security standards: 8+ characters, 1 uppercase, 1 number, 1 special character.</p>}
        </div>
      </div>
    );

    // PAGES 20-51: Farmer Pages — each gets specific content based on page
    if (id >= 20 && id <= 51) {
      const farmerSpecific = {
        20: { title: 'Farmer Dashboard Overview', widgets: ['My Crops: 2 Active', 'DBT Balance: ₹4,36,500', 'Next Slot: 08-Sep-25 (10 AM)', 'Avg Moisture: 10.8%'] },
        21: { title: 'Aadhaar e-KYC Profile', widgets: ['Aadhaar: XXXX-XXXX-9482 (Verified)', 'Bank: SBI XXXX4892', 'Land: 4.5 Acres (Khasra 48/2)', 'Mobile: +91 98765 XXXXX'] },
        22: { title: 'Land Records (Khasra/Khatauni)', widgets: ['Plot: Khasra 48/2, 4.5 Acres', 'District: Karnal, Haryana', 'Soil: Sandy Loam (Class II)', 'Bhulekh Status: VERIFIED'] },
        23: { title: 'Add New Land Record', widgets: ['Khasra Number Entry', 'State → District → Tehsil', 'Land Area in Acres/Bigha', 'Upload: Jamabandi / Patta'] },
        24: { title: 'Land Verification Status', widgets: ['Block Status: APPROVED', 'Patwari Confirmation: Verified', 'Doob / Encumbrance: NIL', 'Ownership Type: Patta (Self)'] },
        25: { title: 'My Registered Crops', widgets: ['Wheat (180 Qtl) — Active', 'Paddy (220 Qtl) — Kharif 2025', 'Season: Rabi 2024-25', 'Variety: HD-3086 Sharbati'] },
        26: { title: 'Add New Crop Declaration', widgets: ['Crop: Select from 100+ types', 'Sowing Date: Input', 'Expected Harvest: Qtl/Acre', 'Variety: Local / Hybrid'] },
        27: { title: 'Crop Details & Moisture', widgets: ['Moisture: 10.8% (FAQ Pass)', 'Grade: A (< 12%)', 'Protein: 11.2%', 'Foreign Matter: 0.8%'] },
        28: { title: 'Crop Offers — Active Bids', widgets: ['Highest Offer: ₹2,630/Qtl', 'Bidder: Punjab Agri Corp', 'Offer Valid: 48 hours', 'Accept / Counter Available'] },
        29: { title: 'Price Comparison Tool', widgets: ['Your MSP: ₹2,425', 'Best Mandi Rate: ₹2,590', 'Best Buyer Offer: ₹2,630', 'Premium: ₹205/Qtl above MSP'] },
        30: { title: 'Nearby Mandi Live Rates', widgets: ['Karnal: ₹2,590 (14 km)', 'Kurukshetra: ₹2,565 (28 km)', 'Kaithal: ₹2,540 (35 km)', 'Panipat: ₹2,520 (62 km)'] },
        31: { title: 'Private Buyer Offers', widgets: ['ITC Ltd: ₹2,640/Qtl', 'HAFED: ₹2,620/Qtl', 'Adani Agri: ₹2,610/Qtl', 'Amul Agri: ₹2,590/Qtl'] },
        32: { title: 'My Auctions', widgets: ['Active: 1 Auction (Lot #PB)', 'Status: Rank #1 Leading', 'Closing: 2h 45m', 'Current Bid: ₹4,220/Qtl'] },
        33: { title: 'Create Auction Lot', widgets: ['Lot Name: [Your Name]', 'Quantity: XX Qtl', 'Reserve Price: ₹ input', 'Duration: 2h / 4h / 6h'] },
        34: { title: 'Auction Lot Details', widgets: ['Lot: #PB-KNH-2241', 'Bids Received: 14', 'Highest: ₹4,220/Qtl', 'Time Left: 2h 45m'] },
        35: { title: 'Procurement Centers Directory', widgets: ['36 States, 2,840 Centers', 'Sort by Distance / Capacity', 'Filter by Crop Type', 'Check Slot Availability'] },
        36: { title: 'Book Arrival Slot', widgets: ['Center: Karnal Yard, Lane 4', 'Date: 08-Sep-2025', 'Slot: 10:00 AM – 11:00 AM', 'Vehicle: PB-10-AB-1234'] },
        37: { title: 'My Booked Slots', widgets: ['Slot #HR-KRN-SLT-4829', 'Date: 08-Sep-2025, 10 AM', 'Center: Karnal Central Yard', 'Status: CONFIRMED'] },
        38: { title: 'My QR Tokens', widgets: ['Token: #HR-KRN-4829', 'Crop: 180 Qtl Wheat', 'Validity: 8-Sep-2025', 'QR: Scannable at Gate'] },
        39: { title: 'Digital Gate Pass', widgets: ['Pass: AAGAM-GP-4829', 'Lane: Weighbridge #4', 'ETA: 08-Sep-25 10:00 AM', 'QR: Download PDF'] },
        40: { title: 'Virtual Yard Queue', widgets: ['Current Queue: 42 Trucks', 'Your Position: #8', 'Estimated Wait: 48 minutes', 'Live GPS Tracking Active'] },
        41: { title: 'Queue Waiting Status', widgets: ['Status: Waiting (#8)', 'Entry at: 10:00 AM', 'Weighbridge Ready: ~10:48 AM', 'SMS Alert: Enabled'] },
        42: { title: 'AI Quality Check Results', widgets: ['Moisture: 10.8% (Pass)', 'Protein: 11.2% (Pass)', 'Grade: A - FAQ Quality', 'Scanning Time: 45 sec'] },
        43: { title: 'Quality Lab Reports', widgets: ['Report ID: QR-KRN-4829', 'Graded: Grade A FAQ', 'Issued By: Inspector Raj Kumar', 'Valid: 30 days'] },
        44: { title: 'Weighment / Tola Parchi', widgets: ['Gross Weight: 12,600 kg', 'Tare Weight: 6,800 kg', 'Net Weight: 5,800 kg (58 Qtl)', 'Tola Parchi: TP-KRN-4829'] },
        45: { title: 'Acceptance Certificates', widgets: ['Cert: AC-KRN-4829', 'Accepted By: Officer Sharma', 'Total: 180 Qtl Wheat', 'Escrow: LOCKED ₹4,36,500'] },
        46: { title: 'Transport Booking', widgets: ['Vehicle: HR-10-AB-1234', 'Driver: Amarjit Singh', 'Route: Farm → Karnal Yard', 'Pickup: 08-Sep 08:30 AM'] },
        47: { title: 'Transport Tracking', widgets: ['GPS: Live Location Active', 'ETA: 08-Sep 10:05 AM', 'Distance: 14 km remaining', 'Speed: 42 km/h'] },
        48: { title: 'My Payments & DBT', widgets: ['Total Earned: ₹4,36,500', 'DBT Status: CREDITED', 'UTR: SBIN0048299104', 'Credit Date: 10-Sep-2025'] },
        49: { title: 'Payment Details & UTR', widgets: ['UTR: SBIN0048299104', 'Amount: ₹4,36,500', 'Bank: SBI XXXX4892', 'PFMS ID: PFMS-2025-48291'] },
        50: { title: 'Crop Traceability Journey', widgets: ['Farm: Karnal, HR', 'Mandi: Karnal Central Yard', 'Buyer: Punjab Agri Corp', 'End-Use: FCI Buffer Stock'] },
        51: { title: 'Notifications Center', widgets: ['SMS: Slot confirmed (3 min ago)', 'Email: DBT credited (2h ago)', 'WhatsApp: Arrive by 10 AM', 'App Alert: Grade A Passed'] }
      };

      const spec = farmerSpecific[id] || { title: p.titleEn, widgets: ['Module Active', 'Data Loading', 'Synced', 'Verified'] };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {spec.widgets.map((w, i) => (
              <div key={i} className="bg-[#f0f4ea] border border-[#71873f] p-3 rounded-xl font-mono text-xs">
                <div className="text-[#637554] text-[9px] uppercase font-bold">Field {i + 1}</div>
                <div className="font-bold text-[#243118] mt-0.5">{w}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
            <div className="font-extrabold text-[#243118] border-b pb-2 mb-2 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#71873f]" />
              <span>{spec.title}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#637554]">
              <div className="p-2 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                <div className="font-bold text-[#243118]">Farmer ID</div>
                <div>PB-FARM-99482</div>
              </div>
              <div className="p-2 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                <div className="font-bold text-[#243118]">Status</div>
                <div className="text-emerald-700 font-bold">ACTIVE & VERIFIED</div>
              </div>
              <div className="p-2 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                <div className="font-bold text-[#243118]">Crop / Lot</div>
                <div>Wheat 180 Qtl (Sharbati)</div>
              </div>
              <div className="p-2 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                <div className="font-bold text-[#243118]">DBT Payment</div>
                <div className="text-[#a36627] font-bold">₹4,36,500 Credited</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PAGES 52-65: Buyer Pages
    if (id >= 52 && id <= 65) {
      const buyerSpecific = {
        52: ['Escrow Balance: ₹28.5L', 'Active Bids: 3 Lots', 'Won Auctions: 8 Today', 'Settlement: ₹2.14 Cr'],
        53: ['License: eNAM-TRD-PB-88219', 'Entity: Punjab Agri Corp', 'KYC Status: VERIFIED', 'Credit Limit: ₹50 Lakh'],
        54: ['Listed Crops: 4,820 Lots', 'Grade A Only: 2,140 Lots', 'Wheat FAQ: 820 Lots', 'Price Range: ₹2,500–₹2,650'],
        55: ['NIR: 10.8% Moisture', 'Grade: A FAQ', 'Protein: 11.2%', 'Lot: 500 Qtl Wheat HD-3086'],
        56: ['Offer #OF-48291: ₹2,630', 'Status: Counter-Offered', 'Offer #OF-48288: ₹5,890', 'Status: Accepted'],
        57: ['Offer: ₹2,630/Qtl for 500 Qtl', 'Seller: Sukhwinder Singh', 'Escrow: Auto-lock on accept', 'Total: ₹13,15,000'],
        58: ['Active Auctions: 12 Rooms', 'Total Lots: 48', 'Your Bids: 3 Active', 'Best Rank: #1 (2 lots)'],
        59: ['Lot #PB-KNH-2241 — Basmati', '420 Qtl — Reserve: ₹3,800', 'Current: ₹4,220 (You)', 'Time Left: 2h 45m'],
        60: ['Bid #1: ₹4,220 (Winning)', 'Bid #2: ₹5,890 (Winning)', 'Bid #3: ₹2,620 (Outbid)', 'Total Staked: ₹62.4 Lakh'],
        61: ['Won: 8 Lots Today', 'Total: 1,840 Qtl', 'Value: ₹2.14 Crore', 'Delivery: 3 Pending'],
        62: ['Wheat: 1,000 Qtl (Karnal)', 'Paddy: 420 Qtl (Khanna)', 'Chana: 160 Qtl (Latur)', 'In Transit: 580 Qtl'],
        63: ['Order #ORD-KRN-4829: Confirmed', 'Escrow Released: ₹4,36,500', 'Order #ORD-KNH-2241: Pending', 'Delivery ETA: 2 days'],
        64: ['Paid Today: ₹2.14 Cr', 'PFMS UTR: 8 Cleared', 'Avg Settlement: 6.2 hours', 'Method: NPCI RTGS'],
        65: ['Trucks: 12 In-Transit', 'Route: Karnal → Delhi', 'ETA: Today 6 PM', 'GPS: Live Tracking On']
      };

      const widgets = buyerSpecific[id] || ['Module Active', 'Synchronized', 'Verified', 'Ready'];
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {widgets.map((w, i) => (
              <div key={i} className="bg-amber-50 border border-amber-300 p-3 rounded-xl font-mono text-xs">
                <div className="text-amber-700 text-[9px] uppercase font-bold">Info {i + 1}</div>
                <div className="font-bold text-amber-900 mt-0.5">{w}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono space-y-2">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-700" />
              <span>Buyer Operations: {p.titleEn}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#637554]">
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-900">Trading License</div>
                <div>eNAM-TRD-PB-88219</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-900">Escrow Balance</div>
                <div>₹28,50,000 PFMS Linked</div>
              </div>
            </div>
            <button onClick={() => setCurrentView('eauction')} className="w-full bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5">
              <Gavel className="w-4 h-4" />
              <span>Enter Live Bidding Room →</span>
            </button>
          </div>
        </div>
      );
    }

    // PAGES 66-80: Procurement Officer Pages
    if (id >= 66 && id <= 80) {
      const officerSpecific = {
        66: ['Procurement: 82.4% of Target', 'Active Centers: 248 Today', 'Pending KYC: 0', 'Disbursed Today: ₹4.82 Cr'],
        67: ['Pending Reviews: 12 Farmers', 'Avg Review Time: 4.2 min', 'Approvals Today: 284', 'Rejections: 3 (docs missing)'],
        68: ['Bhulekh Records Verified: 1,840', 'Pending: 12', 'Auto-Verified: 1,823 (Bhulekh API)', 'Manual: 17'],
        69: ['Declarations Today: 2,480', 'Crop Diversity: 18 Varieties', 'Grade A: 94.2%', 'Rejected (Moisture): 5.8%'],
        70: ['Centers Managed: 248', 'Capacity Alerts: 2', 'Full Centers: Khanna (94%)', 'Needs Redirect: Ludhiana'],
        71: ['Total Capacity: 18,000 MT', 'Utilized: 14,800 MT (82%)', 'Available: 3,200 MT', 'Alert: Khanna Yard 94%'],
        72: ['Arrivals Today: 14,800 MT', 'Wheat: 8,200 MT', 'Paddy: 4,200 MT', 'Other: 2,400 MT'],
        73: ['Rescheduled Today: 48 Slots', 'Auto-Trigger: Rain Forecast', 'Notified via SMS: 48 Farmers', 'New Slots: Next Day 7 AM'],
        74: ['Delays Today: 12 Cases', 'Avg Delay: 28 min', 'Cause: Traffic on NH-44', 'Resolved: 9 | Pending: 3'],
        75: ['Live Queue: 284 Trucks', 'Avg Wait: 42 min', 'Longest Wait: 1h 12m (Khanna)', 'Fastest Lane: Karnal Lane 6'],
        76: ['Gate Entries Today: 1,284', 'QR Scanned: 1,276 (99.4%)', 'Manual Entry: 8', 'Denied (Invalid Token): 2'],
        77: ['Weighments Done: 1,280', 'Avg Weight: 58 Qtl/Truck', 'Max: 120 Qtl | Min: 12 Qtl', 'Tola Parchis Issued: 1,280'],
        78: ['Grade A: 1,204 Lots (94.1%)', 'Grade B: 68 Lots (5.3%)', 'Rejected: 8 Lots (0.6%)', 'NIR Avg Moisture: 10.4%'],
        79: ['Accepted Lots: 1,272', 'Acceptance Rate: 99.4%', 'Escrow Locked: ₹42.8 Cr', 'Pending Release: ₹8.2 Cr'],
        80: ['Escrow Held: ₹42.8 Cr', 'Released Today: ₹28.4 Cr', 'DBT Processing: 284 Cases', 'SLA Breach: 0 Today']
      };
      const widgets = officerSpecific[id] || ['Module Active', 'Synchronized', 'Verified', 'Ready'];
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {widgets.map((w, i) => (
              <div key={i} className="bg-sky-50 border border-sky-300 p-3 rounded-xl font-mono text-xs">
                <div className="text-sky-700 text-[9px] uppercase font-bold">Status {i + 1}</div>
                <div className="font-bold text-sky-900 mt-0.5">{w}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-700" />
              <span>Officer Module: {p.titleEn}</span>
            </div>
            <div className="mt-2 text-[#637554]">
              Procurement officer supervisory view. All 14 weighbridge lanes operating within nominal capacity. Zero SLA breach detected for current session.
            </div>
          </div>
        </div>
      );
    }

    // PAGES 81-90: Mandi Operator Pages
    if (id >= 81 && id <= 90) {
      const opSpecific = {
        81: ['Trucks In Yard: 42', 'Weighments Done: 1,280', 'QR Scans: 1,276 OK', 'NIR Tests: 1,240 (98.1% Grade A)'],
        82: ['Scans Today: 1,276', 'Avg Scan Time: 1.2 sec', 'Pass Rate: 99.4%', 'Failed: 2 (Invalid / Expired)'],
        83: ['Manual Entries: 8 Today', 'Reason: QR Damaged (5)', 'Reason: Network Down (3)', 'Manual Log: All Verified'],
        84: ['Today Entries: 1,284 Vehicles', 'Peak Hour: 8–10 AM (420 vehicles)', 'Vehicle Types: Trucks 94%, Mini 6%', 'Denied: 2 (Token Mismatch)'],
        85: ['Registered: 320 Vehicles', 'Active Today: 284', 'Flagged: 1 (Overloaded)', 'Serviced: 283 OK'],
        86: ['Priority Queue Active', 'Senior Citizen Farmers: +2 Priority', 'Remote District Trucks: +1', 'Emergency Slots: 4 Reserved'],
        87: ['Live Queue: 42 Trucks', 'Avg Wait: 42 minutes', 'Lane Status: All 14 Active', 'Bottleneck: Lane 8 (Sensor Check)'],
        88: ['Weighments Done: 1,280', 'Avg Net Weight: 58 Qtl', 'Highest: 120 Qtl (Truck HR-10-ZA)', 'Sensor Calibrated: 2h ago'],
        89: ['Parchis Issued: 1,280', 'Avg Issue Time: 28 sec', 'Digital Parchis: 1,280 (100%)', 'Blockchain Hashed: All'],
        90: ['Total Arrivals: 14,800 MT', 'Wheat: 8,200 MT (55.4%)', 'Paddy: 4,200 MT (28.4%)', 'Revenue Booked: ₹42.8 Cr']
      };
      const widgets = opSpecific[id] || ['Yard Active', 'Synchronized', 'Running', 'OK'];
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {widgets.map((w, i) => (
              <div key={i} className="bg-[#f0f4ea] border border-[#71873f] p-3 rounded-xl font-mono text-xs">
                <div className="text-[#637554] text-[9px] uppercase font-bold">Live {i + 1}</div>
                <div className="font-bold text-[#243118] mt-0.5">{w}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono space-y-1.5">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#71873f]" />
              <span>Mandi Operator: {p.titleEn}</span>
            </div>
            <div className="flex justify-between"><span className="text-[#637554]">NIR Sensor Bandwidth:</span><span className="font-bold text-emerald-700">950nm–1650nm (Calibrated)</span></div>
            <div className="flex justify-between"><span className="text-[#637554]">Weighbridge Lanes:</span><span className="font-bold text-[#243118]">14 Active / 14 Total</span></div>
            <div className="flex justify-between"><span className="text-[#637554]">RFID Gate Status:</span><span className="font-bold text-[#71873f]">Automated — Active</span></div>
          </div>
        </div>
      );
    }

    // PAGES 91-97: Quality Inspector
    if (id >= 91 && id <= 97) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl">
              <div className="text-[10px] text-emerald-800 uppercase font-bold">NIR Moisture Average</div>
              <div className="text-2xl font-extrabold text-emerald-900">10.4%</div>
              <div className="text-[10px] text-emerald-700">Grade A FAQ Passed (99.2%)</div>
            </div>
            <div className="bg-[#f0f4ea] border border-[#71873f] p-4 rounded-2xl">
              <div className="text-[10px] text-[#637554] uppercase font-bold">AI vs Manual Match</div>
              <div className="text-2xl font-extrabold text-[#243118]">98.7%</div>
              <div className="text-[10px] text-[#71873f]">Deviation: &lt;0.3% Moisture Delta</div>
            </div>
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl">
              <div className="text-[10px] text-amber-800 uppercase font-bold">Tola Parchi Issued</div>
              <div className="text-2xl font-extrabold text-amber-900">1,280</div>
              <div className="text-[10px] text-amber-700">Cryptographic Blockchain Hash</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-emerald-700" />
              <span>Quality Inspector Module: {p.titleEn}</span>
            </div>
            <div className="mt-2 space-y-1.5 text-[#637554]">
              {id === 94 && <>
                <div className="flex justify-between"><span>NIR Wavelength:</span><span className="font-bold text-[#243118]">950nm–1650nm</span></div>
                <div className="flex justify-between"><span>Calibration Status:</span><span className="font-bold text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 45 minutes ago</span></div>
                <div className="flex justify-between"><span>Last Sample:</span><span className="font-bold flex items-center gap-1"><span>Wheat HD-3086 — 10.2%</span> <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /></span></div>
              </>}
              {id === 97 && <>
                <div className="flex justify-between"><span>AI Model:</span><span className="font-bold text-[#243118]">AgriVision v3.1 (ICAR)</span></div>
                <div className="flex justify-between"><span>Agreement Rate:</span><span className="font-bold text-emerald-700">98.7% (1,247/1,263)</span></div>
                <div className="flex justify-between"><span>Deviations Flagged:</span><span className="font-bold text-amber-700">16 lots (Manual Override)</span></div>
              </>}
              {(id !== 94 && id !== 97) && <div>Quality inspection module for {p.titleEn}. All spectroscopy sensors active and calibrated. Grade A threshold: ≤12% moisture, ≤2% foreign matter.</div>}
            </div>
          </div>
        </div>
      );
    }

    // PAGES 98-107: Logistics
    if (id >= 98 && id <= 107) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="bg-sky-50 border border-sky-300 p-4 rounded-2xl">
              <div className="text-[10px] text-sky-800 uppercase font-bold">GPS Fleets Active</div>
              <div className="text-2xl font-extrabold text-sky-900">420 In-Transit</div>
              <div className="text-[10px] text-sky-700">Live Geo-Fence Protected</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl">
              <div className="text-[10px] text-emerald-800 uppercase font-bold">Deliveries Today</div>
              <div className="text-2xl font-extrabold text-emerald-900">248 Completed</div>
              <div className="text-[10px] text-emerald-700">Avg ETA Accuracy: 96.2%</div>
            </div>
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl">
              <div className="text-[10px] text-amber-800 uppercase font-bold">Drivers Active</div>
              <div className="text-2xl font-extrabold text-amber-900">420 On Route</div>
              <div className="text-[10px] text-amber-700">VAHAN Verified</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-sky-700" />
              <span>Logistics Module: {p.titleEn}</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { route: 'Karnal Yard → FCI Depot Delhi', truck: 'HR-10-ZA-1234', status: 'In Transit (14 km left)', eta: '4:45 PM' },
                { route: 'Khanna APMC → Punjab State Store', truck: 'PB-10-AB-9921', status: 'Delivered (Verified)', eta: 'Done' },
                { route: 'Bharatpur → Rajasthan Buffer', truck: 'RJ-14-BB-4821', status: 'Loading at Origin', eta: 'ETA 7 PM' }
              ].map(t => (
                <div key={t.truck} className="flex justify-between p-2 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div><div className="font-bold text-[#243118]">{t.truck}</div><div className="text-[#637554]">{t.route}</div></div>
                  <div className="text-right"><div className={`font-bold ${t.status.includes('Delivered') ? 'text-emerald-700' : 'text-sky-700'}`}>{t.status}</div><div className="text-[#637554]">{t.eta}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // PAGES 108-118: Warehouse
    if (id >= 108 && id <= 118) {
      const warehouseWidgets = {
        108: ['Total Capacity: 48,000 MT', 'Current Stock: 32,640 MT (68%)', 'e-NWR Receipts: 840 Active', 'FCI Grade: WDRA Certified'],
        109: ['Block A: 8,200 MT / 12,000 MT', 'Block B: 11,200 MT / 14,000 MT', 'Block C: 13,240 MT / 22,000 MT', 'Alert: Block C at 60%'],
        110: ['Wheat: 18,400 MT', 'Paddy: 9,200 MT', 'Chana: 3,200 MT', 'Others: 1,840 MT'],
        111: ['Wheat Ledger: 18,400 MT Active', 'Lot IDs: WH-WHT-001 to 892', 'Oldest Lot: 15-Aug-2025', 'FIFO Method: Enabled'],
        112: ['Inward Today: 2,400 MT', 'From: Karnal Yard (1,200 MT)', 'From: Khanna APMC (1,200 MT)', 'Gate Entries: 42 Trucks'],
        113: ['Released Today: 1,200 MT', 'Buyer: FCI Delhi Buffer', 'UTR: FCI-2025-48291', 'Mode: RTGS Cleared'],
        114: ['Movements Today: 4 Lots', 'Block A→B: 800 MT (Rotation)', 'B→Dispatch: 400 MT', 'All Logged on Blockchain'],
        115: ['Transfers: 2 Today', 'Karnal→Rohtak: 500 MT', 'Reason: Capacity Balancing', 'Approval: DM Authorized'],
        116: ['Block B Alert: 80% (Warn)', 'Block A Alert: 68% (OK)', 'Block C Alert: 60% (OK)', 'SMS Alerts Sent: 3'],
        117: ['Truck Requests: 8 Pending', 'Priority: Wheat Lot #WH-892', 'Vehicle Assigned: HR-10-ZA', 'ETA Arrival: 6:30 PM'],
        118: ['e-NWR Active: 840', 'WDRA Registry: All Linked', 'Last e-NWR: WH-NWR-48291', 'Pledge Value: ₹14.2 Cr']
      };
      const widgets = warehouseWidgets[id] || ['Stock Active', '68% Capacity', 'WDRA Certified', 'e-NWR Linked'];
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {widgets.map((w, i) => (
              <div key={i} className="bg-indigo-50 border border-indigo-300 p-3 rounded-xl font-mono text-xs">
                <div className="text-indigo-700 text-[9px] uppercase font-bold">Store {i + 1}</div>
                <div className="font-bold text-indigo-900 mt-0.5">{w}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
              <Warehouse className="w-4 h-4 text-indigo-700" />
              <span>Warehouse Module: {p.titleEn}</span>
            </div>
            <div className="mt-2 space-y-1 text-[#637554]">
              <div className="flex justify-between"><span>Total Capacity:</span><span className="font-bold text-[#243118]">48,000 MT</span></div>
              <div className="flex justify-between"><span>Current Stock:</span><span className="font-bold text-[#a36627]">32,640 MT (68%)</span></div>
              <div className="w-full bg-[#e0e8d6] rounded-full h-2 mt-1">
                <div className="h-2 rounded-full bg-[#71873f]" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PAGES 119-127: Payment Pages
    if (id >= 119 && id <= 127) {
      const paymentData = [
        { farmer: 'Sukhwinder Singh', crop: 'Wheat 180 Qtl', amt: '₹4,36,500', utr: 'SBIN0048291', status: 'CREDITED', date: '10-Sep-25' },
        { farmer: 'Ramesh Yadav', crop: 'Mustard 80 Qtl', amt: '₹5,07,200', utr: 'HDFC0048292', status: 'PROCESSING', date: '10-Sep-25' },
        { farmer: 'Vijay Patil', crop: 'Chana 60 Qtl', amt: '₹3,49,200', utr: 'PNB00048293', status: 'PENDING', date: '10-Sep-25' },
        { farmer: 'Amarjit Singh', crop: 'Paddy 240 Qtl', amt: '₹5,52,000', utr: 'SBIN0048294', status: 'CREDITED', date: '09-Sep-25' }
      ];
      const paymentWidgets = {
        119: ['Disbursed Today: ₹42.8 Cr', 'Pending: ₹8.2 Cr', 'NPCI Success Rate: 99.97%', 'SLA Breach Today: 0'],
        120: ['Pending Queue: 284 Farmers', 'Total: ₹8.2 Crore', 'Oldest Case: 18 hours', 'Auto-Process: 6 AM'],
        121: ['Processing: 48 Transactions', 'NPCI Gateway: Active', 'Avg Time: 2.1 min/txn', 'Bank: SBI / HDFC / PNB'],
        122: ['Completed Today: 1,280', 'Total Value: ₹42.8 Cr', 'UTRs Generated: 1,280', 'Failure: 0'],
        123: ['UTR: SBIN0048291', 'Amount: ₹4,36,500', 'Bank: SBI Branch Karnal', 'PFMS ID: PFMS-2025-48291'],
        124: ['Transactions Today: 1,280', 'Total: ₹42.8 Cr', 'Avg: ₹3,34,375/Farmer', 'Mode: NPCI RTGS / IMPS'],
        125: ['NPCI Gateway: Active', 'Batch Rate: 240 txn/min', 'Success: 99.97%', 'Aadhaar DBT Link: Verified'],
        126: ['UTR Search Active', 'UTR: SBIN0048291 → ₹4,36,500', 'UTR: HDFC0048292 → ₹5,07,200', 'Avg RTGS: 2.1 minutes'],
        127: ['PFMS Reports: 1,280 Files', 'Ministry Download: Ready', 'Audit Trail: Blockchain Signed', 'Export: CSV / PDF / JSON']
      };
      const widgets = paymentWidgets[id] || ['Payment Active', 'Synchronized', 'NPCI Online', 'SLA Met'];
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {widgets.map((w, i) => (
              <div key={i} className="bg-green-50 border border-green-300 p-3 rounded-xl font-mono text-xs">
                <div className="text-green-700 text-[9px] uppercase font-bold">DBT Field {i + 1}</div>
                <div className="font-bold text-green-900 mt-0.5">{w}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Live DBT Payment Feed — {p.titleEn}</span>
              </span>
              <div className="flex gap-1">
                {['All', 'CREDITED', 'PROCESSING', 'PENDING'].map(f => (
                  <button key={f} onClick={() => setPaymentFilter(f)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${paymentFilter === f ? 'bg-[#71873f] text-white' : 'bg-[#f0f4ea] text-[#637554]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              {paymentData.filter(r => paymentFilter === 'All' || r.status === paymentFilter).map(r => (
                <div key={r.utr} className="flex justify-between p-2.5 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div>
                    <div className="font-bold text-[#243118]">{r.farmer} — {r.crop}</div>
                    <div className="text-[10px] text-[#637554]">UTR: {r.utr} • {r.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[#a36627]">{r.amt}</div>
                    <div className={`text-[10px] font-bold ${r.status === 'CREDITED' ? 'text-emerald-700' : r.status === 'PROCESSING' ? 'text-amber-600' : 'text-red-600'}`}>{r.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // PAGES 128-136: AI Analytics
    if (id >= 128 && id <= 136) return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-sm text-[#243118] mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-700" />
            <span>AI Analytics Module: {p.titleEn}</span>
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(CROP_PRICE_DATA).slice(0, 5).map(c => (
              <button key={c} onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${selectedCrop === c ? 'text-white shadow-md' : 'bg-white text-[#637554] border-[#abbe99]'}`}
                style={selectedCrop === c ? { background: CROP_PRICE_DATA[c].color, borderColor: CROP_PRICE_DATA[c].color } : {}}>
                {c}
              </button>
            ))}
          </div>
          <CropPriceChart cropName={selectedCrop} data={CROP_PRICE_DATA[selectedCrop]} msp={CROP_PRICE_DATA[selectedCrop].msp} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          {[
            { label: 'Forecast Accuracy', val: '94.2%', color: 'emerald' },
            { label: 'Model: ICAR AgriVision', val: 'v3.1 Active', color: 'sky' },
            { label: 'Training Data', val: '15 Years MSP', color: 'amber' },
            { label: 'Next Update', val: '6 AM Daily', color: 'purple' }
          ].map(c => (
            <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-300 p-3 rounded-xl text-center`}>
              <div className={`font-extrabold text-${c.color}-900`}>{c.val}</div>
              <div className={`text-[10px] text-${c.color}-700 font-bold uppercase`}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    );

    // PAGES 137-142: Traceability
    if (id >= 137 && id <= 142) return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99]">
          <h4 className="font-extrabold text-sm text-[#243118] mb-3 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-emerald-700" />
            <span>Crop Traceability Chain: {p.titleEn}</span>
          </h4>
          <div className="space-y-2">
            {[
              { step: 'Farm Origin', detail: 'Khasra 48/2, Karnal, HR — Sukhwinder Singh', hash: '0x4f82...1a2b', ts: '01-Sep-2025 06:00 AM' },
              { step: 'Mandi Arrival', detail: 'Karnal Central Yard, Lane 4 — QR Token #HR-KRN-4829', hash: '0x8c14...9d3e', ts: '08-Sep-2025 10:12 AM' },
              { step: 'Quality Assay', detail: 'NIR: 10.8% Moisture — Grade A FAQ — Inspector Raj Kumar', hash: '0xe7a2...4f1c', ts: '08-Sep-2025 11:02 AM' },
              { step: 'Weighment', detail: 'Net: 5,800 kg (58 Qtl) — Tola Parchi TP-KRN-4829', hash: '0x2b91...8e4d', ts: '08-Sep-2025 11:45 AM' },
              { step: 'Buyer Transfer', detail: 'Punjab Agri Corp — eNAM Contract #NC-4829', hash: '0x1d4f...3c8a', ts: '08-Sep-2025 01:20 PM' },
              { step: 'DBT Credit', detail: 'SBI A/C XXXX4892 — ₹4,36,500 — UTR SBIN0048291', hash: '0x9e3c...7b2f', ts: '10-Sep-2025 09:30 AM' }
            ].map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#71873f] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">{i + 1}</div>
                  {i < 5 && <div className="w-0.5 h-8 bg-[#abbe99]"></div>}
                </div>
                <div className="pb-3 text-xs font-mono">
                  <div className="font-extrabold text-[#243118]">{s.step}</div>
                  <div className="text-[#637554]">{s.detail}</div>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-emerald-700 font-bold">{s.hash}</span>
                    <span className="text-[#637554] text-[10px]">{s.ts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // PAGES 143-162: Admin Pages
    if (id >= 143 && id <= 162) {
      const adminWidgets = {
        143: ['Total Users: 4.2 Cr Farmers', 'Active Today: 1.28 Lakh', 'Buyers Registered: 48,200', 'Officers: 12,400 Active'],
        144: ['New Registrations: 2,840 Today', 'KYC Pending: 420', 'Deactivated: 8 (Fraud)', 'Role Changes: 12'],
        145: ['Total Farmers: 4.2 Crore', 'PM-KISAN Linked: 3.8 Cr', 'Aadhaar Verified: 100%', 'Bank Linked: 98.4%'],
        146: ['Buyers Registered: 48,200', 'eNAM Licensed: 42,400', 'Pending License: 1,240', 'Suspended: 24'],
        147: ['Active Centers: 2,840', 'States: 36 Covered', 'New Centers Added: 8', 'Deactivated: 2'],
        148: ['Warehouses: 1,480', 'Capacity: 48,000 MT each', 'WDRA Certified: All', 'e-NWR Active: 8,400'],
        149: ['Crops in Master: 240+', 'MSP Crops: 23 (2025-26)', 'Kharif: 14 | Rabi: 9', 'Commercial: 1'],
        150: ['Wheat MSP: ₹2,425', 'Mustard MSP: ₹5,950', 'Chana MSP: ₹5,650', 'Effective: Kharif 2025'],
        151: ['Roles: 8 Types', 'Permissions: 140 Modules', 'Audit Trail: All Actions', 'Session Timeout: 30 min'],
        152: ['Security Events: 0 Breach', 'Login Attempts: 4,820', 'Failed Attempts: 42 (Blocked)', 'MFA Enforced: 100%'],
        153: ['API Rate Limit: 1,000 req/sec', 'DB: PostgreSQL Cluster', 'Cache: Redis 99.9% Hit', 'CDN: Akamai Active'],
        154: ['APIs Active: 48', 'Webhooks Subscribed: 8', 'Avg Latency: 82 ms', 'SLA: 99.99% Uptime'],
        155: ['SMS Gateway: RouteMobile', 'WhatsApp: Meta API', 'Messages Today: 2.48 Lakh', 'Delivery Rate: 99.4%'],
        156: ['Email Provider: AWS SES', 'Sent Today: 48,200', 'Delivery Rate: 99.8%', 'Bounce Rate: 0.2%'],
        157: ['NPCI NACH: Active', 'RTGS/IMPS: Both Active', 'Batch: 240 txn/min', 'Success Rate: 99.97%'],
        158: ['Backup: Daily at 2 AM', 'DR Site: Pune NIC', 'RTO: 4 hours', 'Last Backup: Today 02:12 AM'],
        159: ['Services: 48 Microservices', 'Healthy: 48/48 (100%)', 'Last Incident: 0 today', 'Alerts: 0 Critical'],
        160: ['Servers: 240 Nodes', 'CPU Avg: 34%', 'RAM Avg: 48%', 'Storage: 68% used'],
        161: ['Reports Generated: 12', 'Export: PDF/Excel/JSON', 'State-wise Reports: 36', 'Ministry Dashboard: Synced'],
        162: ['CSV Export: 4 Datasets', 'JSON API: Live', 'Excel: 14 Reports', 'Last Export: 30 mins ago']
      };
      const widgets = adminWidgets[id] || ['Admin Active', 'Synchronized', 'NIC Secured', 'MeitY Certified'];
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {widgets.map((w, i) => (
              <div key={i} className="bg-purple-50 border border-purple-300 p-3 rounded-xl font-mono text-xs">
                <div className="text-purple-700 text-[9px] uppercase font-bold">Admin {i + 1}</div>
                <div className="font-bold text-purple-900 mt-0.5">{w}</div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
            <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-indigo-700" />
              <span>Admin Control Panel: {p.titleEn}</span>
            </div>
            <div className="mt-2 text-[#637554]">Administrative master control and configuration interface. All actions are logged to the NIC blockchain audit trail with admin ID and timestamp.</div>
          </div>
        </div>
      );
    }

    // PAGES 163-171: Common / Settings
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          {[
            { label: 'Module', val: p.section + ' System', color: 'slate' },
            { label: 'Page ID', val: `AAGAM-PG-${p.id}`, color: 'slate' },
            { label: 'Uptime', val: '99.99%', color: 'emerald' },
            { label: 'Security', val: 'NIC Level 3', color: 'sky' }
          ].map(c => (
            <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-300 p-3 rounded-xl text-center`}>
              <div className={`font-extrabold text-${c.color}-900`}>{c.val}</div>
              <div className={`text-[10px] text-${c.color}-700 font-bold uppercase`}>{c.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] text-xs font-mono">
          <div className="font-extrabold text-[#243118] border-b pb-2 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-slate-700" />
            <span>{p.titleEn}</span>
          </div>
          {id === 163 && <div className="mt-2 text-[#637554]">Update your display name, profile photo, designation, and preferred language. Changes sync across all AAGAM modules.</div>}
          {id === 164 && <div className="mt-2 text-[#637554]">Manage account email, linked mobile number, bank account details, and Aadhaar seeding status.</div>}
          {id === 165 && <div className="mt-2 text-[#637554]">Change password, manage active sessions, enable/disable 2FA, and view login history.</div>}
          {id === 166 && <div className="mt-2 text-[#637554]">Switch between English, हिंदी, ਪੰਜਾਬੀ, मराठी, ગુજરાતી, and 18 other official Indian languages.</div>}
          {id === 167 && <div className="mt-2 text-[#637554]">Access guided help articles, video tutorials, and raise a ticket to the Helpdesk team at aagam.help.gov@gmail.com.</div>}
          {id === 168 && <div className="mt-2 text-[#637554]">Report a bug or system error. Your ticket is auto-tagged by category and dispatched to aagam.help.gov@gmail.com via Formspree.</div>}
          {id === 169 && <div className="mt-2 text-[#637554]">Page not found. This route does not exist or has been moved. Return to Home or search for the correct page.</div>}
          {id === 170 && <div className="mt-2 text-[#637554]">You do not have permission to access this page. Contact your district procurement officer for role elevation.</div>}
          {id === 171 && <div className="mt-2 text-[#637554]">An unexpected server error occurred. Our NIC cloud team has been auto-notified. Please retry in 2 minutes.</div>}
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 bg-[#fcfaf7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#abbe99]/60 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] font-bold px-3.5 py-2 rounded-xl border border-[#71873f]/40 text-xs transition-colors shadow-sm">
              <ChevronLeft className="w-4 h-4" />
              <span>{t('Back to Home', 'मुख्य पृष्ठ पर लौटें')}</span>
            </button>
            <span className="text-xs font-mono text-[#637554]">/</span>
            <span className="text-xs font-mono font-bold text-[#243118]">AAGAM 171 Pages Live Explorer</span>
          </div>
          <span className="bg-[#a36627] text-white font-bold font-mono px-3 py-1 rounded-full shadow text-xs">
            PAGE #{activePageObj.id} OF 171
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#abbe99] p-5 shadow-xl space-y-4 max-h-[820px] flex flex-col">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-[#243118]">171 Workflow Pages Navigator</h3>
                <span className="text-[10px] font-mono font-bold bg-[#f0f4ea] text-[#688557] px-2 py-0.5 rounded border border-[#abbe99]">
                  {filteredPages.length} Active
                </span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#71873f] absolute left-3 top-2.5" />
                <input type="text" placeholder="Search page # or title..."
                  value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-[#243118] focus:outline-none focus:border-[#71873f]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 font-mono text-xs">
              {filteredPages.map((p) => {
                const isSelected = activePageNum === p.id;
                return (
                  <button key={p.id} onClick={() => setActivePageNum(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                      isSelected ? 'bg-[#71873f] text-white font-extrabold shadow scale-[1.01]'
                        : 'bg-[#fcfaf7] hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99]/40'
                    }`}>
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-[#abbe99]/40 text-[#243118]'}`}>
                        #{p.id < 10 ? `0${p.id}` : p.id}
                      </span>
                      <span className="truncate font-sans font-semibold">{t(p.titleEn, p.titleHi)}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">

            {/* Page banner */}
            <div className="bg-gradient-to-r from-[#243118] via-[#334423] to-[#243118] rounded-3xl p-6 text-white shadow-xl border border-[#e0b87e]/40">
              <div className="flex justify-between items-start">
                <span className="bg-[#e0b87e] text-[#243118] font-mono text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  SECTION: {activePageObj.section.toUpperCase()}
                </span>
                <span className="font-mono text-xs text-[#e0b87e] font-bold">PAGE #{activePageObj.id} / 171</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mt-3">{t(activePageObj.titleEn, activePageObj.titleHi)}</h2>
              <p className="text-xs text-slate-200 leading-relaxed mt-1">
                {t(`Official Government of India portal workflow interface for ${activePageObj.titleEn}.`, `भारत सरकार का आधिकारिक डिजिटल कार्यप्रवाह इंटरफ़ेस — ${activePageObj.titleHi}।`)}
              </p>
            </div>

            {/* Dynamic workspace */}
            <div className="bg-white rounded-3xl border border-[#abbe99] p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-extrabold text-sm text-[#243118]">Live Workflow Terminal</h3>
                </div>
                <span className="text-xs font-mono text-[#688557] font-bold">
                  PAGE #{activePageObj.id}: {activePageObj.section.toUpperCase()} MODE
                </span>
              </div>

              {actionSuccessMsg && (
                <div className="bg-emerald-100 text-emerald-800 p-3 rounded-xl border border-emerald-300 font-mono text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* Unique page content */}
              {renderDynamicPageContent()}

              {/* Audit trail */}
              <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/60">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs mb-3">
                  <div className="bg-white p-3 rounded-xl border border-[#abbe99]">
                    <div className="text-[10px] text-[#637554]">Page Identifier:</div>
                    <div className="font-extrabold text-[#71873f]">AAGAM-PG-{activePageObj.id}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#abbe99]">
                    <div className="text-[10px] text-[#637554]">Access Category:</div>
                    <div className="font-extrabold text-[#a36627]">{activePageObj.category}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#abbe99]">
                    <div className="text-[10px] text-[#637554]">Security Clearance:</div>
                    <div className="font-extrabold text-emerald-700">NIC LEVEL 3</div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#abbe99] font-mono text-xs space-y-1.5">
                  <div className="font-extrabold text-[#243118] border-b pb-1.5 flex justify-between items-center">
                    <span>Audit Trail</span>
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SYNCHRONIZED</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[#637554]">
                    <span>Route:</span>
                    <span className="font-bold text-[#243118]">/aagam/v2/{activePageObj.section.toLowerCase()}/{activePageObj.id}</span>
                  </div>
                  <div className="flex justify-between text-[#637554]">
                    <span>Hash:</span>
                    <span className="font-bold text-[#243118]">
                      {simulationState[activePageObj.id]?.code || `0x${((activePageObj.id * 18491) % 999999).toString(16).padStart(6, '0')}...99a1`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#637554]">
                    <span>State:</span>
                    <span className="font-bold text-[#a36627]">
                      {simulationState[activePageObj.id]?.executed
                        ? `EXECUTED AT ${simulationState[activePageObj.id]?.time}`
                        : 'READY & VERIFIED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleExecuteAction}
                  className="w-full sm:w-1/2 bg-[#71873f] hover:bg-[#688557] active:bg-[#587247] text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow hover:shadow-md transition-all active:scale-95">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('Execute Page Action', 'पृष्ठ कार्रवाई निष्पादित करें')}</span>
                </button>
                <button
                  onClick={() => setActivePageNum(activePageNum < 171 ? activePageNum + 1 : 1)}
                  className="w-full sm:w-1/2 bg-[#a36627] hover:bg-[#804d19] active:bg-[#6b3e10] text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow hover:shadow-md transition-all active:scale-95">
                  <span>{t('Next Page (#', 'अगला पृष्ठ (#')}{activePageNum < 171 ? activePageNum + 1 : 1})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
