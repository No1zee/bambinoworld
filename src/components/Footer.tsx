import React from 'react';
import { Phone, Mail, MapPin, Heart, Sparkles, Compass, ArrowRight, Instagram, Facebook, Youtube, Ticket } from 'lucide-react';
import { soundscape } from '../utils/soundscape';

interface FooterProps {
  onTabChange: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenBooking }) => {
  return (
    <footer className="relative bg-[#31006F] text-white overflow-hidden pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      {/* 1. THOMPSON SIGNATURE ORGANIC WAVE DIVIDER */}
      <div className="w-full overflow-hidden leading-none bg-[#FAF9F5]">
        <svg
          className="relative block w-full h-12 sm:h-20 text-[#31006F]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-12">
        
        {/* 2. MAIN 3-COLUMN THOMPSON FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Column 1: Brand, Mission & Social Icons (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundscape.playMarimbaClick(480, 0.04);
                  onTabChange('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center cursor-pointer group py-1 transition-transform hover:scale-[1.02] active:scale-95"
                title="Bambino World Home"
              >
                <img
                  src="/bambino-logo.png"
                  alt="Bambino World"
                  className="h-12 sm:h-14 w-auto object-contain brightness-110"
                  loading="lazy"
                />
              </button>
              <div className="h-8 pl-3 border-l-2 border-white/20 flex items-center text-xs font-poppins font-black text-white/90 tracking-wider uppercase">
                <span>HARARE · 2026</span>
              </div>
            </div>

            <p className="text-sm text-white/85 leading-relaxed font-sans max-w-sm">
              Where Little Dreams Come Alive. A premium outdoor celebration bringing families together across 4,000 m² of natural parkland in Harare.
            </p>

            {/* Circular Social Buttons (Thompson Pattern: White Circle with Purple Glyph) */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white text-[#31006F] hover:bg-[#FF6720] hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white text-[#31006F] hover:bg-[#FF6720] hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white text-[#31006F] hover:bg-[#FF6720] hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 fill-current" />
              </a>
            </div>

            {/* Thompson-Style "Our Partners" Pill Badge */}
            <div className="pt-2">
              <div className="inline-flex flex-wrap items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-poppins text-white/90 font-medium">
                <span className="font-black text-[#F6BE00] uppercase tracking-wider text-[10px]">
                  Our Partners:
                </span>
                <span>EcoCash</span>
                <span className="opacity-40">·</span>
                <span>The Little Farm</span>
                <span className="opacity-40">·</span>
                <span>Paediatric Care</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Directory (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-poppins text-sm font-black text-white">
              Directory
            </h4>
            <ul className="space-y-3 text-sm font-poppins font-semibold">
              {[
                { id: 'home', label: 'Home & Overview' },
                { id: 'zones', label: 'The Five Play Zones' },
                { id: '3d-map', label: '3D Festival Map' },
                { id: 'december-5', label: 'Programme Timetable' },
                { id: 'farm', label: 'The Little Farm Grounds' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      soundscape.playMarimbaClick(520, 0.04);
                      onTabChange(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-white/80 hover:text-[#F6BE00] hover:translate-x-1 transition-all cursor-pointer text-left flex items-center gap-2"
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Admission (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="font-poppins text-sm font-black text-white">
              Admission &amp; Inquiries
            </h4>

            <p className="text-xs text-white/80 leading-relaxed font-sans">
              Saturday 5 December 2026 · 10:00 AM to 5:00 PM CAT. All 5 zones, hot lunch, and sweet treats included with every child pass.
            </p>

            <button
              type="button"
              onClick={() => {
                soundscape.playMarimbaClick(650, 0.08);
                onOpenBooking();
              }}
              className="w-full bg-[#FF6720] hover:bg-[#e05514] active:scale-95 text-white font-poppins font-black py-3.5 px-6 text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4 stroke-[2.5]" />
              <span>Book Early Bird Pass ($25)</span>
            </button>

            <div className="space-y-2.5 text-xs font-sans text-white/85 pt-1">
              <a
                href="tel:+263779140417"
                className="flex items-center gap-2.5 hover:text-[#F6BE00] transition"
              >
                <Phone className="w-4 h-4 text-[#00A3E0] shrink-0" />
                <span className="font-poppins font-bold">+263 779 140 417 · +263 710 489 896</span>
              </a>

              <a
                href="mailto:bambinoworldzw@gmail.com"
                className="flex items-center gap-2.5 hover:text-[#F6BE00] transition"
              >
                <Mail className="w-4 h-4 text-[#00A3E0] shrink-0" />
                <span>bambinoworldzw@gmail.com</span>
              </a>

              <div className="flex items-start gap-2.5 pt-1 text-white/80">
                <MapPin className="w-4 h-4 text-[#F6BE00] shrink-0 mt-0.5" />
                <span>5 Richwell Ave, Meyrick Park, Mabelreign, Harare</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. BOTTOM COPYRIGHT BASELINE */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-white/70 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Bambino World at The Little Farm. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5 text-white/80">
            <span>Crafted for families in Zimbabwe &amp; worldwide</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6720] fill-[#FF6720]" />
          </div>
        </div>

      </div>

      {/* 4. THOMPSON SIGNATURE FLOATING CORNER CTA TAB (Angled bottom right) */}
      <div className="hidden md:block fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => {
            soundscape.playMarimbaClick(720, 0.08);
            onOpenBooking();
          }}
          className="bg-[#D82374] hover:bg-[#ba1560] active:scale-95 text-white font-poppins font-black text-xs uppercase tracking-widest px-6 py-3 shadow-2xl transition-all flex items-center gap-2 cursor-pointer border border-white/20"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Book Pass ($25)</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
