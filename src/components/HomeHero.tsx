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
      tagline: 'Soft grass, cushioned crawl zones, and zero big kids running through. With a private nursing suite whenever you need a breather.',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#00A3E0]',
      features: [
        { label: 'Cushioned Grass Mats', tip: 'Soft foam crawling blocks and tumble cushions' },
        { label: 'Private Nursery Glade', tip: 'Bottle warmers, diaper stations & comfortable chairs' },
        { label: 'Gentle Ball Play', tip: 'Clean, sanitized soft balls for curious babies' }
      ]
    },
    {
      id: 'adventure-zone',
      number: '02',
      name: 'Adventure Arena',
      age: '3 – 12Y',
      tagline: 'Boundless energy, safely channeled. Obstacle bouncy slides, tractor rides, and lawn games with loving marshals at every station.',
      image: 'https://images.unsplash.com/photo-1567057419565-4349c49d8a04?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#FF6720]',
      features: [
        { label: 'Bouncy Obstacle Slides', tip: 'Supervised inflatable slides with thick safety crash mats' },
        { label: 'Junior Tractor Rides', tip: 'Gentle escorted farm tractor tours on green grass' },
        { label: 'Monitored Climbing', tip: 'Safe timber logs and balance paths guided by marshals' }
      ]
    },
    {
      id: 'creative-zone',
      number: '03',
      name: 'Creative & Discovery',
      age: 'All Ages',
      tagline: 'Spark their imagination with non-toxic pottery clay, giant communal easels, gentle bunny petting, and live marimba storytelling.',
      image: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#D82374]',
      features: [
        { label: 'Pottery Clay Sculpting', tip: 'Real clay modeling with natural botanical stamps' },
        { label: 'Animal Petting Cuddles', tip: 'Gentle miniature bunnies, ducklings, and lambs' },
        { label: 'Washable Giant Easels', tip: 'Vibrant finger painting with safe organic paints' }
      ]
    },
    {
      id: 'discovery-world',
      number: '04',
      name: 'Discovery World',
      age: 'All Ages',
      tagline: 'Hands-on sensory wonder with giant bubble wands, water locks, and simple natural science tricks that light up their eyes.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#00A3E0]',
      features: [
        { label: 'Giant Bubble Lab', tip: 'Huge floating bubbles kids can chase and pop' },
        { label: 'Sensory Water Ways', tip: 'Water mills and mini canal hydraulic locks' },
        { label: 'Nature Magnifiers', tip: 'Safe optical lenses exploring Harare leaves and crystals' }
      ]
    },
    {
      id: 'celebration-stage',
      number: '05',
      name: 'Celebration Stage',
      age: 'Family',
      tagline: 'Shaded acoustic amphitheater featuring puppet folklore, youth marimba rhythms, and family singalongs under the jacarandas.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      color: 'bg-[#31006F]',
      features: [
        { label: 'Interactive Puppet Shows', tip: 'Joyful animal folk tales performed live' },
        { label: 'Acoustic Marimba Beats', tip: 'Live youth percussion ensemble and drum circles' },
        { label: 'Picnic Singalong', tip: 'Gentle acoustic tunes on blanket lawns' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'Do parents or grandparents have to pay to come in?',
      a: 'Not a single cent. Accompanying parents, grandparents, and babies under 2 enter completely free. We don’t believe in charging moms to watch their own children play. Sit under the bougainvillea, have a cold drink, take photos, and relax—your child’s $25 pass covers everything.'
    },
    {
      q: 'Are we really not going to be asked for money inside?',
      a: 'Really. Everything advertised—the five play zones, bouncy obstacle courses, tractor rides, bunny and lamb petting, pottery clay, lunch, cold juices, and afternoon ice cream—is 100% covered. You can leave your purse zipped shut all day.'
    },
    {
      q: 'What if my child wanders off towards the gate?',
      a: 'The entire 4,000 m² property is fully enclosed by high perimeter fencing with a single security-guarded gate. At check-in, you and your child get matching coded security wristbands. No child is allowed through the gate without their registered adult, period.'
    },
    {
      q: 'What if my baby needs a quiet place to nurse or nap?',
      a: 'Inside The Little Garden, we built a private Mother & Baby Sanctuary with comfortable armchairs, electric bottle warmers, clean changing tables, and free wipes. It is cool, quiet, and away from the music so you both can recharge.'
    },
    {
      q: 'Can I pay with EcoCash right now?',
      a: 'Yes, in 10 seconds. You can checkout directly via EcoCash, Swipe, Visa, or Mastercard. Your digital pass and wristband number are generated on your screen immediately, and gate capacity is strictly capped so it never feels overcrowded.'
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
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80"
              alt="Joyful child playing outdoors at Bambino World"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="w-full md:w-[72%] bg-[#31006F] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 max-w-3xl">
              <h1 className="font-poppins font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white">
                a whole saturday where nobody asks for an ipad.
              </h1>
              <p className="text-white/85 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl pt-2">
                Real grass under bare feet. Ice cream melting down tiny wrists. Pure, sun-drenched wonder from 10am to 5pm—and a child who falls fast asleep in the car on the drive home.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4 justify-between border-t border-white/15 mt-8">
              <div className="text-xs sm:text-sm font-poppins font-semibold text-white/90">
                <span>All 5 play zones, tractor rides, hot farm lunch &amp; ice cream included in your pass</span>
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
                yes, mom actually gets to sit down and finish a warm cup of coffee.
              </h2>
              <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed">
                Fully fenced grounds with one guarded gate. Loving marshals at every obstacle. Paediatric nurses on-site. You can finally sit under the bougainvillea with a cold drink, knowing your child is 100% safe.
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
              src="https://images.unsplash.com/photo-1567057419565-4349c49d8a04?auto=format&fit=crop&w=1200&q=80"
              alt="Artistic discovery and child creativity"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-[72%] bg-[#FF6720] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-white">
                no tokens. no "mom, please can i have $2 more?"
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
                everything included. parents enter completely free.
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
              src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=80"
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
              no trampled toddlers. no bored big kids.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              Most family events dump everyone into one dusty field. Bambino World is split into three dedicated zones—so your crawling baby has a soft, quiet lawn, and your six-year-old can run wild.
            </p>
          </div>

          {/* 3 Thompson Cards (Top Photo + Saturated Solid Color Box) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Sky Blue (#00A3E0) */}
            <div className="flex flex-col overflow-hidden shadow-lg transition-transform hover:-translate-y-1.5 duration-300">
              <div className="h-64 sm:h-72 overflow-hidden bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80"
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
                    Soft grass, cushioned crawl zones, and zero big kids running through. Includes a private, shaded nursery suite with clean bottle warmers and fresh diaper tables whenever you need a breather.
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
                  src="https://images.unsplash.com/photo-1567057419565-4349c49d8a04?auto=format&fit=crop&w=1200&q=80"
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
                    Supervised timber climbing, bouncy obstacle slides, vintage farm tractor rides, and lawn games where trained marshals guide and protect every jump.
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
                  src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=80"
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
                we built the day out we wished existed in harare.
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Clean bathrooms with running water. Security that actually checks wristbands. Fresh food you’d happily feed your own family. We didn’t cut a single corner.
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
                relax. we’ve thought of everything.
              </h2>
              <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed">
                You shouldn’t have to spend your Saturday on high alert. Here is exactly how we keep your children safe, cool, and happy:
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
                  one pass covers the whole day. parents enter free.
                </h2>
                <p className="text-white/85 text-base sm:text-lg font-normal leading-relaxed">
                  Gate tickets on the day are $30, but early bird passes online are just $25—with automatic discounts if you’re bringing brothers and sisters. No hidden token booths once you’re inside.
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
