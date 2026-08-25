import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode as QrIcon, Check, Copy, ShieldCheck, Smartphone } from 'lucide-react';

export default function WorkingQRCode({ 
  value, 
  size = 180, 
  className = '', 
  showPayloadPreview = true,
  tokenNo = ''
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!value) return;

    // Convert value to text if object
    const textData = typeof value === 'object' 
      ? JSON.stringify(value, null, 2) 
      : String(value);

    QRCode.toDataURL(textData, {
      width: size * 2, // 2x for retina crispness
      margin: 1.5,
      color: {
        dark: '#1c2713', // Deep forest green matching AAGAM palette
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H' // Highest 30% error correction for easy scanning
    })
      .then((url) => {
        setQrDataUrl(url);
        setError(null);
      })
      .catch((err) => {
        console.error('QR Generation error:', err);
        setError(err);
      });
  }, [value, size]);

  const handleCopyPayload = () => {
    const textData = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    navigator.clipboard.writeText(textData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      
      {/* QR Code Canvas / Image Container */}
      <div 
        className="relative bg-white p-3 rounded-2xl shadow-xl border-4 border-[#e0b87e] overflow-hidden group transition-transform hover:scale-[1.02]"
        style={{ width: size + 24, height: size + 24 }}
      >
        {qrDataUrl ? (
          <>
            <img 
              src={qrDataUrl} 
              alt={`AAGAM Scannable Gate Pass QR ${tokenNo}`} 
              className="w-full h-full object-contain rounded-lg"
            />
            {/* Center Emblem Tag */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-[#243118] text-[#e0b87e] p-1.5 rounded-lg shadow-md border border-[#e0b87e] text-[8px] font-mono font-extrabold tracking-tighter">
                AAGAM
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
            <QrIcon className="w-12 h-12 animate-pulse" />
          </div>
        )}
      </div>

      {/* Scannable Verified Badge */}
      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
        <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>100% SCANNABLE BY ANY PHONE CAMERA</span>
      </div>

      {/* Comprehensive All Related Details Breakdown */}
      {typeof value === 'object' && value !== null && (
        <div className="mt-4 w-full bg-white/10 rounded-2xl p-3.5 border border-white/15 text-left text-xs font-mono space-y-2 text-slate-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="text-[11px] font-bold text-[#e0b87e] font-sans flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>QR Code Encoded Data Summary</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-900/60 px-2 py-0.5 rounded">
              {value.status || 'VERIFIED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            {value.token && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Token Number</span>
                <span className="font-bold text-[#e0b87e]">{value.token}</span>
              </div>
            )}
            {value.farmer && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Farmer / Bidder</span>
                <span className="font-bold text-white">{value.farmer}</span>
              </div>
            )}
            {value.farmerId && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Farmer / License ID</span>
                <span className="font-bold text-white">{value.farmerId}</span>
              </div>
            )}
            {value.crop && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Commodity Crop</span>
                <span className="font-bold text-[#e0b87e]">{value.crop}</span>
              </div>
            )}
            {value.quantity && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Lot Quantity</span>
                <span className="font-bold text-white">{value.quantity}</span>
              </div>
            )}
            {value.mandi && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Center / Mandi</span>
                <span className="font-bold text-emerald-300 truncate block">{value.mandi}</span>
              </div>
            )}
            {value.state && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">State & District</span>
                <span className="font-bold text-white">{value.district ? `${value.district}, ` : ''}{value.state}</span>
              </div>
            )}
            {value.lane && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Weighbridge Lane</span>
                <span className="font-bold text-emerald-300">{value.lane}</span>
              </div>
            )}
            {value.date && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Scheduled Arrival</span>
                <span className="font-bold text-white">{value.date} {value.slot ? `(${value.slot})` : ''}</span>
              </div>
            )}
            {value.verifyUrl && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 text-[10px] block uppercase">Digital Verification Portal</span>
                <span className="text-sky-300 underline text-[10px] truncate block">{value.verifyUrl}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {showPayloadPreview && (
        <div className="mt-2.5 flex items-center gap-2">
          <button
            onClick={handleCopyPayload}
            className="text-[10px] font-mono text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/15 transition-all flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">All QR Details Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy All QR Details</span>
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
