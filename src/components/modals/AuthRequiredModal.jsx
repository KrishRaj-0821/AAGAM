import React, { useState } from 'react';
import { 
  Lock, 
  X, 
  Sprout, 
  Coins, 
  Building2, 
  QrCode, 
  Microscope, 
  Truck, 
  Warehouse, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  UserPlus, 
  LogIn,
  Mic,
  Zap,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';

export default function AuthRequiredModal({
  isOpen,
  onClose,
  targetPortalName = 'Portal',
  onLoginSuccess,
  onOpenFullAuth,
  onOpenVoiceAgent,
  t
}) {
  const [loadingRole, setLoadingRole] = useState(null);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleFastLogin = async (roleKey) => {
    setLoadingRole(roleKey);
    setAuthError('');
    try {
      const res = await api.auth.demoLogin(roleKey);
      if (res?.data?.user) {
        if (onLoginSuccess) {
          onLoginSuccess(res.data.user);
        }
        onClose();
        return;
      }
      throw new Error(res?.message || 'Authentication failed');
    } catch (err) {
      console.error("Backend demo login failed:", err);
      setAuthError(err.message || 'Backend authentication failed. Server may be in production mode without demo auth enabled.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full border border-[#abbe99] shadow-2xl space-y-6 text-[#243118] relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#637554] hover:bg-[#f0f4ea] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Lock Icon & Target Portal */}
        <div className="flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#e0b87e]/30 border-2 border-[#a36627] text-[#a36627] flex items-center justify-center shrink-0 p-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#a36627] bg-[#f7f2ea] px-2.5 py-0.5 rounded-full border border-[#a36627]/30">
              {t('Demo Authentication / Stakeholder Login', 'डेमो प्रमाणीकरण / हितधारक लॉगिन')}
            </span>
            <h3 className="text-xl font-extrabold text-[#243118] mt-1">
              {t(`Sign In to Access ${targetPortalName}`, `${targetPortalName} में प्रवेश करने के लिए साइन इन करें`)}
            </h3>
            {authError && (
              <p className="text-xs text-rose-600 font-bold mt-1 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {authError}
              </p>
            )}
            <p className="text-xs text-[#637554] mt-0.5">
              {t(
                `To access ${targetPortalName}, digital workflows, real-time rates, and government allocation tools, please sign in or register your stakeholder profile.`,
                `${targetPortalName} और संबंधित सेवाओं तक पहुंचने के लिए कृपया लॉगिन करें या नया पंजीकरण करें।`
              )}
            </p>
          </div>
        </div>

        {/* 1-Click Fast Instant Login for Testing/Direct Access */}
        <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#243118]">
              <Zap className="w-4 h-4 text-[#a36627]" />
              <span>{t('Quick 1-Click Persona Login:', 'त्वरित 1-क्लिक भूमिका प्रवेश:')}</span>
            </div>
            <span className="text-[10px] font-mono text-[#71873f] font-bold">
              {t('Instant Direct Entry', 'तत्काल प्रवेश')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { role: 'Farmer', labelEn: 'Farmer (Kisan)', labelHi: 'किसान', icon: Sprout },
              { role: 'Trader', labelEn: 'Trader / Buyer', labelHi: 'व्यापारी', icon: Coins },
              { role: 'Officer', labelEn: 'Govt Officer', labelHi: 'अधिकारी', icon: Building2 },
              { role: 'Operator', labelEn: 'Mandi Operator', labelHi: 'संचालक', icon: QrCode },
              { role: 'Quality', labelEn: 'Quality Lab', labelHi: 'गुणवत्ता लैब', icon: Microscope },
              { role: 'Logistics', labelEn: 'Transporter', labelHi: 'ट्रांसपोर्टर', icon: Truck }
            ].map((item) => {
              const IconC = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => handleFastLogin(item.role)}
                  className="py-2 px-2.5 rounded-xl bg-white hover:bg-[#71873f] hover:text-white text-[#243118] border border-[#abbe99]/70 text-xs font-extrabold transition-all text-left truncate shadow-xs flex items-center gap-1.5 group"
                >
                  <IconC className="w-3.5 h-3.5 text-[#a36627] group-hover:text-white shrink-0" />
                  <span className="truncate">{t(item.labelEn, item.labelHi)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Google 1-Click Fast Sign In */}
        <button
          onClick={() => {
            const user = demoUsers.Farmer;
            const googleUser = {
              ...user,
              id: `GOOGLE-${Math.floor(10000 + Math.random() * 90000)}`,
              email: 'farmer.kisan@gmail.com',
              authMethod: 'Google SSO',
              token: `GOI-GOOGLE-SSO-${Math.floor(1000 + Math.random() * 9000)}`
            };
            if (onLoginSuccess) onLoginSuccess(googleUser);
            onClose();
          }}
          className="w-full bg-white hover:bg-[#f8f9fa] text-[#3c4043] font-extrabold py-3 px-4 rounded-xl border border-[#dadce0] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 text-xs"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.39 7.37 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
          <span>{t('Continue with Google', 'गूगल से जारी रखें')}</span>
        </button>

        {/* Dual Actions: Go to Full Login / Go to Registration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              onClose();
              if (onOpenFullAuth) onOpenFullAuth('login');
            }}
            className="w-full py-3.5 rounded-xl bg-[#71873f] hover:bg-[#688557] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('Sign In (Google / OTP / Staff)', 'साइन इन / लॉगिन करें')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenFullAuth) onOpenFullAuth('register');
            }}
            className="w-full py-3.5 rounded-xl bg-[#a36627] hover:bg-[#804d19] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('Register New Stakeholder', 'नया हितधारक पंजीकरण')}</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#abbe99]/40 flex items-center justify-between text-[11px] text-[#637554]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#71873f]" />
            <span>MeriPahchan GOI Verified</span>
          </span>
          <button
            onClick={() => {
              onClose();
              if (onOpenVoiceAgent) onOpenVoiceAgent();
            }}
            className="flex items-center gap-1 text-[#71873f] hover:text-[#5b722e] font-bold hover:underline cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#71873f] animate-pulse" />
            <span>AI Voice Agent: <strong>24x7 Active</strong></span>
          </button>
        </div>

      </div>
    </div>
  );
}
