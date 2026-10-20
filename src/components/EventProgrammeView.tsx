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
  Share2,
  Printer,
  Download,
  X,
  Sparkles,
  Calendar
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
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [myDay, setMyDay] = useState<string[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [copiedSchedule, setCopiedSchedule] = useState<boolean>(false);
  const [bgConfig] = useState<SectionBackgroundConfig>(getStoredSectionBackgrounds);

  // Filter sessions by zone, time of day, and age category
  const filteredSessions = PROGRAMME_SESSIONS.filter(s => {
    // Zone filter
    if (selectedZone !== 'all' && s.zone !== selectedZone) return false;

    // Time of day filter
    const startHour = parseInt(s.start.split(':')[0], 10);
    if (timeFilter === 'morning' && startHour >= 12) return false;
    if (timeFilter === 'midday' && (startHour < 12 || startHour >= 14)) return false;
    if (timeFilter === 'afternoon' && startHour < 14) return false;

    // Age filter
    if (ageFilter === 'baby' && s.zone !== 'baby') return false;
    if (ageFilter === 'kids' && s.zone !== 'adventure' && s.zone !== 'creative' && s.zone !== 'discovery') return false;
    if (ageFilter === 'stage' && s.zone !== 'stage') return false;

    return true;
  });

  const toggleSession = (sessionId: string) => {
    setMyDay(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const myDaySessions = PROGRAMME_SESSIONS.filter(s => myDay.includes(s.id)).sort((a, b) => a.start.localeCompare(b.start));

  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'baby': return Baby;
      case 'adventure': return Castle;
      case 'creative': return Palette;
      case 'discovery': return FlaskConical;
      default: return Music2;
    }
  };

  const getFootprintEmoji = (idx: number) => {
    const emojis = ['🍃', '🐾', '🌸', '🌿', '✨'];
    return emojis[idx % emojis.length];
  };

  const handleCopySchedule = () => {
    const lines = [
      '🎪 My Bambino World Schedule (Sat 5 Dec 2026, The Little Farm, Harare):',
      ...myDaySessions.map(s => `• ${s.start} - ${s.end}: ${s.title} (${s.zoneName})`)
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-16">
      {/* Streamlined Event Banner with Photographic Background & Warm Scrim */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-amber-900/40 shadow-2xl">
        <img
          src={bgConfig.programmeSection}
          alt="Festival Grounds"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center scale-102"
        />
        {/* Soft warm gradient overlay for clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-amber-950/80 to-emerald-950/85" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <MulticolorTitle
            text="Festival Programme"
            as="h1"
            className="text-fluid-h1 font-kid font-black tracking-wide drop-shadow-md break-words"
            bounceOnMount={true}
          />
          <p className="text-fluid-base text-slate-200 font-medium">
            Saturday 5 December 2026 · 10:00 AM – 5:00 PM CAT. 22 sessions across five play sectors at The Little Farm.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenBooking}
            className="min-h-[44px] px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-fluid-btn transition cursor-pointer shadow-md active:scale-98 flex items-center justify-center"
          >
            Book Passes ($25)
          </button>
        </div>
      </div>

      {/* Timetable Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Filterable Schedule */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-xl sm:text-2xl font-kid font-black text-slate-900 tracking-wide flex items-center gap-2">
                <span>Festival Footpath</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-sans px-2.5 py-0.5 rounded-full font-bold">
                  {filteredSessions.length} {filteredSessions.length === 1 ? 'Session' : 'Sessions'}
                </span>
              </h2>

              {/* View/Print Phone Schedule Button */}
              {myDay.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSummaryModal(true)}
                  className="min-h-[40px] px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 self-start sm:self-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Save Schedule ({myDay.length})</span>
                </button>
              )}
            </div>

            {/* Comprehensive Quick Filters: Zone, Time, Age */}
            <div className="space-y-3">
              {/* Filter 1: Zones / Sectors */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sector / Zone:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Sectors' },
                    { id: 'stage', label: '🎪 Stage' },
                    { id: 'baby', label: '👶 Baby (6M–2Y)' },
                    { id: 'adventure', label: '🏰 Adventure' },
                    { id: 'creative', label: '🎨 Creative' },
                    { id: 'discovery', label: '🔬 STEM' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedZone(f.id)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center active:scale-95 ${
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

              {/* Filter 2: Time of Day */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Time of Day:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Day (10–17)' },
                    { id: 'morning', label: '🌅 Morning (10–12)' },
                    { id: 'midday', label: '☀️ Midday & Lunch (12–14)' },
                    { id: 'afternoon', label: '🌤️ Afternoon (14–17)' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTimeFilter(t.id)}
                      className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center active:scale-95 ${
                        timeFilter === t.id
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Winding Footpath Schedule: Dashed Trail with Organic Leaf / Footprint Trail Markers */}
          <div className="relative pl-6 sm:pl-8 py-2">
            {/* Winding Dashed Footpath SVG Border */}
            <div
              aria-hidden="true"
              className="absolute left-3.5 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-emerald-400/70 pointer-events-none"
              style={{ strokeDasharray: '6 6' }}
            />

            <div className="space-y-4">
              {filteredSessions.map((session, idx) => {
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
                    className="relative group flex items-start gap-3 sm:gap-4"
                  >
                    {/* Footprint / Leaf Node along the dashed trail */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-6 sm:-left-8 top-4 w-7 h-7 -translate-x-1/2 rounded-full bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center text-xs select-none group-hover:scale-110 transition-transform"
                    >
                      <span>{getFootprintEmoji(idx)}</span>
                    </div>

                    {/* Session Card */}
                    <div className="flex-1 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 diorama-lift">
                      <div className="flex items-start sm:items-center gap-3">
                        <Tooltip content={`Sector: ${session.zoneName}`}>
                          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 cursor-help border border-slate-200">
                            <ZoneIcon className="w-5 h-5 text-emerald-700" />
                          </div>
                        </Tooltip>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>{session.start} – {session.end}</span>
                            </span>
                            <span className="sticker-badge text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {session.zoneName}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mt-1 leading-snug">
                            {session.title}
                          </h3>

                          {session.description && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 font-medium">
                              {session.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                        <Tooltip content="Fly camera to this zone in 3D">
                          <button
                            type="button"
                            onClick={() => onInspectZone3D(zoneMapId)}
                            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer flex items-center justify-center active:scale-95 border border-slate-200"
                            aria-label="3D View"
                          >
                            <MapPin className="w-4 h-4 text-amber-600" />
                          </button>
                        </Tooltip>

                        <button
                          type="button"
                          onClick={() => toggleSession(session.id)}
                          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
                            isAdded
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          <span>{isAdded ? 'Added' : 'Add to Day'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Planner & Summary */}
        <div className="bg-[#f5f4ee] border border-slate-300 rounded-3xl p-5 space-y-4 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-300/80 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Personal Itinerary
              </span>
              <h3 className="text-lg sm:text-xl font-kid font-black text-slate-900 tracking-wide">
                My Day ({myDay.length})
              </h3>
            </div>
            {myDay.length > 0 && (
              <button
                type="button"
                onClick={() => setMyDay([])}
                className="min-h-[38px] px-2.5 text-xs text-slate-500 hover:text-rose-600 cursor-pointer font-semibold flex items-center"
              >
                Clear All
              </button>
            )}
          </div>

          {myDaySessions.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <span className="text-2xl block">🎒</span>
              <p className="text-xs text-slate-600 font-medium">
                Tap <strong>+ Add to Day</strong> on any activity along the footpath to build your family schedule!
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {myDaySessions.map(session => (
                <div
                  key={session.id}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-800">
                      {session.start} · {session.zoneName}
                    </span>
                    <div className="font-bold text-slate-900 text-fluid-xs line-clamp-1 leading-snug break-words">
                      {session.title}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSession(session.id)}
                    className="w-8 h-8 text-slate-400 hover:text-rose-600 text-sm font-bold flex items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100"
                    aria-label="Remove session"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {myDaySessions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSummaryModal(true)}
              className="w-full min-h-[44px] py-2 px-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Save Schedule to Phone</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-300/80">
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full min-h-[44px] py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-sm text-center flex items-center justify-center active:scale-98"
            >
              Book Passes ($25)
            </button>
          </div>
        </div>
      </div>

      {/* Save Schedule to Phone / Printable Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#faf9f5] border border-slate-300 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto text-slate-900 relative p-6 space-y-4">
            <button
              type="button"
              onClick={() => setShowSummaryModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="sticker-badge inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Family Festival Itinerary</span>
              </span>
              <h3 className="font-kid font-black text-2xl text-slate-900">
                Bambino Wonder Day
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Saturday 5 December 2026 · The Little Farm, Meyrick Park, Harare
              </p>
            </div>

            {/* Perforated Printable Ticket Itinerary */}
            <div className="ticket-stub bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  YOUR SAVED SCHEDULE ({myDaySessions.length} SESSIONS)
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-700">
                  10:00 AM - 5:00 PM
                </span>
              </div>

              <div className="space-y-2.5 divide-y divide-slate-100">
                {myDaySessions.map(s => (
                  <div key={s.id} className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 font-['Outfit']">{s.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{s.zoneName}</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      {s.start}–{s.end}
                    </span>
                  </div>
                ))}
              </div>

              <div className="ticket-tear-line my-3" />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Passes include lunch &amp; all 5 zones</span>
                <span className="font-mono font-bold text-amber-600">bambinoworld.co.zw</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopySchedule}
                className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                {copiedSchedule ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedSchedule ? 'Copied to Clipboard!' : 'Copy Text Summary'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[44px] px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventProgrammeView;
