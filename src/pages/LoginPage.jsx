import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Sprout, 
  Coins, 
  Building2, 
  QrCode, 
  Microscope, 
  Truck, 
  Warehouse, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  UserCheck, 
  KeyRound,
  UserPlus,
  Mail,
  Smartphone,
  Mic,
  Bot
} from 'lucide-react';

export default function LoginPage({ 
  setCurrentView, 
  t, 
  onLoginSuccess, 
  authView = 'login', 
  setAuthView, 
  isAuthGate = false,
  onOpenVoiceAgent 
}) {
  const [loginRole, setLoginRole] = useState('Farmer');
  const [authMethod, setAuthMethod] = useState('google'); // 'google' | 'mobile' | 'staffId'
  const [loginInput, setLoginInput] = useState('+91 98765 43210');
  const [otpStep, setOtpStep] = useState(1);
  const [otpValue, setOtpValue] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Demo Persona Profiles for Quick 1-Click Login
  const demoUsers = {
    Farmer: {
      name: 'Gurpreet Singh',
      role: 'Farmer',
      id: 'PB-FARM-99482',
      mobile: '+91 98765 43210',
      email: 'gurpreet.kisan@gmail.com',
      mandi: 'Karnal Central Grain Yard (HR)',
      state: 'Haryana',
      token: 'GOI-SSO-PB-99482'
    },
    Trader: {
      name: 'Rajesh Agarwal',
      role: 'Buyer',
      id: 'TRAD-DL-88391',
      mobile: '+91 98110 88391',
      email: 'rajesh.trader@agri-corp.in',
      mandi: 'Azadpur Mandi (DL)',
      state: 'Delhi',
      token: 'GOI-SSO-TR-88391'
    },
    Officer: {
      name: 'Dr. Suresh Verma, IAS',
      role: 'Officer',
      id: 'GOI-OFF-55012',
      mobile: '+91 94120 55012',
      email: 'suresh.verma@gov.in',
      mandi: 'FCI Zonal HQ (North)',
      state: 'National',
      token: 'GOI-SSO-OFF-55012'
    },
    Operator: {
      name: 'Amit Kumar',
      role: 'Operator',
      id: 'MANDI-OP-33109',
      mobile: '+91 97180 33109',
      email: 'amit.op@karnalmandi.in',
      mandi: 'Karnal Mandi Gate #02',
      state: 'Haryana',
      token: 'GOI-SSO-OP-33109'
    },
    Quality: {
      name: 'Neha Sharma',
      role: 'Quality',
      id: 'ASSAY-LAB-77281',
      mobile: '+91 99200 77281',
      email: 'neha.lab@agmarknet.gov.in',
      mandi: 'Central Grain Lab (HR)',
      state: 'Haryana',
      token: 'GOI-SSO-LAB-77281'
    },
    Logistics: {
      name: 'Baljit Singh Transport',
      role: 'Transporter',
      id: 'TRUCK-FLEET-44910',
      mobile: '+91 98880 44910',
      email: 'baljit.fleet@transagri.com',
      mandi: 'Northern Agri Freight Corridor',
      state: 'Punjab',
      token: 'GOI-SSO-LOG-44910'
    },
    Warehouse: {
      name: 'Sanjay Godam Management',
      role: 'Warehouse',
      id: 'SILO-MGR-11029',
      mobile: '+91 98100 11029',
      email: 'sanjay.wh@cwcsilos.gov.in',
      mandi: 'CWC Silo Complex #4',
      state: 'Haryana',
      token: 'GOI-SSO-WH-11029'
    }
  };

  const handleQuickLogin = (roleKey) => {
    const user = demoUsers[roleKey] || demoUsers.Farmer;
    if (onLoginSuccess) {
      onLoginSuccess(user);
    } else {
      if (setCurrentView) setCurrentView('home');
    }
  };

  const handleGoogleLogin = () => {
    const selectedProfile = demoUsers[loginRole] || demoUsers.Farmer;
    const googleUser = {
      ...selectedProfile,
      name: selectedProfile.name || 'Gurpreet Singh',
      role: loginRole,
      id: `GOOGLE-${Math.floor(10000 + Math.random() * 90000)}`,
      email: selectedProfile.email || 'user.kisan@gmail.com',
      authMethod: 'Google SSO',
      token: `GOI-GOOGLE-SSO-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (onLoginSuccess) {
      onLoginSuccess(googleUser);
    } else {
      if (setCurrentView) setCurrentView('home');
    }
  };

  const handleCompleteLogin = () => {
    const user = demoUsers[loginRole] || {
      name: 'Gurpreet Singh',
      role: loginRole,
      id: `AAGAM-USER-${Math.floor(10000 + Math.random() * 90000)}`,
      mobile: loginInput,
      email: `${loginRole.toLowerCase()}@aagam-portal.gov.in`,
      mandi: 'Karnal Central Yard (HR)',
      state: 'Haryana',
      token: `GOI-SSO-TOKEN-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (onLoginSuccess) {
      onLoginSuccess(user);
    } else {
      if (setCurrentView) setCurrentView('home');
    }
  };

  return (
    <section className="py-8 md:py-12 bg-[#fcfaf7] min-h-[85vh] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 w-full space-y-6">
        
        {/* Top Header / Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#abbe99]/60 pb-4">
          <div className="flex items-center gap-3">
            {!isAuthGate && (
              <button
                onClick={() => setCurrentView && setCurrentView('home')}
                className="flex items-center gap-2 bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] font-bold px-3.5 py-2 rounded-xl border border-[#71873f]/40 text-xs transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('Back to Home Page', 'मुख्य पृष्ठ पर लौटें')}</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#71873f] animate-ping" />
              <span className="text-xs font-mono font-bold text-[#243118]">
                {t('GOI National Unified Single Sign-On (SSO) Portal', 'भारत सरकार राष्ट्रीय एकल साइन-ऑन (SSO) पोर्टल')}
              </span>
            </div>
          </div>

          {/* Login / Register Toggle Tabs */}
          <div className="flex items-center bg-[#f0f4ea] p-1 rounded-2xl border border-[#abbe99] shadow-sm">
            <button
              onClick={() => setAuthView ? setAuthView('login') : setCurrentView && setCurrentView('login')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                authView === 'login'
                  ? 'bg-[#71873f] text-white shadow-md'
                  : 'text-[#243118] hover:text-[#71873f]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('Sign In / Login', 'साइन इन / लॉगिन')}</span>
            </button>
            <button
              onClick={() => setAuthView ? setAuthView('register') : setCurrentView && setCurrentView('register')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                authView === 'register'
                  ? 'bg-[#a36627] text-white shadow-md'
                  : 'text-[#243118] hover:text-[#a36627]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('New Registration', 'नया पंजीकरण')}</span>
            </button>
          </div>
        </div>

        {/* 1-Click Fast Instant Role Login Bar */}
        <div className="bg-gradient-to-r from-[#f0f4ea] via-white to-[#f4efe6] p-4 rounded-2xl border border-[#abbe99] shadow-md space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#243118]">
              <Sparkles className="w-4 h-4 text-[#a36627]" />
              <span>{t('⚡ Quick 1-Click Persona Instant Login (For Immediate Access):', '⚡ त्वरित 1-क्लिक प्रवेश (तत्काल पोर्टल पहुंच के लिए):')}</span>
            </div>
            <span className="text-[11px] font-mono text-[#71873f] font-bold">
              {t('Select any persona to enter directly', 'सीधे प्रवेश के लिए कोई भी भूमिका चुनें')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
            {[
              { role: 'Farmer', labelEn: 'Farmer (Kisan)', labelHi: 'किसान', icon: Sprout },
              { role: 'Trader', labelEn: 'Trader / Buyer', labelHi: 'व्यापारी', icon: Coins },
              { role: 'Officer', labelEn: 'Govt Officer', labelHi: 'अधिकारी', icon: Building2 },
              { role: 'Operator', labelEn: 'Mandi Operator', labelHi: 'संचालक', icon: QrCode },
              { role: 'Quality', labelEn: 'Quality Lab', labelHi: 'लैब निरीक्षक', icon: Microscope },
              { role: 'Logistics', labelEn: 'Transporter', labelHi: 'ट्रांसपोर्टर', icon: Truck },
              { role: 'Warehouse', labelEn: 'Godam Silo', labelHi: 'गोदाम', icon: Warehouse }
            ].map((item) => {
              const IconC = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => handleQuickLogin(item.role)}
                  className="p-2.5 rounded-xl bg-white hover:text-white border border-[#abbe99]/70 text-[#243118] text-left flex items-center gap-2 hover:bg-[#71873f] transition-all shadow-xs group"
                >
                  <IconC className="w-4 h-4 text-[#a36627] group-hover:text-white shrink-0" />
                  <div className="truncate">
                    <div className="font-extrabold text-[11px] leading-tight truncate">
                      {t(item.labelEn, item.labelHi)}
                    </div>
                    <div className="text-[9px] text-[#637554] group-hover:text-white/80 font-mono">
                      {t('1-Click Enter', 'सीधा प्रवेश')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Sign-In Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Government Agri Banner Context */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl min-h-[480px] flex flex-col justify-between p-8 text-white">
            <img
              src={import.meta.env.BASE_URL + 'images/crop_sunset.png'}
              alt="Indian Agriculture Sunset"
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#243118] via-[#243118]/85 to-[#243118]/40" />

            <div className="relative z-10 space-y-3">
              <span className="bg-[#e0b87e] text-[#243118] text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
                {t('AAGAM PORTAL SSO v2.0', 'आगामी पोर्टल साइन इन v2.0')}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {t('Unified Portal Sign-In for 7 Core Stakeholders', '7 प्रमुख वर्गों के लिए एकीकृत राष्ट्रीय साइन-इन')}
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {t(
                  'Sign in seamlessly using Google SSO, Mobile OTP, or GOI Staff credentials to access real-time MSP procurement, digital weighbridges, e-Auctions, and automated DBT payouts.', 
                  'गूगल साइन-इन, मोबाइल ओटीपी या विभागीय आईडी द्वारा एमएसपी खरीद, ई-नीलामी और डीबीटी भुगतान तक पहुंचें।'
                )}
              </p>
            </div>

            <div className="relative z-10 space-y-3 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white text-[#243118] text-xs font-mono shadow-lg">
              <div className="flex justify-between items-center border-b border-[#abbe99]/40 pb-2">
                <span className="text-[#637554]">GOI SSO Protocol:</span>
                <span className="text-[#71873f] font-bold">MeriPahchan e-Pramaan v2.4</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#abbe99]/40 pb-2">
                <span className="text-[#637554]">Google OAuth 2.0:</span>
                <span className="text-[#243118] font-bold">Enabled & Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#637554]">AI Kisan Voice Agent:</span>
                <button
                  type="button"
                  onClick={onOpenVoiceAgent}
                  className="text-[#71873f] hover:text-[#5b722e] font-bold flex items-center gap-1.5 hover:underline group cursor-pointer"
                  title="Talk to 24x7 AI Voice Agent"
                >
                  <Mic className="w-3.5 h-3.5 text-[#71873f] group-hover:scale-110 transition-transform animate-pulse" />
                  <span>24x7 Active (Start Call)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Multi-Persona Login Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#abbe99] p-6 md:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#243118]">
                  {t('Sign In to Your AAGAM Account', 'अपने आगामी खाते में साइन इन करें')}
                </h3>
                <p className="text-xs text-[#637554] mt-1">
                  {t('Sign in with Google, registered Mobile Number, or Staff ID.', 'गूगल, मोबाइल नंबर या स्टाफ आईडी से लॉगिन करें।')}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-[#f0f4ea] px-3 py-1 rounded-full border border-[#abbe99] text-[11px] font-bold text-[#71873f]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#a36627]" />
                <span>Verified Gateway</span>
              </div>
            </div>

            {/* Persona Role Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#243118]">
                {t('1. Select Your Role Persona:', '1. अपनी भूमिका का चयन करें:')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { role: 'Farmer', labelEn: 'Farmer (Kisan)', labelHi: 'किसान', icon: Sprout },
                  { role: 'Trader', labelEn: 'Buyer / Trader', labelHi: 'व्यापारी', icon: Coins },
                  { role: 'Officer', labelEn: 'Govt Officer', labelHi: 'अधिकारी', icon: Building2 },
                  { role: 'Operator', labelEn: 'Mandi Operator', labelHi: 'मंडी संचालक', icon: QrCode },
                  { role: 'Quality', labelEn: 'Quality Assayer', labelHi: 'गुणवत्ता निरीक्षक', icon: Microscope },
                  { role: 'Logistics', labelEn: 'Transporter', labelHi: 'परिवहनकर्ता', icon: Truck },
                  { role: 'Warehouse', labelEn: 'Godam Manager', labelHi: 'गोदाम प्रबंधक', icon: Warehouse }
                ].map((item) => {
                  const IconC = item.icon;
                  const isSel = loginRole === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => setLoginRole(item.role)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all ${
                        isSel 
                          ? 'bg-[#71873f] text-white border-[#71873f] shadow-md scale-[1.02]' 
                          : 'bg-[#fcfaf7] text-[#243118] border-[#abbe99]/60 hover:border-[#71873f]'
                      }`}
                    >
                      <IconC className={`w-4 h-4 ${isSel ? 'text-white' : 'text-[#a36627]'}`} />
                      <span className="font-extrabold text-[11px] leading-tight">
                        {t(item.labelEn, item.labelHi)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Google Fast 1-Click SSO Button Option */}
            <div className="space-y-2">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-[#f8f9fa] text-[#3c4043] font-bold py-3.5 px-4 rounded-2xl border border-[#dadce0] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 text-xs group"
              >
                {/* Official Google 'G' SVG Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.39 7.37 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="group-hover:text-black font-extrabold text-sm">
                  {t('Continue with Google', 'गूगल से जारी रखें')}
                </span>
              </button>
            </div>

            {/* Divider with OR */}
            <div className="flex items-center gap-3">
              <div className="h-[1px] bg-[#abbe99]/50 flex-1" />
              <span className="text-[11px] font-mono font-bold text-[#637554] uppercase tracking-wider">
                {t('OR LOGIN WITH OTP / STAFF ID', 'या ओटीपी / विभागीय आईडी द्वारा')}
              </span>
              <div className="h-[1px] bg-[#abbe99]/50 flex-1" />
            </div>

            {/* Auth Method Switcher (Mobile OTP / Staff ID / Google) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#243118]">
                {t('2. Select Alternative Sign-In Mode:', '2. अन्य प्रमाणीकरण विधि चुनें:')}
              </label>
              <div className="flex bg-[#f0f4ea] p-1 rounded-xl border border-[#abbe99]/60 text-xs font-bold">
                <button
                  onClick={() => setAuthMethod('mobile')}
                  className={`w-1/2 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMethod === 'mobile' ? 'bg-[#71873f] text-white shadow' : 'text-[#637554]'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile OTP</span>
                </button>
                <button
                  onClick={() => setAuthMethod('staffId')}
                  className={`w-1/2 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMethod === 'staffId' ? 'bg-[#71873f] text-white shadow' : 'text-[#637554]'}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Staff / Email ID</span>
                </button>
              </div>
            </div>

            {/* Login Form Step 1: Input */}
            {otpStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">
                    {authMethod === 'mobile' 
                      ? t('10-Digit Registered Mobile Number:', '10-अंकों का पंजीकृत मोबाइल नंबर:') 
                      : t('Official Staff Email / User ID:', 'विभागीय ईमेल / यूजर आईडी:')}
                  </label>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder={authMethod === 'mobile' ? '+91 98765 43210' : 'officer@aagam.gov.in'}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-inner"
                  />
                </div>

                {authMethod === 'staffId' && (
                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('GOI SSO Password:', 'भारत सरकार पासवर्ड:')}</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono text-[#243118] focus:border-[#71873f] focus:outline-none"
                    />
                  </div>
                )}

                <div className="bg-[#f0f4ea] p-3 rounded-xl border border-[#abbe99] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-[#637554]">Demo Registered User:</span>
                  <button
                    onClick={() => setLoginInput('+91 98765 43210')}
                    className="text-[#71873f] font-bold underline hover:text-[#243118]"
                  >
                    +91 98765 43210 (Gurpreet Singh)
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOtpStep(2)}
                    className="w-full bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>{t(`Send Verification OTP for ${loginRole}`, `${loginRole} के लिए ओटीपी भेजें`)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* OTP Step 2: Verification */}
            {otpStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="bg-[#f0f4ea] p-3.5 rounded-xl border border-[#abbe99] text-center font-mono">
                  <div className="text-[#688557] font-bold">
                    {t(`OTP Sent to Registered Mobile: ${loginInput}`, `पंजीकृत मोबाइल पर 6-अंकों का ओटीपी भेजा गया: ${loginInput}`)}
                  </div>
                  <div className="text-[10px] text-[#637554] mt-0.5">Valid for 05:00 minutes (Test OTP: 849201)</div>
                </div>

                <div className="space-y-1 text-center">
                  <label className="font-bold text-[#243118]">{t('Enter 6-Digit Verification Code:', '6-अंकों का सत्यापन कोड दर्ज करें:')}</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="849201"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="w-48 mx-auto bg-[#fcfaf7] border-2 border-[#71873f] rounded-xl p-3 text-center text-lg tracking-widest font-mono font-extrabold text-[#243118] focus:outline-none block shadow-inner"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOtpStep(1)}
                    className="w-1/3 bg-[#f4efe6] hover:bg-[#e8dfd1] text-[#243118] font-bold py-3 rounded-xl border border-[#abbe99]"
                  >
                    {t('Back', 'पीछे')}
                  </button>
                  <button
                    onClick={() => {
                      setIsAuthenticated(true);
                      setOtpStep(3);
                    }}
                    className="w-2/3 bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('Verify OTP & Sign In', 'ओटीपी सत्यापित करें और लॉगिन करें')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* OTP Step 3: Success Authenticated */}
            {otpStep === 3 && (
              <div className="space-y-4 text-xs text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#f0f4ea] border-2 border-[#71873f] flex items-center justify-center mx-auto text-[#71873f] shadow-md animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-[#243118]">
                    {t(`Welcome, Gurpreet Singh (${loginRole})!`, `स्वागत है, गुरप्रीत सिंह (${loginRole})!`)}
                  </h4>
                  <p className="text-[#688557] font-mono text-xs font-bold">
                    GOI SSO TOKEN: #GOI-SSO-TOKEN-2026-9814
                  </p>
                </div>

                <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#abbe99] text-left space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span>Role Persona:</span>
                    <span className="font-bold text-[#243118]">{loginRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registered Mandi:</span>
                    <span className="font-bold text-[#71873f]">Karnal Central Yard (HR)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session Status:</span>
                    <span className="font-bold text-[#a36627]">ACTIVE & VERIFIED (256-Bit SSL)</span>
                  </div>
                </div>

                <button
                  onClick={handleCompleteLogin}
                  className="w-full bg-[#71873f] hover:bg-[#688557] text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('Enter AAGAM Portal & Continue to Website', 'पोर्टल में प्रवेश करें और आगे बढ़ें')}</span>
                </button>
              </div>
            )}

            {/* Bottom Register Redirection Link */}
            <div className="pt-4 border-t border-[#abbe99]/40 text-center text-xs text-[#637554]">
              <span>{t("Don't have an AAGAM account yet? ", 'क्या आपके पास अभी तक आगामी खाता नहीं है? ')}</span>
              <button
                onClick={() => setAuthView ? setAuthView('register') : setCurrentView && setCurrentView('register')}
                className="font-extrabold text-[#a36627] hover:underline"
              >
                {t('Register New Stakeholder Profile →', 'नया हितधारक पंजीकरण करें →')}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
