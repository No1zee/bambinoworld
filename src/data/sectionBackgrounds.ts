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
    'little-garden': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
    'adventure-zone': 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1600&q=80',
    'creative-zone': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
    'discovery-world': 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=1600&q=80',
    'celebration-stage': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80'
  }
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
