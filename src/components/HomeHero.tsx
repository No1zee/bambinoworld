import React, { useState } from 'react';
import {
  BambinoSprout,
  BambinoCastle,
  BambinoPalette,
  BambinoTicket,
  BambinoTractor,
  BambinoCompass,
  BambinoMug,
  BambinoShield,
  BambinoSun,
  BambinoSparkle,
  BambinoPin,
  BambinoCalendar,
  BambinoArrow
} from './icons/BambinoIcons';
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
      tagline: 'A gentle, sunlit haven designed for tiny adventurers. Cushioned foam crawl zones, soft grass, and a private air-cooled nursery glade for feeding and rest.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#00A3E0]',
      features: [
        { label: 'Cushioned Grass Mats', tip: 'Soft foam crawling blocks and tumble cushions' },
        { label: 'Private Nursery Glade', tip: 'Comfortable nursing chairs, bottle warmers & fresh diaper stations' },
        { label: 'Gentle Sensory Play', tip: 'Clean, sanitized soft blocks and texture mats for babies' }
      ]
    },
    {
      id: 'adventure-zone',
      number: '02',
      name: 'Adventure Arena',
      age: '3 – 12Y',
      tagline: 'Boundless outdoor energy and big smiles. Inflatable obstacle slides, farm tractor journeys, and lawn challenges where coaches cheer every victory.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#FF6720]',
      features: [
        { label: 'Bouncy Obstacle Slides', tip: 'Supervised inflatable slides with thick safety crash mats' },
        { label: 'Farm Tractor Rides', tip: 'Gentle escorted scenic farm tractor tours on green grass' },
        { label: 'Supervised Balance Paths', tip: 'Safe timber logs and low balance games guided by marshals' }
      ]
    },
    {
      id: 'creative-zone',
      number: '03',
      name: 'Creative & Discovery',
      age: 'All Ages',
      tagline: 'Where imagination blossoms. Hands-on pottery sculpting, giant communal painting easels, gentle bunny and lamb cuddles, and live marimba storytelling.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#D82374]',
      features: [
        { label: 'Pottery Clay Sculpting', tip: 'Real potter clay modeling with botanical nature stamps' },
        { label: 'Farm Animal Petting', tip: 'Gentle miniature bunnies, ducklings, and baby lambs' },
        { label: 'Washable Giant Easels', tip: 'Vibrant finger painting with safe organic water paints' }
      ]
    },
    {
      id: 'discovery-world',
      number: '04',
      name: 'Discovery World',
      age: 'All Ages',
      tagline: 'Hands-on sensory wonder with giant floating soap bubbles, garden water mills, and playful natural science tricks under the trees.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#00A3E0]',
      features: [
        { label: 'Giant Bubble Lab', tip: 'Huge iridescent soap bubbles children can chase and pop' },
        { label: 'Sensory Water Ways', tip: 'Water mills and mini canal lock gates' },
        { label: 'Nature Magnifiers', tip: 'Safe optical lenses exploring Harare leaves and crystals' }
      ]
    },
    {
      id: 'celebration-stage',
      number: '05',
      name: 'Celebration Stage',
      age: 'Family',
      tagline: 'Shaded acoustic amphitheater featuring folk puppet theater, youth marimba rhythms, and joyful family singalongs under the jacarandas.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#31006F]',
      features: [
        { label: 'Live Puppet Folklore', tip: 'Charming folk tale performances with animal characters' },
        { label: 'Youth Marimba Ensemble', tip: 'Live acoustic percussion and infectious rhythm' },
        { label: 'Picnic Singalongs', tip: 'Gentle acoustic singalongs on blanket lawns' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'Do parents or grandparents need to buy a pass?',
      a: 'Never. Accompanying parents, grandparents, and babies under 2 enter completely free. We believe in bringing the whole family together. Relax under the shaded bougainvillea, take in the live music, snap wonderful photos, and enjoy the day—your child’s pass covers the entire festival.'
    },
    {
      q: 'Are all activities, rides, and food genuinely included?',
      a: '100% yes. All five play zones, inflatable obstacle challenges, tractor rides, animal petting cuddles, pottery sculpting, live stage performances, hot farm lunch, and afternoon ice cream are fully covered by the single pass. You can leave your wallet safely put away.'
    },
    {
      q: 'How are the grounds secured for children?',
      a: 'The Little Farm is completely surrounded by secure perimeter fencing with a single monitored entrance. Upon arrival, children and their guardians receive matching coded security wristbands. No child is permitted to leave the gate without their registered adult.'
    },
    {
      q: 'Is there a quiet place for babies and nursing mothers?',
      a: 'Inside The Little Garden, we built a private Mother & Baby Sanctuary equipped with comfortable armchairs, electric bottle warmers, sanitized changing stations, and gentle air circulation. It’s quiet, peaceful, and cool whenever your little one needs rest.'
    },
    {
      q: 'Can I book right now with EcoCash?',
      a: 'Yes, in seconds. We support instant EcoCash checkout with immediate SMS confirmation, as well as Visa, Mastercard, and Swipe. Early bird passes are just $25 online (gate tickets on the day are $30, and venue capacity is strictly capped for comfort).'
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
          <div className="w-full md:w-[28%] relative overflow-hidden bg-slate-900 min-h-[260px] md:min-h-[400px] animate-photo-unfold">
            <img
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80"
              alt="Joyful child playing outdoors at Bambino World"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="w-full md:w-[72%] bg-[#31006F] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 max-w-3xl">
              <h1 className="font-poppins font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white animate-cinematic-bloom">
                a sunlit saturday of pure, golden childhood.
              </h1>
              <p className="text-white/85 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl pt-2 animate-cinematic-bloom stagger-1">
                Bare feet dancing across green lawns. Warm ice cream smiles. Open skies and boundless laughter. A festival crafted for your child’s absolute wonder—and your family’s deepest joy.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4 justify-between border-t border-white/15 mt-8 animate-cinematic-bloom stagger-2">
              <div className="text-xs sm:text-sm font-poppins font-semibold text-white/90">
                <span>All 5 play zones, farm tractor rides, hot picnic lunch &amp; sweet treats included in every pass</span>
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
                  <span>Reserve Family Passes ($25)</span>
                  <BambinoArrow size={18} className="text-white shrink-0" />
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
                where parents can truly unwind together.
              </h2>
              <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed">
                Relax under the shade of blooming bougainvillea while trained marshals guide every game and paediatric nurses watch over the grounds. Sip a cold artisan drink, catch up with friends, and take in the smiles.
              </p>
            </div>

            {/* Circular Thompson-Style Accent Stamp */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-[#F6BE00]/60 flex flex-col items-center justify-center text-center p-2 bg-[#1a003b]/60 animate-stamp-bounce stagger-2">
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
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80"
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
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
              alt="Artistic discovery and child creativity"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-[72%] bg-[#FF6720] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-white">
                total freedom to play, create, and explore.
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
              <BambinoCompass size={22} className="text-[#F6BE00] shrink-0" />
              <span>Explore 3D Grounds</span>
              <BambinoArrow size={16} className="text-white shrink-0" />
            </button>
          </div>
        </div>

        {/* ROW 4: Left Sky Blue Block (72%) + Right Photo (28%) */}
        <div className="flex flex-col-reverse md:flex-row w-full min-h-[260px] md:min-h-[320px]">
          <div className="w-full md:w-[72%] bg-[#00A3E0] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-white">
                one all-inclusive pass. parents and babies enter free.
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
              <span>View Programme</span>
              <BambinoArrow size={16} className="text-white shrink-0" />
            </button>
          </div>

          <div className="w-full md:w-[28%] relative overflow-hidden bg-slate-900 min-h-[220px] md:min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80"
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
              thoughtfully curated for every age and energy.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              From gentle sensory crawl spaces for curious babies to high-energy obstacle tracks for adventurous explorers, every child finds their perfect kingdom.
            </p>
          </div>

          {/* 3 Thompson Cards (Top Photo + Saturated Solid Color Box) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Sky Blue (#00A3E0) */}
            <div className="flex flex-col overflow-hidden shadow-lg transition-transform hover:-translate-y-1.5 duration-300">
              <div className="h-64 sm:h-72 overflow-hidden bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80"
                  alt="The Little Garden"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#00A3E0] text-white p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BambinoSprout size={32} className="text-white shrink-0" />
                    <h3 className="font-poppins font-black text-2xl sm:text-3xl tracking-tight leading-snug">
                      the little garden (6m – 2y)
                    </h3>
                  </div>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                    A peaceful, shoe-free haven designed for tiny adventurers. Cushioned foam tumble mats, soft texture paths, and an air-cooled nursery suite with private nursing armchairs, bottle warmers, and fresh changing amenities.
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
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                  alt="Adventure Arena"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#FF6720] text-white p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BambinoCastle size={32} className="text-white shrink-0" />
                    <h3 className="font-poppins font-black text-2xl sm:text-3xl tracking-tight leading-snug">
                      adventure arena (3 – 12y)
                    </h3>
                  </div>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                    Boundless outdoor fun in a safe, monitored setting. Giant inflatable obstacle challenges, junior farm tractor journeys, balance logs, and lawn games where dedicated youth coaches champion every victory.
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
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80"
                  alt="Creative & Discovery"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#D82374] text-white p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BambinoPalette size={32} className="text-white shrink-0" />
                    <h3 className="font-poppins font-black text-2xl sm:text-3xl tracking-tight leading-snug">
                      creative &amp; discovery
                    </h3>
                  </div>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                    Where little imaginations run free. Hands-on pottery sculpting, giant communal painting easels, gentle bunny and lamb petting, bubble physics, and live acoustic marimba storytelling under the trees.
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
                crafted with love for harare families.
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                We designed Bambino World around what matters most: impeccable safety, spotless comfort, generous shade, and memories your family will cherish for years.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <div className="flex justify-center mb-1"><BambinoCastle size={28} className="text-[#FF6720]" /></div>
                <span className="font-poppins font-black text-4xl text-[#FF6720] block">5</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Curated Age Zones
                </span>
              </div>

              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <div className="flex justify-center mb-1"><BambinoTractor size={28} className="text-[#31006F]" /></div>
                <span className="font-poppins font-black text-4xl text-[#31006F] block">10+</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Farm Activities
                </span>
              </div>

              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <div className="flex justify-center mb-1"><BambinoShield size={28} className="text-[#10B981]" /></div>
                <span className="font-poppins font-black text-4xl text-[#2F532E] block">100%</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Gated &amp; Secured
                </span>
              </div>

              <div className="bg-[#FAF9F5] border border-slate-200 p-6 text-center space-y-1">
                <div className="flex justify-center mb-1"><BambinoTicket size={28} className="text-[#D82374]" /></div>
                <span className="font-poppins font-black text-4xl text-[#D82374] block">0</span>
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  Extra Token Booths
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
                every detail designed for your family’s comfort.
              </h2>
              <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed">
                Relax knowing that every corner of the grounds is prepared, secure, and lovingly supervised for children of all ages:
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onOpen3DMap()}
                  className="bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black px-7 py-3.5 text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <BambinoCompass size={20} className="text-[#F6BE00] shrink-0" />
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
                here’s how your saturday unfolds.
              </h2>
              <p className="text-white/80 text-base sm:text-lg font-normal">
                Arrive early for fresh morning farm air, take your time over lunch, and let them dance to live marimba beats before the sleepy car ride home.
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
                    <BambinoPin size={18} className="text-[#F6BE00] shrink-0" />
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
                      className="w-full bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black py-3 px-5 text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <BambinoTicket size={18} className="text-white shrink-0" />
                      <span>Reserve Festival Pass</span>
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
                the little farm, meyrick park.
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
                4,000 square meters of lush, private green lawns tucked inside Meyrick Park. Secure on-site parking with marshals to help with strollers and car seats.
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
                <BambinoCompass size={20} className="text-[#F6BE00] shrink-0" />
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
                  one pass for the entire day. family comes first.
                </h2>
                <p className="text-white/85 text-base sm:text-lg font-normal leading-relaxed">
                  Early bird passes are just $25 with automatic discounts for brothers and sisters. Accompanying parents, grandparents, and children under 2 join completely free.
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
                  <BambinoTicket size={20} className="text-white shrink-0" />
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
                everything families ask us.
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
