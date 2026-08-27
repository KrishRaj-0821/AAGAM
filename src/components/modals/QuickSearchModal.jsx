import React, { useState } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';

const all171PagesRegistry = [
  { id: 1, titleEn: 'Home / Landing Page', titleHi: 'मुख्य पृष्ठ' },
  { id: 2, titleEn: 'About AAGAM Portal', titleHi: 'आगामी के बारे में' },
  { id: 3, titleEn: 'How AAGAM Works', titleHi: 'आगामी कैसे काम करता है' },
  { id: 4, titleEn: 'Core Features & Architecture', titleHi: 'विशेषताएं एवं आर्किटेक्चर' },
  { id: 5, titleEn: 'Price Discovery Engine', titleHi: 'मूल्य खोज इंजन' },
  { id: 6, titleEn: 'Crop Marketplace Desk', titleHi: 'फसल बाजार' },
  { id: 7, titleEn: 'Live E-Auction Platform', titleHi: 'लाइव ई-नीलामी' },
  { id: 8, titleEn: 'Procurement Centers Locator', titleHi: 'खरीद केंद्र' },
  { id: 9, titleEn: 'AI Analytics & Forecasting', titleHi: 'विश्लेषण अवलोकन' },
  { id: 10, titleEn: 'Contact Us & Grievance', titleHi: 'संपर्क करें' },
  { id: 11, titleEn: 'FAQ & Helpdesk', titleHi: 'सामान्य प्रश्न' },
  { id: 12, titleEn: 'Terms & Conditions', titleHi: 'नियम और शर्तें' },
  { id: 13, titleEn: 'Privacy Policy', titleHi: 'गोपनीयता नीति' },
  { id: 14, titleEn: 'GOI SSO Login', titleHi: 'लॉगिन' },
  { id: 15, titleEn: 'Stakeholder Registration', titleHi: 'पंजीकरण' },
  { id: 16, titleEn: 'Role Selection', titleHi: 'भूमिका चयन' },
  { id: 17, titleEn: 'Mobile / OTP Verification', titleHi: 'ओटीपी सत्यापन' },
  { id: 18, titleEn: 'Forgot Password Recovery', titleHi: 'पासवर्ड भूल गए' },
  { id: 19, titleEn: 'Reset Password Portal', titleHi: 'पासवर्ड रीसेट' },
  { id: 20, titleEn: 'Farmer Dashboard', titleHi: 'किसान डैशबोर्ड' },
  { id: 21, titleEn: 'My Profile & Aadhaar e-KYC', titleHi: 'मेरी प्रोफ़ाइल' },
  { id: 22, titleEn: 'Land Records & Khasra', titleHi: 'भूमि रिकॉर्ड' },
  { id: 23, titleEn: 'Add Agricultural Land', titleHi: 'भूमि जोड़ें' },
  { id: 24, titleEn: 'Land Verification Status', titleHi: 'भूमि सत्यापन' },
  { id: 25, titleEn: 'My Registered Crops', titleHi: 'मेरी फसलें' },
  { id: 26, titleEn: 'Add New Crop Declaration', titleHi: 'नई फसल जोड़ें' },
  { id: 27, titleEn: 'Crop Details & Moisture', titleHi: 'फसल विवरण' },
  { id: 28, titleEn: 'Crop Offers', titleHi: 'फसल ऑफ़र' },
  { id: 29, titleEn: 'Price Comparison Tool', titleHi: 'मूल्य तुलना' },
  { id: 30, titleEn: 'Nearby Mandi Live Rates', titleHi: 'मंडी दरें' },
  { id: 31, titleEn: 'Private Buyer Offers', titleHi: 'खरीदार ऑफ़र' },
  { id: 32, titleEn: 'My Live Auctions', titleHi: 'मेरी नीलामी' },
  { id: 33, titleEn: 'Create Auction Lot', titleHi: 'नीलामी बनाएं' },
  { id: 34, titleEn: 'Auction Details', titleHi: 'नीलामी विवरण' },
  { id: 35, titleEn: 'Procurement Centers Directory', titleHi: 'खरीद केंद्र' },
  { id: 36, titleEn: 'Book Arrival Slot & Gate Pass', titleHi: 'स्लॉट बुक करें' },
  { id: 37, titleEn: 'My Booked Slots', titleHi: 'मेरे स्लॉट' },
  { id: 38, titleEn: 'My QR Tokens', titleHi: 'क्यूआर टोकन' },
  { id: 39, titleEn: 'Digital Gate Pass', titleHi: 'गेट पास' },
  { id: 40, titleEn: 'Virtual Yard Queue', titleHi: 'वर्चुअल कतार' },
  { id: 41, titleEn: 'Queue Waiting Status', titleHi: 'कतार स्थिति' },
  { id: 42, titleEn: 'AI Quality Assay Check', titleHi: 'गुणवत्ता जांच' },
  { id: 43, titleEn: 'Quality Lab Reports', titleHi: 'गुणवत्ता रिपोर्ट' },
  { id: 44, titleEn: 'Weighment / Tola Parchi', titleHi: 'तौल पर्ची' },
  { id: 45, titleEn: 'Acceptance Certificates', titleHi: 'स्वीकृति प्रमाण पत्र' },
  { id: 46, titleEn: 'Transport Booking', titleHi: 'परिवहन बुकिंग' },
  { id: 47, titleEn: 'Transport Tracking', titleHi: 'परिवहन ट्रैकिंग' },
  { id: 48, titleEn: 'Direct Bank Transfer (DBT)', titleHi: 'मेरे भुगतान (DBT)' },
  { id: 49, titleEn: 'Payment Details & UTR', titleHi: 'भुगतान विवरण' },
  { id: 50, titleEn: 'Crop Traceability Journey', titleHi: 'फसल ट्रैसेबिलिटी' },
  { id: 51, titleEn: 'Notifications Center', titleHi: 'अधिसूचनाएं' },
  { id: 52, titleEn: 'Buyer Dashboard', titleHi: 'व्यापारी डैशबोर्ड' },
  { id: 53, titleEn: 'Trader Profile & License', titleHi: 'व्यापारी प्रोफ़ाइल' },
  { id: 54, titleEn: 'Crop Marketplace Desk', titleHi: 'फसल बाजार' },
  { id: 55, titleEn: 'Crop Details & Assay', titleHi: 'फसल विवरण' },
  { id: 56, titleEn: 'My Submitted Offers', titleHi: 'मेरे ऑफ़र' },
  { id: 57, titleEn: 'Offer Details', titleHi: 'ऑफ़र विवरण' },
  { id: 58, titleEn: 'Live e-NAM Auctions', titleHi: 'लाइव नीलामी' },
  { id: 59, titleEn: 'Auction Details', titleHi: 'नीलामी विवरण' },
  { id: 60, titleEn: 'My Submitted Bids', titleHi: 'मेरी बोलियां' },
  { id: 61, titleEn: 'Won Auctions & Lots', titleHi: 'जीती नीलामी' },
  { id: 62, titleEn: 'Purchased Crops Inventory', titleHi: 'खरीदी गई फसलें' },
  { id: 63, titleEn: 'Order & Escrow History', titleHi: 'ऑर्डर इतिहास' },
  { id: 64, titleEn: 'Payment History & Receipts', titleHi: 'भुगतान इतिहास' },
  { id: 65, titleEn: 'Delivery Fleet Tracking', titleHi: 'डिलीवरी ट्रैकिंग' },
  { id: 66, titleEn: 'Officer Dashboard', titleHi: 'अधिकारी डैशबोर्ड' },
  { id: 67, titleEn: 'Farmer & Land Verification Review', titleHi: 'किसान सत्यापन' },
  { id: 68, titleEn: 'Land Record Verification', titleHi: 'भूमि सत्यापन' },
  { id: 69, titleEn: 'Crop Declaration Review', titleHi: 'फसल समीक्षा' },
  { id: 70, titleEn: 'Procurement Center Capacity Management', titleHi: 'केंद्र प्रबंधन' },
  { id: 71, titleEn: 'Center Capacity Management', titleHi: 'क्षमता प्रबंधन' },
  { id: 72, titleEn: 'Daily Procurement Summary', titleHi: 'दैनिक खरीद' },
  { id: 73, titleEn: 'Slot Rescheduling Engine', titleHi: 'स्लॉट प्रबंधन' },
  { id: 74, titleEn: 'Delay & Rescheduling Log', titleHi: 'विलंब लॉग' },
  { id: 75, titleEn: 'Queue Monitoring Terminal', titleHi: 'कतार निगरानी' },
  { id: 76, titleEn: 'Gate Entry Monitoring', titleHi: 'गेट प्रवेश निगरानी' },
  { id: 77, titleEn: 'Weighment Monitoring', titleHi: 'तौल निगरानी' },
  { id: 78, titleEn: 'Quality Compliance Monitoring', titleHi: 'गुणवत्ता निगरानी' },
  { id: 79, titleEn: 'Acceptance Management', titleHi: 'स्वीकृति प्रबंधन' },
  { id: 80, titleEn: 'Payment Escrow Monitoring', titleHi: 'भुगतान निगरानी' },
  { id: 81, titleEn: 'Center Operator Dashboard', titleHi: 'संचालक डैशबोर्ड' },
  { id: 82, titleEn: 'QR Token Gate Scanner', titleHi: 'क्यूआर स्कैनर' },
  { id: 83, titleEn: 'Manual Token Entry Fallback', titleHi: 'मैनुअल टोकन' },
  { id: 84, titleEn: 'Gate Entry Vehicle Log', titleHi: 'गेट प्रवेश' },
  { id: 85, titleEn: 'Vehicle Management', titleHi: 'वाहन प्रबंधन' },
  { id: 86, titleEn: 'Vehicle Priority Queue', titleHi: 'प्राथमिकता कतार' },
  { id: 87, titleEn: 'Live Yard Queue Monitor', titleHi: 'लाइव कतार' },
  { id: 88, titleEn: 'Weighment Entry Terminal', titleHi: 'तौल प्रविष्टि' },
  { id: 89, titleEn: 'Digital Tola Parchi Issuance', titleHi: 'तोला पर्ची' },
  { id: 90, titleEn: 'Daily Mandi Operations Summary', titleHi: 'दैनिक मंडी संचालन' },
  { id: 91, titleEn: 'Quality Inspector Dashboard', titleHi: 'गुणवत्ता निरीक्षक' },
  { id: 92, titleEn: 'Pending Inspections Queue', titleHi: 'लंबित निरीक्षण' },
  { id: 93, titleEn: 'Crop Physical Inspection', titleHi: 'फसल निरीक्षण' },
  { id: 94, titleEn: 'NIR Moisture Check Terminal', titleHi: 'नमी की जांच' },
  { id: 95, titleEn: 'Quality Grading (Grade A)', titleHi: 'गुणवत्ता ग्रेडिंग' },
  { id: 96, titleEn: 'Inspection History Audit', titleHi: 'निरीक्षण इतिहास' },
  { id: 97, titleEn: 'AI vs Manual Quality Deviation', titleHi: 'एआई बनाम मैनुअल' },
  { id: 98, titleEn: 'Logistics Dashboard', titleHi: 'लॉजिस्टिक्स डैशबोर्ड' },
  { id: 99, titleEn: 'Transport Requests Pool', titleHi: 'परिवहन अनुरोध' },
  { id: 100, titleEn: 'Available Fleet Vehicles', titleHi: 'उपलब्ध वाहन' },
  { id: 101, titleEn: 'Vehicle Technical Details', titleHi: 'वाहन विवरण' },
  { id: 102, titleEn: 'Driver Management Registry', titleHi: 'चालक प्रबंधन' },
  { id: 103, titleEn: 'Transport Task Assignment', titleHi: 'परिवहन आवंटन' },
  { id: 104, titleEn: 'Pickup Yard Management', titleHi: 'पिकअप प्रबंधन' },
  { id: 105, titleEn: 'Live GPS Transport Tracking', titleHi: 'लाइव ट्रैकिंग' },
  { id: 106, titleEn: 'Completed Delivery Receipts', titleHi: 'पूर्ण सुपुर्दगी' },
  { id: 107, titleEn: 'Logistics Audit History', titleHi: 'लॉजिस्टिक्स इतिहास' },
  { id: 108, titleEn: 'Warehouse Dashboard', titleHi: 'गोदाम डैशबोर्ड' },
  { id: 109, titleEn: 'Warehouse Capacity Holding', titleHi: 'गोदाम क्षमता' },
  { id: 110, titleEn: 'Current Grain Inventory', titleHi: 'अनाज सूची' },
  { id: 111, titleEn: 'Crop-wise Stock Ledger', titleHi: 'स्टॉक लेजर' },
  { id: 112, titleEn: 'Stock Inward Logging', titleHi: 'स्टॉक इन' },
  { id: 113, titleEn: 'Stock Outward Release', titleHi: 'स्टॉक आउट' },
  { id: 114, titleEn: 'Stock Movement Tracking', titleHi: 'स्टॉक आवाजाही' },
  { id: 115, titleEn: 'Warehouse Stock Transfers', titleHi: 'स्थानांतरण' },
  { id: 116, titleEn: 'Capacity Alert Engine', titleHi: 'क्षमता चेतावनी' },
  { id: 117, titleEn: 'Truck Inbound Request', titleHi: 'ट्रक अनुरोध' },
  { id: 118, titleEn: 'Electronic Receipt (e-NWR)', titleHi: 'ई-एनडब्ल्यूआर' },
  { id: 119, titleEn: 'Payment Dashboard', titleHi: 'भुगतान डैशबोर्ड' },
  { id: 120, titleEn: 'Pending Disbursals Queue', titleHi: 'लंबित भुगतान' },
  { id: 121, titleEn: 'Processing Escrow Payments', titleHi: 'प्रसंस्करण भुगतान' },
  { id: 122, titleEn: 'Completed DBT Transfers', titleHi: 'पूर्ण डीबीटी' },
  { id: 123, titleEn: 'Payment Details & Receipt', titleHi: 'भुगतान विवरण' },
  { id: 124, titleEn: 'Transaction History Audit', titleHi: 'लेनदेन इतिहास' },
  { id: 125, titleEn: 'NPCI DBT Tracking Engine', titleHi: 'डीबीटी ट्रैकिंग' },
  { id: 126, titleEn: 'Bank UTR Search Engine', titleHi: 'यूटीआर ट्रैकिंग' },
  { id: 127, titleEn: 'PFMS Audit Reports', titleHi: 'भुगतान रिपोर्ट' },
  { id: 128, titleEn: 'AI Analytics Dashboard', titleHi: 'एआई डैशबोर्ड' },
  { id: 129, titleEn: 'Crop Supply Prediction', titleHi: 'फसल आपूर्ति पूर्वानुमान' },
  { id: 130, titleEn: 'Crop Arrival Forecast', titleHi: 'फसल आवक पूर्वानुमान' },
  { id: 131, titleEn: 'Center Overload Prediction', titleHi: 'केंद्र ओवरलोड भविष्यवाणी' },
  { id: 132, titleEn: 'Warehouse Capacity Forecast', titleHi: 'गोदाम पूर्वानुमान' },
  { id: 133, titleEn: 'Price Trend Prediction', titleHi: 'मूल्य प्रवृत्ति' },
  { id: 134, titleEn: 'AI Quality Prediction Model', titleHi: 'गुणवत्ता पूर्वानुमान' },
  { id: 135, titleEn: 'Demand Forecast Engine', titleHi: 'मांग पूर्वानुमान' },
  { id: 136, titleEn: 'Risk & Alert Dashboard', titleHi: 'जोखिम डैशबोर्ड' },
  { id: 137, titleEn: 'Crop Traceability Dashboard', titleHi: 'ट्रैसेबिलिटी डैशबोर्ड' },
  { id: 138, titleEn: 'Crop Journey Timeline', titleHi: 'फसल यात्रा' },
  { id: 139, titleEn: 'Cryptographic Ledger History', titleHi: 'लेनदेन इतिहास' },
  { id: 140, titleEn: 'Traceability Deep Details', titleHi: 'ट्रैसेबिलिटी विवरण' },
  { id: 141, titleEn: 'Audit Logs Certificate', titleHi: 'ऑडिट लॉग' },
  { id: 142, titleEn: 'Blockchain Block Records', titleHi: 'ब्लॉकचेन रिकॉर्ड' },
  { id: 143, titleEn: 'Admin Master Dashboard', titleHi: 'प्रशासक डैशबोर्ड' },
  { id: 144, titleEn: 'User Management Portal', titleHi: 'उपयोगकर्ता प्रबंधन' },
  { id: 145, titleEn: 'Farmer Master Registry', titleHi: 'किसान प्रबंधन' },
  { id: 146, titleEn: 'Buyer Master Registry', titleHi: 'व्यापारी प्रबंधन' },
  { id: 147, titleEn: 'Procurement Centers Master', titleHi: 'खरीद केंद्र' },
  { id: 148, titleEn: 'Warehouse Granary Master', titleHi: 'गोदाम प्रबंधन' },
  { id: 149, titleEn: 'Commodity Crop Master', titleHi: 'फसल प्रबंधन' },
  { id: 150, titleEn: 'Government MSP Policy Master', titleHi: 'एमएसपी प्रबंधन' },
  { id: 151, titleEn: 'Role Access Control (RBAC)', titleHi: 'भूमिकाएं' },
  { id: 152, titleEn: 'Security & Audit Logs', titleHi: 'सुरक्षा ऑडिट' },
  { id: 153, titleEn: 'System Configuration', titleHi: 'सिस्टम विन्यास' },
  { id: 154, titleEn: 'API Gateway & Webhooks', titleHi: 'एपीआई प्रबंधन' },
  { id: 155, titleEn: 'SMS & WhatsApp Gateway', titleHi: 'एसएमएस गेटवे' },
  { id: 156, titleEn: 'Email Notification Services', titleHi: 'ईमेल सेवाएं' },
  { id: 157, titleEn: 'NPCI DBT Bridge Config', titleHi: 'डीबीटी गेटवे' },
  { id: 158, titleEn: 'Database Backup & DR', titleHi: 'बैकअप प्रबंधन' },
  { id: 159, titleEn: 'Microservices Health Monitor', titleHi: 'सेवा स्वास्थ्य' },
  { id: 160, titleEn: 'Real-time Server Cluster Status', titleHi: 'सर्वर स्थिति' },
  { id: 161, titleEn: 'Master Procurement Reports', titleHi: 'मास्टर रिपोर्ट' },
  { id: 162, titleEn: 'Export Data Central Kiosk', titleHi: 'डेटा निर्यात' },
  { id: 163, titleEn: 'User Profile Settings', titleHi: 'प्रोफ़ाइल सेटिंग्स' },
  { id: 164, titleEn: 'Account Settings', titleHi: 'खाता सेटिंग्स' },
  { id: 165, titleEn: 'Security Settings', titleHi: 'सुरक्षा सेटिंग्स' },
  { id: 166, titleEn: 'Language Settings', titleHi: 'भाषा सेटिंग्स' },
  { id: 167, titleEn: 'Help & Support Kiosk', titleHi: 'सहायता' },
  { id: 168, titleEn: 'Report a Problem', titleHi: 'समस्या दर्ज करें' },
  { id: 169, titleEn: '404 Not Found Page', titleHi: '404 पृष्ठ' },
  { id: 170, titleEn: 'Access Denied Guard', titleHi: 'पहुंच अस्वीकृत' },
  { id: 171, titleEn: 'Server Error Handler', titleHi: 'सर्वर त्रुटि' }
];

export default function QuickSearchModal({ isOpen, onClose, setCurrentView, onNavigateToPage, t }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const searchResults = all171PagesRegistry.filter(item => 
    item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.titleHi.includes(searchQuery) ||
    item.id.toString().includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-[#abbe99] shadow-2xl space-y-4 text-[#243118]">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[#abbe99]/60 pb-3">
          <Search className="w-5 h-5 text-[#71873f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Type page # or title to search 171 AAGAM pages...', '171 एएजीएएम पृष्ठ या सेवा खोजें...')}
            className="w-full text-sm font-medium focus:outline-none bg-transparent"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-[#637554] hover:bg-[#f0f4ea] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (onNavigateToPage) {
                    onNavigateToPage(item.id);
                  } else if (setCurrentView) {
                    setCurrentView('portal');
                  }
                  onClose();
                }}
                className="p-3 bg-[#fcfaf7] hover:bg-[#f0f4ea] rounded-xl border border-[#abbe99]/40 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className="bg-[#a36627] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    #{item.id}
                  </span>
                  <div className="text-xs font-bold font-sans text-[#243118]">{t(item.titleEn, item.titleHi)}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#71873f]" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-[#637554]">
              {t('No matching portal workflows found.', 'कोई प्रासंगिक सेवा नहीं मिली।')}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
