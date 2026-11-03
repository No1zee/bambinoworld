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
  HeartHandshake,
  Ticket
} from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 pb-20 font-sans">
      {/* 1. SUNLIT EDITORIAL VENUE HEADER */}
      <section className="space-y-6">


        {/* Headline & Giant Architectural Metric Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-slate-200 pb-8">
          <div className="lg:col-span-8 space-y-3">
            <h1 className="font-poppins font-black text-3xl sm:text-4xl lg:text-5xl text-[#31006F] leading-tight tracking-tight">
              The Little Farm, Meyrick Park
            </h1>
            <p className="font-sans text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              A lush, gated garden sanctuary shaded by ancient trees in Meyrick Park. Designed from the grass up for your children to run wild in total safety—while you sit back, sip something cold, and breathe easy.
            </p>
          </div>

          {/* Architectural Metric Callout in Thompson Card style */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <div className="thompson-card p-6 space-y-1 w-full sm:w-auto border-t-4 border-t-[#FF6720]">
              <span className="font-poppins text-xs font-bold text-slate-700 block">Total Venue Area</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-poppins font-black text-[#FF6720] leading-none">
                  4,000
                </span>
                <span className="text-base font-poppins font-bold text-slate-700">
                  m² Parkland
                </span>
              </div>
              <span className="text-xs font-poppins font-semibold text-[#2F532E] block">
                100% Securely Gated &amp; Supervised
              </span>
            </div>
          </div>
        </div>

        {/* Dual Thompson Pill Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              soundscape.playMarimbaClick(650, 0.08);
              onOpen3DMap();
            }}
            className="thompson-pill-btn thompson-pill-purple px-6 py-3 text-sm font-bold shadow-md"
          >
            <MapPin className="w-4 h-4 text-[#F6BE00]" />
            <span>Explore Grounds in 3D</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundscape.playMarimbaClick(520, 0.06)}
            className="thompson-pill-btn bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-5 py-3 text-sm font-bold shadow-xs"
          >
            <ExternalLink className="w-4 h-4 text-[#31006F]" />
            <span>Google Maps Directions</span>
          </a>

          <button
            type="button"
            onClick={() => {
              soundscape.playMarimbaClick(580, 0.06);
              onOpenBooking();
            }}
            className="thompson-pill-btn thompson-pill-orange px-6 py-3 text-sm font-bold shadow-md"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Family Passes ($25)</span>
          </button>
        </div>
      </section>

      {/* 2. INTERACTIVE HOTSPOT DISCOVERY CANVAS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-[#31006F]">
              The Little Farm Spatial Hotspots
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            4,000 m² protected parkland with mature bougainvillea canopy and family pavilions.
          </p>
        </div>

        {/* Thompson Hotspots Canvas */}
        <div className="thompson-card p-6 sm:p-8">
          <FarmHotspotsCanvas onOpen3DMap={onOpen3DMap} />
        </div>
      </section>

      {/* 3. EDITORIAL VENUE & SAFETY LEDGER */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-slate-200 pb-4 space-y-1">
          <h2 className="font-poppins font-black text-2xl sm:text-3xl text-[#31006F] tracking-tight">
            Venue Safety &amp; Family Amenities
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            Designed from the ground up for peaceful parent reassurance and safe exploratory play.
          </p>
        </div>

        {/* 4 Cards Grid in Thompson Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="thompson-card p-6 space-y-3 border-l-4 border-l-[#2F532E]">
            <div className="flex items-center gap-2 text-[#2F532E]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-poppins font-bold text-lg text-slate-900">
                100% Gated Perimeter &amp; Wristbands
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Single security boom gate checkpoint with contact-matched parent-child wristbands. Children cannot exit the grounds without their verified matching parent.
            </p>
          </div>

          <div className="thompson-card p-6 space-y-3 border-l-4 border-l-[#41B6E6]">
            <div className="flex items-center gap-2 text-[#41B6E6]">
              <Waves className="w-5 h-5 text-[#31006F]" />
              <h3 className="font-poppins font-bold text-lg text-slate-900">
                Latched Water Barriers
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Double-latched child-height pool security fencing around venue water features, supervised non-stop by certified safety marshals.
            </p>
          </div>

          <div className="thompson-card p-6 space-y-3 border-l-4 border-l-[#FF6720]">
            <div className="flex items-center gap-2 text-[#FF6720]">
              <Sprout className="w-5 h-5" />
              <h3 className="font-poppins font-bold text-lg text-slate-900">
                Paved Stroller &amp; Pram Walkways
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Smooth paved access paths linking parking, pavilions, and rest areas, making moving between zones with prams and strollers effortless.
            </p>
          </div>

          <div className="thompson-card p-6 space-y-3 border-l-4 border-l-[#31006F]">
            <div className="flex items-center gap-2 text-[#31006F]">
              <HeartHandshake className="w-5 h-5 text-[#31006F]" />
              <h3 className="font-poppins font-bold text-lg text-slate-900">
                Paediatric Medic &amp; Nursing Suite
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Dedicated air-conditioned nursing room, private diaper changing stations, and certified paediatric attendants on site all day.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheLittleFarmView;
