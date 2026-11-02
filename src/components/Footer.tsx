import React from 'react';
import { Phone, Mail, MapPin, Heart, Sparkles, Compass, ArrowRight, ArrowUpRight } from 'lucide-react';
import { soundscape } from '../utils/soundscape';

interface FooterProps {
  onTabChange: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenBooking }) => {
  const marqueeItems = [
    '4,000 M² PROTECTED PARKLAND',
    'ALL 5 PLAY ZONES INCLUDED',
    'FREE ADULT ENTRY',
    'CERTIFIED PAEDIATRIC MEDICS',
    'UNLIMITED SWEET TREATS & WAFFLES',
    '100% GATED & SUPERVISED',
    'MEYRICK PARK, HARARE',
    'SATURDAY 5 DECEMBER 2026',
    '10AM – 5PM CAT'
  ];

  return (
    <footer className="bg-[#0B130E] text-slate-300 border-t border-emerald-950 overflow-hidden pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      {/* 1. PARADIGM 4: THE KINETIC TYPOGRAPHIC RIBBON (Marquee Horizon) */}
      <div className="w-full border-b border-emerald-900/40 bg-[#070D09] py-3 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-kid font-bold tracking-wider text-amber-300/90">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-emerald-500 text-[10px]">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-12">
        {/* 2. PARADIGM 2: ARCHITECTURAL PILLARS (Vertical Floor-to-Ceiling Hairlines) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 md:divide-x md:divide-emerald-950/80">
          {/* Pillar 1: Brand & Geographic Prestige */}
          <div className="md:col-span-5 md:pr-10 space-y-5">
            <button
              onClick={() => {
                soundscape.playMarimbaClick(480, 0.04);
                onTabChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="brand inline-flex flex-col items-start cursor-pointer group whitespace-nowrap shrink-0 py-0.5 transition-transform hover:scale-[1.02]"
              title="Bambino World Home"
              style={{ transform: 'rotate(-2deg)', transformOrigin: 'left center' }}
            >
              <span className="brand-name font-kid font-black tracking-normal text-2xl sm:text-4xl leading-none flex items-center">
                <span className="text-[#C85A32] kid-bounce">B</span>
                <span className="text-[#D97706] kid-bounce">A</span>
                <span className="text-[#2D5A43] kid-bounce">M</span>
                <span className="text-[#E06D3B] kid-bounce">B</span>
                <span className="text-[#5B4E77] kid-bounce">I</span>
                <span className="text-[#B45309] kid-bounce">N</span>
                <span className="text-[#237A72] kid-bounce">O</span>
              </span>
              <span className="brand-world font-kid text-[9px] sm:text-[11px] font-black tracking-[0.35em] text-white mt-1 leading-none uppercase">
                WORLD
              </span>
            </button>

            <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-sm">
              Where Little Dreams Come Alive. A premium outdoor kids and family festival creating lifelong memories in nature.
            </p>

            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Saturday 5 December 2026 · Gates: 10:00 – 17:00</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 tracking-wider">
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
                <span>17°48'33.5"S · 31°00'13.8"E · Meyrick Park</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Editorial Navigation Ledger */}
          <div className="md:col-span-3 md:px-8 space-y-4">
            <span className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase block">
              Directory / Index
            </span>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { id: 'home', index: '01', label: 'Home & Overview' },
                { id: '3d-map', index: '02', label: '3D Festival Map ↗', highlight: true },
                { id: 'december-5', index: '03', label: 'Programme Timetable' },
                { id: 'zones', index: '04', label: 'The Five Play Zones' },
                { id: 'farm', index: '05', label: 'The Little Farm Grounds' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      soundscape.playMarimbaClick(520, 0.04);
                      onTabChange(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-3 transition-all cursor-pointer text-left w-full hover:translate-x-1 ${
                      item.highlight
                        ? 'text-amber-300 font-kid font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-xs text-slate-500">{item.index}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 3: Admission & Immediate Inquiries */}
          <div className="md:col-span-4 md:pl-8 space-y-4">
            <span className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase block">
              Admission &amp; Inquiries
            </span>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Early Bird $25 per child. Sibling discount: 2 for $45, 3 for $60. Adults and under-2s enter completely free.
            </p>

            <button
              type="button"
              onClick={() => {
                soundscape.playMarimbaClick(650, 0.08);
                onOpenBooking();
              }}
              className="w-full min-h-[48px] py-3 px-5 bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 active:translate-y-0.5 text-slate-950 font-kid font-black text-sm rounded-xl transition-all shadow-[0_8px_20px_-4px_rgba(245,158,11,0.45)] text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Early Bird Pass ($25)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="pt-2 space-y-2 text-xs font-medium text-slate-400">
              <a
                href="tel:+263710489896"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+263 710 489 896 · +263 779 140 417</span>
              </a>

              <a
                href="mailto:bambinoworldzw@gmail.com"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>bambinoworldzw@gmail.com</span>
              </a>

              <div className="flex items-start gap-2 pt-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>5 Richwell Ave, Meyrick Park, Mabelreign, Harare</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR (Swiss Baseline) */}
        <div className="pt-6 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} BAMBINO World. Little moments. Lifelong memories.</p>
            <p className="font-mono text-[10px] text-slate-400 tracking-wider">
              HARARE, ZIMBABWE · CENTRAL AFRICA TIME (UTC+2) · 100% GATED FESTIVAL
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 justify-center">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for families in Zimbabwe &amp; worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
