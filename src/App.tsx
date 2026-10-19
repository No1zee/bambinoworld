import React, { useState, useRef, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomeHero } from './components/HomeHero';
import { FullScreen3DView } from './components/FullScreen3DView';
import { PlayZonesView } from './components/PlayZonesView';
import { EventProgrammeView } from './components/EventProgrammeView';
import { TheLittleFarmView } from './components/TheLittleFarmView';
import { ZoneInspectorDrawer } from './components/ZoneInspectorDrawer';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { SiteMap3DHandle } from './components/SiteMap3D';
import { Booking } from './types/festival';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('bambino_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const siteMapRef = useRef<SiteMap3DHandle | null>(null);

  // Load existing bookings from server
  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (data.bookings && Array.isArray(data.bookings) && data.bookings.length > 0) {
          setBookings(prev => {
            const ids = new Set(prev.map(b => b.id));
            const merged = [...prev];
            data.bookings.forEach((b: Booking) => {
              if (!ids.has(b.id)) merged.push(b);
            });
            return merged;
          });
        }
      })
      .catch(() => {
        // Fallback to local state
      });
  }, []);

  const [bookingChildCount, setBookingChildCount] = useState<number>(1);

  const handleOpenBooking = (childCount?: number) => {
    if (childCount && childCount > 0) {
      setBookingChildCount(childCount);
    }
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem('bambino_bookings', JSON.stringify(updated));
    } catch {}
  };

  const handleInspectZone3D = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    if (currentTab !== '3d-map' && currentTab !== 'home') {
      setCurrentTab('3d-map');
    }
    // Small timeout to allow 3D canvas to mount if switching tabs
    setTimeout(() => {
      siteMapRef.current?.focusZone(zoneId);
    }, 150);
  };

  const handleOpen3DMap = (zoneId?: string) => {
    setCurrentTab('3d-map');
    if (zoneId) {
      setSelectedZoneId(zoneId);
      setTimeout(() => {
        siteMapRef.current?.focusZone(zoneId);
      }, 150);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-slate-900 font-sans selection:bg-amber-300 selection:text-slate-950">
      {/* Top Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => handleOpenBooking()}
        bookingCount={bookings.length}
      />

      {/* Main Content Area - with safe bottom clearance on mobile for sticky booking bar */}
      <main className={`flex-1 ${currentTab !== '3d-map' ? 'pb-16 sm:pb-0' : ''}`}>
        {currentTab === 'home' && (
          <HomeHero
            siteMapRef={siteMapRef}
            onOpen3DMap={handleOpen3DMap}
            onOpenBooking={handleOpenBooking}
            onSelectZone={setSelectedZoneId}
          />
        )}

        {currentTab === '3d-map' && (
          <FullScreen3DView
            siteMapRef={siteMapRef}
            onBackToSite={() => setCurrentTab('home')}
            onSelectZone={setSelectedZoneId}
            activeZoneId={selectedZoneId}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentTab === 'december-5' && (
          <EventProgrammeView
            onInspectZone3D={handleInspectZone3D}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentTab === 'zones' && (
          <PlayZonesView
            onInspectZone3D={handleInspectZone3D}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentTab === 'farm' && (
          <TheLittleFarmView
            onOpen3DMap={() => handleOpen3DMap()}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}
      </main>

      {/* Slide-over Zone Inspector Drawer */}
      <ZoneInspectorDrawer
        zoneId={selectedZoneId}
        onClose={() => setSelectedZoneId(null)}
        onSelectZone={handleInspectZone3D}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        initialChildCount={bookingChildCount}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Mobile Sticky Booking Bar (omitted on 3D map tab so it never obscures the map) */}
      {currentTab !== '3d-map' && (
        <aside
          aria-label="Quick Booking"
          className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl py-2 px-3 transition-all duration-200"
          style={{
            paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
            paddingBottom: 'max(0.45rem, env(safe-area-inset-bottom, 0px))'
          }}
        >
          <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
            <div className="flex flex-col min-w-0">
              <span className="font-kid font-bold text-xs text-white leading-tight truncate">
                Bambino World
              </span>
              <span className="text-[10px] text-amber-300 font-semibold leading-tight truncate">
                5 Dec · Early Bird $25
              </span>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="h-8 px-3 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-transform cursor-pointer shrink-0"
            >
              <span>Book Pass ($25)</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </aside>
      )}

      {/* Footer (omitted on full-screen 3D map for maximum viewport immersion) */}
      {currentTab !== '3d-map' && (
        <Footer
          onTabChange={tab => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
      )}
    </div>
  );
}
