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
        onOpenBooking={() => setIsBookingOpen(true)}
        bookingCount={bookings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeHero
            siteMapRef={siteMapRef}
            onOpen3DMap={handleOpen3DMap}
            onOpenBooking={() => setIsBookingOpen(true)}
            onSelectZone={setSelectedZoneId}
          />
        )}

        {currentTab === '3d-map' && (
          <FullScreen3DView
            siteMapRef={siteMapRef}
            onBackToSite={() => setCurrentTab('home')}
            onSelectZone={setSelectedZoneId}
            activeZoneId={selectedZoneId}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        )}

        {currentTab === 'december-5' && (
          <EventProgrammeView
            onInspectZone3D={handleInspectZone3D}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        )}

        {currentTab === 'zones' && (
          <PlayZonesView
            onInspectZone3D={handleInspectZone3D}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        )}

        {currentTab === 'farm' && (
          <TheLittleFarmView
            onOpen3DMap={() => handleOpen3DMap()}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        )}
      </main>

      {/* Slide-over Zone Inspector Drawer */}
      <ZoneInspectorDrawer
        zoneId={selectedZoneId}
        onClose={() => setSelectedZoneId(null)}
        onSelectZone={handleInspectZone3D}
        onOpenBooking={() => setIsBookingOpen(true)}
      />


      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

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
