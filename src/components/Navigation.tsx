import React from 'react';
import { Ticket, Sparkles, MapPin, Compass } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenBooking: () => void;
  bookingCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  onOpenBooking,
  bookingCount
}) => {
  return (
    <header
      className="sticky top-0 z-50 bg-[#faf9f5]/95 backdrop-blur-md border-b border-[#e2e8f0] pt-[env(safe-area-inset-top,0px)]"
      style={{
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Single brand wordmark lockup - WORLD closer to BAMBINO, nicely aligned and rotated */}
        <button
          onClick={() => onTabChange('home')}
          className="brand inline-flex flex-col items-end cursor-pointer group whitespace-nowrap shrink-0 py-0.5 transition-transform hover:scale-[1.02]"
          aria-label="Bambino World Home"
          style={{ transform: 'rotate(-3deg)', transformOrigin: 'center center' }}
        >
          <span className="brand-name font-kid font-black tracking-normal text-xl sm:text-3xl leading-none flex items-center">
            <span className="text-[#ef4444] kid-bounce">B</span>
            <span className="text-[#facc15] kid-bounce">A</span>
            <span className="text-[#3b82f6] kid-bounce">M</span>
            <span className="text-[#10b981] kid-bounce">B</span>
            <span className="text-[#a855f7] kid-bounce">I</span>
            <span className="text-[#f97316] kid-bounce">N</span>
            <span className="text-[#06b6d4] kid-bounce">O</span>
          </span>
          <span className="brand-world font-kid text-[8.5px] sm:text-[10px] font-black tracking-[0.3em] text-[#1e293b] -mt-1 sm:-mt-1.5 pr-0.5 leading-none uppercase">
            WORLD
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onTabChange('home')}
            className={`min-h-[40px] flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'home' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange('zones')}
            className={`min-h-[40px] flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'zones' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            Play Zones
          </button>
          <button
            onClick={() => onTabChange('3d-map')}
            className={`min-h-[40px] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === '3d-map' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>3D Festival Map</span>
          </button>
          <button
            onClick={() => onTabChange('december-5')}
            className={`min-h-[40px] flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'december-5' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            5 Dec Programme
          </button>
          <button
            onClick={() => onTabChange('farm')}
            className={`min-h-[40px] flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'farm' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            The Little Farm
          </button>
        </nav>

        {/* Zone 3: Primary Book Pass action - sleek and scaled on mobile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBooking}
            className="h-7.5 sm:h-9 px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-lg shadow-2xs transition-all flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Book Pass ($25)</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Link Bar - scaled down so it leaves viewport breathing room */}
      <div className="flex md:hidden overflow-x-auto px-2.5 py-1 bg-slate-100/90 border-t border-slate-200/90 gap-1 text-[11px] font-semibold text-slate-700 no-scrollbar">
        <button
          onClick={() => onTabChange('home')}
          className={`h-7 px-2.5 rounded-lg flex items-center justify-center whitespace-nowrap transition cursor-pointer ${
            currentTab === 'home'
              ? 'bg-emerald-700 text-white font-bold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-200/70 active:scale-98'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onTabChange('zones')}
          className={`h-7 px-2.5 rounded-lg flex items-center justify-center whitespace-nowrap transition cursor-pointer ${
            currentTab === 'zones'
              ? 'bg-emerald-700 text-white font-bold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-200/70 active:scale-98'
          }`}
        >
          Play Zones
        </button>
        <button
          onClick={() => onTabChange('3d-map')}
          className={`h-7 px-2.5 rounded-lg flex items-center justify-center gap-1 whitespace-nowrap transition cursor-pointer ${
            currentTab === '3d-map'
              ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
              : 'text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 active:scale-98'
          }`}
        >
          <Compass className="w-3 h-3 text-amber-600" />
          <span>3D Map</span>
        </button>
        <button
          onClick={() => onTabChange('december-5')}
          className={`h-7 px-2.5 rounded-lg flex items-center justify-center whitespace-nowrap transition cursor-pointer ${
            currentTab === 'december-5'
              ? 'bg-emerald-700 text-white font-bold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-200/70 active:scale-98'
          }`}
        >
          Programme
        </button>
        <button
          onClick={() => onTabChange('farm')}
          className={`h-7 px-2.5 rounded-lg flex items-center justify-center whitespace-nowrap transition cursor-pointer ${
            currentTab === 'farm'
              ? 'bg-emerald-700 text-white font-bold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-200/70 active:scale-98'
          }`}
        >
          The Farm
        </button>
      </div>
    </header>
  );
};
