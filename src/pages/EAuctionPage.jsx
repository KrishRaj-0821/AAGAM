import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Gavel, 
  Scale, 
  Sparkles,
  LogOut,
  User,
  Building2,
  DollarSign,
  AlertCircle,
  Trophy,
  History,
  Send,
  Zap,
  ArrowUpRight,
  Filter,
  Search,
  Check,
  AlertTriangle,
  X
} from 'lucide-react';
import { auctionItems } from '../data/mockData';
import { api } from '../services/api';

export default function EAuctionPage({ setCurrentView, currentUser, triggerSuccessNotification, t }) {
  const [lots, setLots] = useState(auctionItems);
  
  // Modal & Live Room State
  const [detailsModalLot, setDetailsModalLot] = useState(null);
  const [activeLiveLot, setActiveLiveLot] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');

  // Bidder Details Form State (Asked first before taking part)
  const [bidderDetails, setBidderDetails] = useState({
    bidderName: currentUser?.name || '',
    licenseId: '',
    entityName: '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    bidAmount: '',
    quantity: '',
    deliveryMandi: '',
    escrowAgreement: false
  });

  // Live Auction Room States
  const [liveBidHistory, setLiveBidHistory] = useState([]);
  const [liveTimeSeconds, setLiveTimeSeconds] = useState(860); // ~14 mins
  const [isLeadingBidder, setIsLeadingBidder] = useState(true);
  const [quickBidInput, setQuickBidInput] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // Fetch Live Auctions from Backend
  useEffect(() => {
    async function loadAuctions() {
      try {
        const res = await api.auctions.getAuctions();
        if (res?.data && res.data.length > 0) {
          const formatted = res.data.map(auc => ({
            id: auc.auction_code || auc.id,
            cropEn: auc.crop_name,
            cropHi: auc.crop_name_hi || auc.crop_name,
            grade: auc.quality_grade,
            quantity: `${auc.quantity_mt} MT`,
            basePrice: `₹${auc.reserve_price}`,
            currentBid: `₹${auc.current_highest_bid}`,
            minIncrement: `₹${auc.min_increment}`,
            totalBids: auc.total_bids_count,
            timeRemaining: '01h 15m',
            sellerEn: auc.seller_name,
            sellerHi: auc.seller_name,
            mandiEn: auc.mandi_location,
            mandiHi: auc.mandi_location,
            status: auc.status === 'LIVE' ? 'LIVE' : auc.status,
            moisture: `${auc.moisture_percentage}%`
          }));
          setLots(prev => [...formatted, ...prev.filter(p => !formatted.some(f => f.id === p.id))]);
        }
      } catch (err) {
        console.warn("Auctions backend fallback:", err);
      }
    }
    loadAuctions();
  }, []);

  // Live Timer Countdown Effect
  useEffect(() => {
    if (!activeLiveLot) return;
    const interval = setInterval(() => {
      setLiveTimeSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeLiveLot]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Open Details Form
  const handleOpenDetailsModal = (lot) => {
    setBidderDetails((prev) => ({
      ...prev,
      bidAmount: '',
      quantity: '',
      deliveryMandi: lot.mandiEn
    }));
    setDetailsModalLot(lot);
  };

  // Submit Details & Enter Live Bidding Room
  const handleEnterLiveRoom = (e) => {
    e.preventDefault();
    if (!detailsModalLot) return;

    const numericBid = parseInt(bidderDetails.bidAmount);
    const numericQty = parseInt(bidderDetails.quantity);

    // Initial Live Bid History
    const initialHistory = [
      {
        id: 'bid-1',
        time: new Date().toLocaleTimeString('en-IN'),
        bidder: `${bidderDetails.bidderName} (${bidderDetails.entityName})`,
        amount: numericBid,
        isYou: true
      },
      {
        id: 'bid-2',
        time: '2 mins ago',
        bidder: detailsModalLot.topBidder,
        amount: parseInt(detailsModalLot.currentBid.replace(/[^0-9]/g, '')),
        isYou: false
      },
      {
        id: 'bid-3',
        time: '5 mins ago',
        bidder: 'ITC e-Choupal Procurement',
        amount: parseInt(detailsModalLot.currentBid.replace(/[^0-9]/g, '')) - 40,
        isYou: false
      }
    ];

    // Update global lots state
    setLots((prev) =>
      prev.map((l) =>
        l.id === detailsModalLot.id
          ? {
              ...l,
              currentBid: `₹${numericBid.toLocaleString('en-IN')}`,
              totalBids: (parseInt(l.totalBids) + 1).toString(),
              topBidder: `${bidderDetails.bidderName} (You)`
            }
          : l
      )
    );

    setActiveLiveLot({
      ...detailsModalLot,
      currentBid: `₹${numericBid.toLocaleString('en-IN')}`,
      numericBid: numericBid,
      numericQty: numericQty
    });

    setLiveBidHistory(initialHistory);
    setIsLeadingBidder(true);
    setDetailsModalLot(null);

    if (triggerSuccessNotification) {
      triggerSuccessNotification({
        title: t('Entered Live Auction Room!', 'लाइव ई-नीलामी रूम में प्रवेश!'),
        message: t(
          `Bid of ₹${numericBid.toLocaleString('en-IN')}/Qtl placed on Lot ${detailsModalLot.lotNo}. Total Valuation: ₹${(numericBid * numericQty).toLocaleString('en-IN')}.`,
          `लॉट ${detailsModalLot.lotNo} पर ₹${numericBid.toLocaleString('en-IN')}/क्विंटल की बोली दर्ज की गई।`
        ),
        tokenNo: detailsModalLot.lotNo
      });
    }
  };

  // Place Higher Bid within the Live Room
  const handleRaiseBid = (incrementAmount) => {
    if (!activeLiveLot) return;
    setIsPlacingBid(true);

    const currentAmount = activeLiveLot.numericBid;
    const newAmount = currentAmount + incrementAmount;

    setTimeout(() => {
      const newEntry = {
        id: `bid-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-IN'),
        bidder: `${bidderDetails.bidderName} (You)`,
        amount: newAmount,
        isYou: true
      };

      setLiveBidHistory((prev) => [newEntry, ...prev]);
      setActiveLiveLot((prev) => ({
        ...prev,
        numericBid: newAmount,
        currentBid: `₹${newAmount.toLocaleString('en-IN')}`
      }));

      setLots((prev) =>
        prev.map((l) =>
          l.id === activeLiveLot.id
            ? {
                ...l,
                currentBid: `₹${newAmount.toLocaleString('en-IN')}`,
                totalBids: (parseInt(l.totalBids) + 1).toString(),
                topBidder: `${bidderDetails.bidderName} (You)`
              }
            : l
        )
      );

      setIsLeadingBidder(true);
      setIsPlacingBid(false);

      if (triggerSuccessNotification) {
        triggerSuccessNotification({
          title: t('New Higher Bid Placed!', 'नई उच्च बोली दर्ज हुई!'),
          message: t(
            `You raised your bid to ₹${newAmount.toLocaleString('en-IN')}/Qtl on Lot ${activeLiveLot.lotNo}. You are leading!`,
            `आपकी नई बोली ₹${newAmount.toLocaleString('en-IN')}/क्विंटल दर्ज हो चुकी है।`
          ),
          tokenNo: activeLiveLot.lotNo
        });
      }
    }, 400);
  };

  // Exit / Leave Live Auction Room
  const handleExitAuction = () => {
    const exitedLotNo = activeLiveLot?.lotNo || 'Auction';
    setActiveLiveLot(null);

    if (triggerSuccessNotification) {
      triggerSuccessNotification({
        title: t('Safely Exited Auction Room', 'नीलामी रूम से सुरक्षित बाहर निकले'),
        message: t(
          `You have safely exited the live bidding room for Lot ${exitedLotNo}. Your final placed bid remains securely recorded in the e-NAM registry.`,
          `आप लॉट ${exitedLotNo} की लाइव नीलामी से सुरक्षित बाहर आ गए हैं।`
        ),
        tokenNo: exitedLotNo
      });
    }
  };

  // Filter lots
  const filteredLots = lots.filter((item) => {
    const matchSearch = !searchQuery || 
      item.cropEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.mandiEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCrop = selectedCropFilter === 'All' || item.cropEn.toLowerCase().includes(selectedCropFilter.toLowerCase());
    return matchSearch && matchCrop;
  });

  return (
    <section className="py-10 bg-[#fcfaf7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* ========================================================================= */}
        {/* VIEW 1: LIVE BIDDING ROOM & VISUAL PREVIEW CONSOLE (When Active in an Auction) */}
        {/* ========================================================================= */}
        {activeLiveLot ? (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            
            {/* Live Room Header Bar with Exit Option */}
            <div className="bg-[#243118] text-white p-5 md:p-6 rounded-3xl shadow-2xl border-2 border-[#71873f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE AUCTION ROOM
                  </span>
                  <span className="text-xs font-mono text-[#e0b87e] font-bold">
                    LOT #{activeLiveLot.lotNo}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white">
                  {t(activeLiveLot.cropEn, activeLiveLot.cropHi)}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span>{t(activeLiveLot.mandiEn, activeLiveLot.mandiHi)}</span>
                  <span>•</span>
                  <span>Lot Size: <strong>{activeLiveLot.numericQty} Qtl</strong></span>
                </p>
              </div>

              {/* Center Live Countdown Timer */}
              <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/20 text-center font-mono space-y-0.5">
                <div className="text-[10px] text-[#e0b87e] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Remaining</span>
                </div>
                <div className="text-2xl font-extrabold text-white tracking-widest">
                  {formatTimer(liveTimeSeconds)}
                </div>
              </div>

              {/* Prominent Option to Get Out / Exit Auction */}
              <button
                onClick={handleExitAuction}
                className="bg-red-600/90 hover:bg-red-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-lg transition-all flex items-center gap-2 border border-red-400 hover:scale-105 active:scale-95 ml-auto md:ml-0"
                title="Safely exit and leave this live auction"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('Exit Auction Room / Get Out', 'नीलामी रूम से बाहर निकलें')}</span>
              </button>

            </div>

            {/* Live Bidding Room Dual Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Live Bid Analytics & Valuation Preview */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Visual Position & Status Banner */}
                <div className={`p-5 rounded-3xl border-2 transition-all ${
                  isLeadingBidder 
                    ? 'bg-gradient-to-r from-emerald-950 via-[#243118] to-emerald-950 text-white border-emerald-500 shadow-xl' 
                    : 'bg-amber-50 text-amber-900 border-amber-400'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                        <Trophy className="w-7 h-7 animate-bounce" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          LIVE PARTICIPATION STATUS
                        </div>
                        <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
                          {isLeadingBidder ? (
                            <>
                              <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                              <span>RANK #1 — YOU ARE CURRENTLY WINNING THIS LOT</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                              <span>OUTBID BY COMPETITOR — RANK #2</span>
                            </>
                          )}
                        </h3>
                      </div>
                    </div>
                    <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 font-mono text-xs font-bold text-[#e0b87e]">
                      GOI e-NAM Verified Bidder
                    </div>
                  </div>
                </div>

                {/* Live Valuation & Key Metrics Card */}
                <div className="bg-white p-6 rounded-3xl border border-[#abbe99] shadow-md space-y-5">
                  <h4 className="font-extrabold text-sm text-[#243118] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#71873f]" />
                    <span>Live Bid Valuation Preview & Contract Breakdown</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    
                    <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/60 space-y-1">
                      <span className="text-[#637554] text-[11px] uppercase block">Your Live Bid</span>
                      <div className="text-2xl font-extrabold text-[#71873f]">
                        {activeLiveLot.currentBid} <span className="text-xs font-sans text-[#637554]">/ Qtl</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        +₹{activeLiveLot.numericBid - parseInt(activeLiveLot.mspFloor.replace(/[^0-9]/g, ''))} above MSP Floor
                      </span>
                    </div>

                    <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/60 space-y-1">
                      <span className="text-[#637554] text-[11px] uppercase block">Total Lot Valuation</span>
                      <div className="text-2xl font-extrabold text-[#a36627]">
                        ₹{(activeLiveLot.numericBid * activeLiveLot.numericQty).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#637554] block">
                        For {activeLiveLot.numericQty} Quintals
                      </span>
                    </div>

                    <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/60 space-y-1">
                      <span className="text-[#637554] text-[11px] uppercase block">MSP Floor Shield</span>
                      <div className="text-2xl font-extrabold text-[#243118]">
                        {activeLiveLot.mspFloor} <span className="text-xs font-sans text-[#637554]">/ Qtl</span>
                      </div>
                      <span className="text-[10px] text-[#71873f] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#71873f] shrink-0" />
                        <span>100% Minimum Floor Protected</span>
                      </span>
                    </div>

                  </div>

                  {/* Bidder Identity & Contract Summary */}
                  <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99] text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#637554]">Registered Bidder:</span>
                      <span className="font-bold text-[#243118]">{bidderDetails.bidderName} ({bidderDetails.entityName})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#637554]">License ID:</span>
                      <span className="font-bold text-[#71873f]">{bidderDetails.licenseId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#637554]">Delivery Center:</span>
                      <span className="font-bold text-[#243118]">{bidderDetails.deliveryMandi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#637554]">Settlement Security:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>48-Hour PFMS Escrow Guaranteed</span>
                      </span>
                    </div>
                  </div>

                  {/* Fast 1-Click Counter-Bid Controls */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#243118] flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-[#a36627]" />
                        <span>Instant 1-Click Bid Raising:</span>
                      </span>
                      <span className="text-[11px] text-[#637554] font-mono">
                        Current: {activeLiveLot.currentBid}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[10, 25, 50, 100].map((inc) => (
                        <button
                          key={inc}
                          onClick={() => handleRaiseBid(inc)}
                          disabled={isPlacingBid}
                          className="bg-[#71873f] hover:bg-[#688557] active:bg-[#577045] text-white font-mono font-extrabold py-3 px-3 rounded-2xl text-xs shadow hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          <span>+₹{inc} / Qtl</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Right 1 Col: Live Real-Time Bidding Log Stream */}
              <div className="space-y-6">
                
                <div className="bg-white p-5 rounded-3xl border border-[#abbe99] shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#abbe99]/40 pb-3">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-[#71873f]" />
                      <span className="font-extrabold text-xs text-[#243118]">Live Bidding Audit Log</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Real-time Feed
                    </span>
                  </div>

                  {/* Bids Log Stream */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 text-xs font-mono">
                    {liveBidHistory.map((bid) => (
                      <div
                        key={bid.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          bid.isYou
                            ? 'bg-[#f0f4ea] border-[#71873f] shadow-xs'
                            : 'bg-[#fcfaf7] border-[#abbe99]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${bid.isYou ? 'text-[#71873f]' : 'text-[#243118]'} truncate max-w-[170px]`}>
                            {bid.bidder}
                          </span>
                          <span className="font-extrabold text-sm text-[#a36627]">
                            ₹{bid.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#637554] mt-1">
                          <span>{bid.time}</span>
                          {bid.isYou && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Your Active Bid</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Safety Exit Option also in Sidebar */}
                  <div className="pt-3 border-t border-[#abbe99]/40">
                    <button
                      onClick={handleExitAuction}
                      className="w-full bg-[#f4efe6] hover:bg-red-50 text-red-700 font-extrabold py-3 rounded-xl text-xs border border-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('Exit / Withdraw from Bid', 'बोली से बाहर निकलें')}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: FULL CATALOG OF ACTIVE E-AUCTIONS (Normal Catalog View) */
          /* ========================================================================= */
          <>
            {/* Top Breadcrumb & Live Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#abbe99]/60 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center gap-2 bg-[#f0f4ea] hover:bg-[#e0e8d6] text-[#71873f] font-bold px-3.5 py-2 rounded-xl border border-[#71873f]/40 text-xs transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('Back to Home', 'मुख्य पृष्ठ पर लौटें')}</span>
                </button>
                <span className="text-xs font-mono text-[#637554]">/</span>
                <span className="text-xs font-mono font-bold text-[#243118]">
                  {t('e-NAM Integrated Live National Electronic Auction Desk', 'ई-नाम राष्ट्रव्यापी लाइव ई-नीलामी डेस्क')}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-[#688557]">LIVE PAN-INDIA BIDDING</span>
              </div>
            </div>

            {/* Hero Section Banner */}
            <div className="bg-gradient-to-r from-[#243118] via-[#334423] to-[#243118] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#e0b87e]/40">
              <div className="space-y-3 max-w-2xl">
                <span className="bg-[#a36627] text-white font-mono text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t('National e-NAM Engine', 'राष्ट्रव्यापी ई-नाम इंजन')}
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                  {t('Live Electronic Bidding Desk', 'लाइव डिजिटल ई-नीलामी मंच')}
                </h1>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {t('Participate in real-time transparent competitive bidding across 2,840 government procurement mandis with details validation and live bid preview.', 'एमएसपी सुरक्षा के साथ 2,840 मंडियों में पारदर्शी रीयल-टाइम डिजिटल बोली में भाग लें।')}
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center font-mono space-y-1 shrink-0">
                <div className="text-xs text-[#e0b87e] font-bold">{t('ACTIVE AUCTIONS TODAY', 'आज सक्रिय नीलामी')}</div>
                <div className="text-3xl font-extrabold text-white">1,482 Lots</div>
                <div className="text-[10px] text-slate-300">MSP Floor Shield Active</div>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#abbe99] shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-[#71873f] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('Search lot number, commodity, or mandi...', 'लॉट संख्या, फसल या मंडी खोजें...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fcfaf7] border border-[#abbe99] text-xs font-semibold text-[#243118] focus:border-[#71873f] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-[#fcfaf7] px-3 py-2 rounded-xl border border-[#abbe99] text-xs font-bold text-[#243118]">
                <Filter className="w-3.5 h-3.5 text-[#71873f]" />
                <span className="text-[#637554]">{t('Crop:', 'फसल:')}</span>
                <select
                  value={selectedCropFilter}
                  onChange={(e) => setSelectedCropFilter(e.target.value)}
                  className="bg-transparent font-extrabold focus:outline-none cursor-pointer"
                >
                  <option value="All">{t('All Crops', 'सभी फसलें')}</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Basmati">Basmati Paddy (बासमती धान)</option>
                  <option value="Soyabean">Soyabean (सोयाबीन)</option>
                </select>
              </div>
            </div>

            {/* Auction Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLots.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#abbe99] p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#a36627] font-bold block">{item.lotNo}</span>
                        <h3 className="font-extrabold text-base text-[#243118] mt-0.5">
                          {t(item.cropEn, item.cropHi)}
                        </h3>
                        <p className="text-xs text-[#637554] font-medium">{t(item.mandiEn, item.mandiHi)}</p>
                      </div>
                      <span className="bg-[#a36627] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timeLeft}
                      </span>
                    </div>

                    <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#abbe99]/50 text-xs space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#637554]">{t('Lot Quantity:', 'मात्रा:')}</span>
                        <span className="font-bold text-[#243118]">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#637554]">{t('MSP Floor Shield:', 'एमएसपी सीमा:')}</span>
                        <span className="font-bold text-[#a36627]">{item.mspFloor}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-[#abbe99]/40">
                        <span className="text-[#637554] font-extrabold">{t('Current Highest Bid:', 'उच्चतम बोली:')}</span>
                        <span className="font-extrabold text-base text-[#71873f]">{item.currentBid}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#637554] flex justify-between font-mono">
                      <span>{t('Total Bids:', 'कुल बोलियां:')} <strong>{item.totalBids}</strong></span>
                      <span className="text-slate-600 truncate max-w-[140px] font-semibold">{item.topBidder}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDetailsModal(item)}
                    className="w-full bg-[#a36627] hover:bg-[#804d19] text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>{t('Place Digital Bid Now', 'डिजिटल बोली लगाएं')}</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* STEP 1 MODAL: ASK DETAILS FIRST BEFORE PARTICIPATING IN BID */}
        {/* ========================================================================= */}
        {detailsModalLot && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#abbe99] max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-[#243118] max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#a36627] text-white flex items-center justify-center shadow">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#243118]">
                      {t('Participate in e-NAM Auction: Step 1', 'नीलामी में भाग लें: चरण 1')}
                    </h3>
                    <p className="text-[11px] text-[#637554]">
                      {t('Provide bidder details & initial rate before entering live room', 'लाइव रूम में जाने से पहले विवरण दर्ज करें')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailsModalLot(null)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lot Summary Pill */}
              <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99] text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#637554]">Lot Number:</span>
                  <span className="font-extrabold text-[#a36627]">{detailsModalLot.lotNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#637554]">Commodity:</span>
                  <span className="font-extrabold text-[#243118]">{t(detailsModalLot.cropEn, detailsModalLot.cropHi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#637554]">Current Highest Bid:</span>
                  <span className="font-extrabold text-[#71873f]">{detailsModalLot.currentBid}</span>
                </div>
              </div>

              {/* Bidder Participation Form */}
              <form onSubmit={handleEnterLiveRoom} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Bidder / Buyer Name:', 'बोलीदाता का नाम:')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('e.g. Ramesh Kumar', 'उदा. रमेश कुमार')}
                      value={bidderDetails.bidderName}
                      onChange={(e) => setBidderDetails({ ...bidderDetails, bidderName: e.target.value })}
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-bold text-xs focus:border-[#71873f] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Trader / License ID:', 'लाइसेंस / व्यापारी आईडी:')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('e.g. eNAM-TRD-PB-88219', 'उदा. eNAM-TRD-PB-88219')}
                      value={bidderDetails.licenseId}
                      onChange={(e) => setBidderDetails({ ...bidderDetails, licenseId: e.target.value })}
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-mono font-bold text-xs focus:border-[#71873f] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#243118]">{t('Trading Entity / Company Name:', 'व्यापारिक संस्था / कंपनी का नाम:')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('e.g. Adani Agri Logistics / Kisan Agro', 'उदा. कंपनी या व्यापारिक फर्म का नाम')}
                    value={bidderDetails.entityName}
                    onChange={(e) => setBidderDetails({ ...bidderDetails, entityName: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-bold text-xs focus:border-[#71873f] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Registered Mobile:', 'पंजीकृत मोबाइल:')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={bidderDetails.phone}
                      onChange={(e) => setBidderDetails({ ...bidderDetails, phone: e.target.value })}
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-mono font-bold text-xs focus:border-[#71873f] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Registered Email:', 'पंजीकृत ईमेल:')}</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. buyer@agricorp.in"
                      value={bidderDetails.email}
                      onChange={(e) => setBidderDetails({ ...bidderDetails, email: e.target.value })}
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2.5 font-bold text-xs focus:border-[#71873f] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Target Bid Rate & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Initial Bid Rate (₹ / Qtl):', 'प्रारंभिक बोली दर (₹ / कुंतल):')}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm font-bold text-[#71873f]">₹</span>
                      <input
                        type="number"
                        required
                        placeholder={detailsModalLot ? `e.g. ${parseInt(detailsModalLot.currentBid.replace(/[^0-9]/g, '')) + 50}` : 'e.g. 2450'}
                        value={bidderDetails.bidAmount}
                        onChange={(e) => setBidderDetails({ ...bidderDetails, bidAmount: e.target.value })}
                        className="w-full bg-[#fcfaf7] border-2 border-[#71873f] rounded-xl pl-7 pr-3 py-2 font-mono font-extrabold text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#243118]">{t('Quantity Required (Qtl):', 'आवश्यक मात्रा (कुंतल):')}</label>
                    <input
                      type="number"
                      required
                      placeholder={detailsModalLot ? `e.g. ${parseInt(detailsModalLot.quantity.replace(/[^0-9]/g, '')) || 450}` : 'e.g. 450'}
                      value={bidderDetails.quantity}
                      onChange={(e) => setBidderDetails({ ...bidderDetails, quantity: e.target.value })}
                      className="w-full bg-[#fcfaf7] border border-[#abbe99] rounded-xl p-2 font-mono font-bold text-sm focus:border-[#71873f] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Total Valuation Calculation Box */}
                <div className="bg-[#fcfaf7] p-3.5 rounded-2xl border border-[#abbe99] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#637554]">Calculated Valuation:</span>
                  <span className="text-base font-extrabold text-[#a36627]">
                    ₹{(parseInt(bidderDetails.bidAmount || 0) * parseInt(bidderDetails.quantity || 0)).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDetailsModalLot(null)}
                    className="w-1/3 bg-[#f4efe6] hover:bg-[#e8dfd1] text-[#243118] font-bold py-3.5 rounded-2xl text-xs transition-colors"
                  >
                    {t('Cancel', 'रद्द करें')}
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 bg-[#71873f] hover:bg-[#688557] text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>{t('Enter Live Room & Place Bid', 'लाइव रूम में प्रवेश करें व बोली लगाएं')}</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
