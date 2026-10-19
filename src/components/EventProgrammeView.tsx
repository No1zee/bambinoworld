import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Check,
  MapPin,
  Baby,
  Castle,
  Palette,
  FlaskConical,
  Music2,
  Image as ImageIcon
} from 'lucide-react';
import { PROGRAMME_SESSIONS } from '../data/festivalData';
import { Tooltip } from './Tooltip';
import {
  getStoredSectionBackgrounds,
  SectionBackgroundConfig
} from '../data/sectionBackgrounds';

import { MulticolorTitle } from './MulticolorTitle';

interface EventProgrammeViewProps {
  onInspectZone3D: (zoneId: string) => void;
  onOpenBooking: () => void;
}

export const EventProgrammeView: React.FC<EventProgrammeViewProps> = ({
  onInspectZone3D,
  onOpenBooking
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [myDay, setMyDay] = useState<string[]>([]);
  const [bgConfig] = useState<SectionBackgroundConfig>(getStoredSectionBackgrounds);

  const filteredSessions = selectedZone === 'all'
    ? PROGRAMME_SESSIONS
    : PROGRAMME_SESSIONS.filter(s => s.zone === selectedZone);

  const toggleSession = (sessionId: string) => {
    setMyDay(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const myDaySessions = PROGRAMME_SESSIONS.filter(s => myDay.includes(s.id));

  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'baby': return Baby;
      case 'adventure': return Castle;
      case 'creative': return Palette;
      case 'discovery': return FlaskConical;
      default: return Music2;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-16">
      {/* Streamlined Event Banner with Photographic Background & Warm Scrim */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-amber-900/40 shadow-2xl">
        <img
          src={bgConfig.programmeSection}
          alt="Festival Grounds"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102"
        />
        {/* Soft warm gradient overlay for clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-amber-950/80 to-emerald-950/85" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <MulticolorTitle
            text="Festival Programme"
            as="h1"
            className="text-3xl sm:text-5xl font-kid font-black tracking-wide drop-shadow-md"
            bounceOnMount={true}
          />
          <p className="text-sm text-slate-200 font-medium">
            Saturday 5 December 2026 · 10:00 AM – 5:00 PM CAT. 22 sessions across five play sectors at The Little Farm.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenBooking}
            className="min-h-[44px] px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-md active:scale-98 flex items-center justify-center"
          >
            Book Passes ($25)
          </button>
        </div>
      </div>

      {/* Timetable Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Filterable Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-kid font-black text-slate-900 tracking-wide">
              Sessions ({filteredSessions.length})
            </h2>

            {/* Filter Pills with Apple HIG 44px Touch Targets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'stage', label: 'Stage' },
                { id: 'baby', label: 'Baby' },
                { id: 'adventure', label: 'Adventure' },
                { id: 'creative', label: 'Creative' },
                { id: 'discovery', label: 'Discovery' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedZone(f.id)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center active:scale-98 ${
                    selectedZone === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredSessions.map(session => {
              const isAdded = myDay.includes(session.id);
              const ZoneIcon = getZoneIcon(session.zone);
              const zoneMapId = session.zone === 'baby' ? 'little-garden'
                : session.zone === 'stage' ? 'celebration-stage'
                : session.zone === 'adventure' ? 'adventure-zone'
                : session.zone === 'creative' ? 'creative-zone'
                : 'discovery-world';

              return (
                <div
                  key={session.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Tooltip content={`Zone: ${session.zoneName}`}>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 cursor-help">
                        <ZoneIcon className="w-4 h-4 text-emerald-700" />
                      </div>
                    </Tooltip>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {session.start}–{session.end}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {session.zoneName}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {session.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Tooltip content="Fly camera to this zone in 3D">
                      <button
                        onClick={() => onInspectZone3D(zoneMapId)}
                        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer flex items-center justify-center active:scale-95"
                        aria-label="3D View"
                      >
                        <MapPin className="w-4 h-4 text-amber-600" />
                      </button>
                    </Tooltip>
                    <button
                      onClick={() => toggleSession(session.id)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{isAdded ? 'Added' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Planner */}
        <div className="bg-[#f5f4ee] border border-slate-300 rounded-3xl p-5 space-y-3 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-300/80 pb-2.5">
            <h3 className="text-lg sm:text-xl font-kid font-black text-slate-900 tracking-wide">
              My Day ({myDay.length})
            </h3>
            {myDay.length > 0 && (
              <button
                onClick={() => setMyDay([])}
                className="min-h-[44px] px-3 text-xs text-slate-500 hover:text-rose-600 cursor-pointer font-semibold flex items-center"
              >
                Clear
              </button>
            )}
          </div>

          {myDaySessions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              Click <strong>+ Add</strong> on sessions to build your family schedule.
            </p>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {myDaySessions.map(session => (
                <div
                  key={session.id}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-emerald-800">
                      {session.start} · {session.zoneName}
                    </span>
                    <div className="font-bold text-slate-900 truncate max-w-[180px]">
                      {session.title}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSession(session.id)}
                    className="w-11 h-11 text-slate-400 hover:text-rose-600 text-sm font-bold flex items-center justify-center cursor-pointer rounded-lg"
                    aria-label="Remove session"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-300/80">
            <button
              onClick={onOpenBooking}
              className="w-full min-h-[44px] py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-sm text-center flex items-center justify-center active:scale-98"
            >
              Book Passes ($25)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
