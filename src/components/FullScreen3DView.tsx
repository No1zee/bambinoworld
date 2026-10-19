import React from 'react';
import { SiteMap3D, SiteMap3DHandle } from './SiteMap3D';
import { ArrowLeft, Sparkles, Ticket } from 'lucide-react';

interface FullScreen3DViewProps {
  onBackToSite: () => void;
  onSelectZone: (zoneId: string) => void;
  activeZoneId: string | null;
  onOpenBooking: () => void;
  siteMapRef: React.RefObject<SiteMap3DHandle | null>;
}

export const FullScreen3DView: React.FC<FullScreen3DViewProps> = ({
  onBackToSite,
  onSelectZone,
  activeZoneId,
  onOpenBooking,
  siteMapRef
}) => {
  return (
    <div className="relative w-screen h-[calc(100dvh-64px)] sm:h-[calc(100dvh-72px)] overflow-hidden bg-[#141e18]">
      {/* Top Floating Poster Title Banner with Safe-Area Offset & 44px Tap Targets */}
      <div className="fixed top-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:top-20 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-5xl flex items-center justify-between pointer-events-none gap-2">
        <div className="poster-title-banner px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl pointer-events-auto flex items-center gap-2.5 shadow-2xl min-h-[44px]">
          <button
            onClick={onBackToSite}
            className="min-h-[44px] px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 active:scale-95 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            aria-label="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Overview</span>
          </button>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-600/20 shrink-0" />
          <h1 className="text-xs sm:text-base font-kid font-bold text-slate-900 tracking-wide truncate">
            Bambino World — 3D Grounds Preview
          </h1>
        </div>

        <div className="pointer-events-auto shrink-0">
          <button
            onClick={onOpenBooking}
            className="min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-black transition flex items-center gap-1.5 shadow-xl cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-amber-300" />
            <span>Book Tickets</span>
          </button>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <SiteMap3D
        ref={siteMapRef}
        onSelectZone={onSelectZone}
        activeZoneId={activeZoneId}
        isCinemaMode={true}
        onToggleCinema={onBackToSite}
        className="w-full h-full"
      />
    </div>
  );
};
