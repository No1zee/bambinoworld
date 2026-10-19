import React, { useState } from 'react';
import {
  Baby,
  Castle,
  Palette,
  FlaskConical,
  Music2,
  Compass,
  Shield,
  BookOpen,
  ToyBrick,
  Rocket,
  Smile,
  Ticket,
  ArrowRight,
  Sparkles,
  Heart,
  Image as ImageIcon
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig
} from '../data/sectionBackgrounds';

interface PlayZonesViewProps {
  onInspectZone3D: (zoneId: string) => void;
  onOpenBooking: () => void;
}

export const PlayZonesView: React.FC<PlayZonesViewProps> = ({ onInspectZone3D, onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [bgConfig] = useState<SectionBackgroundConfig>(getStoredSectionBackgrounds);

  const zones = [
    {
      id: 'little-garden',
      name: 'The Little Garden',
      age: '6M – 2Y',
      tone: 'baby',
      icon: Baby,
      tagColor: 'bg-emerald-500 text-white',
      bannerBg: 'from-emerald-950 via-teal-950 to-slate-950',
      image: bgConfig.zoneCards['little-garden'] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Calm sensory sanctuary with shaded soft-play foam blocks and bougainvillea pergolas.',
      features: [
        { icon: Baby, label: 'Soft Play Blocks', tip: 'Cushioned foam climbing blocks and crawling mazes' },
        { icon: BookOpen, label: 'Storybook Pergola', tip: 'Cozy picture-book reading under shaded bougainvillea' },
        { icon: ToyBrick, label: 'Foam Ball Pool', tip: 'Safe ball and soft rubber foam splash pits' },
        { icon: Shield, label: 'Shoe-Free Picket', tip: 'Padded floor mats and dedicated infant picket fence' }
      ]
    },
    {
      id: 'adventure-zone',
      name: 'Adventure Zone',
      age: '3 – 6Y',
      tone: 'adventure',
      icon: Castle,
      tagColor: 'bg-amber-400 text-slate-950',
      bannerBg: 'from-amber-950 via-orange-950 to-slate-950',
      image: bgConfig.zoneCards['adventure-zone'] || 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Expansive lawn with four giant bouncy castles, slides, and animal encounters.',
      features: [
        { icon: Castle, label: '4 Inflatables', tip: 'Commercial bouncy castles and dual-lane slides' },
        { icon: Smile, label: 'Petting Zoo', tip: 'Gentle supervised animal petting with bunnies and chicks' },
        { icon: Shield, label: 'Play Marshals', tip: 'Dedicated safety marshals at every castle entrance' },
        { icon: ToyBrick, label: 'Lawn Games', tip: 'Giant Tic-Tac-Toe and mini basketball hoops' }
      ]
    },
    {
      id: 'creative-zone',
      name: 'Creative Zone',
      age: '3 – 6+Y',
      tone: 'creative',
      icon: Palette,
      tagColor: 'bg-sky-400 text-slate-950',
      bannerBg: 'from-sky-950 via-blue-950 to-slate-950',
      image: bgConfig.zoneCards['creative-zone'] || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Outdoor art studio featuring hands-on arts & crafts, painting, bracelet making, and spelling activities.',
      features: [
        { icon: Palette, label: 'Arts & Crafts', tip: 'Hands-on creative art stations, collage crafts, and take-home keepsakes' },
        { icon: Sparkles, label: 'Painting', tip: 'Washable watercolors, easel art studio, and canvas painting' },
        { icon: Heart, label: 'Bracelet Making', tip: 'Friendship bead weaving and colorful charm bracelet crafting' },
        { icon: BookOpen, label: 'Spelling Activities', tip: 'Fun wooden spelling tiles, word games, and letter discovery' }
      ]
    },
    {
      id: 'discovery-world',
      name: 'Discovery World',
      age: '3 – 6+Y',
      tone: 'discovery',
      icon: FlaskConical,
      tagColor: 'bg-rose-400 text-slate-950',
      bannerBg: 'from-rose-950 via-purple-950 to-slate-950',
      image: bgConfig.zoneCards['discovery-world'] || 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Sensory volcano lab, cardboard rocket building, and a giant 6x6m lawn chessboard.',
      features: [
        { icon: FlaskConical, label: 'Science Lab', tip: 'Sensory color mixing potions and fizzy mini volcanoes' },
        { icon: Rocket, label: 'Rocket Craft', tip: 'Cardboard rover building and aerodynamic launches' },
        { icon: ToyBrick, label: '6x6m Chess', tip: 'Outdoor lawn chessboard, giant Jenga and Connect-4' },
        { icon: Shield, label: 'Sunflower Pot', tip: 'Biodegradable planting pot with seeds to grow at home' }
      ]
    },
    {
      id: 'celebration-stage',
      name: 'Celebration Stage',
      age: 'All Ages',
      tone: 'stage',
      icon: Music2,
      tagColor: 'bg-purple-400 text-slate-950',
      bannerBg: 'from-purple-950 via-indigo-950 to-slate-950',
      image: bgConfig.zoneCards['celebration-stage'] || 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Outdoor amphitheater lawn with live acoustic marimba, comedy clown theater, and bubble shows.',
      features: [
        { icon: Music2, label: 'Live Marimba', tip: 'Authentic acoustic Zimbabwean marimba performances' },
        { icon: Smile, label: 'Clown Theatre', tip: 'Comedy clown theatre, puppetry, and magic tricks' },
        { icon: Shield, label: '< 85 dB Sound', tip: 'Monitored acoustic sound levels calibrated for young ears' },
        { icon: Compass, label: 'Bubble Magic', tip: 'Giant floating iridescent soap bubbles across the lawn' }
      ]
    }
  ];

  const filteredZones = activeTab === 'all' ? zones : zones.filter(z => z.tone === activeTab);

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Top Header Section with "Explore in 3D" CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl sm:text-5xl font-kid font-black text-slate-900 tracking-wide">
              Our <span className="kid-tilt-l text-amber-500">Play</span> <span className="kid-tilt-r text-emerald-600">Zones</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
              Five dedicated play sectors designed for age-appropriate adventure and safety.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Explore grounds in 3D CTA button */}
            <button
              onClick={() => onInspectZone3D('little-garden')}
              className="min-h-[44px] px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto shrink-0"
            >
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Explore grounds in 3D &rarr;</span>
            </button>
          </div>
        </div>

        {/* Filter Pills with Apple HIG 44px Touch Targets */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All 5 Zones' },
            { id: 'baby', label: '👶 Baby (6M–2Y)' },
            { id: 'adventure', label: '🏰 Adventure (3–6Y)' },
            { id: 'creative', label: '🎨 Creative' },
            { id: 'discovery', label: '🔬 Discovery' },
            { id: 'stage', label: '🎪 Stage' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-98 cursor-pointer flex items-center justify-center ${
                activeTab === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* FULL-WIDTH IMMERSIVE SECTIONS: Wrap with section background image and soft warm overlay */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-5 sm:p-8 border border-amber-900/30 shadow-2xl space-y-6">
          {/* Section Atmosphere Background */}
          <img
            src={bgConfig.playZonesSection}
            alt="Play Zones Grounds"
            className="absolute inset-0 w-full h-full object-cover object-center scale-102"
          />
          {/* Soft warm gradient overlay for clear contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-amber-950/85 to-slate-950/98" />

          <div className="relative z-10 space-y-6">
            {filteredZones.map(zone => {
              const Icon = zone.icon;
              return (
                <section
                  key={zone.id}
                  className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-r ${zone.bannerBg} text-white shadow-xl border border-slate-800 flex flex-col justify-between min-h-[300px] sm:min-h-[340px]`}
                >
                  {/* Full Bleed Image Layer */}
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-35 mix-blend-luminosity scale-102 hover:scale-105 transition-transform duration-700"
                  />

                  {/* Soft Warm Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/98 via-slate-950/85 to-slate-950/50" />

                  {/* Zone Content */}
                  <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-sm ${zone.tagColor}`}>
                          {zone.age}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-300 font-medium">The Little Farm Grounds</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-kid font-black tracking-wide drop-shadow-md">
                        {zone.name}
                      </h2>
                      <p className="text-base text-slate-200 font-medium leading-relaxed">
                        {zone.shortDesc}
                      </p>

                      {/* Feature Chips with Tooltips & 44px touch targets */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {zone.features.map((feat, fIdx) => {
                          const FIcon = feat.icon;
                          return (
                            <Tooltip key={fIdx} content={feat.tip} position="top" className="w-full">
                              <div className="min-h-[44px] flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 active:bg-slate-800 border border-white/10 text-xs sm:text-sm font-semibold text-slate-100 cursor-pointer transition w-full">
                                <FIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                <span className="truncate">{feat.label}</span>
                              </div>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions - full width on phones, 48px touch targets */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0 pt-2 lg:pt-0 w-full lg:w-auto">
                      <button
                        onClick={() => onInspectZone3D(zone.id)}
                        className="w-full lg:w-44 min-h-[48px] py-3.5 px-4 bg-white/15 hover:bg-white/25 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-white/20 backdrop-blur-md"
                      >
                        <Compass className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>View in 3D Map</span>
                      </button>

                      <button
                        onClick={onOpenBooking}
                        className="w-full lg:w-44 min-h-[44px] py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>Book Pass</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
