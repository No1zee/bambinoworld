import React, { useState } from 'react';
import {
  Baby,
  Castle,
  Palette,
  FlaskConical,
  Music2,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig
} from '../data/sectionBackgrounds';
import { MulticolorTitle } from './MulticolorTitle';
import { FloatingCursorPortal, CursorPortalItem } from './FloatingCursorPortal';
import { ZONES_DATA } from '../data/festivalData';
import { ZoneId } from '../types/festival';
import { soundscape } from '../utils/soundscape';

interface PlayZonesViewProps {
  onInspectZone3D: (zoneId: string) => void;
  onOpenBooking: () => void;
}

const PLAY_ZONE_EXTRAS: Record<string, {
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
  tagColor: string;
  defaultImage: string;
}> = {
  'little-garden': {
    tone: 'baby',
    icon: Baby,
    tagColor: 'bg-emerald-600 text-white',
    defaultImage: '/little-garden.jpg'
  },
  'adventure-zone': {
    tone: 'adventure',
    icon: Castle,
    tagColor: 'bg-[#D97706] text-white',
    defaultImage: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80'
  },
  'creative-zone': {
    tone: 'creative',
    icon: Palette,
    tagColor: 'bg-[#C85A32] text-white',
    defaultImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80'
  },
  'discovery-world': {
    tone: 'discovery',
    icon: FlaskConical,
    tagColor: 'bg-[#237A72] text-white',
    defaultImage: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80'
  },
  'celebration-stage': {
    tone: 'stage',
    icon: Music2,
    tagColor: 'bg-[#5B4E77] text-white',
    defaultImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80'
  }
};

const PLAY_ZONE_IDS: ZoneId[] = [
  'little-garden',
  'adventure-zone',
  'creative-zone',
  'discovery-world',
  'celebration-stage'
];

export const PlayZonesView: React.FC<PlayZonesViewProps> = ({ onInspectZone3D, onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [hoveredZonePortal, setHoveredZonePortal] = useState<CursorPortalItem | null>(null);
  const [bgConfig] = useState<SectionBackgroundConfig>(getStoredSectionBackgrounds);

  const zones = PLAY_ZONE_IDS.map((id, index) => {
    const data = ZONES_DATA[id];
    const extras = PLAY_ZONE_EXTRAS[id];
    return {
      id,
      index: index + 1,
      name: data.title,
      shortName: data.shortName || data.title,
      age: data.ageGroup,
      tone: extras.tone,
      icon: extras.icon,
      tagColor: extras.tagColor,
      image: (bgConfig.zoneCards as Record<string, string>)[id] || extras.defaultImage,
      shortDesc: data.description,
      features: data.features,
      staffing: data.staffing,
      safetyNote: data.safetyNote
    };
  });

  const filteredZones = activeTab === 'all' ? zones : zones.filter(z => z.tone === activeTab);

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Top Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-5">
          <div>
            <span className="font-mono text-xs font-bold text-[#D97706] tracking-widest uppercase block mb-1">
              Catalogue / 05 Curated Sectors
            </span>
            <MulticolorTitle
              text="Our Play Zones"
              as="h1"
              className="text-fluid-h1 font-kid font-black tracking-wide break-words"
              bounceOnMount={true}
            />
            <p className="text-fluid-base text-slate-600 mt-1 font-medium">
              Five dedicated sectors designed for age-appropriate adventure, creativity, and safety.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                soundscape.playMarimbaClick(560, 0.06);
                onInspectZone3D('little-garden');
              }}
              className="min-h-[44px] px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs sm:text-sm font-kid font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto shrink-0 border border-slate-700 group"
            >
              <span>Explore Grounds in 3D</span>
              <span className="text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All 5 Zones' },
            { id: 'baby', label: `${ZONES_DATA['little-garden'].emoji} ${ZONES_DATA['little-garden'].shortName}` },
            { id: 'adventure', label: `${ZONES_DATA['adventure-zone'].emoji} ${ZONES_DATA['adventure-zone'].shortName}` },
            { id: 'creative', label: `${ZONES_DATA['creative-zone'].emoji} ${ZONES_DATA['creative-zone'].shortName}` },
            { id: 'discovery', label: `${ZONES_DATA['discovery-world'].emoji} ${ZONES_DATA['discovery-world'].shortName}` },
            { id: 'stage', label: `${ZONES_DATA['celebration-stage'].emoji} ${ZONES_DATA['celebration-stage'].shortName}` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-98 cursor-pointer flex items-center justify-center ${
                activeTab === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-[#E8E2D6]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* EDITORIAL CATALOGUE LEDGER (Rich Botanical Pavilion Ledger) */}
      <div className="relative w-full overflow-hidden border-y border-emerald-900/40 bg-[#122219] py-10 sm:py-16">
        <img
          src={bgConfig.playZonesSection}
          alt="Play Zones Grounds"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102 opacity-25 mix-blend-overlay"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-white/15 border-y border-white/15">
            {filteredZones.map(zone => (
              <div
                key={zone.id}
                id={zone.id}
                onMouseEnter={() => {
                  soundscape.playMarimbaClick(480 + zone.index * 30, 0.02);
                  setHoveredZonePortal({
                    id: zone.id,
                    title: zone.name,
                    subtitle: zone.features.slice(0, 2).join(' · '),
                    image: zone.image,
                    tag: zone.age,
                    tagColor: zone.tagColor
                  });
                }}
                onMouseLeave={() => setHoveredZonePortal(null)}
                onClick={() => {
                  soundscape.playMarimbaClick(600, 0.06);
                  onInspectZone3D(zone.id);
                }}
                className="group py-6 sm:py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:bg-white/[0.04] px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-2xl cursor-pointer"
              >
                {/* Col 1: Index + Image + Information */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1">
                  <span className="font-mono text-sm sm:text-base font-bold text-amber-400 tracking-widest shrink-0 mt-1 sm:mt-0">
                    0{zone.index}
                  </span>

                  {/* Curated Micro-Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-white/15 shadow-sm group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={zone.image}
                      alt={zone.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Zone Metadata & Micro-Labels */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-kid font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                        {zone.name}
                      </h2>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${zone.tagColor}`}>
                        {zone.age}
                      </span>
                      {zone.staffing && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-300 font-medium bg-white/10 px-2.5 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          {zone.staffing}
                        </span>
                      )}
                    </div>

                    {/* Punchy micro-labels (Zero wordy paragraphs) */}
                    <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                      {zone.features.join(' · ')}
                    </p>

                    {/* Subtext safety footnote */}
                    {zone.safetyNote && (
                      <p className="text-fluid-xs text-slate-400 font-normal">
                        {zone.safetyNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Col 2: Action Triggers */}
                <div className="flex items-center gap-3 shrink-0 self-end lg:self-center pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundscape.playMarimbaClick(620, 0.05);
                      onInspectZone3D(zone.id);
                    }}
                    className="min-h-[44px] px-4 sm:px-5 rounded-xl bg-gradient-to-br from-white/15 to-white/5 hover:from-amber-400/25 hover:to-amber-400/10 active:scale-95 text-white hover:text-amber-300 font-kid font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/25 hover:border-amber-400/50 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.25)] group"
                  >
                    <span>Fly in 3D</span>
                    <span className="text-amber-300 font-bold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundscape.playMarimbaClick(650, 0.08);
                      onOpenBooking();
                    }}
                    className="min-h-[44px] px-4 sm:px-5 rounded-xl bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 active:translate-y-0.5 text-slate-950 font-kid font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_8px_20px_-4px_rgba(245,158,11,0.5)] cursor-pointer"
                  >
                    <span>Book Pass ($25)</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <FloatingCursorPortal activeItem={hoveredZonePortal} />
      </div>
    </div>
  );
};

export default PlayZonesView;
