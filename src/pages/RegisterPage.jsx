import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Sprout, 
  Coins, 
  Truck, 
  Warehouse, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  QrCode, 
  Download, 
  Lock, 
  UserPlus, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  UserCheck,
  Loader2
} from 'lucide-react';
import { signInWithGoogle } from '../services/firebase';

export default function RegisterPage({ 
  setCurrentView, 
  t, 
  onLoginSuccess, 
  authView = 'register', 
  setAuthView, 
  isAuthGate = false 
}) {
  const [regStep, setRegStep] = useState(1);
  const [regRole, setRegRole] = useState('Farmer');
  const [regForm, setRegForm] = useState({
    fullName: 'Gurpreet Singh',
    fatherName: 'Harjit Singh',
    mobile: '+91 98765 43210',
    aadhaar: '9948-2019-4827',
    pan: 'ABCPS9948K',
    state: 'Punjab',
    district: 'Ludhiana',
    mandi: 'Khanna Grain Market',
    landKhasra: 'Khasra #42/18-A',
    bankAccount: '394820194827',
    ifsc: 'SBIN0004829',
    mandiLicense: 'LIC-PB-2026-9921',
    vehicleNo: 'PB-10-CZ-4829',
    declaration: true,
    regId: ''
  });
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleRegister = async () => {
    setAuthLoading(true);
    try {
      const res = await signInWithGoogle(regRole);
      if (res.success && res.user) {
        if (onLoginSuccess) {
          onLoginSuccess({
            ...res.user,
            role: regRole,
            aadhaar: regForm.aadhaar,
            mandi: regForm.mandi,
            state: regForm.state
          });
        } else if (setCurrentView) {
          setCurrentView('home');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFinishAndEnter = () => {
    const newUser = {
      name: regForm.fullName || 'Gurpreet Singh',
      role: regRole,
      id: regForm.regId || `AAGAM-REG-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      aadhaar: regForm.aadhaar,
      mobile: regForm.mobile,
      mandi: regForm.mandi,
      state: regForm.state,
      authMethod: 'Firebase Registered',
      token: `GOI-REG-TOKEN-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (onLoginSuccess) {
      onLoginSuccess(newUser);
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
              <span className="w-2.5 h-2.5 rounded-full bg-[#a36627] animate-ping" />
              <span className="text-xs font-mono font-bold text-[#243118]">
                {t('GOI National Stakeholder Registration Portal', 'भारत सरकार राष्ट्रीय हितधारक पंजीकरण पोर्टल')}
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

        {/* Stepper Progress Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#abbe99] shadow-md flex items-center justify-between gap-2 max-w-4xl mx-auto">
          {[
            { step: 1, label: t('1. Role', '1. भूमिका') },
            { step: 2, label: t('2. Personal & KYC', '2. व्यक्तिगत एवं आधार') },
            { step: 3, label: t('3. Land / Mandi', '3. भूमि / मंडी') },
            { step: 4, label: t('4. Bank DBT', '4. बैंक खाता') },
            { step: 5, label: t('5. Digital ID Pass', '5. पहचान पत्र') }
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-extrabold transition-all ${
                  regStep === item.step
                    ? 'bg-[#a36627] text-white ring-4 ring-[#a36627]/20 shadow-md'
                    : regStep > item.step
                    ? 'bg-[#71873f] text-white'
                    : 'bg-[#f0f4ea] text-[#637554] border border-[#abbe99]'
                }`}
              >
                {regStep > item.step ? <CheckCircle2 className="w-4 h-4" /> : item.step}
              </div>
              <span className={`text-[11px] font-bold hidden sm:inline ${regStep === item.step ? 'text-[#a36627]' : regStep > item.step ? 'text-[#71873f]' : 'text-[#637554]'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main Registration Container */}
        <div className="bg-white rounded-3xl border border-[#abbe99] p-6 md:p-10 shadow-xl max-w-4xl mx-auto space-y-6">
          
          {/* Step 1: Category */}
          {regStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#a36627] uppercase tracking-wider">STEP 01 OF 05</span>
                <h2 className="text-2xl font-extrabold text-[#243118] mt-1">
                  {t('Select Your Stakeholder Registration Category', 'अपनी पंजीकरण श्रेणी चुनें')}
                </h2>
                <p className="text-xs text-[#637554] mt-1">
                  {t('Select how you participate in the Indian agricultural grain supply chain.', 'चुनें कि आप आपूर्ति श्रृंखला में कैसे भाग लेते हैं।')}
                </p>
              </div>

              {/* Google Fast 1-Click Registration */}
              <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[#243118]">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t('Instant Registration via Google (Firebase SSO):', 'गूगल द्वारा त्वरित पंजीकरण (फायरबेस):')}</span>
                  </div>
                  <div className="text-[11px] text-[#637554] mt-0.5">
                    {t('One-click verification with Google security & automatic portal setup.', 'गूगल सुरक्षा एवं स्वतः पोर्टल सेटअप के साथ 1-क्लिक सत्यापन।')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  disabled={authLoading}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-300 text-xs flex items-center justify-center gap-2.5 shadow-sm shrink-0 cursor-pointer"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.39 7.37 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                  )}
                  <span>{authLoading ? t('Verifying...', 'सत्यापित हो रहा है...') : t('Sign up with Google', 'गूगल से रजिस्टर करें')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { role: 'Farmer', titleEn: 'Farmer / Grower (Kisan)', titleHi: 'किसान', descEn: 'Register agricultural land for QR slot booking & 48h direct bank transfer.', descHi: 'स्लॉट बुकिंग और 48 घंटे के भुगतान के लिए भूमि का पंजीकरण करें।', icon: Sprout },
                  { role: 'Trader', titleEn: 'Mandi Commission Buyer (Vyapari)', titleHi: 'मंडी व्यापारी', descEn: 'Apply for e-NAM pan-India digital bidding license & escrow wallet.', descHi: 'ई-नाम राष्ट्रव्यापी ई-नीलामी लाइसेंस प्राप्त करें।', icon: Coins },
                  { role: 'Transporter', titleEn: 'Logistics Transport Provider', titleHi: 'परिवहनकर्ता', descEn: 'Register truck fleets for e-Waybill transit passes & FCI contracts.', descHi: 'ई-वेबिल और एफसीआई अनुबंधों के लिए ट्रक पंजीकृत करें।', icon: Truck },
                  { role: 'Warehouse', titleEn: 'Godam & Silo Manager', titleHi: 'गोदाम प्रबंधक', descEn: 'Connect warehouse facilities for Electronic Negotiable Receipts (e-NWR).', descHi: 'इलेक्ट्रॉनिक वेयरहाउस रसीदों के लिए गोदाम कनेक्ट करें।', icon: Warehouse }
                ].map((cat) => {
                  const IconC = cat.icon;
                  const isSel = regRole === cat.role;
                  return (
                    <div
                      key={cat.role}
                      onClick={() => setRegRole(cat.role)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${isSel ? 'bg-[#f0f4ea] border-[#71873f] shadow-md' : 'bg-[#fcfaf7] border-[#abbe99]/60 hover:border-[#71873f]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#abbe99] flex items-center justify-center text-[#71873f]">
                          <IconC className="w-5 h-5" />
                        </div>
                        {isSel && <CheckCircle2 className="w-5 h-5 text-[#71873f]" />}
                      </div>
                      <h4 className="font-extrabold text-sm text-[#243118]">
                        {t(cat.titleEn, cat.titleHi)}
                      </h4>
                      <p className="text-xs text-[#637554] leading-relaxed">
                        {t(cat.descEn, cat.descHi)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setRegStep(2)}
                className="w-full bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>{t('Continue to Step 2: Personal & Aadhaar KYC Details', 'चरण 2 पर जाएं: व्यक्तिगत विवरण')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Personal & KYC Details */}
          {regStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#a36627] uppercase tracking-wider">STEP 02 OF 05</span>
                <h2 className="text-2xl font-extrabold text-[#243118] mt-1">
                  {t(`Personal & Identity KYC for ${regRole}`, `${regRole} व्यक्तिगत एवं पहचान विवरण`)}
                </h2>
                <p className="text-xs text-[#637554] mt-1">
                  {t('Details will be verified against UIDAI Aadhaar database.', 'विवरण का यूआईडीएआई आधार डेटाबेस से सत्यापन किया जाएगा।')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Full Name (as on Aadhaar):', 'पूरा नाम (आधार के अनुसार):')}</label>
                  <input
                    type="text"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t("Father's / Spouse's Name:", 'पिता/पति का नाम:')}</label>
                  <input
                    type="text"
                    value={regForm.fatherName}
                    onChange={(e) => setRegForm({ ...regForm, fatherName: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Mobile Number (for OTP):', 'मोबाइल नंबर:')}</label>
                  <input
                    type="text"
                    value={regForm.mobile}
                    onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('12-Digit Aadhaar Number:', '12-अंकों का आधार नंबर:')}</label>
                  <input
                    type="text"
                    value={regForm.aadhaar}
                    onChange={(e) => setRegForm({ ...regForm, aadhaar: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRegStep(1)}
                  className="w-1/3 bg-[#f4efe6] text-[#243118] font-bold py-3 rounded-xl border border-[#abbe99]"
                >
                  {t('Back', 'पीछे')}
                </button>
                <button
                  onClick={() => setRegStep(3)}
                  className="w-2/3 bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{t('Proceed to Operational Details', 'आगे बढ़ें: कार्यस्थल विवरण')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location / Land / Fleet Details */}
          {regStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#a36627] uppercase tracking-wider">STEP 03 OF 05</span>
                <h2 className="text-2xl font-extrabold text-[#243118] mt-1">
                  {t('Location & Operational Asset Mapping', 'स्थान एवं परिचालन संपत्ति विवरण')}
                </h2>
                <p className="text-xs text-[#637554] mt-1">
                  {t('Link your mandi cluster, land records, or logistics assets.', 'अपने मंडी क्लस्टर या वाहन का विवरण दर्ज करें।')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('State:', 'राज्य:')}</label>
                  <input
                    type="text"
                    value={regForm.state}
                    onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('District:', 'जिला:')}</label>
                  <input
                    type="text"
                    value={regForm.district}
                    onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Assigned Mandi Yard / APMC:', 'संबंधित मंडी यार्ड:')}</label>
                  <input
                    type="text"
                    value={regForm.mandi}
                    onChange={(e) => setRegForm({ ...regForm, mandi: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">
                    {regRole === 'Farmer' ? t('Land Khasra / Murabba Number:', 'खसरा / मुरब्बा नंबर:') : regRole === 'Transporter' ? t('Vehicle Fleet Reg No:', 'वाहन पंजीकरण नंबर:') : t('APMC Trade License No:', 'व्यापार लाइसेंस नंबर:')}
                  </label>
                  <input
                    type="text"
                    value={regRole === 'Farmer' ? regForm.landKhasra : regRole === 'Transporter' ? regForm.vehicleNo : regForm.mandiLicense}
                    onChange={(e) => setRegForm({ ...regForm, landKhasra: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRegStep(2)}
                  className="w-1/3 bg-[#f4efe6] text-[#243118] font-bold py-3 rounded-xl border border-[#abbe99]"
                >
                  {t('Back', 'पीछे')}
                </button>
                <button
                  onClick={() => setRegStep(4)}
                  className="w-2/3 bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{t('Proceed to Step 4: Bank DBT Setup', 'आगे बढ़ें: बैंक डीबीटी खाता')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Bank Account & DBT */}
          {regStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#a36627] uppercase tracking-wider">STEP 04 OF 05</span>
                <h2 className="text-2xl font-extrabold text-[#243118] mt-1">
                  {t('Bank Account & Direct Benefit Transfer (DBT)', 'बैंक खाता एवं डीबीटी लिंकिंग')}
                </h2>
                <p className="text-xs text-[#637554] mt-1">
                  {t('MSP procurement payments are dispatched directly via PFMS within 48 hours.', 'एमएसपी खरीद का भुगतान सीधे 48 घंटे में पीएफएमएस द्वारा किया जाता है।')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Bank Account Number:', 'बैंक खाता संख्या:')}</label>
                  <input
                    type="text"
                    value={regForm.bankAccount}
                    onChange={(e) => setRegForm({ ...regForm, bankAccount: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono font-bold text-[#243118]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Bank IFSC Code:', 'बैंक आईएफएससी कोड:')}</label>
                  <input
                    type="text"
                    value={regForm.ifsc}
                    onChange={(e) => setRegForm({ ...regForm, ifsc: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono font-bold text-[#243118]"
                  />
                </div>
              </div>

              <div className="bg-[#f0f4ea] p-4 rounded-xl border border-[#abbe99] text-xs flex items-center gap-3">
                <input
                  type="checkbox"
                  id="dec"
                  checked={regForm.declaration}
                  onChange={(e) => setRegForm({ ...regForm, declaration: e.target.checked })}
                  className="w-4 h-4 text-[#71873f] rounded focus:ring-0"
                />
                <label htmlFor="dec" className="text-[#243118] font-medium leading-relaxed">
                  {t('I hereby certify that the information provided is accurate and grant consent for Aadhaar e-KYC verification under GOI Agri Guidelines.', 'मैं प्रमाणित करता हूं कि दी गई जानकारी सही है और आधार ई-केवाईसी सत्यापन की सहमति देता हूं।')}
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRegStep(3)}
                  className="w-1/3 bg-[#f4efe6] text-[#243118] font-bold py-3 rounded-xl border border-[#abbe99]"
                >
                  {t('Back', 'पीछे')}
                </button>
                <button
                  onClick={() => {
                    setRegForm(prev => ({ ...prev, regId: `AAGAM-REG-2026-${Math.floor(100000 + Math.random() * 900000)}` }));
                    setRegStep(5);
                  }}
                  className="w-2/3 bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('Submit Registration & Issue Digital ID', 'पंजीकरण जमा करें और पहचान पत्र जारी करें')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Digital ID Card Issued */}
          {regStep === 5 && (
            <div className="space-y-6 text-xs text-center">
              <div className="bg-[#f0f4ea] text-[#688557] p-3 rounded-xl border border-[#abbe99] font-bold">
                {t('AAGAM Stakeholder Digital ID Card Issued Successfully!', 'डिजिटल पहचान पत्र सफलतापूर्वक जारी किया गया!')}
              </div>

              <div className="bg-gradient-to-br from-[#243118] via-[#334423] to-[#243118] p-6 rounded-2xl border-2 border-[#e0b87e] text-white shadow-2xl space-y-4 max-w-md mx-auto relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-white/20 pb-3">
                  <div className="text-left">
                    <span className="font-extrabold text-lg text-[#e0b87e] tracking-wider">AAGAM ID</span>
                    <div className="text-[10px] text-slate-300">Govt of India Procurement Pass</div>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#e0b87e] text-[#243118] font-bold flex items-center justify-center text-xs">
                    GOI
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left font-mono">
                  <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0">
                    <QrCode className="w-full h-full text-[#243118]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-extrabold text-white">{regForm.fullName}</div>
                    <div className="text-xs text-[#e0b87e] font-bold">{regForm.regId}</div>
                    <div className="text-[10px] text-slate-300">{regForm.mandi} ({regForm.state})</div>
                    <div className="text-[10px] text-[#e0b87e] font-bold">ROLE: {regRole}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 text-[10px] font-mono text-slate-300 flex justify-between">
                  <span>STATUS: ACTIVE & VERIFIED</span>
                  <span>DBT LINKED</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => alert(t('Downloading Digital AAGAM ID Pass PDF...', 'डिजिटल आईडी रसीद पीडीएफ डाउनलोड हो रही है...'))}
                  className="w-full sm:w-1/2 bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('Download Digital ID (PDF)', 'डिजिटल आईडी डाउनलोड करें')}</span>
                </button>

                <button
                  onClick={handleFinishAndEnter}
                  className="w-full sm:w-1/2 bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3 rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('Enter Authenticated Portal', 'प्रमाणित पोर्टल में प्रवेश करें')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Link to Sign In */}
          {regStep < 5 && (
            <div className="pt-4 border-t border-[#abbe99]/40 text-center text-xs text-[#637554]">
              <span>{t('Already registered on AAGAM? ', 'क्या आपके पास पहले से खाता है? ')}</span>
              <button
                onClick={() => setAuthView ? setAuthView('login') : setCurrentView && setCurrentView('login')}
                className="font-extrabold text-[#71873f] hover:underline"
              >
                {t('Sign In to Your Account →', 'अपने खाते में साइन इन करें →')}
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
