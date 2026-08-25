import React, { useState } from 'react';
import { ChevronLeft, Users, ShieldCheck, Database, Activity, Server, Bell } from 'lucide-react';

export default function AdminPortalPage({ setCurrentView, currentUser, t }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { key: 'dashboard', label: '⚙️ Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
    { key: 'users', label: '👥 User Management', hi: 'उपयोगकर्ता प्रबंधन' },
    { key: 'msp', label: '📋 MSP Policy', hi: 'एमएसपी नीति' },
    { key: 'system', label: '🖥️ System Health', hi: 'सिस्टम स्वास्थ्य' },
    { key: 'security', label: '🔐 Security & Audit', hi: 'सुरक्षा ऑडिट' },
    { key: 'notifications', label: '🔔 Notifications', hi: 'अधिसूचनाएं' },
  ];

  const MSP_DATA = [
    { crop: 'Wheat (Common)', msp: 2425, prev: 2275, season: 'Rabi 2025-26' },
    { crop: 'Mustard (Bold)', msp: 5950, prev: 5650, season: 'Rabi 2025-26' },
    { crop: 'Chana (Desi)', msp: 5650, prev: 5440, season: 'Rabi 2025-26' },
    { crop: 'Paddy (Common)', msp: 2300, prev: 2183, season: 'Kharif 2025' },
    { crop: 'Soyabean (Yellow)', msp: 4892, prev: 4600, season: 'Kharif 2025' },
    { crop: 'Cotton (Long)', msp: 7521, prev: 7020, season: 'Kharif 2025' },
    { crop: 'Maize', msp: 2225, prev: 2090, season: 'Kharif 2025' },
    { crop: 'Tur (Arhar)', msp: 7550, prev: 7000, season: 'Kharif 2025' },
  ];

  const SERVICES = [
    { name: 'AAGAM Core API Gateway', uptime: '99.99%', status: 'HEALTHY', latency: '82ms' },
    { name: 'NPCI DBT Bridge', uptime: '99.97%', status: 'HEALTHY', latency: '142ms' },
    { name: 'AgriStack Aadhaar e-KYC', uptime: '99.95%', status: 'HEALTHY', latency: '210ms' },
    { name: 'Agmarknet Price Feed', uptime: '99.80%', status: 'HEALTHY', latency: '55ms' },
    { name: 'SMS/WhatsApp Gateway', uptime: '99.94%', status: 'HEALTHY', latency: '95ms' },
    { name: 'PostgreSQL DB Cluster', uptime: '100%', status: 'HEALTHY', latency: '12ms' },
    { name: 'Redis Cache Layer', uptime: '99.99%', status: 'HEALTHY', latency: '4ms' },
    { name: 'NIC Cloud CDN (Akamai)', uptime: '99.99%', status: 'HEALTHY', latency: '28ms' },
  ];

  return (
    <section className="min-h-screen bg-[#f3f0fb] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-[#1c1464] to-[#2c1e82] rounded-3xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg">⚙️</div>
            <div>
              <h1 className="text-2xl font-extrabold">System Admin Portal</h1>
              <p className="text-sm text-indigo-200">{currentUser?.name || 'Sysadmin'} • GOI AAGAM Root Access • NIC MeitY Tier-4</p>
            </div>
          </div>
          <div className="text-right hidden md:block font-mono text-sm">
            <div className="text-indigo-200">Platform: <span className="text-white font-bold">99.99% Uptime</span></div>
            <div className="text-indigo-200">Users: <span className="text-white font-bold">4.2 Cr Registered</span></div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-indigo-700 text-white shadow-md' : 'bg-white text-[#243118] border border-[#abbe99] hover:bg-indigo-50'}`}>
              {t(tab.label, tab.hi)}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', val: '4.2 Cr', sub: '1.28L active today', color: 'indigo', icon: '👥' },
                { label: 'Procurement Today', val: '14,800 MT', sub: '82.4% of national target', color: 'emerald', icon: '🌾' },
                { label: 'DBT Disbursed', val: '₹42.8 Cr', sub: '0 SLA breaches', color: 'amber', icon: '💳' },
                { label: 'System Security', val: '0 Breaches', sub: '4,820 logins monitored', color: 'sky', icon: '🔐' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-4 rounded-2xl`}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className={`text-xl font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[11px] font-bold text-${c.color}-700`}>{c.label}</div>
                  <div className={`text-[10px] text-${c.color}-600 mt-0.5`}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-white rounded-2xl border border-[#abbe99] p-4">
                <h4 className="font-extrabold text-[#243118] mb-2">Quick Stats</h4>
                {[
                  ['Total Farmers Registered', '4.2 Crore'],
                  ['Buyers Licensed (eNAM)', '48,200'],
                  ['Procurement Centers', '2,840 Active'],
                  ['Warehouses (WDRA)', '1,480 Certified'],
                  ['API Request Rate', '12,480/min'],
                  ['DB Transactions/sec', '2,840 TPS'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-[#abbe99]/40">
                    <span className="text-[#637554]">{k}:</span>
                    <span className="font-bold text-[#243118]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-[#abbe99] p-4">
                <h4 className="font-extrabold text-[#243118] mb-2">Recent Admin Actions</h4>
                <div className="space-y-2">
                  {[
                    { action: 'MSP Updated — Wheat ₹2,425 effective', time: '1h ago', type: 'policy' },
                    { action: 'New Center Added — Vijayawada APMC, AP', time: '2h ago', type: 'center' },
                    { action: 'Farmer Account Deactivated (Fraud) — ID: RJ-88210', time: '3h ago', type: 'security' },
                    { action: 'SMS Gateway Failover Test — All 36 States', time: '5h ago', type: 'system' },
                  ].map(a => (
                    <div key={a.action} className="flex justify-between p-2 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                      <span className="text-[#243118] font-bold truncate max-w-[200px]">{a.action}</span>
                      <span className="text-[#637554] text-[10px] shrink-0 ml-2">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">👥 User Management — Role-wise Registry</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              {[
                { role: '🌾 Farmers', count: '4.2 Crore', kyc: '100% Aadhaar', color: 'emerald' },
                { role: '💼 Buyers/Traders', count: '48,200', kyc: '100% eNAM', color: 'amber' },
                { role: '🏛️ Govt Officers', count: '12,400', kyc: 'GOI SSO', color: 'blue' },
                { role: '🏪 Operators', count: '8,840', kyc: 'Mandi ID', color: 'purple' },
                { role: '🔬 Quality Insp.', count: '4,200', kyc: 'ICAR Cert.', color: 'emerald' },
                { role: '🏭 Warehouse Mgr.', count: '2,960', kyc: 'WDRA Cert.', color: 'sky' },
                { role: '🚚 Logistics', count: '28,400', kyc: 'VAHAN Linked', color: 'amber' },
                { role: '⚙️ System Admins', count: '42', kyc: '2FA + MFA', color: 'red' },
              ].map(c => (
                <div key={c.role} className={`bg-${c.color}-50 border border-${c.color}-200 p-3 rounded-xl`}>
                  <div className="font-extrabold text-[#243118]">{c.role}</div>
                  <div className={`text-base font-extrabold text-${c.color}-900`}>{c.count}</div>
                  <div className={`text-[10px] text-${c.color}-600`}>{c.kyc} Verified</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MSP POLICY */}
        {activeTab === 'msp' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6">
            <h3 className="font-extrabold text-base text-[#243118] mb-4">📋 Government MSP Policy Master — 2025–26</h3>
            <div className="space-y-2 text-xs font-mono">
              {MSP_DATA.map(m => {
                const inc = m.msp - m.prev;
                const pct = ((inc / m.prev) * 100).toFixed(1);
                return (
                  <div key={m.crop} className="flex items-center justify-between p-3 bg-[#fcfaf7] rounded-xl border border-[#abbe99]/60">
                    <div>
                      <div className="font-bold text-[#243118]">{m.crop}</div>
                      <div className="text-[#637554] text-[10px]">{m.season}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-[#243118]">₹{m.msp.toLocaleString('en-IN')}/Qtl</div>
                      <div className="text-emerald-700 text-[10px] font-bold">↑ ₹{inc} (+{pct}%) from prev year</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all">
              ✏️ Update MSP Rates (Cabinet Approval Required)
            </button>
          </div>
        )}

        {/* SYSTEM HEALTH */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">🖥️ Microservices Health Monitor</h3>
            <div className="space-y-2 text-xs font-mono">
              {SERVICES.map(s => (
                <div key={s.name} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-bold text-[#243118]">{s.name}</div>
                      <div className="text-[#637554] text-[10px]">Latency: {s.latency}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-emerald-700">{s.status}</div>
                    <div className="text-[10px] text-[#637554]">{s.uptime} uptime</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">🔐 Security & Audit Log</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              {[
                { label: 'Security Breaches', val: '0 Today', color: 'emerald' },
                { label: 'Login Attempts', val: '4,820', color: 'sky' },
                { label: 'Blocked IPs', val: '42 Blocked', color: 'red' },
                { label: 'MFA Enforced', val: '100% Users', color: 'emerald' },
                { label: 'Session Timeout', val: '30 Minutes', color: 'amber' },
                { label: 'Last Audit', val: 'Today 02:12 AM', color: 'purple' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-3 rounded-xl text-center`}>
                  <div className={`text-base font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[10px] text-${c.color}-700 font-bold uppercase`}>{c.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { event: 'SUSPICIOUS: 12 failed logins from IP 103.21.xx.xx (Blocked)', time: '2h ago', level: 'HIGH' },
                { event: 'AUDIT: MSP rates updated by Admin #AAGAM-ADMIN-001', time: '1h ago', level: 'INFO' },
                { event: 'AUDIT: Farmer deactivated (fraud) — ID RJ-88210', time: '3h ago', level: 'HIGH' },
              ].map(e => (
                <div key={e.event} className={`p-3 rounded-xl text-xs font-mono border ${e.level === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-sky-50 border-sky-200'}`}>
                  <div className={`font-bold ${e.level === 'HIGH' ? 'text-red-700' : 'text-sky-700'}`}>[{e.level}] {e.event}</div>
                  <div className="text-[#637554] text-[10px]">{e.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-[#abbe99] p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#243118]">🔔 SMS & WhatsApp Gateway Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              {[
                { label: 'SMS Sent Today', val: '2.48 Lakh', color: 'sky' },
                { label: 'WhatsApp Msgs', val: '84,200', color: 'emerald' },
                { label: 'Email Sent', val: '48,200', color: 'amber' },
                { label: 'SMS Delivery Rate', val: '99.4%', color: 'emerald' },
                { label: 'Email Delivery Rate', val: '99.8%', color: 'emerald' },
                { label: '1-Hr Pre Alerts Sent', val: '1,280', color: 'purple' },
              ].map(c => (
                <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 p-3 rounded-xl text-center`}>
                  <div className={`text-base font-extrabold text-${c.color}-900`}>{c.val}</div>
                  <div className={`text-[10px] text-${c.color}-700 font-bold uppercase`}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
