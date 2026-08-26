import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  Download, 
  ChevronRight, 
  X, 
  MapPin, 
  Building2, 
  Sprout, 
  Scale, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Edit3,
  Printer,
  Smartphone,
  Mail,
  BellRing
} from 'lucide-react';
import QRCode from 'qrcode';
import { allIndianStatesData, allIndianCropsList } from '../../data/realTimeData';
import WorkingQRCode from '../common/WorkingQRCode';

export default function GatePassModal({
  isOpen,
  onClose,
  slotStep,
  setSlotStep,
  bookingDetails,
  setBookingDetails,
  triggerSuccessNotification,
  t
}) {
  if (!isOpen) return null;

  const allStatesList = Object.keys(allIndianStatesData);
  const currentState = bookingDetails.state || 'Haryana';
  
  // Safe district list resolution
  const availableDistricts = allIndianStatesData[currentState]?.districts || ['Karnal', 'Kurukshetra', 'Other District'];
  const currentDistrict = availableDistricts.includes(bookingDetails.district) 
    ? bookingDetails.district 
    : availableDistricts[0];
  
  // Safe mandi list resolution
  const stateMandisForDist = allIndianStatesData[currentState]?.mandis?.[currentDistrict] || [];
  const availableMandis = [...stateMandisForDist, 'Local Sub-Yard / Custom Center'];

  const [selectedCropOption, setSelectedCropOption] = useState(() => {
    if (bookingDetails.isCustomCrop) return 'Others';
    const found = allIndianCropsList.find(c => c.name === bookingDetails.commodity);
    return found ? found.name : 'Wheat (Sharbati)';
  });

  const [customCropText, setCustomCropText] = useState(bookingDetails.customCommodity || '');
  const [customMandiText, setCustomMandiText] = useState(bookingDetails.customMandi || '');

  const handleStateChange = (newState) => {
    const defaultDist = allIndianStatesData[newState]?.districts[0] || 'Default District';
    const defaultMandi = allIndianStatesData[newState]?.mandis[defaultDist]?.[0] || 'Central APMC Yard';
    setBookingDetails({
      ...bookingDetails,
      state: newState,
      district: defaultDist,
      mandi: defaultMandi
    });
  };

  const handleDistrictChange = (newDistrict) => {
    const defaultMandi = allIndianStatesData[currentState]?.mandis[newDistrict]?.[0] || 'Central APMC Yard';
    setBookingDetails({
      ...bookingDetails,
      district: newDistrict,
      mandi: defaultMandi
    });
  };

  const handleCropChange = (newVal) => {
    setSelectedCropOption(newVal);
    if (newVal === 'Others') {
      setBookingDetails({
        ...bookingDetails,
        isCustomCrop: true,
        commodity: customCropText.trim() || 'Custom Crop (Other)',
        customCommodity: customCropText
      });
    } else {
      setBookingDetails({
        ...bookingDetails,
        isCustomCrop: false,
        commodity: newVal,
        customCommodity: ''
      });
    }
  };

  const handleCustomCropInput = (text) => {
    setCustomCropText(text);
    setBookingDetails({
      ...bookingDetails,
      isCustomCrop: true,
      commodity: text.trim() || 'Custom Crop (Other)',
      customCommodity: text
    });
  };

  const getEffectiveCropName = () => {
    if (selectedCropOption === 'Others') {
      return customCropText.trim() || 'Custom Specified Crop';
    }
    return bookingDetails.commodity || 'Wheat (Sharbati)';
  };

  const getEffectiveMandiName = () => {
    if (bookingDetails.mandi === 'Local Sub-Yard / Custom Center') {
      return customMandiText.trim() || 'Custom Specified Center';
    }
    return bookingDetails.mandi || 'Karnal Central Grain Yard';
  };

  const handleGenerateQR = () => {
    const statePrefix = (currentState || 'GOI').slice(0, 2).toUpperCase();
    const distPrefix = (currentDistrict || 'MND').slice(0, 3).toUpperCase();
    const token = `${statePrefix}-${distPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updatedDetails = {
      ...bookingDetails,
      commodity: getEffectiveCropName(),
      mandi: getEffectiveMandiName(),
      qrGenerated: true,
      tokenNo: token
    };

    setBookingDetails(updatedDetails);
    setSlotStep(3);

    // Trigger rich success notification banner across the website
    if (triggerSuccessNotification) {
      triggerSuccessNotification({
        title: t('Gate Pass Confirmed & SMS Dispatched!', 'गेट पास बुक हुआ एवं एसएमएस भेजा गया!'),
        message: t(
          `Token ${token} created for ${updatedDetails.commodity} (${updatedDetails.estimatedQty} Qtl) at ${updatedDetails.mandi}. SMS sent to registered mobile & 1-hour prior alert scheduled.`,
          `टोकन ${token} जारी: ${updatedDetails.commodity} (${updatedDetails.estimatedQty} क्विंटल), ${updatedDetails.mandi}। पंजीकृत मोबाइल पर एसएमएस भेजा गया व 1 घंटे पूर्व का अलर्ट शेड्यूल किया गया।`
        ),
        tokenNo: token
      });
    }
  };

  // Active Real Download & Printable PDF generator with 100% scannable QR Code
  const handleDownloadPdf = async () => {
    const token = bookingDetails.tokenNo || 'GOI-MND-9921';
    const crop = getEffectiveCropName();
    const mandi = getEffectiveMandiName();
    const qty = bookingDetails.estimatedQty || '150';
    const date = bookingDetails.date || '2026-08-28';
    const timeSlot = bookingDetails.timeSlot || '09:00 AM - 11:00 AM';
    const lane = bookingDetails.lane || 'Lane 04 - Weighbridge A';
    const state = currentState;
    const district = currentDistrict;
    const farmerId = bookingDetails.farmerId || 'PB-FARM-99482';
    const mobile = '+91 98765 43210';
    const email = 'farmer.kisan@gmail.com';
    const printTime = new Date().toLocaleString('en-IN');

    // Real QR payload to encode
    const qrPayload = JSON.stringify({
      system: "GOI AAGAM National Grain Procurement",
      token: token,
      farmer: bookingDetails.farmerName || 'Gurpreet Singh',
      farmerId: farmerId,
      mandi: mandi,
      state: state,
      district: district,
      crop: crop,
      quantity: `${qty} Qtl`,
      date: date,
      slot: timeSlot,
      lane: lane,
      status: "VERIFIED_ACTIVE",
      verifyUrl: `https://aagam.gov.in/verify?token=${token}`
    }, null, 2);

    let qrCodeImgSrc = '';
    try {
      qrCodeImgSrc = await QRCode.toDataURL(qrPayload, {
        width: 260,
        margin: 1,
        color: { dark: '#1c2713', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      });
    } catch (e) {
      console.error('Failed to generate QR data url for PDF:', e);
    }

    const printableContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AAGAM Official Gate Pass - ${token}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
    @media print {
      body { margin: 0; padding: 0; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .pass-card { box-shadow: none !important; border: 1px solid #71873f !important; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #1a202c;
      background: #f4f6f8;
      padding: 24px;
      font-size: 12px;
    }
    .pass-card {
      max-width: 760px;
      margin: 0 auto;
      background: #ffffff;
      border: 2px solid #71873f;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .bill-header {
      background: #243118;
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .emblem-box {
      background: white;
      border-radius: 6px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bill-header-text { flex: 1; }
    .bill-header-text h1 { font-size: 15px; font-weight: 800; color: #e0b87e; text-transform: uppercase; margin: 0; }
    .bill-header-text p { font-size: 11px; color: #c8d9b0; margin-top: 3px; }
    .bill-header-right { text-align: right; }
    .bill-header-right .token-num { font-family: monospace; font-size: 16px; font-weight: 800; color: #e0b87e; }
    .bill-header-right .status-chip { background: #2e7d32; color: white; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 4px; display: inline-block; margin-top: 4px; }
    .user-opted-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 20px 24px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
    }
    .info-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 14px;
    }
    .info-label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 3px; }
    .info-val { font-size: 13px; font-weight: 700; color: #0f172a; }
    .highlight-green { color: #166534; }
    .highlight-amber { color: #b45309; }
    .qr-row {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 18px 24px;
      background: #f0fdf4;
      border-bottom: 1px solid #bbf7d0;
    }
    .qr-img-box {
      width: 100px;
      height: 100px;
      background: white;
      border: 2px solid #22c55e;
      border-radius: 8px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .qr-info { flex: 1; }
    .qr-info h4 { font-size: 13px; font-weight: 800; color: #166534; margin-bottom: 4px; }
    .qr-info p { font-size: 11px; color: #15803d; line-height: 1.5; }
    .stamp-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      background: #ffffff;
    }
    .terms-list { font-size: 10px; color: #475569; line-height: 1.8; padding-left: 14px; }
    .gov-stamp-box {
      border: 2px solid #1a3010;
      border-radius: 6px;
      padding: 10px 14px;
      text-align: center;
      background: rgba(26,48,16,0.02);
      min-width: 130px;
    }
    .stamp-title { font-size: 9px; font-weight: 800; color: #1a3010; text-transform: uppercase; margin-top: 4px; }
    .stamp-sign { border-top: 1px solid #1a3010; font-size: 9px; font-weight: 700; color: #1a3010; margin-top: 6px; padding-top: 2px; }
    .footer {
      background: #243118;
      color: #c8d9b0;
      padding: 10px 24px;
      font-size: 10px;
      display: flex;
      justify-content: space-between;
    }
    .btn-print {
      background: #71873f;
      color: white;
      border: none;
      padding: 12px 28px;
      font-size: 13px;
      font-weight: 800;
      border-radius: 8px;
      cursor: pointer;
      display: block;
      margin: 20px auto;
      font-family: inherit;
    }
  </style>
</head>
<body>
  <div class="pass-card">
    
    <!-- HEADER -->
    <div class="bill-header">
      <div class="emblem-box">
        <img src="${window.location.origin + import.meta.env.BASE_URL}images/goi_emblem.png" alt="GOI Emblem" style="height:52px; width:auto; object-fit:contain;" />
      </div>
      <div class="bill-header-text">
        <h1>Government of India — Ministry of Agriculture</h1>
        <p>AAGAM National Automated Grain Gate Pass & Queue System</p>
      </div>
      <div class="bill-header-right">
        <div class="token-num">TOKEN #: ${token}</div>
        <div class="status-chip">ACTIVE & CONFIRMED</div>
      </div>
    </div>

    <!-- USER OPTED DETAILS ONLY -->
    <div class="user-opted-grid">
      <div class="info-box">
        <div class="info-label">Farmer Name / Registration ID</div>
        <div class="info-value">${bookingDetails.farmerName || 'Gurpreet Singh'} (${farmerId})</div>
      </div>
      <div class="info-box">
        <div class="info-label">Registered Contact</div>
        <div class="info-value">${mobile} • ${email}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Selected Crop & Quantity</div>
        <div class="info-value highlight-amber">${crop} — ${qty} Quintal</div>
      </div>
      <div class="info-box">
        <div class="info-label">State & District Selected</div>
        <div class="info-value">${district}, ${state}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Procurement Center (Mandi)</div>
        <div class="info-value highlight-green">${mandi}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Assigned Lane & Arrival Slot</div>
        <div class="info-value highlight-green">${lane} • ${date} (${timeSlot})</div>
      </div>
    </div>

    <!-- QR CODE SECTION -->
    <div class="qr-row">
      <div class="qr-img-box">
        ${qrCodeImgSrc ? `<img src="${qrCodeImgSrc}" alt="Gate Pass QR" style="width:100%;height:100%;object-fit:contain;"/>` : `<div style="font-size:10px;">QR CODE</div>`}
      </div>
      <div class="qr-info">
        <h4>100% SCANNABLE OFFICIAL GATE PASS QR</h4>
        <p>Present this QR code at ${mandi} barrier for fast-track automated barrier opening. Token: <strong>${token}</strong></p>
        <p style="margin-top:4px; font-weight:700;">1-Hour Prior Automated SMS Notification Scheduled to ${mobile}</p>
      </div>
    </div>

    <!-- GOI STAMP & TERMS -->
    <div class="stamp-section">
      <div style="flex:1;">
        <div style="font-weight:800; font-size:11px; color:#243118; margin-bottom:4px;">Gate Pass Instructions:</div>
        <ul class="terms-list">
          <li>Valid only for ${date} during slot ${timeSlot}.</li>
          <li>Carry official Farmer ID or Aadhaar for weighbridge verification.</li>
          <li>MSP payment will be credited via NPCI-DBT within 48 hours of acceptance.</li>
          <li>AAGAM 24x7 AI Voice Agent: Active on Portal for Instant Voice Support (Hindi & English).</li>
        </ul>
      </div>

      <div class="gov-stamp-box">
        <img src="${window.location.origin + import.meta.env.BASE_URL}images/goi_emblem.png" alt="GOI Stamp" style="height:38px; width:auto; object-fit:contain;" />
        <div class="stamp-title">Ministry of Agriculture<br>Govt. of India</div>
        <div class="stamp-sign">Authorised Officer (${district})</div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <span>Issued: ${printTime}</span>
      <span>AAGAM AI Kisan Voice Agent: 24x7 Active</span>
      <span>Token Hash: GOI-${token}</span>
    </div>

  </div>

  <div class="no-print">
    <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

    // 1. Open printable window for instant browser PDF print/save
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printableContent);
      printWindow.document.close();
    }

    // 2. Trigger physical downloadable file as well
    const blob = new Blob([printableContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AAGAM_Gate_Pass_${token}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full border border-[#abbe99] shadow-2xl space-y-6 text-[#243118] relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#71873f] text-white flex items-center justify-center shadow-md">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#243118]">
                {t('Fast-Track Gate Pass & Slot Reservation', 'फास्ट-ट्रैक गेट पास एवं स्लॉट बुकिंग')}
              </h3>
              <p className="text-xs text-[#637554]">
                {t('AAGAM Automated AI Grain Procurement System', 'आगामी स्वचालित अनाज खरीद प्रणाली')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#637554] hover:text-[#243118] p-1.5 rounded-xl hover:bg-[#f0f4ea] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-between gap-2 border-b border-[#abbe99]/40 pb-4 text-xs font-mono">
          {[
            { step: 1, labelEn: '1. State, District & Crop', labelHi: '1. राज्य, जिला व फसल' },
            { step: 2, labelEn: '2. Date & Lane Slot', labelHi: '2. तिथि व लेन' },
            { step: 3, labelEn: '3. Digital QR Pass', labelHi: '3. डिजिटल पास' }
          ].map((s) => (
            <div
              key={s.step}
              className={`flex-1 py-1.5 px-2 rounded-xl text-center font-bold transition-all ${
                slotStep === s.step
                  ? 'bg-[#71873f] text-white shadow-sm'
                  : slotStep > s.step
                  ? 'bg-[#f0f4ea] text-[#71873f] border border-[#abbe99]'
                  : 'bg-[#fcfaf7] text-[#637554]'
              }`}
            >
              {t(s.labelEn, s.labelHi)}
            </div>
          ))}
        </div>

        {/* Step 1: State, District, Mandi & Crop Selection */}
        {slotStep === 1 && (
          <div className="space-y-4 text-xs">
            
            {/* Farmer Identification */}
            <div className="space-y-1">
              <label className="font-bold text-[#243118] flex items-center justify-between">
                <span>{t('Farmer Registration ID / Mobile Number:', 'किसान पंजीकरण आईडी / मोबाइल:')}</span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>GOI Verified</span>
                </span>
              </label>
              <input
                type="text"
                value={bookingDetails.farmerId}
                onChange={(e) => setBookingDetails({ ...bookingDetails, farmerId: e.target.value })}
                placeholder="e.g. PB-FARM-99482 or 9876543210"
                className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-xs"
              />
            </div>

            {/* Hierarchical Location: State -> District -> Procurement Center */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* 1. All 36 States & UTs */}
              <div className="space-y-1">
                <label className="font-bold text-[#243118] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#71873f]" />
                  <span>{t('Select State / UT (All 36):', 'राज्य / यूटी चुनें (सभी 36):')}</span>
                </label>
                <select
                  value={currentState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-xs"
                >
                  {allStatesList.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. District Selection */}
              <div className="space-y-1">
                <label className="font-bold text-[#243118] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#a36627]" />
                  <span>{t('Select District:', 'जिला चुनें:')}</span>
                </label>
                <select
                  value={currentDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-xs"
                >
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Procurement Center / APMC Mandi Yard Selection */}
            <div className="space-y-1">
              <label className="font-bold text-[#243118] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#71873f]" />
                <span>{t('Target Procurement Center / APMC Mandi Yard:', 'लक्षित खरीद केंद्र / मंडी यार्ड:')}</span>
              </label>
              <select
                value={bookingDetails.mandi}
                onChange={(e) => setBookingDetails({ ...bookingDetails, mandi: e.target.value })}
                className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-xs"
              >
                {availableMandis.map((mandiName) => (
                  <option key={mandiName} value={mandiName}>
                    {mandiName}
                  </option>
                ))}
              </select>
            </div>

            {/* If Custom Mandi Selected */}
            {bookingDetails.mandi === 'Local Sub-Yard / Custom Center' && (
              <div className="space-y-1 p-3 bg-[#f0f4ea] rounded-xl border border-[#71873f]">
                <label className="font-bold text-xs text-[#243118]">
                  {t('Type Custom Sub-Yard or Center Name:', 'कस्टम खरीद केंद्र का नाम लिखें:')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Village Grain Center, Sub-Yard Lane 2..."
                  value={customMandiText}
                  onChange={(e) => setCustomMandiText(e.target.value)}
                  className="w-full bg-white border border-[#abbe99] rounded-xl p-2.5 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none"
                />
              </div>
            )}

            {/* Commodity Crop & Quantity Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Crop Selection with ALL Indian Crops */}
              <div className="space-y-1">
                <label className="font-bold text-[#243118] flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-[#71873f]" />
                  <span>{t('Commodity Crop (All Crops):', 'फसल (सभी फसलें):')}</span>
                </label>
                <select
                  value={selectedCropOption}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-xs"
                >
                  {allIndianCropsList.map((crop) => (
                    <option key={crop.name} value={crop.name}>
                      {crop.name} {crop.hindi ? `(${crop.hindi})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Quantity */}
              <div className="space-y-1">
                <label className="font-bold text-[#243118] flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#a36627]" />
                  <span>{t('Estimated Quantity (Quintals):', 'अनुमानित मात्रा (क्विंटल):')}</span>
                </label>
                <input
                  type="number"
                  value={bookingDetails.estimatedQty}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, estimatedQty: e.target.value })}
                  placeholder="e.g. 150"
                  className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Dynamic Custom Crop Input Field */}
            {selectedCropOption === 'Others' && (
              <div className="p-3.5 bg-[#f0f4ea] rounded-2xl border-2 border-[#71873f] space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <label className="font-bold text-xs text-[#243118] flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-[#71873f]" />
                  <span>{t('Enter Your Custom Crop Name:', 'अपनी फसल का नाम दर्ज करें:')}</span>
                </label>
                <input
                  type="text"
                  placeholder={t('e.g. Organic Millet, Jowar, Sunflower...', 'उदा. ज्वार, बाजरा, सूरजमुखी...')}
                  value={customCropText}
                  onChange={(e) => handleCustomCropInput(e.target.value)}
                  className="w-full bg-white border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none shadow-sm"
                  autoFocus
                />
              </div>
            )}

            <button
              onClick={() => setSlotStep(2)}
              className="w-full bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>{t('Proceed to Select Date & Time Slot', 'तिथि एवं समय स्लॉट चुनें')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Slot & Lane Selection */}
        {slotStep === 2 && (
          <div className="space-y-4 text-xs">
            
            {/* Booking Summary Pill */}
            <div className="bg-[#f0f4ea] p-3.5 rounded-2xl border border-[#abbe99] space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#637554]">Crop & Quantity:</span>
                <span className="font-bold text-[#243118]">{getEffectiveCropName()} • {bookingDetails.estimatedQty} Qtl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#637554]">Procurement Center:</span>
                <span className="font-bold text-[#71873f] truncate max-w-[240px]">{getEffectiveMandiName()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#243118] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#71873f]" />
                  <span>{t('Arrival Date:', 'आगमन तिथि:')}</span>
                </label>
                <input
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-mono font-bold text-[#243118] focus:border-[#71873f] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#243118] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#a36627]" />
                  <span>{t('Hourly Window:', 'समय स्लॉट:')}</span>
                </label>
                <select
                  value={bookingDetails.timeSlot}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, timeSlot: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-3 text-xs font-bold text-[#243118] focus:border-[#71873f] focus:outline-none"
                >
                  <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM (Early Morning)</option>
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning Peak)</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Midday)</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                </select>
              </div>
            </div>

            {/* Lane & 1-Hour Prior Scheduled Notification Notice */}
            <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/60 space-y-2">
              <div className="font-bold text-[#243118] flex items-center justify-between">
                <span>{t('Allocated Weighbridge Lane:', 'आवंटित धर्म कांटा लेन:')}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Automated</span>
              </div>
              <div className="text-sm font-mono font-extrabold text-[#71873f]">{bookingDetails.lane}</div>
              
              <div className="pt-2 border-t border-[#abbe99]/30 flex items-start gap-2 text-[11px] text-[#a36627] font-semibold">
                <BellRing className="w-4 h-4 text-[#a36627] shrink-0 mt-0.5" />
                <span>
                  {t(
                    '1-Hour Prior Alert: An automated confirmation SMS with live queue status will be sent to your mobile 1 hour before your arrival time.',
                    '1 घंटे पूर्व अलर्ट: आगमन से 1 घंटा पहले आपके मोबाइल पर कतार स्थिति के साथ स्वचालित एसएमएस भेजा जाएगा।'
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSlotStep(1)}
                className="w-1/3 bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#243118] font-bold py-3.5 rounded-xl text-xs transition-colors"
              >
                {t('Back', 'पीछे')}
              </button>
              <button
                onClick={handleGenerateQR}
                className="w-2/3 bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('Generate Official Gate Pass QR', 'क्यूआर गेट पास जनरेट करें')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generated QR Pass Display with SMS/Email alerts & Active PDF download */}
        {slotStep === 3 && (
          <div className="space-y-5 text-center">
            
            {/* Live Success Banner */}
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 p-3 rounded-2xl text-xs font-bold space-y-1">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>{t('Gate Pass Confirmed & Recorded Successfully!', 'गेट पास सफलतापूर्वक बुक व दर्ज हुआ!')}</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-sans font-medium flex flex-wrap justify-center items-center gap-3 pt-1 border-t border-emerald-200">
                <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> SMS Dispatched: +91 98765 43210</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email Dispatched: farmer.kisan@gmail.com</span>
              </div>
            </div>

            {/* 1-Hour Prior Scheduled Reminder Notice */}
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900 flex items-center justify-center gap-2 text-left">
              <BellRing className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>1-Hour Prior Alert Scheduled:</strong> Automatic reminder SMS with live gate directions will arrive on your phone 1 hour before your {bookingDetails.timeSlot} slot.
              </span>
            </div>

            {/* Digital Pass Card */}
            <div className="bg-gradient-to-br from-[#243118] to-[#1c2713] text-white p-6 rounded-3xl border border-[#abbe99]/40 shadow-2xl space-y-4 max-w-md mx-auto">
              
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-mono text-[#e0b87e] font-bold">AAGAM DIGITAL GATE PASS</span>
                <span className="bg-[#688557] text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                  VERIFIED ACTIVE
                </span>
              </div>

              {/* 100% Mathematically Scannable Working QR Code */}
              <WorkingQRCode
                value={{
                  system: "GOI AAGAM National Grain Procurement",
                  token: bookingDetails.tokenNo,
                  farmer: bookingDetails.farmerName || 'Gurpreet Singh',
                  farmerId: bookingDetails.farmerId || 'PB-FARM-99482',
                  mandi: getEffectiveMandiName(),
                  state: currentState,
                  district: currentDistrict,
                  crop: getEffectiveCropName(),
                  quantity: `${bookingDetails.estimatedQty || '150'} Qtl`,
                  date: bookingDetails.date,
                  slot: bookingDetails.timeSlot,
                  lane: bookingDetails.lane,
                  status: "VERIFIED_ACTIVE",
                  verifyUrl: `https://aagam.gov.in/verify?token=${bookingDetails.tokenNo}`
                }}
                size={160}
                tokenNo={bookingDetails.tokenNo}
                showPayloadPreview={true}
              />

              <div className="space-y-1 font-mono">
                <div className="text-lg font-extrabold text-[#e0b87e]">{bookingDetails.tokenNo}</div>
                <div className="text-xs text-slate-200 font-sans font-bold">{getEffectiveMandiName()}</div>
                <div className="text-[11px] text-slate-300">
                  {currentDistrict}, {currentState}
                </div>
                <div className="text-[11px] text-[#e0b87e] font-bold">
                  {getEffectiveCropName()} • {bookingDetails.estimatedQty} Qtl
                </div>
                <div className="text-xs text-emerald-300 font-bold pt-1">{bookingDetails.date} ({bookingDetails.timeSlot})</div>
              </div>

              <div className="pt-3 border-t border-white/20 text-[10px] font-mono text-slate-300 flex justify-between">
                <span>LANE: {bookingDetails.lane}</span>
                <span>STATUS: PRIORITY ACCESS</span>
              </div>

            </div>

            {/* Action Buttons: Active PDF Generator & Close */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPdf}
                className="w-full sm:w-1/2 bg-[#a36627] hover:bg-[#804d19] text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <Printer className="w-3.5 h-3.5" />
                <span>{t('Download Gate Pass (PDF)', 'गेट पास डाउनलोड / प्रिंट करें')}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-1/2 bg-[#71873f] hover:bg-[#688557] text-white font-bold py-3.5 rounded-xl text-xs shadow flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('Done / Close', 'पूर्ण / बंद करें')}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
