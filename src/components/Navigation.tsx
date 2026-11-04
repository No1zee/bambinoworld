import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import {
  BambinoSprout,
  BambinoCastle,
  BambinoCompass,
  BambinoCalendar,
  BambinoTicket,
  BambinoSun
} from './icons/BambinoIcons';
import { soundscape } from '../utils/soundscape';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenBooking: () => void;
  bookingCount?: number;
  timeOfDay?: 'day' | 'sunset' | 'night';
  onTimeOfDayChange?: (mode: 'day' | 'sunset' | 'night') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  onOpenBooking,
  timeOfDay = 'day',
  onTimeOfDayChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home', icon: BambinoSun },
    { id: 'zones', label: 'Play Zones', icon: BambinoCastle },
    { id: '3d-map', label: '3D Festival Map', icon: BambinoCompass },
    { id: 'december-5', label: '5 Dec Programme', icon: BambinoCalendar },
    { id: 'farm', label: 'The Little Farm', icon: BambinoSprout }
  ];

  const handleSelectTab = (tabId: string) => {
    soundscape.playMarimbaClick(520, 0.06);
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. THOMPSON SIGNATURE SKY BLUE UTILITY TOP BAR (#00A3E0) */}
      <div className="bg-[#00A3E0] text-white text-[11px] sm:text-xs font-poppins font-semibold py-2 px-4 border-b border-[#008fca] transition-colors select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 tracking-wide truncate">
            <span className="font-bold text-white uppercase tracking-wider">Festival Hotline:</span>
            <a href="tel:+263779140417" className="underline hover:text-white/90 font-bold">
              +263 779 140 417
            </a>
            <span className="opacity-60 hidden md:inline">|</span>
            <span className="hidden md:inline font-medium">Saturday 5 Dec 2026 · 10am – 5pm</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenBooking}
              className="bg-[#D82374] hover:bg-[#c01863] text-white font-black px-3.5 py-1 text-[10px] sm:text-[11px] tracking-wider uppercase transition cursor-pointer shadow-xs active:scale-95"
            >
              Early Bird Passes
            </button>
            <button
              onClick={() => handleSelectTab('farm')}
              className="bg-[#31006F] hover:bg-[#250058] text-white font-black px-3 py-1 text-[10px] sm:text-[11px] tracking-wider uppercase transition cursor-pointer hidden sm:inline-block active:scale-95"
            >
              Directions
            </button>
          </div>
        </div>
      </div>

      {/* 2. THOMPSON CLEAN WHITE MAIN NAVIGATION */}
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 pt-[env(safe-area-inset-top,0px)] shadow-xs transition-colors duration-300"
        style={{
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo with Thompson-Style Vertical Divider Lockup */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectTab('home')}
              className="inline-flex items-center cursor-pointer group py-1 transition-transform hover:scale-[1.02] active:scale-95 shrink-0"
              title="Bambino World Home"
            >
              <img
                src="/bambino-logo.png"
                alt="Bambino World"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs"
                loading="eager"
              />
            </button>
            <div className="hidden sm:flex items-center h-8 pl-4 ml-1 border-l-2 border-slate-300 text-xs font-poppins font-black text-[#31006F] tracking-wider uppercase">
              <span>HARARE · 2026</span>
            </div>
          </div>

          {/* Desktop Navigation Links in Poppins font with Chubby Storybook Icons */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-poppins font-bold text-slate-700">
            {navItems.filter(item => item.id !== "home").map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  onMouseEnter={() => soundscape.playMarimbaClick(580, 0.02)}
                  className={`min-h-[44px] flex items-center gap-2.5 transition-all whitespace-nowrap shrink-0 cursor-pointer relative py-1 group ${
                    isActive
                      ? 'text-[#31006F] font-black border-b-2 border-[#31006F]'
                      : 'hover:text-[#FF6720] hover:-translate-y-0.5'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-colors ${isActive ? 'text-[#FF6720]' : 'text-slate-500 group-hover:text-[#FF6720]'}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls & CTA */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Thompson Signature Tangerine Orange CTA Button with Chubby Ticket */}
            <button
              type="button"
              onClick={() => {
                soundscape.playMarimbaClick(720, 0.08);
                onOpenBooking();
              }}
              className="h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap group"
            >
              <BambinoTicket size={18} className="text-white shrink-0" />
              <span>Book Pass ($25)</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center ml-1">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 flex items-center justify-center cursor-pointer transition border border-slate-200"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 bg-white border-b border-slate-200 shadow-2xl p-6 pt-[max(1.25rem,env(safe-area-inset-top,0px))] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="inline-flex items-center">
                <img
                  src="/bambino-logo.png"
                  alt="Bambino World"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 font-poppins font-bold text-base text-slate-800">
              {navItems.filter(item => item.id !== "home").map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition text-left cursor-pointer group ${
                      isActive
                        ? 'bg-[#31006F] text-white font-black'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon size={22} className={isActive ? 'text-[#FF6720]' : 'text-slate-500 group-hover:text-[#FF6720]'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 px-5 rounded-full bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer group"
              >
                <BambinoTicket size={20} className="text-white" />
                <span>Book Pass ($25)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
