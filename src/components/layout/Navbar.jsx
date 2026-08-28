import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Coins, 
  QrCode, 
  LogIn, 
  UserPlus, 
  ChevronDown, 
  Users, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck,
  Building2,
  Sprout,
  LifeBuoy,
  Mic,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  navigateWithAuth,
  activeRole,
  setActiveRole,
  highContrast,
  setIsSearchOpen,
  openDbtWithAuth,
  openGatePassWithAuth,
  onOpenHelpdesk,
  onOpenVoiceAgent,
  onOpenAiCropAnalyzer,
  currentUser,
  isAuthenticated,
  onRequestLogout,
  t
}) {
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  const mainNavItems = [
    { key: 'home', labelEn: 'Home', labelHi: 'मुख्य पृष्ठ' },
    { key: 'marketplace', labelEn: 'Marketplace', labelHi: 'फसल बाजार' },
    { key: 'prices', labelEn: 'Prices', labelHi: 'मूल्य सूची' },
    { key: 'eauction', labelEn: 'E-Auction', labelHi: 'ई-नीलामी' },
    { key: 'procurement', labelEn: 'Procurement', labelHi: 'खरीद केंद्र' },
    { key: 'logistics', labelEn: 'Logistics', labelHi: 'लॉजिस्टिक्स' },
    { key: 'analytics', labelEn: 'Analytics', labelHi: 'विश्लेषण' }
  ];

  const serviceItems = [
    { key: 'marketplace', labelEn: 'Marketplace', labelHi: 'फसल बाजार', icon: '🛒', descEn: 'Direct trade & grain marketplace', descHi: 'अनाज व्यापार बाजार' },
    { key: 'prices', labelEn: 'Prices', labelHi: 'मूल्य सूची', icon: '📈', descEn: 'Live MSP & local mandi prices', descHi: 'न्यूनतम समर्थन मूल्य व मंडी दर' },
    { key: 'eauction', labelEn: 'E-Auction', labelHi: 'ई-नीलामी', icon: '⚡', descEn: 'Live grain e-auctions & bidding', descHi: 'लाइव अनाज ई-नीलामी' },
    { key: 'procurement', labelEn: 'Procurement', labelHi: 'खरीद केंद्र', icon: '🏢', descEn: 'Mandi slot booking & queues', descHi: 'मंडी स्लॉट बुकिंग एवं कतार' },
    { key: 'logistics', labelEn: 'Logistics', labelHi: 'लॉजिस्टिक्स', icon: '🚚', descEn: 'Transport requests & tracking', descHi: 'परिवहन और जीपीएस ट्रैकिंग' },
    { key: 'analytics', labelEn: 'Analytics', labelHi: 'विश्लेषण', icon: '📊', descEn: 'AI market forecasts & analytics', descHi: 'एआई पूर्वानुमान और विश्लेषण' }
  ];

  const isServiceActive = serviceItems.some(item => item.key === currentView);

  const portalPersonas = [
    { key: 'Farmer', labelEn: 'Farmer Portal', labelHi: 'किसान पोर्टल', icon: '👨‍🌾' },
    { key: 'Buyer', labelEn: 'Buyer / Trader Portal', labelHi: 'व्यापारी पोर्टल', icon: '🏢' },
    { key: 'Officer', labelEn: 'Procurement Officer', labelHi: 'सरकारी अधिकारी', icon: '🏛️' },
    { key: 'Operator', labelEn: 'Mandi Center Operator', labelHi: 'मंडी संचालक', icon: '🚜' },
    { key: 'Quality', labelEn: 'Quality Inspector', labelHi: 'गुणवत्ता निरीक्षक', icon: '🔬' },
    { key: 'Warehouse', labelEn: 'Warehouse Manager', labelHi: 'गोदाम प्रबंधक', icon: '🏭' },
    { key: 'Admin', labelEn: 'System Admin', labelHi: 'सिस्टम एडमिन', icon: '🛡️' }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPortalDropdownOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };
    if (isPortalDropdownOpen || isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPortalDropdownOpen, isServicesDropdownOpen]);

  // Global keyboard shortcut (Ctrl+K / Cmd+K) for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const handleNavClick = (key) => {
    setIsMobileMenuOpen(false);
    setIsPortalDropdownOpen(false);

    if (key === 'prices') {
      if (currentView !== 'home') {
        if (navigateWithAuth) navigateWithAuth('home');
        else setCurrentView('home');
      }
      setTimeout(() => {
        const pricesEl = document.getElementById('prices');
        if (pricesEl) {
          pricesEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    if (navigateWithAuth) {
      navigateWithAuth(key);
    } else {
      setCurrentView(key);
    }
  };

  const handlePortalClick = (roleKey) => {
    setIsPortalDropdownOpen(false);
    setIsMobileMenuOpen(false);

    if (isAuthenticated && currentUser?.role) {
      if (currentUser.role !== roleKey) {
        const shouldLogout = window.confirm(
          `Role Lock Policy\n\nYou are currently signed in as "${currentUser.role}".\n\nTo access the "${roleKey}" portal, you must log out of your current account first.\n\nWould you like to Log Out now?`
        );
        if (shouldLogout) {
          if (onRequestLogout) {
            onRequestLogout();
          }
        }
        return;
      }
      setActiveRole(currentUser.role);
      setCurrentView('portal');
      return;
    }
    
    // Unauthenticated user clicking a role portal -> open portal view (triggers login gate)
    setActiveRole(roleKey);
    setCurrentView('portal');
  };

  return (
    <nav className={`w-full ${highContrast ? 'bg-slate-900 text-yellow-300 border-b border-yellow-500' : 'bg-white text-[#243118] border-b border-[#abbe99]/40'}`}>
      
      {/* ROW 1: Brand Emblem Logo, Primary Links & Core Action Cluster */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        
        {/* Left: Modern AAGAM Brand Emblem Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <img
            src={import.meta.env.BASE_URL + 'images/aagam_logo.png'}
            alt="AAGAM - Automated Agricultural Grain & Allocation Management System"
            className="h-10 sm:h-11 w-auto object-contain bg-white px-2 py-0.5 rounded-xl border border-[#abbe99]/40 shadow-xs group-hover:scale-[1.02] transition-transform"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-extrabold text-sm text-[#243118] tracking-tight group-hover:text-[#71873f] transition-colors">
              AAGAM
            </span>
            <span className="text-[10px] font-bold text-[#637554] hidden md:inline">
              {t('National Agri Grain Allocation', 'राष्ट्रीय कृषि अनाज प्रबंधन')}
            </span>
          </div>
        </div>

        {/* Center: Desktop Primary Navigation Tabs (Hidden on < lg) */}
        <div className="hidden lg:flex items-center gap-1 font-extrabold text-xs">
          {/* Home Tab */}
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'home' 
                ? 'bg-[#71873f] text-white shadow-sm font-extrabold' 
                : 'text-[#243118] hover:bg-[#f0f4ea] hover:text-[#71873f]'
            }`}
          >
            {t('Home', 'मुख्य पृष्ठ')}
          </button>

          {/* Services Dropdown */}
          <div className="relative shrink-0" ref={servicesDropdownRef}>
            <button
              onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
                isServiceActive 
                  ? 'bg-[#71873f] text-white border-[#71873f]' 
                  : 'bg-[#fcfaf7] border-[#abbe99]/70 text-[#243118] hover:bg-[#f0f4ea]'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isServiceActive ? 'text-white' : 'text-[#71873f]'}`} />
              <span>{t('Services', 'सेवाएं')}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isServicesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-[#abbe99] shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-mono font-bold text-[#71873f] uppercase border-b border-[#abbe99]/40 flex items-center justify-between">
                  <span>{t('AAGAM Core Services', 'अगाम मुख्य सेवाएं')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#a36627]" />
                </div>
                <div className="py-1">
                  {serviceItems.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        handleNavClick(s.key);
                        setIsServicesDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-start gap-2.5 cursor-pointer ${
                        currentView === s.key
                          ? 'bg-[#f0f4ea] text-[#71873f]'
                          : 'text-[#243118] hover:bg-[#f7f4ee]'
                      }`}
                    >
                      <span className="text-base mt-0.5">{s.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[12px]">{t(s.labelEn, s.labelHi)}</span>
                        <span className={`text-[10px] font-normal leading-tight ${currentView === s.key ? 'text-[#71873f]/80' : 'text-slate-500'}`}>
                          {t(s.descEn, s.descHi)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Portals Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
                currentView === 'portal' 
                  ? 'bg-[#a36627] text-white border-[#a36627]' 
                  : 'bg-[#fcfaf7] border-[#abbe99]/70 text-[#243118] hover:bg-[#f0f4ea]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#a36627]" />
              <span>{t('Role Portals', 'पोर्टल चयन')}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isPortalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPortalDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-[#abbe99] shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-mono font-bold text-[#a36627] uppercase border-b border-[#abbe99]/40 flex items-center justify-between">
                  <span>{t('7 Stakeholder Portals', '7 हितधारक पोर्टल')}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#71873f]" />
                </div>
                <div className="py-1">
                  {portalPersonas.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => handlePortalClick(p.key)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                        activeRole === p.key && currentView === 'portal'
                          ? 'bg-[#f0f4ea] text-[#71873f]'
                          : 'text-[#243118] hover:bg-[#f7f4ee]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{p.icon}</span>
                        <span>{t(p.labelEn, p.labelHi)}</span>
                      </div>
                      {activeRole === p.key && currentView === 'portal' && (
                        <span className="text-[9px] bg-[#71873f] text-white font-mono px-1.5 py-0.5 rounded-md">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Desktop Primary Action & Auth Controls */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          
          {/* Quick Gate Pass Action */}
          <button
            onClick={() => openGatePassWithAuth ? openGatePassWithAuth() : null}
            className="flex items-center gap-1.5 bg-[#71873f] hover:bg-[#5f7334] text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
            title={t('Fast-Track Mandi Gate Pass & Slot Reservation', 'गेट पास एवं स्लॉट बुकिंग')}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t('Gate Pass', 'गेट पास')}</span>
          </button>

          {/* Authenticated User Status OR Login / Register */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-1 border-l border-[#abbe99]/50">
              <div 
                onClick={() => handleNavClick('portal')}
                className="flex items-center gap-2 bg-[#f0f4ea] hover:bg-[#e0e8d6] border border-[#71873f]/40 px-2.5 py-1 rounded-xl cursor-pointer shadow-xs transition-colors"
                title={t('Go to your Persona Portal', 'अपने पोर्टल पर जाएं')}
              >
                <div className="w-6 h-6 rounded-full bg-[#71873f] text-white flex items-center justify-center text-[10px] font-extrabold shadow-inner">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-extrabold text-[#243118] leading-none truncate max-w-[100px]">
                    {currentUser?.name || 'Gurpreet Singh'}
                  </div>
                  <div className="text-[9px] text-[#71873f] font-mono font-bold leading-tight">
                    {currentUser?.role || activeRole}
                  </div>
                </div>
              </div>

              <button
                onClick={onRequestLogout}
                className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs px-2.5 py-1.5 rounded-xl border border-red-200 transition-all shadow-xs whitespace-nowrap cursor-pointer"
                title={t('Sign Out of Account', 'खाते से लॉग आउट करें')}
              >
                <LogOut className="w-3 h-3 text-red-600" />
                <span>{t('Sign Out', 'लॉग आउट')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1 border-l border-[#abbe99]/50">
              <button
                onClick={() => setCurrentView('login')}
                className={`flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer ${
                  currentView === 'login' 
                    ? 'bg-[#71873f] text-white' 
                    : 'bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] border border-[#71873f]/40'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('Login', 'लॉगिन')}</span>
              </button>

              <button
                onClick={() => setCurrentView('register')}
                className={`flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer ${
                  currentView === 'register' 
                    ? 'bg-[#a36627] text-white' 
                    : 'bg-[#a36627] hover:bg-[#85511b] text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('Register', 'पंजीकरण')}</span>
              </button>
            </div>
          )}

        </div>

        {/* Mobile Action Cluster (< lg: Search Icon + Gate Pass + Menu Toggle) */}
        <div className="flex items-center gap-1.5 lg:hidden">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#71873f] bg-[#f4efe6] hover:bg-[#e8dfd1] rounded-xl border border-[#abbe99]/60 cursor-pointer"
            title={t('Search Services', 'खोजें')}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Gate Pass */}
          <button
            onClick={() => openGatePassWithAuth ? openGatePassWithAuth() : null}
            className="flex items-center gap-1 bg-[#71873f] text-white text-xs font-extrabold px-2.5 py-1.5 rounded-xl cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('Gate Pass', 'गेट पास')}</span>
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#71873f] hover:bg-[#f0f4ea] rounded-xl border border-[#abbe99]/50 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* ROW 2: Operational Sub-Bar (Search Bar & Operational Intelligence) */}
      <div className="border-t border-[#abbe99]/40 bg-[#fcfaf7] px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-bold">
          
          {/* Left: Quick Global Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between bg-[#f4efe6] hover:bg-[#eae1d2] text-[#243118] px-3.5 py-1.5 rounded-xl border border-[#abbe99]/60 transition-all shadow-inner w-full sm:w-80 md:w-96 cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <Search className="w-3.5 h-3.5 text-[#71873f] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium truncate">
                {t('Search 171 AAGAM services, MSP rates, mandis...', '171 सेवाएं, एमएसपी भाव, मंडियां खोजें...')}
              </span>
            </div>
            <kbd className="hidden sm:inline-block bg-white/80 border border-[#abbe99]/60 rounded px-1.5 py-0.5 text-[10px] font-mono text-[#637554]">
              Ctrl K
            </kbd>
          </button>

          {/* Right: Operational Tool Pills (Hidden on small screens, neatly aligned on md+) */}
          <div className="hidden md:flex items-center gap-2 ml-auto shrink-0">
            
            {/* AI Crop Quality Analysis Agent Trigger */}
            {onOpenAiCropAnalyzer && (
              <button
                onClick={onOpenAiCropAnalyzer}
                className="flex items-center gap-1.5 bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#243118] font-extrabold px-3 py-1.5 rounded-xl border border-[#71873f]/40 transition-all shadow-2xs cursor-pointer group"
                title={t('AI Crop Quality & Market Price Analysis Agent', 'एआई फसल जांच एवं बाजार भाव')}
              >
                <Sprout className="w-3.5 h-3.5 text-[#71873f] group-hover:rotate-12 transition-transform" />
                <span className="text-[11px]">{t('🌾 Check Your Crop', '🌾 फसल जांच करें')}</span>
              </button>
            )}

            {/* Payment Status (Auth Protected) */}
            <button
              onClick={() => openDbtWithAuth ? openDbtWithAuth() : null}
              className="flex items-center gap-1.5 bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#a36627] font-extrabold px-3 py-1.5 rounded-xl border border-[#a36627]/40 transition-all shadow-2xs cursor-pointer"
              title={t('Check Direct Benefit Transfer Payment Status', 'भुगतान स्थिति')}
            >
              <Coins className="w-3.5 h-3.5 text-[#a36627]" />
              <span className="text-[11px]">{t('Payment Status', 'भुगतान स्थिति')}</span>
            </button>

            {/* Live Agri Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Agmarknet Live • 2,840 Mandis</span>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer (< lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#abbe99]/40 bg-white p-4 space-y-3 font-bold text-xs shadow-xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* Search Trigger in Drawer */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center justify-between bg-[#f4efe6] p-2.5 rounded-xl border border-[#abbe99]/60 text-[#243118]"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#71873f]" />
              <span>{t('Search all 171 services...', 'सभी 171 सेवाएं खोजें...')}</span>
            </div>
            <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] border border-[#abbe99]/40 font-mono">
              Search
            </kbd>
          </button>

          {/* 7 Main Public Navigation Links */}
          <div className="text-[10px] font-mono font-bold text-[#637554] uppercase tracking-wider">
            {t('Public Navigation', 'मुख्य पृष्ठ')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {mainNavItems.map((nav) => (
              <button
                key={nav.key}
                onClick={() => handleNavClick(nav.key)}
                className={`p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  currentView === nav.key 
                    ? 'bg-[#71873f] text-white shadow-xs' 
                    : 'bg-[#fcfaf7] text-[#243118] border border-[#abbe99]/60 hover:bg-[#f0f4ea]'
                }`}
              >
                {t(nav.labelEn, nav.labelHi)}
              </button>
            ))}
          </div>

          {/* 7 Stakeholder Persona Portals Expander */}
          <div className="text-[10px] font-mono font-bold text-[#a36627] uppercase tracking-wider pt-2 border-t border-[#abbe99]/40">
            {t('7 Stakeholder Role Portals', '7 भूमिका पोर्टल')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {portalPersonas.map((p) => (
              <button
                key={p.key}
                onClick={() => handlePortalClick(p.key)}
                className={`p-2 rounded-xl text-left flex items-center justify-between border cursor-pointer ${
                  activeRole === p.key && currentView === 'portal'
                    ? 'bg-[#f0f4ea] border-[#71873f] text-[#71873f]'
                    : 'bg-[#fcfaf7] border-[#abbe99]/60 text-[#243118] hover:bg-[#f7f4ee]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <span className="text-xs">{t(p.labelEn, p.labelHi)}</span>
                </div>
                {activeRole === p.key && currentView === 'portal' && (
                  <span className="text-[9px] bg-[#71873f] text-white font-mono px-1 rounded">
                    ACTIVE
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Operational Quick Actions in Mobile Drawer */}
          <div className="text-[10px] font-mono font-bold text-[#637554] uppercase tracking-wider pt-2 border-t border-[#abbe99]/40">
            {t('Quick Actions', 'त्वरित सेवाएं')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (openGatePassWithAuth) openGatePassWithAuth();
              }}
              className="p-2.5 rounded-xl bg-[#71873f] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('Gate Pass', 'गेट पास')}</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (openDbtWithAuth) openDbtWithAuth();
              }}
              className="p-2.5 rounded-xl bg-[#fcfaf7] border border-[#a36627] text-[#a36627] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Coins className="w-4 h-4" />
              <span>{t('Payment Status', 'भुगतान')}</span>
            </button>
          </div>

          {onOpenAiCropAnalyzer && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAiCropAnalyzer();
              }}
              className="w-full p-2.5 rounded-xl bg-[#f0f4ea] border border-[#71873f]/40 text-[#243118] font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Sprout className="w-4 h-4 text-[#71873f]" />
              <span>{t('🌾 Check Your Crop (AI Assay)', '🌾 फसल जांच करें (एआई विश्लेषण)')}</span>
            </button>
          )}

          {/* User Account / Authentication in Mobile Drawer */}
          {isAuthenticated ? (
            <div className="pt-2 border-t border-[#abbe99]/40 flex items-center justify-between">
              <div className="text-xs">
                <div className="font-extrabold text-[#243118]">{currentUser?.name || 'Authenticated User'}</div>
                <div className="text-[10px] text-[#71873f] font-mono">{currentUser?.role || activeRole}</div>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onRequestLogout) onRequestLogout();
                }}
                className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('Sign Out', 'लॉग आउट')}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#abbe99]/40 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCurrentView('login');
                }}
                className="w-full p-2.5 rounded-xl bg-[#71873f] text-white font-extrabold text-center cursor-pointer shadow-xs"
              >
                {t('Sign In', 'लॉगिन')}
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCurrentView('register');
                }}
                className="w-full p-2.5 rounded-xl bg-[#a36627] text-white font-extrabold text-center cursor-pointer shadow-xs"
              >
                {t('Register', 'पंजीकरण')}
              </button>
            </div>
          )}

        </div>
      )}

    </nav>
  );
}
