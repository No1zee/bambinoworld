import React, { useEffect, useRef } from 'react';
import { ZONES_DATA } from '../data/festivalData';
import { X, ArrowRight, Compass } from 'lucide-react';
import { getStoredSectionBackgrounds } from '../data/sectionBackgrounds';
import { MulticolorTitle } from './MulticolorTitle';
import { soundscape } from '../utils/soundscape';

interface ZoneInspectorDrawerProps {
  zoneId: string | null;
  onClose: () => void;
  onSelectZone?: (zoneId: string) => void;
  onOpenBooking: () => void;
}

const DEFAULT_ZONE_MEDIA: Record<string, { image: string; tag: string }> = {
  'little-garden': {
    image: '/little-garden.jpg',
    tag: 'Ground Photo'
  },
  'adventure-zone': {
    image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80',
    tag: 'Active Lawn'
  },
  'creative-zone': {
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
    tag: 'Art Studio'
  },
  'discovery-world': {
    image: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80',
    tag: 'STEM Discovery'
  },
  'celebration-stage': {
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
    tag: 'Main Stage'
  },
  'parents-lounge': {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
    tag: 'Family Rest'
  },
  'food-drinks': {
    image: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1600&q=80',
    tag: 'Refreshments'
  },
  'fish-pond': {
    image: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1600&q=80',
    tag: 'Nature Landmark'
  },
  'swimming-pool': {
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=80',
    tag: 'Safety Buffer'
  },
  'main-entrance': {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
    tag: 'Welcome Gate'
  },
  'info-adverts': {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
    tag: 'Information'
  }
};

export const ZoneInspectorDrawer: React.FC<ZoneInspectorDrawerProps> = ({
  zoneId,
  onClose,
  onOpenBooking
}) => {
  const sheetRef = useRef<HTMLElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!zoneId || !ZONES_DATA[zoneId]) return null;

  const z = ZONES_DATA[zoneId];

  // Resolve photo
  const storedConfig = getStoredSectionBackgrounds();
  const customZoneImage = (storedConfig.zoneCards as Record<string, string> | undefined)?.[zoneId];
  const zoneMedia = DEFAULT_ZONE_MEDIA[zoneId] || {
    image: customZoneImage || '/little-garden.jpg',
    tag: 'Zone'
  };
  const activeImage = customZoneImage || zoneMedia.image;

  const handleDismiss = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    soundscape.playMarimbaClick(440, 0.05);
    onClose();
  };

  return (
    /* Floating HUD Card: Zero full-screen backdrop so the 3D map is 100% interactive with mouse/touch at all times! */
    <aside
      ref={sheetRef}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-x-3 bottom-3 top-auto sm:top-20 sm:bottom-auto sm:right-6 sm:left-auto sm:w-[370px] max-h-[55dvh] sm:max-h-[82dvh] bg-slate-900/95 backdrop-blur-xl border border-white/25 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] z-50 flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-bottom sm:slide-in-from-right duration-200 pointer-events-auto"
    >
      {/* Clean Header: Multicolored Bouncing Title, Age Subtitle, and High-Contrast Close Button */}
      <div className="px-4 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-950/70">
        <div className="min-w-0 flex-1">
          <MulticolorTitle
            text={z.title}
            as="h2"
            className="text-fluid-base sm:text-fluid-h3 font-black font-['Outfit'] leading-tight break-words"
            bounceOnMount={true}
          />
          <p className="text-fluid-xs text-amber-300 font-semibold mt-0.5 break-words">
            {z.ageGroup} · {z.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 active:scale-90 text-white flex items-center justify-center font-bold transition cursor-pointer shrink-0 border border-white/20 shadow-sm"
          aria-label="Close zone card"
          title="Close card"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Real Ground Photo Banner */}
      <div className="relative w-full h-24 sm:h-32 overflow-hidden shrink-0 border-b border-white/10 bg-slate-950">
        <img
          src={activeImage}
          alt={z.title}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-sm">
            {zoneMedia.tag}
          </span>
        </div>
      </div>

      {/* Body Content - Short, factual, and completely uncluttered */}
      <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 space-y-3 text-xs">
        {/* Authentic 1-Sentence Description */}
        <p className="text-slate-200 leading-relaxed text-xs">
          {z.description}
        </p>

        {/* 3 Concise Feature Chips */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {(z.features || []).slice(0, 3).map((feat: string, idx: number) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-100 text-[11px] font-medium border border-white/10 flex items-center gap-1"
            >
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{feat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Clear Action Footer: Close & Explore Map / Book Passes */}
      <div className="p-2.5 sm:p-3 border-t border-white/10 bg-slate-950/70 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={handleDismiss}
          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 border border-white/15"
        >
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>Close &amp; Explore Map</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundscape.playMarimbaClick(700, 0.08);
            onOpenBooking();
          }}
          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer flex-1 shadow-md"
        >
          <span>Book Passes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default ZoneInspectorDrawer;
