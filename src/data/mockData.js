import { Coins, Microscope, QrCode, TrendingUp, Scale, Truck, Warehouse, Building2, UserCheck, ShieldCheck } from 'lucide-react';

// System Real-time Ticker Data
export const tickerItems = [
  { cropEn: 'Wheat (Sharbati)', cropHi: 'गेहूं (सरबती)', msp: '₹2,425', rate: '₹2,580', change: '+6.4%', locationEn: 'Karnal, HR', locationHi: 'करनाल, हरियाणा' },
  { cropEn: 'Paddy (Basmati 1121)', cropHi: 'धान (बासमती 1121)', msp: '₹2,300', rate: '₹4,150', change: '+80.4%', locationEn: 'Tarn Taran, PB', locationHi: 'तरनतारन, पंजाब' },
  { cropEn: 'Mustard (Bold Seed)', cropHi: 'सरसों (मोटा दाना)', msp: '₹5,950', rate: '₹6,320', change: '+6.2%', locationEn: 'Bharatpur, RJ', locationHi: 'भरतपुर, राजस्थान' },
  { cropEn: 'Chana (Gram)', cropHi: 'चना (देशी)', msp: '₹5,650', rate: '₹5,780', change: '+2.3%', locationEn: 'Latur, MH', locationHi: 'लातूर, महाराष्ट्र' },
  { cropEn: 'Maize (Hybrid)', cropHi: 'मक्का (हाइब्रिड)', msp: '₹2,225', rate: '₹2,290', change: '+2.9%', locationEn: 'Davangere, KA', locationHi: 'दावणगेरे, कर्नाटक' },
  { cropEn: 'Cotton (Long Staple)', cropHi: 'कपास (लंबा रेशा)', msp: '₹7,521', rate: '₹7,890', change: '+4.9%', locationEn: 'Rajkot, GJ', locationHi: 'राजकोट, गुजरात' },
  { cropEn: 'Soyabean (Yellow)', cropHi: 'सोयाबीन (पीला)', msp: '₹4,892', rate: '₹4,950', change: '+1.2%', locationEn: 'Ujjain, MP', locationHi: 'उज्जैन, मध्य प्रदेश' }
];

// Hero Outer Big Slider Data
export const slides = [
  {
    titleEn: '48-Hour Guarantee Direct Bank Transfer (DBT)',
    titleHi: '48 घंटे में सीधा बैंक खाता स्थानांतरण (DBT)',
    subtitleEn: 'Instant, transparent MSP payments credited directly to farmer Aadhaar-linked accounts within 48 hours of mandi weightment.',
    subtitleHi: 'तौल के 48 घंटे के भीतर किसानों के आधार-लिंक्ड बैंक खातों में सीधे MSP भुगतान।',
    tagEn: 'FINANCIAL TRANSPARENCY',
    tagHi: 'वित्तीय पारदर्शिता',
    badgeEn: '100% Escrow Automated',
    badgeHi: '100% स्वचालित एस्क्रो',
    statEn: '₹1,42,500 Cr Disbursed',
    statHi: '₹1,42,500 करोड़ हस्तांतरित',
    actionTextEn: 'Check DBT Payment Status',
    actionTextHi: 'भुगतान की स्थिति जांचें',
    actionIcon: Coins,
    image: import.meta.env.BASE_URL + 'images/crop_sunset.png',
    imageAltEn: 'Indian Farmer in Green Fields at Sunset',
    imageAltHi: 'सूर्यास्त के समय हरे-भरे खेतों में भारतीय किसान',
    detailsEn: [
      'Direct NPCI Aadhaar Payment Bridge',
      'Zero Middlemen Fee Deduction',
      'Instant SMS & WhatsApp Credit Alerts'
    ],
    detailsHi: [
      'प्रत्यक्ष एनपीसीआई आधार भुगतान ब्रिज',
      'शून्य बिचौलिए शुल्क कटौती',
      'तत्काल एसएमएस और व्हाट्सएप क्रेडिट अलर्ट'
    ]
  },
  {
    titleEn: 'AI-Powered Grain NIR Moisture & Quality Assay',
    titleHi: 'एआई-संचालित खाद्यान्न नमी एवं गुणवत्ता जांच',
    subtitleEn: 'Optical Near-Infrared (NIR) sensors evaluate grain moisture, foreign matter, and broken kernels in 45 seconds for transparent Grade A pricing.',
    subtitleHi: '45 सेकंड में स्पेक्ट्रोस्कोपी द्वारा सटीक नमी और पारदर्शी ग्रेड ए मूल्य निर्धारण।',
    tagEn: 'QUALITY ASSURANCE',
    tagHi: 'गुणवत्ता आश्वासन',
    badgeEn: '45-Sec Digital Scan',
    badgeHi: '45-सेकंड डिजिटल स्कैन',
    statEn: '99.8% Assay Precision',
    statHi: '99.8% परीक्षण सटीकता',
    actionTextEn: 'View AI Scanner Labs',
    actionTextHi: 'एआई स्कैनर लैब देखें',
    actionIcon: Microscope,
    image: import.meta.env.BASE_URL + 'images/aerial_farm.png',
    imageAltEn: 'Smart Farming Tractor in Field',
    imageAltHi: 'खेत में स्मार्ट कृषि ट्रैक्टर',
    detailsEn: [
      'Automated Moisture Target (<12%)',
      'Tamper-proof Digital Quality Card',
      'Transparent Grade-A Premium Pricing'
    ],
    detailsHi: [
      'स्वचालित नमी लक्ष्य (<12%)',
      'छेड़छाड़-मुक्त डिजिटल गुणवत्ता कार्ड',
      'पारदर्शी ग्रेड-ए प्रीमियम मूल्य'
    ]
  },
  {
    titleEn: 'Smart QR Token Gate Pass & Automated Queue System',
    titleHi: 'स्मार्ट क्यूआर गेट पास एवं कतार प्रबंधन',
    subtitleEn: 'Eliminate mandi traffic congestion with staggered hourly slot booking, automated weighbridge routing, and digital gate pass QR codes.',
    subtitleHi: 'मंडी में स्लॉट बुक करें और कतार रहित सुगम प्रवेश प्राप्त करें।',
    tagEn: 'LOGISTICS & GATE OPS',
    tagHi: 'लॉजिस्टिक्स और गेट संचालन',
    badgeEn: 'Zero Congestion Target',
    badgeHi: 'शून्य कतार लक्ष्य',
    statEn: '2,840 Mandis Live',
    statHi: '2,840 मंडियां लाइव',
    actionTextEn: 'Book Gate Pass Slot',
    actionTextHi: 'गेट पास स्लॉट बुक करें',
    actionIcon: QrCode,
    image: import.meta.env.BASE_URL + 'images/mandi_yard.jpg',
    imageAltEn: 'Grain Mandi Yard with Tractors & Grain Heaps',
    imageAltHi: 'ट्रैक्टरों और अनाज के ढेर के साथ अनाज मंडी यार्ड',
    detailsEn: [
      'Staggered Hourly Arrival Slots',
      'Automated Weighbridge Tagging',
      'Real-time Queue Status on Mobile'
    ],
    detailsHi: [
      'क्रमबद्ध प्रति घंटे आगमन स्लॉट',
      'स्वचालित धर्म कांटा टैगिंग',
      'मोबाइल पर रीयल-टाइम कतार स्थिति'
    ]
  },
  {
    titleEn: 'e-NAM Integrated Live National Electronic Auction',
    titleHi: 'ई-नाम एकीकृत राष्ट्रव्यापी लाइव ई-नीलामी',
    subtitleEn: 'Seamless transparent digital bidding connecting 12.4M farmers directly with 1.8M verified national traders above MSP.',
    subtitleHi: 'देशभर के सत्यापित खरीदारों से सर्वोत्तम मूल्य प्राप्त करें।',
    tagEn: 'PRICE REALIZATION',
    tagHi: 'मूल्य प्राप्ति',
    badgeEn: 'Pan-India Bidding',
    badgeHi: 'अखिल भारतीय नीलामी',
    statEn: '48.25 Million MT Traded',
    statHi: '48.25 मिलियन मीट्रिक टन कारोबार',
    actionTextEn: 'Explore Live Auctions',
    actionTextHi: 'लाइव नीलामी देखें',
    actionIcon: TrendingUp,
    image: import.meta.env.BASE_URL + 'images/paddy_farmer.png',
    imageAltEn: 'Indian Farmer Working in Paddy Field',
    imageAltHi: 'धान के खेत में काम करता भारतीय किसान',
    detailsEn: [
      'Pan-India Bidding Access',
      'Guaranteed MSP Floor Shield',
      'Automated Winning Bid Notification'
    ],
    detailsHi: [
      'अखिल भारतीय नीलामी पहुंच',
      'गारंटीकृत एमएसपी न्यूनतम सुरक्षा',
      'स्वचालित विजेता बोली अधिसूचना'
    ]
  }
];

// Commodity Price Matrix Data
export const commodityPriceData = [
  { id: 1, cropEn: 'Wheat (Grade A)', cropHi: 'गेहूं (ग्रेड ए)', categoryEn: 'Cereals', categoryHi: 'अनाज', msp: 2425, minRate: 2425, maxRate: 2610, modalRate: 2540, stateEn: 'Punjab', stateHi: 'पंजाब', mandiEn: 'Khanna Grain Market', mandiHi: 'खन्ना अनाज मंडी', trend: '+4.7%', volumeEn: '14,200 MT', volumeHi: '14,200 मीट्रिक टन', statusEn: 'Above MSP', statusHi: 'एमएसपी से ऊपर' },
  { id: 2, cropEn: 'Wheat (Sharbati)', cropHi: 'गेहूं (सरबती)', categoryEn: 'Cereals', categoryHi: 'अनाज', msp: 2425, minRate: 2450, maxRate: 2780, modalRate: 2650, stateEn: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', mandiEn: 'Sehore Mandi', mandiHi: 'सीहोर मंडी', trend: '+9.2%', volumeEn: '8,900 MT', volumeHi: '8,900 मीट्रिक टन', statusEn: 'Above MSP', statusHi: 'एमएसपी से ऊपर' },
  { id: 3, cropEn: 'Paddy (Common)', cropHi: 'धान (सामान्य)', categoryEn: 'Cereals', categoryHi: 'अनाज', msp: 2300, minRate: 2300, maxRate: 2380, modalRate: 2340, stateEn: 'Haryana', stateHi: 'हरियाणा', mandiEn: 'Karnal Grain Market', mandiHi: 'करनाल अनाज मंडी', trend: '+1.7%', volumeEn: '22,400 MT', volumeHi: '22,400 मीट्रिक टन', statusEn: 'Procurement Active', statusHi: 'खरीद चालू' },
  { id: 4, cropEn: 'Paddy (Basmati 1509)', cropHi: 'धान (बासमती 1509)', categoryEn: 'Cereals', categoryHi: 'अनाज', msp: 2300, minRate: 3400, maxRate: 3850, modalRate: 3680, stateEn: 'Punjab', stateHi: 'पंजाब', mandiEn: 'Amritsar APMC', mandiHi: 'अमृतसर एपीएमसी', trend: '+12.4%', volumeEn: '18,500 MT', volumeHi: '18,500 मीट्रिक टन', statusEn: 'Premium Export', statusHi: 'प्रीमियम निर्यात' },
  { id: 5, cropEn: 'Mustard (Yellow)', cropHi: 'सरसों (पीली)', categoryEn: 'Oilseeds', categoryHi: 'तिलहन', msp: 5950, minRate: 6100, maxRate: 6480, modalRate: 6320, stateEn: 'Rajasthan', stateHi: 'राजस्थान', mandiEn: 'Alwar APMC', mandiHi: 'अलवर एपीएमसी', trend: '+6.2%', volumeEn: '9,100 MT', volumeHi: '9,100 मीट्रिक टन', statusEn: 'Above MSP', statusHi: 'एमएसपी से ऊपर' },
  { id: 6, cropEn: 'Chana (Desi)', cropHi: 'चना (देशी)', categoryEn: 'Pulses', categoryHi: 'दलहन', msp: 5650, minRate: 5650, maxRate: 5890, modalRate: 5780, stateEn: 'Maharashtra', stateHi: 'महाराष्ट्र', mandiEn: 'Akola Yard', mandiHi: 'अकोला यार्ड', trend: '+2.3%', volumeEn: '6,400 MT', volumeHi: '6,400 मीट्रिक टन', statusEn: 'Above MSP', statusHi: 'एमएसपी से ऊपर' },
  { id: 7, cropEn: 'Soyabean (Yellow)', cropHi: 'सोयाबीन (पीला)', categoryEn: 'Oilseeds', categoryHi: 'तिलहन', msp: 4892, minRate: 4892, maxRate: 5120, modalRate: 4980, stateEn: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', mandiEn: 'Indore Mandi', mandiHi: 'इंदौर मंडी', trend: '+1.8%', volumeEn: '11,300 MT', volumeHi: '11,300 मीट्रिक टन', statusEn: 'Above MSP', statusHi: 'एमएसपी से ऊपर' },
  { id: 8, cropEn: 'Cotton (Medium Staple)', cropHi: 'कपास (मध्यम रेशा)', categoryEn: 'Commercial', categoryHi: 'व्यावसायिक', msp: 7121, minRate: 7200, maxRate: 7650, modalRate: 7420, stateEn: 'Gujarat', stateHi: 'गुजरात', mandiEn: 'Gondal Yard', mandiHi: 'गोंडल यार्ड', trend: '+4.2%', volumeEn: '7,800 MT', volumeHi: '7,800 मीट्रिक टन', statusEn: 'Above MSP', statusHi: 'एमएसपी से ऊपर' },
  { id: 9, cropEn: 'Maize (Yellow)', cropHi: 'मक्का (पीली)', categoryEn: 'Coarse Grains', categoryHi: 'मोटा अनाज', msp: 2225, minRate: 2225, maxRate: 2340, modalRate: 2290, stateEn: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', mandiEn: 'Aligarh APMC', mandiHi: 'अलीगढ़ एपीएमसी', trend: '+2.9%', volumeEn: '5,600 MT', volumeHi: '5,600 मीट्रिक टन', statusEn: 'Above MSP', statusHi: 'एमएसपी से ऊपर' }
];

// Crop Marketplace (#54-57) Mock Data
export const marketplaceItems = [
  {
    id: 'mp1',
    cropEn: 'Sharbati Wheat (Grade A)',
    cropHi: 'सरबती गेहूं (ग्रेड ए)',
    farmerEn: 'Gurpreet Singh',
    farmerHi: 'गुरप्रीत सिंह',
    locationEn: 'Ludhiana, Punjab',
    locationHi: 'लुधियाना, पंजाब',
    qty: '180 Qtl',
    moisture: '10.8%',
    grade: 'Grade A FAQ',
    price: '₹2,650 / Qtl',
    msp: '₹2,425 / Qtl',
    verified: true,
    lotNo: 'LOT-PB-2026-881'
  },
  {
    id: 'mp2',
    cropEn: 'Basmati Rice 1121 Steam',
    cropHi: 'बासमती चावल 1121 स्टीम',
    farmerEn: 'Harpreet Kaur',
    farmerHi: 'हरप्रीत कौर',
    locationEn: 'Tarn Taran, Punjab',
    locationHi: 'तरनतारन, पंजाब',
    qty: '320 Qtl',
    moisture: '11.2%',
    grade: 'Export Grade 1',
    price: '₹4,250 / Qtl',
    msp: '₹2,300 / Qtl',
    verified: true,
    lotNo: 'LOT-PB-2026-904'
  },
  {
    id: 'mp3',
    cropEn: 'Bold Yellow Mustard Seed',
    cropHi: 'मोटा पीला सरसों बीज',
    farmerEn: 'Ramotar Yadav',
    farmerHi: 'रामोतार यादव',
    locationEn: 'Alwar, Rajasthan',
    locationHi: 'अलवर, राजस्थान',
    qty: '140 Qtl',
    moisture: '7.5%',
    grade: 'Oil Content 42%',
    price: '₹6,400 / Qtl',
    msp: '₹5,950 / Qtl',
    verified: true,
    lotNo: 'LOT-RJ-2026-312'
  },
  {
    id: 'mp4',
    cropEn: 'Desi Chana (Whole Gram)',
    cropHi: 'देशी चना (साबुत)',
    farmerEn: 'Shivraj Patil',
    farmerHi: 'शिवराज पाटिल',
    locationEn: 'Latur, Maharashtra',
    locationHi: 'लातूर, महाराष्ट्र',
    qty: '210 Qtl',
    moisture: '9.0%',
    grade: 'Grade A FAQ',
    price: '₹5,820 / Qtl',
    msp: '₹5,650 / Qtl',
    verified: true,
    lotNo: 'LOT-MH-2026-551'
  }
];

// Live E-Auction Lots (#7, #58-61) Mock Data
export const auctionItems = [
  {
    id: 'auc1',
    lotNo: 'AUC-KRN-2026-041',
    cropEn: 'Sharbati Wheat Super FAQ',
    cropHi: 'सरबती गेहूं सुपर एफएक्यू',
    mandiEn: 'Karnal Central Yard',
    mandiHi: 'करनाल केंद्रीय मंडी',
    quantity: '450 Quintals',
    currentBid: '₹2,680',
    mspFloor: '₹2,425',
    totalBids: 18,
    timeLeft: '14m 22s',
    topBidder: 'Adani Agri Logistics Ltd',
    status: 'ACTIVE_BIDDING'
  },
  {
    id: 'auc2',
    lotNo: 'AUC-KHN-2026-108',
    cropEn: 'Organic Basmati 1509 Paddy',
    cropHi: 'जैविक बासमती 1509 धान',
    mandiEn: 'Khanna Main APMC',
    mandiHi: 'खन्ना मुख्य एपीएमसी',
    quantity: '600 Quintals',
    currentBid: '₹3,920',
    mspFloor: '₹2,300',
    totalBids: 32,
    timeLeft: '04m 10s',
    topBidder: 'KRBL Ltd (India Gate)',
    status: 'HOT_BIDDING'
  },
  {
    id: 'auc3',
    lotNo: 'AUC-SEH-2026-077',
    cropEn: 'Yellow Soyabean Grade A',
    cropHi: 'पीला सोयाबीन ग्रेड ए',
    mandiEn: 'Sehore Mandi (MP)',
    mandiHi: 'सीहोर मंडी (म.प्र.)',
    quantity: '280 Quintals',
    currentBid: '₹5,050',
    mspFloor: '₹4,892',
    totalBids: 14,
    timeLeft: '28m 45s',
    topBidder: 'Ruchi Soya Industries',
    status: 'ACTIVE_BIDDING'
  }
];

// Logistics Vehicles & Live Tracking (#98-107) Mock Data
export const logisticsVehicles = [
  {
    id: 'v1',
    truckNo: 'PB-10-CZ-4829',
    driver: 'Balwinder Singh',
    capacity: '25 MT',
    status: 'IN_TRANSIT',
    origin: 'Khanna Mandi, PB',
    destination: 'FCI Silo, Ambala, HR',
    eta: '45 Mins',
    gps: '29.9821° N, 76.8812° E',
    speed: '54 km/h'
  },
  {
    id: 'v2',
    truckNo: 'HR-45-B-9982',
    driver: 'Gurmeet Ram',
    capacity: '32 MT',
    status: 'LOADING',
    origin: 'Karnal Central Yard',
    destination: 'CWD Warehouse, Panipat',
    eta: '2 Hours',
    gps: '29.9695° N, 76.8783° E',
    speed: '0 km/h'
  },
  {
    id: 'v3',
    truckNo: 'MP-04-HE-3102',
    driver: 'Rajesh Sharma',
    capacity: '20 MT',
    status: 'DELIVERED',
    origin: 'Sehore Yard, MP',
    destination: 'Indore Flour Mill',
    eta: 'Completed',
    gps: '22.7196° N, 75.8577° E',
    speed: '0 km/h'
  }
];

// AI Supply & Price Predictions (#128-136) Mock Data
export const analyticsPredictions = [
  {
    metricEn: 'Kharif Paddy Arrival Forecast (Next 14 Days)',
    metricHi: 'खरीफ धान आवक पूर्वानुमान (अगले 14 दिन)',
    value: '4.85 Million MT',
    confidence: '98.4%',
    trend: '+12.5% vs 2025',
    insightEn: 'Peak arrival expected on 28th August across Punjab & Haryana mandis.',
    insightHi: 'पंजाब और हरियाणा मंडियों में 28 अगस्त को उच्चतम आवक की संभावना।'
  },
  {
    metricEn: 'Price Trend Prediction (Wheat Grade A)',
    metricHi: 'गेहूं ग्रेड ए मूल्य प्रवृत्ति पूर्वानुमान',
    value: '₹2,680 / Qtl (+10.5% over MSP)',
    confidence: '96.2%',
    trend: 'BULLISH',
    insightEn: 'High flour mill demand & strong export enquiries pushing prices up.',
    insightHi: 'आटा मिल मांग और मजबूत निर्यात पूछताछ से कीमतों में तेजी।'
  },
  {
    metricEn: 'Procurement Center Overload Alert',
    metricHi: 'खरीद केंद्र भीड़भाड़ चेतावनी',
    value: '3 Mandis At High Risk',
    confidence: '99.1%',
    trend: 'HIGH RISK',
    insightEn: 'Khanna & Karnal yards approaching 90% yard holding capacity.',
    insightHi: 'खन्ना और करनाल यार्ड 90% क्षमता सीमा के करीब।'
  }
];

// 4 Pillars Interactive Data
export const pillarsData = [
  {
    step: 1,
    titleEn: 'QR Slot Booking & Gate Entry',
    titleHi: 'क्यूआर स्लॉट बुकिंग एवं गेट प्रवेश',
    icon: QrCode,
    shortDescEn: 'Staggered arrival scheduling eliminates long tractor queues.',
    shortDescHi: 'क्रमबद्ध आगमन समय-सारणी से लंबी ट्रैक्टर कतारें समाप्त होती हैं।',
    fullDescEn: 'Farmers select preferred mandi, date, and 2-hour arrival window via AAGAM mobile app, WhatsApp bot, or local CSC kiosk. A unique tamper-evident QR Gate Pass is generated.',
    fullDescHi: 'किसान एएजीएएम मोबाइल ऐप, व्हाट्सएप बॉट या स्थानीय सीएससी केंद्र के माध्यम से पसंदीदा मंडी, तिथि और समय स्लॉट चुनते हैं।',
    codeLabel: 'SYSTEM_TOKEN: #PB-KRN-2026-9921',
    highlightsEn: [
      'SMS & WhatsApp Slot Confirmation',
      'Lane Pre-assignment to avoid bottleneck',
      'Real-time traffic density alert'
    ],
    highlightsHi: [
      'एसएमएस और व्हाट्सएप स्लॉट पुष्टि',
      'ट्रैफिक जाम से बचने के लिए पूर्व लेन आवंटन',
      'रीयल-टाइम कतार घनत्व चेतावनी'
    ]
  },
  {
    step: 2,
    titleEn: 'AI Moisture & NIR Quality Scan',
    titleHi: 'एआई नमी एवं गुणवत्ता जांच',
    icon: Microscope,
    shortDescEn: 'Instant 45-second optical assay for moisture and purity.',
    shortDescHi: 'नमी और शुद्धता के लिए 45 सेकंड में ऑप्टिकल एनआईआर परीक्षण।',
    fullDescEn: 'Near-Infrared (NIR) optical sensors sample 100g grain in seconds. Algorithms measure moisture content (target <12%), shriveled grains, and foreign matter to award instant Grade-A certification.',
    fullDescHi: 'ऑप्टिकल नियर-इन्फ्रारेड (एनआईआर) सेंसर सेकंडों में खाद्यान्न का परीक्षण करते हैं और त्वरित ग्रेड-ए प्रमाण पत्र जारी करते हैं।',
    codeLabel: 'ASSAY_CERT: #NIR-GRADE-A-8841',
    highlightsEn: [
      'Eliminates manual bias & dispute',
      'Automatic MSP premium/discount calculator',
      'Digital Lab Report stored on Blockchain'
    ],
    highlightsHi: [
      'मानवीय भेदभाव और विवाद समाप्त करता है',
      'स्वचालित एमएसपी मूल्य प्रीमियम कैलकुलेटर',
      'ब्लॉकचेन पर सुरक्षित डिजिटल लैब रिपोर्ट'
    ]
  },
  {
    step: 3,
    titleEn: 'Automated Weighbridge & Live E-Auction',
    titleHi: 'स्वचालित धर्म कांटा एवं लाइव ई-नीलामी',
    icon: Scale,
    shortDescEn: 'IoT weighbridge gross-tare logging with national e-bidding.',
    shortDescHi: 'राष्ट्रीय ई-बोली के साथ आईओटी वेब्रिज ग्रॉस-टार लॉगिंग।',
    fullDescEn: 'Tractors drive onto IoT sensors that directly record gross and tare weights with zero manual input. Certified lots enter the live pan-India e-NAM bidding engine.',
    fullDescHi: 'ट्रैक्टर आईओटी वेब्रिज पर आते हैं जो बिना किसी मानवीय हस्तक्षेप के सीधे सटीक वजन रिकॉर्ड करते हैं।',
    codeLabel: 'WEIGH_LOG: #WB-SYS-04-24850KG',
    highlightsEn: [
      'IoT Weight Transmitters connected to Cloud',
      'Winning bid selected above MSP baseline',
      'Instant E-Contract generated for trader'
    ],
    highlightsHi: [
      'क्लाउड से जुड़े आईओटी वजन ट्रांसमीटर',
      'एमएसपी आधार से ऊपर चयनित विजेता बोली',
      'व्यापारी के लिए तत्काल ई-अनुबंध पत्र'
    ]
  },
  {
    step: 4,
    titleEn: 'Instant 48-Hour Direct Bank Transfer (DBT)',
    titleHi: '48 घंटे में सीधा बैंक खाता स्थानांतरण (DBT)',
    icon: Coins,
    shortDescEn: 'Direct NPCI payment bridge into farmer bank accounts.',
    shortDescHi: 'किसान बैंक खातों में सीधा एनपीसीआई भुगतान ब्रिज।',
    fullDescEn: 'Upon weighbridge confirmation, the automated escrow system executes direct NPCI Aadhaar payment bridge to transfer 100% funds directly into the farmer’s account within 48 hours.',
    fullDescHi: 'वजन की पुष्टि होने पर, 100% राशि 48 घंटे के भीतर सीधे किसान के बैंक खाते में स्थानांतरित कर दी जाती है।',
    codeLabel: 'NPCI_TX: #0x9f82...3b1a',
    highlightsEn: [
      'Zero commission agent deduction',
      'SMS Credit Receipt with Bank UTR',
      '100% Tax & Audit compliance ledger'
    ],
    highlightsHi: [
      'शून्य कमीशन या बिचौलिया कटौती',
      'बैंक यूटीआर नंबर के साथ एसएमएस रसीद',
      '100% पारदर्शी और ऑडिटेड लेजर'
    ]
  }
];

// Mandi Locator Procurement Center Data
export const mandisList = [
  {
    id: 'm1',
    nameEn: 'Karnal Central Grain Yard',
    nameHi: 'करनाल केंद्रीय अनाज मंडी',
    districtEn: 'Karnal',
    districtHi: 'करनाल',
    stateEn: 'Haryana',
    stateHi: 'हरियाणा',
    statusEn: 'OPEN NOW',
    statusHi: 'खुला है',
    commoditiesEn: ['Wheat', 'Paddy', 'Mustard'],
    commoditiesHi: ['गेहूं', 'धान', 'सरसों'],
    weighbridgesEn: '6 Active',
    weighbridgesHi: '6 सक्रिय',
    queueEn: '8 Trucks (~18 min wait)',
    queueHi: '8 ट्रैक्टर (~18 मिनट प्रतीक्षा)',
    availableSlotsToday: 42,
    weatherEn: 'Sunny 31°C',
    weatherHi: 'धूप 31°C',
    distance: '4.2 km'
  },
  {
    id: 'm2',
    nameEn: 'Khanna Main APMC Market',
    nameHi: 'खन्ना मुख्य एपीएमसी मंडी',
    districtEn: 'Ludhiana',
    districtHi: 'लुधियाना',
    stateEn: 'Punjab',
    stateHi: 'पंजाब',
    statusEn: 'OPEN NOW',
    statusHi: 'खुला है',
    commoditiesEn: ['Wheat', 'Paddy', 'Maize'],
    commoditiesHi: ['गेहूं', 'धान', 'मक्का'],
    weighbridgesEn: '10 Active',
    weighbridgesHi: '10 सक्रिय',
    queueEn: '14 Trucks (~25 min wait)',
    queueHi: '14 ट्रैक्टर (~25 मिनट प्रतीक्षा)',
    availableSlotsToday: 18,
    weatherEn: 'Clear 30°C',
    weatherHi: 'साफ 30°C',
    distance: '12.8 km'
  },
  {
    id: 'm3',
    nameEn: 'Sehore Agriculture Mandi',
    nameHi: 'सीहोर कृषि उपज मंडी',
    districtEn: 'Sehore',
    districtHi: 'सीहोर',
    stateEn: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    statusEn: 'OPEN NOW',
    statusHi: 'खुला है',
    commoditiesEn: ['Wheat (Sharbati)', 'Chana', 'Soyabean'],
    commoditiesHi: ['गेहूं (सरबती)', 'चना', 'सोयाबीन'],
    weighbridgesEn: '4 Active',
    weighbridgesHi: '4 सक्रिय',
    queueEn: '3 Trucks (~8 min wait)',
    queueHi: '3 ट्रैक्टर (~8 मिनट प्रतीक्षा)',
    availableSlotsToday: 85,
    weatherEn: 'Partly Cloudy 33°C',
    weatherHi: 'आंशिक बादल 33°C',
    distance: '6.5 km'
  },
  {
    id: 'm4',
    nameEn: 'Alwar Principal APMC Yard',
    nameHi: 'अलवर मुख्य एपीएमसी मंडी',
    districtEn: 'Alwar',
    districtHi: 'अलवर',
    stateEn: 'Rajasthan',
    stateHi: 'राजस्थान',
    statusEn: 'OPEN NOW',
    statusHi: 'खुला है',
    commoditiesEn: ['Mustard', 'Bajra', 'Wheat'],
    commoditiesHi: ['सरसों', 'बाजरा', 'गेहूं'],
    weighbridgesEn: '5 Active',
    weighbridgesHi: '5 सक्रिय',
    queueEn: '5 Trucks (~12 min wait)',
    queueHi: '5 ट्रैक्टर (~12 मिनट प्रतीक्षा)',
    availableSlotsToday: 64,
    weatherEn: 'Sunny 34°C',
    weatherHi: 'धूप 34°C',
    distance: '15.1 km'
  }
];

// Blockchain Ledger Data
export const blockchainTrail = [
  {
    blockHeight: '#849,201',
    titleEn: 'Farmer Land & Seed Registration',
    titleHi: 'किसान भूमि एवं बीज पंजीकरण',
    timestamp: '2026-08-24 07:15:02 UTC',
    hash: '0x3a4f8921b7c1092e45da8129990184b23f11',
    actorEn: 'Farmer Portal (Geo-Tag Verified)',
    actorHi: 'किसान पोर्टल (जियो-टैग सत्यापित)',
    locationEn: 'Plot #42, Karnal, HR (29.9695° N, 76.8783° E)',
    locationHi: 'प्लाट #42, करनाल, हरियाणा (29.9695° N, 76.8783° E)',
    detailsEn: 'Aadhaar e-KYC linked. 12.5 Acres Sharbati Wheat registered for procurement slot.',
    detailsHi: 'आधार ई-केवाईसी संबद्ध। 12.5 एकड़ सरबती गेहूं खरीद स्लॉट के लिए पंजीकृत।'
  },
  {
    blockHeight: '#849,202',
    titleEn: 'Mandi Gate Pass QR Token Issued',
    titleHi: 'मंडी गेट पास क्यूआर टोकन जारी',
    timestamp: '2026-08-24 08:30:45 UTC',
    hash: '0x7b12904c81a29f381002998a44b91823901a',
    actorEn: 'AAGAM QR Gateway',
    actorHi: 'एएजीएएम क्यूआर गेटवे',
    locationEn: 'Karnal Central Yard Gate 02',
    locationHi: 'करनाल केंद्रीय यार्ड गेट 02',
    detailsEn: 'Token #PB-KRN-9921 issued. Vehicle HR-45-B-9982 assigned to Lane 04.',
    detailsHi: 'टोकन #PB-KRN-9921 जारी। वाहन HR-45-B-9982 को लेन 04 आवंटित।'
  },
  {
    blockHeight: '#849,203',
    titleEn: 'AI NIR Quality Assay Certified',
    titleHi: 'एआई एनआईआर गुणवत्ता प्रमाण पत्र',
    timestamp: '2026-08-24 09:12:18 UTC',
    hash: '0xd981240a18239841299a9b23019f8723910c',
    actorEn: 'Optical NIR Sensor #LAB-04',
    actorHi: 'ऑप्टिकल एनआईआर सेंसर #LAB-04',
    locationEn: 'Karnal Quality Lab 01',
    locationHi: 'करनाल गुणवत्ता प्रयोगशाला 01',
    detailsEn: 'Moisture: 11.4%, Foreign Matter: 0.3%, Shriveled: 0.8%. Awarded Grade A (FAQ Standard).',
    detailsHi: 'नमी: 11.4%, बाहरी तत्व: 0.3%, सिकुड़े दाने: 0.8%। ग्रेड ए मानक प्राप्त।'
  },
  {
    blockHeight: '#849,204',
    titleEn: 'Direct Bank Transfer (DBT) Settled',
    titleHi: 'सीधा बैंक खाता स्थानांतरण (DBT) पूर्ण',
    timestamp: '2026-08-24 11:02:44 UTC',
    hash: '0x9f829910a3b1a87720914c8109823ef4518a',
    actorEn: 'NPCI Aadhaar Payment Bridge',
    actorHi: 'एनपीसीआई आधार भुगतान ब्रिज',
    locationEn: 'Public Financial Management System (PFMS)',
    locationHi: 'सार्वजनिक वित्तीय प्रबंधन प्रणाली (पीएफएमएस)',
    detailsEn: 'Amount: ₹6,02,612 credited to SBI Account ending ****4829. UTR #39482019482710.',
    detailsHi: 'राशि: ₹6,02,612 एसबीआई खाते (****4829) में जमा। यूटीआर #39482019482710।'
  }
];

// Complete 14 Category Directory Footer & Quick Search Data (171 Pages Taxonomy)
export const directoryCategories = [
  {
    titleEn: '1. Public Pages (1-13)',
    titleHi: '1. सार्वजनिक पृष्ठ (1-13)',
    linksEn: ['Home / Landing Page', 'About AAGAM Portal', 'How AAGAM Works', 'Core Features & Architecture', 'Price Discovery Engine', 'Crop Marketplace', 'Live E-Auction Desk', 'Procurement Centers Locator', 'Analytics & Forecasting', 'Contact Us & Grievance', 'FAQ & Helpdesk', 'Terms & Conditions', 'Privacy Policy'],
    linksHi: ['मुख्य पृष्ठ', 'आगामी पोर्टल के बारे में', 'आगामी कैसे काम करता है', 'मुख्य विशेषताएं', 'मूल्य खोज इंजन', 'फसल बाजार', 'लाइव ई-नीलामी', 'खरीद केंद्र लोकेटर', 'विश्लेषण और पूर्वानुमान', 'संपर्क करें और शिकायत', 'सामान्य प्रश्न', 'नियम और शर्तें', 'गोपनीयता नीति']
  },
  {
    titleEn: '2. Authentication Pages (14-19)',
    titleHi: '2. प्रमाणीकरण पृष्ठ (14-19)',
    linksEn: ['GOI SSO Login', 'Stakeholder Registration', '7-Persona Role Selection', 'Mobile & Aadhaar OTP Verification', 'Forgot Password Recovery', 'Reset Password Portal'],
    linksHi: ['साइन इन पोर्टल', 'हितधारक पंजीकरण', '7-भूमिका चयन', 'ओटीपी सत्यापन', 'पासवर्ड भूल गए', 'पासवर्ड रीसेट']
  },
  {
    titleEn: '3. Farmer Portal (20-51)',
    titleHi: '3. किसान पोर्टल (20-51)',
    linksEn: ['Farmer Dashboard', 'My Profile & Aadhaar e-KYC', 'Land Records & Khasra', 'Add Agricultural Land', 'Land Verification Status', 'My Registered Crops', 'Add New Crop Declaration', 'Crop Details & Moisture', 'Price Comparison Tool', 'Nearby Mandi Live Rates', 'Private Buyer Offers', 'My Live Auctions', 'Create New Auction Lot', 'Book Slot & Gate Pass', 'My QR Tokens', 'AI Quality Assay Reports', 'Weighment Tola Parchi', 'Direct Bank Transfer (DBT)', 'Crop Journey Traceability'],
    linksHi: ['किसान डैशबोर्ड', 'प्रोफ़ाइल', 'भूमि रिकॉर्ड', 'भूमि जोड़ें', 'भूमि सत्यापन', 'मेरी फसलें', 'नई फसल घोषणा', 'मूल्य तुलना', 'निकटतम मंडी दरें', 'निजी खरीदार ऑफ़र', 'मेरी नीलामी', 'स्लॉट और गेट पास बुक करें', 'क्यूआर टोकन', 'एआई गुणवत्ता रिपोर्ट', 'तौल पर्ची', 'डीबीटी भुगतान लेजर', 'फसल ट्रैसेबिलिटी']
  },
  {
    titleEn: '4. Buyer / Trader Portal (52-65)',
    titleHi: '4. व्यापारी पोर्टल (52-65)',
    linksEn: ['Buyer Dashboard', 'Trader Profile & License', 'Crop Marketplace Desk', 'My Submitted Offers', 'Live e-NAM National Auction', 'Pan-India Bidding Desk', 'Won Auctions & Lots', 'Purchased Crops Inventory', 'Order & Escrow History', 'Payment History & Receipts', 'Delivery & Fleet Tracking'],
    linksHi: ['व्यापारी डैशबोर्ड', 'व्यापारी प्रोफ़ाइल', 'फसल बाजार डेस्क', 'मेरे ऑफ़र', 'ई-नाम राष्ट्रीय नीलामी', 'बोली डेस्क', 'जीती नीलामी', 'खरीदी गई फसलें', 'एस्क्रो इतिहास', 'भुगतान रसीदें', 'डिलीवरी ट्रैकिंग']
  },
  {
    titleEn: '5. Government & Procurement (66-80)',
    titleHi: '5. सरकारी अधिकारी पोर्टल (66-80)',
    linksEn: ['Officer Dashboard', 'Farmer & Land Verification Review', 'Crop Declaration Approval', 'Procurement Center Capacity Management', 'Daily Procurement Summary', 'Slot Rescheduling Engine', 'Gate Entry & Queue Monitoring', 'IoT Weighbridge Sync Monitor', 'AI Quality Compliance Assay', 'Escrow Payment Approval'],
    linksHi: ['अधिकारी डैशबोर्ड', 'किसान और भूमि सत्यापन', 'फसल घोषणा समीक्षा', 'खरीद केंद्र क्षमता', 'दैनिक खरीद सारांश', 'कतार निगरानी', 'धर्म कांटा सिंक', 'गुणवत्ता अनुपालन', 'एस्क्रो भुगतान स्वीकृति']
  },
  {
    titleEn: '6. Mandi Operator Portal (81-90)',
    titleHi: '6. मंडी संचालक पोर्टल (81-90)',
    linksEn: ['Operator Dashboard', 'QR Token Gate Scanner', 'Manual Token Entry Fallback', 'Gate Entry Vehicle Log', 'Vehicle Priority Queue', 'Live Yard Queue Monitor', 'Weighment Entry Terminal', 'Digital Tola Parchi Issuance'],
    linksHi: ['संचालक डैशबोर्ड', 'क्यूआर टोकन स्कैनर', 'मैनुअल टोकन प्रविष्टि', 'गेट वाहन लॉग', 'वाहन प्राथमिकता कतार', 'लाइव यार्ड कतार', 'धर्म कांटा टर्मिनल', 'डिजिटल तोला पर्ची']
  },
  {
    titleEn: '7. Quality Assayer Portal (91-97)',
    titleHi: '7. गुणवत्ता निरीक्षक पोर्टल (91-97)',
    linksEn: ['Assayer Dashboard', 'Pending Sample Inspections', 'NIR Moisture & Purity Check', 'Quality Grading (Grade A FAQ)', 'Inspection History Audit', 'AI vs Manual Quality Deviation Report'],
    linksHi: ['गुणवत्ता निरीक्षक डैशबोर्ड', 'लंबित नमूना निरीक्षण', 'एनआईआर नमी और शुद्धता जांच', 'गुणवत्ता ग्रेडिंग', 'निरीक्षण इतिहास', 'एआई बनाम मैनुअल रिपोर्ट']
  },
  {
    titleEn: '8. Logistics & Transport (98-107)',
    titleHi: '8. लॉजिस्टिक्स एवं परिवहन (98-107)',
    linksEn: ['Logistics Dashboard', 'Transport Requests Pool', 'Available Vehicle Fleet', 'Driver & Vehicle Management', 'Transport Task Assignment', 'Pickup Yard Management', 'Live GPS Transit Tracking', 'Completed Delivery Receipts'],
    linksHi: ['लॉजिस्टिक्स डैशबोर्ड', 'परिवहन अनुरोध पूल', 'वाहन बेड़ा', 'चालक प्रबंधन', 'परिवहन कार्य आवंटन', 'लाइव जीपीएस ट्रैकिंग', 'वितरण रसीदें']
  },
  {
    titleEn: '9. Warehouse & Silos (108-118)',
    titleHi: '9. गोदाम एवं साइलो प्रबंधक (108-118)',
    linksEn: ['Warehouse Dashboard', 'Capacity & Holding Monitor', 'Current Grain Inventory', 'Crop-wise Stock Ledger', 'Stock Inward Logging', 'Stock Outward Release', 'Warehouse Stock Transfers', 'Electronic Warehouse Receipt (e-NWR)'],
    linksHi: ['गोदाम डैशबोर्ड', 'क्षमता और स्टॉक मॉनिटर', 'वर्तमान अनाज सूची', 'फसल वार स्टॉक लेजर', 'स्टॉक इनवर्ड लॉग', 'इलेक्ट्रॉनिक वेयरहाउस रसीद (e-NWR)']
  },
  {
    titleEn: '10. Payment & Escrow (119-127)',
    titleHi: '10. भुगतान एवं डीबीटी लेजर (119-127)',
    linksEn: ['Payment Dashboard', 'Pending Disbursals', 'Processing Escrow Payments', 'Completed DBT Transfers', 'NPCI Aadhaar Payment Tracker', 'Bank UTR Search Engine', 'PFMS Audit Reports'],
    linksHi: ['भुगतान डैशबोर्ड', 'लंबित भुगतान', 'एस्क्रो प्रसंस्करण', 'पूर्ण डीबीटी हस्तांतरण', 'आधार भुगतान ट्रैकर', 'बैंक यूटीआर खोज', 'पीएफएमएस ऑडिट रिपोर्ट']
  },
  {
    titleEn: '11. AI & Predictive Analytics (128-136)',
    titleHi: '11. एआई एवं विश्लेषणात्मक डैशबोर्ड (128-136)',
    linksEn: ['AI Analytics Dashboard', 'Crop Supply Prediction', 'Arrival Volume Forecast', 'Mandi Overload Alert Engine', 'Warehouse Capacity Forecast', 'Price Trend AI Prediction', 'Demand Forecast & Risk Dashboard'],
    linksHi: ['एआई विश्लेषणात्मक डैशबोर्ड', 'फसल आपूर्ति पूर्वानुमान', 'आवक मात्रा पूर्वानुमान', 'मंडी ओवरलोड चेतावनी', 'मूल्य प्रवृत्ति पूर्वानुमान', 'जोखिम डैशबोर्ड']
  },
  {
    titleEn: '12. Crop Traceability & Audit (137-142)',
    titleHi: '12. फसल ट्रैसेबिलिटी एवं ब्लॉकचेन (137-142)',
    linksEn: ['Crop Traceability Dashboard', 'Farm-to-Fork Journey Timeline', 'Cryptographic Transaction Ledger', 'Immutable Seed-to-Silo Audit', 'Blockchain Block Hash Certificate'],
    linksHi: ['फसल ट्रैसेबिलिटी डैशबोर्ड', 'खेत से थाली तक जीवनचक्र', 'क्रिप्टोग्राफिक लेनदेन लेजर', 'ब्लॉकचेन हैश प्रमाणपत्र']
  },
  {
    titleEn: '13. System Administration (143-162)',
    titleHi: '13. सिस्टम प्रशासन (143-162)',
    linksEn: ['Admin Dashboard', 'User & Role Management', 'Farmer & Buyer Master Registry', 'Officer Delegation Center', 'Procurement Mandi Management', 'Crop & Price Ceiling Master', 'System Security Audit Logs'],
    linksHi: ['प्रशासक डैशबोर्ड', 'उपयोगकर्ता और भूमिका प्रबंधन', 'किसान एवं व्यापारी मास्टर', 'खरीद केंद्र प्रशासन', 'फसल और एमएसपी मास्टर', 'सुरक्षा ऑडिट लॉग']
  },
  {
    titleEn: '14. Common & Help System (163-171)',
    titleHi: '14. सामान्य सहायता प्रणाली (163-171)',
    linksEn: ['My Notifications Center', 'Account Security Settings', 'Bilingual Language Switcher', 'Kisan Helpdesk & Grievance', 'Report System Incident', '404 Not Found Page', 'Access Denied Guard'],
    linksHi: ['अधिसूचना केंद्र', 'खाता सुरक्षा सेटिंग्स', 'द्विभाषिक भाषा चयन', 'किसान हेल्पलाइन एवं शिकायत', '404 अप्राप्य पृष्ठ', 'पहुंच अस्वीकृत सुरक्षा']
  }
];
