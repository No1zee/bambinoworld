export interface SectionBackgroundConfig {
  playZonesSection: string;
  programmeSection: string;
  zoneCards: {
    'little-garden': string;
    'adventure-zone': string;
    'creative-zone': string;
    'discovery-world': string;
    'celebration-stage': string;
  };
}

export const DEFAULT_SECTION_BACKGROUNDS: SectionBackgroundConfig = {
  // Scenic outdoor festival park atmosphere with mature shade trees
  playZonesSection: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=2000&q=80',
  
  // Outdoor garden festival stage and acoustic canopy under golden sunlight
  programmeSection: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80',
  
  // Individual Play Zone photographic backdrops
  zoneCards: {
    'little-garden': '/little-garden.jpg',
    'adventure-zone': 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80',
    'creative-zone': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
    'discovery-world': 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80',
    'celebration-stage': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80'
  }
};

/**
 * Storybook Festival & Miniature Diorama Dynamic Sunlit-to-Golden-Hour Ambient Gradients.
 * Transitions smoothly from crisp morning meadow sunshine in the hero
 * to a rich, warm golden-hour dusk near the tickets and footer.
 */
export interface AmbientGradientConfig {
  hero: string;
  highlights: string;
  playZones: string;
  siteMap: string;
  farm: string;
  programme: string;
  tickets: string;
  footer: string;
}

export const SECTION_AMBIENT_GRADIENTS: AmbientGradientConfig = {
  // Crisp morning meadow sunshine bleed with soft sky radiance
  hero: 'radial-gradient(circle at 50% 0%, rgba(254, 240, 138, 0.28), rgba(255, 255, 255, 0.05) 55%, transparent 75%)',
  
  // Bright mid-morning sunbeam over the tactile badges
  highlights: 'radial-gradient(circle at 50% 10%, rgba(253, 224, 71, 0.20), transparent 70%)',
  
  // Warm midday festival park radiance
  playZones: 'radial-gradient(circle at 50% 15%, rgba(251, 191, 36, 0.22), transparent 72%)',
  
  // Gentle afternoon diorama skylight
  siteMap: 'radial-gradient(circle at 50% 10%, rgba(252, 211, 77, 0.18), transparent 70%)',
  
  // Sunny pastoral warmth with lush leaf reflections
  farm: 'radial-gradient(circle at 45% 10%, rgba(251, 191, 36, 0.24), transparent 70%)',
  
  // Golden hour afternoon acoustic canopy glow
  programme: 'radial-gradient(circle at 55% 10%, rgba(245, 158, 11, 0.26), transparent 72%)',
  
  // Rich golden sunset glow over the ticket stubs
  tickets: 'radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.20), rgba(251, 191, 36, 0.12) 50%, transparent 75%)',
  
  // Warm evening lantern dusk
  footer: 'radial-gradient(circle at 50% 20%, rgba(244, 63, 94, 0.12), rgba(249, 115, 22, 0.08) 50%, transparent 80%)'
};

const STORAGE_KEY = 'bambino_section_backgrounds';

export function getStoredSectionBackgrounds(): SectionBackgroundConfig {
  if (typeof window === 'undefined') return DEFAULT_SECTION_BACKGROUNDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SECTION_BACKGROUNDS;
    const parsed = JSON.parse(raw);
    return {
      playZonesSection: parsed.playZonesSection || DEFAULT_SECTION_BACKGROUNDS.playZonesSection,
      programmeSection: parsed.programmeSection || DEFAULT_SECTION_BACKGROUNDS.programmeSection,
      zoneCards: {
        ...DEFAULT_SECTION_BACKGROUNDS.zoneCards,
        ...(parsed.zoneCards || {})
      }
    };
  } catch {
    return DEFAULT_SECTION_BACKGROUNDS;
  }
}

export function saveStoredSectionBackgrounds(config: SectionBackgroundConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save custom backgrounds to localStorage:', err);
  }
}
