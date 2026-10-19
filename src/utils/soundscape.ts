// High-performance Web Audio API Soundscape for Bambino World
// 100% synthesized - zero external audio dependencies, zero network requests, 0ms latency.
// Behavior:
// 1. Plays a warm, joyful 5-second acoustic Zimbabwean marimba tune on first interaction.
// 2. After 5 seconds, all autonomous sound stops.
// 3. From then on, gentle wooden marimba notes play only when hovering above CTAs and buttons.

class SoundscapeManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hasIntroTunePlayed: boolean = false;
  private hoverNoteIndex: number = 0;
  private listenersAttached: boolean = false;
  private lastHoverTime: number = 0;

  // Authentic pentatonic scale for warm Zimbabwean marimba notes
  private readonly HOVER_SCALE = [
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99  // G5
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.attachInitialListeners();
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private attachInitialListeners() {
    if (this.listenersAttached || typeof window === 'undefined') return;
    this.listenersAttached = true;

    // Trigger the 5-second intro marimba tune on the very first user interaction
    const handleFirstGesture = () => {
      if (!this.hasIntroTunePlayed) {
        this.initContext();
        this.play5SecondIntroTune();
      }
      // Remove one-time gesture listeners
      ['pointerdown', 'keydown', 'touchstart'].forEach(evt => {
        window.removeEventListener(evt, handleFirstGesture);
      });
    };

    ['pointerdown', 'keydown', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, handleFirstGesture, { passive: true });
    });

    // Global CTA Hover Listener: plays a gentle marimba note when hovering buttons or CTAs
    document.addEventListener('mouseover', (e: MouseEvent) => {
      if (this.isMuted) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target or ancestor is a button, link, CTA, or callout
      const ctaEl = target.closest('button, a, [role="button"], .map-callout');
      if (ctaEl) {
        const now = Date.now();
        // Debounce hovers slightly (at least 90ms between notes) so rapid movements feel musical, not spammy
        if (now - this.lastHoverTime > 90) {
          this.lastHoverTime = now;
          this.playCtaHover();
        }
      }
    }, { passive: true });
  }

  // Plays a charming 5-second Zimbabwean marimba melodic tune once
  public play5SecondIntroTune() {
    if (this.isMuted || this.hasIntroTunePlayed) return;
    this.hasIntroTunePlayed = true;
    this.initContext();
    if (!this.ctx) return;

    // 5-second marimba melodic phrase (rhythmic, warm, authentic wooden mallets)
    // 15 gentle notes spaced across 4.6 seconds, resolving and ending at 5.0 seconds
    const tuneMelody = [
      { note: 392.00, delay: 0 },     // G4
      { note: 523.25, delay: 280 },   // C5
      { note: 659.25, delay: 560 },   // E5
      { note: 587.33, delay: 840 },   // D5
      { note: 783.99, delay: 1120 },  // G5
      { note: 659.25, delay: 1400 },  // E5
      { note: 523.25, delay: 1680 },  // C5
      { note: 440.00, delay: 1960 },  // A4
      { note: 523.25, delay: 2280 },  // C5
      { note: 659.25, delay: 2600 },  // E5
      { note: 783.99, delay: 2920 },  // G5
      { note: 880.00, delay: 3240 },  // A5
      { note: 783.99, delay: 3620 },  // G5
      { note: 659.25, delay: 4020 },  // E5
      { note: 523.25, delay: 4420 }   // C5 (resolving home note, decays by 5.0s)
    ];

    tuneMelody.forEach(({ note, delay }) => {
      setTimeout(() => {
        if (!this.isMuted) {
          this.playMarimbaTone(note, 0.055, 0.24);
        }
      }, delay);
    });
  }

  // Soft resonant marimba note when hovering above CTAs
  public playCtaHover(noteIdx?: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Cycle through melodic pentatonic notes on each hover
    const freq = noteIdx !== undefined
      ? this.HOVER_SCALE[noteIdx % this.HOVER_SCALE.length]
      : this.HOVER_SCALE[this.hoverNoteIndex % this.HOVER_SCALE.length];
    this.hoverNoteIndex++;

    this.playMarimbaTone(freq, 0.038, 0.15);
  }

  // Core synthesizer for warm wooden marimba mallet strike
  private playMarimbaTone(freq: number, volume: number = 0.05, duration: number = 0.18) {
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Triangle oscillator gives warm wooden resonance with gentle fundamental
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.96, now + duration * 0.85);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Safe fallback
    }
  }

  // Soft organic Zimbabwean marimba / wooden click for active presses
  public playMarimbaClick(freq: number = 523.25, volume: number = 0.06) {
    if (this.isMuted) return;
    this.initContext();
    this.playMarimbaTone(freq, volume, 0.16);
  }

  // Playful celebratory festival chime
  public playFestivalChime() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMarimbaClick(freq, 0.07);
      }, idx * 60);
    });
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playMarimbaClick(523.25, 0.06);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundscape = new SoundscapeManager();
