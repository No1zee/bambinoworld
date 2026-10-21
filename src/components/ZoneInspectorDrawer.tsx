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

const DEFAULT_ZONE_IMAGES: Record<string, string> = {
  'little-garden': '/little-garden.jpg',
  'adventure-zone': 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80',
  'creative-zone': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
  'discovery-world': 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80',
  'celebration-stage': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
  'parents-lounge': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
  'food-drinks': 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1600&q=80',
  'fish-pond': 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1600&q=80',
  'swimming-pool': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=80',
  'main-entrance': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
  'info-adverts': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80'
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
  const activeImage = customZoneImage || DEFAULT_ZONE_IMAGES[zoneId] || '/little-garden.jpg';
  const zoneTag = z.shortName || z.status || 'Zone';

  // Zone Color Themes for dynamic tinting
  const ZONE_THEMES: Record<string, {
    accentHex: string;
    badgeBg: string;
    ctaClass: string;
    borderTint: string;
  }> = {
    'little-garden': {
      accentHex: '#10b981',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      ctaClass: 'bg-emerald-500 hover:bg-emerald-400 text-white',
      borderTint: 'border-t-emerald-500'
    },
    'adventure-zone': {
      accentHex: '#f59e0b',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      ctaClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
      borderTint: 'border-t-amber-400'
    },
    'creative-zone': {
      accentHex: '#38bdf8',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      ctaClass: 'bg-sky-400 hover:bg-sky-300 text-slate-950',
      borderTint: 'border-t-sky-400'
    },
    'discovery-world': {
      accentHex: '#fb7185',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      ctaClass: 'bg-rose-500 hover:bg-rose-400 text-white',
      borderTint: 'border-t-rose-400'
    },
    'celebration-stage': {
      accentHex: '#c084fc',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      ctaClass: 'bg-purple-500 hover:bg-purple-400 text-white',
      borderTint: 'border-t-purple-400'
    }
  };

  const theme = ZONE_THEMES[zoneId] || ZONE_THEMES['adventure-zone'];

  const handleDismiss = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    soundscape.playMarimbaClick(440, 0.05);
    onClose();
  };

  return (
    /* Floating HUD Card: Warm Frosted Glass treatment (.glass-warm-dark) with dynamic zone tint */
    <aside
      ref={sheetRef}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{ borderTopColor: theme.accentHex }}
      className={`fixed inset-x-3 bottom-3 top-auto sm:top-20 sm:bottom-auto sm:right-6 sm:left-auto sm:w-[370px] max-h-[55dvh] sm:max-h-[82dvh] glass-warm-dark border border-white/20 border-t-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] z-50 flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-bottom sm:slide-in-from-right duration-200 pointer-events-auto`}
    >
      {/* Clean Header: Multicolored Bouncing Title, Age Subtitle, and High-Contrast Close Button */}
      <div className="px-4 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-950/60">
        <div className="min-w-0 flex-1">
          <MulticolorTitle
            text={z.title}
            as="h2"
            className="text-fluid-base sm:text-fluid-h3 font-black font-['Outfit'] leading-tight break-words"
            bounceOnMount={true}
          />
          <p className="text-fluid-xs font-semibold mt-0.5 break-words" style={{ color: theme.accentHex }}>
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 pointer-events-none">
          <span className={`sticker-badge text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 shadow-sm border ${theme.badgeBg}`}>
            {zoneTag}
          </span>
        </div>
      </div>

      {/* Body Content - Short, factual, and completely uncluttered */}
      <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 space-y-3 text-xs">
        {/* Authentic 1-Sentence Description */}
        <p className="text-slate-200 leading-relaxed text-xs">
          {z.description}
        </p>

        {/* 3 Concise Feature Chips styled with zone tint */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {(z.features || []).slice(0, 3).map((feat: string, idx: number) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-100 text-[11px] font-medium border border-white/10 flex items-center gap-1"
            >
              <span style={{ color: theme.accentHex }} className="font-bold">✓</span>
              <span>{feat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Clear Action Footer: Close & Explore Map / Book Passes */}
      <div className="p-2.5 sm:p-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between gap-2 shrink-0">
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
          className={`min-h-[40px] px-3.5 py-2 rounded-xl active:scale-95 text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer flex-1 shadow-md ${theme.ctaClass}`}
        >
          <span>Book Passes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default ZoneInspectorDrawer;
