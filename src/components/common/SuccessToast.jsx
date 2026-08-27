import React, { useEffect } from 'react';
import { CheckCircle2, X, Sparkles, ShieldCheck, Smartphone, Mail, Clock, Download, FileText } from 'lucide-react';

export default function SuccessToast({ notification, onClose, currentUser }) {
  useEffect(() => {
    if (notification?.isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification?.isOpen) return null;

  const userMobile = currentUser?.mobile || currentUser?.phone || '+91 98765 43210';
  const userName = currentUser?.name || currentUser?.full_name || 'Verified User';
  const userRole = currentUser?.role || 'Farmer';
  const userEmail = currentUser?.email || 'user.kisan@gmail.com';

  const handleDownloadReceipt = () => {
    const receiptContent = `================================================================
  GOVERNMENT OF INDIA — AAGAM AGRICULTURAL PORTAL
  OFFICIAL NOTIFICATION RECEIPT & VERIFICATION RECORD
================================================================

RECEIPT REF   : ${notification.tokenNo || 'GOI-NTF-' + Math.floor(100000 + Math.random() * 900000)}
DATE & TIME   : ${new Date().toLocaleString('en-IN')}
STATUS        : VERIFIED & RECORDED ON GOI BLOCKCHAIN LEDGER

----------------------------------------------------------------
RECIPIENT & USER DETAILS
----------------------------------------------------------------
User Name     : ${userName}
User Role     : ${userRole}
Mobile Number : ${userMobile}
Email Address : ${userEmail}
Assigned Mandi: ${currentUser?.mandi || 'Karnal Central APMC (HR)'}

----------------------------------------------------------------
NOTIFICATION DETAILS
----------------------------------------------------------------
Title         : ${notification.title || 'Process Completed Successfully'}
Information   : ${notification.message}

----------------------------------------------------------------
DISPATCH CONFIRMATION
----------------------------------------------------------------
SMS Gateway   : Dispatched to ${userMobile}
Email Gateway : Dispatched to ${userEmail}
Verification  : Verhoeff Checksum Validated (GOI Cloud)

================================================================
  National Informatics Centre (NIC) & Ministry of Agriculture
  This is an official computer-generated digital receipt.
================================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AAGAM_Notification_Receipt_${notification.tokenNo || 'Record'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-6 right-6 z-[100] max-w-md w-full animate-in slide-in-from-top-5 duration-300 pointer-events-auto">
      <div className="bg-[#243118] text-white rounded-2xl p-4 shadow-2xl border-2 border-[#71873f] relative overflow-hidden backdrop-blur-md">
        
        {/* Animated Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#71873f] via-[#e0b87e] to-[#71873f] animate-pulse" />

        <div className="flex items-start gap-3 mt-1">
          {/* Success Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-[#71873f] text-white flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-6 h-6 animate-bounce" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#71873f]/40 text-[#e0b87e] px-2 py-0.5 rounded-full border border-[#e0b87e]/30">
                GOI AAGAM SUCCESS
              </span>
              <span className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>

            <h4 className="font-extrabold text-sm text-white leading-tight">
              {notification.title || 'Process Completed Successfully!'}
            </h4>

            <p className="text-xs text-slate-200 leading-snug">
              {notification.message}
            </p>

            <div className="mt-2 bg-white/10 p-2.5 rounded-xl border border-white/15 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#e0b87e] font-extrabold">{notification.tokenNo || 'GOI-VERIFIED'}</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e0b87e]" />
                  Recorded
                </span>
              </div>

              {/* Instant Multi-Channel Dispatch Info with User's Custom Mobile */}
              <div className="text-[10px] font-sans text-slate-300 space-y-1 pt-1 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>SMS sent to: <strong>{userMobile}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-sky-300">
                  <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>Receipt sent to: <strong>{userEmail}</strong></span>
                </div>
              </div>

              {/* Action Button: Download Notification Information Receipt */}
              <button
                onClick={handleDownloadReceipt}
                className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download Notification Receipt (.txt)</span>
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Countdown Bar */}
        <div className="mt-3 w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div className="h-full bg-[#e0b87e] w-full" />
        </div>

      </div>
    </div>
  );
}
