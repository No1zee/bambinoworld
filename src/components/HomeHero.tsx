import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Plus,
  Minus,
  MapPin,
  Calendar,
  Compass,
  Sparkles,
  Baby,
  BookOpen,
  ToyBrick,
  Castle,
  Rocket,
  Shield,
  Palette,
  Music,
  FlaskConical,
  ExternalLink,
  Car,
  Clock,
  Heart,
  HelpCircle,
  Copy,
  Ticket
} from 'lucide-react';
import { SiteMap3DHandle } from './SiteMap3D';
import { FarmHotspotsCanvas } from './FarmHotspotsCanvas';
import { PROGRAMME_SESSIONS, SIBLING_DISCOUNTS } from '../data/festivalData';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig
} from '../data/sectionBackgrounds';
import { soundscape } from '../utils/soundscape';

interface HomeHeroProps {
  onOpen3DMap: (zoneId?: string) => void;
  onOpenBooking: (childCount?: number) => void;
  onSelectZone: (zoneId: string) => void;
  siteMapRef: React.RefObject<SiteMap3DHandle | null>;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpen3DMap,
  onOpenBooking,
  onSelectZone
}) => {
  const [expandedSector, setExpandedSector] = useState<string | null>('little-garden');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
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

  const sectors = [
    {
      id: 'little-garden',
      number: '01',
      name: 'The Little Garden',
      age: '6M – 2Y',
      tagline: 'Calm sensory sanctuary with soft play foam blocks and shaded bougainvillea pergolas.',
      image: bgConfig.zoneCards['little-garden'] || '/little-garden.jpg',
      color: 'bg-[#00A3E0]',
      features: [
        { label: 'Soft Play Foam', tip: 'Cushioned crawling blocks, wedges and tumble mats' },
        { label: 'Story Pergola', tip: 'Gentle storybook readings under bougainvillea shade' },
        { label: 'Foam Ball Pit', tip: 'Clean, sanitized soft foam play pit for tiny explorers' }
      ]
    },
    {
      id: 'adventure-zone',
      number: '02',
      name: 'Adventure Arena',
      age: '3 – 6Y',
      tagline: 'High-energy timber obstacle courses, low rope balance paths, and giant bouncy slides.',
      image: bgConfig.zoneCards['adventure-zone'],
      color: 'bg-[#FF6720]',
      features: [
        { label: 'Timber Obstacles', tip: 'All-natural eucalyptus timber climbing course' },
        { label: 'Bouncy Slides', tip: 'Monitored inflatable slides with safety crash pads' },
        { label: 'Mini Zipline', tip: 'Low-slung toddler zipline with double spotters' }
      ]
    },
    {
      id: 'creative-zone',
      number: '03',
      name: 'Creative Corner',
      age: 'All Ages',
      tagline: 'Open-air craft studio with pottery clay, giant communal easels, and natural dyes.',
      image: bgConfig.zoneCards['creative-zone'],
      color: 'bg-[#D82374]',
      features: [
        { label: 'Clay Sculpting', tip: 'Non-toxic pottery clay modeling stations' },
        { label: 'Nature Collages', tip: 'Botanical leaf and petal crafts on canvas' },
        { label: 'Giant Easels', tip: 'Finger painting with washable organic paints' }
      ]
    },
    {
      id: 'discovery-world',
      number: '04',
      name: 'Discovery World',
      age: 'All Ages',
      tagline: 'Hands-on sensory exploration with water locks, bubble physics, and safe science benches.',
      image: bgConfig.zoneCards['discovery-world'],
      color: 'bg-[#00A3E0]',
      features: [
        { label: 'Giant Bubble Lab', tip: 'Giant bubble wands and surface tension experiments' },
        { label: 'Sensory Water Ways', tip: 'Water mills and natural hydraulic lock gates' },
        { label: 'Nature Microscopes', tip: 'Kid-safe optical magnifiers for leaves and minerals' }
      ]
    },
    {
      id: 'celebration-stage',
      number: '05',
      name: 'Celebration Stage',
      age: 'Family',
      tagline: 'Shaded acoustic amphitheater featuring puppet theatre, marimba beats, and interactive storytelling.',
      image: bgConfig.zoneCards['celebration-stage'],
      color: 'bg-[#31006F]',
      features: [
        { label: 'Puppet Theatre', tip: 'Interactive folk tale performances with animal puppets' },
        { label: 'Live Marimba Beats', tip: 'Acoustic youth percussion ensemble and drum circles' },
        { label: 'Family Singalong', tip: 'Gentle acoustic singalongs on picnic lawn blankets' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'Do parents or babies have to pay to come along?',
      a: 'Not a single cent. Accompanying parents and babies under 2 enter completely free. We believe family days should bring everyone together without multiplying the bill. Sit under the shaded bougainvillea, sip an iced drink, and enjoy the day—your child’s $25 Early Bird pass covers the full experience.'
    },
    {
      q: 'Will I be nagged to buy tokens or extra tickets once inside?',
      a: 'Never. One pass covers literally everything for the entire day. All five play zones, giant bouncy obstacle courses, animal petting cuddles, science labs, puppet theater, warm farm lunch, chilled juices, and afternoon ice cream treats are 100% included. Leave your wallet in your bag and just enjoy watching them play.'
    },
    {
      q: 'How can I be certain my child is safe and won’t wander off?',
      a: 'Your peace of mind is our highest priority. The Little Farm is completely surrounded by a secure perimeter fence with a single gated entry/exit checkpoint. Upon arrival, you and your child receive matching security wristbands (no child is permitted to leave without their registered adult). Trained early-childhood marshals supervise every station, and a certified paediatric nurse is on-site all day.'
    },
    {
      q: 'What if my baby gets fussy or needs a quiet place to nurse?',
      a: 'We designed Bambino World with real parenting in mind. Inside The Little Garden, you will find a serene, private Mother & Baby Sanctuary equipped with comfortable nursing chairs, electric bottle-warming stations, sanitized changing tables, and quiet shaded glades away from the music. Take all the time you need to recharge.'
    },
    {
      q: 'Can I pay with EcoCash right now?',
      a: 'Yes, in seconds. We support instant EcoCash checkout with immediate confirmation, as well as Visa, Mastercard, and cash reserve options. Early bird passes are just $25 online (gate admission on the day is $30, and venue capacity is strictly capped to prevent overcrowding).'
    }
  ];

  return (
    <div className="w-full bg-white text-slate-900 font-sans">
      
      {/* =========================================================================
          1. THOMPSON SIGNATURE INTERLOCKING BENTO MOSAIC HERO GRID
          (Exact reverse-engineered structure from https://www.thompsoncff.org/)
          ========================================================================= */}
      <section className="w-full overflow-hidden border-b border-slate-200">
        
        {/* ROW 1: Left Photo (28%) + Right Royal Purple Block (72%) */}
        <div className="flex flex-col md:flex-row w-full min-h-[340px] md:min-h-[400px]">
          <div className="w-full md:w-[28%] relative overflow-hidden bg-slate-900 min-h-[260px] md:min-h-[400px]">
            <img
              src="/little-garden.jpg"
              alt="Happy children outdoor play at Bambino World"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="w-full md:w-[72%] bg-[#31006F] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 max-w-3xl">
              <h1 className="font-poppins font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white">
                give them the childhood you remember.
              </h1>
              <p className="text-white/85 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl pt-2">
                Real grass under tiny toes, messy ice-cream giggles, and zero screens. A magical, sun-drenched Saturday crafted for your child’s pure wonder—and your total peace of mind.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4 justify-between border-t border-white/15 mt-8">
              <div className="text-xs sm:text-sm font-poppins font-semibold text-white/90">
                <span>All 5 play zones, hot lunch &amp; sweet treats included</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundscape.playMarimbaClick(700, 0.08);
                    onOpenBooking(1);
                  }}
                  className="bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Pass ($25)</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Left Deep Indigo Block (72%) + Right Photo with Angled Badge (28%) */}
        <div className="flex flex-col-reverse md:flex-row w-full min-h-[320px] md:min-h-[380px]">
          <div className="w-full md:w-[72%] bg-[#240052] text-white p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-3 max-w-xl">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-white">
                a day where mom actually gets to relax.
              </h2>
              <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed">
                100% securely gated perimeter, certified paediatric nurses on standby, and loving early-childhood marshals at every play station. Sip your coffee under the bougainvillea while they play safely.
              </p>
            </div>

            {/* Circular Thompson-Style Accent Stamp */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-[#F6BE00]/60 flex flex-col items-center justify-center text-center p-2 bg-[#1a003b]/60">
              <span className="font-poppins font-black text-lg sm:text-xl text-[#F6BE00] leading-none">
                DEC 5
              </span>
              <span className="font-poppins font-bold text-[10px] tracking-widest uppercase text-white/90 mt-1">
                HARARE
              </span>
            </div>
          </div>

          <div className="w-full md:w-[28%] relative overflow-hidden bg-slate-900 min-h-[240px] md:min-h-[380px]">
            <img
              src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1200&q=80"
              alt="Toddlers playing safely at The Little Farm"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            {/* Angled Thompson Tag Badge */}
            <div className="absolute bottom-4 right-4 bg-[#31006F] text-white px-3.5 py-1.5 font-poppins font-black text-xs uppercase tracking-wider shadow-lg">
              Early Bird
            </div>
          </div>
        </div>

        {/* ROW 3: Left Photo (28%) + Right Tangerine Orange Block (72%) */}
        <div className="flex flex-col md:flex-row w-full min-h-[260px] md:min-h-[320px]">
          <div className="w-full md:w-[28%] relative overflow-hidden bg-slate-900 min-h-[220px] md:min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80"
              alt="Artistic discovery and child creativity"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-[72%] bg-[#FF6720] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-white">
                unplugged joy that lights up their eyes.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                soundscape.playMarimbaClick(560, 0.06);
                onOpen3DMap();
              }}
              className="bg-[#31006F] hover:bg-[#250058] active:scale-95 text-white font-poppins font-black px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-[#F6BE00]" />
              <span>Explore 3D Grounds ↗</span>
            </button>
          </div>
        </div>

        {/* ROW 4: Left Sky Blue Block (72%) + Right Photo (28%) */}
        <div className="flex flex-col-reverse md:flex-row w-full min-h-[260px] md:min-h-[320px]">
          <div className="w-full md:w-[72%] bg-[#00A3E0] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-white">
                all 5 zones, lunch &amp; sweet treats included.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                soundscape.playMarimbaClick(600, 0.06);
                const el = document.getElementById('programme');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#D82374] hover:bg-[#b8185f] active:scale-95 text-white font-poppins font-black px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>View Programme →</span>
            </button>
          </div>

          <div className="w-full md:w-[28%] relative overflow-hidden bg-slate-900 min-h-[220px] md:min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1200&q=80"
              alt="Children enjoying sensory science experiments"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        </div>

      </section>


      {/* =========================================================================
          2. THOMPSON 3 SATURATED CATEGORY FEATURE CARDS
          (Exact reverse-engineered layout from Section 4 of https://www.thompsoncff.org/)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAF9F5] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-poppins font-black text-3xl sm:text-4xl lg:text-5xl text-[#31006F] tracking-tight">
              finally, a festival built with real moms in mind.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              We got tired of chaotic, dusty events with broken toys, filthy bathrooms, and hidden fees. Bambino World is Harare’s premier sanctuary of joyful outdoor play, spotless facilities, and unhurried family connection.
            </p>
          </div>

          {/* 3 Thompson Cards (Top Photo + Saturated Solid Color Box) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Sky Blue (#00A3E0) */}
            <div className="flex flex-col overflow-hidden shadow-lg transition-transform hover:-translate-y-1.5 duration-300">
              <div className="h-64 sm:h-72 overflow-hidden bg-slate-800">
                <img
                  src="/little-garden.jpg"
                  alt="The Little Garden"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#00A3E0] text-white p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-poppins font-black text-3xl tracking-tight leading-snug">
                    the little garden (6m – 2y)
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                    A gentle, shoe-free sensory haven for babies and toddlers. Cushioned foam crawl zones, tactile discovery mats, and a private nursing sanctuary with bottle warmers &amp; fresh diaper stations.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectZone('little-garden')}
                    className="w-full bg-[#31006F] hover:bg-[#240052] active:scale-95 text-white font-poppins font-black py-3.5 px-6 text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer"
                  >
                    Explore Zone
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Tangerine Orange (#FF6720) */}
            <div className="flex flex-col overflow-hidden shadow-lg transition-transform hover:-translate-y-1.5 duration-300">
              <div className="h-64 sm:h-72 overflow-hidden bg-slate-800">
                <img
                  src={bgConfig.zoneCards['adventure-zone']}
                  alt="Adventure Arena"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#FF6720] text-white p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-poppins font-black text-3xl tracking-tight leading-snug">
                    adventure arena (3 – 12y)
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                    Boundless energy, safely channeled. Supervised obstacle courses, bouncy castles, junior tractor rides, and lawn games where trained marshals guide and protect every jump.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectZone('adventure-zone')}
                    className="w-full bg-[#31006F] hover:bg-[#240052] active:scale-95 text-white font-poppins font-black py-3.5 px-6 text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer"
                  >
                    Explore Zone
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Magenta / Berry (#D82374) */}
            <div className="flex flex-col overflow-hidden shadow-lg transition-transform hover:-translate-y-1.5 duration-300">
              <div className="h-64 sm:h-72 overflow-hidden bg-slate-800">
                <img
                  src={bgConfig.zoneCards['creative-zone']}
                  alt="Creative & Discovery"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#D82374] text-white p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-poppins font-black text-3xl tracking-tight leading-snug">
                    creative &amp; discovery
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                    Spark their curious imagination with non-toxic pottery clay, giant communal easels, sweet farm animal cuddles, and magical puppet theater that captures their hearts.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectZone('creative-zone')}
                    className="w-full bg-[#31006F] hover:bg-[#240052] active:scale-95 text-white font-poppins font-black py-3.5 px-6 text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer"
                  >
                    Explore Zone
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          3. THOMPSON LEADER STATS: "Transforming How Families Gather"
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl lg:text-5xl text-[#31006F] leading-tight tracking-tight">
                crafted by parents, for parents who want better.
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                From our dedicated Mother & Baby sanctuary with clean bottle warmers to safety marshals at every bouncy obstacle, every single detail was designed so you never have to worry, hover, or stress.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <span className="font-poppins font-black text-4xl text-[#FF6720] block">5</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Curated Age Zones
                </span>
              </div>

              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <span className="font-poppins font-black text-4xl text-[#31006F] block">10+</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Farm Activities
                </span>
              </div>

              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <span className="font-poppins font-black text-4xl text-[#2F532E] block">100%</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Gated &amp; Secured
                </span>
              </div>

              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <span className="font-poppins font-black text-4xl text-[#D82374] block">0</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Zero Hidden Fees
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          4. THOMPSON "COMMUNITIES WE SERVE / SECTORS WE FEATURE" WITH PLUS EXPANSION
          (Exact reverse-engineered layout from Section 3 of https://www.thompsoncff.org/)
          ========================================================================= */}
      <section id="sectors-feature" className="relative w-full py-24 sm:py-32 bg-slate-950 overflow-hidden text-white border-b border-slate-800">
        {/* Full-bleed background photo with deep purple duotone overlay */}
        <img
          src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=2000&q=80"
          alt="Lush parkland at The Little Farm"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#240052]/90 via-[#31006F]/80 to-[#240052]/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Heading */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
                crafted for your peace of mind.
              </h2>
              <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed">
                Every square meter of The Little Farm is engineered so you never have to hover, worry, or play bodyguard.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onOpen3DMap()}
                  className="bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black px-7 py-3.5 text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Inspect Grounds in 3D</span>
                </button>
              </div>
            </div>

            {/* Right Column: Stack of Thompson Plus Rows */}
            <div className="lg:col-span-7 divide-y divide-white/20 border-y border-white/20">
              {sectors.map((sec) => {
                const isExpanded = expandedSector === sec.id;
                return (
                  <div key={sec.id} className="py-5 sm:py-6 transition-colors">
                    <button
                      type="button"
                      onClick={() => {
                        soundscape.playMarimbaClick(480, 0.04);
                        setExpandedSector(isExpanded ? null : sec.id);
                      }}
                      className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FF6720] text-white flex items-center justify-center font-bold text-lg transition-colors shrink-0">
                          {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                        <span className="font-poppins font-black text-xl sm:text-2xl text-white group-hover:text-[#F6BE00] transition-colors tracking-tight">
                          {sec.name}
                        </span>
                      </div>
                      <span className="font-poppins font-bold text-xs uppercase tracking-wider text-white/70 px-3 py-1 rounded-full bg-white/10 shrink-0">
                        {sec.age}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="pt-4 pl-12 space-y-4 animate-in fade-in duration-200">
                        <p className="text-white/85 text-sm sm:text-base leading-relaxed font-normal">
                          {sec.tagline}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {sec.features.map((feat) => (
                            <span
                              key={feat.label}
                              className="text-xs font-poppins font-bold bg-white/15 text-white px-3 py-1 rounded-sm"
                            >
                              {feat.label}
                            </span>
                          ))}
                        </div>
                        <div className="pt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              soundscape.playMarimbaClick(620, 0.05);
                              onOpen3DMap(sec.id);
                            }}
                            className="bg-[#00A3E0] hover:bg-[#008fca] active:scale-95 text-white font-poppins font-black px-5 py-2 text-xs uppercase tracking-wider transition cursor-pointer"
                          >
                            Fly in 3D ↗
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectZone(sec.id)}
                            className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-poppins font-bold px-4 py-2 text-xs uppercase tracking-wider transition cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          5. THOMPSON "WHAT'S GOING ON?" EVENT PROGRAMME SCHEDULE
          (Exact reverse-engineered layout from Section 5 of https://www.thompsoncff.org/)
          ========================================================================= */}
      <section id="programme" className="py-24 sm:py-32 bg-[#31006F] text-white border-b border-[#240052]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/20 pb-8">
            <div className="space-y-3">
              <h2 className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none">
                a day of smiles from 10am to 5pm.
              </h2>
              <p className="text-white/80 text-base sm:text-lg font-normal">
                Stay up to date with Bambino World related events &amp; stage showtimes.
              </p>
            </div>
            <div className="text-xs font-poppins font-bold text-white/90 bg-white/10 px-4 py-2 rounded-sm shrink-0">
              Saturday 5 Dec 2026 · 10:00 AM – 5:00 PM
            </div>
          </div>

          {/* 3 Event Cards (Top Photo + Location Pill + Lavender Bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMME_SESSIONS.slice(0, 3).map((session, idx) => (
              <div
                key={session.id}
                className="flex flex-col overflow-hidden bg-[#450C8E] border border-white/15 shadow-xl transition-transform hover:-translate-y-1.5 duration-300"
              >
                <div className="h-56 relative overflow-hidden bg-slate-900">
                  <img
                    src={[
                      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=800&q=80"
                    ][idx % 3]}
                    alt={session.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Circular Anniversary/Festival Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#31006F]/90 border border-[#F6BE00] text-white flex flex-col items-center justify-center shadow-md">
                    <span className="font-poppins font-black text-xs text-[#F6BE00] leading-none">BW</span>
                    <span className="text-[9px] font-bold text-white leading-none">2026</span>
                  </div>
                  {/* Location Pill */}
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-poppins font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#F6BE00]" />
                    <span>The Little Farm, Meyrick Park</span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-poppins font-black text-[#F6BE00]">
                      <span>{session.start} – {session.end}</span>
                      <span className="text-white/80 uppercase">{session.zoneName}</span>
                    </div>
                    <h3 className="font-poppins font-black text-2xl text-white tracking-tight leading-snug">
                      {session.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed font-normal">
                      {session.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/15">
                    <button
                      type="button"
                      onClick={() => onOpenBooking(1)}
                      className="w-full bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black py-3 px-5 text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Reserve Festival Pass
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================================
          6. THE LITTLE FARM VENUE SPREAD & HOTSPOTS EXPLORER
          ========================================================================= */}
      <section id="the-little-farm" className="py-20 sm:py-28 bg-[#FAF9F5] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-3 max-w-2xl">
              <h2 className="font-poppins font-black text-4xl sm:text-5xl text-[#31006F] tracking-tight leading-tight">
                The Little Farm Grounds.
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
                4,000&nbsp;m² of shaded bougainvillea lawns, secure perimeter fencing, and child-height facilities at 5 Richwell Ave, Meyrick Park, Harare.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://www.google.com/maps/search/?api=1&query=-17.8093111%2C31.0038472"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-poppins font-bold uppercase tracking-wider transition shadow-xs"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Directions</span>
              </a>
              <button
                type="button"
                onClick={() => onOpen3DMap()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#31006F] hover:bg-[#250058] text-white text-xs font-poppins font-black uppercase tracking-wider shadow-md transition cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#F6BE00]" />
                <span>3D Grounds Map</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
            </div>
            <FarmHotspotsCanvas onOpen3DMap={() => onOpen3DMap()} />
          </div>
        </div>
      </section>


      {/* =========================================================================
          7. PROGRESSIVE SIBLING DISCOUNT & DIRECT TICKET WIZARD
          ========================================================================= */}
      <section id="sibling-calculator" className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#31006F] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <h2 className="font-poppins font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  one simple pass. a whole day of joy.
                </h2>
                <p className="text-white/85 text-base sm:text-lg font-normal leading-relaxed">
                  Passes are $25 early bird with automatic progressive savings for siblings. Parents and children under 2 enter completely free. All 5 play zones, hot lunch, and sweet treats included.
                </p>

                {/* Sibling Rate Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {Object.entries(SIBLING_DISCOUNTS).map(([countStr, price]) => {
                    const count = Number(countStr);
                    const label = count === 1 ? "1 Child" : `${count} Siblings`;
                    return (
                      <div
                        key={count}
                        className={`p-3.5 border transition-all text-center ${
                          ticketChildCount === count
                            ? "border-[#F6BE00] bg-[#F6BE00]/15"
                            : "border-white/15 bg-white/5"
                        }`}
                      >
                        <span className="text-xs font-poppins font-bold text-white/90 block">
                          {label}
                        </span>
                        <span className="font-poppins font-black text-xl text-[#F6BE00] block mt-1">
                          ${price}
                        </span>
                        <span className="text-[10px] text-white/70 block">
                          ${(price / count).toFixed(0)} / child
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calculator Box */}
              <div className="lg:col-span-5 bg-white text-slate-900 p-8 shadow-xl space-y-6">
                <div className="space-y-1 pb-4 border-b border-slate-200">
                  <h3 className="font-poppins font-black text-2xl text-[#31006F] tracking-tight">
                    Instant Pass Calculator
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(440, 0.04);
                      setTicketChildCount(Math.max(1, ticketChildCount - 1));
                    }}
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-[#FF6720] hover:text-white flex items-center justify-center font-bold text-xl transition cursor-pointer"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <span className="font-poppins font-black text-5xl text-[#31006F] block">
                      {ticketChildCount}
                    </span>
                    <span className="text-xs font-poppins font-bold text-slate-600 uppercase tracking-wider block mt-1">
                      {ticketChildCount === 1 ? 'Child' : 'Children'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(560, 0.04);
                      setTicketChildCount(Math.min(8, ticketChildCount + 1));
                    }}
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-[#FF6720] hover:text-white flex items-center justify-center font-bold text-xl transition cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-[#FAF9F5] border border-slate-200 p-4 space-y-2 text-xs font-poppins font-medium">
                  <div className="flex justify-between text-slate-600">
                    <span>Regular Gate Admission</span>
                    <span className="line-through">${standardFullPrice}</span>
                  </div>
                  {calculatedSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Sibling Discount Savings</span>
                      <span>-${calculatedSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-[#31006F] pt-2 border-t border-slate-200">
                    <span>Total Early Bird</span>
                    <span className="text-[#FF6720] text-2xl font-black">${calculatedPassAmount}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundscape.playMarimbaClick(720, 0.08);
                    onOpenBooking(ticketChildCount);
                  }}
                  className="w-full bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black py-4 px-6 text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 stroke-[2.5]" />
                  <span>Reserve Passes (${calculatedPassAmount})</span>
                </button>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-poppins">
                  <span>EcoCash Merchant: 0779 140 417</span>
                  <button
                    type="button"
                    onClick={handleCopyEcoCash}
                    className="text-[#31006F] font-bold hover:underline cursor-pointer"
                  >
                    {copiedEcoCash ? 'Copied USSD' : 'Copy Code'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          8. GUIDELINES & FAQS (Swiss Architectural Hairline Accordion)
          ========================================================================= */}
      <section id="faqs" className="py-20 sm:py-28 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-3 max-w-2xl">
              <h2 className="font-poppins font-black text-4xl sm:text-5xl text-[#31006F] tracking-tight">
                everything moms ask us.
              </h2>
            </div>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div key={faq.q} className="py-6 sm:py-8 transition-colors">
                  <button
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(440 + idx * 30, 0.04);
                      setExpandedFaq(isExpanded ? null : idx);
                    }}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                  >
                    <div className="flex items-start sm:items-baseline gap-4 sm:gap-6">
                      <span className="font-poppins font-black text-sm sm:text-base text-[#FF6720] shrink-0">
                        0{idx + 1}
                      </span>
                      <h3 className="font-poppins font-bold text-lg sm:text-xl text-slate-900 group-hover:text-[#31006F] transition-colors leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#31006F] group-hover:text-white text-slate-700 flex items-center justify-center font-bold transition shrink-0">
                      {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="pt-4 pl-10 sm:pl-12 pr-4 sm:pr-8 animate-in fade-in duration-200">
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomeHero;
