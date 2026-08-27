import React, { useState } from 'react';
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
  UserCheck, 
  ShieldCheck,
  Building2,
  Sprout,
  LifeBuoy,
  Mic
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

  const mainNavItems = [
    { key: 'home', labelEn: 'Home', labelHi: 'मुख्य पृष्ठ' },
    { key: 'marketplace', labelEn: 'Marketplace', labelHi: 'फसल बाजार' },
    { key: 'prices', labelEn: 'Prices', labelHi: 'मूल्य सूची' },
    { key: 'eauction', labelEn: 'E-Auction', labelHi: 'ई-नीलामी' },
    { key: 'procurement', labelEn: 'Procurement', labelHi: 'खरीद केंद्र' },
    { key: 'logistics', labelEn: 'Logistics', labelHi: 'लॉजिस्टिक्स' },
    { key: 'analytics', labelEn: 'Analytics', labelHi: 'विश्लेषण' }
  ];

  const portalPersonas = [
    { key: 'Farmer', labelEn: 'Farmer Portal', labelHi: 'किसान पोर्टल' },
    { key: 'Buyer', labelEn: 'Buyer / Trader Portal', labelHi: 'व्यापारी पोर्टल' },
    { key: 'Officer', labelEn: 'Procurement Officer', labelHi: 'सरकारी अधिकारी' },
    { key: 'Operator', labelEn: 'Mandi Center Operator', labelHi: 'मंडी संचालक' },
    { key: 'Quality', labelEn: 'Quality Inspector', labelHi: 'गुणवत्ता निरीक्षक' },
    { key: 'Warehouse', labelEn: 'Warehouse Manager', labelHi: 'गोदाम प्रबंधक' },
    { key: 'Admin', labelEn: 'System Admin', labelHi: 'सिस्टम एडमिन' }
  ];

  const handleNavClick = (key) => {
    if (navigateWithAuth) {
      navigateWithAuth(key);
    } else {
      setCurrentView(key);
    }
  };

  const handlePortalClick = (roleKey) => {
    setIsPortalDropdownOpen(false);
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
    
    // Unauthenticated user clicking a role portal -> set active role and open portal
    setActiveRole(roleKey);
    setCurrentView('portal');
  };

  return (
    <header className="sticky top-0 z-40">
      <nav className={`${highContrast ? 'bg-slate-900 text-yellow-300 border-b border-yellow-500' : 'bg-white/95 text-[#243118] backdrop-blur-md border-b border-[#abbe99]/40 shadow-sm'}`}>
        
        {/* ROW 1: Brand Emblem Logo (Left) & Main Navigation Tabs (Right) */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Modern AAGAM Brand Emblem Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <img
              src={import.meta.env.BASE_URL + 'images/aagam_logo.png'}
              alt="AAGAM - Automated Agricultural Grain & Allocation Management System"
              className="h-11 md:h-12 w-auto object-contain bg-white px-2 py-0.5 rounded-xl border border-[#abbe99]/40 shadow-sm group-hover:scale-[1.02] transition-transform"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 font-extrabold text-xs">
            {mainNavItems.map((nav) => (
              <button
                key={nav.key}
                onClick={() => handleNavClick(nav.key)}
                className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${currentView === nav.key ? 'bg-[#71873f] text-white shadow-sm font-extrabold' : 'text-[#243118] hover:bg-[#f0f4ea] hover:text-[#71873f]'}`}
              >
                {t(nav.labelEn, nav.labelHi)}
              </button>
            ))}

            {/* Role Portals Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors border whitespace-nowrap ${currentView === 'portal' ? 'bg-[#a36627] text-white border-[#a36627]' : 'bg-[#fcfaf7] border-[#abbe99] text-[#243118] hover:bg-[#f0f4ea]'}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t('Role Portals', 'पोर्टल चयन')}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isPortalDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#abbe99] shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[#a36627] uppercase border-b border-[#abbe99]/40">
                    {t('7 Role Portals (Auth Required)', '7 भूमिका पोर्टल (लॉगिन आवश्यक)')}
                  </div>
                  {portalPersonas.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => handlePortalClick(p.key)}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#243118] hover:bg-[#f0f4ea] hover:text-[#71873f] transition-colors flex items-center justify-between"
                    >
                      <span>{t(p.labelEn, p.labelHi)}</span>
                      {activeRole === p.key && currentView === 'portal' && <span className="text-[#71873f] font-mono text-[10px]">ACTIVE</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#71873f] hover:bg-[#f0f4ea] rounded-xl border border-[#abbe99]/50"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#abbe99]/40 bg-white p-4 space-y-2 font-bold text-xs shadow-lg animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2">
              {mainNavItems.map((nav) => (
                <button
                  key={nav.key}
                  onClick={() => {
                    handleNavClick(nav.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left transition-colors ${currentView === nav.key ? 'bg-[#71873f] text-white' : 'bg-[#fcfaf7] text-[#243118] border border-[#abbe99]/60'}`}
                >
                  {t(nav.labelEn, nav.labelHi)}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                handleNavClick('portal');
                setIsMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-[#a36627] text-white font-extrabold flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>{t('Explore 7 Role Portals', '7 भूमिका पोर्टल देखें')}</span>
            </button>

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
                  className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-xs flex items-center gap-1.5"
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
                  className="w-full p-2.5 rounded-xl bg-[#71873f] text-white font-extrabold text-center"
                >
                  {t('Sign In', 'लॉगिन')}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentView('register');
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#a36627] text-white font-extrabold text-center"
                >
                  {t('Register', 'पंजीकरण')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ROW 2: Action Toolbar (Search Bar on LEFT | All Buttons & User Status on RIGHT) */}
        <div className="border-t border-[#abbe99]/40 bg-[#fcfaf7]/90 backdrop-blur-sm px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-3 text-xs font-bold">
            
            {/* Left: Quick Search Bar Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 bg-[#f4efe6] hover:bg-[#e8dfd1] text-[#243118] px-4 py-2 rounded-xl font-semibold border border-[#abbe99]/60 transition-all shadow-inner w-full sm:w-72 md:w-80 lg:w-96 shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-[#71873f]" />
              <span>{t('Search 171 AAGAM services...', '171 सेवाएं खोजें...')}</span>
            </button>

            {/* Right: Grouped Action & Auth Buttons Cluster */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 ml-auto shrink-0 w-full sm:w-auto justify-end">
              
              {/* AI Crop Quality & Market Price Analysis Agent Trigger */}
              {onOpenAiCropAnalyzer && (
                <button
                  onClick={onOpenAiCropAnalyzer}
                  className="flex items-center gap-1.5 bg-[#71873f] hover:bg-[#607433] text-white font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap border border-white/20 group"
                  title={t('AI Crop Quality & Market Price Analysis Agent', 'एआई फसल जांच एवं बाजार भाव')}
                >
                  <Sprout className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>{t('🌾 Check Your Crop', '🌾 फसल जांच करें')}</span>
                </button>
              )}

              {/* Payment Status (Auth Protected) */}
              <button
                onClick={() => openDbtWithAuth ? openDbtWithAuth() : null}
                className="flex items-center gap-1.5 bg-[#f7f2ea] hover:bg-[#e0b87e]/40 text-[#a36627] font-extrabold px-3.5 py-2 rounded-xl border border-[#a36627]/40 transition-all shadow-sm whitespace-nowrap"
                title={t('Check Payment Status (Login Required)', 'भुगतान स्थिति')}
              >
                <Coins className="w-4 h-4 text-[#a36627]" />
                <span>{t('Payment Status', 'भुगतान स्थिति')}</span>
              </button>

              {/* Gate Pass (Auth Protected) */}
              <button
                onClick={() => openGatePassWithAuth ? openGatePassWithAuth() : null}
                className="flex items-center gap-1.5 bg-[#71873f] hover:bg-[#688557] text-white font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-sm whitespace-nowrap"
              >
                <QrCode className="w-4 h-4" />
                <span>{t('Gate Pass', 'गेट पास')}</span>
              </button>

              {/* AI Voice Agent Trigger */}
              {onOpenVoiceAgent && (
                <button
                  onClick={onOpenVoiceAgent}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#f0f4ea] to-[#f4efe6] hover:from-[#e3eed6] hover:to-[#e8dfd1] text-[#243118] font-extrabold px-3.5 py-2 rounded-xl border border-[#71873f]/60 transition-all shadow-xs whitespace-nowrap group"
                  title={t('Talk to AI Voice Agent', 'वॉइस एजेंट')}
                >
                  <div className="relative">
                    <Mic className="w-4 h-4 text-[#71873f] group-hover:scale-110 transition-transform animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
                  </div>
                  <span className="hidden md:inline">{t('Voice Agent', 'वॉइस एजेंट')}</span>
                </button>
              )}

              {/* Helpdesk / Bug Report Trigger */}
              {onOpenHelpdesk && (
                <button
                  onClick={onOpenHelpdesk}
                  className="flex items-center gap-1.5 bg-[#fcfaf7] hover:bg-[#f0f4ea] text-[#637554] hover:text-[#243118] font-extrabold px-3 py-2 rounded-xl border border-[#abbe99]/70 transition-all shadow-xs whitespace-nowrap"
                  title={t('Open Helpdesk & Bug Report', 'हेल्पडेस्क एवं शिकायत')}
                >
                  <LifeBuoy className="w-4 h-4 text-[#a36627]" />
                  <span className="hidden xl:inline">{t('Helpdesk', 'हेल्पडेस्क')}</span>
                </button>
              )}

              {/* Vertical Divider */}
              <div className="h-5 w-[1px] bg-[#abbe99] mx-1 hidden sm:block shrink-0" />

              {/* Authenticated User Status & Logout Confirmation Trigger OR Login/Register Buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {/* User Profile Pill */}
                  <div 
                    onClick={() => handleNavClick('portal')}
                    className="flex items-center gap-2 bg-[#f0f4ea] hover:bg-[#e0e8d6] border border-[#71873f]/40 px-3 py-1.5 rounded-xl cursor-pointer shadow-xs transition-colors"
                    title={t('Go to your Persona Portal', 'अपने पोर्टल पर जाएं')}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#71873f] text-white flex items-center justify-center text-[10px] font-extrabold shadow-inner">
                      {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-[11px] font-extrabold text-[#243118] leading-none truncate max-w-[120px]">
                        {currentUser?.name || 'Gurpreet Singh'}
                      </div>
                      <div className="text-[9px] text-[#71873f] font-mono font-bold leading-tight">
                        {currentUser?.role || activeRole}
                      </div>
                    </div>
                  </div>

                  {/* Sign Out / Logout Button with Confirmation */}
                  <button
                    onClick={onRequestLogout}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold px-3.5 py-2 rounded-xl border border-red-200 transition-all shadow-sm whitespace-nowrap"
                    title={t('Sign Out of Account', 'खाते से लॉग आउट करें')}
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    <span>{t('Sign Out', 'लॉग आउट')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Login */}
                  <button
                    onClick={() => setCurrentView('login')}
                    className={`flex items-center gap-1.5 font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm whitespace-nowrap ${currentView === 'login' ? 'bg-[#71873f] text-white' : 'bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] border border-[#71873f]/40'}`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t('Login', 'लॉगिन')}</span>
                  </button>

                  {/* Register */}
                  <button
                    onClick={() => setCurrentView('register')}
                    className={`flex items-center gap-1.5 font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm whitespace-nowrap ${currentView === 'register' ? 'bg-[#a36627] text-white' : 'bg-[#a36627] hover:bg-[#804d19] text-white'}`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t('Register', 'पंजीकरण')}</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>

      </nav>
    </header>
  );
}
