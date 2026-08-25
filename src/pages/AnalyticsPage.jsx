import React from 'react';
import { ChevronLeft, TrendingUp, BarChart3, ShieldCheck, Microscope, ArrowRight, Zap } from 'lucide-react';
import { analyticsPredictions } from '../data/mockData';

export default function AnalyticsPage({ setCurrentView, t }) {
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
              {t('AI Predictive Analytics & Supply Forecasting', 'एआई विश्लेषणात्मक पूर्वाभास डैशबोर्ड')}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#688557]">
            <Zap className="w-4 h-4 text-[#a36627]" />
            <span>AI NEURAL MODEL v4.8</span>
          </div>
        </div>

        {/* Hero Section Banner */}
        <div className="bg-gradient-to-r from-[#243118] via-[#334423] to-[#243118] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#e0b87e]/40">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-[#a36627] text-white font-mono text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {t('PREDICTIVE INTELLIGENCE', 'पूर्वानुमान बुद्धिमत्ता')}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {t('AI Supply & Price Forecasting', 'एआई आपूर्ति एवं मूल्य पूर्वानुमान')}
            </h1>
            <p className="text-xs text-slate-200 leading-relaxed">
              {t('Machine learning predictive intelligence for crop arrival volumes, mandi capacity overload warnings, and national price trends.', 'मशीन लर्निंग पूर्वानुमान द्वारा फसल आवक मात्रा, मंडी ओवरलोड और राष्ट्रीय मूल्य प्रवृत्तियों की अग्रिम भविष्यवाणी।')}
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center font-mono space-y-1 shrink-0">
            <div className="text-xs text-[#e0b87e] font-bold">{t('PREDICTION ACCURACY', 'पूर्वानुमान सटीकता')}</div>
            <div className="text-3xl font-extrabold text-white">99.1%</div>
            <div className="text-[10px] text-slate-300">NIC Cloud Trained</div>
          </div>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsPredictions.map((pred, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#abbe99] p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#f0f4ea] text-[#71873f] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-[#abbe99]">
                    CONFIDENCE: {pred.confidence}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#a36627]">{pred.trend}</span>
                </div>

                <h3 className="font-extrabold text-base text-[#243118]">
                  {t(pred.metricEn, pred.metricHi)}
                </h3>

                <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#abbe99]/50 font-mono space-y-1">
                  <div className="text-[10px] text-[#637554] uppercase font-bold">{t('Predicted Forecast Value', 'पूर्वानुमानित मूल्य')}</div>
                  <div className="text-lg font-extrabold text-[#71873f]">{pred.value}</div>
                </div>

                <p className="text-xs text-[#637554] leading-relaxed">
                  {t(pred.insightEn, pred.insightHi)}
                </p>
              </div>

              <div className="pt-3 border-t border-[#abbe99]/40 flex items-center justify-between text-xs font-mono text-[#688557] font-bold">
                <span>MODEL: NEURAL-GRAIN-V4</span>
                <span>REAL-TIME AUDITED</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
