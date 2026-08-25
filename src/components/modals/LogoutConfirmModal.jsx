import React from 'react';
import { LogOut, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  currentUser,
  t
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#abbe99] shadow-2xl space-y-6 text-[#243118] relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#637554] hover:bg-[#f0f4ea] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-inner">
            <LogOut className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-100/70 px-2 py-0.5 rounded-full">
              {t('Security Confirmation', 'सुरक्षा पुष्टि')}
            </span>
            <h3 className="text-xl font-extrabold text-[#243118] mt-1">
              {t('Confirm Sign Out', 'लॉग आउट की पुष्टि करें')}
            </h3>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3 text-xs leading-relaxed text-[#637554] bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/60">
          <p className="font-semibold text-[#243118]">
            {t(
              `Are you sure you want to end your active session for ${currentUser?.name || 'User'} (${currentUser?.role || 'Stakeholder'})?`,
              `क्या आप वाकई ${currentUser?.name || 'उपयोगकर्ता'} (${currentUser?.role || 'हितधारक'}) का सत्र समाप्त करना चाहते हैं?`
            )}
          </p>
          <p>
            {t(
              'Signing out will end your authenticated Single Sign-On (SSO) session. You will be redirected to the public Home page and need to log in again to access portals and workflow modules.',
              'लॉग आउट करने से आपका सुरक्षित एसएसओ सत्र समाप्त हो जाएगा। आपको मुख्य पृष्ठ पर भेजा जाएगा और पोर्टल्स तक पहुंचने के लिए पुनः लॉगिन करना होगा।'
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onClose}
            className="w-1/2 py-3 rounded-xl bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#243118] font-bold text-xs border border-[#abbe99] transition-all"
          >
            {t('Cancel / Stay Logged In', 'रद्द करें / बने रहें')}
          </button>

          <button
            onClick={onConfirm}
            className="w-1/2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('Yes, Sign Out', 'हां, लॉग आउट करें')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
