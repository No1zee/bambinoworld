import React, { useState } from 'react';
import { SiteMap3DHandle } from './SiteMap3D';
import { ArrowLeft, RotateCcw, ArrowRight, Sun, Sunset, X, ShieldCheck } from 'lucide-react';
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
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset'>('day');

  const quickZones = PLAY_ZONE_IDS.map((id, index) => ({
    id,
    number: `0${index + 1}`,
    label: ZONES_DATA[id]?.shortName || ZONES_DATA[id]?.title || id,
    age: ZONES_DATA[id]?.ageGroup || ''
  }));

  const activeZone = activeZoneId ? ZONES_DATA[activeZoneId] : null;

  const handleFlyTo = (zoneId: string) => {
    siteMapRef.current?.focusZone(zoneId);
    onSelectZone(zoneId);
  };

  const handleResetCamera = () => {
    soundscape.playMarimbaClick(440, 0.06);
    siteMapRef.current?.resetView();
  };

  const handleToggleLighting = () => {
    const nextMode = lightingMode === 'day' ? 'sunset' : 'day';
    setLightingMode(nextMode);
    soundscape.playMarimbaClick(nextMode === 'sunset' ? 659.25 : 523.25, 0.08);
    siteMapRef.current?.setLighting(nextMode);
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden flex flex-col justify-between p-4 sm:p-8 pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] font-poppins">
      {/* Subtle Atmospheric Depth Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(49,0,111,0.2)_100%)]" />
      </div>

      {/* Top Architectural Navigation Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pointer-events-none gap-3 z-10">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              soundscape.playMarimbaClick(440, 0.06);
              onBackToSite();
            }}
            className="thompson-pill-btn thompson-pill-purple px-4 py-2 text-xs font-bold shadow-md"
            aria-label="Back to Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-poppins text-slate-800 font-semibold">
            <span>Interactive Grounds · 5 Richwell Ave</span>
          </div>
        </div>

        <div className="pointer-events-auto shrink-0 flex items-center gap-2">
          {/* Golden-Hour Atmosphere Toggle */}
          <button
            onClick={handleToggleLighting}
            className={`thompson-pill-btn px-3.5 py-2 text-xs font-bold shadow-xs backdrop-blur-md transition-all ${
              lightingMode === 'sunset'
                ? 'bg-amber-400 text-amber-950 border border-amber-300 shadow-md'
                : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200'
            }`}
            aria-label={lightingMode === 'day' ? 'Switch to Golden Hour' : 'Switch to Warm Sun'}
          >
            {lightingMode === 'day' ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Sunset className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="hidden sm:inline">
              {lightingMode === 'day' ? 'Golden Hour' : 'Warm Sun'}
            </span>
          </button>

          <button
            onClick={handleResetCamera}
            className="thompson-pill-btn bg-white/90 hover:bg-white text-slate-700 border border-slate-200 px-3.5 py-2 text-xs font-bold shadow-xs backdrop-blur-md"
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
            className="thompson-pill-btn thompson-pill-orange px-5 py-2 text-xs font-bold tracking-wide shadow-md"
          >
            <span>Book Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Area: Sleek Floating Frosted-Glass Zone Peek Card & Sector Dock */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-2.5 z-10">
        {/* Sleek Floating Frosted-Glass Zone Peek Card */}
        {activeZone && (
          <div className="w-full max-w-md mx-auto pointer-events-auto animate-peek-card">
            <div className="bg-[#31006F]/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl text-white font-poppins space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6BE00] text-slate-950">
                      {activeZone.shortName || 'Pavilion'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white">
                      {activeZone.ageGroup}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                    {activeZone.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    soundscape.playMarimbaClick(440, 0.05);
                    onSelectZone('');
                  }}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
                  aria-label="Close card"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Harare Mother Reassurance */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/10 border border-white/10 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white/90 leading-snug">
                  {activeZone.safetyNote || 'Certified early-childhood caregivers on site with verified perimeter check.'}
                </span>
              </div>

              <button
                onClick={() => {
                  soundscape.playMarimbaClick(700, 0.08);
                  onOpenBooking();
                }}
                className="w-full thompson-pill-btn thompson-pill-orange py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Book Pass ($25)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom KODE-Style Clean Sector Dock in Thompson styling */}
        <div className="w-full pointer-events-auto">
          <div className="bg-[#31006F]/90 backdrop-blur-xl border border-white/20 rounded-full p-1.5 sm:p-2 shadow-2xl flex items-center justify-between gap-1 sm:gap-2">
            {quickZones.map(zone => {
              const isActive = activeZoneId === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleFlyTo(zone.id)}
                  className={`flex-1 py-2 px-2.5 rounded-full text-xs transition duration-200 cursor-pointer flex flex-col items-center justify-center font-poppins ${
                    isActive
                      ? 'bg-[#FF6720] text-white shadow-md font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/15 font-medium'
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-80 leading-none">
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
    </div>
  );
};

export default FullScreen3DView;
