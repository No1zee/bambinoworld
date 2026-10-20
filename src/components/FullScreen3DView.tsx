import React from 'react';
import { SiteMap3DHandle } from './SiteMap3D';
import { ArrowLeft, RotateCcw, ArrowRight } from 'lucide-react';
import { soundscape } from '../utils/soundscape';
import { MulticolorTitle } from './MulticolorTitle';

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
  const quickZones = [
    { id: 'little-garden', label: 'Baby Garden (6M-2Y)', emoji: '👶' },
    { id: 'adventure-zone', label: 'Adventure Zone', emoji: '🏰' },
    { id: 'creative-zone', label: 'Creative Studio', emoji: '🎨' },
    { id: 'discovery-world', label: 'STEM Discovery', emoji: '🚀' },
    { id: 'celebration-stage', label: 'Live Stage', emoji: '🎵' }
  ];

  const handleFlyTo = (zoneId: string) => {
    soundscape.playMarimbaClick(620, 0.08);
    siteMapRef.current?.focusZone(zoneId);
    onSelectZone(zoneId);
  };

  const handleResetCamera = () => {
    soundscape.playMarimbaClick(440, 0.06);
    siteMapRef.current?.resetView();
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden flex flex-col justify-between p-3 sm:p-6 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
      {/* Miniature Diorama Tilt-Shift & Soft Edge Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(15,23,42,0.38)_100%)]" />
        <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-slate-950/40 via-slate-900/10 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-slate-950/40 via-slate-900/10 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black,transparent)]" />
      </div>

      {/* Top Floating Poster Title Banner */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pointer-events-none gap-2 z-10">
        <div className="poster-title-banner px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl pointer-events-auto flex items-center gap-2.5 shadow-2xl min-h-[44px]">
          <button
            onClick={() => {
              soundscape.playMarimbaClick(440, 0.06);
              onBackToSite();
            }}
            className="min-h-[38px] px-2.5 sm:px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 active:scale-95 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
            aria-label="Back to Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Back to Overview</span>
            <span className="inline sm:hidden">Back</span>
          </button>

          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-600/20 shrink-0" />

          <MulticolorTitle
            text="Bambino World 3D Grounds"
            as="h1"
            className="text-fluid-xs sm:text-fluid-sm font-kid font-bold tracking-wide break-words"
            bounceOnMount={true}
          />
        </div>

        <div className="pointer-events-auto shrink-0 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleResetCamera}
            className="min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 bg-white/90 hover:bg-white active:scale-95 text-slate-800 rounded-xl text-fluid-xs font-bold transition flex items-center gap-1.5 shadow-lg border border-slate-200 cursor-pointer backdrop-blur-md"
            title="Reset to Full Overview"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={() => {
              soundscape.playMarimbaClick(700, 0.08);
              onOpenBooking();
            }}
            className="min-h-[38px] sm:min-h-[40px] px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl text-fluid-btn font-black transition flex items-center gap-1 sm:gap-1.5 shadow-xl cursor-pointer shrink-0"
          >
            <span>Book Passes</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Quick Zone Selector Dock - hidden on mobile when zone drawer is active to prevent collision */}
      <div className={`w-full max-w-3xl mx-auto pointer-events-auto transition-all duration-300 ${activeZoneId ? 'hidden sm:block' : 'block'}`}>
        <div className="bg-slate-950/75 backdrop-blur-xl border border-white/20 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90 px-2 shrink-0 hidden md:inline">
            Quick Flight:
          </span>
          {quickZones.map(zone => {
            const isActive = activeZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => handleFlyTo(zone.id)}
                className={`min-h-[36px] px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 active:scale-95'
                }`}
              >
                <span>{zone.emoji}</span>
                <span>{zone.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FullScreen3DView;
