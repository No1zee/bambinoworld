import React from 'react';
import { Phone, Mail, MapPin, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <button
              onClick={() => {
                onTabChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="brand inline-flex flex-col items-end cursor-pointer group whitespace-nowrap shrink-0 py-0.5 transition-transform hover:scale-[1.02]"
              title="Bambino World Home"
              style={{ transform: 'rotate(-3deg)', transformOrigin: 'center center' }}
            >
              <span className="brand-name font-kid font-black tracking-normal text-xl sm:text-3xl leading-none flex items-center">
                <span className="text-[#ef4444] kid-bounce">B</span>
                <span className="text-[#facc15] kid-bounce">A</span>
                <span className="text-[#3b82f6] kid-bounce">M</span>
                <span className="text-[#10b981] kid-bounce">B</span>
                <span className="text-[#a855f7] kid-bounce">I</span>
                <span className="text-[#f97316] kid-bounce">N</span>
                <span className="text-[#06b6d4] kid-bounce">O</span>
              </span>
              <span className="brand-world font-kid text-[8.5px] sm:text-[10px] font-black tracking-[0.3em] text-white -mt-1 sm:-mt-1.5 pr-0.5 leading-none uppercase">
                WORLD
              </span>
            </button>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Where Little Dreams Come Alive. A premium outdoor kids and family festival creating lifelong memories in nature.
            </p>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Saturday 5 December 2026 · 10am - 5pm</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit']">
              Festival Pages
            </h4>
            <ul className="space-y-1 text-sm font-medium">
              <li>
                <button
                  onClick={() => onTabChange('home')}
                  className="min-h-[44px] flex items-center hover:text-white transition cursor-pointer text-left w-full active:opacity-75"
                >
                  Home &amp; Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('3d-map')}
                  className="min-h-[44px] flex items-center hover:text-white transition cursor-pointer text-left text-amber-300 font-bold w-full active:opacity-75"
                >
                  3D Festival Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('december-5')}
                  className="min-h-[44px] flex items-center hover:text-white transition cursor-pointer text-left w-full active:opacity-75"
                >
                  5 December Event Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('zones')}
                  className="min-h-[44px] flex items-center hover:text-white transition cursor-pointer text-left w-full active:opacity-75"
                >
                  Our Five Play Zones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('farm')}
                  className="min-h-[44px] flex items-center hover:text-white transition cursor-pointer text-left w-full active:opacity-75"
                >
                  The Little Farm Grounds
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit']">
              Get In Touch
            </h4>
            <ul className="space-y-1 text-sm text-slate-300 font-medium">
              <li>
                <a
                  href="tel:+263710489896"
                  className="min-h-[44px] flex items-center gap-2.5 hover:text-white transition active:opacity-75"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+263 710 489 896</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+263779140417"
                  className="min-h-[44px] flex items-center gap-2.5 hover:text-white transition active:opacity-75"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0779 140 417 (EcoCash)</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:bambinoworldzw@gmail.com"
                  className="min-h-[44px] flex items-center gap-2.5 hover:text-white transition active:opacity-75 truncate"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">bambinoworldzw@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-2 text-xs text-slate-400 leading-relaxed">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>5 Richwell Ave, Meyrick Park, Mabelreign, Harare</span>
              </li>
            </ul>
          </div>

          {/* Bookings & Passes */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit']">
              Festival Passes
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Early Bird $25 per child (limited). Sibling totals: 2 for $45, 3 for $60. Under 2s free with sibling.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full min-h-[44px] py-3 px-4 bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md text-center flex items-center justify-center"
            >
              Book Early Bird Passes
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} BAMBINO World. Little moments. Lifelong memories.</p>
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
