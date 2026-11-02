import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.2
  });

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  return lenisInstance;
}

export function getSmoothScroll(): Lenis | null {
  return lenisInstance;
}
