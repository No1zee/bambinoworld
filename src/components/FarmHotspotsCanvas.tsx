import React, { useState } from 'react';
import {
  Compass,
  ChevronRight,
  MapPin,
  Check
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
    <div className={`space-y-6 font-sans ${className}`}>
      {/* Split Showcase: Full-bleed Photo & Architectural Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Authentic Photography */}
        <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[380px] sm:min-h-[460px] lg:min-h-full flex flex-col justify-between shadow-md">
          <img
            src="/bambino-farm.jpg"
            alt="The Little Farm Grounds at 5 Richwell Ave, Harare"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#31006F]/90 via-[#31006F]/30 to-transparent"
          />

          {/* Top Metadata Badge */}
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div className="thompson-badge bg-[#31006F]/90 text-[#F6BE00] backdrop-blur-md border border-white/20 text-[10px]">
              <Compass className="w-3.5 h-3.5 text-[#F6BE00]" />
              <span>Harare Parkland Grounds</span>
            </div>
            
            <div className="hidden sm:block text-xs font-poppins font-bold text-white/90">
              4,000 m² ENCLOSED
            </div>
          </div>

          {/* Bottom Photo Caption */}
          <div className="relative z-10 p-6 sm:p-8 space-y-2 text-white">
            <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-white leading-tight">
              {activeSpot.title}
            </h3>
            <p className="text-sm sm:text-base text-white/90 max-w-xl font-sans leading-relaxed">
              {activeSpot.description}
            </p>
          </div>
        </div>

        {/* Right Column: Architectural Ledger / Directory */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="font-poppins text-xs font-bold text-[#31006F] ">
                Venue Directory
              </span>
              <span className="text-xs font-poppins font-bold text-[#FF6720]">
                Meyrick Park
              </span>
            </div>

            {/* List of 5 Landmark Sectors */}
            <div className="space-y-2.5">
              {FARM_HOTSPOTS.map((hotspot) => {
                const isSelected = activeId === hotspot.id;

                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => handleSelect(hotspot.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition duration-200 cursor-pointer flex items-start gap-4 border ${
                      isSelected
                        ? 'bg-[#31006F] text-white border-[#31006F] shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span
                      className={`font-poppins text-xs font-black pt-0.5 ${
                        isSelected ? 'text-[#F6BE00]' : 'text-[#FF6720]'
                      }`}
                    >
                      {hotspot.number}
                    </span>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-sm font-poppins font-bold truncate ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {hotspot.title}
                        </h4>
                        {isSelected && (
                          <ChevronRight className="w-4 h-4 text-[#F6BE00] shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs font-sans truncate ${
                        isSelected ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {hotspot.specs}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Highlight Micro-Tags & 3D Ground Link */}
          <div className="pt-6 border-t border-slate-200 mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {activeSpot.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-poppins font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {h}
                </span>
              ))}
            </div>

            {onOpen3DMap && (
              <button
                type="button"
                onClick={onOpen3DMap}
                className="w-full thompson-pill-btn thompson-pill-outline-purple py-2.5 text-xs font-bold"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View Full Aerial Grounds Schematic</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
