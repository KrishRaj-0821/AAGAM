import React, { useState } from 'react';
import { ChevronLeft, Gavel, TrendingUp, Package, CreditCard, Truck } from 'lucide-react';

const AUCTION_LOTS = [
  { id: 'LOT-PB-KNH-2241', crop: 'Paddy Basmati 1121', qty: 420, mandi: 'Khanna APMC, Punjab', grade: 'A', moisture: 9.8, reserve: 3800, current: 4220, bids: 18, closing: '2h 45m', leader: 'Punjab Agri Corp' },
  { id: 'LOT-HR-KRN-0892', crop: 'Wheat FAQ Grade A', qty: 280, mandi: 'Karnal Central Yard', grade: 'A', moisture: 10.8, reserve: 2400, current: 2620, bids: 12, closing: '4h 10m', leader: 'Adani Agri' },
  { id: 'LOT-MH-LAT-0445', crop: 'Chana Desi Premium', qty: 160, mandi: 'Latur APMC, Mah.', grade: 'A', moisture: 8.5, reserve: 5500, current: 5890, bids: 9, closing: '1h 22m', leader: 'Vimal Foods' },
  { id: 'LOT-RJ-BJP-1192', crop: 'Mustard Bold', qty: 340, mandi: 'Bharatpur APMC', grade: 'A', moisture: 8.2, reserve: 5900, current: 6280, bids: 14, closing: '5h 00m', leader: 'You (Winning!)' },
];

export default function BuyerPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [myBids, setMyBids] = useState({ 'LOT-RJ-BJP-1192': 6280 });
  const [bidInput, setBidInput] = useState({});

  const placeBid = (lotId, minBid) => {
    const amount = parseInt(bidInput[lotId]);
    if (!amount || amount <= minBid) return alert(`Bid must exceed ₹${minBid}/Qtl`);
    setMyBids(prev => ({ ...prev, [lotId]: amount }));
    setBidInput(prev => ({ ...prev, [lotId]: '' }));
    alert(`✅ Bid of ₹${amount}/Qtl placed for ${lotId}! Escrow locked automatically.`);
  };

  const tabs = [
    { key: 'dashboard', label: '💼 Dashboard', hi: 'डैशबोर्ड' },
    { key: 'auctions', label: '🔨 Live Auctions', hi: 'लाइव नीलामी' },
    { key: 'mybids', label: '📋 My Bids', hi: 'मेरी बोलियां' },
    { key: 'inventory', label: '📦 Won Inventory', hi: 'जीती फसलें' },
    { key: 'payments', label: '💳 Escrow & Payments', hi: 'एस्क्रो' },
  ];

  return (
    <section className="min-h-screen bg-[#fef9f3] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#7c3d10] to-[#a36627] rounded-3xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-2xl shadow-lg">💼</div>
            <div>
              <h1 className="text-2xl font-extrabold">Buyer / Trader Portal</h1>
              <p className="text-sm text-amber-200">{currentUser?.name || 'Punjab Agri Corp'} • eNAM-TRD-PB-88219 • Punjab</p>
            </div>
          </div>
          <div className="text-right hidden md:block font-mono text-sm">
            <div className="text-amber-200">Escrow Balance: <span className="text-white font-bold">₹28,50,000</span></div>
            <div className="text-amber-200">Credit Limit: <span className="text-white font-bold">₹50 Lakh</span></div>
            <div className="text-[10px] text-amber-300 mt-1">PFMS Verified • eNAM Licensed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-[#a36627] text-white shadow-md' : 'bg-white text-[#243118] border border-[#abbe99] hover:bg-amber-50'}`}>
              {t(tab.label, tab.hi)}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Active Bids', val: '3 Lots', sub: '₹62.4L Staked', color: 'amber', icon: '🔨' },
                { label: 'Won Today', val: '8 Lots', sub: '1,840 Qtl • ₹2.14 Cr', color: 'emerald', icon: '🏆' },
                { label: 'Escrow Balance', val: '₹28.5L', sub: 'PFMS Linked', color: 'sky', icon: '🏦' },
                { label: 'Delivery Pending', val: '3 Trucks', sub: 'GPS In-Transit', color: 'purple', icon: '🚚' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-4 rounded-2xl`}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[11px] font-bold text-${c.color}-700`}>{c.label}</div>
                  <div className={`text-[10px] text-${c.color}-600 mt-0.5`}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#abbe99] p-5">
              <h3 className="font-extrabold text-sm text-[#243118] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Your Active Live Bids
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {AUCTION_LOTS.filter(l => myBids[l.id]).map(l => (
                  <div key={l.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div>
                      <div className="font-bold text-[#243118]">{l.id} — {l.crop} ({l.qty} Qtl)</div>
                      <div className="text-[#637554]">{l.mandi} • Closing: {l.closing}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-[#a36627]">Your Bid: ₹{myBids[l.id]}/Qtl</div>
                      <span className="text-emerald-700 font-bold text-[10px]">🏆 WINNING</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('auctions')} className="mt-3 w-full bg-[#a36627] hover:bg-[#804d19] text-white font-bold py-2.5 rounded-xl text-xs transition-all">
                🔨 Enter Live Auction Room →
              </button>
            </div>
          </div>
        )}

        {/* LIVE AUCTIONS TAB */}
        {activeTab === 'auctions' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2 text-xs font-bold text-red-700">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              LIVE NOW: 4 Active Auctions • {AUCTION_LOTS.reduce((a, l) => a + l.bids, 0)} Total Bids Cast • ₹8.4 Cr Value
            </div>
            <div className="space-y-4">
              {AUCTION_LOTS.map(lot => (
                <div key={lot.id} className="bg-white rounded-2xl border border-[#abbe99] p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-[#243118]">{lot.id} — {lot.crop}</div>
                      <div className="text-xs text-[#637554] font-mono">{lot.mandi} • {lot.qty} Qtl • Grade {lot.grade} • {lot.moisture}% moisture</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-red-600 font-bold font-mono animate-pulse">⏱ Closes in: {lot.closing}</div>
                      <div className="text-[10px] text-[#637554] font-mono">{lot.bids} bids placed</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="bg-[#fcfaf7] p-2.5 rounded-xl border border-[#abbe99]/60 text-center">
                      <div className="text-[#637554]">Reserve</div>
                      <div className="font-bold text-[#243118]">₹{lot.reserve}/Qtl</div>
                    </div>
                    <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-center">
                      <div className="text-red-600">Current Best</div>
                      <div className="font-extrabold text-red-700">₹{myBids[lot.id] || lot.current}/Qtl</div>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                      <div className="text-emerald-600">Leader</div>
                      <div className="font-bold text-emerald-700">{myBids[lot.id] ? 'You! 🏆' : lot.leader}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={`Min ₹${(myBids[lot.id] || lot.current) + 10}/Qtl`}
                      value={bidInput[lot.id] || ''}
                      onChange={e => setBidInput(prev => ({ ...prev, [lot.id]: e.target.value }))}
                      className="flex-1 border border-[#abbe99] rounded-xl p-2.5 text-xs font-mono text-[#243118] focus:outline-none focus:border-[#a36627]"
                    />
                    <button
                      onClick={() => placeBid(lot.id, myBids[lot.id] || lot.current)}
                      className="bg-[#a36627] hover:bg-[#804d19] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all"
                    >
                      Place Bid →
                    </button>
                    {myBids[lot.id] && (
                      <button
                        onClick={() => { if(window.confirm('Withdraw your bid?')) setMyBids(p => { const n = {...p}; delete n[lot.id]; return n; }); }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-2.5 rounded-xl text-xs border border-red-200 transition-all"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY BIDS */}
        {activeTab === 'mybids' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📋 All My Bids — Today's Session</h3>
            <div className="space-y-2 text-xs font-mono">
              {AUCTION_LOTS.map(l => (
                <div key={l.id} className="flex justify-between p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                  <div>
                    <div className="font-bold text-[#243118]">{l.id} • {l.crop} ({l.qty} Qtl)</div>
                    <div className="text-[#637554]">{l.mandi}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[#a36627]">₹{myBids[l.id] || '—'}/Qtl</div>
                    <span className={`text-[10px] font-bold ${myBids[l.id] ? 'text-emerald-700' : 'text-[#637554]'}`}>{myBids[l.id] ? '🏆 WINNING' : 'NOT BID'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WON INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📦 Won Lots & Purchased Inventory</h3>
            <div className="grid md:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { crop: 'Paddy Basmati 1121', qty: 420, price: 4220, mandi: 'Khanna APMC', status: 'IN TRANSIT', eta: 'Today 6 PM' },
                { crop: 'Wheat FAQ Grade A', qty: 1000, price: 2590, mandi: 'Karnal Central', status: 'DELIVERED', eta: 'Done' },
                { crop: 'Chana Desi', qty: 160, price: 5820, mandi: 'Latur APMC', status: 'PENDING PICKUP', eta: 'Tomorrow' },
              ].map(i => (
                <div key={i.crop} className="border border-[#abbe99] rounded-xl p-3 space-y-1">
                  <div className="flex justify-between">
                    <div className="font-extrabold text-sm text-[#243118]">{i.crop}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : i.status === 'IN TRANSIT' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>{i.status}</span>
                  </div>
                  <div className="text-[#637554]">{i.qty} Qtl • ₹{i.price}/Qtl • {i.mandi}</div>
                  <div className="text-[10px] text-[#637554]">ETA: {i.eta} • Total: ₹{(i.qty * i.price).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">💳 Escrow & Payment History</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-center">
                <div className="text-sky-700 font-bold uppercase text-[10px]">Escrow Locked</div>
                <div className="text-2xl font-extrabold text-sky-900">₹42.8 Cr</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                <div className="text-emerald-700 font-bold uppercase text-[10px]">Paid Today</div>
                <div className="text-2xl font-extrabold text-emerald-900">₹2.14 Cr</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
                <div className="text-amber-700 font-bold uppercase text-[10px]">Pending Release</div>
                <div className="text-2xl font-extrabold text-amber-900">₹8.2 Cr</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
