import React, { useEffect, useRef, useState } from 'react';

export interface CursorPortalItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  tag?: string;
  tagColor?: string;
}

interface FloatingCursorPortalProps {
  activeItem: CursorPortalItem | null;
}

export const FloatingCursorPortal: React.FC<FloatingCursorPortalProps> = ({ activeItem }) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);
  const [renderedItem, setRenderedItem] = useState<CursorPortalItem | null>(null);

  // Smooth lerp physics state
  const coords = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0, vx: 0, vy: 0 });
  const animFrame = useRef<number | null>(null);

  // Check if device supports fine hover pointer and user hasn't requested reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setCanHover(hoverQuery.matches && !motionQuery.matches);

    const updateHover = () => setCanHover(hoverQuery.matches && !motionQuery.matches);
    hoverQuery.addEventListener('change', updateHover);
    motionQuery.addEventListener('change', updateHover);
    return () => {
      hoverQuery.removeEventListener('change', updateHover);
      motionQuery.removeEventListener('change', updateHover);
    };
  }, []);

  // Retain last active item during exit fade-out
  useEffect(() => {
    if (activeItem) {
      setRenderedItem(activeItem);
    }
  }, [activeItem]);

  // Pointer move tracking with spring lerp
  useEffect(() => {
    if (!canHover) return;

    const handlePointerMove = (e: PointerEvent) => {
      coords.current.targetX = e.clientX + 24; // Offset to bottom-right of cursor
      coords.current.targetY = e.clientY - 90;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const tick = () => {
      const c = coords.current;
      const ease = 0.12;

      const prevX = c.currentX;
      const prevY = c.currentY;

      c.currentX += (c.targetX - c.currentX) * ease;
      c.currentY += (c.targetY - c.currentY) * ease;

      c.vx = c.currentX - prevX;
      c.vy = c.currentY - prevY;

      // Subtle directional tilt based on cursor velocity (max ±6 deg)
      const tiltX = Math.max(-6, Math.min(6, c.vy * 0.4));
      const tiltY = Math.max(-6, Math.min(6, -c.vx * 0.4));

      if (portalRef.current) {
        portalRef.current.style.transform = `translate3d(${c.currentX}px, ${c.currentY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      animFrame.current = requestAnimationFrame(tick);
    };

    animFrame.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [canHover]);

  if (!canHover || !renderedItem) return null;

  const isVisible = Boolean(activeItem);

  return (
    <div
      ref={portalRef}
      aria-hidden="true"
      style={{
        willChange: 'transform, opacity',
        perspective: '800px'
      }}
      className={`fixed top-0 left-0 z-50 pointer-events-none transition-opacity duration-300 ease-out select-none ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="w-56 sm:w-64 h-36 sm:h-40 rounded-2xl overflow-hidden border border-white/35 bg-[#122219] shadow-[0_24px_50px_-10px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.35)] flex flex-col justify-between">
        {/* Photographic Scenery */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={renderedItem.image}
            alt={renderedItem.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Subtle sunlit gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Top Tag & Geographic Pill */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
            {renderedItem.tag ? (
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${renderedItem.tagColor || 'bg-amber-400 text-slate-950'}`}>
                {renderedItem.tag}
              </span>
            ) : <span />}
            <span className="font-mono text-[9px] font-bold text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
              EXPLORE ↗
            </span>
          </div>

          {/* Bottom Title & Subtitle */}
          <div className="absolute bottom-2.5 inset-x-2.5 space-y-0.5">
            <h4 className="font-kid font-bold text-sm text-white drop-shadow-sm truncate">
              {renderedItem.title}
            </h4>
            {renderedItem.subtitle && (
              <p className="text-[10px] text-amber-200 font-medium truncate">
                {renderedItem.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
