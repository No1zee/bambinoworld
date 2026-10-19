import React from 'react';
import { Phone, Mail, MapPin, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <button
              onClick={() => {
                onTabChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="brand flex items-baseline gap-1 text-left cursor-pointer group whitespace-nowrap shrink-0 transition-transform hover:scale-[1.02]"
              title="Bambino World Home"
            >
              <span className="brand-name font-kid font-black tracking-wide text-2xl sm:text-3xl">
                <span className="text-[#ef4444] kid-bounce">B</span>
                <span className="text-[#facc15] kid-bounce">A</span>
                <span className="text-[#3b82f6] kid-bounce">M</span>
                <span className="text-[#10b981] kid-bounce">B</span>
                <span className="text-[#a855f7] kid-bounce">I</span>
                <span className="text-[#f97316] kid-bounce">N</span>
                <span className="text-[#06b6d4] kid-bounce">O</span>
              </span>
              <span className="brand-world font-kid text-[12px] font-bold tracking-[0.2em] text-white pl-1">
                WORLD
              </span>
            </button>
            <p className="text-xs text-slate-400 leading-relaxed">
              Where Little Dreams Come Alive. A premium outdoor kids and family festival creating lifelong memories in nature.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Saturday 5 December 2026 · 10am - 5pm</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit']">
              Festival Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onTabChange('home')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Home &amp; Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('3d-map')}
                  className="hover:text-white transition cursor-pointer text-left text-amber-300 font-semibold"
                >
                  3D Festival Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('december-5')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  5 December Event Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('zones')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Our Five Play Zones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('farm')}
                  className="hover:text-white transition cursor-pointer text-left"
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
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+263710489896" className="hover:text-white transition">
                  +263 710 489 896
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+263779140417" className="hover:text-white transition">
                  0779 140 417 (EcoCash / Info)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:bambinoworldzw@gmail.com" className="hover:text-white transition">
                  bambinoworldzw@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1 text-[11.5px] text-slate-400">
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
            <p className="text-xs text-slate-400">
              Early Bird $25 per child (limited). Sibling totals: 2 for $45, 3 for $60. Under 2s free with sibling.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md text-center"
            >
              Book Early Bird Passes
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BAMBINO World. Little moments. Lifelong memories.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for families in Zimbabwe &amp; worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
