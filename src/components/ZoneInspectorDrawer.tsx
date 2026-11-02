import React, { useEffect, useRef } from 'react';
import { ZONES_DATA } from '../data/festivalData';
import { X, ArrowRight, Sparkles, Clock, Compass } from 'lucide-react';
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
      <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] text-white space-y-4">
        
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3.5">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-amber-400 font-bold uppercase">
                {z.shortName || 'Pavilion'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/10 text-slate-300">
                {z.ageGroup}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif italic text-white font-normal leading-tight truncate">
              {z.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            aria-label="Close inspector"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Zone Highlights
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(z.features || []).map((feat, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Venue Meta Note */}
        <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>10:00 - 17:00 CAT</span>
          </div>
          <div className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-400" />
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
          className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>Book Passes for this Zone ($25)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </aside>
  );
};

export default ZoneInspectorDrawer;
