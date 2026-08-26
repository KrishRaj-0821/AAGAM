import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  Send, 
  RotateCcw, 
  Check, 
  Copy, 
  Languages, 
  Waves,
  Sprout,
  QrCode,
  Coins,
  Microscope,
  Scale,
  PhoneCall,
  Building2
} from 'lucide-react';

// Domain Knowledge Base for Intelligent Multi-Lingual Agricultural Q&A
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['msp', 'wheat', 'gehu', 'paddy', 'dhan', 'price', 'rate', 'bhav', 'मूल्य', 'भाव', 'गेहूं', 'धान', 'एमएसपी', 'सरसों'],
    responseEn: "The 2026-27 Minimum Support Price (MSP) approved by the Cabinet is ₹2,425/quintal for Wheat (Sharbati ₹2,850), ₹2,320/quintal for Paddy Common (Grade A ₹2,360), ₹3,425 for Mustard, and ₹6,600 for Gram (Chana). All payments are credited directly to your bank account via DBT within 48 hours of mandi weighment acceptance.",
    responseHi: "कैबिनेट द्वारा स्वीकृत 2026-27 का न्यूनतम समर्थन मूल्य (MSP) गेहूं के लिए ₹2,425 प्रति क्विंटल (शरबती ₹2,850), धान सामान्य के लिए ₹2,320 प्रति क्विंटल (ग्रेड ए ₹2,360), सरसों के लिए ₹3,425 और चना के लिए ₹6,600 है। तुलाई के 48 घंटों के भीतर डीबीटी के माध्यम से पूरा भुगतान सीधे आपके बैंक खाते में भेजा जाता है।"
  },
  {
    keywords: ['gate pass', 'slot', 'booking', 'qr', 'token', 'book', 'स्लॉट', 'गेट पास', 'टोकन', 'बुकिंग'],
    responseEn: "To book a Mandi Gate Pass, click the 'Gate Pass' button in the top navigation bar or your Farmer Portal. Select your State, District, Mandi, Crop, Estimated Quantity, and preferred arrival slot. You will receive an instant verified QR Token with a secure Gate Pass for automated entry at the weighbridge.",
    responseHi: "मंडी गेट पास बुक करने के लिए, मुख्य नेविगेशन बार में 'गेट पास' विकल्प या किसान पोर्टल पर जाएं। अपना राज्य, जिला, मंडी, फसल, वजन और समय स्लॉट चुनें। आपको तुरंत एक सत्यापित क्यूआर टोकन और डिजिटल गेट पास प्राप्त होगा।"
  },
  {
    keywords: ['dbt', 'payment', 'paisa', 'account', 'bank', 'utr', 'भुगतान', 'पैसा', 'खाता', 'डीबीटी', 'पैसे'],
    responseEn: "AAGAM guarantees automated Direct Benefit Transfer (DBT) directly from the State Procurement Agency to your Aadhaar-linked bank account. You can track your payment status in real time using the 'Payment Status' option with your Farmer ID or Gate Pass Token number.",
    responseHi: "आगामी पोर्टल के माध्यम से खरीद की राशि सीधे आपके आधार से जुड़े बैंक खाते में डीबीटी द्वारा 48 घंटे में स्थानांतरित की जाती है। आप अपने किसान आईडी या गेट पास टोकन नंबर से 'भुगतान स्थिति' विकल्प में जाकर लाइव स्थिति देख सकते हैं।"
  },
  {
    keywords: ['moisture', 'quality', 'faq', 'grading', 'limit', 'नमी', 'गुणवत्ता', 'मानक', 'जांच', 'ग्रेडिंग'],
    responseEn: "According to Government of India Fair Average Quality (FAQ) norms, grain moisture must be 12% or below (maximum permissible 14% with standard deduction). Foreign matter must not exceed 0.75% and damaged grains must be below 2%. Mandi NIR spectrometers verify your grain quality in under 60 seconds.",
    responseHi: "भारत सरकार के एफएक्यू (FAQ) मानकों के अनुसार, खाद्यान्न में नमी 12% या उससे कम होनी चाहिए (अधिकतम 14% तक कटौती के साथ)। बाह्य पदार्थ 0.75% से कम और क्षतिग्रस्त दाने 2% से कम होने चाहिए। मंडी में एनआईआर स्पेक्ट्रोमीटर 60 सेकंड में सटीक परिणाम देते हैं।"
  },
  {
    keywords: ['auction', 'bid', 'e-nam', 'enam', 'trade', 'buyer', 'नीलामी', 'बोली', 'व्यापारी', 'खरीदार'],
    responseEn: "The AAGAM e-Auction platform integrates directly with national e-NAM mandis. Registered buyers and private traders place competitive transparent bids in live rounds. Farmers can accept the highest bid with one click or choose government MSP procurement if market price is lower.",
    responseHi: "आगामी ई-नीलामी प्लेटफॉर्म राष्ट्रीय ई-नाम मंडियों से सीधे जुड़ा है। पंजीकृत खरीदार पारदर्शी बोली लगाते हैं। किसान उच्चतम बोली को एक क्लिक में स्वीकार कर सकते हैं या यदि बाजार भाव कम हो तो सरकारी एमएसपी का चयन कर सकते हैं।"
  },
  {
    keywords: ['logistics', 'transport', 'truck', 'driver', 'freight', 'लॉजिस्टिक्स', 'ट्रक', 'गाड़ी', 'परिवहन'],
    responseEn: "AAGAM GPS-enabled Agri Freight Logistics connects 8,500+ verified trucks and tractor trolleys. Farmers and Mandi Operators can request instant transport pickups with live route tracking, digital toll clearances, and direct weight synchronization with warehouse silos.",
    responseHi: "आगामी जीपीएस-सक्षम कृषि फ्रेट लॉजिस्टिक्स 8,500 से अधिक सत्यापित ट्रकों से जुड़ा है। किसान और मंडी संचालक लाइव रूट ट्रैकिंग और वेयरहाउस सिंक के साथ तत्काल वाहन बुक कर सकते हैं।"
  },
  {
    keywords: ['warehouse', 'storage', 'silo', 'capacity', 'गोदाम', 'भंडारण', 'साइलो'],
    responseEn: "We monitor 1,420 state and central warehousing corporation (CWC/SWC) silos in real time. Storage conditions feature IoT temperature and humidity sensors with automated pest control and electronic warehouse receipts (e-NWR) for easy bank pledging.",
    responseHi: "हम 1,420 केंद्रीय एवं राज्य वेयरहाउसिंग साइलो की लाइव क्षमता की निगरानी करते हैं। इसमें आईओटी तापमान, इलेक्ट्रॉनिक रसीद (e-NWR) और सुरक्षित भंडारण की सुविधा उपलब्ध है।"
  },
  {
    keywords: ['help', 'complaint', 'grievance', 'officer', 'contact', 'शिकायत', 'मदद', 'अधिकारी', 'संपर्क'],
    responseEn: "For official complaints or officer escalations, you can submit a grievance in the Helpdesk section. Every ticket is assigned an official GOI tracking ID with a mandatory 4-hour resolution SLA for gate delays or weighment disputes.",
    responseHi: "किसी भी आधिकारिक शिकायत या सहायता के लिए आप हेल्पडेस्क में टिकट दर्ज कर सकते हैं। प्रत्येक शिकायत को 4 घंटे के भीतर निवारण के लिए संबंधित जिला कृषि अधिकारी को भेजा जाता है।"
  }
];

export default function VoiceAgentModal({
  isOpen,
  onClose,
  language = 'en',
  t
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [activeLang, setActiveLang] = useState(language);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [messages, setMessages] = useState([]);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);

  // Initialize welcome message matching the active language
  useEffect(() => {
    setActiveLang(language);
  }, [language]);

  useEffect(() => {
    setMessages([
      {
        sender: 'agent',
        text: activeLang === 'hi' 
          ? "नमस्ते! मैं आपका आगामी (AAGAM) किसान एआई सहायक हूँ। आप मुझसे एमएसपी भाव, मंडी गेट पास स्लॉट, डीबीटी भुगतान स्थिति, अनाज की गुणवत्ता मानक या ई-नीलामी के बारे में बोलकर या लिखकर पूछ सकते हैं।"
          : "Hello! I am your AAGAM Kisan AI Voice Assistant. You can ask me about MSP crop rates, Mandi Gate Pass booking, DBT payment status, grain quality FAQ norms, or live e-Auctions.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeLang]);

  // Auto scroll transcript to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, isSpeaking]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = activeLang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [activeLang]);

  if (!isOpen) return null;

  // Speak agent response using Web Speech API fallback
  const speakText = (text, langCode = 'hi-IN') => {
    if (audioMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => 
        (langCode.startsWith('hi') && v.lang.includes('hi')) || 
        (!langCode.startsWith('hi') && (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en')))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('TTS playback error:', err);
      setIsSpeaking(false);
    }
  };

  // Process user question and generate intelligent response
  const handleProcessQuery = (userQuery) => {
    if (!userQuery.trim()) return;

    const newMsg = {
      sender: 'user',
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setTranscript('');

    const lower = userQuery.toLowerCase();
    const bestMatch = KNOWLEDGE_RESPONSES.find(item => 
      item.keywords.some(kw => lower.includes(kw.toLowerCase()))
    );

    const isHindi = activeLang === 'hi' || /[\u0900-\u097F]/.test(userQuery);
    let replyText = '';

    if (bestMatch) {
      replyText = isHindi ? bestMatch.responseHi : bestMatch.responseEn;
    } else {
      replyText = isHindi
        ? `आगामी (AAGAM) पोर्टल पर आपकी क्वेरी दर्ज कर ली गई है। आप न्यूनतम समर्थन मूल्य (MSP), मंडी गेट पास, डीबीटी भुगतान और अनाज गुणवत्ता जांच से संबंधित सवाल पूछ सकते हैं।`
        : `I have received your query for the AAGAM National Grain Management Portal. You can ask me regarding MSP rates, Mandi Gate Pass booking, DBT bank transfers, and grain moisture specifications.`;
    }

    setTimeout(() => {
      const agentMsg = {
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      speakText(replyText, isHindi ? 'hi-IN' : 'en-IN');
    }, 450);
  };

  // Toggle Voice Recording
  const toggleListening = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      if (transcript.trim()) {
        handleProcessQuery(transcript);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn(e);
        }
      } else {
        alert(activeLang === 'hi' ? 'आपका ब्राउज़र माइक्रोफ़ोन सपोर्ट नहीं करता। कृपया लिखकर पूछें।' : 'Speech recognition is not supported in this browser. Please type your query.');
      }
    }
  };

  // Trigger ElevenLabs Official ConvAI Floating Widget
  const triggerElevenLabsLiveCall = () => {
    const widget = document.querySelector('elevenlabs-convai');
    if (widget && widget.shadowRoot) {
      const callBtn = widget.shadowRoot.querySelector('button');
      if (callBtn) {
        callBtn.click();
        onClose();
        return;
      }
    }
    toggleListening();
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearChat = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
    setIsListening(false);
    setMessages([
      {
        sender: 'agent',
        text: activeLang === 'hi'
          ? "नमस्ते! मैं आपका आगामी किसान एआई सहायक हूँ। आप मुझसे क्या पूछना चाहते हैं?"
          : "Hello! I am your AAGAM AI Kisan Assistant. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Main Glassmorphic Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#abbe99]/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#243118]">
        
        {/* Tricolor Official Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Clean Header Bar — Zero Technical Jargon */}
        <div className="bg-[#1a2512] text-white px-5 py-3.5 flex items-center justify-between gap-3 shadow-sm">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#71873f] to-[#e0b87e] p-0.5 flex items-center justify-center shadow shrink-0">
              <div className="w-full h-full bg-[#1a2512] rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#e0b87e]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                  {activeLang === 'hi' ? 'आगामी किसान AI सहायक' : 'AAGAM Kisan AI Assistant'}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>24x7 LIVE</span>
                </span>
              </div>
              <p className="text-[11px] text-[#abbe99] font-medium">
                {activeLang === 'hi' ? 'राष्ट्रीय डिजिटल कृषि वॉइस व चैट सहायता' : 'Official National Agricultural Voice & Chat Service'}
              </p>
            </div>
          </div>

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* Language Switch */}
            <button
              onClick={() => setActiveLang(activeLang === 'hi' ? 'en' : 'hi')}
              className="bg-white/10 hover:bg-white/20 text-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/15"
              title="Switch Voice Language (हिन्दी / English)"
            >
              <Languages className="w-3.5 h-3.5 text-[#e0b87e]" />
              <span>{activeLang === 'hi' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Mute Audio Toggle */}
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                setIsSpeaking(false);
                setAudioMuted(!audioMuted);
              }}
              className={`p-1.5 rounded-xl border transition-all ${
                audioMuted 
                  ? 'bg-red-500/20 border-red-500/40 text-red-300' 
                  : 'bg-white/10 border-white/15 text-slate-200 hover:text-white'
              }`}
              title={audioMuted ? 'Unmute Audio' : 'Mute Audio Speech'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#e0b87e]" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                setIsSpeaking(false);
                setIsListening(false);
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-red-600/90 text-slate-200 hover:text-white transition-all border border-white/15"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Compact Voice Interactive Bar */}
        <div className="bg-gradient-to-r from-[#f0f4ea] via-white to-[#f0f4ea] px-5 py-3.5 border-b border-[#abbe99]/40 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Pulsing Mic Button */}
            <button
              onClick={toggleListening}
              className={`relative w-12 h-12 rounded-2xl shadow-md flex items-center justify-center shrink-0 transition-all active:scale-95 border-2 ${
                isListening 
                  ? 'bg-red-500 border-red-300 text-white animate-pulse shadow-red-500/30' 
                  : isSpeaking
                  ? 'bg-[#71873f] border-emerald-300 text-white animate-pulse shadow-emerald-500/30'
                  : 'bg-[#71873f] hover:bg-[#5c6e33] border-[#abbe99] text-white shadow-emerald-700/20'
              }`}
              title={isListening ? 'Stop Listening' : 'Click to Speak'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : isSpeaking ? (
                <Waves className="w-5 h-5 text-white animate-pulse" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Voice Status & Live Visualizer */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold truncate ${
                  isListening ? 'text-red-600 animate-pulse' : isSpeaking ? 'text-[#71873f]' : 'text-[#243118]'
                }`}>
                  {isListening 
                    ? (activeLang === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening to your voice...') 
                    : isSpeaking 
                    ? (activeLang === 'hi' ? 'आगामी एआई उत्तर दे रहा है...' : 'AAGAM AI is speaking...') 
                    : (activeLang === 'hi' ? 'माइक दबाकर बोलें या सवाल चुनें' : 'Tap mic to talk or choose a topic')}
                </span>

                {/* Animated Wave Bars */}
                {(isListening || isSpeaking) && (
                  <div className="flex items-center gap-1 h-3 shrink-0">
                    {[40, 90, 60, 100, 75, 45, 85].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`w-0.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-[#71873f] animate-pulse'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Interim Real-time Transcript if active */}
              {transcript ? (
                <div className="text-[11px] font-bold text-[#71873f] truncate mt-0.5">
                  "{transcript}"
                </div>
              ) : (
                <p className="text-[11px] text-[#637554] truncate mt-0.5">
                  {activeLang === 'hi' ? 'गेहूं/धान भाव, गेट पास, डीबीटी, गुणवत्ता' : 'Ask about MSP rates, Gate Pass, DBT & quality'}
                </p>
              )}
            </div>
          </div>

          {/* Quick Direct Live Call Button */}
          <button
            onClick={triggerElevenLabsLiveCall}
            className="hidden sm:flex items-center gap-1.5 bg-[#a36627] hover:bg-[#804d19] text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-all shrink-0"
            title="Start Direct Live Voice Call"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{activeLang === 'hi' ? 'लाइव AI कॉल' : 'Live AI Call'}</span>
          </button>

        </div>

        {/* Suggested Quick Question Chips */}
        <div className="px-5 py-2.5 bg-[#fcfaf7] border-b border-[#abbe99]/40">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 text-xs">
            <span className="text-[10px] font-bold uppercase text-[#637554] shrink-0">
              {activeLang === 'hi' ? 'त्वरित सवाल:' : 'Suggested:'}
            </span>

            {[
              {
                icon: Sprout,
                color: 'text-emerald-700',
                en: 'What is the 2026 MSP for Wheat & Paddy?',
                hi: 'गेहूं और धान का 2026-27 एमएसपी क्या है?',
                labelEn: 'Wheat & Paddy MSP',
                labelHi: 'गेहूं/धान MSP भाव'
              },
              {
                icon: QrCode,
                color: 'text-amber-700',
                en: 'How do I book a Mandi Gate Pass slot?',
                hi: 'मंडी गेट पास स्लॉट कैसे बुक करें?',
                labelEn: 'Gate Pass Slot',
                labelHi: 'गेट पास स्लॉट'
              },
              {
                icon: Coins,
                color: 'text-amber-600',
                en: 'When will my DBT payment arrive in bank account?',
                hi: 'डीबीटी भुगतान खाते में कब आएगा?',
                labelEn: 'DBT Payment Status',
                labelHi: 'डीबीटी भुगतान'
              },
              {
                icon: Microscope,
                color: 'text-sky-700',
                en: 'What are the grain moisture & quality FAQ limits?',
                hi: 'अनाज में नमी और गुणवत्ता मानक क्या हैं?',
                labelEn: 'Moisture FAQ Norms',
                labelHi: 'नमी व गुणवत्ता मानक'
              },
              {
                icon: Scale,
                color: 'text-emerald-700',
                en: 'How does e-NAM live bidding and auction work?',
                hi: 'ई-नीलामी में बोली कैसे लगाएं?',
                labelEn: 'e-NAM Bidding',
                labelHi: 'ई-नीलामी व बोली'
              },
              {
                icon: Building2,
                color: 'text-indigo-700',
                en: 'Tell me about warehouse storage capacity.',
                hi: 'वेयरहाउस साइलो भंडारण की जानकारी दें।',
                labelEn: 'Warehouse Storage',
                labelHi: 'वेयरहाउस साइलो'
              }
            ].map((chip, idx) => {
              const IconComp = chip.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleProcessQuery(activeLang === 'hi' ? chip.hi : chip.en)}
                  className="px-2.5 py-1 bg-white hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99]/80 hover:border-[#71873f] rounded-xl text-[11px] font-bold transition-all shrink-0 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <IconComp className={`w-3 h-3 ${chip.color}`} />
                  <span>{activeLang === 'hi' ? chip.labelHi : chip.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Conversation Transcript Feed — Expanded Height */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[360px] bg-[#fafcf8]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 duration-150`}
            >
              {msg.sender === 'agent' && (
                <div className="w-7 h-7 rounded-xl bg-[#71873f] text-white flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1.5 shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#71873f] text-white rounded-tr-none font-semibold'
                    : 'bg-white text-[#243118] border border-[#abbe99]/60 rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 font-mono pt-1 border-t border-black/5">
                  <span>{msg.time}</span>
                  <div className="flex items-center gap-2">
                    {msg.sender === 'agent' && (
                      <button
                        onClick={() => speakText(msg.text, activeLang === 'hi' ? 'hi-IN' : 'en-IN')}
                        className="hover:opacity-100 hover:text-[#71873f] transition-opacity p-0.5"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="hover:opacity-100 hover:text-[#71873f] transition-opacity p-0.5"
                      title="Copy message"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Clean Text Input Bar */}
        <div className="p-3 bg-[#fcfaf7] border-t border-[#abbe99]/40 flex items-center gap-2">
          
          <button
            onClick={clearChat}
            className="p-2.5 rounded-xl bg-white border border-[#abbe99] hover:bg-[#f0f4ea] text-[#637554] transition-colors shrink-0"
            title={activeLang === 'hi' ? 'बातचीत रीसेट करें' : 'Reset Conversation'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.queryInput;
              if (input && input.value.trim()) {
                handleProcessQuery(input.value.trim());
                input.value = '';
              }
            }}
            className="flex-1 flex gap-2"
          >
            <input
              name="queryInput"
              type="text"
              placeholder={activeLang === 'hi' ? 'यहाँ सवाल लिखकर पूछें (उदा. गेहूं का एमएसपी क्या है?)...' : 'Type your question here (e.g. wheat MSP rate)...'}
              className="flex-1 bg-white border border-[#abbe99] rounded-xl px-3.5 py-2.5 text-xs text-[#243118] placeholder-[#637554] focus:outline-none focus:border-[#71873f] font-medium shadow-2xs"
            />
            <button
              type="submit"
              className="bg-[#71873f] hover:bg-[#5c6e33] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeLang === 'hi' ? 'भेजें' : 'Send'}</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
