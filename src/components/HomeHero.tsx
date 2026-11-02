import { TicketWizard } from './TicketWizard';
import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Sprout,
  Baby,
  Heart,
  MapPin,
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
  Sparkles,
  Users,
  Coffee,
  HelpCircle,
  Copy,
  Minus,
  Plus,
  Phone,
  Compass,
  ShieldCheck,
  Waves,
  HeartHandshake
} from 'lucide-react';
import { SiteMap3DHandle } from './SiteMap3D';
import { Tooltip } from './Tooltip';
import { FarmHotspotsCanvas } from './FarmHotspotsCanvas';
import { PROGRAMME_SESSIONS, SIBLING_DISCOUNTS } from '../data/festivalData';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig,
  SECTION_AMBIENT_GRADIENTS
} from '../data/sectionBackgrounds';
import { MulticolorTitle } from './MulticolorTitle';
import { FloatingCursorPortal, CursorPortalItem } from './FloatingCursorPortal';
import { soundscape } from '../utils/soundscape';

interface HomeHeroProps {
  onOpen3DMap: (zoneId?: string) => void;
  onOpenBooking: (childCount?: number) => void;
  onSelectZone: (zoneId: string) => void;
  siteMapRef: React.RefObject<SiteMap3DHandle | null>;
}

// Tactile Botanical Zone Pass Tone Resolver (Zero Dots, Fredoka Typography, Specular Bevel)
const getZonePassStyle = (zoneName: string) => {
  const zn = (zoneName || '').toLowerCase();
  if (zn.includes('creative') || zn.includes('art') || zn.includes('craft')) {
    return {
      gradient: 'from-[#C85A32]/35 to-[#C85A32]/15 hover:from-[#C85A32]/50 hover:to-[#C85A32]/25',
      border: 'border-[#C85A32]/60 hover:border-[#C85A32]',
      text: 'text-orange-200 hover:text-white',
      arrow: 'text-orange-300'
    };
  }
  if (zn.includes('garden') || zn.includes('little') || zn.includes('farm')) {
    return {
      gradient: 'from-[#2D5A43]/40 to-[#2D5A43]/15 hover:from-[#2D5A43]/60 hover:to-[#2D5A43]/30',
      border: 'border-emerald-500/50 hover:border-emerald-400',
      text: 'text-emerald-200 hover:text-white',
      arrow: 'text-emerald-300'
    };
  }
  if (zn.includes('adventure') || zn.includes('arena') || zn.includes('bounce')) {
    return {
      gradient: 'from-[#D97706]/35 to-[#D97706]/15 hover:from-[#D97706]/50 hover:to-[#D97706]/25',
      border: 'border-amber-500/50 hover:border-amber-400',
      text: 'text-amber-200 hover:text-white',
      arrow: 'text-amber-300'
    };
  }
  if (zn.includes('stage') || zn.includes('music') || zn.includes('celebration')) {
    return {
      gradient: 'from-[#7C3AED]/35 to-[#7C3AED]/15 hover:from-[#7C3AED]/50 hover:to-[#7C3AED]/25',
      border: 'border-purple-500/50 hover:border-purple-400',
      text: 'text-purple-200 hover:text-white',
      arrow: 'text-purple-300'
    };
  }
  return {
    gradient: 'from-white/20 to-white/5 hover:from-amber-400/25 hover:to-amber-400/10',
    border: 'border-white/25 hover:border-amber-400/50',
    text: 'text-slate-200 hover:text-amber-300',
    arrow: 'text-amber-300'
  };
};

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpen3DMap,
  onOpenBooking,
  onSelectZone,
  siteMapRef
}) => {
  const [activeZoneTab, setActiveZoneTab] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [hoveredZonePortal, setHoveredZonePortal] = useState<CursorPortalItem | null>(null);
  const [activeProgZone, setActiveProgZone] = useState<string>('all');
  const [bgConfig] = useState<SectionBackgroundConfig>(getStoredSectionBackgrounds);
  const [ticketChildCount, setTicketChildCount] = useState<number>(2);
  const [copiedEcoCash, setCopiedEcoCash] = useState<boolean>(false);
  
  // Dynamic ticket price calculation with progressive sibling discount
  const calculatePassTotal = (count: number) => {
    if (count <= 1) return 25;
    if (count === 2) return 45;
    if (count === 3) return 60;
    if (count === 4) return 70;
    return 70 + (count - 4) * 20;
  };

  const calculatedPassAmount = calculatePassTotal(ticketChildCount);
  const standardFullPrice = ticketChildCount * 30;
  const calculatedSavings = standardFullPrice - calculatedPassAmount;
  const calculatedPerChild = (calculatedPassAmount / ticketChildCount).toFixed(2);
  const calculatedEcoCashCode = `*151*1*1*0779140417*${calculatedPassAmount}#`;

  const handleCopyEcoCash = () => {
    navigator.clipboard?.writeText(calculatedEcoCashCode);
    setCopiedEcoCash(true);
    setTimeout(() => setCopiedEcoCash(false), 2500);
  };

  const zones = [
    {
      id: 'little-garden',
      name: 'The Little Garden',
      age: '6M – 2Y',
      tagColor: 'bg-emerald-500 text-white',
      image: bgConfig.zoneCards['little-garden'] || '/little-garden.jpg',
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
      image: bgConfig.zoneCards['creative-zone'] || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Outdoor art studio featuring hands-on arts & crafts, painting, bracelet making, and spelling activities.',
      features: [
        { icon: Palette, label: 'Arts & Crafts', tip: 'Hands-on creative craft stations, collage making, and take-home art' },
        { icon: Sparkles, label: 'Painting', tip: 'Washable watercolors, easel art studio, and canvas painting' },
        { icon: Heart, label: 'Bracelet Making', tip: 'Friendship bead weaving and colorful charm bracelet crafting' },
        { icon: BookOpen, label: 'Spelling Activities', tip: 'Fun wooden spelling tiles, word games, and letter discovery' }
      ]
    },
    {
      id: 'discovery-world',
      name: 'Discovery World',
      age: '3 – 6+Y',
      tagColor: 'bg-rose-400 text-slate-950',
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
      image: bgConfig.zoneCards['celebration-stage'] || 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
      shortDesc: 'Outdoor amphitheater lawn with live acoustic marimba, comedy clown theater, and bubble shows.',
      features: [
        { icon: Music2, label: 'Live Marimba', tip: 'Acoustic Zimbabwean marimba performances all afternoon' },
        { icon: Smile, label: 'Clown Theater', tip: 'Puppetry, gentle comedy magic, and interactive storytelling' },
        { icon: Shield, label: '< 85 dB Audio', tip: 'Acoustic sound levels strictly calibrated for young ears' },
        { icon: Sparkles, label: 'Bubble Finale', tip: 'Giant floating iridescent soap bubbles across the lawn' }
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
    <div className="space-y-24 sm:space-y-32 lg:space-y-40 pb-36">
      {/* 1. HERO SECTION: Full-screen family festival imagery, covering whole bottom page on phones in cinematic reveal */}
      <section className="relative w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[580px] lg:min-h-[720px] flex items-center overflow-hidden border-b border-emerald-950/40">
        {/* Full-Bleed High-Resolution Panoramic Imagery with Cinematic Slow Zoom */}
        <img
          src="/bambino-farm.jpg"
          alt="Bambino World Festival Grounds at The Little Farm"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Radiant Sunlit Ambient Radiance & Gentle Botanical Framing (Zero Mud Scrim) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 75% 25%, rgba(254, 240, 138, 0.25), transparent 55%), linear-gradient(to right, rgba(11, 22, 16, 0.78) 0%, rgba(11, 22, 16, 0.52) 48%, rgba(11, 22, 16, 0.12) 80%, transparent 100%)'
          }}
        />

        {/* Dynamic morning meadow sunlit ambient bleed */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.hero }}
        />

        {/* Hero Content - vertically centered with luminous botanical glass backplate for high legibility */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20 flex flex-col justify-center">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* 1st to appear: Friendly festival date sticker badge with hand-drawn sunbeam scribble */}
            <div className="relative inline-flex items-center self-start">
              <div className="sticker-badge animate-hero-badge px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-fluid-badge font-black tracking-wide shadow-md">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Saturday 5 December 2026 · 10am – 5pm</span>
              </div>
              
            </div>

            {/* 2nd to appear: Dominant Headline with Playful Accents, Fluid Typography & Crayon Underline */}
            <div className="animate-hero-title">
              <MulticolorTitle
                text="Where Little Dreams Come Alive"
                as="h1"
                className="text-fluid-display font-kid font-black tracking-normal leading-[1.08] text-white drop-shadow-xl break-words"
                bounceOnMount={true}
                playMarimbaOnHover={true}
              />
            </div>

            {/* 3rd to appear: Short microcopy */}
            <p className="animate-hero-desc text-fluid-lead text-slate-100 max-w-xl leading-relaxed font-normal drop-shadow-sm">
              4,000 m² of sunlit parkland, timber obstacle courses & open-air play in Meyrick Park, Harare.
            </p>

            {/* 4th & 5th to appear: Tactile 3D Buttons with Spring Physics */}
            <div className="flex flex-row items-center gap-2.5 pt-1 max-w-md">
              <button
                onClick={() => {
                  soundscape.playMarimbaClick(640, 0.08);
                  onOpenBooking(1);
                }}
                className="animate-hero-cta1 flex-1 sm:flex-none h-11 sm:h-12 px-5 sm:px-7 bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 active:translate-y-0.5 text-slate-950 font-kid font-black rounded-xl text-fluid-btn transition-all shadow-[0_10px_25px_-5px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Book Pass ($25)</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
              </button>

              <button
                onClick={() => {
                  soundscape.playMarimbaClick(540, 0.06);
                  onOpen3DMap();
                }}
                className="animate-hero-cta2 flex-1 sm:flex-none h-11 sm:h-12 px-5 sm:px-6 bg-gradient-to-br from-white/20 via-white/10 to-white/5 hover:from-white/30 hover:to-white/15 active:translate-y-0.5 text-white font-kid font-bold rounded-xl text-fluid-btn transition-all border border-white/30 hover:border-amber-400/60 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_rgba(0,0,0,0.25)] whitespace-nowrap group"
              >
                <span>Explore 3D Grounds</span>
                <span className="text-amber-300 font-bold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </button>
            </div>

            {/* 6th to appear: Instant Venue & Inclusions Footnote */}
            <div className="animate-hero-note pt-1 flex items-center gap-2 text-fluid-xs text-slate-200 font-medium">
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>5 Richwell Ave, Meyrick Park · All 5 zones, lunch &amp; sweet treats included</span>
            </div>
          </div>
        </div>

        {/* Layered Organic Wave Transition into the next section */}
      </section>

      {/* 3. PLAY ZONES: Option B Editorial Index & Catalogue (Rich Botanical Pavilion Ledger) */}
      <section id="play-zones" className="relative w-full overflow-hidden border-y border-emerald-900/40 bg-[#122219] py-20 sm:py-28 lg:py-36">
        <img
          src={bgConfig.playZonesSection}
          alt="Play Zones Grounds"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102 opacity-25 mix-blend-overlay"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.playZones }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-6">
            <div>
              <span className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase block mb-1">
                Catalogue / 05 Curated Sectors
              </span>
              <MulticolorTitle
                text="The Five Play Zones"
                as="h2"
                className="text-fluid-h2 sm:text-fluid-h1 font-kid font-black tracking-wide drop-shadow-md break-words"
                bounceOnMount={true}
                playMarimbaOnHover={true}
              />
              <p className="text-fluid-base text-slate-300 mt-1 font-medium">
                Segregated by age group across 4,000 m² of natural parkland.
              </p>
            </div>

            {/* Quick Filter Pills */}
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
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-98 cursor-pointer flex items-center justify-center ${
                    activeZoneTab === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* EDITORIAL CATALOGUE LEDGER (Zero Box Containers) */}
          <div className="divide-y divide-white/15 border-y border-white/15">
            {filteredZones.map((zone, idx) => (
              <div
                key={zone.id}
                onMouseEnter={() => {
                  soundscape.playMarimbaClick(480 + idx * 35, 0.02);
                  setHoveredZonePortal({
                    id: zone.id,
                    title: zone.name,
                    subtitle: zone.features.map(f => f.label).slice(0, 2).join(' · '),
                    image: zone.image,
                    tag: zone.age,
                    tagColor: zone.tagColor
                  });
                }}
                onMouseLeave={() => setHoveredZonePortal(null)}
                onClick={() => onSelectZone(zone.id)}
                className="group py-6 sm:py-9 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all hover:bg-white/[0.04] px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-xl cursor-pointer"
              >
                {/* Col 1: Index Number + Title + Micro-labels */}
                <div className="flex items-start sm:items-baseline gap-4 sm:gap-6 min-w-0 flex-1">
                  <span className="font-mono text-xs sm:text-sm font-bold text-amber-400/80 tracking-widest shrink-0 mt-1 sm:mt-0">
                    0{idx + 1}
                  </span>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-kid font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                        {zone.name}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${zone.tagColor}`}>
                        {zone.age}
                      </span>
                    </div>

                    {/* Punchy micro-labels (Zero wordy paragraphs!) */}
                    <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                      {zone.features.map(f => f.label).join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Col 2: Action Triggers (Directorial 3D camera flight) */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundscape.playMarimbaClick(660, 0.05);
                      onOpen3DMap(zone.id);
                    }}
                    className="min-h-[40px] px-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 hover:from-amber-400/25 hover:to-amber-400/10 text-white hover:text-amber-300 font-kid font-bold text-xs flex items-center gap-2 transition-all border border-white/25 hover:border-amber-400/50 cursor-pointer active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.25)] group"
                  >
                    <span>Fly in 3D</span>
                    <span className="text-amber-300 font-bold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundscape.playMarimbaClick(520, 0.04);
                      onSelectZone(zone.id);
                    }}
                    className="min-h-[40px] px-3.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white font-kid font-bold text-xs transition border border-white/15 cursor-pointer active:scale-95"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider into Site Map */}
      </section>

      {/* 5. THE LITTLE FARM: Sunlit Architectural Venue Spread & Interactive Hotspot Canvas */}
      <section id="the-little-farm" className="relative w-full py-20 sm:py-28 lg:py-36 border-y border-[#E8E2D6] bg-[#FAF8F4] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.farm }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-900">
          {/* Editorial Architectural Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E2D6] pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3 text-amber-800/80 font-mono text-[11px] tracking-wider uppercase font-semibold">
                <span>17°48'33.5"S · 31°00'13.8"E</span>
                <span>·</span>
                <span>Meyrick Park, Harare</span>
              </div>
              <MulticolorTitle
                text="The Little Farm Grounds"
                as="h2"
                className="text-fluid-display font-kid font-black leading-tight text-slate-900 break-words"
                bounceOnMount={true}
                playMarimbaOnHover={true}
              />
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                4,000&nbsp;m² of shaded bougainvillea lawns, secure perimeter fencing, and child-height facilities at 5 Richwell Ave.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundscape.playMarimbaClick(520, 0.06)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold tracking-wide transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Directions</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  soundscape.playMarimbaClick(620, 0.08);
                  onOpen3DMap();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-200 text-xs font-semibold tracking-wide shadow-sm transition"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Grounds Map</span>
              </button>
            </div>
          </div>

          {/* Reusable Interactive Hotspots Discovery Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-widest">
                Interactive Grounds Explorer
              </span>
            </div>
            <FarmHotspotsCanvas onOpen3DMap={() => onOpen3DMap()} />
          </div>
        </div>
      </section>

      {/* 6. PROGRAMME: Editorial Daily Timetable Ledger (Warm Golden-Hour Canopy) */}
      <section id="programme" className="relative w-full overflow-hidden border-y border-amber-900/40 bg-[#161412] py-20 sm:py-28 lg:py-36">
        <img
          src={bgConfig.programmeSection}
          alt="Event Programme Stage Backdrop"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102 opacity-25 mix-blend-overlay"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.programme }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-6">
            <div>
              <span className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase block mb-1">
                Itinerary / Saturday 5 December 2026
              </span>
              <MulticolorTitle
                text="Event Programme"
                as="h2"
                className="text-fluid-h2 font-kid font-black text-white tracking-wide drop-shadow-md break-words"
                bounceOnMount={true}
                playMarimbaOnHover={true}
              />
              <p className="text-fluid-base text-slate-300 mt-1 font-medium">
                10:00 AM – 5:00 PM CAT · All sessions included with admission pass.
              </p>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
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
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-98 cursor-pointer flex items-center justify-center ${
                    activeProgZone === f.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* EDITORIAL TIMETABLE LEDGER (Zero Box Containers) */}
          <div className="divide-y divide-white/15 border-y border-white/15">
            {filteredSchedule.slice(0, 8).map((session, idx) => {
              const zoneMapId = session.zone === 'baby' ? 'little-garden'
                : session.zone === 'stage' ? 'celebration-stage'
                : session.zone === 'adventure' ? 'adventure-zone'
                : session.zone === 'creative' ? 'creative-zone'
                : 'discovery-world';

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    soundscape.playMarimbaClick(480 + idx * 30, 0.03);
                    onOpen3DMap(zoneMapId);
                  }}
                  className="group py-5 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 transition-all hover:bg-white/[0.04] px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-xl cursor-pointer"
                >
                  {/* Col 1: Monospace Time Stamp */}
                  <div className="flex items-center gap-3 shrink-0 sm:w-44">
                    <span className="font-mono text-xs sm:text-sm font-bold text-amber-400 tracking-wider">
                      {session.start} – {session.end}
                    </span>
                  </div>

                  {/* Col 2: Title & Micro-labels */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-kid font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors tracking-wide">
                        {session.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {session.age || 'All Ages'}
                      </span>
                    </div>
                    {session.description && (
                      <p className="text-xs text-slate-300 line-clamp-1 font-medium tracking-wide">
                        {session.description}
                      </p>
                    )}
                  </div>

                  {/* Col 3: Sector Badge & Direct Flight Action */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {(() => {
                      const zoneStyle = getZonePassStyle(session.zoneName);
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundscape.playMarimbaClick(640, 0.05);
                            onOpen3DMap(zoneMapId);
                          }}
                          className={`min-h-[38px] px-3.5 rounded-xl bg-gradient-to-br ${zoneStyle.gradient} ${zoneStyle.text} font-kid font-bold text-xs flex items-center gap-1.5 transition-all border ${zoneStyle.border} cursor-pointer active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.3)] group/btn whitespace-nowrap`}
                        >
                          <span>{session.zoneName}</span>
                          <span className={`${zoneStyle.arrow} font-bold transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5`}>↗</span>
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. TICKETS: Minimal 2-Step Admission Pass Wizard */}
      <section id="tickets" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-xs font-bold text-amber-700 tracking-widest uppercase block">
            06 / Admission
          </span>
          <MulticolorTitle
            text="All-Inclusive Family Pass"
            as="h2"
            className="text-fluid-h2 font-kid font-black text-slate-900 tracking-wide"
            bounceOnMount={true}
            playMarimbaOnHover={true}
          />
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Full access to all 5 play zones, child lunch pack, fruit juice, and unlimited treats. Accompanying parents enter free.
          </p>
        </div>

        {/* Minimal Intuitive Pass Wizard */}
        <TicketWizard onBook={onOpenBooking} />

        {/* What Parents Need to Know - 3 Architectural Columns + Card-Free Swiss Hairline FAQ */}
        <div className="pt-12 sm:pt-16 space-y-16 sm:space-y-20">
          {/* Header */}
          <div className="border-b border-[#E8E2D6] pb-4">
            <span className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase block mb-1">
              GUIDELINES &amp; ESSENTIALS
            </span>
            <h3 className="text-fluid-h2 font-serif italic text-slate-900 tracking-tight leading-tight">
              What Parents <span className="font-sans font-black not-italic text-[#C85A32]">Need to Know</span>
            </h3>
          </div>

          {/* Architectural 3-Column Ground Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 md:divide-x md:divide-[#E8E2D6]">
            <div className="space-y-2.5 md:pr-8">
              <div className="flex items-center gap-2 text-emerald-700">
                <Shield className="w-4 h-4 shrink-0" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase">
                  01 / Safety First
                </span>
              </div>
              <h4 className="font-kid font-bold text-xl text-slate-900 leading-snug">
                Supervised &amp; Fenced
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-wide">
                Stationed zone marshals · Paired security wristbands · Single boom gate
              </p>
            </div>

            <div className="space-y-2.5 md:px-8">
              <div className="flex items-center gap-2 text-[#D97706]">
                <Sun className="w-4 h-4 shrink-0" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase">
                  02 / Comfort &amp; Shade
                </span>
              </div>
              <h4 className="font-kid font-bold text-xl text-slate-900 leading-snug">
                Shade &amp; Amenities
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-wide">
                Shade sails · Sanitized restrooms · Infant changing · On-site medic post
              </p>
            </div>

            <div className="space-y-2.5 md:pl-8">
              <div className="flex items-center gap-2 text-[#C85A32]">
                <Car className="w-4 h-4 shrink-0" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase">
                  03 / Arrival &amp; Entry
                </span>
              </div>
              <h4 className="font-kid font-bold text-xl text-slate-900 leading-snug">
                Guarded Entry
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-wide">
                5 Richwell Ave, Meyrick Park · Free guarded parking · Infants &amp; parents free
              </p>
            </div>
          </div>

          {/* CARD-FREE SWISS HAIRLINE FAQ ACCORDION (Zero Containers) */}
          <div className="pt-4 space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#E8E2D6] pb-3">
              <h4 className="font-kid font-bold text-lg sm:text-xl text-slate-900">
                Frequently Asked Questions
              </h4>
              <span className="font-mono text-xs text-slate-400">
                SWISS INDEX / 05 ANSWERS
              </span>
            </div>

            <div className="divide-y divide-[#E8E2D6] border-y border-[#E8E2D6]">
              {[
                {
                  id: 0,
                  index: '01',
                  question: 'Do accompanying parents or infants pay admission?',
                  answer: 'No. Accompanying parents and children under 2 enter completely free.'
                },
                {
                  id: 1,
                  index: '02',
                  question: 'What is included with each child pass?',
                  answer: 'Full access to all 5 play zones, stage shows, a fresh child lunch pack with juice, and unlimited sweet treats and waffles.'
                },
                {
                  id: 2,
                  index: '03',
                  question: 'What safety and perimeter measures are enforced?',
                  answer: '100% fenced grounds, paired security wristbands, and dedicated marshals stationing every water barrier and play zone.'
                }
              ].map((faq) => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div key={faq.id} className="transition-colors hover:bg-black/[0.015]">
                    <button
                      type="button"
                      onClick={() => {
                        soundscape.playMarimbaClick(isOpen ? 440 : 580, 0.04);
                        setExpandedFaq(isOpen ? null : faq.id);
                      }}
                      className="w-full py-5 sm:py-7 flex items-center justify-between gap-4 text-left cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                        <span className="font-mono text-xs sm:text-sm font-bold text-amber-600 tracking-widest shrink-0">
                          {faq.index}
                        </span>
                        <span className="font-kid font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-800 transition-colors">
                          {faq.question}
                        </span>
                      </div>

                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-[#E8E2D6] bg-white transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-amber-100 text-amber-900 border-amber-300' : 'text-slate-500'
                      }`}>
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="pb-5 pl-10 sm:pl-12 pr-4 sm:pr-8 animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
