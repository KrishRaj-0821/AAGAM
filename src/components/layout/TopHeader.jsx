import React from 'react';
import { Phone, LifeBuoy } from 'lucide-react';

export default function TopHeader({
  language,
  setLanguage,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  onOpenHelpdesk,
  t
}) {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Official Tricolor Top Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Official GOI Top Meta Bar */}
      <div className={`${highContrast ? 'bg-slate-950 text-yellow-300 border-b border-yellow-500/40' : 'bg-[#1a2512] text-white'} px-4 py-2 text-xs`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Clean Official Ministry Emblem & Text (No bounding boxes) */}
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2.5">
              {/* Ashoka Lion Capital Emblem */}
              <div className="w-8 h-8 bg-white/90 rounded-md p-0.5 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={import.meta.env.BASE_URL + 'images/goi_emblem.png'}
                  alt="Government of India Emblem"
                  className="w-full h-full object-contain filter contrast-125"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Bold & Crisp Ministry Typography */}
              <div className="flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#e0b87e] font-extrabold text-[11px] tracking-wider uppercase font-sans">
                    {t('भारत सरकार', 'भारत सरकार')}
                  </span>
                  <span className="text-white/40 text-[10px]">|</span>
                  <span className="text-[#e0b87e] font-extrabold text-[11px] tracking-wider uppercase font-sans">
                    {t('GOVERNMENT OF INDIA', 'GOVERNMENT OF INDIA')}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-white font-extrabold text-xs tracking-wide">
                    {language === 'hi' 
                      ? 'कृषि एवं किसान कल्याण मंत्रालय' 
                      : 'Ministry of Agriculture & Farmers Welfare'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live National Agri Grid Status (Clean text with live dot) */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-300 pl-3 border-l border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{t('2,840 Mandis Live • Agmarknet Connected', '2,840 मंडियां लाइव • एगमार्कनेट सक्रिय')}</span>
            </div>

          </div>

          {/* Right: Helpline, Helpdesk Button, Accessibility & Language Switch */}
          <div className="flex items-center gap-4 sm:gap-6 ml-auto sm:ml-0">
            
            {/* Toll Free Kisan Helpline */}
            <a
              href="tel:18001801551"
              className="hidden md:flex items-center gap-1.5 font-mono text-white hover:text-[#e0b87e] transition-colors py-0.5"
              title="Kisan Call Centre Toll-Free Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-[#e0b87e] animate-pulse" />
              <span className="text-[11px] font-medium text-slate-200">
                {t('Kisan Helpline:', 'हेल्पलाइन:')}{' '}
                <strong className="font-mono text-[#e0b87e] font-bold">1800-180-1551</strong>
              </span>
            </a>

            {/* Citizen Helpdesk & Bug Report Trigger Button */}
            {onOpenHelpdesk && (
              <button
                onClick={onOpenHelpdesk}
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-200 hover:text-[#e0b87e] transition-colors py-0.5"
                title="Open Helpdesk & Grievance Redressal"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-[#e0b87e]" />
                <span>{t('Helpdesk / Bug Report', 'हेल्पडेस्क / शिकायत')}</span>
              </button>
            )}

            {/* Accessibility Controls: Font Resizing (A-, A, A+) & High Contrast */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-200">
              <span className="text-slate-300 font-bold mr-0.5">{t('Font:', 'अक्षर:')}</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1 rounded font-extrabold transition-colors ${fontSize === 'sm' ? 'text-[#e0b87e] underline' : 'hover:text-[#e0b87e]'}`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-1 rounded font-extrabold transition-colors ${fontSize === 'md' ? 'text-[#e0b87e] underline' : 'hover:text-[#e0b87e]'}`}
                title="Default Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1 rounded font-extrabold transition-colors ${fontSize === 'lg' ? 'text-[#e0b87e] underline' : 'hover:text-[#e0b87e]'}`}
                title="Increase Font Size"
              >
                A+
              </button>

              <span className="text-white/30 mx-1">|</span>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-1 rounded font-bold transition-colors ${highContrast ? 'text-yellow-400 font-extrabold' : 'hover:text-[#e0b87e]'}`}
                title="Toggle High Contrast Theme"
              >
                {highContrast ? 'Standard' : 'Contrast'}
              </button>
            </div>

            {/* Language Selection: Clean English | हिन्दी Switch */}
            <div className="flex items-center gap-1.5 text-xs font-extrabold">
              <button
                onClick={() => setLanguage('en')}
                className={`transition-all ${language === 'en' ? 'text-[#e0b87e] font-black underline underline-offset-4' : 'text-white/80 hover:text-white'}`}
              >
                English
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLanguage('hi')}
                className={`transition-all ${language === 'hi' ? 'text-[#e0b87e] font-black underline underline-offset-4' : 'text-white/80 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
