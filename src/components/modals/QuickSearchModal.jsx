import React, { useState } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';

export default function QuickSearchModal({ isOpen, onClose, setCurrentView, t }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const quickPages = [
    { id: 1, titleEn: 'Home / Landing Page', titleHi: 'मुख्य पृष्ठ', view: 'home' },
    { id: 6, titleEn: 'Crop Marketplace', titleHi: 'फसल बाजार', view: 'marketplace' },
    { id: 7, titleEn: 'Live E-Auction', titleHi: 'लाइव ई-नीलामी', view: 'eauction' },
    { id: 8, titleEn: 'Procurement Centers', titleHi: 'खरीद केंद्र', view: 'procurement' },
    { id: 9, titleEn: 'AI Analytics Overview', titleHi: 'एआई विश्लेषण', view: 'analytics' },
    { id: 20, titleEn: 'Farmer Dashboard', titleHi: 'किसान डैशबोर्ड', view: 'portal' },
    { id: 36, titleEn: 'Book Arrival Slot & Gate Pass', titleHi: 'गेट पास बुक करें', view: 'procurement' },
    { id: 42, titleEn: 'AI Quality Assay Check', titleHi: 'एआई गुणवत्ता जांच', view: 'portal' },
    { id: 48, titleEn: 'Direct Bank Transfer (DBT)', titleHi: 'डीबीटी भुगतान स्थिति', view: 'portal' },
    { id: 52, titleEn: 'Buyer Dashboard', titleHi: 'व्यापारी डैशबोर्ड', view: 'portal' },
    { id: 66, titleEn: 'Officer Dashboard', titleHi: 'अधिकारी डैशबोर्ड', view: 'portal' },
    { id: 81, titleEn: 'Center Operator Dashboard', titleHi: 'संचालक डैशबोर्ड', view: 'portal' },
    { id: 91, titleEn: 'Quality Inspector Dashboard', titleHi: 'गुणवत्ता निरीक्षक डैशबोर्ड', view: 'portal' },
    { id: 98, titleEn: 'Logistics Dashboard', titleHi: 'लॉजिस्टिक्स डैशबोर्ड', view: 'logistics' },
    { id: 108, titleEn: 'Warehouse Dashboard', titleHi: 'गोदाम डैशबोर्ड', view: 'portal' },
    { id: 119, titleEn: 'Payment Dashboard', titleHi: 'भुगतान डैशबोर्ड', view: 'portal' },
    { id: 128, titleEn: 'AI Analytics Dashboard', titleHi: 'एआई विश्लेषणात्मक डैशबोर्ड', view: 'analytics' },
    { id: 137, titleEn: 'Crop Traceability Dashboard', titleHi: 'फसल ट्रैसेबिलिटी', view: 'portal' },
    { id: 143, titleEn: 'Admin Master Dashboard', titleHi: 'प्रशासक डैशबोर्ड', view: 'portal' },
    { id: 163, titleEn: 'My Notifications Center', titleHi: 'सूचनाएं', view: 'portal' }
  ];

  const searchResults = quickPages.filter(item => 
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
                  if (setCurrentView) setCurrentView(item.view);
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
