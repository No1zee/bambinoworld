import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Navigation } from './components/Navigation';
import { HomeHero } from './components/HomeHero';
import { PlayZonesView } from './components/PlayZonesView';
import { EventProgrammeView } from './components/EventProgrammeView';
import { TheLittleFarmView } from './components/TheLittleFarmView';
import { ZoneInspectorDrawer } from './components/ZoneInspectorDrawer';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import type { SiteMap3DHandle } from './components/SiteMap3D';
import { FestivalBloomOverlay } from './components/FestivalBloom';
import { Booking } from './types/festival';

// Code-split 3D engine components via React.lazy() for fast initial load
const SiteMap3D = lazy(() => import('./components/SiteMap3D'));
const FullScreen3DView = lazy(() =>
  import('./components/FullScreen3DView').then(m => ({ default: m.FullScreen3DView }))
);

/**
 * Storybook Farm-Map Loading Skeleton
 */
const FarmMapSkeleton: React.FC = () => (
  <div className="absolute inset-0 bg-[#141e18] flex flex-col items-center justify-center p-6 text-white z-20">
    <div className="sticker-badge p-6 sm:p-8 bg-slate-900/90 border-2 border-amber-400 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center backdrop-blur-md animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
        🎪
      </div>
      <div className="space-y-1">
        <h3 className="font-kid font-black text-lg text-amber-300">
          Entering The Little Farm
        </h3>
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          Rendering miniature diorama grounds, shaded pergolas, and active play zones...
        </p>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10 mt-1">
        <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-2/3 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

export default function App() {
  // Read initial tab and zone from URL query parameters
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window === 'undefined') return 'home';
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const validTabs = ['home', '3d-map', 'december-5', 'zones', 'farm'];
    return view && validTabs.includes(view) ? view : 'home';
  });

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('zone');
  });

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('bambino_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const siteMapRef = useRef<SiteMap3DHandle | null>(null);

  // Sync state changes with URL query parameters (?view=...&zone=...)
  const updateUrlParams = (tab: string, zone: string | null) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (tab === 'home') {
        url.searchParams.delete('view');
      } else {
        url.searchParams.set('view', tab);
      }
      if (zone) {
        url.searchParams.set('zone', zone);
      } else {
        url.searchParams.delete('zone');
      }
      window.history.pushState({ tab, zone }, '', url.toString());
    } catch {}
  };

  // Support natural browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') || 'home';
      const zone = params.get('zone');
      setCurrentTab(view);
      setSelectedZoneId(zone);
      setIsBookingOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedZoneId(null);
    updateUrlParams(tab, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    siteMapRef.current?.animateCameraForTab(tab);
  };

  const handleTimeOfDayChange = (mode: 'day' | 'sunset' | 'night') => {
    setTimeOfDay(mode);
    siteMapRef.current?.setLighting(mode);
  };

  const handleInspectZone3D = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setCurrentTab('3d-map');
    updateUrlParams('3d-map', zoneId);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (zoneId) {
        siteMapRef.current?.focusZone(zoneId);
      }
    }, 60);
  };

  const handleOpen3DMap = (zoneId?: string) => {
    setCurrentTab('3d-map');
    updateUrlParams('3d-map', zoneId || null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (zoneId) {
        setSelectedZoneId(zoneId);
        siteMapRef.current?.focusZone(zoneId);
      } else {
        siteMapRef.current?.animateCameraForTab('3d-map');
      }
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-slate-900 font-sans selection:bg-amber-300 selection:text-slate-950 relative">
      {/* Interactive Tap/Click Petal Burst Layer */}
      <FestivalBloomOverlay />

      {/* 1. SINGLE PERSISTENT 3D WORLD CANVAS (Root WebGL Scene - Persistent & Zero Unmounting) */}
      <div
        className={`fixed inset-0 transition-opacity duration-700 ease-in-out ${
          currentTab === '3d-map'
            ? 'z-20 pointer-events-auto opacity-100'
            : 'z-0 pointer-events-none opacity-0'
        }`}
        aria-hidden={currentTab !== '3d-map'}
      >
        <Suspense fallback={<FarmMapSkeleton />}>
          <SiteMap3D
            ref={siteMapRef}
            onSelectZone={handleInspectZone3D}
            onDeselectZone={() => {
              setSelectedZoneId(null);
              updateUrlParams('3d-map', null);
            }}
            activeZoneId={selectedZoneId}
            isCinemaMode={currentTab === '3d-map'}
            onToggleCinema={() => handleTabChange('home')}
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Top Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onOpenBooking={() => handleOpenBooking()}
        bookingCount={bookings.length}
        timeOfDay={timeOfDay}
        onTimeOfDayChange={handleTimeOfDayChange}
      />

      {/* Main Content Area */}
      <main className={`flex-1 relative ${currentTab === '3d-map' ? 'z-30 pointer-events-none' : 'z-10 pb-16 sm:pb-0'}`}>
        {currentTab === 'home' && (
          <HomeHero
            siteMapRef={siteMapRef}
            onOpen3DMap={handleOpen3DMap}
            onOpenBooking={handleOpenBooking}
            onSelectZone={setSelectedZoneId}
          />
        )}

        {currentTab === '3d-map' && (
          <Suspense fallback={null}>
            <FullScreen3DView
              siteMapRef={siteMapRef}
              onBackToSite={() => {
                setSelectedZoneId(null);
                handleTabChange('home');
              }}
              onSelectZone={handleInspectZone3D}
              activeZoneId={selectedZoneId}
              onOpenBooking={() => handleOpenBooking()}
            />
          </Suspense>
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
        onClose={() => {
          setSelectedZoneId(null);
          updateUrlParams(currentTab, null);
        }}
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

      {/* Mobile Sticky Booking Bar */}
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
              <span className="font-kid font-bold text-fluid-xs text-white leading-tight">
                Bambino World
              </span>
              <span className="text-fluid-badge text-amber-300 font-semibold leading-tight">
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

      {/* Footer */}
      {currentTab !== '3d-map' && (
        <Footer
          onTabChange={tab => {
            handleTabChange(tab);
          }}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
      )}
    </div>
  );
}
