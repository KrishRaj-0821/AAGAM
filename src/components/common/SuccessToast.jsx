import React, { useEffect } from 'react';
import { CheckCircle2, X, Sparkles, ShieldCheck, Smartphone, Mail, Clock } from 'lucide-react';

export default function SuccessToast({ notification, onClose }) {
  useEffect(() => {
    if (notification?.isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification?.isOpen) return null;

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

            {notification.tokenNo && (
              <div className="mt-2 bg-white/10 p-2.5 rounded-xl border border-white/15 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#e0b87e] font-extrabold">{notification.tokenNo}</span>
                  <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#e0b87e]" />
                    Verified & Recorded
                  </span>
                </div>

                {/* Instant Multi-Channel Dispatch Info */}
                <div className="text-[10px] font-sans text-slate-300 space-y-1 pt-1 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>SMS sent to: <strong>+91 98765 43210</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-300">
                    <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>Receipt sent to: <strong>farmer.kisan@gmail.com</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#e0b87e] font-semibold">
                    <Clock className="w-3 h-3 text-[#e0b87e] shrink-0" />
                    <span>Automated SMS reminder scheduled 1-hr before arrival slot.</span>
                  </div>
                </div>
              </div>
            )}
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
