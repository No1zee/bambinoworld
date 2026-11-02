import React from 'react';
import { SiteMap3DHandle } from './SiteMap3D';
import { ArrowLeft, RotateCcw, ArrowRight } from 'lucide-react';
import { soundscape } from '../utils/soundscape';

import { ZONES_DATA } from '../data/festivalData';
import { ZoneId } from '../types/festival';

interface FullScreen3DViewProps {
  onBackToSite: () => void;
  onSelectZone: (zoneId: string) => void;
  activeZoneId: string | null;
  onOpenBooking: () => void;
  siteMapRef: React.RefObject<SiteMap3DHandle | null>;
}

const PLAY_ZONE_IDS: ZoneId[] = [
  'little-garden',
  'adventure-zone',
  'creative-zone',
  'discovery-world',
  'celebration-stage'
];

export const FullScreen3DView: React.FC<FullScreen3DViewProps> = ({
  onBackToSite,
  onSelectZone,
  activeZoneId,
  onOpenBooking,
  siteMapRef
}) => {
  const quickZones = PLAY_ZONE_IDS.map((id, index) => ({
    id,
    number: `0${index + 1}`,
    label: ZONES_DATA[id]?.shortName || ZONES_DATA[id]?.title || id,
    age: ZONES_DATA[id]?.ageGroup || ''
  }));

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
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden flex flex-col justify-between p-4 sm:p-8 pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
      {/* Subtle Atmospheric Depth Vignette (Zero Heavy Blur) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(15,23,42,0.18)_100%)]" />
      </div>

      {/* Top Architectural Navigation Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pointer-events-none gap-3 z-10">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              soundscape.playMarimbaClick(440, 0.06);
              onBackToSite();
            }}
            className="px-4 py-2 bg-slate-900/90 hover:bg-slate-900 active:scale-95 text-white rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-2 cursor-pointer shadow-md backdrop-blur-md"
            aria-label="Back to Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-mono text-slate-700 font-medium">
            <span>Interactive Grounds · 5 Richwell Ave</span>
          </div>
        </div>

        <div className="pointer-events-auto shrink-0 flex items-center gap-2">
          <button
            onClick={handleResetCamera}
            className="px-3.5 py-2 bg-white/90 hover:bg-white active:scale-95 text-slate-700 rounded-full text-xs font-semibold transition flex items-center gap-1.5 shadow-sm border border-slate-200 cursor-pointer backdrop-blur-md"
            title="Reset to Full Overview"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Camera</span>
          </button>

          <button
            onClick={() => {
              soundscape.playMarimbaClick(700, 0.08);
              onOpenBooking();
            }}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-full text-xs font-bold tracking-wide transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Book Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom KODE-Style Clean Sector Dock */}
      <div className="w-full max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-full p-1.5 sm:p-2 shadow-2xl flex items-center justify-between gap-1 sm:gap-2">
          {quickZones.map(zone => {
            const isActive = activeZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => handleFlyTo(zone.id)}
                className={`flex-1 py-2 px-2.5 rounded-full text-xs transition duration-200 cursor-pointer flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <span className="text-[10px] font-mono opacity-60 leading-none">
                  {zone.number}
                </span>
                <span className="truncate max-w-[85px] sm:max-w-none text-[11px] sm:text-xs leading-tight">
                  {zone.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FullScreen3DView;
