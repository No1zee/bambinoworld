import React, { useState, useEffect, useCallback } from 'react';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export interface FestivalBloomProps {
  intensity?: number;
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
}

/**
 * Reusable Festival Bloom component using @react-three/postprocessing
 * Creates warm, golden magical festival sunlight bloom aligning with Bambino World aesthetic
 */
export const FestivalBloom: React.FC<FestivalBloomProps> = ({
  intensity = 0.55,
  luminanceThreshold = 0.82,
  luminanceSmoothing = 0.4
}) => {
  return (
    <EffectComposer>
      <Bloom
        intensity={intensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur
      />
    </EffectComposer>
  );
};

/* ==========================================================================
   INTERACTIVE TAP/CLICK PETAL BURST SYSTEM
   Spawns 4–5 floating petals, leaves, and sparkles around pointer coordinates
   ========================================================================== */

interface PetalParticle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotation: number;
  dr: number;
  scale: number;
  symbol: string;
  color: string;
}

type BurstListener = (x: number, y: number) => void;
const burstListeners = new Set<BurstListener>();

/**
 * Programmatically trigger a petal burst at screen coordinates (e.g., from button click or zone select)
 */
export function triggerPetalBurst(x: number, y: number) {
  burstListeners.forEach(listener => listener(x, y));
}

const BURST_SYMBOLS = ['🌸', '🍃', '✨', '🌼', '🌿'];
const BURST_COLORS = ['#f472b6', '#34d399', '#facc15', '#fbbf24', '#a78bfa'];

/**
 * Global lightweight viewport overlay that renders active petal bursts
 */
export const FestivalBloomOverlay: React.FC = () => {
  const [particles, setParticles] = useState<PetalParticle[]>([]);

  const spawnBurst = useCallback((x: number, y: number) => {
    // Check if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const count = 5;
    const now = Date.now();
    const newParticles: PetalParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
      const speed = 40 + Math.random() * 60;
      newParticles.push({
        id: now + i + Math.random(),
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 35, // biased slightly upwards against gravity
        rotation: Math.random() * 360,
        dr: (Math.random() - 0.5) * 180,
        scale: 0.8 + Math.random() * 0.45,
        symbol: BURST_SYMBOLS[i % BURST_SYMBOLS.length],
        color: BURST_COLORS[i % BURST_COLORS.length]
      });
    }

    setParticles(prev => [...prev.slice(-25), ...newParticles]);

    // Self-cleanup after animation completes
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 850);
  }, []);

  useEffect(() => {
    burstListeners.add(spawnBurst);
    return () => {
      burstListeners.delete(spawnBurst);
    };
  }, [spawnBurst]);

  // Global click delegate for primary buttons and play zones
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const triggerEl = target.closest('button, [data-petal="true"], .sticker-badge, .diorama-lift');
      if (triggerEl) {
        spawnBurst(e.clientX, e.clientY);
      }
    };

    window.addEventListener('click', handleGlobalClick, { passive: true });
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [spawnBurst]);

  if (particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden"
    >
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute block select-none transform-gpu animate-petal-drift"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${18 * p.scale}px`,
            color: p.color,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--dr': `${p.dr}deg`,
            '--init-rot': `${p.rotation}deg`
          } as React.CSSProperties}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};

export default FestivalBloom;
