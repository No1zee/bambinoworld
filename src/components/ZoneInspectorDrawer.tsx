import React, { useEffect, useRef } from 'react';
import { ZONES_DATA } from '../data/festivalData';
import { X, ArrowRight, Clock, Compass } from 'lucide-react';
import { soundscape } from '../utils/soundscape';

interface ZoneInspectorDrawerProps {
  zoneId: string | null;
  onClose: () => void;
  onSelectZone?: (zoneId: string) => void;
  onOpenBooking: () => void;
}

export const ZoneInspectorDrawer: React.FC<ZoneInspectorDrawerProps> = ({
  zoneId,
  onClose,
  onOpenBooking
}) => {
  const drawerRef = useRef<HTMLElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundscape.playMarimbaClick(440, 0.05);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!zoneId || !ZONES_DATA[zoneId]) return null;

  const z = ZONES_DATA[zoneId];

  const handleDismiss = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    soundscape.playMarimbaClick(440, 0.05);
    onClose();
  };

  return (
    <aside
      ref={drawerRef}
      role="dialog"
      aria-modal="false"
      aria-label={`Zone Details: ${z.title}`}
      className="fixed bottom-24 sm:bottom-28 inset-x-4 sm:inset-x-auto sm:right-8 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="bg-[#31006F]/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4 font-sans">
        
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3.5">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="thompson-badge bg-[#F6BE00] text-slate-950 text-[10px]">
                {z.shortName || 'Pavilion'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-poppins font-semibold bg-white/10 text-white">
                {z.ageGroup}
              </span>
            </div>
            <h3 className="text-xl font-poppins font-bold text-white leading-tight truncate">
              {z.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            aria-label="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-2">
          <div className="text-xs font-poppins text-white/90 font-bold">
            Zone Highlights
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(z.features || []).map((feat, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-xs font-medium text-white"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Venue Meta Note */}
        <div className="flex items-center gap-3 pt-1 text-xs font-poppins text-white/80">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#F6BE00]" />
            <span>10:00 - 17:00 CAT</span>
          </div>
          <div className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#41B6E6]" />
            <span>Fully Supervised</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundscape.playMarimbaClick(700, 0.08);
            onOpenBooking();
          }}
          className="w-full thompson-pill-btn thompson-pill-orange py-3 text-xs font-bold shadow-md"
        >
          <span>Book Passes for this Zone ($25)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </aside>
  );
};

export default ZoneInspectorDrawer;
