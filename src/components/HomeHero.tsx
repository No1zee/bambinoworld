import React, { useState } from 'react';
import {
  ArrowRight,
  Compass,
  Sprout,
  Baby,
  Heart,
  MapPin,
  Ticket,
  Shield,
  Utensils,
  Music,
  Palette,
  Award,
  Calendar,
  TreePine,
  Sun,
  Castle,
  FlaskConical,
  Music2,
  BookOpen,
  ToyBrick,
  Rocket,
  Smile,
  ExternalLink,
  Car,
  Clock,
  Check,
  Sparkles,
  Users,
  Coffee,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { SiteMap3D, SiteMap3DHandle } from './SiteMap3D';
import { Tooltip } from './Tooltip';
import { PROGRAMME_SESSIONS, SIBLING_DISCOUNTS } from '../data/festivalData';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig
} from '../data/sectionBackgrounds';
import { BackgroundCustomizerModal } from './BackgroundCustomizerModal';

interface HomeHeroProps {
  onOpen3DMap: (zoneId?: string) => void;
  onOpenBooking: () => void;
  onSelectZone: (zoneId: string) => void;
  siteMapRef: React.RefObject<SiteMap3DHandle | null>;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpen3DMap,
  onOpenBooking,
  onSelectZone,
  siteMapRef
}) => {
  const [activeZoneTab, setActiveZoneTab] = useState<string>('all');
  const [activeProgZone, setActiveProgZone] = useState<string>('all');
  const [bgConfig, setBgConfig] = useState<SectionBackgroundConfig>(getStoredSectionBackgrounds);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  const zones = [
    {
      id: 'little-garden',
      name: 'The Little Garden',
      age: '6M – 2Y',
      tagColor: 'bg-emerald-500 text-white',
      bannerBg: 'from-emerald-950 via-teal-950 to-slate-950',
      image: bgConfig.zoneCards['little-garden'] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Calm sensory sanctuary with soft foam blocks and shaded bougainvillea pergolas.',
      features: [
        { icon: Baby, label: 'Soft Play Foam', tip: 'Cushioned crawling blocks, wedges and tumble mats' },
        { icon: BookOpen, label: 'Story Pergola', tip: 'Gentle storybook readings under bougainvillea shade' },
        { icon: ToyBrick, label: 'Foam Ball Pit', tip: 'Clean, sanitized soft foam play pit for tiny explorers' },
        { icon: Shield, label: 'Shoe-Free Lawn', tip: 'Padded safety flooring with dedicated perimeter fence' }
      ]
    },
    {
      id: 'adventure-zone',
      name: 'Adventure Zone',
      age: '3 – 6Y',
      tagColor: 'bg-amber-400 text-slate-950',
      bannerBg: 'from-amber-950 via-orange-950 to-slate-950',
      image: bgConfig.zoneCards['adventure-zone'] || 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Open lawn with four giant bouncy castles, obstacle slides, and gentle animal encounters.',
      features: [
        { icon: Castle, label: '4 Inflatables', tip: 'Commercial bouncy castles & dual-lane slides' },
        { icon: Smile, label: 'Petting Meadow', tip: 'Gentle supervised animal petting with bunnies & chicks' },
        { icon: Shield, label: 'Safety Marshals', tip: 'Dedicated marshals stationed at every inflatable entry' },
        { icon: ToyBrick, label: 'Lawn Games', tip: 'Giant foam checkers, ring toss & mini basketball hoops' }
      ]
    },
    {
      id: 'creative-zone',
      name: 'Creative Zone',
      age: '3 – 6+Y',
      tagColor: 'bg-sky-400 text-slate-950',
      bannerBg: 'from-sky-950 via-blue-950 to-slate-950',
      image: bgConfig.zoneCards['creative-zone'] || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Outdoor watercolor easel studio, friendship crafts, and smooth roller skating.',
      features: [
        { icon: Compass, label: 'Skating Rink', tip: 'Smooth-surface rink with complimentary quad skates' },
        { icon: Shield, label: 'Fitted Helmets', tip: 'Mandatory helmets, knee pads and wrist guards fitted' },
        { icon: Palette, label: 'Easel Painting', tip: 'Washable watercolors, easel art and take-home canvas' },
        { icon: ToyBrick, label: 'Bead Weaving', tip: 'Friendship bracelet crafts and wooden spelling tiles' }
      ]
    },
    {
      id: 'discovery-world',
      name: 'Discovery World',
      age: '3 – 6+Y',
      tagColor: 'bg-rose-400 text-slate-950',
      bannerBg: 'from-rose-950 via-purple-950 to-slate-950',
      image: bgConfig.zoneCards['discovery-world'] || 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Sensory volcano experiments, cardboard rocket crafts, and a 6x6m lawn chessboard.',
      features: [
        { icon: FlaskConical, label: 'Science Lab', tip: 'Fizzing mini volcanoes & safe bubbling color potions' },
        { icon: Rocket, label: 'Rocket Craft', tip: 'Cardboard rover building with aerodynamic lawn launch' },
        { icon: ToyBrick, label: '6x6m Lawn Chess', tip: 'Oversized lawn chessboard, giant Jenga & Connect-4' },
        { icon: Shield, label: 'Sunflower Pot', tip: 'Biodegradable planting pot with seeds to grow at home' }
      ]
    },
    {
      id: 'celebration-stage',
      name: 'Celebration Stage',
      age: 'All Ages',
      tagColor: 'bg-purple-400 text-slate-950',
      bannerBg: 'from-purple-950 via-indigo-950 to-slate-950',
      image: bgConfig.zoneCards['celebration-stage'] || 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Outdoor amphitheater lawn with live acoustic marimba, comedy clown theater, and bubble shows.',
      features: [
        { icon: Music2, label: 'Live Marimba', tip: 'Acoustic Zimbabwean marimba performances all afternoon' },
        { icon: Smile, label: 'Clown Theater', tip: 'Puppetry, gentle comedy magic, and interactive storytelling' },
        { icon: Shield, label: '< 85 dB Audio', tip: 'Acoustic sound levels strictly calibrated for young ears' },
        { icon: Compass, label: 'Bubble Finale', tip: 'Giant floating iridescent soap bubbles across the lawn' }
      ]
    }
  ];

  const filteredZones = activeZoneTab === 'all'
    ? zones
    : zones.filter(z => z.id === activeZoneTab);

  const filteredSchedule = activeProgZone === 'all'
    ? PROGRAMME_SESSIONS
    : PROGRAMME_SESSIONS.filter(s => s.zone === activeProgZone);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION: Full-screen family festival imagery, short headline, date, location, 1 primary action */}
      <section className="relative w-full min-h-[660px] sm:min-h-[720px] lg:min-h-[820px] flex items-center overflow-hidden border-b border-emerald-950/40">
        {/* Full-Bleed High-Resolution Panoramic Imagery */}
        <img
          src="/bambino-farm.jpg"
          alt="Bambino World Festival Grounds at The Little Farm"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
        />

        {/* Sophisticated editorial scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/35 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/30" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <div className="max-w-2xl space-y-6">
            {/* Friendly festival badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/90 text-slate-950 text-xs font-black tracking-wide shadow-md">
              <Calendar className="w-3.5 h-3.5" />
              <span>Saturday 5 December 2026 · 10:00 AM – 5:00 PM</span>
            </div>

            {/* Dominant Headline with Playful Accents */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-kid font-black tracking-wide leading-[1.08] text-white text-balance drop-shadow-xl">
              Where <span className="kid-tilt-l kid-pastel-yellow">Little</span> <span className="kid-tilt-r kid-pastel-mint">Dreams</span> Come <span className="kid-tilt-l kid-pastel-coral">Alive</span>.
            </h1>

            {/* Short, emotionally resonant microcopy */}
            <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed font-medium drop-shadow-sm">
              A day of play, discovery, and family memories across 4,000 m² of sunlit lawns at The Little Farm, Harare.
            </p>

            {/* One Primary Booking Action + Secondary Explore */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenBooking}
                className="action-button px-7 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-xl flex items-center gap-2.5 cursor-pointer hover:scale-102"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Pass ($25)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#play-zones"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition border border-white/20 backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-lg hover:scale-102"
              >
                <span>Explore Play Zones</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </a>
            </div>

            {/* Instant Venue & Inclusions Footnote */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300 font-medium">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>5 Richwell Ave, Meyrick Park · All 5 zones, lunch & sweet treats included</span>
            </div>
          </div>
        </div>

        {/* Distinctive Date & Venue Stamp */}
        <div className="hidden lg:flex absolute bottom-12 right-12 z-20 w-32 h-32 rounded-full bg-amber-400 text-slate-950 font-black flex-col items-center justify-center text-center shadow-2xl border-4 border-slate-950 transform rotate-12 hover:scale-105 transition-transform">
          <span className="text-[10px] uppercase tracking-widest font-bold">Harare</span>
          <span className="text-2xl font-kid font-black leading-none my-1">5 DEC</span>
          <span className="text-[11px] font-black text-slate-900 leading-none">2026</span>
        </div>
      </section>

      {/* 2. QUICK TRUST STRIP: Age range, supervision, meals, venue, and date with icons & tooltips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                icon: Baby,
                color: 'text-amber-500 bg-amber-50',
                title: '6M – 12 Years',
                tip: 'Dedicated age-segregated zones keep toddlers safe from active older children.'
              },
              {
                icon: Shield,
                color: 'text-emerald-600 bg-emerald-50',
                title: '100% Supervised',
                tip: 'Trained safety marshals, secure matching child wristbands, and fenced pond buffers.'
              },
              {
                icon: Utensils,
                color: 'text-sky-600 bg-sky-50',
                title: 'Lunch & Sweets',
                tip: 'Child lunch pack, juice box, plus unlimited candyfloss and warm waffles included.'
              },
              {
                icon: Sprout,
                color: 'text-emerald-700 bg-emerald-50',
                title: '4,000 m² Lawns',
                tip: 'Expansive private green parkland with mature shade trees and picnic pergolas.'
              },
              {
                icon: Car,
                color: 'text-purple-600 bg-purple-50',
                title: 'Secure Parking',
                tip: 'Dedicated on-site marshaled parking with segregated pedestrian entry.'
              },
              {
                icon: MapPin,
                color: 'text-rose-500 bg-rose-50',
                title: 'Meyrick Park',
                tip: '5 Richwell Ave, Harare · Safe residential enclave with paved access.'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Tooltip key={idx} content={item.tip} position="top" className="w-full">
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-help w-full">
                    <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                      {item.title}
                    </span>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PLAY ZONES: Large immersive section with background image & soft warm gradient overlay */}
      <section id="play-zones" className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-amber-900/40 shadow-2xl space-y-8">
          {/* Section Photographic Background with Soft Warm Gradient Overlay */}
          <img
            src={bgConfig.playZonesSection}
            alt="Play Zones Grounds"
            className="absolute inset-0 w-full h-full object-cover object-center scale-102"
          />
          {/* Soft warm gradient overlay for clear contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/92 via-amber-950/80 to-slate-950/95" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-5">
              <div>
                <h2 className="text-3xl sm:text-5xl font-kid font-black text-white tracking-wide drop-shadow-md">
                  Five Dedicated <span className="kid-tilt-l text-amber-400">Play</span> <span className="kid-tilt-r text-emerald-400">Zones</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-200 mt-1 font-medium">
                  Curated by age so every child plays safely and joyfully.
                </p>
              </div>

              {/* Quick Zone Filter & Customizer Button */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 transition cursor-pointer"
                  title="Customize background image URLs or upload images"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Edit Backgrounds</span>
                </button>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All 5 Zones' },
                    { id: 'little-garden', label: '👶 6M–2Y' },
                    { id: 'adventure-zone', label: '🏰 3–6Y' },
                    { id: 'creative-zone', label: '🎨 Creative' },
                    { id: 'discovery-world', label: '🔬 Discovery' },
                    { id: 'celebration-stage', label: '🎪 Stage' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveZoneTab(tab.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        activeZoneTab === tab.id
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full-Bleed Visual Zone Cards */}
            <div className="space-y-6">
              {filteredZones.map(zone => (
                <div
                  key={zone.id}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${zone.bannerBg} text-white shadow-xl border border-slate-800/80 min-h-[300px] sm:min-h-[340px] flex items-center`}
                >
                  {/* Full Cover Photographic Layer */}
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-35 mix-blend-luminosity scale-102 hover:scale-105 transition-transform duration-700"
                  />

                  {/* High legibility warm gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/45" />

                  <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-4">
                      {/* Age Badge */}
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-sm ${zone.tagColor}`}>
                          {zone.age}
                        </span>
                        <span className="text-xs text-slate-300 font-semibold">
                          The Little Farm Grounds
                        </span>
                      </div>

                      {/* Zone Title & 1-Sentence Headline */}
                      <div>
                        <h3 className="text-2xl sm:text-4xl font-kid font-black tracking-wide drop-shadow-md">
                          {zone.name}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-200 mt-1 font-medium leading-relaxed">
                          {zone.shortDesc}
                        </p>
                      </div>

                      {/* Clean Feature Badges with Tooltips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {zone.features.map((feat, fIdx) => {
                          const FIcon = feat.icon;
                          return (
                            <Tooltip key={fIdx} content={feat.tip} position="top">
                              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-white/10 text-xs font-semibold text-slate-100 cursor-help transition backdrop-blur-xs">
                                <FIcon className="w-4 h-4 text-amber-300 shrink-0" />
                                <span className="truncate">{feat.label}</span>
                              </div>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>

                    {/* Clear Actions */}
                    <div className="flex flex-row lg:flex-col items-center gap-3 shrink-0 pt-2 lg:pt-0">
                      <button
                        onClick={() => {
                          onSelectZone(zone.id);
                          siteMapRef.current?.focusZone(zone.id);
                          const mapElem = document.getElementById('site-map-section');
                          mapElem?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex-1 lg:w-44 py-3.5 px-4 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-white/20 backdrop-blur-md"
                      >
                        <Compass className="w-4 h-4 text-amber-300" />
                        <span>View in 3D Map</span>
                      </button>

                      <button
                        onClick={onOpenBooking}
                        className="flex-1 lg:w-44 py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <span>Book Pass ($25)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 3D SITE MAP: Positioned beside Play Zones, framed as: "See how the festival grounds will come alive" */}
      <section id="site-map-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-kid font-black text-slate-900 tracking-wide">
              See How The Grounds Will <span className="kid-tilt-l text-amber-500">Come Alive</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              A preview of what families can expect on the day. Explore the 4,000 m² grounds, play zones, and pedestrian flow.
            </p>
          </div>

          <button
            onClick={() => onOpen3DMap()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto shrink-0"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Fullscreen 3D View</span>
          </button>
        </div>

        {/* 3D Map Canvas Box */}
        <div className="h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-xl border-2 border-slate-300 relative bg-slate-950">
          <SiteMap3D
            ref={siteMapRef}
            onSelectZone={onSelectZone}
            className="w-full h-full"
            onToggleCinema={() => onOpen3DMap()}
          />
        </div>
      </section>

      {/* 5. THE LITTLE FARM: Full-width scenic imagery, location, safety, and directions */}
      <section id="the-little-farm" className="relative w-full min-h-[500px] sm:min-h-[560px] flex items-center overflow-hidden border-y border-emerald-950/40">
        <img
          src="/bambino-farm.jpg"
          alt="The Little Farm Grounds Aerial View"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 text-white">
          <div className="max-w-2xl space-y-5">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-kid font-black leading-tight drop-shadow-md">
              The Little Farm, <span className="kid-tilt-l kid-pastel-yellow">Meyrick Park</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              4,000 m² of secure open grass lawns, shade pergolas, and purpose-built family amenities at 5 Richwell Ave, Mabelreign, Harare.
            </p>

            {/* Safety highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {[
                { title: 'Fenced Waters', tip: 'Wire-fenced pond and spear-picket barrier around pool area' },
                { title: 'Shaded Lawns', tip: 'Mature trees, shade pergolas and outdoor picnic benches' },
                { title: 'Clean Restrooms', tip: 'Regularly sanitized flush toilets and infant change room' },
                { title: 'Child Wristbands', tip: 'Parent contact matching wristband provided upon arrival' },
                { title: 'Separate Exit', tip: 'One-way boom gate vehicle exit keeps child paths car-free' },
                { title: 'First Aid Post', tip: 'Dedicated certified first aid tent on site throughout' }
              ].map((item, idx) => (
                <Tooltip key={idx} content={item.tip} position="top">
                  <div className="flex items-center gap-2 p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-xs font-semibold text-slate-100 cursor-help">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                </Tooltip>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenBooking}
                className="px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Book Pass ($25)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROGRAMME: Clean, scannable schedule with scenic background image & warm gradient overlay */}
      <section id="programme" className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-emerald-900/40 shadow-2xl space-y-6">
          {/* Section Photographic Background with Soft Warm Gradient Overlay */}
          <img
            src={bgConfig.programmeSection}
            alt="Event Programme Stage Backdrop"
            className="absolute inset-0 w-full h-full object-cover object-center scale-102"
          />
          {/* Soft warm gradient overlay for clear contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-amber-950/80 to-emerald-950/88" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <h2 className="text-3xl sm:text-5xl font-kid font-black text-white tracking-wide drop-shadow-md">
                  Event <span className="kid-tilt-l text-amber-400">Programme</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  Saturday 5 December 2026 · 10:00 AM – 5:00 PM CAT.
                </p>
              </div>

              {/* Zone filter & Customizer Button */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 transition cursor-pointer"
                  title="Customize background image URLs or upload images"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change Background</span>
                </button>

                {[
                  { id: 'all', label: 'All Sessions' },
                  { id: 'stage', label: 'Stage' },
                  { id: 'baby', label: 'Baby' },
                  { id: 'adventure', label: 'Adventure' },
                  { id: 'creative', label: 'Creative' },
                  { id: 'discovery', label: 'Discovery' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveProgZone(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      activeProgZone === f.id
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Programme Timeline Cards with Frosted Glassmorphic Styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSchedule.slice(0, 9).map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-amber-400/50 shadow-md transition space-y-2 flex flex-col justify-between text-white"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>{session.start} – {session.end}</span>
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/20">
                        {session.zoneName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug drop-shadow-xs">
                      {session.title}
                    </h4>
                    {session.description && (
                      <p className="text-xs text-slate-200 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[11px] text-slate-300">
                    <span>{session.age || 'All Ages'}</span>
                    <span className="font-semibold text-emerald-300">Included in Pass</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. TICKETS & "WHAT PARENTS NEED TO KNOW": Transparent pricing, inclusions, and parent trust */}
      <section id="tickets" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Ticket Tier Cards */}
        <div className="bg-[#f7f5ed] border border-slate-300/80 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-5xl font-kid font-black text-slate-900 tracking-wide">
              Simple, Transparent <span className="kid-tilt-l text-emerald-600">Tickets</span>
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Every child pass includes all play zones, meals, and sweet treats. Parents enter free.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md flex flex-col justify-between space-y-4 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Single Child</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-kid font-black text-slate-900">$25</span>
                  <span className="text-xs text-slate-400">/ child</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Early Bird rate until 30 November ($30 standard).
                </p>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> All 5 Play Zones
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> Child Lunch Pack &amp; Juice
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> Unlimited Candyfloss &amp; Waffles
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> Free Adults &amp; Babies under 2
                </li>
              </ul>
              <button
                onClick={onOpenBooking}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Book Pass ($25)
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Two Siblings</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-kid font-black text-slate-900">$45</span>
                  <span className="text-xs text-slate-400">total ($22.50 ea)</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Automatic $5 discount for families with 2 children.
                </p>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> 2 Child Passes Included
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> 2 Fresh Lunch Packs
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> Unlimited Sweets Both Kids
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> Accompanying Parents Free
                </li>
              </ul>
              <button
                onClick={onOpenBooking}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Book 2 Passes ($45)
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3+ Siblings Pass</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-kid font-black text-slate-900">$60</span>
                  <span className="text-xs text-slate-400">for 3 kids</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  $15 sibling savings ($70 for 4 children).
                </p>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> 3+ Child Passes Included
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> Full Inclusions for Each Child
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> Unlimited Sweets
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> All Family Adults Free
                </li>
              </ul>
              <button
                onClick={onOpenBooking}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Book Sibling Pass
              </button>
            </div>
          </div>

          {/* Ticket Inclusions Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 text-center">
              What Every Pass Includes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { icon: Utensils, label: 'Meal & Juice', tip: 'Fresh child lunch pack & chilled fruit juice box' },
                { icon: Award, label: 'Unlimited Sweets', tip: 'Unlimited freshly spun candyfloss & artisan waffles' },
                { icon: Music, label: 'Live Concerts', tip: 'Acoustic Zimbabwean marimba, comedy clown & puppet show' },
                { icon: Palette, label: 'Face Paint & Art', tip: 'Glitter tattoos, washable easel art & bracelets' },
                { icon: Compass, label: 'All Play Zones', tip: '5 age-graded zones including roller-skating pit & bouncy castles' },
                { icon: Shield, label: 'Explorer Medal', tip: 'Official Bambino Explorer Passport & take-home plant pot' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Tooltip key={idx} content={item.tip} position="top">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center gap-2 cursor-help hover:border-emerald-500 hover:shadow-xs transition w-full">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 leading-tight">{item.label}</span>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* "What parents need to know" clean icon cards & tooltips */}
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-2xl sm:text-4xl font-kid font-black text-slate-900 tracking-wide">
              What Parents <span className="kid-tilt-l text-emerald-600">Need to Know</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Everything you need for an easy, stress-free family day out.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: 'Safety & Supervision',
                desc: 'Trained marshals at every zone. Matching parent/child wristbands provided upon arrival.',
                tip: 'No child may exit the grounds without matching parent wristband verification.'
              },
              {
                icon: Baby,
                title: 'Age Suitability',
                desc: 'Zones are segregated from 6 months to 12 years. Toddlers have a dedicated quiet area.',
                tip: 'Tiny ones have their own shaded soft play sanctuary separated from big kids.'
              },
              {
                icon: Utensils,
                title: 'Food & Refreshments',
                desc: 'Nutritious child lunch pack + juice included. Halal & vegetarian options available.',
                tip: 'Barista coffee and artisan food stalls available on lawn for parents.'
              },
              {
                icon: Car,
                title: 'Parking & Arrival',
                desc: 'Free guarded on-site parking at 5 Richwell Ave with one-way vehicle traffic exit.',
                tip: 'Separate pedestrian promenade ensures kids never walk near driving cars.'
              },
              {
                icon: Sun,
                title: 'Shade & Facilities',
                desc: 'Expansive shade sails, pergolas, clean flush restrooms, and baby changing tables.',
                tip: 'Plentiful shaded picnic benches and covered retreat in the event of sun or drizzle.'
              },
              {
                icon: HelpCircle,
                title: 'Payment & Entry',
                desc: 'EcoCash (0779 140 417), USD cash at gate, or pre-booking online. Adults enter free.',
                tip: 'Early bird pass is $25. Full gate pass is $35 if booking on event day.'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <Tooltip key={idx} content={card.tip} position="top" className="w-full">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-500 transition cursor-help space-y-2 flex flex-col justify-between w-full h-full">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{card.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {card.desc}
                      </p>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold pt-1">
                      Hover for parent details &rarr;
                    </span>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </section>

      {/* Background Customizer Modal */}
      <BackgroundCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentConfig={bgConfig}
        onSave={(newCfg) => setBgConfig(newCfg)}
      />
    </div>
  );
};
