import React, { useState, useEffect } from 'react';
import TopHeader from './components/layout/TopHeader';
import Navbar from './components/layout/Navbar';
import LiveTicker from './components/layout/LiveTicker';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import EAuctionPage from './pages/EAuctionPage';
import ProcurementPage from './pages/ProcurementPage';
import LogisticsPage from './pages/LogisticsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PersonaPortalPage from './pages/PersonaPortalPage';
import FarmerPortalPage from './pages/portals/FarmerPortalPage';
import BuyerPortalPage from './pages/portals/BuyerPortalPage';
import OfficerPortalPage from './pages/portals/OfficerPortalPage';
import OperatorPortalPage from './pages/portals/OperatorPortalPage';
import QualityPortalPage from './pages/portals/QualityPortalPage';
import WarehousePortalPage from './pages/portals/WarehousePortalPage';
import AdminPortalPage from './pages/portals/AdminPortalPage';
import GatePassModal from './components/modals/GatePassModal';
import PaymentDbtModal from './components/modals/PaymentDbtModal';
import QuickSearchModal from './components/modals/QuickSearchModal';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal';
import AuthRequiredModal from './components/modals/AuthRequiredModal';
import HelpdeskModal from './components/modals/HelpdeskModal';
import VoiceAgentModal from './components/voice/VoiceAgentModal';
import SuccessToast from './components/common/SuccessToast';
import { LifeBuoy, Mic, Bot } from 'lucide-react';

export default function App() {
  // System & Accessibility States
  const [fontSize, setFontSize] = useState('md'); // 'sm' | 'md' | 'lg'
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' only

  // Authentication State (Saved in LocalStorage for seamless persistence)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aagam_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const isAuthenticated = !!currentUser;
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  // Page Routing State (Default: 'home' for front landing page)
  const [currentView, setCurrentView] = useState('home');
  const [activeRole, setActiveRole] = useState(() => currentUser?.role || 'Farmer');

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Modals Visibility State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isDbtModalOpen, setIsDbtModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isAuthRequiredModalOpen, setIsAuthRequiredModalOpen] = useState(false);
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [targetPortalName, setTargetPortalName] = useState('Portal');
  const [pendingRedirect, setPendingRedirect] = useState(null);

  // Global Notification Feedback State
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    tokenNo: '',
    type: 'success'
  });

  const triggerSuccessNotification = ({ title, message, tokenNo }) => {
    setNotification({
      isOpen: true,
      title: title || 'Process Completed Successfully!',
      message: message || 'Your request has been verified and recorded in the national database.',
      tokenNo: tokenNo || '',
      type: 'success'
    });
  };

  // Slot Booking Details State with State, District, Mandi, and Custom Crop Support
  const [slotStep, setSlotStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    farmerId: currentUser?.id || 'PB-FARM-99482',
    state: 'Haryana',
    district: 'Karnal',
    mandi: 'Karnal Central Grain Yard',
    customMandi: '',
    commodity: 'Wheat (Sharbati)',
    customCommodity: '',
    isCustomCrop: false,
    estimatedQty: '180',
    date: '2026-08-28',
    timeSlot: '09:00 AM - 11:00 AM',
    lane: 'Lane 04 - Weighbridge A',
    qrGenerated: false,
    tokenNo: ''
  });

  // Translation Helper Function (Strict English | हिन्दी)
  const t = (enText, hiText) => (language === 'hi' ? hiText : enText);

  // Auth Guard Helper: Intercepts navigation to any protected portal or workflow
  const navigateWithAuth = (viewName, roleKey = null) => {
    // Public Views: 'home', 'login', 'register'
    if (viewName === 'home') {
      setCurrentView('home');
      return;
    }
    if (viewName === 'login' || viewName === 'register') {
      setAuthView(viewName);
      setCurrentView(viewName);
      return;
    }

    // Portal & Protected Views Map
    const portalTitles = {
      marketplace: t('Fasal Marketplace Portal', 'फसल बाजार पोर्टल'),
      prices: t('MSP Price Directory', 'एमएसपी मूल्य सूची'),
      eauction: t('e-NAM E-Auction Platform', 'ई-नीलामी प्लेटफॉर्म'),
      procurement: t('Government Procurement Portal', 'खरीद केंद्र पोर्टल'),
      logistics: t('Agri Freight Logistics Portal', 'लॉजिस्टिक्स पोर्टल'),
      analytics: t('National Agri Analytics Portal', 'राष्ट्रीय कृषि विश्लेषण'),
      portal: roleKey ? t(`${roleKey} Persona Portal`, `${roleKey} हितधारक पोर्टल`) : t('Stakeholder Persona Portal', 'हितधारक पोर्टल')
    };

    if (isAuthenticated) {
      if (roleKey) setActiveRole(roleKey);
      setCurrentView(viewName);
    } else {
      // Unauthenticated visitor trying to access a portal -> Prompt with Login / Register Modal
      setTargetPortalName(portalTitles[viewName] || t('Stakeholder Portal', 'हितधारक पोर्टल'));
      setPendingRedirect({ view: viewName, role: roleKey });
      setIsAuthRequiredModalOpen(true);
    }
  };

  // Auth-Protected Gate Pass Opening
  const openGatePassWithAuth = () => {
    if (isAuthenticated) {
      setSlotStep(1);
      setIsSlotModalOpen(true);
    } else {
      setTargetPortalName(t('Gate Pass & Slot Booking Portal', 'गेट पास एवं स्लॉट बुकिंग पोर्टल'));
      setPendingRedirect({ openGatePass: true });
      setIsAuthRequiredModalOpen(true);
    }
  };

  // Auth-Protected DBT Tracker Opening
  const openDbtWithAuth = () => {
    if (isAuthenticated) {
      setIsDbtModalOpen(true);
    } else {
      setTargetPortalName(t('Direct Benefit Transfer (DBT) Payment Tracker', 'डीबीटी भुगतान ट्रैकर'));
      setPendingRedirect({ openDbt: true });
      setIsAuthRequiredModalOpen(true);
    }
  };

  // Handle Successful Login / Registration
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setActiveRole(userData.role || 'Farmer');
    try {
      localStorage.setItem('aagam_auth_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }

    setIsAuthRequiredModalOpen(false);

    triggerSuccessNotification({
      title: t(`Welcome, ${userData.name || 'User'}!`, `स्वागत है, ${userData.name || 'उपयोगकर्ता'}!`),
      message: t(`Signed in successfully as ${userData.role || activeRole} via GOI Unified SSO.`, `भारत सरकार एसएसओ द्वारा ${userData.role || activeRole} के रूप में सफलतापूर्वक लॉगिन किया गया।`),
      tokenNo: userData.token || userData.id
    });

    // Route to pending portal if user was trying to access one
    if (pendingRedirect?.view) {
      if (pendingRedirect.role) setActiveRole(pendingRedirect.role);
      setCurrentView(pendingRedirect.view);
    } else if (pendingRedirect?.openGatePass) {
      setCurrentView('home');
      setSlotStep(1);
      setIsSlotModalOpen(true);
    } else if (pendingRedirect?.openDbt) {
      setCurrentView('home');
      setIsDbtModalOpen(true);
    } else {
      setCurrentView('home');
    }

    setPendingRedirect(null);
  };

  // Request Logout (Triggers confirmation modal)
  const handleRequestLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  // Confirm and Execute Logout
  const handleConfirmLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('aagam_auth_user');
    } catch (e) {
      console.error(e);
    }
    setIsLogoutConfirmOpen(false);
    setCurrentView('home');
    setAuthView('login');
  };

  // Open Full Login / Register Page from Modal
  const handleOpenFullAuth = (authType) => {
    setAuthView(authType);
    setCurrentView(authType);
  };

  // Keyboard shortcut listener for Quick Search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll to top on page view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, activeRole, authView]);

  // Font scale CSS wrapper class
  const fontScaleClass = fontSize === 'sm' ? 'font-scale-sm' : fontSize === 'lg' ? 'font-scale-lg' : 'font-scale-md';

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-slate-950 text-yellow-300' : 'bg-[#fcfaf7] text-[#243118]'} ${fontScaleClass} transition-colors duration-200`}>
      
      {/* Top Header Bar with Language & Accessibility */}
      <TopHeader
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        t={t}
      />

      {/* Main Navbar with Protected Portal Navigation & User Profile */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        navigateWithAuth={navigateWithAuth}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        highContrast={highContrast}
        setIsSearchOpen={setIsSearchOpen}
        openDbtWithAuth={openDbtWithAuth}
        openGatePassWithAuth={openGatePassWithAuth}
        onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onRequestLogout={handleRequestLogout}
        t={t}
      />

      {/* Live MSP Commodity Feed Ticker */}
      <LiveTicker highContrast={highContrast} t={t} />

      {/* Page View Router: Shows Home page by default on front landing */}
      {currentView === 'home' && (
        <HomePage
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          highContrast={highContrast}
          setIsDbtModalOpen={setIsDbtModalOpen}
          setSlotStep={setSlotStep}
          setIsSlotModalOpen={setIsSlotModalOpen}
          setIsSearchOpen={setIsSearchOpen}
          setCurrentView={setCurrentView}
          navigateWithAuth={navigateWithAuth}
          openGatePassWithAuth={openGatePassWithAuth}
          openDbtWithAuth={openDbtWithAuth}
          setBookingDetails={setBookingDetails}
          language={language}
          isAuthenticated={isAuthenticated}
          t={t}
        />
      )}

      {currentView === 'marketplace' && (
        <MarketplacePage
          setCurrentView={setCurrentView}
          setIsDbtModalOpen={openDbtWithAuth}
          t={t}
        />
      )}

      {currentView === 'prices' && (
        <HomePage
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          highContrast={highContrast}
          setIsDbtModalOpen={setIsDbtModalOpen}
          setSlotStep={setSlotStep}
          setIsSlotModalOpen={setIsSlotModalOpen}
          setIsSearchOpen={setIsSearchOpen}
          setCurrentView={setCurrentView}
          navigateWithAuth={navigateWithAuth}
          openGatePassWithAuth={openGatePassWithAuth}
          openDbtWithAuth={openDbtWithAuth}
          setBookingDetails={setBookingDetails}
          language={language}
          isAuthenticated={isAuthenticated}
          t={t}
        />
      )}

      {currentView === 'eauction' && (
        <EAuctionPage
          setCurrentView={setCurrentView}
          currentUser={currentUser}
          triggerSuccessNotification={triggerSuccessNotification}
          t={t}
        />
      )}

      {currentView === 'procurement' && (
        <ProcurementPage
          setCurrentView={setCurrentView}
          setSlotStep={setSlotStep}
          setIsSlotModalOpen={openGatePassWithAuth}
          t={t}
        />
      )}

      {currentView === 'logistics' && (
        <LogisticsPage
          setCurrentView={setCurrentView}
          t={t}
        />
      )}

      {currentView === 'analytics' && (
        <AnalyticsPage
          setCurrentView={setCurrentView}
          t={t}
        />
      )}



      {currentView === 'portal' && (
        <div>
          {/* Persona Role Switcher Header Bar */}
          <div className="bg-[#243118] text-white py-2 px-4 border-b border-[#abbe99]/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">Active Role Portal:</span>
              <span className="bg-[#71873f] text-white font-extrabold px-2.5 py-0.5 rounded-md">{activeRole}</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { key: 'Farmer', label: '🌾 Farmer' },
                { key: 'Buyer', label: '💼 Buyer' },
                { key: 'Officer', label: '🏛️ Officer' },
                { key: 'Operator', label: '🏪 Operator' },
                { key: 'Quality', label: '🔬 Quality' },
                { key: 'Warehouse', label: '🏭 Warehouse' },
                { key: 'Admin', label: '⚙️ Admin' },
                { key: 'Navigator', label: '📑 171 Navigator' },
              ].map(r => (
                <button
                  key={r.key}
                  onClick={() => setActiveRole(r.key)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${activeRole === r.key ? 'bg-amber-600 text-white font-bold' : 'bg-white/10 hover:bg-white/20 text-slate-200'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {activeRole === 'Farmer' && (
            <FarmerPortalPage
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              openGatePassWithAuth={openGatePassWithAuth}
              t={t}
            />
          )}
          {activeRole === 'Buyer' && (
            <BuyerPortalPage
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              t={t}
            />
          )}
          {activeRole === 'Officer' && (
            <OfficerPortalPage
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              t={t}
            />
          )}
          {activeRole === 'Operator' && (
            <OperatorPortalPage
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              t={t}
            />
          )}
          {activeRole === 'Quality' && (
            <QualityPortalPage
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              t={t}
            />
          )}
          {activeRole === 'Warehouse' && (
            <WarehousePortalPage
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              t={t}
            />
          )}
          {activeRole === 'Admin' && (
            <AdminPortalPage
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              t={t}
            />
          )}
          {activeRole === 'Navigator' && (
            <PersonaPortalPage
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
              t={t}
            />
          )}
        </div>
      )}

      {currentView === 'login' && (
        <LoginPage
          setCurrentView={setCurrentView}
          t={t}
          onLoginSuccess={handleLoginSuccess}
          authView={authView}
          setAuthView={setAuthView}
          isAuthGate={false}
          onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          setCurrentView={setCurrentView}
          t={t}
          onLoginSuccess={handleLoginSuccess}
          authView={authView}
          setAuthView={setAuthView}
          isAuthGate={false}
          onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        />
      )}

      {/* Comprehensive GOI 14-Category Directory Footer */}
      <Footer
        highContrast={highContrast}
        language={language}
        onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        t={t}
      />

      {/* Modals */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        t={t}
      />

      <GatePassModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        slotStep={slotStep}
        setSlotStep={setSlotStep}
        bookingDetails={bookingDetails}
        setBookingDetails={setBookingDetails}
        triggerSuccessNotification={triggerSuccessNotification}
        t={t}
      />

      <PaymentDbtModal
        isOpen={isDbtModalOpen}
        onClose={() => setIsDbtModalOpen(false)}
        t={t}
      />

      {/* Logout Confirmation Dialog Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        currentUser={currentUser}
        t={t}
      />

      {/* Authentication Required Guard Modal */}
      <AuthRequiredModal
        isOpen={isAuthRequiredModalOpen}
        onClose={() => setIsAuthRequiredModalOpen(false)}
        targetPortalName={targetPortalName}
        onLoginSuccess={handleLoginSuccess}
        onOpenFullAuth={handleOpenFullAuth}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        t={t}
      />

      {/* Official GOI Citizen Helpdesk & Bug Redressal Modal */}
      <HelpdeskModal
        isOpen={isHelpdeskOpen}
        onClose={() => setIsHelpdeskOpen(false)}
        currentUser={currentUser}
        triggerSuccessNotification={triggerSuccessNotification}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        t={t}
      />

      {/* Official AAGAM AI Voice Agent Modal (ElevenLabs ConvAI Integration) */}
      <VoiceAgentModal
        isOpen={isVoiceAgentOpen}
        onClose={() => setIsVoiceAgentOpen(false)}
        language={language}
        t={t}
      />

      {/* Floating 24x7 Support Dock: AI Voice Agent & Helpdesk Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        
        {/* Primary AI Voice Agent Trigger Widget */}
        <button
          onClick={() => setIsVoiceAgentOpen(true)}
          className="bg-gradient-to-r from-[#71873f] via-[#5c6e33] to-[#40541d] hover:from-[#5e7033] hover:to-[#354616] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-[#71873f]/60 border-2 border-white/90 transition-all flex items-center gap-2.5 group active:scale-95 cursor-pointer"
          title="Talk to AAGAM AI Voice Agent (ElevenLabs 24x7)"
        >
          <div className="relative flex items-center justify-center">
            <Mic className="w-5 h-5 text-[#e0b87e] group-hover:scale-110 transition-transform animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -top-1 -right-1 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -top-1 -right-1" />
          </div>
          <span className="hidden sm:inline font-extrabold text-xs tracking-wide">
            {t('AI Voice Agent (कृषि वाणी)', 'किसान वॉइस एजेंट')}
          </span>
          <span className="bg-[#e0b87e] text-[#1a2512] text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md hidden md:inline">
            24x7
          </span>
        </button>

        {/* Citizen Helpdesk Trigger */}
        <button
          onClick={() => setIsHelpdeskOpen(true)}
          className="bg-[#a36627] hover:bg-[#804d19] text-white p-3 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-[#a36627]/50 border-2 border-white/80 transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
          title="Open Helpdesk & Grievance Report"
        >
          <LifeBuoy className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          <span className="hidden lg:inline font-bold text-xs tracking-wide">
            {t('Helpdesk', 'हेल्पडेस्क')}
          </span>
        </button>

      </div>

      {/* Floating System-Wide Success Toast Notification */}
      <SuccessToast
        notification={notification}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
