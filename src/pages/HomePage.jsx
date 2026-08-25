import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import PriceMatrix from '../components/home/PriceMatrix';
import PillarsSimulator from '../components/home/PillarsSimulator';
import MandiLocator from '../components/home/MandiLocator';
import BlockchainLedger from '../components/home/BlockchainLedger';

export default function HomePage({
  currentSlide,
  setCurrentSlide,
  isPlaying,
  setIsPlaying,
  highContrast,
  setIsDbtModalOpen,
  setSlotStep,
  setIsSlotModalOpen,
  setIsSearchOpen,
  setCurrentView,
  navigateWithAuth,
  openGatePassWithAuth,
  openDbtWithAuth,
  setBookingDetails,
  language,
  isAuthenticated,
  t
}) {
  return (
    <main key="home-view">
      {/* 1. Outer Hero Big Picture Slider Carousel */}
      <HeroCarousel
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setIsDbtModalOpen={setIsDbtModalOpen}
        setSlotStep={setSlotStep}
        setIsSlotModalOpen={setIsSlotModalOpen}
        setIsSearchOpen={setIsSearchOpen}
        setCurrentView={setCurrentView}
        navigateWithAuth={navigateWithAuth}
        openGatePassWithAuth={openGatePassWithAuth}
        openDbtWithAuth={openDbtWithAuth}
        isAuthenticated={isAuthenticated}
        language={language}
        t={t}
      />

      {/* 2. Real-Time Commodity & Mandi Price Matrix */}
      <PriceMatrix
        highContrast={highContrast}
        language={language}
        t={t}
      />

      {/* 3. 4 Pillars Ecosystem Interactive Lifecycle Simulator */}
      <PillarsSimulator
        highContrast={highContrast}
        navigateWithAuth={navigateWithAuth}
        setCurrentView={setCurrentView}
        language={language}
        t={t}
      />

      {/* 4. Mandi Locator & Queue Monitor */}
      <MandiLocator
        highContrast={highContrast}
        setBookingDetails={setBookingDetails}
        setSlotStep={setSlotStep}
        setIsSlotModalOpen={setIsSlotModalOpen}
        openGatePassWithAuth={openGatePassWithAuth}
        language={language}
        t={t}
      />

      {/* 5. Immutable Blockchain Provenance Traceability Ledger */}
      <BlockchainLedger
        highContrast={highContrast}
        language={language}
        t={t}
      />
    </main>
  );
}
