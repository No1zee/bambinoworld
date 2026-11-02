import React from 'react';
import {
  MapPin,
  Shield,
  Sprout,
  Heart,
  ExternalLink,
  Car,
  Waves,
  ArrowRight,
  Compass,
  Sparkles,
  TreePine,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { MulticolorTitle } from './MulticolorTitle';
import { FarmHotspotsCanvas } from './FarmHotspotsCanvas';
import { soundscape } from '../utils/soundscape';

interface TheLittleFarmViewProps {
  onOpen3DMap: () => void;
  onOpenBooking: () => void;
}

export const TheLittleFarmView: React.FC<TheLittleFarmViewProps> = ({
  onOpen3DMap,
  onOpenBooking
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 pb-20">
      {/* 1. SUNLIT EDITORIAL VENUE HEADER (Zero Mud Scrim, Confident Architectural Space) */}
      <section className="space-y-6">
        {/* Monospace Geographic Coordinates & Stamp */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 font-mono text-xs font-bold tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
            <span>17°48'33.5"S · 31°00'13.8"E · Meyrick Park, Harare</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/80 text-xs font-bold">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>5 Richwell Ave, Mabelreign</span>
          </div>
        </div>

        {/* Headline & Giant Architectural Metric Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <MulticolorTitle
              text="The Little Farm, Meyrick Park"
              as="h1"
              className="text-fluid-h1 sm:text-fluid-display font-kid font-black leading-tight tracking-normal break-words text-slate-900"
              bounceOnMount={true}
            />
            <p className="text-fluid-lead text-slate-600 max-w-2xl font-medium leading-relaxed">
              4,000 m² of mature shade trees, bougainvillea lawns & secure family play infrastructure in Meyrick Park, Harare.
            </p>
          </div>

          {/* Architectural Metric Callout */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <div className="p-5 rounded-2xl bg-[#F7F4EC] border border-[#E8E2D6] shadow-xs space-y-1 w-full sm:w-auto">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Total Venue Area
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-kid font-black text-[#C85A32] leading-none">
                  4,000
                </span>
                <span className="text-lg font-mono font-bold text-slate-700">
                  m² Parkland
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 block">
                100% Gated &amp; Supervised Perimeter
              </span>
            </div>
          </div>
        </div>

        {/* Tactile Action Buttons with 3D Spring Physics */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              soundscape.playMarimbaClick(650, 0.08);
              onOpen3DMap();
            }}
            className="min-h-[46px] px-6 py-2.5 bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 active:translate-y-0.5 text-slate-950 font-kid font-black rounded-xl text-sm sm:text-base transition-all shadow-[0_8px_20px_-4px_rgba(245,158,11,0.45)] cursor-pointer flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Explore Grounds in 3D</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <a
            href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundscape.playMarimbaClick(520, 0.06)}
            className="min-h-[46px] px-5 py-2.5 bg-white hover:bg-slate-50 active:translate-y-0.5 text-slate-800 font-bold rounded-xl text-sm transition-all border border-[#E8E2D6] shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-emerald-600" />
            <span>Google Maps Directions</span>
          </a>

          <button
            type="button"
            onClick={() => {
              soundscape.playMarimbaClick(580, 0.06);
              onOpenBooking();
            }}
            className="min-h-[46px] px-5 py-2.5 bg-[#2D5A43] hover:bg-[#234734] active:translate-y-0.5 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Book Family Passes ($25)</span>
          </button>
        </div>
      </section>

      {/* 2. INTERACTIVE HOTSPOT DISCOVERY CANVAS (Directorial Replacement for the Mud Scrim) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E2D6] pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-[#D97706] tracking-widest uppercase block mb-0.5">
              Interactive Spatial Grounds
            </span>
            <h2 className="text-xl sm:text-2xl font-kid font-bold text-slate-900">
              The Little Farm Spatial Hotspots
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            4,000 m² protected parkland with mature bougainvillea canopy and family pavilions.
          </p>
        </div>

        {/* Reusable Sunlit Hotspots Canvas */}
        <FarmHotspotsCanvas onOpen3DMap={onOpen3DMap} />
      </section>

      {/* 3. EDITORIAL VENUE & SAFETY LEDGER (Zero Box Containers, Swiss Dividing Hairlines) */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-[#E8E2D6] pb-4">
          <span className="font-mono text-xs font-bold text-[#2D5A43] tracking-widest uppercase block mb-1">
            Infrastructure / Rigorous Standards
          </span>
          <MulticolorTitle
            text="Venue Safety & Family Amenities"
            as="h2"
            className="text-fluid-h2 font-kid font-black text-slate-900 tracking-wide break-words"
            bounceOnMount={false}
          />
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Designed from the ground up for peaceful parent reassurance and safe exploratory play.
          </p>
        </div>

        {/* Editorial Ledger Rows */}
        <div className="divide-y divide-[#E8E2D6] border-y border-[#E8E2D6]">
          {[
            {
              index: '01',
              title: '4,000 m² Protected Grass Parkland',
              icon: Sprout,
              iconColor: 'bg-emerald-100 text-emerald-800',
              headline: 'Generous perimeter buffer with mature bougainvillea shade and picnic lawns.',
              microLabels: ['Natural Tree Canopy', 'Zero Hard Concrete Drops', 'Stroller-Friendly Paths']
            },
            {
              index: '02',
              title: 'Double-Latched Water Safety Fencing',
              icon: Waves,
              iconColor: 'bg-sky-100 text-sky-800',
              headline: 'Locked safety barriers around all water features with marshals stationed on perimeter patrol.',
              microLabels: ['Child-Proof Locks', 'Zero Unfenced Water', 'Active Safety Marshals']
            },
            {
              index: '03',
              title: 'Contact-Matched Child Wristbands',
              icon: ShieldCheck,
              iconColor: 'bg-amber-100 text-amber-900',
              headline: 'Every child is fitted with a coded wristband linked directly to parent phone at check-in.',
              microLabels: ['Gate Wristband Pairing', '100% Supervised Entry', 'Instant Reconnection']
            },
            {
              index: '04',
              title: 'Segregated Pedestrian Promenade & Boom Gate',
              icon: Car,
              iconColor: 'bg-orange-100 text-orange-900',
              headline: 'Vehicles drop off via a one-way boom gate completely segregated from pedestrian festival lawns.',
              microLabels: ['No Moving Vehicles Near Play', 'Boom Gate Exit', '5 Richwell Ave Paved Ramp']
            },
            {
              index: '05',
              title: 'Certified Paediatric First-Aid Post & Quiet Cabana',
              icon: HeartHandshake,
              iconColor: 'bg-rose-100 text-rose-900',
              headline: 'On-site paediatric nurse, private baby feeding room, and sensory cool-down lounge for overstimulated littles.',
              microLabels: ['Certified Medic On-Duty', 'Private Nursing Cabana', 'Sensory Relief Sanctuary']
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-white/60 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
              >
                {/* Index + Icon + Title */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <span className="font-mono text-xs sm:text-sm font-bold text-amber-600 tracking-widest shrink-0 mt-1 sm:mt-0">
                    {item.index}
                  </span>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-kid font-bold text-base sm:text-lg text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {item.headline}
                    </p>
                  </div>
                </div>

                {/* Tactile Micro-Labels */}
                <div className="flex flex-wrap items-center gap-2 pl-8 md:pl-0 shrink-0">
                  {item.microLabels.map((lbl, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] text-slate-700 border border-[#E8E2D6] text-xs font-semibold"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
