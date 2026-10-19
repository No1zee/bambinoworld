import React from 'react';
import { Ticket, Sparkles, User, MapPin } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-[#faf9f5]/95 backdrop-blur-md border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onTabChange('home')}
          className="brand flex items-baseline gap-1 text-left cursor-pointer group whitespace-nowrap shrink-0"
        >
          <span className="brand-name font-kid font-black tracking-wide text-2xl sm:text-3xl">
            <span className="text-[#ef4444] kid-bounce">B</span>
            <span className="text-[#facc15] kid-bounce">A</span>
            <span className="text-[#3b82f6] kid-bounce">M</span>
            <span className="text-[#10b981] kid-bounce">B</span>
            <span className="text-[#a855f7] kid-bounce">I</span>
            <span className="text-[#f97316] kid-bounce">N</span>
            <span className="text-[#06b6d4] kid-bounce">O</span>
          </span>
          <span className="brand-world font-kid text-[12px] font-bold tracking-[0.2em] text-[#1e293b] pl-1">
            WORLD
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onTabChange('home')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'home' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-1' : 'hover:text-slate-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange('zones')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'zones' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-1' : 'hover:text-slate-900'
            }`}
          >
            Play Zones
          </button>
          <button
            onClick={() => onTabChange('3d-map')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentTab === '3d-map' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-1' : 'hover:text-slate-900'
            }`}
          >
            <span>3D Festival Map</span>
          </button>
          <button
            onClick={() => onTabChange('december-5')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'december-5' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-1' : 'hover:text-slate-900'
            }`}
          >
            5 Dec Programme
          </button>
          <button
            onClick={() => onTabChange('farm')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'farm' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-1' : 'hover:text-slate-900'
            }`}
          >
            The Little Farm
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBooking}
            className="action-button px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Pass ($25)</span>
            {bookingCount > 0 && (
              <span className="w-5 h-5 bg-slate-950 text-white font-black rounded-full flex items-center justify-center text-[11px]">
                {bookingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Link Bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-100/90 border-t border-slate-200 gap-4 text-xs font-semibold text-slate-700">
        <button
          onClick={() => onTabChange('home')}
          className={`whitespace-nowrap ${currentTab === 'home' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => onTabChange('zones')}
          className={`whitespace-nowrap ${currentTab === 'zones' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Play Zones
        </button>
        <button
          onClick={() => onTabChange('3d-map')}
          className={`whitespace-nowrap font-bold text-amber-700 ${currentTab === '3d-map' ? 'text-emerald-700 font-bold' : ''}`}
        >
          3D Festival Map
        </button>
        <button
          onClick={() => onTabChange('december-5')}
          className={`whitespace-nowrap ${currentTab === 'december-5' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Programme
        </button>
        <button
          onClick={() => onTabChange('farm')}
          className={`whitespace-nowrap ${currentTab === 'farm' ? 'text-emerald-700 font-bold' : ''}`}
        >
          The Farm
        </button>
      </div>
    </header>
  );
};
