import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Sprout, Home, Castle, MapPin, Sparkles, Volume2, VolumeX, Sun, Sunset, Moon } from 'lucide-react';
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
  timeOfDay = 'day',
  onTimeOfDayChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(soundscape.getIsMuted());

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
    { id: 'home', label: 'Home', icon: Home },
    { id: 'zones', label: 'Play Zones', icon: Castle },
    { id: '3d-map', label: '3D Festival Map', icon: MapPin },
    { id: 'december-5', label: '5 Dec Programme', icon: Calendar },
    { id: 'farm', label: 'The Little Farm', icon: Sprout }
  ];

  const handleSelectTab = (tabId: string) => {
    soundscape.playMarimbaClick(520, 0.06);
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const muted = soundscape.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleCycleTimeOfDay = () => {
    if (!onTimeOfDayChange) return;
    const next: Record<'day' | 'sunset' | 'night', 'day' | 'sunset' | 'night'> = {
      day: 'sunset',
      sunset: 'night',
      night: 'day'
    };
    const nextMode = next[timeOfDay];
    soundscape.playMarimbaClick(nextMode === 'night' ? 330 : 660, 0.08);
    onTimeOfDayChange(nextMode);
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-[#faf9f5]/95 backdrop-blur-md border-b border-[#e2e8f0] pt-[env(safe-area-inset-top,0px)]"
        style={{
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Zone 1: Brand wordmark lockup - WORLD closer to BAMBINO, nicely aligned and rotated */}
          <button
            onClick={() => handleSelectTab('home')}
            className="brand inline-flex flex-col items-end cursor-pointer group whitespace-nowrap shrink-0 py-0.5 transition-transform hover:scale-[1.02]"
            aria-label="Bambino World Home"
            style={{ transform: 'rotate(-3deg)', transformOrigin: 'center center' }}
          >
            <span className="brand-name font-kid font-black tracking-normal text-2xl sm:text-3xl leading-none flex items-center">
              <span className="text-[#ef4444] kid-bounce">B</span>
              <span className="text-[#facc15] kid-bounce">A</span>
              <span className="text-[#3b82f6] kid-bounce">M</span>
              <span className="text-[#10b981] kid-bounce">B</span>
              <span className="text-[#a855f7] kid-bounce">I</span>
              <span className="text-[#f97316] kid-bounce">N</span>
              <span className="text-[#06b6d4] kid-bounce">O</span>
            </span>
            <span className="brand-world font-kid text-[9px] sm:text-[10.5px] font-black tracking-[0.28em] text-[#1e293b] -mt-1 sm:-mt-1.5 pr-0.5 leading-none uppercase">
              WORLD
            </span>
          </button>

          {/* Zone 2: Desktop clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-semibold text-slate-600">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  onMouseEnter={() => soundscape.playMarimbaClick(580, 0.02)}
                  className={`min-h-[40px] flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                      : 'hover:text-slate-900 hover:-translate-y-0.5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Awwwards Polish Controls - Atmosphere Switcher, Web Audio Soundscape, & Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Time of Day Atmosphere Switcher */}
            {onTimeOfDayChange && (
              <button
                type="button"
                onClick={handleCycleTimeOfDay}
                className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 flex items-center gap-1.5 text-xs font-bold transition border border-slate-200/80 cursor-pointer"
                title={`Atmosphere: ${timeOfDay} (Click to switch)`}
                aria-label={`Current lighting: ${timeOfDay}. Tap to cycle.`}
              >
                {timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-rose-500" />}
                {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                <span className="hidden sm:inline capitalize">{timeOfDay}</span>
              </button>
            )}

            {/* Web Audio API Soundscape Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`h-9 px-2.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition active:scale-95 border cursor-pointer ${
                !isAudioMuted
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-200/80 text-slate-600 hover:bg-slate-200'
              }`}
              title={isAudioMuted ? 'Turn Sound On' : 'Mute Sound'}
              aria-label={isAudioMuted ? 'Sound is off. Tap to enable festival soundscape.' : 'Sound is on. Tap to mute.'}
            >
              {!isAudioMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline text-slate-500">Muted</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 flex items-center justify-center cursor-pointer transition shadow-2xs border border-slate-200/80"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-900" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-900" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Drawer Content */}
          <div
            className="relative z-10 bg-[#faf9f5] border-b border-slate-300 shadow-2xl p-5 pt-[max(1.25rem,env(safe-area-inset-top,0px))] space-y-5 animate-in slide-in-from-top duration-250 ease-out"
          >
            {/* Top drawer header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div
                className="brand inline-flex flex-col items-end"
                style={{ transform: 'rotate(-3deg)', transformOrigin: 'center center' }}
              >
                <span className="brand-name font-kid font-black text-2xl leading-none flex items-center">
                  <span className="text-[#ef4444]">B</span>
                  <span className="text-[#facc15]">A</span>
                  <span className="text-[#3b82f6]">M</span>
                  <span className="text-[#10b981]">B</span>
                  <span className="text-[#a855f7]">I</span>
                  <span className="text-[#f97316]">N</span>
                  <span className="text-[#06b6d4]">O</span>
                </span>
                <span className="brand-world font-kid text-[9px] font-black tracking-[0.28em] text-[#1e293b] -mt-1 pr-0.5 leading-none uppercase">
                  WORLD
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 active:scale-95 text-slate-700 flex items-center justify-center transition cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links inside hamburger menu */}
            <nav className="flex flex-col gap-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`min-h-[48px] px-4 py-3 rounded-2xl flex items-center justify-between text-left transition active:scale-98 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white font-bold shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-emerald-800 text-amber-300'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-base font-bold">{item.label}</span>
                    </div>

                    {isActive && (
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Event Details snippet inside drawer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>5 Dec 2026</span>
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>The Little Farm, Harare</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
