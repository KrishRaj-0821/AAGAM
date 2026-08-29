import React, { useState, useEffect } from 'react';
import { ChevronLeft, Truck, MapPin, Navigation, Clock, ShieldCheck, CheckCircle2, ArrowRight, UserCheck, X, Sprout } from 'lucide-react';
import { logisticsVehicles } from '../data/mockData';
import { dbEngine } from '../data/dbEngine';

export default function LogisticsPage({ setCurrentView, t }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sharedProcurements, setSharedProcurements] = useState(() => dbEngine.getAllSharedProcurements());

  useEffect(() => {
    const unsub = dbEngine.subscribe((db) => {
      setSharedProcurements(db.sharedProcurements || []);
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-10 bg-[#fcfaf7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Top Header */}
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
              {t('Logistics & Transport Management System', 'लॉजिस्टिक्स एवं परिवहन प्रबंधन प्रणाली')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#f0f4ea] text-[#688557] font-mono text-xs font-bold px-3 py-1 rounded-full border border-[#abbe99]">
              Live GPS Transit Sync
            </span>
          </div>
        </div>

        {/* Hero Section Banner */}
        <div className="bg-gradient-to-r from-[#243118] via-[#334423] to-[#243118] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#e0b87e]/40">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-[#e0b87e] text-[#243118] font-mono text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {t('FLEET & TRANSIT MONITOR', 'बेड़ा एवं पारगमन मॉनिटर')}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {t('Grain Transit & GPS Fleet Tracking', 'अनाज परिवहन एवं जीपीएस ट्रैकिंग')}
            </h1>
            <p className="text-xs text-slate-200 leading-relaxed">
              {t('Real-time GPS tracking of grain transport trucks from farmgate to mandis and FCI silos with e-Waybill validation.', 'खेत से मंडी और गोदाम तक अनाज ट्रकों की रीयल-टाइम जीपीएस ट्रैकिंग और ई-वेबिल सत्यापन।')}
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center font-mono space-y-1 shrink-0">
            <div className="text-xs text-[#e0b87e] font-bold">{t('ACTIVE FLEET IN TRANSIT', 'सक्रिय ट्रक')}</div>
            <div className="text-3xl font-extrabold text-white">18,420 Trucks</div>
            <div className="text-[10px] text-slate-300">100% GPS Enabled</div>
          </div>
        </div>

        {/* UNIFIED 8-ROLE SHARED PROCUREMENT TRANSPORTER DISPATCH MOVEMENT */}
        <div className="bg-[#243118] text-white rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs border border-[#abbe99]/40">
          <div className="flex justify-between items-center border-b border-[#abbe99]/30 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>UNIFIED SHARED PROCUREMENT TRANSPORTER MOVEMENT JOBS</span>
              </h3>
              <p className="text-[11px] text-slate-300">Synchronized live with Procurement Center & Warehouse via ONE shared Procurement ID</p>
            </div>
            <span className="bg-[#71873f] text-white font-bold px-2.5 py-0.5 rounded text-[10px]">BALJIT SINGH FLEET</span>
          </div>

          {sharedProcurements.filter(p => p.approvalStatus === 'APPROVED').length === 0 ? (
            <div className="text-center py-4 text-slate-400">No active grain movement requests assigned yet.</div>
          ) : (
            <div className="space-y-3">
              {sharedProcurements.filter(p => p.approvalStatus === 'APPROVED').map(proc => (
                <div key={proc.id} className="bg-[#1c2713] border border-[#abbe99]/40 rounded-xl p-4 space-y-2">
                  <div className="flex flex-wrap justify-between items-center border-b border-[#abbe99]/20 pb-2">
                    <div>
                      <div className="font-black text-amber-300 text-sm flex items-center gap-2">
                        <span>{proc.id}</span>
                        <span className="bg-[#28381c] text-amber-200 text-[10px] px-2 py-0.5 rounded border border-[#abbe99]/30">
                          {proc.crop} ({proc.quantityKg} KG Net Grain Load)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Origin: <strong>{proc.procurementCenter}</strong> ➔ Destination: <strong>{proc.warehouseName} ({proc.warehouseId})</strong>
                      </div>
                    </div>

                    <div>
                      <span className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-lg text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DISPATCH ASSIGNED (Vehicle #HR-10-AB-9981)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] bg-[#243118] p-2 rounded-lg text-slate-300">
                    <div>Assigned Transporter: <strong className="text-amber-300">Baljit Singh Transport Fleet</strong></div>
                    <div>Driver Contact: <strong className="text-emerald-400">+91 98880 44910</strong></div>
                    <div>Transit GPS Status: <strong className="text-emerald-300 font-black">EN ROUTE TO WAREHOUSE</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {logisticsVehicles.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-[#abbe99] p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f0f4ea] border border-[#abbe99] flex items-center justify-center text-[#71873f]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#243118] font-mono">{v.truckNo}</h3>
                      <p className="text-xs text-[#637554] font-medium">{t('Driver:', 'चालक:')} {v.driver}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${v.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-800 border border-amber-300' : v.status === 'LOADING' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                    {v.status}
                  </span>
                </div>

                <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#abbe99]/50 text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#637554]">{t('Origin:', 'प्रारंभिक स्थान:')}</span>
                    <span className="font-bold text-[#243118]">{v.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#637554]">{t('Destination:', 'गंतव्य:')}</span>
                    <span className="font-bold text-[#71873f]">{v.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#637554]">{t('Estimated Arrival:', 'अनुमानित समय:')}</span>
                    <span className="font-bold text-[#a36627]">{v.eta}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#abbe99]/40">
                    <span className="text-[#637554]">{t('Live GPS Speed:', 'जीपीएस गति:')}</span>
                    <span className="font-bold text-[#243118]">{v.speed}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedVehicle(v)}
                className="w-full bg-[#71873f] hover:bg-[#688557] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>{t('Track Live Location & Map', 'लाइव जीपीएस स्थिति देखें')}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Live GPS Modal */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#abbe99] max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#abbe99]/60 pb-3">
                <h3 className="font-extrabold text-lg text-[#243118] flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#71873f]" />
                  <span>{t('Live Transport GPS Tracking', 'लाइव वाहन ट्रैकिंग')}</span>
                </h3>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#f0f4ea] p-4 rounded-2xl border border-[#abbe99] space-y-2 text-xs font-mono">
                <div className="flex justify-between font-bold text-sm text-[#243118]">
                  <span>{selectedVehicle.truckNo}</span>
                  <span className="text-[#71873f]">{selectedVehicle.speed}</span>
                </div>
                <div className="text-[#637554] flex items-center gap-1.5">
                  <span>{selectedVehicle.origin}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71873f]" />
                  <span>{selectedVehicle.destination}</span>
                </div>
                <div className="text-[10px] text-slate-500">GPS Coords: {selectedVehicle.gps}</div>
              </div>

              {/* Map Placeholder Graphic */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white text-center space-y-3 relative overflow-hidden border border-slate-700">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#71873f_1px,transparent_1px)] [background-size:16px_16px]" />
                <Navigation className="w-10 h-10 text-[#e0b87e] mx-auto animate-bounce relative z-10" />
                <div className="font-mono text-xs text-[#e0b87e] font-bold relative z-10">
                  SATELLITE TELEMATICS SIGNAL LOCK
                </div>
                <p className="text-[10px] text-slate-300 relative z-10">
                  {t('Vehicle is moving smoothly along NH-44 highway. Zero delay detected.', 'वाहन एनएच-44 पर सुगम गति से बढ़ रहा है।')}
                </p>
              </div>

              <button
                onClick={() => setSelectedVehicle(null)}
                className="w-full bg-[#243118] hover:bg-[#334423] text-white font-bold py-3 rounded-xl text-xs"
              >
                {t('Close Tracking Window', 'विंडो बंद करें')}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
