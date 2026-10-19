import React from 'react';
import { MapPin, Shield, Sprout, Heart, ExternalLink, Car, Waves, ArrowRight } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { MulticolorTitle } from './MulticolorTitle';

interface TheLittleFarmViewProps {
  onOpen3DMap: () => void;
  onOpenBooking: () => void;
}

export const TheLittleFarmView: React.FC<TheLittleFarmViewProps> = ({
  onOpen3DMap,
  onOpenBooking
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* FULL-WIDTH PANORAMIC VENUE BANNER: Image covers section side to side */}
      <section className="relative w-full min-h-[560px] sm:min-h-[640px] flex items-end overflow-hidden border-b border-emerald-950/40">
        <img
          src="/bambino-farm.jpg"
          alt="The Little Farm Grounds Aerial View"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient Scrim for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/20" />

        {/* Content Container spanning side to side */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-white">
          <div className="max-w-2xl space-y-4">
            {/* Headline with Kid-Friendly Chubby Typography */}
            <MulticolorTitle
              text="The Little Farm, Meyrick Park"
              as="h1"
              className="text-fluid-h1 font-kid font-black leading-tight drop-shadow-md break-words"
              bounceOnMount={true}
            />
            <p className="text-fluid-lead text-slate-200 leading-relaxed drop-shadow-sm max-w-xl font-medium">
              4,000 m² of open grass lawns, mature shade trees, and purpose-built family amenities at 5 Richwell Ave, Harare, Zimbabwe.
            </p>

            {/* Quick Location Badge & Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm">
              <span className="min-h-[44px] px-3.5 py-2.5 bg-slate-900/85 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-2 text-slate-100 font-semibold text-fluid-xs">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>5 Richwell Ave, Meyrick Park, Mabelreign</span>
              </span>

              <a
                href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-4 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 rounded-xl text-white font-bold flex items-center gap-1.5 transition shadow-sm active:scale-98 text-fluid-btn"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onOpen3DMap}
                className="min-h-[44px] px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-98 text-fluid-btn"
              >
                <MapPin className="w-4 h-4" />
                <span>Explore in 3D</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EXPANSIVE VENUE AMENITIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <MulticolorTitle
          text="Venue & Safety Infrastructure"
          as="h2"
          className="text-fluid-h2 font-kid font-black text-slate-900 tracking-wide break-words"
          bounceOnMount={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Sprout, title: '4,000 m² Grounds', tip: 'Expansive grass buffers, shaded lawns & picnic pergolas' },
            { icon: Waves, title: 'Fenced Waters', tip: 'Safety barrier around pond and locked fence around pool buffer' },
            { icon: Shield, title: '100% Supervised', tip: 'Staff safety marshals on patrol with child wristband matching' },
            { icon: Car, title: 'Segregated Cars', tip: 'Pedestrian arrival promenade + one-way boom gate vehicle exit' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Tooltip key={idx} content={item.tip} position="top" className="w-full">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-400 transition cursor-pointer flex items-center gap-4 w-full min-h-[72px]">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 font-['Outfit']">{item.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">Tap or hover for details</span>
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </section>
    </div>
  );
};
