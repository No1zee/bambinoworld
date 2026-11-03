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
  Calendar,
  ArrowRight,
  Ticket
} from 'lucide-react';
import { PROGRAMME_SESSIONS } from '../data/festivalData';
import { soundscape } from '../utils/soundscape';

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

  // Filter sessions by zone, time of day, and age category
  const filteredSessions = PROGRAMME_SESSIONS.filter(s => {
    if (selectedZone !== 'all' && s.zone !== selectedZone) return false;

    const startHour = parseInt(s.start.split(':')[0], 10);
    if (timeFilter === 'morning' && startHour >= 12) return false;
    if (timeFilter === 'midday' && (startHour < 12 || startHour >= 14)) return false;
    if (timeFilter === 'afternoon' && startHour < 14) return false;

    if (ageFilter === 'baby' && s.zone !== 'baby') return false;
    if (ageFilter === 'kids' && s.zone !== 'adventure' && s.zone !== 'creative' && s.zone !== 'discovery') return false;
    if (ageFilter === 'stage' && s.zone !== 'stage') return false;

    return true;
  });

  const toggleSession = (id: string) => {
    setMyDay(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const myDaySessions = PROGRAMME_SESSIONS.filter(s => myDay.includes(s.id)).sort(
    (a, b) => a.start.localeCompare(b.start)
  );

  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'baby': return Baby;
      case 'adventure': return Castle;
      case 'creative': return Palette;
      case 'discovery': return FlaskConical;
      case 'stage': return Music2;
      default: return Sparkles;
    }
  };

  const handleCopySchedule = () => {
    const lines = [
      '🎪 Bambino World Festival Schedule',
      'Saturday 5 December 2026 · The Little Farm, Harare',
      '----------------------------------------',
      ...myDaySessions.map(
        s => `• ${s.start} - ${s.end} | ${s.title} (${s.zoneName})`
      ),
      '----------------------------------------',
      'Location: 5 Richwell Ave, Meyrick Park, Mabelreign, Harare'
    ].join('\n');

    navigator.clipboard?.writeText(lines);
    setCopiedSchedule(true);
    soundscape.playMarimbaClick(700, 0.06);
    setTimeout(() => setCopiedSchedule(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans pb-24">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <h1 className="font-poppins font-black text-3xl sm:text-4xl lg:text-5xl text-[#31006F] tracking-tight">
            Event Programme
          </h1>
          <p className="font-sans text-base text-slate-600 max-w-2xl">
            A full day of structured activities, sensory storytelling, foam adventures, marimba concerts, and science workshops from 10:00 AM to 5:00 PM.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundscape.playMarimbaClick(650, 0.08);
              onOpenBooking();
            }}
            className="thompson-pill-btn thompson-pill-orange px-6 py-3 text-sm font-bold shadow-md"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Passes ($25)</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Strip */}
      <div className="thompson-card p-5 space-y-4">
        {/* Zone Filters */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Zones' },
              { id: 'baby', label: 'The Little Garden' },
              { id: 'adventure', label: 'Adventure Zone' },
              { id: 'creative', label: 'Creative Studio' },
              { id: 'discovery', label: 'Discovery World' },
              { id: 'stage', label: 'Celebration Stage' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  soundscape.playMarimbaClick(480, 0.03);
                  setSelectedZone(f.id);
                }}
                className={`px-4 py-2 rounded-full font-poppins text-xs font-bold transition cursor-pointer ${
                  selectedZone === f.id
                    ? 'bg-[#31006F] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time of Day & Age Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Any Time' },
                { id: 'morning', label: 'Morning (10am–12pm)' },
                { id: 'midday', label: 'Midday (12pm–2pm)' },
                { id: 'afternoon', label: 'Afternoon (2pm–5pm)' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundscape.playMarimbaClick(480, 0.03);
                    setTimeFilter(t.id);
                  }}
                  className={`px-3 py-1.5 rounded-full font-poppins text-xs font-semibold transition cursor-pointer ${
                    timeFilter === t.id
                      ? 'bg-[#FF6720] text-white font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-poppins text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Age Group
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Ages' },
                { id: 'baby', label: 'Under 2 Years' },
                { id: 'kids', label: 'Ages 3 to 12' },
                { id: 'stage', label: 'Family Shows' }
              ].map(a => (
                <button
                  key={a.id}
                  onClick={() => {
                    soundscape.playMarimbaClick(480, 0.03);
                    setAgeFilter(a.id);
                  }}
                  className={`px-3 py-1.5 rounded-full font-poppins text-xs font-semibold transition cursor-pointer ${
                    ageFilter === a.id
                      ? 'bg-[#2F532E] text-white font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Schedule & Personal Planner Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sessions List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins font-bold text-xl text-[#31006F]">
              Showing {filteredSessions.length} Activities
            </h2>
            <span className="text-xs font-poppins font-semibold text-slate-500">
              Saturday 5 Dec · Harare
            </span>
          </div>

          <div className="space-y-3">
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
                  className="thompson-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="thompson-badge bg-slate-100 text-[#31006F] text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{session.start} – {session.end}</span>
                      </span>
                      <span className="thompson-badge bg-[#31006F]/10 text-[#31006F] text-[10px]">
                        {session.zoneName}
                      </span>
                      {session.age && (
                        <span className="text-[11px] font-poppins font-semibold text-slate-500">
                          {session.age}
                        </span>
                      )}
                    </div>

                    <h3 className="font-poppins font-bold text-lg text-slate-900 leading-snug">
                      {session.title}
                    </h3>

                    {session.description && (
                      <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {session.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        soundscape.playMarimbaClick(560, 0.05);
                        onInspectZone3D(zoneMapId);
                      }}
                      className="thompson-pill-btn thompson-pill-outline-purple px-4 py-2 text-xs font-bold"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{session.zoneName}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundscape.playMarimbaClick(isAdded ? 480 : 660, 0.06);
                        toggleSession(session.id);
                      }}
                      className={`thompson-pill-btn px-4 py-2 text-xs font-bold shadow-xs ${
                        isAdded
                          ? 'bg-[#2F532E] text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isAdded ? 'Added' : 'Add to Day'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Planner Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="thompson-card p-6 space-y-4 shadow-md border-t-4 border-t-[#31006F]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-poppins text-[10px] font-bold text-[#FF6720] uppercase tracking-wider block">
                  PERSONAL ITINERARY
                </span>
                <h3 className="font-poppins font-bold text-xl text-[#31006F]">
                  My Day ({myDay.length})
                </h3>
              </div>
              {myDay.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMyDay([])}
                  className="text-xs font-poppins font-bold text-slate-400 hover:text-rose-600 transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {myDaySessions.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {myDaySessions.map(session => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-poppins text-[10px] font-bold text-[#31006F] block">
                        {session.start} · {session.zoneName}
                      </span>
                      <div className="font-poppins font-bold text-slate-900 truncate">
                        {session.title}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSession(session.id)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                      aria-label="Remove session"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {myDaySessions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSummaryModal(true)}
                  className="w-full thompson-pill-btn thompson-pill-purple py-2.5 text-xs font-bold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share / Save Schedule</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full thompson-pill-btn thompson-pill-orange py-3 text-xs font-bold shadow-md"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Festival Passes</span>
            </button>
          </div>
        </div>

      </div>

      {/* Share / Save Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="thompson-card p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-poppins font-bold text-xl text-[#31006F]">
                Your Family Itinerary
              </h3>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {myDaySessions.map(s => (
                <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans">
                  <div className="font-poppins font-bold text-[#31006F]">
                    {s.start} – {s.end} · {s.zoneName}
                  </div>
                  <div className="font-semibold text-slate-800">{s.title}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopySchedule}
                className="flex-1 thompson-pill-btn thompson-pill-purple py-2.5 text-xs font-bold"
              >
                {copiedSchedule ? 'Copied to Clipboard!' : 'Copy Schedule Text'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="thompson-pill-btn bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventProgrammeView;
