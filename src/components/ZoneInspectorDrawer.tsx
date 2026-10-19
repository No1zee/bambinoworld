import React from 'react';
import { ZONES_DATA } from '../data/festivalData';
import { Shield, Sparkles, Users, Clock, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface ZoneInspectorDrawerProps {
  zoneId: string | null;
  onClose: () => void;
  onSelectZone: (zoneId: string) => void;
  onOpenBooking: () => void;
}

export const ZoneInspectorDrawer: React.FC<ZoneInspectorDrawerProps> = ({
  zoneId,
  onClose,
  onSelectZone,
  onOpenBooking
}) => {
  if (!zoneId || !ZONES_DATA[zoneId]) return null;

  const z = ZONES_DATA[zoneId];
  const allZones = Object.keys(ZONES_DATA);
  const currentIndex = allZones.indexOf(zoneId);

  const handleStep = (direction: number) => {
    const nextIdx = (currentIndex + direction + allZones.length) % allZones.length;
    onSelectZone(allZones[nextIdx]);
  };

  return (
    <aside className="fixed right-4 top-24 bottom-14 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl z-45 flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800">
        <div>
          <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">
            {z.title}
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            {z.subtitle}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold transition cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 overflow-y-auto flex-1 space-y-3.5 text-xs">
        {/* Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800/90 border border-slate-700/70 rounded-xl p-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Status</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">{z.status}</div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700/70 rounded-xl p-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Age Group</div>
            <div className="text-xs font-bold text-amber-300 mt-0.5">{z.ageGroup}</div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700/70 rounded-xl p-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Supervision</div>
            <div className="text-xs font-bold text-sky-300 mt-0.5">{z.staffing}</div>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Overview &amp; Layout
          </h3>
          <p className="text-slate-200 leading-relaxed text-xs">
            {z.description}
          </p>
        </div>

        {/* 3D Zone Highlights */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Key Features &amp; Amenities
          </h3>
          <ul className="space-y-1.5">
            {z.features.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50 text-[11.5px]"
              >
                <span className="text-amber-400 font-bold">✦</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Note */}
        <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Site Flow &amp; Safety Protocol</span>
          </div>
          <p className="text-amber-100/90 text-[11px] leading-relaxed">
            {z.safetyNote}
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
        <button
          onClick={() => handleStep(-1)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer flex-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Prev
        </button>
        <button
          onClick={onOpenBooking}
          className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer flex-1 shadow-md"
        >
          Book Passes
        </button>
        <button
          onClick={() => handleStep(1)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer flex-1"
        >
          Next <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
