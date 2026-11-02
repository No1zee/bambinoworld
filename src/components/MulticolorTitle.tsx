import React, { useState, useEffect } from 'react';
import { soundscape } from '../utils/soundscape';

interface MulticolorTitleProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  className?: string;
  bounceOnMount?: boolean;
  playMarimbaOnHover?: boolean;
}

// Joyful, high-contrast, kid-friendly palette
const FESTIVAL_COLORS = [
  '#C85A32', // Terracotta Clay
  '#D97706', // Warm Amber Honey
  '#2D5A43', // Deep Eucalyptus Leaf
  '#E06D3B', // Sunlit Apricot
  '#5B4E77', // Soft Jacaranda
  '#237A72', // Shaded Farm Jade
  '#B45309', // Warm Ochre
  '#C2410C'  // Harare Rust
];

export const MulticolorTitle: React.FC<MulticolorTitleProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  bounceOnMount = true,
  playMarimbaOnHover = true
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [, setHasInteracted] = useState(false);

  // Trigger playful bounce at first interaction or initial mount
  useEffect(() => {
    if (bounceOnMount) {
      const timer = setTimeout(() => {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 850);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [bounceOnMount]);

  const handleInteraction = () => {
    if (isBouncing) return;
    setIsBouncing(true);
    setHasInteracted(true);
    if (playMarimbaOnHover) {
      soundscape.playCtaHover();
    }
    setTimeout(() => {
      setIsBouncing(false);
    }, 800);
  };

  // Split text into words for natural wrap without whitespace-nowrap clipping
  const words = text.split(' ');
  let letterCounter = 0;

  return (
    <Component
      aria-label={text}
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      className={`inline-block select-none cursor-pointer max-w-full break-words leading-tight [overflow-wrap:break-word] ${className}`}
    >
      {words.map((word, wordIdx) => {
        return (
          <span
            key={wordIdx}
            className="inline-block max-w-full mr-[0.22em] last:mr-0 [overflow-wrap:break-word]"
          >
            {Array.from(word).map((char, charIdx) => {
              const color = FESTIVAL_COLORS[letterCounter % FESTIVAL_COLORS.length];
              const delay = `${(letterCounter * 0.035).toFixed(3)}s`;
              letterCounter++;

              return (
                <span
                  key={charIdx}
                  className={`bouncing-letter ${isBouncing ? 'is-bouncing' : ''}`}
                  style={{
                    color,
                    animationDelay: delay,
                    textShadow: '0 1px 2px rgba(26, 35, 30, 0.12)'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
};

export default MulticolorTitle;
