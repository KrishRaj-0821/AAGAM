import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
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
  Scale
} from 'lucide-react';

// Knowledge base for instant voice & text responses
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['msp', 'wheat', 'gehu', 'paddy', 'dhan', 'price', 'rate', 'bhav', 'मूल्य', 'भाव', 'गेहूं', 'धान', 'एमएसपी', 'सरसों'],
    responseEn: "The 2026-27 Minimum Support Price (MSP) approved by the Cabinet is ₹2,425/quintal for Wheat (Sharbati ₹2,850), ₹2,320/quintal for Paddy Common (Grade A ₹2,360), ₹3,425 for Mustard, and ₹6,600 for Gram (Chana). Payments are credited directly via DBT within 48 hours of mandi weighment.",
    responseHi: "2026-27 का न्यूनतम समर्थन मूल्य (MSP) गेहूं के लिए ₹2,425 प्रति क्विंटल (शरबती ₹2,850), धान सामान्य के लिए ₹2,320 (ग्रेड ए ₹2,360), सरसों ₹3,425 और चना ₹6,600 है। तुलाई के 48 घंटों में पूरी राशि सीधे आपके बैंक खाते में डीबीटी द्वारा भेजी जाती है।"
  },
  {
    keywords: ['gate pass', 'slot', 'booking', 'qr', 'token', 'book', 'स्लॉट', 'गेट पास', 'टोकन', 'बुकिंग'],
    responseEn: "To book a Mandi Gate Pass, click 'Gate Pass' in the top menu or inside your Farmer Portal. Select your State, District, Mandi, Crop, and arrival time slot. You will receive an instant verified QR Token with a secure Gate Pass for hassle-free entry.",
    responseHi: "मंडी गेट पास बुक करने के लिए, शीर्ष मेनू में 'गेट पास' विकल्प या किसान पोर्टल पर जाएं। अपना राज्य, जिला, मंडी, फसल और समय स्लॉट चुनें। आपको तुरंत एक सत्यापित क्यूआर टोकन और डिजिटल गेट पास मिलेगा।"
  },
  {
    keywords: ['dbt', 'payment', 'paisa', 'account', 'bank', 'utr', 'भुगतान', 'पैसा', 'खाता', 'डीबीटी', 'पैसे'],
    responseEn: "AAGAM guarantees automated Direct Benefit Transfer (DBT) directly to your Aadhaar-linked bank account within 48 hours. You can check your payment status in the 'Payments' section anytime with your Farmer ID or Token number.",
    responseHi: "आगामी पोर्टल के माध्यम से खरीद की राशि सीधे आपके आधार से जुड़े बैंक खाते में 48 घंटे के भीतर भेजी जाती है। आप 'भुगतान' अनुभाग में जाकर अपने किसान आईडी या टोकन नंबर से लाइव स्थिति देख सकते हैं।"
  },
  {
    keywords: ['moisture', 'quality', 'faq', 'grading', 'limit', 'नमी', 'गुणवत्ता', 'मानक', 'जांच', 'ग्रेडिंग'],
    responseEn: "Under Government of India FAQ norms, grain moisture must be 12% or below (maximum permissible 14% with standard deduction). Foreign matter must not exceed 0.75%. Mandi AI analyzers give you verified lab results in under 60 seconds.",
    responseHi: "सरकारी एफएक्यू (FAQ) मानकों के अनुसार, अनाज में नमी 12% या उससे कम होनी चाहिए (अधिकतम 14% तक)। बाह्य पदार्थ 0.75% से कम होना चाहिए। मंडी में स्वचालित विश्लेषक 60 सेकंड में सटीक गुणवत्ता रिपोर्ट देते हैं।"
  },
  {
    keywords: ['auction', 'bid', 'e-nam', 'enam', 'trade', 'buyer', 'नीलामी', 'बोली', 'व्यापारी', 'खरीदार'],
    responseEn: "The AAGAM e-Auction connects with national e-NAM mandis. Registered buyers place transparent bids in live rounds. Farmers can accept the highest bid with one click or choose government MSP procurement if market price is lower.",
    responseHi: "आगामी ई-नीलामी राष्ट्रीय ई-नाम मंडियों से जुड़ी है। पंजीकृत व्यापारी लाइव पारदर्शी बोली लगाते हैं। किसान उच्चतम बोली स्वीकार कर सकते हैं या सरकारी एमएसपी पर बेचने का विकल्प चुन सकते हैं।"
  }
];

export default function VoiceAgentModal({
  isOpen,
  onClose,
  language = 'en'
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

  useEffect(() => {
    setActiveLang(language);
  }, [language]);

  // Set friendly greeting based on language
  useEffect(() => {
    setMessages([
      {
        sender: 'agent',
        text: activeLang === 'hi' 
          ? "नमस्ते! मैं आपका आगामी किसान AI सहायक हूँ। आप मुझसे एमएसपी भाव, गेट पास स्लॉट, डीबीटी भुगतान या अनाज की गुणवत्ता के बारे में बोलकर या लिखकर पूछ सकते हैं।"
          : "Hello! I am your AAGAM Kisan AI Voice Assistant. You can ask me about MSP crop rates, Mandi Gate Pass booking, DBT payments, or grain quality norms.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeLang]);

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

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [activeLang]);

  if (!isOpen) return null;

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
        (!langCode.startsWith('hi') && (v.lang.includes('en-IN') || v.lang.includes('en')))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (err) {
      setIsSpeaking(false);
    }
  };

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
        ? "आपकी जानकारी दर्ज कर ली गई है। आप गेहूं/धान का एमएसपी भाव, गेट पास स्लॉट बुकिंग या डीबीटी भुगतान से संबंधित कोई भी सवाल पूछ सकते हैं।"
        : "I have received your question. You can ask me about MSP crop rates, Mandi Gate Pass booking, DBT bank transfers, or quality norms.";
    }

    setTimeout(() => {
      const agentMsg = {
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      speakText(replyText, isHindi ? 'hi-IN' : 'en-IN');
    }, 350);
  };

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
        alert(activeLang === 'hi' ? 'आपका ब्राउज़र माइक्रोफ़ोन सपोर्ट नहीं करता। कृपया लिखकर पूछें।' : 'Speech recognition is not supported in this browser. Please type your question.');
      }
    }
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
          ? "नमस्ते! मैं आपका आगामी किसान AI सहायक हूँ। आप मुझसे क्या पूछना चाहते हैं?"
          : "Hello! I am your AAGAM Kisan AI Assistant. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Simple, Elegant Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#abbe99] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#243118]">
        
        {/* Tricolor Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Clean Header — Simple & Friendly */}
        <div className="bg-[#1c2713] text-white px-5 py-4 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#71873f] text-white flex items-center justify-center shadow shrink-0">
              <Bot className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {activeLang === 'hi' ? 'आगामी किसान AI सहायक' : 'AAGAM Kisan AI Assistant'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#abbe99]">
                {activeLang === 'hi' ? '24x7 किसान आवाज व चैट सेवा' : '24x7 Farmer Voice & Chat Support'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Language Switch */}
            <button
              onClick={() => setActiveLang(activeLang === 'hi' ? 'en' : 'hi')}
              className="bg-white/10 hover:bg-white/20 text-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-white/10"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-[#e0b87e]" />
              <span>{activeLang === 'hi' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Audio Speech Mute */}
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                setIsSpeaking(false);
                setAudioMuted(!audioMuted);
              }}
              className={`p-2 rounded-xl border transition-all ${
                audioMuted 
                  ? 'bg-red-500/20 border-red-500/40 text-red-300' 
                  : 'bg-white/10 border-white/10 text-slate-200 hover:text-white'
              }`}
              title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                setIsSpeaking(false);
                setIsListening(false);
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-600 text-slate-200 hover:text-white transition-all border border-white/10"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Live Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[260px] max-h-[420px] bg-[#fafbf9]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
            >
              {msg.sender === 'agent' && (
                <div className="w-7 h-7 rounded-xl bg-[#71873f] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1.5 leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#71873f] text-white rounded-tr-none font-semibold'
                    : 'bg-white text-[#243118] border border-[#abbe99]/50 rounded-tl-none font-medium'
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
                      title="Copy"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Listening Live Transcript Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 animate-pulse bg-red-50 p-2.5 rounded-2xl border border-red-200">
              <Mic className="w-4 h-4 animate-bounce" />
              <span>
                {transcript 
                  ? `"${transcript}"` 
                  : (activeLang === 'hi' ? 'सुन रहा हूँ... कृपया बोलिए...' : 'Listening... please speak now...')}
              </span>
            </div>
          )}

          {/* Speaking Audio Waves Indicator */}
          {isSpeaking && !isListening && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#71873f] bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
              <Waves className="w-4 h-4 animate-pulse" />
              <span>{activeLang === 'hi' ? 'आगामी AI बोल रहा है...' : 'AAGAM AI is speaking...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Compact Suggested Topic Pills */}
        <div className="px-4 py-2 bg-[#fcfaf7] border-t border-[#abbe99]/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            {
              icon: Sprout,
              textEn: 'What is the MSP for Wheat and Paddy?',
              textHi: 'गेहूं और धान का MSP भाव क्या है?',
              labelEn: 'Wheat/Paddy MSP',
              labelHi: 'गेहूं/धान भाव'
            },
            {
              icon: QrCode,
              textEn: 'How to book Mandi Gate Pass slot?',
              textHi: 'मंडी गेट पास स्लॉट कैसे बुक करें?',
              labelEn: 'Gate Pass Slot',
              labelHi: 'गेट पास स्लॉट'
            },
            {
              icon: Coins,
              textEn: 'When will DBT payment arrive?',
              textHi: 'डीबीटी भुगतान कब आएगा?',
              labelEn: 'DBT Status',
              labelHi: 'डीबीटी भुगतान'
            },
            {
              icon: Microscope,
              textEn: 'What are the grain moisture limits?',
              textHi: 'अनाज में नमी के मानक क्या हैं?',
              labelEn: 'Moisture Limits',
              labelHi: 'नमी मानक'
            },
            {
              icon: Scale,
              textEn: 'How does live e-Auction work?',
              textHi: 'ई-नीलामी में बोली कैसे लगाएं?',
              labelEn: 'e-Auction',
              labelHi: 'ई-नीलामी'
            }
          ].map((chip, idx) => {
            const IconComp = chip.icon;
            return (
              <button
                key={idx}
                onClick={() => handleProcessQuery(activeLang === 'hi' ? chip.textHi : chip.textEn)}
                className="px-2.5 py-1 bg-white hover:bg-[#f0f4ea] text-[#243118] border border-[#abbe99]/70 hover:border-[#71873f] rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <IconComp className="w-3 h-3 text-[#71873f]" />
                <span>{activeLang === 'hi' ? chip.labelHi : chip.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Clean Input Bar */}
        <div className="p-3.5 bg-white border-t border-[#abbe99]/40 flex items-center gap-2">
          
          {/* Reset chat */}
          <button
            onClick={clearChat}
            className="p-2.5 rounded-xl bg-[#fcfaf7] border border-[#abbe99] hover:bg-[#f0f4ea] text-[#637554] transition-colors shrink-0"
            title={activeLang === 'hi' ? 'बातचीत रीसेट करें' : 'Reset chat'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.queryInput;
              if (input && input.value.trim()) {
                handleProcessQuery(input.value.trim());
                input.value = '';
              }
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              name="queryInput"
              type="text"
              placeholder={activeLang === 'hi' ? 'यहाँ लिखकर या माइक दबाकर पूछें...' : 'Type a question or tap mic to speak...'}
              className="flex-1 bg-[#fcfaf7] border border-[#abbe99] rounded-xl px-3.5 py-2.5 text-xs text-[#243118] placeholder-[#637554] focus:outline-none focus:border-[#71873f] font-medium"
            />

            {/* Prominent Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl text-white transition-all shrink-0 shadow-xs active:scale-95 ${
                isListening 
                  ? 'bg-red-500 animate-pulse ring-2 ring-red-300' 
                  : 'bg-[#71873f] hover:bg-[#5c6e33]'
              }`}
              title={isListening ? 'Stop Listening' : 'Tap to Speak'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              className="bg-[#243118] hover:bg-[#1a2512] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs shrink-0 active:scale-95"
              title="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
