import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, ArrowRight, LogIn, Database, UserCheck, Building2, Coins, LayoutDashboard } from 'lucide-react';
import { slides } from '../../data/mockData';

export default function HeroCarousel({
  currentSlide,
  setCurrentSlide,
  isPlaying,
  setIsPlaying,
  setIsDbtModalOpen,
  setSlotStep,
  setIsSlotModalOpen,
  setIsSearchOpen,
  setCurrentView,
  navigateWithAuth,
  openGatePassWithAuth,
  openDbtWithAuth,
  isAuthenticated,
  language,
  t
}) {
  // Auto Slider Effect
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length, setCurrentSlide]);

  const handleHeroAction = () => {
    if (currentSlide === 0) {
      if (openDbtWithAuth) {
        openDbtWithAuth();
      } else {
        setIsDbtModalOpen(true);
      }
    } else if (currentSlide === 2) {
      if (openGatePassWithAuth) {
        openGatePassWithAuth();
      } else {
        setSlotStep(1);
        setIsSlotModalOpen(true);
      }
    } else if (currentSlide === 1) {
      if (navigateWithAuth) {
        navigateWithAuth('marketplace');
      } else {
        setCurrentView('marketplace');
      }
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <section id="hero" className="relative bg-[#fcfaf7] text-[#243118] overflow-hidden py-8 md:py-12 border-b border-[#abbe99]/40">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Main Slide Carousel Outer Container with Big Image Background */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#71873f]/40 shadow-2xl min-h-[480px] md:min-h-[520px] flex flex-col justify-between p-6 md:p-12 transition-all duration-700">
          
          {/* Outer Big Slide Background Image */}
          <img
            src={slides[currentSlide].image}
            alt={t(slides[currentSlide].imageAltEn, slides[currentSlide].imageAltHi)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-105"
          />

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#243118]/90 via-[#243118]/70 to-[#243118]/40" />

          {/* Top Bar inside Outer Slider */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="bg-[#e0b87e] text-[#243118] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {t(slides[currentSlide].tagEn, slides[currentSlide].tagHi)}
              </span>
              <span className="bg-white/90 text-[#243118] text-xs font-mono font-bold px-3 py-1 rounded-full border border-white flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#a36627]" />
                {t(slides[currentSlide].badgeEn, slides[currentSlide].badgeHi)}
              </span>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3 bg-white/90 px-3 py-1.5 rounded-full border border-white shadow-lg backdrop-blur-md">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-[#243118] hover:text-[#71873f] transition-colors p-1"
                title={isPlaying ? 'Pause Auto Slider' : 'Play Auto Slider'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-[#71873f]' : 'w-2.5 bg-[#abbe99] hover:bg-[#688557]'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-[#243118] pl-2 border-l border-[#abbe99]">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                  className="p-1 hover:text-[#71873f]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="p-1 hover:text-[#71873f]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide Content Grid Overlay */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Column: Text & Hero Action */}
            <div className="lg:col-span-8 space-y-4 text-white">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {t(slides[currentSlide].titleEn, slides[currentSlide].titleHi)}
              </h1>
              
              <p className="text-slate-100 text-sm md:text-base leading-relaxed max-w-2xl font-medium drop-shadow">
                {t(slides[currentSlide].subtitleEn, slides[currentSlide].subtitleHi)}
              </p>

              {/* Key Bullet Highlights */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(language === 'hi' ? slides[currentSlide].detailsHi : slides[currentSlide].detailsEn).map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/95 p-2 rounded-lg text-xs text-[#243118] shadow-md font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#71873f] shrink-0" />
                    <span className="line-clamp-1">{detail}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleHeroAction}
                  className="flex items-center gap-2 bg-[#e0b87e] hover:bg-[#a36627] text-[#243118] hover:text-white font-extrabold px-6 py-3 rounded-xl shadow-xl text-sm transition-all transform active:scale-95"
                >
                  {React.createElement(slides[currentSlide].actionIcon, { className: 'w-4 h-4' })}
                  <span>{t(slides[currentSlide].actionTextEn, slides[currentSlide].actionTextHi)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (navigateWithAuth) {
                      navigateWithAuth('portal');
                    } else {
                      setCurrentView(isAuthenticated ? 'portal' : 'login');
                    }
                  }}
                  className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#243118] px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-colors"
                >
                  {isAuthenticated ? (
                    <>
                      <LayoutDashboard className="w-4 h-4 text-[#71873f]" />
                      <span>{t('Go to Stakeholder Portal', 'हितधारक पोर्टल पर जाएं')}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-[#71873f]" />
                      <span>{t('Sign In to Access Portal', 'पोर्टल में साइन इन करें')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Outer Slider Glassmorphic Metric Box */}
            <div className="lg:col-span-4">
              <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border border-white shadow-2xl space-y-3 text-[#243118]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#a36627] font-extrabold uppercase tracking-wider">
                    {t('REAL-TIME SYSTEM METRIC', 'वास्तविक समय प्रणाली मीट्रिक')}
                  </span>
                  <span className="bg-[#688557] text-white text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                    Live Verified
                  </span>
                </div>

                <div className="text-2xl lg:text-3xl font-extrabold text-[#71873f] font-mono">
                  {t(slides[currentSlide].statEn, slides[currentSlide].statHi)}
                </div>

                <div className="text-[11px] text-[#4c633e] font-semibold border-t border-[#abbe99]/40 pt-2 line-clamp-1">
                  {t(slides[currentSlide].imageAltEn, slides[currentSlide].imageAltHi)}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* System Key Indicators Row */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white border border-[#abbe99]/60 rounded-2xl p-4 flex items-center gap-4 hover:border-[#71873f] transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#71873f]/10 border border-[#71873f]/30 flex items-center justify-center text-[#71873f] shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#243118] font-mono">48.25M</div>
              <div className="text-xs text-[#637554] font-medium">{t('MT Grain Managed', 'मीट्रिक टन खाद्यान्न का प्रबंधन')}</div>
            </div>
          </div>

          <div className="bg-white border border-[#abbe99]/60 rounded-2xl p-4 flex items-center gap-4 hover:border-[#688557] transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#688557]/10 border border-[#688557]/30 flex items-center justify-center text-[#688557] shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#243118] font-mono">12.48M</div>
              <div className="text-xs text-[#637554] font-medium">{t('Verified Farmers', 'सत्यापित पंजीकृत किसान')}</div>
            </div>
          </div>

          <div className="bg-white border border-[#abbe99]/60 rounded-2xl p-4 flex items-center gap-4 hover:border-[#a36627] transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#a36627]/10 border border-[#a36627]/30 flex items-center justify-center text-[#a36627] shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#243118] font-mono">2,840</div>
              <div className="text-xs text-[#637554] font-medium">{t('Connected Mandis', 'सक्रिय जुड़े मंडियां')}</div>
            </div>
          </div>

          <div className="bg-white border border-[#abbe99]/60 rounded-2xl p-4 flex items-center gap-4 hover:border-[#e0b87e] transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#e0b87e]/20 border border-[#a36627]/30 flex items-center justify-center text-[#a36627] shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#243118] font-mono">₹1.42L Cr</div>
              <div className="text-xs text-[#637554] font-medium">{t('Total DBT Disbursed', 'कुल डीबीटी भुगतान')}</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
