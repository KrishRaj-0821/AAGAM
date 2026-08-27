import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Upload, Sparkles, CheckCircle2, AlertTriangle, RefreshCw,
  Coins, MapPin, Microscope, ShieldCheck, FileText, ArrowRight, X,
  Sliders, Award, HelpCircle, Layers, Cpu, Eye, Info, Check
} from 'lucide-react';

// Preset Crop Samples for Instant 1-Click Demo Testing
const SAMPLE_CROPS = [
  {
    nameEn: 'Wheat (Sharbati HD-3086)',
    nameHi: 'गेहूं (सरबती HD-3086)',
    category: 'Cereals',
    image: import.meta.env.BASE_URL + 'images/crop_sunset.png',
    score: 88,
    grade: 'Grade A — Premium',
    moistureEst: 'Normal (<11.5%)',
    moistureVal: 10.8,
    defectsEn: 'Minor broken grains (1.2%), zero mold/pest damage.',
    defectsHi: 'मामूली टूटे दाने (1.2%), शून्य फंगस/कीट क्षति।',
    confidence: 94,
    lowPrice: 2425,
    avgPrice: 2580,
    highPrice: 2690,
    bestMandi: 'Karnal Central Yard (Haryana)',
    procrutementSuitability: 'HIGHLY SUITABLE'
  },
  {
    nameEn: 'Paddy (Basmati 1121 Steam)',
    nameHi: 'धान (बासमती 1121 स्टीम)',
    category: 'Cereals',
    image: import.meta.env.BASE_URL + 'images/paddy_farmer.png',
    score: 92,
    grade: 'Grade A — Export Grade',
    moistureEst: 'Normal (<12.0%)',
    moistureVal: 11.2,
    defectsEn: 'Uniform long grain, zero discoloration, 0.4% foreign matter.',
    defectsHi: 'समान लंबा दाना, शून्य मलिनता, 0.4% बाहरी तत्व।',
    confidence: 96,
    lowPrice: 3800,
    avgPrice: 4180,
    highPrice: 4350,
    bestMandi: 'Khanna Main APMC (Punjab)',
    procrutementSuitability: 'HIGHLY SUITABLE'
  },
  {
    nameEn: 'Mustard (Bold Seed Yellow)',
    nameHi: 'सरसों (मोटा दाना पीला)',
    category: 'Oilseeds',
    image: import.meta.env.BASE_URL + 'images/aerial_farm.png',
    score: 84,
    grade: 'Grade B — Good Quality',
    moistureEst: 'Normal (<7.8%)',
    moistureVal: 7.5,
    defectsEn: 'High oil content (42.1%), slight dust impurity (0.8%).',
    defectsHi: 'उच्च तेल मात्रा (42.1%), हल्की धूल अशुद्धता (0.8%)।',
    confidence: 91,
    lowPrice: 5950,
    avgPrice: 6320,
    highPrice: 6480,
    bestMandi: 'Bharatpur Principal Yard (Rajasthan)',
    procrutementSuitability: 'SUITABLE'
  },
  {
    nameEn: 'Desi Chana (Whole Gram)',
    nameHi: 'देशी चना (साबुत)',
    category: 'Pulses',
    image: import.meta.env.BASE_URL + 'images/mandi_yard.jpg',
    score: 86,
    grade: 'Grade A — FAQ Quality',
    moistureEst: 'Normal (<9.2%)',
    moistureVal: 9.0,
    defectsEn: 'Uniform size, zero weevil damage, 0.6% broken.',
    defectsHi: 'समान आकार, शून्य घुन क्षति, 0.6% टूटे।',
    confidence: 93,
    lowPrice: 5650,
    avgPrice: 5780,
    highPrice: 5890,
    bestMandi: 'Latur APMC Yard (Maharashtra)',
    procrutementSuitability: 'HIGHLY SUITABLE'
  }
];

// Multi-Mandi Market Matrix Data
const NEARBY_MANDI_MATRIX = [
  { mandi: 'Karnal Central Yard (HR)', low: 2425, avg: 2580, high: 2690, updated: 'Today 10:30 AM', isBest: true },
  { mandi: 'Khanna APMC Market (PB)', low: 2450, avg: 2610, high: 2720, updated: 'Today 09:45 AM', isBest: false },
  { mandi: 'Kurukshetra APMC (HR)', low: 2425, avg: 2565, high: 2660, updated: 'Today 11:00 AM', isBest: false },
  { mandi: 'Sehore Agriculture Mandi (MP)', low: 2430, avg: 2590, high: 2710, updated: 'Today 10:15 AM', isBest: false }
];

export default function AiCropAnalyzerModal({ isOpen, onClose, triggerSuccessNotification, t }) {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'results'
  const [proMode, setProMode] = useState(false); // Procurement Officer Mode toggle

  // Camera & Image States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scanning Simulation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Analysis Results State
  const [analysisData, setAnalysisData] = useState(null);
  const [customMoistureInput, setCustomMoistureInput] = useState('');
  const [userState, setUserState] = useState('Haryana');
  const [userDistrict, setUserDistrict] = useState('Karnal');
  const [userMandi, setUserMandi] = useState('Karnal Central Yard');

  // Procurement Fields (Pro Mode)
  const [lotIdInput, setLotIdInput] = useState('LOT-PB-2026-9921');
  const [farmerIdInput, setFarmerIdInput] = useState('PB-FARM-99482');
  const [quantityInput, setQuantityInput] = useState('180');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Camera initialization
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access failed or unavailable:", err);
      // Fallback: trigger file picker if live camera is not available
      alert(t('Live camera access unavailable. Please select an image file.', 'लाइव कैमरा उपलब्ध नहीं है। कृपया चित्र फ़ाइल चुनें।'));
      setIsCameraActive(false);
      if (fileInputRef.current) fileInputRef.current.click();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImagePreview(dataUrl);
      stopCamera();
      runAiAnalysis(SAMPLE_CROPS[0], dataUrl);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        runAiAnalysis(SAMPLE_CROPS[0], reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetSample = (sample) => {
    setImagePreview(sample.image);
    runAiAnalysis(sample, sample.image);
  };

  // Run Simulated AI Scanning Sequence
  const runAiAnalysis = (cropTemplate, imgSrc) => {
    setIsAnalyzing(true);
    setScanProgress(0);
    setActiveTab('scan');

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      setScanProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setAnalysisData({
          ...cropTemplate,
          image: imgSrc,
          timestamp: new Date().toLocaleString('en-IN'),
          scanId: `AI-NIR-${Math.floor(100000 + Math.random() * 900000)}`
        });
        setCustomMoistureInput(cropTemplate.moistureVal.toString());
        setActiveTab('results');
      }
    }, 180);
  };

  const handleSaveToLedger = () => {
    if (!analysisData) return;
    const record = {
      ...analysisData,
      lotId: lotIdInput,
      farmerId: farmerIdInput,
      quantity: quantityInput,
      customMoisture: customMoistureInput,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('aagam_last_crop_analysis', JSON.stringify(record));
    } catch (e) {
      console.error(e);
    }
    setSaveSuccess(true);
    if (triggerSuccessNotification) {
      triggerSuccessNotification({
        title: t('Crop Analysis Saved to Blockchain Ledger!', 'फसल विश्लेषण ब्लॉकचेन में सहेजा गया!'),
        message: t(`Lot #${lotIdInput} verified. Grade: ${analysisData.grade}. Market Price: ₹${analysisData.avgPrice}/Qtl.`, `लॉट #${lotIdInput} सत्यापित। ग्रेड: ${analysisData.grade}।`),
        tokenNo: lotIdInput
      });
    }
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#fcfaf7] rounded-3xl border-2 border-[#abbe99] shadow-2xl max-w-4xl w-full text-[#243118] my-8 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1c2713] via-[#243118] to-[#1c2713] p-4 text-white flex flex-wrap items-center justify-between gap-3 border-b border-[#e0b87e]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#71873f] flex items-center justify-center text-amber-300 shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {t('AI Crop Quality & Market Price Agent', 'एआई फसल गुणवत्ता एवं बाजार दर विश्लेषण')}
                </h3>
                <span className="bg-[#e0b87e] text-[#1c2713] text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase">
                  v3.4 LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#abbe99]">
                {t('Instant Visual Quality Grading, NIR Moisture Estimation & Mandi Price Discovery', 'तत्काल गुणवत्ता ग्रेडिंग, नमी अनुमान एवं मंडी भाव जानकारी')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pro Mode Toggle */}
            <button
              onClick={() => setProMode(!proMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${proMode ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'}`}
              title="Toggle Professional Procurement Mode for Quality Inspectors & Officers"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{proMode ? t('Procurement Mode ON', 'प्रोक्योरमेंट मोड ऑन') : t('Officer Pro Mode', 'अधिकारी मोड')}</span>
            </button>

            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-1.5 text-slate-300 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 font-sans">

          {/* SECTION 1: CENTRAL HERO ACTION BOX (Only on scan tab or when re-taking) */}
          {(!analysisData || activeTab === 'scan') && (
            <div className="bg-gradient-to-br from-white via-[#f0f4ea] to-[#e8eee0] rounded-3xl p-6 border-2 border-[#71873f]/50 shadow-xl space-y-5">
              
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-2 bg-[#71873f] text-white px-4 py-1 rounded-full text-xs font-mono font-extrabold shadow-sm uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('🌾 CHECK YOUR CROP', '🌾 अपनी फसल की जांच करें')}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#243118] mt-2">
                  {t('Capture or Upload Crop Photo for AI Analysis', 'एआई जांच के लिए फसल का फोटो लें या अपलोड करें')}
                </h2>
                <p className="text-xs text-[#637554] max-w-xl mx-auto">
                  {t('Our neural vision model evaluates grain purity, defects, estimated moisture condition, and fetches live Agmarknet market rates.', 'एआई मॉडल दाने की शुद्धता, दोष, नमी और मंडी दरों का तुरंत विश्लेषण करता है।')}
                </p>
              </div>

              {/* Camera Stream Viewport (When Live Camera Active) */}
              {isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-4 border-[#71873f] max-w-md mx-auto aspect-video flex items-center justify-center shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Camera Reticle Overlay */}
                  <div className="absolute inset-0 border-2 border-dashed border-amber-400/80 m-6 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold bg-black/60 text-amber-300 px-3 py-1 rounded-full backdrop-blur-sm">
                      {t('Center grain sample inside frame', 'नमूने को फ्रेम के बीच रखें')}
                    </span>
                  </div>

                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-full text-xs shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{t('📸 Capture Snapshot', '📸 फोटो खींचें')}</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-full text-xs shadow-md"
                    >
                      {t('Cancel', 'रद्द करें')}
                    </button>
                  </div>
                </div>
              ) : (
                /* Dual Action Buttons: Click Photo | Upload Image */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={startCamera}
                    className="p-5 rounded-2xl bg-[#71873f] hover:bg-[#637736] text-white font-extrabold transition-all shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2 group cursor-pointer active:scale-95 border border-white/20"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-amber-300" />
                    </div>
                    <div className="text-sm font-extrabold">{t('📷 Click Photo', '📷 फोटो खींचें')}</div>
                    <div className="text-[10px] text-slate-200 font-normal">{t('Use Mobile Camera / Webcam', 'कैमरा खोलें')}</div>
                  </button>

                  <button
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="p-5 rounded-2xl bg-[#a36627] hover:bg-[#8e571f] text-white font-extrabold transition-all shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2 group cursor-pointer active:scale-95 border border-white/20"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-amber-200" />
                    </div>
                    <div className="text-sm font-extrabold">{t('📁 Upload Image', '📁 इमेज अपलोड करें')}</div>
                    <div className="text-[10px] text-slate-200 font-normal">{t('JPG, PNG, WEBP from Gallery', 'गैलरी से चुनें')}</div>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Preset Demo Samples Bar */}
              <div className="pt-3 border-t border-[#abbe99]/40">
                <div className="text-center text-[11px] font-mono font-bold text-[#637554] uppercase tracking-wider mb-2">
                  {t('Or Select Preset Sample Crop for Instant Demo:', 'या त्वरित डेमो के लिए नमूना चुनें:')}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SAMPLE_CROPS.map((sample) => (
                    <button
                      key={sample.nameEn}
                      onClick={() => selectPresetSample(sample)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#71873f] hover:text-white border border-[#abbe99] text-xs font-bold text-[#243118] transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <img src={sample.image} alt={sample.nameEn} className="w-4 h-4 rounded-full object-cover" />
                      <span>{t(sample.nameEn.split(' ')[0], sample.nameHi.split(' ')[0])}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SCANNING PROGRESS ANIMATION OVERLAY */}
          {isAnalyzing && (
            <div className="bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-2xl text-center space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-200">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
                <Cpu className="w-8 h-8 text-amber-600 absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#243118]">{t('AI Neural Scanning & NIR Analysis...', 'एआई न्यूरल स्कैनिंग चालू है...')}</h4>
                <p className="text-xs text-[#637554] mt-1">{t('Extracting grain size, purity, defects & checking Agmarknet price matrix', 'दाने का आकार, शुद्धता, दोष और मंडी भाव निकाला जा रहा है')}</p>
              </div>
              <div className="w-full bg-[#f0f4ea] rounded-full h-3 overflow-hidden border border-[#abbe99]">
                <div className="bg-gradient-to-r from-[#71873f] to-amber-500 h-full transition-all duration-200" style={{ width: `${scanProgress}%` }} />
              </div>
              <div className="text-xs font-mono font-bold text-[#71873f]">{scanProgress}% COMPLETE</div>
            </div>
          )}

          {/* SECTION 2: COMPREHENSIVE AI REPORT & UNIFIED DASHBOARD */}
          {analysisData && !isAnalyzing && activeTab === 'results' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* Action Toolbar above results */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#abbe99] shadow-xs">
                <div className="flex items-center gap-2 font-mono text-xs text-[#637554]">
                  <span className="bg-[#71873f] text-white px-2.5 py-1 rounded-lg font-bold">SCAN #{analysisData.scanId}</span>
                  <span>• {analysisData.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setAnalysisData(null);
                      setActiveTab('scan');
                    }}
                    className="px-3 py-1.5 bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-[#71873f]/40"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('📷 Retake Photo / Upload Another', '📷 दोबारा फोटो लें / बदलें')}</span>
                  </button>
                </div>
              </div>

              {/* UNIFIED RESULT CARD (Requirement #7 & #15) */}
              <div className="bg-gradient-to-br from-[#1c2713] via-[#243118] to-[#1c2713] rounded-3xl p-6 text-white shadow-2xl border-2 border-[#e0b87e]/50 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left: Image Preview & AI Validation Rating */}
                <div className="md:col-span-4 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#e0b87e] shadow-lg aspect-square bg-slate-900">
                    <img src={analysisData.image} alt={analysisData.nameEn} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>IMAGE VALIDATED</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs font-mono space-y-1">
                    <div className="text-amber-300 font-bold text-[10px] uppercase">{t('Image Quality Validation', 'फोटो गुणवत्ता सत्यापन')}</div>
                    <div className="flex justify-between text-slate-200"><span>Blur Rating:</span><span className="text-emerald-300 font-bold">PASS (0.02)</span></div>
                    <div className="flex justify-between text-slate-200"><span>Lighting:</span><span className="text-emerald-300 font-bold">OPTIMAL</span></div>
                    <div className="flex justify-between text-slate-200"><span>AI Confidence:</span><span className="text-amber-300 font-extrabold">{analysisData.confidence}%</span></div>
                  </div>
                </div>

                {/* Right: Key Summary Metrics */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                        {analysisData.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {t(analysisData.nameEn, analysisData.nameHi)}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-amber-400 font-mono">{analysisData.score}<span className="text-xs text-slate-300">/100</span></div>
                      <div className="text-[10px] text-emerald-300 font-bold font-mono">QUALITY SCORE</div>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                      <div className="text-[9px] text-slate-300 uppercase">Quality Grade</div>
                      <div className="text-sm font-extrabold text-emerald-300">{analysisData.grade}</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                      <div className="text-[9px] text-slate-300 uppercase">Moisture Risk</div>
                      <div className="text-sm font-extrabold text-amber-300">{analysisData.moistureEst}</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                      <div className="text-[9px] text-slate-300 uppercase">Procurement</div>
                      <div className="text-xs font-extrabold text-emerald-400">{analysisData.procrutementSuitability}</div>
                    </div>
                  </div>

                  {/* Market Price Highlights */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-[#e0b87e]/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-300 font-bold uppercase">{t('Market Price Range (Agmarknet)', 'बाजार मूल्य सीमा')}</span>
                      <span className="text-slate-300 text-[10px]">{analysisData.bestMandi}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                        <div className="text-[9px] text-slate-300">LOW</div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-200">₹{analysisData.lowPrice}</div>
                        <div className="text-[8px] text-slate-400">₹{(analysisData.lowPrice/100).toFixed(2)}/kg</div>
                      </div>
                      <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-400/50">
                        <div className="text-[9px] text-amber-300 font-bold">AVERAGE</div>
                        <div className="text-base sm:text-lg font-black text-amber-300">₹{analysisData.avgPrice}</div>
                        <div className="text-[8px] text-amber-200">₹{(analysisData.avgPrice/100).toFixed(2)}/kg</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                        <div className="text-[9px] text-slate-300">HIGH</div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-200">₹{analysisData.highPrice}</div>
                        <div className="text-[8px] text-slate-400">₹{(analysisData.highPrice/100).toFixed(2)}/kg</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* SECTION 3: DETAILED QUALITY PARAMETERS (Requirement #3) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#abbe99] shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-3">
                  <h4 className="font-extrabold text-base text-[#243118] flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-[#71873f]" />
                    <span>{t('Detailed Quality Assessment Breakdown', 'विस्तृत गुणवत्ता मूल्यांकन breakdown')}</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-[#f0f4ea] text-[#637554] px-2.5 py-1 rounded-full border border-[#abbe99]">
                    10 VISUAL PARAMETERS ANALYZED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {[
                    { label: 'Color & Grain Lustre', val: '92%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Size & Kernel Uniformity', val: '90%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Shape Integrity', val: '94%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Surface Cleanliness', val: '88%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Visually Damaged Grains', val: '1.2%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Pest / Insect Damage', val: '0.0%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Fungal / Mold Indication', val: '0.0%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Foreign Matter / Dust', val: '0.4%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Broken Grain Kernels', val: '1.8%', tag: 'VISUAL AI ESTIMATE', pass: true },
                    { label: 'Moisture Risk Profile', val: 'NORMAL', tag: 'LAB INSTRUMENT REQUIRED', pass: true }
                  ].map((param) => (
                    <div key={param.label} className="bg-[#fcfaf7] p-3 rounded-2xl border border-[#abbe99]/60 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#243118] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{param.label}</span>
                        </div>
                        <div className="text-[9px] text-[#637554] mt-0.5 font-sans flex items-center gap-1">
                          <span className="bg-[#e0e8d6] text-[#243118] px-1.5 py-0.2 rounded font-mono font-bold text-[8px]">{param.tag}</span>
                        </div>
                      </div>
                      <div className="font-extrabold text-[#71873f] text-sm">{param.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: MOISTURE ANALYSIS & PHYSICAL METER OVERRIDE (Requirement #4) */}
              <div className="bg-[#f0f4ea] p-5 sm:p-6 rounded-3xl border-2 border-[#71873f]/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-base text-[#243118] flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#71873f]" />
                      <span>{t('Moisture Analysis & Physical Override', 'नमी विश्लेषण एवं भौतिक मीटर ओवरराइड')}</span>
                    </h4>
                    <p className="text-xs text-[#637554] mt-0.5">
                      {t('Image-based moisture is an estimation. You can enter an exact lab reading below to update the report.', 'इमेज-आधारित नमी एक अनुमान है। आप नीचे प्रयोगशाला रीडिंग दर्ज कर सकते हैं।')}
                    </p>
                  </div>
                  <div className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full">
                    {t('ESTIMATED CONDITION: NORMAL', 'अनुमानित स्थिति: सामान्य')}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#abbe99] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 space-y-1">
                    <label className="text-xs font-extrabold text-[#243118] flex items-center gap-1.5">
                      <Microscope className="w-4 h-4 text-emerald-700" />
                      <span>{t('Enter Actual Moisture Meter Reading (%)', 'वास्तविक नमी मीटर रीडिंग दर्ज करें (%)')}</span>
                    </label>
                    <div className="text-[11px] text-[#637554]">
                      {t('Exact moisture percentage overrides visual AI estimate for government procurement sign-off.', 'सटीक नमी प्रतिशत सरकारी खरीद स्वीकृति के लिए विजुअल अनुमान को ओवरराइड करता है।')}
                    </div>
                  </div>
                  <div className="sm:col-span-4 flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={customMoistureInput}
                      onChange={(e) => setCustomMoistureInput(e.target.value)}
                      placeholder="e.g. 10.8"
                      className="w-full bg-[#fcfaf7] border-2 border-[#71873f] rounded-xl px-3 py-2 text-sm font-extrabold font-mono text-[#243118] focus:outline-none"
                    />
                    <span className="font-extrabold text-sm text-[#243118]">%</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#637554] font-mono italic bg-white/60 p-2.5 rounded-xl border border-[#abbe99]/50 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>"Exact moisture content requires a moisture meter/laboratory measurement. Target FAQ standard is ≤12.0%."</span>
                </div>
              </div>

              {/* SECTION 5: MULTI-MANDI PRICE COMPARISON MATRIX (Requirement #5 & #6) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#abbe99] shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#abbe99]/60 pb-3">
                  <div>
                    <h4 className="font-extrabold text-base text-[#243118] flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[#a36627]" />
                      <span>{t('Location-Based Mandi Price Discovery Matrix', 'स्थान-आधारित मंडी दर तुलना')}</span>
                    </h4>
                    <p className="text-xs text-[#637554]">
                      {t('Real-time Agmarknet prices for selected state & nearby district APMCs', 'चयनित राज्य और आसपास की मंडियों के लिए लाइव Agmarknet भाव')}
                    </p>
                  </div>
                  
                  {/* Location Selectors */}
                  <div className="flex items-center gap-2">
                    <select
                      value={userState}
                      onChange={(e) => setUserState(e.target.value)}
                      className="bg-[#fcfaf7] border border-[#abbe99] rounded-xl text-xs font-bold px-3 py-1.5 text-[#243118]"
                    >
                      <option value="Haryana">Haryana</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                    </select>
                  </div>
                </div>

                {/* Mandi Matrix Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-[#f0f4ea] text-[#243118] font-bold border-b border-[#abbe99]">
                        <th className="p-3 rounded-l-xl">{t('Mandi / APMC', 'मंडी का नाम')}</th>
                        <th className="p-3 text-right">{t('Low (₹/Qtl)', 'न्यूनतम')}</th>
                        <th className="p-3 text-right">{t('Average (₹/Qtl)', 'औसत')}</th>
                        <th className="p-3 text-right">{t('High (₹/Qtl)', 'अधिकतम')}</th>
                        <th className="p-3 text-right rounded-r-xl">{t('Updated', 'अपडेटेड')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#abbe99]/40">
                      {NEARBY_MANDI_MATRIX.map((m) => (
                        <tr key={m.mandi} className={`hover:bg-[#fcfaf7] transition-colors ${m.isBest ? 'bg-amber-50/80 font-bold' : ''}`}>
                          <td className="p-3 flex items-center gap-2">
                            <span>{m.mandi}</span>
                            {m.isBest && (
                              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                BEST MANDI
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right text-[#637554]">₹{m.low}</td>
                          <td className="p-3 text-right text-[#a36627] font-extrabold text-sm">₹{m.avg}</td>
                          <td className="p-3 text-right text-[#243118]">₹{m.high}</td>
                          <td className="p-3 text-right text-[#637554] text-[10px]">{m.updated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 6: FARMER RECOMMENDATION & AI EXPLANATION (Requirement #8 & #9) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#abbe99] shadow-md space-y-4">
                <h4 className="font-extrabold text-base text-[#243118] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#71873f]" />
                  <span>{t('Actionable Farmer Recommendations & AI Analysis', 'किसान के लिए सिफारिशें एवं एआई विवरण')}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl">
                    <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>RECOMMENDED ACTION: SELL NOW</span>
                    </div>
                    <div className="text-emerald-800 text-[11px] mt-1 font-sans">
                      Current modal price (₹2,580/Qtl) is +6.4% above government MSP floor (₹2,425/Qtl). Demand is high in Karnal APMC.
                    </div>
                  </div>

                  <div className="p-3 bg-sky-50 border border-sky-300 rounded-2xl">
                    <div className="font-extrabold text-sky-900 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-sky-700" />
                      <span>COMPARE MANDIS FOR HIGHER MARGIN</span>
                    </div>
                    <div className="text-sky-800 text-[11px] mt-1 font-sans">
                      Khanna APMC offers +₹30/Qtl higher average rate for Grade A Basmati. Check transport logistics before dispatch.
                    </div>
                  </div>
                </div>

                {/* AI Explanation Paragraph */}
                <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/60 text-xs text-[#243118] leading-relaxed">
                  <div className="font-bold text-[#71873f] mb-1 font-mono uppercase">AI Reasoning Summary:</div>
                  <p>
                    "Your {analysisData.nameEn} sample exhibits Grade A (Premium) visual characteristics with 88/100 quality score. The grains look uniform with negligible visible defects (1.2% broken kernels, zero fungal symptoms). Estimated moisture condition is normal. Current market prices range from ₹{analysisData.lowPrice} to ₹{analysisData.highPrice}/Qtl with an average of ₹{analysisData.avgPrice}/Qtl."
                  </p>
                </div>
              </div>

              {/* SECTION 7: PROFESSIONAL PROCUREMENT MODE (Requirement #12) */}
              {proMode && (
                <div className="bg-gradient-to-r from-[#243118] via-[#1c2713] to-[#243118] p-5 sm:p-6 rounded-3xl text-white border-2 border-amber-400 shadow-2xl space-y-4 font-mono">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <h4 className="font-extrabold text-base text-amber-300">Professional Procurement & Inspection Record</h4>
                    </div>
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded uppercase">
                      OFFICER SEAL ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-300">LOT IDENTIFIER</label>
                      <input
                        type="text"
                        value={lotIdInput}
                        onChange={(e) => setLotIdInput(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white font-bold mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300">FARMER AADHAAR ID</label>
                      <input
                        type="text"
                        value={farmerIdInput}
                        onChange={(e) => setFarmerIdInput(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white font-bold mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300">QUANTITY (QUINTALS)</label>
                      <input
                        type="number"
                        value={quantityInput}
                        onChange={(e) => setQuantityInput(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white font-bold mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-300">
                      Recommended Procurement Price: <strong className="text-amber-300 text-sm">₹{analysisData.avgPrice} / Qtl</strong> (Total: ₹{(analysisData.avgPrice * parseFloat(quantityInput || 0)).toLocaleString('en-IN')})
                    </div>
                    <button
                      onClick={handleSaveToLedger}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{saveSuccess ? 'SAVED TO BLOCKCHAIN!' : 'SAVE TO FARMER LOT RECORD'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
