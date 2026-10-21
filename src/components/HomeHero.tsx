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
  Check,
  Sparkles,
  Users,
  Coffee,
  HelpCircle,
  Copy,
  Minus,
  Plus,
  Phone
} from 'lucide-react';
import { SiteMap3DHandle } from './SiteMap3D';
import { Tooltip } from './Tooltip';
import { PROGRAMME_SESSIONS, SIBLING_DISCOUNTS } from '../data/festivalData';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig,
  SECTION_AMBIENT_GRADIENTS
} from '../data/sectionBackgrounds';
import { MulticolorTitle } from './MulticolorTitle';
import { SectionWaveDivider } from './SectionWaveDivider';

interface HomeHeroProps {
  onOpen3DMap: (zoneId?: string) => void;
  onOpenBooking: (childCount?: number) => void;
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
  const [bgConfig] = useState<SectionBackgroundConfig>(getStoredSectionBackgrounds);
  const [ticketChildCount, setTicketChildCount] = useState<number>(2);
  const [copiedEcoCash, setCopiedEcoCash] = useState<boolean>(false);
  const [previewSectorId, setPreviewSectorId] = useState<string>('little-garden');

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
      bannerBg: 'from-emerald-950 via-teal-950 to-slate-950',
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

  const activePreviewSector = zones.find(z => z.id === previewSectorId) || zones[0];

  return (
    <div className="space-y-14 sm:space-y-20 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION: Full-screen family festival imagery, covering whole bottom page on phones in cinematic reveal */}
      <section className="relative w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[580px] lg:min-h-[720px] flex items-center overflow-hidden border-b border-emerald-950/40">
        {/* Full-Bleed High-Resolution Panoramic Imagery with Cinematic Slow Zoom */}
        <img
          src="/bambino-farm.jpg"
          alt="Bambino World Festival Grounds at The Little Farm"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />

        {/* High-Contrast Editorial Scrim - strong dark scrim on mobile for instant legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60 sm:bg-gradient-to-r sm:from-slate-950/95 sm:via-slate-950/80 sm:to-slate-950/25" />
        <div className="absolute inset-0 bg-slate-950/30 sm:hidden" />

        {/* Dynamic morning meadow sunlit ambient bleed */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.hero }}
        />

        {/* Hero Content - vertically centered with staggered playful entrance animations */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20 flex flex-col justify-center">
          <div className="max-w-2xl space-y-3 sm:space-y-5">
            {/* 1st to appear: Friendly festival date sticker badge with hand-drawn sunbeam scribble */}
            <div className="relative inline-flex items-center self-start">
              <div className="sticker-badge animate-hero-badge px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-fluid-badge font-black tracking-wide shadow-md">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Saturday 5 December 2026 · 10am – 5pm</span>
              </div>
              {/* Whimsical hand-drawn animated sunbeam accent */}
              <svg
                aria-hidden="true"
                className="animate-sunbeam absolute -top-3.5 -right-5 w-7 h-7 text-amber-300 pointer-events-none drop-shadow-sm"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.5 2.5M16.5 16.5l2.5 2.5M5 19l2.5-2.5M16.5 7.5l2.5-2.5" />
              </svg>
            </div>

            {/* 2nd to appear: Dominant Headline with Playful Accents, Fluid Typography & Crayon Underline */}
            <h1 className="animate-hero-title text-fluid-display font-kid font-black tracking-normal leading-[1.08] text-white text-balance drop-shadow-xl break-words">
              Where <span className="kid-tilt-l kid-pastel-yellow">Little</span>{' '}
              <span className="kid-tilt-r kid-pastel-mint">Dreams</span> Come{' '}
              <span className="relative inline-block">
                <span className="kid-tilt-l kid-pastel-coral">Alive</span>
                {/* Whimsical hand-drawn animated crayon scribble underline */}
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 overflow-visible pointer-events-none"
                  viewBox="0 0 120 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3,9 C32,2 86,13 117,6"
                    stroke="#fbbf24"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    className="animate-crayon"
                  />
                </svg>
              </span>
              .
            </h1>

            {/* 3rd to appear: Short microcopy */}
            <p className="animate-hero-desc text-fluid-lead text-slate-200 max-w-xl leading-relaxed font-normal drop-shadow-sm">
              A day of play, discovery, and family memories across 4,000 m² of sunlit lawns at The Little Farm, Harare.
            </p>

            {/* 4th & 5th to appear: Book Pass button first, followed by Play Zones button */}
            <div className="flex flex-row items-center gap-2.5 pt-1 max-w-md">
              <button
                onClick={() => onOpenBooking(1)}
                className="animate-hero-cta1 flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black rounded-xl text-fluid-btn transition-all shadow-xl flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Book Pass ($25)</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <a
                href="#play-zones"
                className="animate-hero-cta2 flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-xl text-fluid-btn transition border border-white/20 backdrop-blur-md flex items-center justify-center gap-1.5 cursor-pointer shadow-lg whitespace-nowrap"
              >
                <span>Play Zones</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              </a>
            </div>

            {/* 6th to appear: Instant Venue & Inclusions Footnote */}
            <div className="animate-hero-note pt-1 flex items-center gap-2 text-fluid-xs text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>5 Richwell Ave, Meyrick Park · All 5 zones, lunch &amp; sweet treats included</span>
            </div>
          </div>
        </div>

        {/* Floating Explore Hint on Mobile - at bottom edge of cinematic cover */}
        <div className="absolute bottom-10 inset-x-0 sm:hidden flex flex-col items-center gap-1 text-slate-300/80 animate-bounce pointer-events-none text-[11px] font-semibold z-20">
          <span>Explore festival below</span>
          <ChevronDown className="w-4 h-4 text-amber-400" />
        </div>

        {/* Distinctive Date & Venue Stamp on Large Screens */}
        <div className="hidden lg:flex absolute bottom-14 right-12 z-20 w-32 h-32 rounded-full bg-amber-400 text-slate-950 font-black flex-col items-center justify-center text-center shadow-2xl border-4 border-slate-950 transform rotate-12 hover:scale-105 transition-transform select-none">
          <span className="text-[10px] uppercase tracking-widest font-bold">Harare</span>
          <span className="text-2xl font-kid font-black leading-none my-1">5 DEC</span>
          <span className="text-[11px] font-black text-slate-900 leading-none">2026</span>
        </div>

        {/* Layered Organic Wave Transition into the next section */}
        <SectionWaveDivider position="bottom" variant="dark-to-cream" height={40} className="absolute bottom-0 left-0 right-0 z-20" />
      </section>

      {/* 2. FESTIVAL HIGHLIGHTS STRIP: End-to-end full-bleed section touching both sides of viewport */}
      <section className="relative w-full overflow-hidden border-y border-amber-200/80 bg-gradient-to-br from-[#fffdf7] via-[#fefbf2] to-[#faf6ea] py-7 sm:py-9 shadow-xs">
        {/* Soft radial sunbeam ambient bleed */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.highlights }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Whimsical Header Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-4 px-0.5">
            <div className="sticker-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 text-slate-950 font-kid font-black text-xs sm:text-sm tracking-wide shadow-xs self-start">
              <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>Why Families Love Bambino World</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 font-kid tracking-wide">
              Tap any badge for details · All included with every pass
            </span>
          </div>

          {/* 6 Bouncy Festival Feature Badges - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              {
                icon: Baby,
                title: '6M – 12 Years',
                subtitle: 'Babies to Tweens',
                tilt: '-rotate-1',
                badgeBg: 'bg-amber-400 text-slate-950 shadow-xs',
                cardBg: 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-200/90 text-amber-950',
                tip: 'Dedicated age-segregated zones keep toddlers safe from active older children.'
              },
              {
                icon: Shield,
                title: '100% Supervised',
                subtitle: 'Trained Marshals',
                tilt: 'rotate-1.5',
                badgeBg: 'bg-emerald-500 text-white shadow-xs',
                cardBg: 'bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200/90 text-emerald-950',
                tip: 'Trained safety marshals, secure matching child wristbands, and fenced pond buffers.'
              },
              {
                icon: Utensils,
                title: 'Lunch & Sweets',
                subtitle: 'Meals & Treats',
                tilt: '-rotate-1.5',
                badgeBg: 'bg-sky-400 text-slate-950 shadow-xs',
                cardBg: 'bg-sky-50/90 hover:bg-sky-100/90 border-sky-200/90 text-sky-950',
                tip: 'Child lunch pack, juice box, plus unlimited candyfloss and warm waffles included.'
              },
              {
                icon: Sprout,
                title: '4,000 m² Lawns',
                subtitle: 'Sunlit Parkland',
                tilt: 'rotate-1',
                badgeBg: 'bg-lime-500 text-slate-950 shadow-xs',
                cardBg: 'bg-lime-50/90 hover:bg-lime-100/90 border-lime-200/90 text-lime-950',
                tip: 'Expansive private green parkland with mature shade trees and picnic pergolas.'
              },
              {
                icon: Car,
                title: 'Secure Parking',
                subtitle: 'Free & Marshaled',
                tilt: '-rotate-1',
                badgeBg: 'bg-purple-400 text-slate-950 shadow-xs',
                cardBg: 'bg-purple-50/90 hover:bg-purple-100/90 border-purple-200/90 text-purple-950',
                tip: 'Dedicated on-site marshaled parking with segregated pedestrian entry.'
              },
              {
                icon: MapPin,
                title: 'Meyrick Park',
                subtitle: 'Harare Enclave',
                tilt: 'rotate-1.5',
                badgeBg: 'bg-rose-400 text-slate-950 shadow-xs',
                cardBg: 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-200/90 text-rose-950',
                tip: '5 Richwell Ave, Harare · Safe residential enclave with paved access.'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Tooltip key={idx} content={item.tip} position="top" className="w-full">
                  <div
                    className={`group w-full min-h-[58px] sm:min-h-[68px] p-2 sm:p-2.5 rounded-2xl border-2 ${item.cardBg} ${item.tilt} hover:rotate-0 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 transition-all duration-200 ease-out cursor-pointer shadow-xs hover:shadow-md flex items-center gap-2 sm:gap-2.5 diorama-lift`}
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${item.badgeBg} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200`}>
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                    </div>
                    <div className="flex flex-col min-w-0 text-left flex-1 justify-center">
                      <span className="font-kid font-bold text-[11px] sm:text-xs lg:text-sm text-slate-900 leading-[1.15] break-words">
                        {item.title}
                      </span>
                      <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500 leading-tight mt-0.5 break-words">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Organic Wave Transition into Play Zones */}
        <SectionWaveDivider position="bottom" variant="cream-to-meadow" height={28} className="mt-4" />
      </section>

      {/* 3. PLAY ZONES: Full-width end-to-end section touching both sides of the viewport */}
      <section id="play-zones" className="relative w-full overflow-hidden border-y border-amber-950/40 py-12 sm:py-16 lg:py-20">
        {/* Section Photographic Background touching both edges */}
        <img
          src={bgConfig.playZonesSection}
          alt="Play Zones Grounds"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102"
        />
        {/* Soft warm gradient overlay for clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-amber-950/85 to-slate-950/98" />

        {/* Dynamic Midday Park Sunlit Ambient Bleed */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.playZones }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <MulticolorTitle
                text="Five Dedicated Play Zones"
                as="h2"
                className="text-fluid-h2 sm:text-fluid-h1 font-kid font-black tracking-wide drop-shadow-md break-words"
                bounceOnMount={true}
              />
              <p className="text-fluid-base text-slate-200 mt-1 font-medium">
                Curated by age so every child plays safely and joyfully.
              </p>
            </div>

            {/* Quick Zone Filter with Apple HIG 44px Touch Targets */}
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
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-fluid-btn font-bold transition active:scale-98 cursor-pointer flex items-center justify-center ${
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

          {/* Full-Bleed Visual Zone Cards */}
          <div className="space-y-6">
            {filteredZones.map(zone => (
              <div
                key={zone.id}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${zone.bannerBg} text-white shadow-xl border border-slate-800/80 min-h-[300px] sm:min-h-[340px] flex items-center diorama-lift`}
              >
                {/* Full Bleed Image Layer with rich natural color */}
                <img
                  src={zone.image}
                  alt={zone.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-95 scale-100 hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Soft Warm Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-transparent pointer-events-none" />

                <div className="relative z-10 w-full p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="max-w-2xl space-y-4">
                    {/* Age Badge */}
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-sm sticker-badge ${zone.tagColor}`}>
                        {zone.age}
                      </span>
                      <span className="text-fluid-xs text-slate-300 font-semibold">
                        The Little Farm Grounds
                      </span>
                    </div>

                    {/* Zone Title & 1-Sentence Headline */}
                    <div>
                      <MulticolorTitle
                        text={zone.name}
                        as="h3"
                        className="text-fluid-h3 sm:text-fluid-h2 font-kid font-black tracking-wide drop-shadow-md break-words"
                        bounceOnMount={false}
                      />
                      <p className="text-fluid-base text-slate-200 mt-1 font-medium leading-relaxed max-w-xl">
                        {zone.shortDesc}
                      </p>
                    </div>

                    {/* Clean, Uncluttered Feature Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {zone.features.slice(0, 3).map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/15 text-fluid-xs font-semibold text-slate-100 flex items-center gap-1.5 backdrop-blur-sm shadow-sm"
                        >
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{feat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear Actions - full width on phones, 48px touch targets */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0 pt-2 lg:pt-0 w-full lg:w-auto">
                    <button
                      onClick={() => {
                        onOpen3DMap(zone.id);
                      }}
                      className="w-full lg:w-44 min-h-[48px] py-3.5 px-4 bg-white/15 hover:bg-white/25 active:scale-98 text-white rounded-xl text-fluid-btn font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-white/20 backdrop-blur-md"
                    >
                      <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>View in 3D Map</span>
                    </button>

                    <button
                      onClick={() => onOpenBooking(1)}
                      className="w-full lg:w-44 min-h-[44px] py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 rounded-xl text-fluid-btn font-bold transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Book Pass</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider into Site Map */}
        <SectionWaveDivider position="bottom" variant="meadow-to-cream" height={32} className="mt-8" />
      </section>

      {/* 4. 3D SITE MAP: Responsive container with Split Live Sector Showcase */}
      <section id="site-map-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-fluid-h2 font-kid font-black text-slate-900 tracking-wide">
              See How The Grounds Will <span className="kid-tilt-l text-amber-500">Come Alive</span>
            </h2>
            <p className="text-fluid-base text-slate-600 mt-1 font-medium">
              Explore the 4,000 m² grounds, play zones, and pedestrian flow before arrival.
            </p>
          </div>
        </div>

        {/* 3D Festival World Portal - Split interactive layout filling the entire card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-900 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 p-6 sm:p-8 lg:p-10 text-white">
          {/* Decorative ambient glowing lights */}
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-10">
            {/* Left Column: Spatial 3D Introduction, Sector Selector & Launch Action */}
            <div className="flex-1 flex flex-col justify-between space-y-6 max-w-xl">
              <div className="space-y-3">
                <span className="sticker-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-kid font-bold text-fluid-badge uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time 3D Digital Twin</span>
                </span>
                <h3 className="text-fluid-h3 sm:text-fluid-h2 font-kid font-black text-white leading-tight">
                  Explore All 4,000 m² in Spatial 3D
                </h3>
                <p className="text-fluid-xs sm:text-fluid-sm text-slate-300 font-medium leading-relaxed">
                  Fly through every sector, inspect safety barriers, view where shade pergolas sit, and follow the family pedestrian flow before arrival.
                </p>
              </div>

              {/* Direct Sector Flights Selector Tabs */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <span>Direct Sector Flights:</span>
                  <span className="text-[11px] text-slate-400 font-normal">Click to preview</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'little-garden', label: 'The Little Garden', emoji: '👶', sub: '6M–2Y' },
                    { id: 'adventure-zone', label: 'Adventure Zone', emoji: '🏰', sub: '3–6Y' },
                    { id: 'creative-zone', label: 'Creative Studio', emoji: '🎨', sub: 'Art & Crafts' },
                    { id: 'discovery-world', label: 'Discovery STEM', emoji: '🚀', sub: 'Inventions' },
                    { id: 'celebration-stage', label: 'Celebration Stage', emoji: '🎵', sub: 'Live Shows' }
                  ].map(sec => {
                    const isSelected = previewSectorId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setPreviewSectorId(sec.id)}
                        className={`min-h-[44px] p-2 rounded-xl text-left transition flex items-center gap-2 cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md scale-102'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/15 active:scale-98'
                        }`}
                      >
                        <span className="text-lg shrink-0">{sec.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate leading-tight">{sec.label}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-slate-800 font-semibold' : 'text-slate-300'}`}>
                            {sec.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trust and Key Ground Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-[11px] font-semibold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-sm font-bold">✓</span>
                  <span>4,000 m² Lawns</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-sm font-bold">✓</span>
                  <span>Fenced Waters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-sm font-bold">✓</span>
                  <span>100% Supervised</span>
                </div>
              </div>

              {/* Primary CTA Flight Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpen3DMap(activePreviewSector.id)}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-kid font-black text-sm sm:text-base rounded-xl transition flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Launch 3D Flight into {activePreviewSector.name} &rarr;</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Sector Showcase Card (Fills the entire right side!) */}
            <div className="flex-1 w-full lg:max-w-lg flex flex-col justify-between">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 group min-h-[340px] sm:min-h-[380px] flex flex-col justify-between p-5 text-white diorama-lift diorama-shadow">
                {/* Full-bleed active sector photo */}
                <img
                  src={activePreviewSector.image}
                  alt={activePreviewSector.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-950/30 pointer-events-none" />

                {/* Top badges on preview card */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-amber-300">
                    📍 Live Sector Preview
                  </span>
                  <span className={`sticker-badge text-[11px] font-kid font-black uppercase px-3 py-1 shadow-md ${activePreviewSector.tagColor}`}>
                    {activePreviewSector.age}
                  </span>
                </div>

                {/* Bottom details on preview card */}
                <div className="relative z-10 space-y-3 pt-12">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-kid font-black text-white drop-shadow-md">
                      {activePreviewSector.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2 font-medium leading-relaxed">
                      {activePreviewSector.shortDesc}
                    </p>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activePreviewSector.features.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15 flex items-center gap-1 shadow-xs"
                      >
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{feat.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* Fly-to direct button */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen3DMap(activePreviewSector.id)}
                      className="flex-1 min-h-[42px] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                    >
                      <span>Fly to this Sector in 3D</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectZone(activePreviewSector.id)}
                      className="min-h-[42px] px-3.5 py-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold rounded-xl text-xs transition border border-white/20 cursor-pointer backdrop-blur-md"
                      title="Inspect zone details"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE LITTLE FARM: Full-width scenic imagery, location, safety, and directions */}
      <section id="the-little-farm" className="relative w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] flex items-center overflow-hidden border-y border-emerald-950/40">
        <img
          src="/bambino-farm.jpg"
          alt="The Little Farm Grounds Aerial View"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/98 via-slate-950/80 to-slate-950/40" />

        {/* Dynamic Afternoon Farm Ambient Bleed */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.farm }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white">
          <div className="max-w-2xl space-y-5">
            <h2 className="text-fluid-display font-kid font-black leading-tight drop-shadow-md break-words">
              The Little Farm, <span className="kid-tilt-l kid-pastel-yellow">Meyrick Park</span>
            </h2>

            <p className="text-fluid-base text-slate-200 leading-relaxed font-medium">
              4,000 m² of secure open grass lawns, shade pergolas, and purpose-built family amenities at 5 Richwell Ave, Mabelreign, Harare.
            </p>

            {/* Safety highlights with fluid typography */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {[
                { title: 'Fenced Waters', tip: 'Wire-fenced pond and spear-picket barrier around pool area' },
                { title: 'Shaded Lawns', tip: 'Mature trees, shade pergolas and outdoor picnic benches' },
                { title: 'Clean Restrooms', tip: 'Regularly sanitized flush toilets and infant change room' },
                { title: 'Child Wristbands', tip: 'Parent contact matching wristband provided upon arrival' },
                { title: 'Separate Exit', tip: 'One-way boom gate vehicle exit keeps child paths car-free' },
                { title: 'First Aid Post', tip: 'Dedicated certified first aid tent on site throughout' }
              ].map((item, idx) => (
                <Tooltip key={idx} content={item.tip} position="top" className="w-full">
                  <div className="min-h-[42px] flex items-center gap-2 p-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-fluid-xs font-semibold text-slate-100 cursor-pointer w-full">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                </Tooltip>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-5 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => onOpenBooking(1)}
                className="min-h-[44px] px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-md cursor-pointer flex items-center justify-center"
              >
                Book Pass ($25)
              </button>
            </div>
          </div>
        </div>

        {/* Organic Wave Transition into Programme */}
        <SectionWaveDivider position="bottom" variant="meadow-to-amber" height={34} className="absolute bottom-0 left-0 right-0 z-20" />
      </section>

      {/* 6. PROGRAMME: Full-width end-to-end section touching both sides of the viewport */}
      <section id="programme" className="relative w-full overflow-hidden border-y border-emerald-950/40 py-12 sm:py-16 lg:py-20">
        {/* Section Photographic Background touching both edges */}
        <img
          src={bgConfig.programmeSection}
          alt="Event Programme Stage Backdrop"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102"
        />
        {/* Soft warm gradient overlay for clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-amber-950/85 to-emerald-950/92" />

        {/* Dynamic Golden Hour Programme Ambient Bleed */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: SECTION_AMBIENT_GRADIENTS.programme }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <h2 className="text-fluid-h2 font-kid font-black text-white tracking-wide drop-shadow-md break-words">
                Event <span className="kid-tilt-l text-amber-400">Programme</span>
              </h2>
              <p className="text-fluid-base text-slate-200 mt-1 font-medium">
                Saturday 5 December 2026 · 10:00 AM – 5:00 PM CAT.
              </p>
            </div>

            {/* Zone filter with 44px min touch targets */}
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
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-fluid-btn font-bold transition active:scale-98 cursor-pointer flex items-center justify-center ${
                    activeProgZone === f.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Programme Timeline Cards with Frosted Glassmorphic Styling and Diorama Lift */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSchedule.slice(0, 9).map((session) => (
              <div
                key={session.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-amber-400/50 shadow-md transition space-y-2.5 flex flex-col justify-between text-white diorama-lift"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5 text-fluid-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{session.start} – {session.end}</span>
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/20 sticker-badge">
                      {session.zoneName}
                    </span>
                  </div>
                  <h4 className="text-fluid-base font-bold text-white leading-snug drop-shadow-xs break-words">
                    {session.title}
                  </h4>
                  {session.description && (
                    <p className="text-fluid-xs text-slate-200 line-clamp-2">
                      {session.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-fluid-xs text-slate-300">
                  <span>{session.age || 'All Ages'}</span>
                  <span className="font-semibold text-emerald-300">Included in Pass</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider into Tickets */}
        <SectionWaveDivider position="bottom" variant="amber-to-cream" height={32} className="mt-8" />
      </section>

      {/* 7. TICKETS & "WHAT PARENTS NEED TO KNOW": Transparent pricing, inclusions, and parent trust */}
      <section id="tickets" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Ticket Tier Cards */}
        <div className="bg-[#f7f5ed] border border-slate-300/80 rounded-3xl p-5 sm:p-8 lg:p-10 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-fluid-h2 font-kid font-black text-slate-900 tracking-wide">
              Simple, Transparent <span className="kid-tilt-l text-emerald-600">Tickets</span>
            </h2>
            <p className="text-fluid-base text-slate-600 font-medium">
              Every child pass includes all play zones, meals, and sweet treats. Parents enter free.
            </p>
          </div>

          {/* Interactive Child Pass Slider & Live Sibling Calculator */}
          <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-md max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-fluid-badge font-bold text-emerald-700 uppercase tracking-wider block">
                  Family Ticket Calculator
                </span>
                <h3 className="text-fluid-h3 font-kid font-black text-slate-900">
                  Select Number of Children
                </h3>
                <p className="text-fluid-xs text-slate-500 font-medium">
                  Automatic progressive sibling discount applied per child added.
                </p>
              </div>

              {/* Number stepper with Apple HIG 44px touch targets */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTicketChildCount(Math.max(1, ticketChildCount - 1))}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-lg flex items-center justify-center cursor-pointer transition shadow-2xs"
                  aria-label="Decrease children"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-16 text-center">
                  <span className="font-kid font-black text-2xl text-slate-900 leading-none block">
                    {ticketChildCount}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 leading-none">
                    {ticketChildCount === 1 ? 'Child' : 'Children'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTicketChildCount(Math.min(6, ticketChildCount + 1))}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-lg flex items-center justify-center cursor-pointer transition shadow-2xs"
                  aria-label="Increase children"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>1 Child ($25)</span>
                <span>2 Siblings ($45)</span>
                <span>3 Siblings ($60)</span>
                <span>4 Siblings ($70)</span>
                <span>5+ ($20 ea)</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={ticketChildCount}
                onChange={e => setTicketChildCount(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                aria-label="Number of children slider"
              />
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 font-semibold">Quick select:</span>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setTicketChildCount(n)}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer ${
                      ticketChildCount === n
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {n} {n === 1 ? 'Child' : 'Children'}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculation & EcoCash Shortcode Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Calculated Pass Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {ticketChildCount === 1 ? 'Single Child Pass' : `${ticketChildCount} Children Sibling Pass`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-200/80 text-emerald-950">
                      Save ${calculatedSavings}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-kid font-black text-slate-900">
                      ${calculatedPassAmount}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">
                      total (${calculatedPerChild} / child)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    Gate standard price would be ${standardFullPrice}. You save <strong>${calculatedSavings}</strong> with early bird &amp; sibling rates.
                  </p>
                </div>

                <ul className="text-xs space-y-1.5 text-slate-700 font-medium border-t border-emerald-200/60 pt-3">
                  <li className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{ticketChildCount} child wristband(s) with parent contact matching</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{ticketChildCount} lunch pack(s) &amp; fruit juice included</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Unlimited candyfloss &amp; waffles for all {ticketChildCount} kids</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Free entry for all accompanying adults &amp; babies under 2</span>
                  </li>
                </ul>

                <button
                  onClick={() => onOpenBooking(ticketChildCount)}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold rounded-xl text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book {ticketChildCount === 1 ? 'Pass' : `${ticketChildCount} Passes`} (${calculatedPassAmount})</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

              {/* EcoCash Payment Box with Dynamic Shortcode */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-300/80 flex flex-col justify-between space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1">
                      <span>📱</span> EcoCash USSD Payment
                    </span>
                    <span className="text-[11px] font-bold bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded-full">
                      ${calculatedPassAmount} Total
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 font-medium">
                    Shortcode automatically calculates for <strong>{ticketChildCount} {ticketChildCount === 1 ? 'child' : 'children'}</strong>:
                  </p>
                </div>

                {/* USSD Code Display with Copy & Dial */}
                <div className="p-3 bg-white border border-amber-300 rounded-xl space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Instant USSD Shortcode
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-700">
                      Merchant: 0779 140 417
                    </span>
                  </div>

                  <code className="block font-mono font-black text-base sm:text-lg text-slate-900 select-all tracking-wide break-all bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200">
                    {calculatedEcoCashCode}
                  </code>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyEcoCash}
                      className="flex-1 min-h-[38px] px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                    >
                      {copiedEcoCash ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEcoCash ? 'Code Copied!' : 'Copy Code'}</span>
                    </button>
                    <a
                      href={`tel:*151*1*1*0779140417*${calculatedPassAmount}%23`}
                      className="min-h-[38px] px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Dial</span>
                    </a>
                  </div>
                </div>

                <div className="text-[11px] text-amber-950 space-y-1 leading-relaxed">
                  <div>
                    Dial shortcode directly or send <strong>${calculatedPassAmount}</strong> via EcoCash to <strong>0779 140 417</strong> (*151# &rarr; Send Money).
                  </div>
                  <div className="text-slate-500 font-medium">
                    USD Cash also accepted upon arrival at the main welcome gate.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Grid - stacks single column on phones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Recommended Single Child Pass */}
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md flex flex-col justify-between space-y-4 relative order-first md:order-none">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Single Child</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-kid font-black text-slate-900">$25</span>
                  <span className="text-xs sm:text-sm text-slate-400">/ child</span>
                </div>
                <p className="text-base sm:text-sm text-slate-600 font-medium">
                  Early Bird rate until 30 November ($30 standard).
                </p>
              </div>
              <ul className="text-sm space-y-2 text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> All 5 Play Zones
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> Child Lunch Pack &amp; Juice
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> Unlimited Candyfloss &amp; Waffles
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> Free Adults &amp; Babies under 2
                </li>
              </ul>
              <button
                onClick={() => onOpenBooking(1)}
                className="w-full min-h-[44px] py-2.5 px-5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold rounded-xl text-sm transition shadow-md cursor-pointer flex items-center justify-center"
              >
                Book Pass ($25)
              </button>
            </div>

            {/* Two Siblings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Two Siblings</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-kid font-black text-slate-900">$45</span>
                  <span className="text-xs sm:text-sm text-slate-400">total ($22.50 ea)</span>
                </div>
                <p className="text-base sm:text-sm text-slate-600 font-medium">
                  Automatic $5 discount for families with 2 children.
                </p>
              </div>
              <ul className="text-sm space-y-2 text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> 2 Child Passes Included
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> 2 Fresh Lunch Packs
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> Unlimited Sweets Both Kids
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> Accompanying Parents Free
                </li>
              </ul>
              <button
                onClick={() => onOpenBooking(2)}
                className="w-full min-h-[44px] py-2.5 px-5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center"
              >
                Book 2 Passes ($45)
              </button>
            </div>

            {/* 3+ Siblings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3+ Siblings Pass</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-kid font-black text-slate-900">$60</span>
                  <span className="text-xs sm:text-sm text-slate-400">for 3 kids</span>
                </div>
                <p className="text-base sm:text-sm text-slate-600 font-medium">
                  $15 sibling savings ($70 for 4 children).
                </p>
              </div>
              <ul className="text-sm space-y-2 text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> 3+ Child Passes Included
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> Full Inclusions for Each Child
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> Unlimited Sweets
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 shrink-0" /> All Family Adults Free
                </li>
              </ul>
              <button
                onClick={() => onOpenBooking(3)}
                className="w-full min-h-[44px] py-2.5 px-5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center"
              >
                Book Sibling Pass
              </button>
            </div>
          </div>

          {/* Ticket Inclusions Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 text-center">
              What Every Pass Includes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { icon: Utensils, label: 'Meal & Juice', tip: 'Fresh child lunch pack & chilled fruit juice box' },
                { icon: Award, label: 'Unlimited Sweets', tip: 'Unlimited freshly spun candyfloss & artisan waffles' },
                { icon: Music, label: 'Live Concerts', tip: 'Acoustic Zimbabwean marimba, comedy clown & puppet show' },
                { icon: Palette, label: 'Face Paint & Art', tip: 'Glitter tattoos, washable easel art & bracelets' },
                { icon: Castle, label: 'All Play Zones', tip: '5 age-graded zones including arts, bounce castles & lawn sports' },
                { icon: Shield, label: 'Explorer Medal', tip: 'Official Bambino Explorer Passport & take-home plant pot' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Tooltip key={idx} content={item.tip} position="top" className="w-full">
                    <div className="min-h-[50px] bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center gap-1.5 cursor-pointer hover:border-emerald-500 hover:shadow-xs active:bg-slate-50 transition w-full">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
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

        {/* "What parents need to know" clean icon cards & tap-to-reveal tooltips */}
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-fluid-h2 font-kid font-black text-slate-900 tracking-wide">
              What Parents <span className="kid-tilt-l text-emerald-600">Need to Know</span>
            </h3>
            <p className="text-fluid-base text-slate-600 mt-1 font-medium">
              Everything you need for an easy, stress-free family day out.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
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
                  <div className="min-h-[140px] bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-500 active:bg-slate-50 transition cursor-pointer space-y-2 flex flex-col justify-between w-full h-full text-left">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-base text-slate-900">{card.title}</h4>
                      <p className="text-base sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {card.desc}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm text-emerald-700 font-semibold pt-1 flex items-center gap-1">
                      <span>Tap or hover for parent details</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
