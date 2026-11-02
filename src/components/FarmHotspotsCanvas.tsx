import React, { useState } from 'react';
import {
  Compass,
  Sprout,
  Waves,
  Car,
  Sparkles,
  Shield,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { soundscape } from '../utils/soundscape';

export interface HotspotItem {
  id: string;
  number: string;
  title: string;
  category: string;
  specs: string;
  description: string;
  highlights: string[];
}

export const FARM_HOTSPOTS: HotspotItem[] = [
  {
    id: 'shaded-lawn',
    number: '01',
    title: 'Bougainvillea Shaded Lawn',
    category: 'Meadow & Picnic',
    specs: '4,000 m² natural tree canopy',
    description: 'Expansive grass buffer shielded by mature indigenous trees. Plenty of room for blankets, strollers, and toddler exploration.',
    highlights: ['Natural Tree Shade', 'Stroller-Friendly Lawns', 'Spacious Picnic Zone']
  },
  {
    id: 'fenced-waters',
    number: '02',
    title: 'Perimeter Water Barrier',
    category: 'Safety & Perimeter',
    specs: '100% latched child-height fencing',
    description: 'Double-latched physical safety gate barrier around the venue water features, supervised continuously by on-duty marshals.',
    highlights: ['Double-Latch Locks', 'Dedicated Safety Marshals', 'Zero Open Hazards']
  },
  {
    id: 'arrival-promenade',
    number: '03',
    title: 'Meyrick Park Arrival',
    category: 'Access & Security',
    specs: '5 Richwell Ave · Mabelreign',
    description: 'Single-access security checkpoint with segregated boom gate drop-off and numbered parent-child wristband verification.',
    highlights: ['Contact-Matched Wristbands', 'Segregated Vehicle Gate', 'Paved Ramp Access']
  },
  {
    id: 'pergola-cafe',
    number: '04',
    title: 'Pergolas & Waffle Kitchen',
    category: 'Refreshments',
    specs: 'Complimentary with pass',
    description: 'Shaded wooden pergolas serving fresh warm waffles, seasonal fruit skewers, and artisan roast coffee for parents.',
    highlights: ['Artisan Coffee Bar', 'Fresh Child Lunch Packs', 'All-Inclusive Treats']
  },
  {
    id: 'first-aid-haven',
    number: '05',
    title: 'Paediatric Care Sanctuary',
    category: 'Medical & Rest',
    specs: 'Certified medical attendants on-site',
    description: 'Quiet, air-conditioned nursing station and first-aid sanctuary for quick medical needs, diaper changes, and sensory rest.',
    highlights: ['Certified Paediatric Medic', 'Private Nursing Suite', 'Sensory Cool-Down']
  }
];

interface FarmHotspotsCanvasProps {
  onOpen3DMap?: () => void;
  className?: string;
}

export const FarmHotspotsCanvas: React.FC<FarmHotspotsCanvasProps> = ({
  onOpen3DMap,
  className = ''
}) => {
  const [activeId, setActiveId] = useState<string>(FARM_HOTSPOTS[0].id);
  const activeSpot = FARM_HOTSPOTS.find(h => h.id === activeId) || FARM_HOTSPOTS[0];

  const handleSelect = (id: string) => {
    setActiveId(id);
    soundscape.playMarimbaClick(560, 0.05);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Editorial Split Showcase: Full-bleed Photo & Architectural Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Pure Cinematic Photography */}
        <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden border border-[#E8E2D6] bg-[#F7F4EC] min-h-[380px] sm:min-h-[460px] lg:min-h-full flex flex-col justify-between shadow-[0_20px_50px_-20px_rgba(45,35,25,0.12)]">
          {/* Authentic Venue Photography - Clean, crisp, unobstructed */}
          <img
            src="/bambino-farm.jpg"
            alt="The Little Farm Grounds at 5 Richwell Ave, Harare"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Gentle warm tint overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"
          />

          {/* Subtle Top Metadata Stamp */}
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-200 border border-white/10 text-[10px] font-mono tracking-widest uppercase font-semibold">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>Harare Parkland Grounds</span>
            </div>
            
            <div className="hidden sm:block text-[11px] font-mono text-white/80 tracking-wider">
              4,000 m² ENCLOSED
            </div>
          </div>

          {/* Bottom Photo Caption */}
          <div className="relative z-10 p-6 sm:p-8 space-y-2 text-white">
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
              Feature {activeSpot.number} of 05
            </div>
            <h3 className="text-xl sm:text-2xl font-serif italic text-white font-normal leading-tight">
              {activeSpot.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-lg font-light leading-relaxed">
              {activeSpot.description}
            </p>
          </div>
        </div>

        {/* Right Column: Architectural Ledger / Directory */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-white rounded-3xl border border-[#E8E2D6] p-6 sm:p-8 shadow-xs">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-mono text-xs font-bold text-slate-600 uppercase tracking-widest">
                Venue Directory
              </span>
              <span className="text-[11px] font-mono text-amber-800 font-semibold">
                Meyrick Park
              </span>
            </div>

            {/* List of 5 Landmark Sectors */}
            <div className="space-y-2">
              {FARM_HOTSPOTS.map((hotspot) => {
                const isSelected = activeId === hotspot.id;

                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => handleSelect(hotspot.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition duration-200 cursor-pointer flex items-start gap-4 border ${
                      isSelected
                        ? 'bg-[#FAF8F4] border-amber-300 shadow-2xs'
                        : 'bg-transparent border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-bold pt-0.5 ${
                        isSelected ? 'text-[#C85A32]' : 'text-slate-600 font-bold'
                      }`}
                    >
                      {hotspot.number}
                    </span>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {hotspot.title}
                        </h4>
                        {isSelected && (
                          <ChevronRight className="w-4 h-4 text-[#C85A32] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-normal truncate">
                        {hotspot.specs}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Highlight Micro-Tags & 3D Ground Link */}
          <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {activeSpot.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-[#FAF8F4] text-slate-700 border border-[#E8E2D6]"
                >
                  {h}
                </span>
              ))}
            </div>

            {onOpen3DMap && (
              <button
                type="button"
                onClick={onOpen3DMap}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Aerial Grounds Schematic</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
