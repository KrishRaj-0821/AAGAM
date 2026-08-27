import React from 'react';
import { directoryCategories } from '../../data/mockData';
import { Mic } from 'lucide-react';

export default function Footer({ highContrast, language, onOpenHelpdesk, onOpenVoiceAgent, onNavigateToPage, t }) {
  return (
    <footer className={`${highContrast ? 'bg-black text-yellow-300 border-t border-yellow-500' : 'bg-[#243118] text-white border-t border-[#abbe99]/40'}`}>
      
      {/* Top Footer Callout */}
      <div className="border-b border-[#688557]/40 py-10 bg-[#1c2713]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={import.meta.env.BASE_URL + 'images/aagam_logo.png'}
              alt="AAGAM Emblem Logo"
              className="h-16 w-auto object-contain bg-white px-2 py-1.5 rounded-2xl shadow-lg shrink-0"
            />
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>{t('National Procurement Directory', 'राष्ट्रीय खरीद निर्देशिका')}</span>
              </h3>
              <p className="text-xs text-[#abbe99] max-w-xl">
                {t('Official Centralized Portal governing 171 integrated workflow services for Indian Agricultural Grain Management.', 'भारतीय कृषि खाद्यान्न प्रबंधन के लिए 171 एकीकृत सेवाओं का आधिकारिक पोर्टल।')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="mailto:aagam.help.gov@gmail.com" 
              className="bg-[#243118] border border-[#abbe99]/40 hover:border-[#e0b87e] px-4 py-2 rounded-xl text-center transition-colors"
              title="Send direct email to AAGAM Central Helpdesk"
            >
              <div className="text-xs text-[#e0b87e] font-mono font-bold">Official Support Inbox</div>
              <div className="text-[11px] text-slate-200 font-mono font-semibold">aagam.help.gov@gmail.com</div>
            </a>
            
            {/* AI Voice Agent (Replaced 1800 Helpline) */}
            <button
              onClick={onOpenVoiceAgent}
              className="bg-[#243118] hover:bg-[#1a2512] border border-[#abbe99]/50 hover:border-[#e0b87e] px-4 py-2 rounded-xl text-center transition-all shadow-sm group active:scale-95 cursor-pointer"
              title="Talk to 24x7 AI Voice Agent"
            >
              <div className="text-xs text-[#e0b87e] font-mono font-bold flex items-center justify-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#e0b87e] animate-pulse group-hover:scale-110 transition-transform" />
                <span>{t('24x7 AI Voice Agent', '24x7 किसान वॉइस एजेंट')}</span>
              </div>
              <div className="text-[10px] text-emerald-300 font-mono font-bold">{t('Hindi • English • ElevenLabs AI', 'हिन्दी • English • ElevenLabs AI')}</div>
            </button>
            {onOpenHelpdesk && (
              <button
                onClick={onOpenHelpdesk}
                className="bg-[#71873f] hover:bg-[#688557] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                {t('Open Helpdesk / Grievance', 'हेल्पडेस्क / शिकायत दर्ज करें')}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 14 Taxonomy Category Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {directoryCategories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-bold text-sm text-[#e0b87e] border-b border-[#688557]/40 pb-2">
                {t(cat.titleEn, cat.titleHi)}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {(language === 'hi' ? cat.linksHi : cat.linksEn).map((link, linkIdx) => {
                  const pageNum = cat.pageNums ? cat.pageNums[linkIdx] : linkIdx + 1;
                  return (
                    <li
                      key={linkIdx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigateToPage && pageNum) {
                          onNavigateToPage(pageNum);
                        }
                      }}
                      className="hover:text-amber-300 hover:underline cursor-pointer transition-colors flex items-center gap-1.5 group select-none py-0.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#71873f] group-hover:bg-amber-400 transition-colors shrink-0" />
                      <span className="truncate">{link}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal Stripe */}
        <div className="pt-8 border-t border-[#688557]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#abbe99] gap-4">
          <p>© 2026 AAGAM Portal, Ministry of Agriculture & Farmers Welfare, Govt of India.</p>
          <div className="flex items-center gap-4">
            <span onClick={() => onNavigateToPage && onNavigateToPage(13)} className="hover:text-white cursor-pointer">{t('Privacy Policy', 'गोपनीयता नीति')}</span>
            <span onClick={() => onNavigateToPage && onNavigateToPage(12)} className="hover:text-white cursor-pointer">{t('Terms of Service', 'सेवा की शर्तें')}</span>
            <span onClick={() => onNavigateToPage && onNavigateToPage(166)} className="hover:text-white cursor-pointer">{t('Accessibility Statement', 'सुगम्यता कथन')}</span>
            <span onClick={() => onNavigateToPage && onNavigateToPage(153)} className="hover:text-white cursor-pointer">{t('NIC Cloud', 'एनआईसी क्लाउड')}</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
