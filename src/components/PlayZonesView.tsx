import React, { useState } from 'react';
import {
  Baby,
  Castle,
  Palette,
  FlaskConical,
  Music2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Ticket,
  Check
} from 'lucide-react';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig
} from '../data/sectionBackgrounds';
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
  accentColor: string;
  defaultImage: string;
}> = {
  'little-garden': {
    tone: 'baby',
    icon: Baby,
    tagColor: 'bg-[#2F532E] text-white',
    accentColor: '#2F532E',
    defaultImage: '/little-garden.jpg'
  },
  'adventure-zone': {
    tone: 'adventure',
    icon: Castle,
    tagColor: 'bg-[#FF6720] text-white',
    accentColor: '#FF6720',
    defaultImage: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80'
  },
  'creative-zone': {
    tone: 'creative',
    icon: Palette,
    tagColor: 'bg-[#AC4FC6] text-white',
    accentColor: '#AC4FC6',
    defaultImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80'
  },
  'discovery-world': {
    tone: 'discovery',
    icon: FlaskConical,
    tagColor: 'bg-[#41B6E6] text-slate-950',
    accentColor: '#41B6E6',
    defaultImage: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80'
  },
  'celebration-stage': {
    tone: 'stage',
    icon: Music2,
    tagColor: 'bg-[#31006F] text-white',
    accentColor: '#31006F',
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
      accentColor: extras.accentColor,
      image: (bgConfig.zoneCards as Record<string, string>)[id] || extras.defaultImage,
      shortDesc: data.description,
      features: data.features,
      staffing: data.staffing,
      safetyNote: data.safetyNote
    };
  });

  const filteredZones = activeTab === 'all' ? zones : zones.filter(z => z.tone === activeTab);

  return (
    <div className="w-full space-y-10 pb-20 font-sans">
      {/* Top Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <h1 className="font-poppins font-black text-3xl sm:text-4xl lg:text-5xl text-[#31006F] tracking-tight">
              The Five Play Zones
            </h1>
            <p className="text-base text-slate-600 font-sans max-w-2xl">
              Five dedicated sectors designed for age-appropriate adventure, sensory exploration, creativity, and safety across 4,000 m² of parkland.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundscape.playMarimbaClick(560, 0.06);
                onInspectZone3D('little-garden');
              }}
              className="thompson-pill-btn thompson-pill-purple px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md"
            >
              <MapPin className="w-4 h-4 text-[#F6BE00]" />
              <span>Explore Grounds in 3D</span>
            </button>

            <button
              onClick={() => {
                soundscape.playMarimbaClick(650, 0.08);
                onOpenBooking();
              }}
              className="thompson-pill-btn thompson-pill-orange px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Pass</span>
            </button>
          </div>
        </div>

        {/* Filter Pills in Poppins */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All 5 Zones' },
            { id: 'baby', label: ZONES_DATA['little-garden'].shortName },
            { id: 'adventure', label: ZONES_DATA['adventure-zone'].shortName },
            { id: 'creative', label: ZONES_DATA['creative-zone'].shortName },
            { id: 'discovery', label: ZONES_DATA['discovery-world'].shortName },
            { id: 'stage', label: ZONES_DATA['celebration-stage'].shortName }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                soundscape.playMarimbaClick(480, 0.03);
                setActiveTab(f.id);
              }}
              className={`px-4 py-2 rounded-full font-poppins text-xs font-bold transition cursor-pointer ${
                activeTab === f.id
                  ? 'bg-[#31006F] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thompson 3-Column Card Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredZones.map(zone => (
            <div
              key={zone.id}
              className="thompson-card overflow-hidden flex flex-col justify-between group cursor-pointer"
              onClick={() => onInspectZone3D(zone.id)}
            >
              <div>
                {/* Zone Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`thompson-badge ${zone.tagColor} shadow-md`}>
                      {zone.age}
                    </span>
                  </div>
                  {zone.staffing && (
                    <div className="absolute top-4 right-4">
                      <span className="thompson-badge bg-black/60 text-white backdrop-blur-md text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{zone.staffing}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Zone Content */}
                <div className="p-6 space-y-4">
                  <h2 className="font-poppins font-bold text-2xl text-slate-900 group-hover:text-[#FF6720] transition-colors">
                    {zone.name}
                  </h2>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    {zone.shortDesc}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <ul className="grid grid-cols-1 gap-1.5 text-xs font-poppins font-medium text-slate-700">
                      {zone.features.map(f => (
                        <li key={f} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#FF6720] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {zone.safetyNote && (
                    <p className="text-xs text-slate-500 font-sans pt-1">
                      {zone.safetyNote}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundscape.playMarimbaClick(620, 0.05);
                    onInspectZone3D(zone.id);
                  }}
                  className="thompson-pill-btn thompson-pill-purple px-4 py-2.5 text-xs font-bold flex-1"
                >
                  <span>Fly in 3D</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundscape.playMarimbaClick(650, 0.08);
                    onOpenBooking();
                  }}
                  className="thompson-pill-btn thompson-pill-orange px-4 py-2.5 text-xs font-bold flex-1"
                >
                  <span>Book Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayZonesView;
