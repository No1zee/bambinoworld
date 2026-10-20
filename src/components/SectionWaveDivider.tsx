import React from 'react';

export interface SectionWaveDividerProps {
  /**
   * Placement relative to the section:
   * 'top': Wave placed along the top edge of a section
   * 'bottom': Wave placed along the bottom edge of a section
   */
  position?: 'top' | 'bottom';
  /**
   * Color theme variant:
   * - 'cream-to-meadow': Warm cream into meadow green
   * - 'meadow-to-cream': Meadow green back into soft cream
   * - 'cream-to-amber': Warm cream transitioning into golden amber
   * - 'amber-to-cream': Golden amber into festival cream
   * - 'dark-to-cream': Cinematic dark scrim transitioning into light craft paper
   * - 'cream-to-dark': Craft paper transitioning into cinematic dark
   */
  variant?:
    | 'cream-to-meadow'
    | 'meadow-to-cream'
    | 'meadow-to-amber'
    | 'cream-to-amber'
    | 'amber-to-cream'
    | 'dark-to-cream'
    | 'cream-to-dark';
  className?: string;
  height?: number;
}

export const SectionWaveDivider: React.FC<SectionWaveDividerProps> = ({
  position = 'bottom',
  variant = 'cream-to-meadow',
  className = '',
  height = 42
}) => {
  // Palettes for layered hills
  const colors = {
    'cream-to-meadow': {
      back: 'rgba(236, 253, 245, 0.55)',
      mid: 'rgba(209, 250, 229, 0.75)',
      front: '#faf9f5'
    },
    'meadow-to-cream': {
      back: 'rgba(254, 243, 199, 0.45)',
      mid: 'rgba(254, 249, 195, 0.7)',
      front: '#faf9f5'
    },
    'meadow-to-amber': {
      back: 'rgba(209, 250, 229, 0.55)',
      mid: 'rgba(254, 243, 199, 0.75)',
      front: '#faf9f5'
    },
    'cream-to-amber': {
      back: 'rgba(254, 243, 199, 0.55)',
      mid: 'rgba(253, 230, 138, 0.75)',
      front: '#fffdf7'
    },
    'amber-to-cream': {
      back: 'rgba(254, 240, 138, 0.5)',
      mid: 'rgba(254, 249, 195, 0.75)',
      front: '#faf9f5'
    },
    'dark-to-cream': {
      back: 'rgba(15, 23, 42, 0.45)',
      mid: 'rgba(15, 23, 42, 0.85)',
      front: '#faf9f5'
    },
    'cream-to-dark': {
      back: 'rgba(30, 41, 59, 0.4)',
      mid: 'rgba(15, 23, 42, 0.75)',
      front: '#090d16'
    }
  }[variant];

  const isFlipped = position === 'top';

  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none pointer-events-none select-none z-10 ${
        isFlipped ? '-mb-[1px]' : '-mt-[1px]'
      } ${className}`}
      style={{ height }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`w-full h-full block ${isFlipped ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1: Distant soft rolling hill */}
        <path
          d="M0,32 C220,72 440,12 720,48 C1000,84 1220,24 1440,54 L1440,120 L0,120 Z"
          fill={colors.back}
        />
        {/* Layer 2: Mid-ground organic wave with subtle curvature */}
        <path
          d="M0,64 C180,24 460,82 780,42 C1080,8 1280,68 1440,46 L1440,120 L0,120 Z"
          fill={colors.mid}
        />
        {/* Layer 3: Foreground crisp ground horizon */}
        <path
          d="M0,78 C260,102 520,54 820,86 C1120,114 1320,68 1440,82 L1440,120 L0,120 Z"
          fill={colors.front}
        />
      </svg>
    </div>
  );
};

export default SectionWaveDivider;
