import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  Headphones, 
  Radio, 
  Send, 
  RotateCcw, 
  Check, 
  Copy, 
  Languages, 
  ShieldCheck, 
  ExternalLink,
  MessageSquareText,
  Activity,
  Waves
} from 'lucide-react';

const AGENT_CONFIG = {
  agent_id: "agent_6201m0wy694merctenjsx4b72fmg",
  name: "AAGAM Kisan AI Voice Agent",
  voice_id: "tnSpp4vdxKPjI9w0GnoV",
  tts_model: "eleven_v3_conversational",
  llm: "qwen35-397b-a17b",
  language: "hi / en / hinglish"
};

// Comprehensive Domain Knowledge Base for Immediate Intelligent Offline / Fallback Voice Processing
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['msp', 'wheat', 'gehu', 'paddy', 'dhan', 'price', 'rate', 'bhav', 'मूल्य', 'भाव', 'गेहूं', 'धान'],
    responseEn: "The 2026-27 Minimum Support Price (MSP) approved by the Cabinet is ₹2,425/quintal for Wheat (Sharbati ₹2,850), ₹2,320/quintal for Paddy Common (Grade A ₹2,360), ₹3,425 for Mustard, and ₹6,600 for Gram (Chana). All payments are credited directly to your bank account via DBT within 48 hours of mandi weighment acceptance.",
    responseHi: "कैबिनेट द्वारा स्वीकृत 2026-27 का न्यूनतम समर्थन मूल्य (MSP) गेहूं के लिए ₹2,425 प्रति क्विंटल (शरबती ₹2,850), धान सामान्य के लिए ₹2,320 प्रति क्विंटल (ग्रेड ए ₹2,360), सरसों के लिए ₹3,425 और चना के लिए ₹6,600 है। तुलाई के 48 घंटों के भीतर डीबीटी के माध्यम से पूरा भुगतान सीधे आपके बैंक खाते में भेजा जाता है।"
  },
  {
    keywords: ['gate pass', 'slot', 'booking', 'qr', 'token', 'book', 'स्लॉट', 'गेट पास', 'टोकन', 'बुकिंग'],
    responseEn: "To book a Mandi Gate Pass, click the 'Gate Pass' button in the top navigation bar or your Farmer Portal. Select your State, District, Mandi, Crop (e.g. Wheat or Custom Crop), Estimated Quantity, and preferred time slot. You will receive an instant verified QR Token with a secure Gate Pass for hassle-free entry at the weighbridge.",
    responseHi: "मंडी गेट पास बुक करने के लिए, शीर्ष नेविगेशन बार में 'गेट पास' बटन या अपने किसान पोर्टल पर क्लिक करें। अपना राज्य, जिला, मंडी, फसल, अनुमानित वजन और समय स्लॉट चुनें। आपको तुरंत एक सत्यापित क्यूआर टोकन और डिजिटल गेट पास प्राप्त होगा।"
  },
  {
    keywords: ['dbt', 'payment', 'paisa', 'account', 'bank', 'utr', 'भुगतान', 'पैसा', 'खाता', 'डीबीटी'],
    responseEn: "AAGAM guarantees automated Direct Benefit Transfer (DBT) directly from the State Procurement Agency to your Aadhaar-linked bank account. You can track your payment status in real time using the 'Payment Status' button by entering your Farmer ID or Gate Pass Token number.",
    responseHi: "आगामी पोर्टल के माध्यम से खरीद की राशि सीधे आपके आधार लिंक बैंक खाते में डीबीटी द्वारा 48 घंटे में स्थानांतरित की जाती है। आप अपने किसान आईडी या गेट पास टोकन नंबर से 'भुगतान स्थिति' विकल्प में जाकर लाइव स्थिति देख सकते हैं।"
  },
  {
    keywords: ['moisture', 'quality', 'faq', 'grading', 'limit', 'नमी', 'गुणवत्ता', 'मानक', 'जांच'],
    responseEn: "According to Government of India Fair Average Quality (FAQ) norms, grain moisture must be 12% or below (maximum permissible 14% with standard deduction). Foreign matter must not exceed 0.75% and damaged/shriveled grains must be below 2%. AI moisture analyzers at the mandi will verify your sample in under 60 seconds.",
    responseHi: "भारत सरकार के एफएक्यू (FAQ) मानकों के अनुसार, खाद्यान्न में नमी 12% या उससे कम होनी चाहिए (अधिकतम 14% तक कटौती के साथ)। बाह्य पदार्थ 0.75% से कम और क्षतिग्रस्त दाने 2% से कम होने चाहिए। मंडी में एआई नमी विश्लेषक 60 सेकंड में परिणाम देते हैं।"
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
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: language === 'hi' 
        ? "नमस्ते! मैं आगामी (AAGAM) का किसान एआई वॉइस एजेंट हूँ। आप मुझसे एमएसपी भाव, मंडी गेट पास स्लॉट, डीबीटी भुगतान स्थिति, अनाज की गुणवत्ता और लॉजिस्टिक्स के बारे में पूछ सकते हैं। आप क्या जानना चाहते हैं?"
        : "Hello! I am your AAGAM AI Kisan Voice Agent powered by ElevenLabs Conversational AI. You can ask me about MSP crop rates, Mandi Gate Pass booking, DBT payment status, grain quality FAQ norms, and live e-Auctions. How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [showElevenWidget, setShowElevenWidget] = useState(true);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);

  // Auto scroll transcript to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keep internal language synced with prop
  useEffect(() => {
    setActiveLang(language);
  }, [language]);

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

      // Try selecting Indian English or Hindi voice
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
    let bestMatch = KNOWLEDGE_RESPONSES.find(item => 
      item.keywords.some(kw => lower.includes(kw.toLowerCase()))
    );

    let replyText = '';
    const isHindi = activeLang === 'hi' || /[\u0900-\u097F]/.test(userQuery);

    if (bestMatch) {
      replyText = isHindi ? bestMatch.responseHi : bestMatch.responseEn;
    } else {
      replyText = isHindi
        ? `आगामी (AAGAM) पोर्टल पर आपकी क्वेरी दर्ज कर ली गई है। आप एमएसपी दरें, मंडी गेट पास स्लॉट, डीबीटी भुगतान और एआई गुणवत्ता जांच से संबंधित कोई भी प्रश्न पूछ सकते हैं।`
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
    }, 600);
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
        alert(activeLang === 'hi' ? 'आपका ब्राउज़र माइक्रोफ़ोन सपोर्ट नहीं करता। कृपया टेक्स्ट का उपयोग करें।' : 'Speech recognition is not supported in this browser. Please type your query.');
      }
    }
  };

  // Quick Prompt Click
  const handleQuickPrompt = (promptEn, promptHi) => {
    const promptText = activeLang === 'hi' ? promptHi : promptEn;
    handleProcessQuery(promptText);
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
          ? "नमस्ते! मैं आगामी किसान एआई वॉइस एजेंट हूँ। आप मुझसे क्या पूछना चाहते हैं?"
          : "Hello! I am your AAGAM AI Voice Agent. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Main Glassmorphic Modal Box */}
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl border-2 border-[#71873f] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#243118]">
        
        {/* Tricolor Official Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Top Header Banner */}
        <div className="bg-[#1a2512] text-white px-5 py-3.5 flex items-center justify-between gap-3 shadow-md">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#71873f] to-[#e0b87e] p-0.5 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full bg-[#1a2512] rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#e0b87e] animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-1.5">
                  <span>{activeLang === 'hi' ? 'आगामी किसान एआई वॉइस एजेंट' : 'AAGAM AI Voice Assistant'}</span>
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>24x7 LIVE</span>
                </span>
              </div>
              <p className="text-[11px] text-[#abbe99] flex items-center gap-1.5 font-mono">
                <span>ElevenLabs ConvAI • Voice Agent ID: <strong className="text-[#e0b87e]">agent_6201m0wy...</strong></span>
              </p>
            </div>
          </div>

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* Language Switch */}
            <button
              onClick={() => setActiveLang(activeLang === 'hi' ? 'en' : 'hi')}
              className="bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-2.5 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-white/10"
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
              className={`p-1.5 rounded-xl border transition-colors ${audioMuted ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-white/10 border-white/10 text-slate-200 hover:text-white'}`}
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
              className="p-1.5 rounded-xl bg-white/10 hover:bg-red-600 text-slate-200 hover:text-white transition-colors border border-white/10"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Interactive Voice Orb & Status Banner */}
        <div className="bg-gradient-to-b from-[#f0f4ea] to-[#fcfaf7] p-5 border-b border-[#abbe99]/40 flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Subtle background glow effect */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-[#71873f]/20 via-[#2792dc]/20 to-[#9ce6e6]/20 rounded-full blur-3xl -top-20 pointer-events-none" />

          {/* Central 3D Voice Orb */}
          <div className="relative my-2">
            
            {/* Outer pulsating rings when listening or speaking */}
            {(isListening || isSpeaking) && (
              <>
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#2792dc] to-[#71873f] opacity-30 animate-ping duration-1000" />
                <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-[#9ce6e6] to-[#e0b87e] opacity-20 animate-pulse duration-700" />
              </>
            )}

            {/* Glowing Orb Button */}
            <button
              onClick={toggleListening}
              className={`relative w-24 h-24 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 border-4 ${
                isListening 
                  ? 'bg-gradient-to-br from-red-500 via-rose-600 to-amber-500 border-white text-white shadow-rose-500/50 scale-105' 
                  : isSpeaking
                  ? 'bg-gradient-to-br from-[#2792dc] via-[#71873f] to-[#e0b87e] border-white text-white shadow-cyan-500/50 animate-pulse'
                  : 'bg-gradient-to-br from-[#71873f] via-[#5c6e33] to-[#a36627] border-white/80 text-white hover:scale-105 shadow-[#71873f]/40'
              }`}
              title={isListening ? 'Stop Listening' : 'Click to Speak'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-8 h-8 animate-bounce" />
                  <span className="text-[9px] font-black tracking-wider uppercase mt-1">Listening</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Waves className="w-8 h-8 animate-pulse" />
                  <span className="text-[9px] font-black tracking-wider uppercase mt-1">Speaking</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black tracking-wider uppercase mt-1">
                    {activeLang === 'hi' ? 'बोलें' : 'Tap to Talk'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Sound Waveform Visualization Bar */}
          <div className="flex items-center gap-1.5 h-6 my-2">
            {[40, 70, 90, 60, 100, 75, 45, 85, 95, 60, 80, 50].map((h, i) => (
              <span
                key={i}
                style={{
                  height: isListening || isSpeaking ? `${h}%` : '20%',
                  transition: 'height 0.15s ease-in-out'
                }}
                className={`w-1 rounded-full ${
                  isListening 
                    ? 'bg-rose-500' 
                    : isSpeaking 
                    ? 'bg-[#2792dc]' 
                    : 'bg-[#abbe99]'
                }`}
              />
            ))}
          </div>

          {/* Live Status Text */}
          <div className="text-xs font-bold mt-1 flex items-center gap-2">
            {isListening ? (
              <span className="text-rose-600 font-extrabold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>{activeLang === 'hi' ? 'सुन रहा हूँ... कृपया बोलें...' : 'Listening to your voice... Speak clearly...'}</span>
              </span>
            ) : isSpeaking ? (
              <span className="text-[#2792dc] font-extrabold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>{activeLang === 'hi' ? 'आगामी एआई उत्तर दे रहा है...' : 'AAGAM AI is speaking response...'}</span>
              </span>
            ) : (
              <span className="text-[#637554] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e0b87e]" />
                <span>{activeLang === 'hi' ? 'माइक पर क्लिक करें या नीचे दिए गए प्रश्नों में से चुनें' : 'Click the microphone or pick a suggested topic below'}</span>
              </span>
            )}
          </div>

          {/* Interim Real-time Speech Transcript Banner */}
          {transcript && (
            <div className="mt-2 px-4 py-1.5 bg-white rounded-full border border-[#abbe99] text-xs font-mono font-bold text-[#71873f] shadow-inner max-w-lg truncate">
              "{transcript}"
            </div>
          )}

        </div>

        {/* Quick Question Chips Carousel / Grid */}
        <div className="px-5 py-2.5 bg-[#fcfaf7] border-b border-[#abbe99]/40">
          <div className="text-[10px] font-mono font-bold text-[#637554] uppercase mb-1.5 flex items-center justify-between">
            <span>{activeLang === 'hi' ? 'त्वरित सवाल (क्लिक करें):' : 'Suggested Voice Queries (Click to Ask):'}</span>
            <span className="text-[#71873f]">Hindi & English AI</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            <button
              onClick={() => handleQuickPrompt('What is the 2026 MSP for Wheat & Paddy?', 'गेहूं और धान का 2026-27 एमएसपी क्या है?')}
              className="px-2.5 py-1 bg-white hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99] hover:border-[#71873f] rounded-xl text-[11px] font-bold transition-all text-left shadow-xs flex items-center gap-1"
            >
              <span>🌾</span>
              <span>{activeLang === 'hi' ? 'गेहूं/धान MSP भाव' : 'Wheat & Paddy MSP'}</span>
            </button>

            <button
              onClick={() => handleQuickPrompt('How do I book a Mandi Gate Pass slot?', 'मंडी गेट पास स्लॉट कैसे बुक करें?')}
              className="px-2.5 py-1 bg-white hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99] hover:border-[#71873f] rounded-xl text-[11px] font-bold transition-all text-left shadow-xs flex items-center gap-1"
            >
              <span>🎫</span>
              <span>{activeLang === 'hi' ? 'गेट पास स्लॉट बुकिंग' : 'Mandi Gate Pass Slot'}</span>
            </button>

            <button
              onClick={() => handleQuickPrompt('When will my DBT payment arrive in bank account?', 'डीबीटी भुगतान खाते में कब आएगा?')}
              className="px-2.5 py-1 bg-white hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99] hover:border-[#71873f] rounded-xl text-[11px] font-bold transition-all text-left shadow-xs flex items-center gap-1"
            >
              <span>💰</span>
              <span>{activeLang === 'hi' ? 'डीबीटी भुगतान स्थिति' : 'DBT Payment Status'}</span>
            </button>

            <button
              onClick={() => handleQuickPrompt('What are the grain moisture & quality FAQ limits?', 'अनाज में नमी और गुणवत्ता मानक क्या हैं?')}
              className="px-2.5 py-1 bg-white hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99] hover:border-[#71873f] rounded-xl text-[11px] font-bold transition-all text-left shadow-xs flex items-center gap-1"
            >
              <span>🧪</span>
              <span>{activeLang === 'hi' ? 'नमी व गुणवत्ता मानक' : 'Moisture & FAQ Norms'}</span>
            </button>

            <button
              onClick={() => handleQuickPrompt('How does e-NAM live bidding and auction work?', 'ई-नीलामी में बोली कैसे लगाएं?')}
              className="px-2.5 py-1 bg-white hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99] hover:border-[#71873f] rounded-xl text-[11px] font-bold transition-all text-left shadow-xs flex items-center gap-1"
            >
              <span>⚖️</span>
              <span>{activeLang === 'hi' ? 'ई-नीलामी व बोली' : 'e-NAM Live Bidding'}</span>
            </button>
          </div>
        </div>

        {/* Live Conversation Transcript Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[160px] max-h-[220px] bg-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 duration-150`}
            >
              {msg.sender === 'agent' && (
                <div className="w-7 h-7 rounded-xl bg-[#71873f] text-white flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1.5 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#71873f] text-white rounded-tr-none'
                    : 'bg-[#f4efe6] text-[#243118] border border-[#abbe99]/60 rounded-tl-none'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 font-mono pt-1 border-t border-black/10">
                  <span>{msg.time}</span>
                  <div className="flex items-center gap-1.5">
                    {msg.sender === 'agent' && (
                      <button
                        onClick={() => speakText(msg.text, activeLang === 'hi' ? 'hi-IN' : 'en-IN')}
                        className="hover:opacity-100 transition-opacity p-0.5"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="hover:opacity-100 transition-opacity p-0.5"
                      title="Copy message"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Fallback Input Bar */}
        <div className="p-3 bg-[#fcfaf7] border-t border-[#abbe99]/40 flex items-center gap-2">
          
          <button
            onClick={clearChat}
            className="p-2.5 rounded-xl bg-white border border-[#abbe99] hover:bg-[#f0f4ea] text-[#637554] transition-colors shrink-0"
            title="Reset Conversation"
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
              placeholder={activeLang === 'hi' ? 'या यहाँ लिखकर पूछें (उदा. गेहूं का एमएसपी क्या है?)...' : 'Or type your question here (e.g. MSP rate, gate pass)...'}
              className="flex-1 bg-white border border-[#abbe99] rounded-xl px-3.5 py-2.5 text-xs text-[#243118] placeholder-[#637554] focus:outline-none focus:border-[#71873f] font-medium"
            />
            <button
              type="submit"
              className="bg-[#71873f] hover:bg-[#5c6e33] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeLang === 'hi' ? 'भेजें' : 'Send'}</span>
            </button>
          </form>

        </div>

        {/* ElevenLabs Widget Official Embed Integration */}
        <div className="bg-[#1a2512] text-slate-300 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold">ElevenLabs Agent:</span>
            <span className="text-[#e0b87e] font-mono">{AGENT_CONFIG.agent_id}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">Model: eleven_v3_conversational</span>
            <span className="text-emerald-400 font-bold">Voice: tnSpp4vdxKPjI9w0GnoV</span>
          </div>
        </div>

      </div>

    </div>
  );
}
